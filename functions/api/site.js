import { getConfig, json } from '../../src/functions-lib.js';
export async function onRequestGet({env}){
  try{return json({ok:true,config:await getConfig(env)},200,{'cache-control':'public, max-age=10, s-maxage=20'})}
  catch(error){return json({ok:false,error:String(error?.message||error)},503)}
}
