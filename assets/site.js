(() => {
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  let config = null;
  let lang = localStorage.getItem('macabra-lang') || localStorage.getItem('macabra_lang') || 'pt';
  let clockTimer = null;

  const FALLBACK = {
    pt: {
      navEvent:'O evento', navSound:'Música', navDjs:'DJs', navVenue:'Local', navBuy:'Lote · R$ 40',
      heroEyebrow:'31 de outubro · Recife', heroSub:'O Halloween da GTRZ',
      heroCopy:'A noite mais sombria da GTRZ encontra a energia da pista latina. Halloween, reggaeton, dembow, perreo, funk e uma madrugada feita para Recife.',
      dateLabel:'Data', timeLabel:'Horário', venueLabel:'Local', heroBuy:'Garantir por R$ 40', heroMore:'Conhecer a Macabra',
      manifestoKicker:'Recife, prepara-te', manifestoTitle:'UMA NOITE<br>PARA VIVER<br><span class="accent">O ESCURO.</span>',
      manifestoP1:'<strong>Macabra é o Halloween da GTRZ.</strong> Uma festa criada para cruzar o universo sombrio de 31 de outubro com a energia que já move a nossa pista.',
      manifestoP2:'Parte da essência latina permanece: reggaeton, dembow e perreo dividem a noite com funk e outros sons feitos para manter a pista em movimento.',
      soundKicker:'Som da noite', soundTitle:'LATINA.<br>QUENTE.<br><span>SOMBRIA.</span>',
      soundCopy:'A Macabra conversa com quem vive a La Rumba, mas tem identidade própria. A pista mistura ritmos latinos e brasileiros dentro do universo de Halloween.',
      soundNote:'Do perreo ao funk — sem perder a atmosfera Macabra.',
      expTitle:'A EXPERIÊNCIA<br><span class="gold">MACABRA.</span>',
      expIntro:'A comunicação é escura. A energia é de pista. E a noite nasce como um novo universo da GTRZ, sem deixar de conversar com o público que já viveu a La Rumba.',
      exp1Title:'Halloween adulto', exp1Copy:'Uma identidade visual sombria, intensa e pensada para uma noite de 31 de outubro que não pareça uma festa temática genérica.',
      exp2Title:'Essência latina', exp2Copy:'Reggaeton, dembow, perreo e referências latinas continuam presentes, agora dentro de um universo próprio.',
      exp3Title:'Pista GTRZ', exp3Copy:'Uma festa construída para quem quer chegar às 21h e viver a noite com música, intensidade e a assinatura da GTRZ.',
      djsKicker:'No comando', djsTitle:'QUEM VAI<br><span class="gold">CONDUZIR A NOITE.</span>', djsIntro:'O line-up da Macabra aparece aqui conforme for anunciado.', djsEmpty:'Line-up em breve.',
      infoEyebrow:'O encontro está marcado', infoTitle:'31 DE<br>OUTUBRO.<br><span class="gold">RECIFE.</span>',
      infoCopy:'A Macabra acontece no Biruta Bar. Uma nova festa da GTRZ para uma data que pede uma identidade própria.',
      posterStamp:'Arte oficial · Macabra 2026',
      ticketKicker:'Abertura de vendas', ticketTitle:'LOTE<br><span>PROMOCIONAL.</span>', ticketLabel:'Valor promocional',
      ticketCopy:'Garanta sua entrada no lote promocional da Macabra. O valor dos próximos lotes poderá ser diferente.',
      ticketButton:'Comprar ingresso', ticketFine:'31 de outubro · 21h · Biruta Bar · Recife',
      countKicker:'Contagem regressiva', countTitle:'ATÉ A<br>NOITE <span class="purple">MACABRA.</span>', countCopy:'31 de outubro de 2026, às 21h.',
      faqKicker:'Antes da noite', faqTitle:'DÚVIDAS<br><span class="gold">FREQUENTES.</span>',
      finalTitle:'RECIFE,<br>PREPARA-TE.', finalCopy:'31 de outubro · 21h · Biruta Bar. O Halloween da GTRZ começa aqui.', finalButton:'Garantir meu ingresso',
      mobileBuy:'Lote promocional · R$ 40', days:'Dias', hours:'Horas', minutes:'Min', seconds:'Seg',
      buyWhatsapp:'Comprar sem taxa', buyCheckout:'Comprar online', soldOut:'Esgotado', comingSoon:'Em breve'
    },
    es: {
      navEvent:'El evento', navSound:'Música', navDjs:'DJs', navVenue:'Lugar', navBuy:'Lote · R$ 40',
      heroEyebrow:'31 de octubre · Recife', heroSub:'El Halloween de GTRZ',
      heroCopy:'La noche más oscura de GTRZ se encuentra con la energía de la pista latina. Halloween, reggaeton, dembow, perreo, funk y una madrugada hecha para Recife.',
      dateLabel:'Fecha', timeLabel:'Hora', venueLabel:'Lugar', heroBuy:'Garantizar por R$ 40', heroMore:'Conocer Macabra',
      manifestoKicker:'Recife, prepárate', manifestoTitle:'UNA NOCHE<br>PARA VIVIR<br><span class="accent">LA OSCURIDAD.</span>',
      manifestoP1:'<strong>Macabra es el Halloween de GTRZ.</strong> Una fiesta creada para cruzar el universo oscuro del 31 de octubre con la energía que ya mueve nuestra pista.',
      manifestoP2:'Parte de la esencia latina permanece: reggaeton, dembow y perreo comparten la noche con funk y otros sonidos hechos para mantener la pista en movimiento.',
      soundKicker:'Sonido de la noche', soundTitle:'LATINA.<br>CALIENTE.<br><span>OSCURA.</span>',
      soundCopy:'Macabra conversa con quienes viven La Rumba, pero tiene identidad propia. La pista mezcla ritmos latinos y brasileños dentro del universo de Halloween.',
      soundNote:'Del perreo al funk — sin perder la atmósfera Macabra.',
      expTitle:'LA EXPERIENCIA<br><span class="gold">MACABRA.</span>',
      expIntro:'La comunicación es oscura. La energía es de pista. Y la noche nace como un nuevo universo de GTRZ, sin dejar de conversar con el público que ya vivió La Rumba.',
      exp1Title:'Halloween adulto', exp1Copy:'Una identidad visual oscura e intensa, pensada para una noche de 31 de octubre que no parezca una fiesta temática genérica.',
      exp2Title:'Esencia latina', exp2Copy:'Reggaeton, dembow, perreo y referencias latinas siguen presentes, ahora dentro de un universo propio.',
      exp3Title:'Pista GTRZ', exp3Copy:'Una fiesta construida para quienes quieren llegar a las 21h y vivir la noche con música, intensidad y la firma de GTRZ.',
      djsKicker:'En el control', djsTitle:'QUIÉN VA A<br><span class="gold">CONDUCIR LA NOCHE.</span>', djsIntro:'El line-up de Macabra aparecerá aquí a medida que sea anunciado.', djsEmpty:'Line-up próximamente.',
      infoEyebrow:'La cita está marcada', infoTitle:'31 DE<br>OCTUBRE.<br><span class="gold">RECIFE.</span>',
      infoCopy:'Macabra sucede en Biruta Bar. Una nueva fiesta de GTRZ para una fecha que pide una identidad propia.',
      posterStamp:'Arte oficial · Macabra 2026',
      ticketKicker:'Apertura de ventas', ticketTitle:'LOTE<br><span>PROMOCIONAL.</span>', ticketLabel:'Valor promocional',
      ticketCopy:'Garantiza tu entrada en el lote promocional de Macabra. El valor de los próximos lotes podrá ser diferente.',
      ticketButton:'Comprar entrada', ticketFine:'31 de octubre · 21h · Biruta Bar · Recife',
      countKicker:'Cuenta regresiva', countTitle:'HASTA LA<br>NOCHE <span class="purple">MACABRA.</span>', countCopy:'31 de octubre de 2026, a las 21h.',
      faqKicker:'Antes de la noche', faqTitle:'PREGUNTAS<br><span class="gold">FRECUENTES.</span>',
      finalTitle:'RECIFE,<br>PREPÁRATE.', finalCopy:'31 de octubre · 21h · Biruta Bar. El Halloween de GTRZ comienza aquí.', finalButton:'Garantizar mi entrada',
      mobileBuy:'Lote promocional · R$ 40', days:'Días', hours:'Horas', minutes:'Min', seconds:'Seg',
      buyWhatsapp:'Comprar sin tasa', buyCheckout:'Comprar online', soldOut:'Agotado', comingSoon:'Próximamente'
    }
  };

  const esc = v => String(v ?? '').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const money = v => new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL',minimumFractionDigits:0,maximumFractionDigits:2}).format(Number(v)||0);
  const localText = obj => obj?.[lang] ?? obj?.pt ?? '';
  const copy = key => config?.copy?.[lang]?.[key] ?? config?.copy?.pt?.[key] ?? FALLBACK[lang]?.[key] ?? FALLBACK.pt[key] ?? '';

  function setHTML(selector,value){const el=$(selector);if(el && value!==undefined && value!==null)el.innerHTML=String(value)}
  function setText(selector,value){const el=$(selector);if(el && value!==undefined && value!==null)el.textContent=String(value)}
  function firstActiveTicket(){
    const tickets=(config?.tickets||[]).filter(t=>t.status!=='hidden');
    return tickets.find(t=>t.status==='active'&&t.featured)||tickets.find(t=>t.status==='active')||tickets[0]||null;
  }

  function applyBrand(){
    const b=config?.branding||{};
    const root=document.documentElement;
    if(b.background) root.style.setProperty('--bg',b.background);
    if(b.paper) root.style.setProperty('--paper',b.paper);
    if(b.primary){root.style.setProperty('--gold',b.primary);root.style.setProperty('--orange',b.primary)}
    if(b.secondary) root.style.setProperty('--purple',b.secondary);
    if(b.text) root.style.setProperty('--white',b.text);

    const heroPoster=$('#heroPoster'), infoPoster=$('#infoPoster');
    const fallbackPoster=heroPoster?.getAttribute('src')||'';
    const poster=b.poster||fallbackPoster;
    if(heroPoster && poster) heroPoster.src=poster;
    if(infoPoster && poster) infoPoster.src=poster;

    const logo=$('#eventLogo'), word=$('#heroBrand');
    if(logo && word){
      if(b.logo){logo.src=b.logo;logo.hidden=false;word.hidden=true}
      else {logo.hidden=true;word.hidden=false}
    }
    if(b.heroImage){
      const hero=$('.hero');
      if(hero) hero.style.backgroundImage=`linear-gradient(90deg,rgba(16,9,11,.88),rgba(16,9,11,.34)),url("${String(b.heroImage).replace(/"/g,'%22')}")`;
      if(hero){hero.style.backgroundSize='cover';hero.style.backgroundPosition='center'}
    }
  }

  function applyCore(){
    const e=config?.event||{};
    const t=firstActiveTicket();

    setText('#heroEyebrow', e.dateLabel && e.city ? `${e.dateLabel} · ${e.city}` : copy('heroEyebrow'));
    setHTML('#heroSub', copy('heroSub'));
    setHTML('#heroCopy', copy('heroCopy'));
    setText('#heroDate', e.dateLabel || '31 OUT · SÁBADO');
    setText('#heroTime', e.timeLabel || '21H');
    setText('#heroVenue', [e.venue,e.city].filter(Boolean).join(' · ') || 'BIRUTA BAR · RECIFE');
    setText('#infoDate', e.dateLabel ? `${e.dateLabel}${String(e.dateLabel).includes('2026')?'':' DE 2026'} · SÁBADO` : '31 DE OUTUBRO DE 2026 · SÁBADO');
    setText('#infoTime', e.timeLabel || '21H');
    setText('#infoVenue', [e.venue,e.city].filter(Boolean).join(' · ') || 'BIRUTA BAR · RECIFE');

    $$('[data-t]').forEach(el=>{
      const key=el.dataset.t;
      let value=copy(key);
      if(key==='navEvent') value=copy('navExperience')||value;
      if(key==='heroBuy' && t) value=lang==='es'?`Comprar por ${money(t.price)}`:`Garantir por ${money(t.price)}`;
      if(key==='navBuy' && t) value=`${t.name||'Lote'} · ${money(t.price)}`;
      if(key==='mobileBuy' && t) value=`${t.name||'Lote'} · ${money(t.price)}`;
      if(value) el.innerHTML=value;
    });

    const instagram=$('#instagramLink');
    if(instagram){instagram.href=config?.links?.instagram||'#';instagram.hidden=!config?.links?.instagram}
  }

  function renderRunner(){
    const e=config?.event||{};
    const items=[e.name||'MACABRA','HALLOWEEN GTRZ',e.dateLabel||'31 OUTUBRO',e.timeLabel||'21H',e.venue||'BIRUTA BAR',e.city||'RECIFE',...(config?.genres||[])].filter(Boolean);
    const seg=items.map(x=>`<span>${esc(x)}</span>`).join('');
    const host=$('.runner-track'); if(host)host.innerHTML=`<div class="runner-segment">${seg}</div><div class="runner-segment">${seg}</div>`;
  }

  function renderGenres(){
    const genres=Array.isArray(config?.genres)?config.genres:[];
    const host=$('#genres'); if(!host)return;
    host.innerHTML=genres.map((g,i)=>`<span class="genre ${i===0?'hot':i===1?'gold-chip':''}">${esc(g)}</span>`).join('');
  }

  function renderDjs(){
    const host=$('#djGrid'), empty=$('#djEmpty'); if(!host||!empty)return;
    const djs=(Array.isArray(config?.djs)?config.djs:[]).filter(d=>d.active!==false);
    empty.hidden=djs.length>0;
    host.innerHTML=djs.map((d,i)=>{
      const photo=d.photo?`<img src="${esc(d.photo)}" alt="${esc(d.name||'DJ')}" style="object-position:${esc(d.photoPosition||'50% 50%')}" loading="lazy">`:'';
      const social=d.instagram?`<a class="dj-social" href="${esc(d.instagram)}" target="_blank" rel="noopener">Instagram ↗</a>`:'';
      return `<article class="dj-editorial reveal"><div class="dj-photo">${photo}</div><div class="dj-copy"><div class="dj-origin">${esc(d.origin||'MACABRA')}</div><h3>${esc(d.name||`DJ ${i+1}`)}</h3><p>${esc(localText(d.bio))}</p>${social}</div></article>`;
    }).join('');
  }

  function waUrl(ticket){
    const base=String(config?.links?.whatsapp||'').trim(); if(!base)return '';
    const e=config?.event||{};
    const msg=lang==='es'?`Hola! Quiero comprar ${ticket.name} para ${e.name||'Macabra'}. Valor: ${money(ticket.price)}.`:`Olá! Quero comprar ${ticket.name} para a ${e.name||'Macabra'}. Valor: ${money(ticket.price)}.`;
    try{
      const u=new URL(base.startsWith('http')?base:`https://wa.me/${base.replace(/\D/g,'')}`);
      u.searchParams.set('text',msg); return u.toString();
    }catch{return ''}
  }

  function renderTickets(){
    const host=$('#ticketGrid'); if(!host)return;
    const tickets=(Array.isArray(config?.tickets)?config.tickets:[]).filter(t=>t.status!=='hidden');
    if(!tickets.length){host.innerHTML='<article class="ticket-side"><div class="ticket-label">MACABRA</div><div class="ticket-status">Ingressos em breve</div></article>';return}
    host.innerHTML=tickets.map((t,i)=>{
      const status=t.status||'active';
      const active=status==='active';
      const buttons=[];
      if(active && t.whatsappEnabled && waUrl(t)) buttons.push(`<a class="btn ticket-buy" target="_blank" rel="noopener" href="${esc(waUrl(t))}">${esc(copy('buyWhatsapp')||copy('ticketButton'))}</a>`);
      if(active && t.checkoutEnabled && t.checkoutUrl) buttons.push(`<a class="btn ticket-buy" target="_blank" rel="noopener" href="${esc(t.checkoutUrl)}">${esc(copy('buyCheckout')||copy('ticketButton'))}</a>`);
      if(active && !buttons.length) buttons.push(`<a class="btn ticket-buy" href="#ingressos">${esc(copy('ticketButton'))}</a>`);
      if(!active) buttons.push(`<div class="ticket-status">${esc(status==='soldout'?copy('soldOut'):copy('comingSoon'))}</div>`);
      const fine=[config?.event?.dateLabel,config?.event?.timeLabel,config?.event?.venue,config?.event?.city].filter(Boolean).join(' · ');
      return `<article class="ticket-side ${t.featured?'featured':''} ${status==='soldout'?'soldout':''}">
        <div class="ticket-label">${esc(t.badge||copy('ticketLabel')||'MACABRA')}</div>
        <div class="ticket-item-name">${esc(t.name||'INGRESSO')}</div>
        <div class="price">${money(t.price)}</div>
        <p>${esc(localText(t.description)||copy('ticketCopy'))}</p>
        ${buttons.join('')}
        <div class="ticket-fine">${esc(fine)}</div>
      </article>`;
    }).join('');

    const t=firstActiveTicket();
    const top=$('.top-buy'), mobile=$('.mobile-buy');
    if(t){
      if(top) top.textContent=`${t.name||'Lote'} · ${money(t.price)}`;
      if(mobile){mobile.textContent=`${t.name||'Lote'} · ${money(t.price)}`;mobile.hidden=false}
    } else if(mobile) mobile.hidden=true;
  }

  function renderFaq(){
    const host=$('#faqList'); if(!host)return;
    const items=(Array.isArray(config?.faq)?config.faq:[]).filter(x=>x.active!==false);
    host.innerHTML=items.map((item,i)=>`<details ${i===0?'open':''}><summary>${esc(localText(item.question))}</summary><p>${esc(localText(item.answer))}</p></details>`).join('');
  }

  function applySections(){
    const main=$('main'); if(!main)return;
    main.style.display='flex'; main.style.flexDirection='column';
    const configured=Array.isArray(config?.sections)?config.sections:[];
    const map=new Map(configured.map((s,i)=>[s.id,{...s,index:i}]));
    const defaults=['hero','manifesto','sound','experience','djs','venue','tickets','countdown','faq','final'];
    defaults.forEach((id,defaultIndex)=>{
      const el=$(`[data-section="${CSS.escape(id)}"]`); if(!el)return;
      const state=map.get(id); el.hidden=state?.active===false;
      el.style.order=String((state?.index ?? defaultIndex)*10);
    });
    const runner=$('.runner'); const heroState=map.get('hero'); if(runner){runner.hidden=heroState?.active===false;runner.style.order=String((heroState?.index??0)*10+1)}
  }

  function startClock(){
    clearInterval(clockTimer);
    const target=Date.parse(config?.event?.date||'2026-10-31T21:00:00-03:00');
    if(!Number.isFinite(target))return;
    const tick=()=>{
      let diff=Math.max(0,target-Date.now());
      const d=Math.floor(diff/86400000); diff%=86400000;
      const h=Math.floor(diff/3600000); diff%=3600000;
      const m=Math.floor(diff/60000); const s=Math.floor((diff%60000)/1000);
      setText('#days',String(d).padStart(2,'0')); setText('#hours',String(h).padStart(2,'0'));
      setText('#minutes',String(m).padStart(2,'0')); setText('#seconds',String(s).padStart(2,'0'));
    };
    tick(); clockTimer=setInterval(tick,1000);
  }

  function reveal(){
    if(!('IntersectionObserver' in window)){$$('.reveal').forEach(x=>x.classList.add('in'));return}
    const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.1});
    $$('.reveal').forEach(el=>{if(!el.classList.contains('in'))io.observe(el)});
  }

  function updateProgress(){
    const max=document.documentElement.scrollHeight-innerHeight;
    const p=max>0?scrollY/max:0;
    document.documentElement.style.setProperty('--progress',Math.max(0,Math.min(1,p)));
  }

  function render(){
    document.documentElement.dataset.lang=lang;
    document.documentElement.lang=lang==='es'?'es':'pt-BR';
    $$('[data-lang-btn]').forEach(b=>b.classList.toggle('active',b.dataset.langBtn===lang));
    applyBrand(); applyCore(); renderRunner(); renderGenres(); renderDjs(); renderTickets(); renderFaq(); applySections(); startClock(); reveal(); updateProgress();
  }

  async function load(){
    try{
      const r=await fetch('/api/site',{cache:'no-store'});
      const data=await r.json();
      if(!r.ok||!data.ok)throw new Error(data.error||'Falha ao carregar configuração');
      config=data.config||{};
      render();
    }catch(error){
      console.error('Macabra CMS:',error);
      config={event:{date:'2026-10-31T21:00:00-03:00'},tickets:[],djs:[],faq:[],genres:[]};
      reveal(); startClock(); updateProgress();
    }
  }

  document.addEventListener('click',e=>{
    const btn=e.target.closest('[data-lang-btn]');
    if(!btn)return;
    lang=btn.dataset.langBtn;
    localStorage.setItem('macabra-lang',lang);
    if(config)render();
  });
  addEventListener('scroll',updateProgress,{passive:true});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',load,{once:true});else load();
})();