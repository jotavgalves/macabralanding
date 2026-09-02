const enc = new TextEncoder();
const SESSION_TTL = 12 * 60 * 60;
const MAX_FAILURES = 5;
const LOCK_SECONDS = 15 * 60;

function b64url(bytes) { let s=''; for (const b of bytes) s += String.fromCharCode(b); return btoa(s).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/g,''); }
function cookies(request) { const h=request.headers.get('cookie')||''; return Object.fromEntries(h.split(';').map(v=>v.trim()).filter(Boolean).map(v=>{const i=v.indexOf('='); return i<0?[v,'']:[v.slice(0,i),decodeURIComponent(v.slice(i+1))];})); }
async function hmac(secret, value) { const key=await crypto.subtle.importKey('raw',enc.encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign']); return b64url(new Uint8Array(await crypto.subtle.sign('HMAC',key,enc.encode(value)))); }
function now(){ return Math.floor(Date.now()/1000); }

export function safePasswordEqual(a,b){ a=String(a||''); b=String(b||''); const len=Math.max(a.length,b.length); let diff=a.length^b.length; for(let i=0;i<len;i++) diff|=(a.charCodeAt(i)||0)^(b.charCodeAt(i)||0); return diff===0; }

export async function makeSession(env){
  if(!env.SESSION_SECRET) throw new Error('SESSION_SECRET não configurado');
  const payload=b64url(enc.encode(JSON.stringify({exp:now()+SESSION_TTL,nonce:crypto.randomUUID()})));
  return `${payload}.${await hmac(env.SESSION_SECRET,payload)}`;
}
export function sessionCookie(request, token, maxAge=SESSION_TTL){ const secure=new URL(request.url).protocol==='https:'?'; Secure':''; return `mac_admin=${encodeURIComponent(token)}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${Math.max(0,maxAge)}${secure}; Priority=High`; }
export async function verifyAdmin(request,env){
  if(!env.SESSION_SECRET) return false;
  const token=cookies(request).mac_admin;
  if(!token||!token.includes('.')) return false;
  try{
    const [payload,sig]=token.split('.');
    const expected=await hmac(env.SESSION_SECRET,payload);
    if(sig.length!==expected.length) return false;
    let d=0; for(let i=0;i<sig.length;i++) d|=sig.charCodeAt(i)^expected.charCodeAt(i); if(d) return false;
    const pad='='.repeat((4-payload.length%4)%4); const raw=atob(payload.replace(/-/g,'+').replace(/_/g,'/')+pad);
    const data=JSON.parse(new TextDecoder().decode(Uint8Array.from(raw,c=>c.charCodeAt(0))));
    return Number(data.exp)>now();
  }catch{return false;}
}

async function ensureLoginSchema(env){
  if(!env.DB) throw new Error('D1 binding DB não configurado');
  await env.DB.prepare(`CREATE TABLE IF NOT EXISTS macabra_login_attempts (ip_hash TEXT PRIMARY KEY, failures INTEGER NOT NULL DEFAULT 0, locked_until INTEGER)`).run();
}
async function ipHash(request,env){ const ip=request.headers.get('CF-Connecting-IP')||(request.headers.get('X-Forwarded-For')||'').split(',')[0].trim()||'unknown'; return hmac(env.SESSION_SECRET,`ip:${ip}`); }
export async function loginGuard(request,env){
  if(!env.DB) return {allowed:true,remaining:MAX_FAILURES};
  await ensureLoginSchema(env); const key=await ipHash(request,env); const row=await env.DB.prepare('SELECT failures,locked_until FROM macabra_login_attempts WHERE ip_hash=?').bind(key).first();
  if(Number(row?.locked_until||0)>now()) return {allowed:false,retryAfter:Number(row.locked_until)-now(),remaining:0};
  return {allowed:true,remaining:Math.max(0,MAX_FAILURES-Number(row?.failures||0)),key};
}
export async function recordLoginFailure(request,env){
  await ensureLoginSchema(env); const key=await ipHash(request,env); const row=await env.DB.prepare('SELECT failures FROM macabra_login_attempts WHERE ip_hash=?').bind(key).first(); const failures=Number(row?.failures||0)+1; const locked=failures>=MAX_FAILURES; const until=locked?now()+LOCK_SECONDS:null;
  await env.DB.prepare(`INSERT INTO macabra_login_attempts(ip_hash,failures,locked_until) VALUES(?,?,?) ON CONFLICT(ip_hash) DO UPDATE SET failures=excluded.failures,locked_until=excluded.locked_until`).bind(key,failures,until).run();
  return {locked,retryAfter:locked?LOCK_SECONDS:0,remaining:Math.max(0,MAX_FAILURES-failures)};
}
export async function clearLoginFailures(request,env){ if(!env.DB)return; await ensureLoginSchema(env); const key=await ipHash(request,env); await env.DB.prepare('DELETE FROM macabra_login_attempts WHERE ip_hash=?').bind(key).run(); }

async function ensureMediaSchema(env){
  if(!env.DB) throw new Error('D1 binding DB não configurado');
  await env.DB.prepare(`CREATE TABLE IF NOT EXISTS macabra_media_assets (public_id TEXT PRIMARY KEY, drive_file_id TEXT NOT NULL UNIQUE, created_at INTEGER NOT NULL)`).run();
}
export async function createMediaPublicId(env,driveFileId){
  await ensureMediaSchema(env); const id=String(driveFileId||'').trim(); if(!id) throw new Error('ID de mídia inválido');
  const old=await env.DB.prepare('SELECT public_id FROM macabra_media_assets WHERE drive_file_id=?').bind(id).first(); if(old?.public_id) return old.public_id;
  const publicId=b64url(crypto.getRandomValues(new Uint8Array(24))); await env.DB.prepare('INSERT INTO macabra_media_assets(public_id,drive_file_id,created_at) VALUES(?,?,?)').bind(publicId,id,now()).run(); return publicId;
}
export async function resolveMediaPublicId(env,publicId){ await ensureMediaSchema(env); const row=await env.DB.prepare('SELECT drive_file_id FROM macabra_media_assets WHERE public_id=?').bind(String(publicId||'')).first(); return row?.drive_file_id||''; }
