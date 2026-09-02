(() => {
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  const txt = (el,v) => { if (el && v != null && v !== '') el.textContent = String(v); };
  const money = n => `R$ ${Number(n||0).toLocaleString('pt-BR',{minimumFractionDigits:0,maximumFractionDigits:2})}`;
  const lang = () => document.documentElement.dataset.lang || 'pt';
  const local = v => v && typeof v === 'object' ? (v[lang()] || v.pt || v.es || '') : (v || '');
  let config;

  function applyBranding(){
    const b=config?.branding||{}; const r=document.documentElement;
    const map=[['--bg',b.background],['--paper',b.paper],['--gold',b.primary],['--orange',b.primary],['--purple',b.secondary],['--white',b.text]];
    map.forEach(([k,v])=>{if(v)r.style.setProperty(k,v)});
    const hero=$('#heroPosterImage'), mini=$('#posterMiniImage');
    if(b.poster){ if(hero)hero.src=b.poster; if(mini)mini.src=b.poster; }
    else if(hero&&mini&&!mini.src) mini.src=hero.src;
  }

  function applyEvent(){
    const e=config?.event||{};
    const meta=$$('.hero-meta strong');
    txt(meta[0],e.dateLabel ? `${e.dateLabel}${/sábado/i.test(e.dateLabel)?'':' · SÁBADO'}` : null);
    txt(meta[1],e.timeLabel); txt(meta[2],[e.venue,e.city].filter(Boolean).join(' · '));
    const rows=$$('.info-row strong');
    txt(rows[0],e.dateLabel ? `${e.dateLabel} DE 2026 · SÁBADO` : null); txt(rows[1],e.timeLabel); txt(rows[2],[e.venue,e.city].filter(Boolean).join(' · '));
    const eyebrow=$('.hero .eyebrow'); if(eyebrow && e.city) txt(eyebrow,`31 de outubro · ${e.city}`);
  }

  function applyGenres(){
    const host=$('.genres'); const arr=Array.isArray(config?.genres)?config.genres:[]; if(!host||!arr.length)return;
    host.innerHTML=arr.map((g,i)=>`<span class="genre ${i===0?'hot':i===1?'gold-chip':''}">${String(g)}</span>`).join('');
  }

  function applyTicket(){
    const tickets=(config?.tickets||[]).filter(t=>t.status!=='hidden');
    const t=tickets.find(x=>x.featured)||tickets[0]; if(!t)return;
    txt($('.price'),money(t.price));
    const title=$('.tickets h2'); if(title && t.name){const parts=String(t.name).trim().split(/\s+/); title.innerHTML=parts.length>1?`${parts.slice(0,-1).join(' ')}<br><span>${parts.at(-1)}.</span>`:`<span>${parts[0]}.</span>`;}
    const p=$('.ticket-side p'); txt(p,local(t.description));
    const buy=$('#buyButton'); if(buy){
      if(t.status==='soldout'){buy.textContent='Esgotado';buy.removeAttribute('href');buy.style.pointerEvents='none';buy.style.opacity='.55';}
      else if(t.status==='comingsoon'){buy.textContent='Em breve';buy.removeAttribute('href');buy.style.pointerEvents='none';buy.style.opacity='.55';}
      else {
        let href='';
        if(t.checkoutEnabled&&t.checkoutUrl) href=t.checkoutUrl;
        else if(t.whatsappEnabled&&config?.links?.whatsapp){const base=String(config.links.whatsapp); const num=base.startsWith('http')?base:`https://wa.me/${base.replace(/\D/g,'')}`; try{const u=new URL(num);u.searchParams.set('text',`Olá! Quero comprar ${t.name} para a ${config.event?.name||'Macabra'}. Valor: ${money(t.price)}.`);href=u.toString()}catch{}}
        buy.href=href||'#'; buy.textContent='Comprar ingresso'; buy.style.pointerEvents=''; buy.style.opacity='';
      }
      const top=$('.top-buy'); if(top) top.textContent=`Lote · ${money(t.price)}`;
      const mobile=$('.mobile-buy'); if(mobile) mobile.textContent=`${t.name||'Ingresso'} · ${money(t.price)}`;
    }
  }

  function applyCopy(){
    const c=config?.copy?.[lang()]||config?.copy?.pt||{};
    const map={heroCopy:'heroCopy',manifestoKicker:'manifestoKicker',soundKicker:'soundKicker',soundCopy:'soundCopy',finalTitle:'finalTitle',finalCopy:'finalCopy'};
    for(const [key,data] of Object.entries(map)){const el=$(`[data-t="${data}"]`);if(el&&c[key]) el.innerHTML=c[key];}
  }

  function applyAll(){applyBranding();applyEvent();applyGenres();applyTicket();applyCopy();}
  async function load(){try{const r=await fetch('/api/site',{cache:'no-store'});const d=await r.json();if(d?.ok){config=d.config;applyAll();}}catch(e){console.warn('Macabra CMS indisponível; usando conteúdo incorporado.',e)}}
  document.addEventListener('click',e=>{if(e.target.closest('[data-lang-btn]'))setTimeout(()=>{if(config)applyAll()},0)});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',load,{once:true});else load();
})();
