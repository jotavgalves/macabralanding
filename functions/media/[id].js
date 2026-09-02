import { fetchDriveFile } from '../../src/google-drive.js';
import { resolveMediaPublicId } from '../../src/security.js';
export async function onRequestGet({params,env}){
  const driveId=await resolveMediaPublicId(env,params.id);
  if(!driveId)return new Response('Not found',{status:404});
  const upstream=await fetchDriveFile(env,driveId);
  if(!upstream.ok)return new Response('Media unavailable',{status:upstream.status});
  const headers=new Headers();
  headers.set('content-type',upstream.headers.get('content-type')||'application/octet-stream');
  headers.set('cache-control','public, max-age=86400, s-maxage=86400, immutable');
  headers.set('x-content-type-options','nosniff');
  return new Response(upstream.body,{status:200,headers});
}
