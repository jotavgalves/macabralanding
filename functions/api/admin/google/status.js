import { json } from '../../../../src/functions-lib.js';
import { driveConnected } from '../../../../src/google-drive.js';
import { verifyAdmin } from '../../../../src/security.js';
export async function onRequestGet({request,env}){if(!(await verifyAdmin(request,env)))return json({ok:false,error:'Não autorizado'},401);return json({ok:true,connected:await driveConnected(env),configured:Boolean(env.GOOGLE_DRIVE_CLIENT_ID&&env.GOOGLE_DRIVE_CLIENT_SECRET&&env.GOOGLE_DRIVE_FOLDER_ID)})}
