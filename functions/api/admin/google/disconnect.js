import { json } from '../../../../src/functions-lib.js';
import { disconnectDrive } from '../../../../src/google-drive.js';
import { verifyAdmin } from '../../../../src/security.js';
export async function onRequestPost({request,env}){if(!(await verifyAdmin(request,env)))return json({ok:false,error:'Não autorizado'},401);await disconnectDrive(env);return json({ok:true})}
