import { getConfig } from '../src/functions-lib.js';
function esc(v){return String(v??'').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}
function abs(v,origin){if(!v)return '';try{return new URL(v,origin).toString()}catch{return ''}}
export async function onRequest(context){
  const asset=await context.next();const type=asset.headers.get('content-type')||'';if(!type.includes('text/html'))return asset;
  const url=new URL(context.request.url);let config={};try{config=await getConfig(context.env)}catch{}
  const isAdmin=url.pathname.startsWith('/admin');let html=await asset.text();const headers=new Headers(asset.headers);headers.set('x-content-type-options','nosniff');headers.set('referrer-policy','strict-origin-when-cross-origin');headers.set('x-frame-options','DENY');headers.set('permissions-policy','camera=(), microphone=(), geolocation=()');headers.delete('content-length');
  if(isAdmin){headers.set('cache-control','no-store');headers.set('x-robots-tag','noindex,nofollow');return new Response(html,{status:asset.status,headers})}
  const origin=String(context.env.PUBLIC_ORIGIN||url.origin).replace(/\/$/,'');const canonical=`${origin}/`;const title=config.seo?.title||'Macabra — Halloween GTRZ';const desc=config.seo?.description||'';const shareTitle=config.seo?.shareTitle||title;const shareDesc=config.seo?.shareDescription||desc;const image=abs(config.branding?.shareImage||config.branding?.poster,origin);
  html=html.replace(/<title>[\s\S]*?<\/title>/i,`<title>${esc(title)}</title>`);
  const tags=[`<meta name="description" content="${esc(desc)}">`,`<meta name="robots" content="index,follow,max-image-preview:large">`,`<link rel="canonical" href="${esc(canonical)}">`,`<meta property="og:type" content="website">`,`<meta property="og:title" content="${esc(shareTitle)}">`,`<meta property="og:description" content="${esc(shareDesc)}">`,`<meta property="og:url" content="${esc(canonical)}">`,`<meta name="twitter:card" content="${image?'summary_large_image':'summary'}">`,`<meta name="twitter:title" content="${esc(shareTitle)}">`,`<meta name="twitter:description" content="${esc(shareDesc)}">`];if(image)tags.push(`<meta property="og:image" content="${esc(image)}">`,`<meta name="twitter:image" content="${esc(image)}">`);
  html=html.replace('</head>',`${tags.join('\n')}\n</head>`);headers.set('cache-control','no-cache');return new Response(html,{status:asset.status,headers});
}
