import { json } from '../../../src/functions-lib.js';
import { clearLoginFailures, loginGuard, makeSession, recordLoginFailure, safePasswordEqual, sessionCookie } from '../../../src/security.js';
export async function onRequestPost({request,env}){
  if(!env.ADMIN_PASSWORD||!env.SESSION_SECRET) return json({ok:false,error:'Configure ADMIN_PASSWORD e SESSION_SECRET no Cloudflare.'},503);
  const guard=await loginGuard(request,env).catch(()=>({allowed:true,remaining:5}));
  if(!guard.allowed) return json({ok:false,locked:true,retryAfter:guard.retryAfter,error:'Muitas tentativas. Aguarde antes de tentar novamente.'},429,{'retry-after':String(guard.retryAfter||60)});
  let body;try{body=await request.json()}catch{return json({ok:false,error:'JSON inválido'},400)}
  if(!safePasswordEqual(body?.password,env.ADMIN_PASSWORD)){
    const failure=await recordLoginFailure(request,env).catch(()=>({locked:false,remaining:0}));
    return json({ok:false,locked:failure.locked,retryAfter:failure.retryAfter,remaining:failure.remaining,error:failure.locked?'Login temporariamente bloqueado.':'Senha inválida.'},failure.locked?429:401);
  }
  await clearLoginFailures(request,env).catch(()=>{});
  const token=await makeSession(env);
  return json({ok:true},200,{'set-cookie':sessionCookie(request,token)});
}
