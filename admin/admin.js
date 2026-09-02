(() => {
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  let config = null;
  let dirty = false;
  let copyLang = 'pt';
  let loading = false;

  const COPY_GROUPS = [
    ['Navegação',[['navExperience','Experiência'],['navSound','Música'],['navDjs','DJs'],['navVenue','Local'],['navTickets','Ingressos']]],
    ['Hero',[['heroTitle','Título'],['heroCopy','Texto','textarea'],['heroCta','Botão']]],
    ['Manifesto',[['manifestoKicker','Etiqueta'],['manifestoTitle','Título'],['manifestoCopy','Texto','textarea']]],
    ['Música',[['soundKicker','Etiqueta'],['soundTitle','Título'],['soundCopy','Texto','textarea']]],
    ['DJs',[['djsKicker','Etiqueta'],['djsTitle','Título'],['djsIntro','Introdução','textarea'],['djsEmpty','Estado vazio']]],
    ['Ingressos',[['ticketsKicker','Etiqueta'],['ticketsTitle','Título'],['buyWhatsapp','Botão WhatsApp'],['buyCheckout','Botão checkout'],['soldOut','Esgotado'],['comingSoon','Em breve']]],
    ['Local',[['venueKicker','Etiqueta'],['venueTitle','Título'],['venueCopy','Texto','textarea'],['openMap','Botão mapa']]],
    ['FAQ',[['faqKicker','Etiqueta'],['faqTitle','Título']]],
    ['Final',[['finalKicker','Etiqueta'],['finalTitle','Título'],['finalCopy','Texto','textarea']]],
    ['Contagem',[['days','Dias'],['hours','Horas'],['minutes','Minutos'],['seconds','Segundos']]]
  ];

  const MEDIA_SLOTS = [
    ['branding.logo','logo','Logo Macabra','PNG/WebP transparente recomendado.'],
    ['branding.heroImage','hero','Imagem do hero','Imagem ampla de fundo, preferencialmente 16:9.'],
    ['branding.poster','poster','Pôster principal','Peça vertical 4:5 usada no hero.'],
    ['branding.shareImage','share','Compartilhamento','Imagem para WhatsApp, Instagram e Open Graph.']
  ];

  const clone = v => JSON.parse(JSON.stringify(v));
  const uid = prefix => `${prefix}_${Date.now().toString(36)}_${crypto.randomUUID().slice(0,6)}`;
  const esc = v => String(v ?? '').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const get = path => path.split('.').reduce((o,k)=>o?.[k],config);
  const set = (path,value) => { const parts=path.split('.'); let o=config; parts.slice(0,-1).forEach(k=>{if(!o[k]||typeof o[k]!=='object')o[k]={};o=o[k]});o[parts.at(-1)]=value;markDirty(); };

  function toast(message,type='ok'){const el=$('#toast');el.textContent=message;el.className=`toast show ${type}`;clearTimeout(el._t);el._t=setTimeout(()=>el.className='toast',2600)}
  function setSaveState(text,state=''){const el=$('#saveState');el.textContent=text;el.className=`save-state ${state}`;$('#workspaceStatus').textContent=text}
  function markDirty(){if(loading||!config)return;dirty=true;setSaveState('Alterações não publicadas','dirty');refreshMetrics()}

  async function request(url,options={}){const r=await fetch(url,{cache:'no-store',...options});const data=await r.json().catch(()=>({}));if(!r.ok||!data.ok){const err=new Error(data.error||`Erro ${r.status}`);err.status=r.status;err.data=data;throw err}return data}

  function showLogin(){ $('#loginView').classList.remove('hidden');$('#appView').classList.add('hidden') }
  function showApp(){ $('#loginView').classList.add('hidden');$('#appView').classList.remove('hidden') }

  async function bootstrap(){
    try{const data=await request('/api/admin/content');config=data.config;showApp();renderAll();checkDrive()}
    catch(error){if(error.status===401)showLogin();else{$('#loginError').textContent=error.message;showLogin()}}
  }

  $('#loginForm').addEventListener('submit',async e=>{
    e.preventDefault();const btn=e.currentTarget.querySelector('button[type=submit]');btn.disabled=true;btn.textContent='Verificando…';$('#loginError').textContent='';
    try{await request('/api/admin/login',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({password:$('#password').value})});$('#password').value='';await bootstrap()}
    catch(error){const d=error.data||{};$('#loginError').textContent=d.locked&&d.retryAfter?`Login bloqueado. Tente novamente em ${Math.ceil(d.retryAfter/60)} min.`:error.message}
    finally{btn.disabled=false;btn.textContent='Entrar no painel'}
  });

  $('#logoutBtn').addEventListener('click',async()=>{await fetch('/api/admin/logout',{method:'POST'});location.reload()});

  function renderStaticFields(){
    loading=true;
    $$('[data-path]').forEach(input=>{
      const path=input.dataset.path;let value=get(path)??'';
      if(path==='event.date'&&value)value=String(value).slice(0,16);
      if(input.type==='checkbox')input.checked=Boolean(value);else input.value=value;
    });
    $$('[data-color-text]').forEach(input=>input.value=get(input.dataset.colorText)||'');
    loading=false;
  }

  function bindStaticFields(){
    document.addEventListener('input',e=>{
      const input=e.target.closest('[data-path]');if(!input||!config)return;
      let value=input.type==='checkbox'?input.checked:input.type==='number'?Number(input.value):input.value;
      if(input.dataset.path==='event.date'&&value)value=`${value}:00-03:00`;
      set(input.dataset.path,value);
      if(input.type==='color'){const text=$(`[data-color-text="${CSS.escape(input.dataset.path)}"]`);if(text)text.value=value}
    });
    document.addEventListener('change',e=>{
      const text=e.target.closest('[data-color-text]');if(!text)return;const v=text.value.trim();if(/^#[0-9a-f]{6}$/i.test(v)){set(text.dataset.colorText,v);const picker=$(`[data-path="${CSS.escape(text.dataset.colorText)}"]`);if(picker)picker.value=v}else toast('Hex inválido. Use #RRGGBB.','error')
    });
  }

  function refreshMetrics(){
    if(!config)return;
    const tickets=config.tickets||[],djs=(config.djs||[]).filter(d=>d.active!==false),sections=(config.sections||[]).filter(s=>s.active!==false);
    $('#metricTickets').textContent=tickets.length;$('#metricTicketsSub').textContent=`${tickets.filter(t=>t.status==='active').length} à venda`;
    $('#metricDjs').textContent=djs.length;$('#metricDjsSub').textContent='publicados';$('#metricSections').textContent=sections.length;
    $('#overviewName').textContent=config.event?.name||'MACABRA';$('#overviewMeta').textContent=[config.event?.dateLabel,config.event?.timeLabel,config.event?.venue,config.event?.city].filter(Boolean).join(' · ');
  }

  function renderMedia(){
    $('#mediaGrid').innerHTML=MEDIA_SLOTS.map(([path,slot,title,help])=>{const url=get(path)||'';return `<article class="media-card" data-media-path="${path}"><div class="media-preview">${url?`<img src="${esc(url)}" alt="">`:`<div class="empty-media">${esc(slot.toUpperCase())}</div>`}</div><div class="media-body"><strong>${esc(title)}</strong><p>${esc(help)}</p><div class="file-row"><input type="file" accept="image/jpeg,image/png,image/webp"><button class="btn subtle upload-media" type="button" data-slot="${slot}" data-path="${path}">Enviar</button></div><input class="media-url" value="${esc(url)}" data-media-url="${path}" placeholder="/media/... ou URL"></div></article>`}).join('');
  }

  async function upload(file,slot,button){
    if(!file)throw new Error('Selecione uma imagem');const old=button.textContent;button.disabled=true;button.textContent='Enviando…';
    try{const fd=new FormData();fd.append('file',file);fd.append('slot',slot);const data=await request('/api/admin/upload',{method:'POST',body:fd});return data.url}
    finally{button.disabled=false;button.textContent=old}
  }

  document.addEventListener('click',async e=>{
    const btn=e.target.closest('.upload-media');if(!btn)return;const card=btn.closest('.media-card');const file=card.querySelector('input[type=file]').files[0];
    try{const url=await upload(file,btn.dataset.slot,btn);set(btn.dataset.path,url);renderMedia();toast('Imagem enviada. Salve para publicar.')}
    catch(error){toast(error.message,'error')}
  });
  document.addEventListener('change',e=>{const input=e.target.closest('[data-media-url]');if(input)set(input.dataset.mediaUrl,input.value.trim())});

  function ticketTemplate(t,i){
    const status=t.status||'active';return `<article class="collection-item" data-ticket="${i}"><div class="collection-summary"><div class="drag-index">${String(i+1).padStart(2,'0')}</div><div class="collection-title"><strong>${esc(t.name||'Novo ingresso')}</strong><span>R$ ${Number(t.price||0).toLocaleString('pt-BR')} · ${esc(status)}</span></div><div class="summary-badges"><span class="mini-pill ${status}">${esc(status==='active'?'À venda':status==='soldout'?'Esgotado':status==='comingsoon'?'Em breve':'Oculto')}</span>${t.featured?'<span class="mini-pill active">Destaque</span>':''}</div><div class="collection-controls"><button class="icon-btn move-up" title="Subir">↑</button><button class="icon-btn move-down" title="Descer">↓</button><button class="icon-btn edit-toggle" title="Editar">✎</button><button class="icon-btn duplicate-ticket" title="Duplicar">⧉</button><button class="icon-btn danger delete-ticket" title="Excluir">×</button></div></div><div class="collection-body"><div class="grid3"><label class="field"><span>Nome</span><input data-ticket-field="name" value="${esc(t.name)}"></label><label class="field"><span>Badge</span><input data-ticket-field="badge" value="${esc(t.badge||'')}"></label><label class="field"><span>Preço</span><input data-ticket-field="price" type="number" min="0" step="0.01" value="${Number(t.price||0)}"></label><label class="field"><span>Status</span><select data-ticket-field="status"><option value="active" ${status==='active'?'selected':''}>À venda</option><option value="soldout" ${status==='soldout'?'selected':''}>Esgotado</option><option value="comingsoon" ${status==='comingsoon'?'selected':''}>Em breve</option><option value="hidden" ${status==='hidden'?'selected':''}>Oculto</option></select></label><label class="field"><span>Checkout externo</span><input data-ticket-field="checkoutUrl" value="${esc(t.checkoutUrl||'')}" placeholder="https://..."></label></div><div class="faq-pair"><label class="field"><span>Descrição PT</span><textarea data-ticket-desc="pt">${esc(t.description?.pt||'')}</textarea></label><label class="field"><span>Descrição ES</span><textarea data-ticket-desc="es">${esc(t.description?.es||'')}</textarea></label></div><div class="toggle-row"><label class="check"><input type="checkbox" data-ticket-bool="featured" ${t.featured?'checked':''}> Destaque</label><label class="check"><input type="checkbox" data-ticket-bool="whatsappEnabled" ${t.whatsappEnabled?'checked':''}> Venda por WhatsApp</label><label class="check"><input type="checkbox" data-ticket-bool="checkoutEnabled" ${t.checkoutEnabled?'checked':''}> Checkout externo</label></div></div></article>`;
  }
  function renderTickets(){ $('#ticketEditor').innerHTML=(config.tickets||[]).map(ticketTemplate).join('')||'<div class="card"><p>Nenhum ingresso configurado.</p></div>'; }

  function djTemplate(d,i){
    const x=parseInt(String(d.photoPosition||'50% 50%').split(' ')[0])||50,y=parseInt(String(d.photoPosition||'50% 50%').split(' ')[1])||50;
    return `<article class="collection-item" data-dj="${i}"><div class="collection-summary"><div class="drag-index">${String(i+1).padStart(2,'0')}</div><div class="collection-title"><strong>${esc(d.name||'Novo DJ')}</strong><span>${esc(d.origin||'Sem origem')} · ${d.active!==false?'Publicado':'Oculto'}</span></div><div class="summary-badges"><span class="mini-pill ${d.active!==false?'active':''}">${d.active!==false?'Publicado':'Oculto'}</span></div><div class="collection-controls"><button class="icon-btn move-up">↑</button><button class="icon-btn move-down">↓</button><button class="icon-btn edit-toggle">✎</button><button class="icon-btn duplicate-dj">⧉</button><button class="icon-btn danger delete-dj">×</button></div></div><div class="collection-body"><div class="photo-editor"><div><div class="photo-box">${d.photo?`<img src="${esc(d.photo)}" style="object-position:${esc(d.photoPosition||'50% 50%')}" alt="">`:'<span class="empty-media">FOTO</span>'}</div><div class="file-row" style="margin-top:8px"><input type="file" accept="image/jpeg,image/png,image/webp"><button class="btn subtle upload-dj" type="button">Enviar foto</button></div></div><div><div class="grid2"><label class="field"><span>Nome</span><input data-dj-field="name" value="${esc(d.name||'')}"></label><label class="field"><span>Origem / assinatura</span><input data-dj-field="origin" value="${esc(d.origin||'')}"></label><label class="field"><span>Instagram</span><input data-dj-field="instagram" value="${esc(d.instagram||'')}"></label><label class="field"><span>URL da foto</span><input data-dj-field="photo" value="${esc(d.photo||'')}"></label></div><div class="position-row"><label>Horizontal · <b>${x}%</b><input data-pos="x" type="range" min="0" max="100" value="${x}"></label><label>Vertical · <b>${y}%</b><input data-pos="y" type="range" min="0" max="100" value="${y}"></label></div><div class="faq-pair" style="margin-top:12px"><label class="field"><span>Biografia PT</span><textarea data-dj-bio="pt">${esc(d.bio?.pt||'')}</textarea></label><label class="field"><span>Biografia ES</span><textarea data-dj-bio="es">${esc(d.bio?.es||'')}</textarea></label></div><div class="toggle-row"><label class="check"><input type="checkbox" data-dj-bool="active" ${d.active!==false?'checked':''}> Publicado</label></div></div></div></div></article>`;
  }
  function renderDjs(){ $('#djEditor').innerHTML=(config.djs||[]).map(djTemplate).join('')||'<div class="card"><p>Nenhum DJ adicionado. Clique em “Adicionar DJ”.</p></div>'; }

  function faqTemplate(f,i){return `<article class="collection-item" data-faq="${i}"><div class="collection-summary"><div class="drag-index">${String(i+1).padStart(2,'0')}</div><div class="collection-title"><strong>${esc(f.question?.pt||'Nova pergunta')}</strong><span>${f.active!==false?'Publicada':'Oculta'}</span></div><div class="collection-controls"><button class="icon-btn move-up">↑</button><button class="icon-btn move-down">↓</button><button class="icon-btn edit-toggle">✎</button><button class="icon-btn danger delete-faq">×</button></div></div><div class="collection-body"><div class="faq-pair"><div><label class="field"><span>Pergunta PT</span><input data-faq-q="pt" value="${esc(f.question?.pt||'')}"></label><label class="field"><span>Resposta PT</span><textarea data-faq-a="pt">${esc(f.answer?.pt||'')}</textarea></label></div><div><label class="field"><span>Pregunta ES</span><input data-faq-q="es" value="${esc(f.question?.es||'')}"></label><label class="field"><span>Respuesta ES</span><textarea data-faq-a="es">${esc(f.answer?.es||'')}</textarea></label></div></div><div class="toggle-row"><label class="check"><input type="checkbox" data-faq-active ${f.active!==false?'checked':''}> Publicada</label></div></div></article>`}
  function renderFaq(){ $('#faqEditor').innerHTML=(config.faq||[]).map(faqTemplate).join('')||'<div class="card"><p>Nenhuma pergunta cadastrada.</p></div>'; }

  function renderSections(){ $('#sectionEditor').innerHTML=(config.sections||[]).map((s,i)=>`<div class="section-row" data-section-index="${i}"><span class="order-num">${String(i+1).padStart(2,'0')}</span><strong>${esc(s.label||s.id)}</strong><label class="switch"><input type="checkbox" data-section-active ${s.active!==false?'checked':''}> Visível</label><div class="section-actions"><button class="icon-btn move-up">↑</button><button class="icon-btn move-down">↓</button></div></div>`).join('') }

  function renderCopy(){
    const langConfig=config.copy?.[copyLang]||{};
    $('#copyEditor').innerHTML=COPY_GROUPS.map(([group,fields])=>`<div class="copy-group"><h4>${esc(group)}</h4><div class="copy-fields">${fields.map(([key,label,type])=>`<label class="field ${type==='textarea'?'wide-field':''}"><span>${esc(label)}</span>${type==='textarea'?`<textarea data-copy-key="${key}">${esc(langConfig[key]||'')}</textarea>`:`<input data-copy-key="${key}" value="${esc(langConfig[key]||'')}">`}</label>`).join('')}</div></div>`).join('');
  }

  function renderAll(){
    loading=true;renderStaticFields();renderMedia();renderTickets();renderDjs();renderFaq();renderSections();renderCopy();$('#genresEditor').value=(config.genres||[]).join('\n');$('#jsonEditor').value=JSON.stringify(config,null,2);refreshMetrics();loading=false;dirty=false;setSaveState('Tudo salvo');setupSectionObserver();
  }

  function move(array,index,delta){const next=index+delta;if(next<0||next>=array.length)return;[array[index],array[next]]=[array[next],array[index]];markDirty()}
  function idx(el,attr){return Number(el.closest(`[${attr}]`).getAttribute(attr))}

  document.addEventListener('click',async e=>{
    const toggle=e.target.closest('.edit-toggle');if(toggle){toggle.closest('.collection-item').classList.toggle('open');return}
    const item=e.target.closest('.collection-item');
    if(item?.hasAttribute('data-ticket')){const i=Number(item.dataset.ticket);if(e.target.closest('.move-up')){move(config.tickets,i,-1);renderTickets()}if(e.target.closest('.move-down')){move(config.tickets,i,1);renderTickets()}if(e.target.closest('.duplicate-ticket')){const n=clone(config.tickets[i]);n.id=uid('ticket');n.name=`${n.name} · CÓPIA`;config.tickets.splice(i+1,0,n);markDirty();renderTickets()}if(e.target.closest('.delete-ticket')&&confirm('Excluir este ingresso?')){config.tickets.splice(i,1);markDirty();renderTickets()}return}
    if(item?.hasAttribute('data-dj')){const i=Number(item.dataset.dj);if(e.target.closest('.move-up')){move(config.djs,i,-1);renderDjs()}if(e.target.closest('.move-down')){move(config.djs,i,1);renderDjs()}if(e.target.closest('.duplicate-dj')){const n=clone(config.djs[i]);n.id=uid('dj');n.name=`${n.name} · CÓPIA`;config.djs.splice(i+1,0,n);markDirty();renderDjs()}if(e.target.closest('.delete-dj')&&confirm('Excluir este DJ?')){config.djs.splice(i,1);markDirty();renderDjs()}const uploadBtn=e.target.closest('.upload-dj');if(uploadBtn){const file=item.querySelector('input[type=file]').files[0];try{const url=await upload(file,`dj-${config.djs[i].id||i}`,uploadBtn);config.djs[i].photo=url;markDirty();renderDjs();toast('Foto enviada. Salve para publicar.')}catch(error){toast(error.message,'error')}}return}
    if(item?.hasAttribute('data-faq')){const i=Number(item.dataset.faq);if(e.target.closest('.move-up')){move(config.faq,i,-1);renderFaq()}if(e.target.closest('.move-down')){move(config.faq,i,1);renderFaq()}if(e.target.closest('.delete-faq')&&confirm('Excluir esta pergunta?')){config.faq.splice(i,1);markDirty();renderFaq()}return}
    const row=e.target.closest('[data-section-index]');if(row){const i=Number(row.dataset.sectionIndex);if(e.target.closest('.move-up')){move(config.sections,i,-1);renderSections()}if(e.target.closest('.move-down')){move(config.sections,i,1);renderSections()}return}
  });

  document.addEventListener('input',e=>{
    if(!config)return;
    const ticket=e.target.closest('[data-ticket-field],[data-ticket-desc],[data-ticket-bool]');if(ticket){const item=ticket.closest('[data-ticket]'),i=Number(item.dataset.ticket),t=config.tickets[i];if(ticket.dataset.ticketField){const k=ticket.dataset.ticketField;t[k]=ticket.type==='number'?Number(ticket.value):ticket.value}else if(ticket.dataset.ticketDesc){t.description=t.description||{};t.description[ticket.dataset.ticketDesc]=ticket.value}else if(ticket.dataset.ticketBool)t[ticket.dataset.ticketBool]=ticket.checked;markDirty();refreshMetrics();return}
    const dj=e.target.closest('[data-dj-field],[data-dj-bio],[data-dj-bool],[data-pos]');if(dj){const item=dj.closest('[data-dj]'),i=Number(item.dataset.dj),d=config.djs[i];if(dj.dataset.djField)d[dj.dataset.djField]=dj.value;else if(dj.dataset.djBio){d.bio=d.bio||{};d.bio[dj.dataset.djBio]=dj.value}else if(dj.dataset.djBool)d[dj.dataset.djBool]=dj.checked;else if(dj.dataset.pos){const x=Number(item.querySelector('[data-pos=x]').value),y=Number(item.querySelector('[data-pos=y]').value);d.photoPosition=`${x}% ${y}%`;const img=item.querySelector('.photo-box img');if(img)img.style.objectPosition=d.photoPosition;item.querySelector('[data-pos=x]').previousElementSibling;item.querySelectorAll('.position-row b')[0].textContent=`${x}%`;item.querySelectorAll('.position-row b')[1].textContent=`${y}%`}markDirty();refreshMetrics();return}
    const fq=e.target.closest('[data-faq-q],[data-faq-a],[data-faq-active]');if(fq){const item=fq.closest('[data-faq]'),i=Number(item.dataset.faq),f=config.faq[i];if(fq.dataset.faqQ){f.question=f.question||{};f.question[fq.dataset.faqQ]=fq.value}else if(fq.dataset.faqA){f.answer=f.answer||{};f.answer[fq.dataset.faqA]=fq.value}else f.active=fq.checked;markDirty();return}
    const sec=e.target.closest('[data-section-active]');if(sec){config.sections[Number(sec.closest('[data-section-index]').dataset.sectionIndex)].active=sec.checked;markDirty();refreshMetrics();return}
    const cp=e.target.closest('[data-copy-key]');if(cp){config.copy[copyLang]=config.copy[copyLang]||{};config.copy[copyLang][cp.dataset.copyKey]=cp.value;markDirty();return}
  });

  $('#genresEditor').addEventListener('input',e=>{config.genres=e.target.value.split('\n').map(v=>v.trim()).filter(Boolean);markDirty()});
  $('#addTicketBtn').addEventListener('click',()=>{config.tickets.push({id:uid('ticket'),name:'NOVO INGRESSO',badge:'NOVO',price:0,status:'comingsoon',featured:false,description:{pt:'',es:''},whatsappEnabled:true,checkoutEnabled:false,checkoutUrl:''});markDirty();renderTickets();const el=$('#ticketEditor .collection-item:last-child');el?.classList.add('open');el?.scrollIntoView({behavior:'smooth',block:'center'})});
  $('#addDjBtn').addEventListener('click',()=>{config.djs.push({id:uid('dj'),name:'NOVO DJ',origin:'',photo:'',photoPosition:'50% 50%',instagram:'',active:true,bio:{pt:'',es:''}});markDirty();renderDjs();const el=$('#djEditor .collection-item:last-child');el?.classList.add('open');el?.scrollIntoView({behavior:'smooth',block:'center'})});
  $('#addFaqBtn').addEventListener('click',()=>{config.faq.push({id:uid('faq'),active:true,question:{pt:'Nova pergunta',es:'Nueva pregunta'},answer:{pt:'',es:''}});markDirty();renderFaq();const el=$('#faqEditor .collection-item:last-child');el?.classList.add('open')});

  $$('[data-copy-lang]').forEach(btn=>btn.addEventListener('click',()=>{copyLang=btn.dataset.copyLang;$$('[data-copy-lang]').forEach(x=>x.classList.toggle('active',x===btn));renderCopy()}));
  $('#resetColorsBtn').addEventListener('click',()=>{Object.assign(config.branding,{primary:'#f39a0a',secondary:'#8b2ca7',background:'#090706',paper:'#ead9bd',text:'#fff8ed'});markDirty();renderStaticFields();toast('Paleta restaurada. Salve para publicar.')});

  function syncJson(){ $('#jsonEditor').value=JSON.stringify(config,null,2) }
  $('#syncJsonBtn').addEventListener('click',()=>{syncJson();toast('JSON atualizado.')});
  $('#applyJsonBtn').addEventListener('click',()=>{try{const parsed=JSON.parse($('#jsonEditor').value);if(!parsed||typeof parsed!=='object'||Array.isArray(parsed))throw new Error('Objeto inválido');config=parsed;markDirty();renderAll();dirty=true;setSaveState('JSON aplicado · falta publicar','dirty');toast('JSON aplicado ao formulário.')}catch(error){toast(`JSON inválido: ${error.message}`,'error')}});
  $('#downloadBackupBtn').addEventListener('click',()=>{const blob=new Blob([JSON.stringify(config,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`macabra-backup-${new Date().toISOString().slice(0,10)}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),500)});

  async function save(){
    if(!config)return;setSaveState('Publicando…','saving');$('#saveBtn').disabled=true;$('#saveMobileBtn').disabled=true;
    try{const data=await request('/api/admin/content',{method:'PUT',headers:{'content-type':'application/json'},body:JSON.stringify(config)});config=data.config;dirty=false;renderAll();toast('Alterações publicadas.')}
    catch(error){setSaveState('Erro ao publicar','error');toast(error.message,'error')}
    finally{$('#saveBtn').disabled=false;$('#saveMobileBtn').disabled=false}
  }
  $('#saveBtn').addEventListener('click',save);$('#saveMobileBtn').addEventListener('click',save);
  $('#reloadBtn').addEventListener('click',async()=>{if(dirty&&!confirm('Descartar alterações não salvas?'))return;await bootstrap();toast('Conteúdo recarregado.')});

  async function checkDrive(){
    try{const d=await request('/api/admin/google/status');$('#metricDrive').textContent=d.connected?'ON':'OFF';$('#drivePill').textContent=d.connected?'Conectado':d.configured?'Desconectado':'Não configurado';$('#drivePill').className=`status-pill ${d.connected?'ok':'warn'}`;$('#connectDriveBtn').hidden=d.connected;$('#disconnectDriveBtn').hidden=!d.connected;$('#driveHelp').textContent=d.connected?'Google Drive conectado e pronto para receber as imagens da Macabra.':d.configured?'Credenciais encontradas. Conecte sua conta para liberar uploads.':'Configure GOOGLE_DRIVE_CLIENT_ID, GOOGLE_DRIVE_CLIENT_SECRET e GOOGLE_DRIVE_FOLDER_ID no Cloudflare.'}
    catch{$('#metricDrive').textContent='—'}
  }
  $('#disconnectDriveBtn').addEventListener('click',async()=>{if(!confirm('Desconectar o Google Drive? Imagens já publicadas continuarão referenciadas, mas o proxy não conseguirá acessá-las até reconectar.'))return;try{await request('/api/admin/google/disconnect',{method:'POST'});checkDrive();toast('Google Drive desconectado.')}catch(error){toast(error.message,'error')}});

  function setupSectionObserver(){
    const links=$$('.side-nav a');const sections=$$('.panel-section');const observer=new IntersectionObserver(entries=>{const visible=entries.filter(x=>x.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];if(!visible)return;const id=visible.target.id;links.forEach(a=>a.classList.toggle('active',a.getAttribute('href')===`#${id}`));$('#currentSection').textContent=(links.find(a=>a.getAttribute('href')===`#${id}`)?.textContent||id).replace(/^\d+/,'').trim().toUpperCase()},{rootMargin:'-15% 0px -65%',threshold:[0,.1,.3]});sections.forEach(s=>observer.observe(s));
  }

  window.addEventListener('beforeunload',e=>{if(dirty){e.preventDefault();e.returnValue=''}});
  bindStaticFields();
  bootstrap();
})();
