import { json } from '../../../src/functions-lib.js';
import { sessionCookie } from '../../../src/security.js';
export async function onRequestPost({request}){return json({ok:true},200,{'set-cookie':sessionCookie(request,'',0)})}
