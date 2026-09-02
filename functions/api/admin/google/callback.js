import { driveRedirectUri, saveDriveRefreshToken, verifyDriveState } from '../../../../src/google-drive.js';
export async function onRequestGet({request,env}){
  const url=new URL(request.url);const code=url.searchParams.get('code');const state=url.searchParams.get('state');
  if(!code||!(await verifyDriveState(env,request,state)))return new Response('OAuth inválido ou expirado.',{status:400});
  const body=new URLSearchParams({client_id:env.GOOGLE_DRIVE_CLIENT_ID||'',client_secret:env.GOOGLE_DRIVE_CLIENT_SECRET||'',code,grant_type:'authorization_code',redirect_uri:driveRedirectUri(request)});
  const r=await fetch('https://oauth2.googleapis.com/token',{method:'POST',headers:{'content-type':'application/x-www-form-urlencoded'},body});const d=await r.json().catch(()=>({}));
  if(!r.ok||!d.refresh_token)return new Response(d.error_description||'Google não retornou refresh token. Tente conectar novamente.',{status:400});
  await saveDriveRefreshToken(env,d.refresh_token);
  return Response.redirect(new URL('/admin/?drive=connected',request.url).toString(),302);
}
