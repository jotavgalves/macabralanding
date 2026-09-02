(() => {
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  let config = null;
  let lang = localStorage.getItem('macabra_lang') || 'pt';

  const esc = v => String(v ?? '');
  const money = v => new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL',minimumFractionDigits:0,maximumFractionDigits:2}).format(Number(v)||0);
  const copy = key => config?.copy?.[lang]?.[key] ?? config?.copy?.pt?.[key] ?? '';
  const localText = obj => obj?.[lang] ?? obj?.pt ?? '';

  function setText(id, value){ const el=$(id); if(el) el.textContent=esc(value); }
  function applyBrand(){
    const b=config.branding||{};
    const root=document.documentElement;
    [['--bg',b.background],['--paper',b.paper],['--orange',b.primary],['--purple',b.secondary],['--text',b.text]].forEach(([k,v])=>{if(v)root.style.setProperty(k,v)});
    const hero=$('#heroImage'); if(hero) hero.style.backgroundImage=b.heroImage?`url("${b.heroImage}")`:'none';
    const logo=$('#eventLogo'); if(logo){ if(b.logo){logo.src=b.logo;logo.hidden=false;$('#eventWord').hidden=true}else{logo.hidden=true;$('#eventWord').hidden=false} }
    const poster=$('#posterImage'); const fallback=$('#posterFallback'); if(poster){ if(b.poster){poster.src=b.poster;poster.hidden=false;fallback.hidden=true}else{poster.hidden=true;fallback.hidden=false} }
  }

  function applyCore(){
    const e=config.event||{};
    setText('#heroEyebrow',e.eyebrow);
    setText('#heroTitle',copy('heroTitle')); setText('#heroCopy',copy('heroCopy')); setText('#heroCta',copy('heroCta'));
    setText('#metaDate',e.dateLabel); setText('#metaTime',e.timeLabel); setText('#metaVenue',e.venue);
    setText('#manifestoKicker',copy('manifestoKicker')); setText('#manifestoTitle',copy('manifestoTitle')); setText('#manifestoCopy',copy('manifestoCopy'));
    setText('#soundKicker',copy('soundKicker')); setText('#soundTitle',copy('soundTitle')); setText('#soundCopy',copy('soundCopy'));
    setText('#djsKicker',copy('djsKicker')); setText('#djsTitle',copy('djsTitle')); setText('#djsIntro',copy('djsIntro')); setText('#djEmpty',copy('djsEmpty'));
    setText('#ticketsKicker',copy('ticketsKicker')); setText('#ticketsTitle',copy('ticketsTitle'));
    setText('#venueKicker',copy('venueKicker')); setText('#venueTitle',copy('venueTitle')); setText('#venueCopy',copy('venueCopy')); setText('#venueName',e.venue); setText('#venueAddress',e.address); setText('#mapLink',copy('openMap'));
    setText('#faqKicker',copy('faqKicker')); setText('#faqTitle',copy('faqTitle'));
    setText('#finalKicker',copy('finalKicker')); setText('#finalTitle',copy('finalTitle')); setText('#finalCopy',copy('finalCopy'));
    $$('[data-copy]').forEach(el=>{const k=el.dataset.copy;if(copy(k))el.textContent=copy(k)});
    $$('.lang-switch button').forEach(btn=>btn.classList.toggle('active',btn.dataset.lang===lang));
    const mapLink=$('#mapLink'); if(mapLink){mapLink.href=e.mapLink||`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(e.address||e.venue||'')}`}
    const frame=$('#mapFrame'); const box=$('#mapBox'); if(frame&&box){const src=e.mapEmbedUrl||((e.address||e.venue)?`https://www.google.com/maps?q=${encodeURIComponent(e.address||e.venue)}&output=embed`:null);if(src){frame.src=src;box.hidden=false}else box.hidden=true}
    const insta=$('#instagramLink'); if(insta){insta.href=config.links?.instagram||'#';insta.hidden=!config.links?.instagram}
  }

  function renderTicker(){
    const e=config.event||{}; const items=[e.name,e.city,e.dateLabel,e.timeLabel,e.venue,'GTRZ EVENTOS','HALLOWEEN','LATINIDAD'].filter(Boolean);
    const list=[...items,...items]; $('#tickerTrack').innerHTML=list.map(x=>`<span>${esc(x)}</span>`).join('');
  }

  function renderGenres(){
    const genres=Array.isArray(config.genres)?config.genres:[];
    $('#genres').innerHTML=genres.map(g=>`<span class="genre">${esc(g)}</span>`).join('');
  }

  function renderDjs(){
    const all=(Array.isArray(config.djs)?config.djs:[]).filter(d=>d.active!==false);
    $('#djEmpty').hidden=all.length>0;
    $('#djGrid').innerHTML=all.map((d,i)=>{
      const photo=d.photo?`<img src="${esc(d.photo)}" alt="${esc(d.name)}" style="object-position:${esc(d.photoPosition||'50% 50%')}" loading="lazy">`:'';
      const social=d.instagram?`<a class="dj-social" href="${esc(d.instagram)}" target="_blank" rel="noopener">Instagram ↗</a>`:'';
      return `<article class="dj-card reveal"><div class="dj-media">${photo}</div><div class="dj-info"><div class="dj-origin">${esc(d.origin||'MACABRA')}</div><h3 class="dj-name">${esc(d.name||`DJ ${i+1}`)}</h3><p>${esc(localText(d.bio))}</p>${social}</div></article>`;
    }).join('');
  }

  function waUrl(ticket){
    const base=String(config.links?.whatsapp||'').trim(); if(!base)return '';
    const e=config.event||{}; const msg=lang==='es'?`Hola! Quiero comprar ${ticket.name} para ${e.name}. Valor: ${money(ticket.price)}. ¿Puedes ayudarme?`:`Olá! Quero comprar ${ticket.name} para a ${e.name}. Valor: ${money(ticket.price)}. Pode me ajudar?`;
    try{const u=new URL(base.startsWith('http')?base:`https://wa.me/${base.replace(/\D/g,'')}`);u.searchParams.set('text',msg);return u.toString()}catch{return ''}
  }

  function renderTickets(){
    const tickets=(Array.isArray(config.tickets)?config.tickets:[]).filter(t=>t.status!=='hidden');
    $('#ticketGrid').innerHTML=tickets.map(t=>{
      const status=t.status||'active'; const active=status==='active'; const actions=[];
      if(active&&t.whatsappEnabled&&waUrl(t))actions.push(`<a class="btn hot" target="_blank" rel="noopener" href="${waUrl(t)}">${esc(copy('buyWhatsapp'))}</a>`);
      if(active&&t.checkoutEnabled&&t.checkoutUrl)actions.push(`<a class="btn ghost" target="_blank" rel="noopener" href="${esc(t.checkoutUrl)}">${esc(copy('buyCheckout'))}</a>`);
      if(!active)actions.push(`<div class="ticket-state">${esc(copy(status==='soldout'?'soldOut':'comingSoon'))}</div>`);
      return `<article class="ticket-card ${t.featured?'featured':''} reveal"><div class="ticket-badge">${esc(t.badge||'MACABRA')}</div><h3 class="ticket-name">${esc(t.name)}</h3><div class="ticket-price"><sup>R$</sup>${Number(t.price||0).toLocaleString('pt-BR',{minimumFractionDigits:0,maximumFractionDigits:2})}</div><div class="ticket-desc">${esc(localText(t.description))}</div><div class="ticket-actions">${actions.join('')}</div></article>`;
    }).join('');
    const featured=tickets.find(t=>t.status==='active'&&t.featured)||tickets.find(t=>t.status==='active');
    if(featured){setText('#mobileTicketName',featured.name);setText('#mobileTicketPrice',money(featured.price));$('#mobileBuy').hidden=false}else $('#mobileBuy').hidden=true;
  }

  function renderFaq(){
    const items=(Array.isArray(config.faq)?config.faq:[]).filter(x=>x.active!==false);
    $('#faqList').innerHTML=items.map((item,i)=>`<details ${i===0?'open':''}><summary>${esc(localText(item.question))}</summary><p>${esc(localText(item.answer))}</p></details>`).join('');
  }

  function applySections(){
    const list=Array.isArray(config.sections)?config.sections:[];
    const main=$('main'); const ticker=$('.ticker');
    list.forEach((item,index)=>{
      const el=$(`[data-section="${CSS.escape(item.id)}"]`);
      if(el){el.hidden=item.active===false;el.style.order=String(index)}
      if(item.id==='hero'&&ticker)ticker.hidden=item.active===false;
    });
    if(main)main.style.display='flex',main.style.flexDirection='column';
  }

  let clockTimer;
  function startClock(){
    clearInterval(clockTimer); const target=Date.parse(config.event?.date||''); const host=$('#clock'); if(!host||!Number.isFinite(target)){if(host)host.hidden=true;return} host.hidden=false;
    const tick=()=>{let diff=Math.max(0,target-Date.now());const d=Math.floor(diff/86400000);diff%=86400000;const h=Math.floor(diff/3600000);diff%=3600000;const m=Math.floor(diff/60000);const s=Math.floor((diff%60000)/1000);host.innerHTML=[[d,copy('days')],[h,copy('hours')],[m,copy('minutes')],[s,copy('seconds')]].map(([n,l])=>`<div><strong>${String(n).padStart(2,'0')}</strong><small>${esc(l)}</small></div>`).join('')};tick();clockTimer=setInterval(tick,1000);
  }

  function reveal(){
    const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.08});$$('.reveal').forEach(el=>io.observe(el));
  }

  function render(){ applyBrand();applyCore();renderTicker();renderGenres();renderDjs();renderTickets();renderFaq();applySections();startClock();reveal(); }

  async function load(){
    try{const r=await fetch('/api/site',{cache:'no-store'});const d=await r.json();if(!d.ok)throw new Error(d.error||'Falha');config=d.config;render()}catch(error){console.error('Macabra CMS:',error)}
  }

  document.addEventListener('click',e=>{const btn=e.target.closest('[data-lang]');if(!btn||!config)return;lang=btn.dataset.lang;localStorage.setItem('macabra_lang',lang);document.documentElement.dataset.lang=lang;render()});
  window.addEventListener('scroll',()=>{const max=document.documentElement.scrollHeight-innerHeight;const p=max>0?scrollY/max:0;$('#scrollProgress').style.transform=`scaleX(${Math.min(1,Math.max(0,p))})`},{passive:true});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',load,{once:true});else load();
})();
