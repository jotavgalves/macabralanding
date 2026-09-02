import { json } from '../../../src/functions-lib.js';
import { uploadDriveFile } from '../../../src/google-drive.js';
import { createMediaPublicId, verifyAdmin } from '../../../src/security.js';
const ALLOWED=new Map([['image/jpeg','jpg'],['image/png','png'],['image/webp','webp']]);
async function valid(file){const b=new Uint8Array(await file.slice(0,16).arrayBuffer());if(file.type==='image/jpeg')return b[0]===255&&b[1]===216&&b[2]===255;if(file.type==='image/png')return b[0]===137&&b[1]===80&&b[2]===78&&b[3]===71;if(file.type==='image/webp'){const s=String.fromCharCode(...b.slice(0,12));return s.startsWith('RIFF')&&s.slice(8,12)==='WEBP'}return false}
export async function onRequestPost({request,env}){
  if(!(await verifyAdmin(request,env)))return json({ok:false,error:'Não autorizado'},401);
  const form=await request.formData();const file=form.get('file');const slot=String(form.get('slot')||'upload').replace(/[^a-z0-9_-]/gi,'-').toLowerCase();
  if(!(file instanceof File))return json({ok:false,error:'Arquivo não enviado'},400);
  if(!ALLOWED.has(file.type))return json({ok:false,error:'Envie JPEG, PNG ou WebP.'},400);
  if(file.size>10*1024*1024)return json({ok:false,error:'Imagem maior que 10 MB'},413);
  if(!(await valid(file)))return json({ok:false,error:'Arquivo de imagem inválido.'},400);
  try{const name=`${slot}-${Date.now()}-${crypto.randomUUID()}.${ALLOWED.get(file.type)}`;const uploaded=await uploadDriveFile(env,file,name);const id=await createMediaPublicId(env,uploaded.id);return json({ok:true,url:`/media/${id}`})}
  catch(error){return json({ok:false,error:error?.message||'Falha no upload'},503)}
}
