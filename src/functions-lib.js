export const DEFAULT_CONFIG = {
  version: 1,
  event: {
    name: 'MACABRA',
    eyebrow: 'GTRZ EVENTOS APRESENTA',
    date: '2026-10-31T21:00:00-03:00',
    dateLabel: '31 DE OUTUBRO',
    timeLabel: '21H',
    city: 'RECIFE',
    venue: 'BIRUTA BAR',
    address: 'Av. Brasília Formosa, s/n · Pina · Recife · PE',
    mapLink: '',
    mapEmbedUrl: ''
  },
  branding: {
    logo: '',
    heroImage: '',
    poster: '',
    shareImage: '',
    primary: '#f39a0a',
    secondary: '#8b2ca7',
    background: '#090706',
    paper: '#ead9bd',
    text: '#fff8ed'
  },
  links: {
    instagram: 'https://www.instagram.com/gtrzeventos/',
    whatsapp: '',
    email: ''
  },
  tickets: [
    {
      id: 'promo',
      name: 'LOTE PROMOCIONAL',
      badge: 'ABERTURA DE VENDAS',
      price: 40,
      status: 'active',
      featured: true,
      description: { pt: 'Valor promocional por tempo limitado.', es: 'Precio promocional por tiempo limitado.' },
      whatsappEnabled: true,
      checkoutEnabled: false,
      checkoutUrl: ''
    }
  ],
  djs: [],
  genres: ['Reggaeton', 'Dembow', 'Perreo', 'Funk', 'Pop', 'Hits latinos'],
  copy: {
    pt: {
      navExperience: 'Experiência', navSound: 'Música', navDjs: 'DJs', navVenue: 'Local', navTickets: 'Ingressos',
      heroTitle: 'O HALLOWEEN MAIS SOMBRIO DA GTRZ.',
      heroCopy: 'Uma noite de Halloween, pista e latinidade. A Macabra nasce para transformar 31 de outubro em ritual.',
      heroCta: 'Garantir ingresso',
      manifestoKicker: 'Uma nova noite', manifestoTitle: 'RECIFE, PREPARA-TE.',
      manifestoCopy: 'Macabra é o encontro entre horror, fantasia, música e pista. Uma experiência da GTRZ que conversa com a energia da La Rumba, mas cria seu próprio universo.',
      soundKicker: 'Som da noite', soundTitle: 'DO PERREO ÀS SOMBRAS.',
      soundCopy: 'Reggaeton, dembow, funk, pop e hits latinos atravessam a madrugada em uma pista feita para não parar.',
      djsKicker: 'No comando', djsTitle: 'QUEM CONDUZ O RITUAL.', djsIntro: 'Os DJs e atrações serão publicados aqui.', djsEmpty: 'Line-up em breve.',
      ticketsKicker: 'Entradas', ticketsTitle: 'ESCOLHA SEU INGRESSO.',
      venueKicker: 'Onde acontece', venueTitle: 'BIRUTA BAR · RECIFE', venueCopy: '31 de outubro, a partir das 21h.', openMap: 'Como chegar',
      faqKicker: 'Antes da noite', faqTitle: 'DÚVIDAS FREQUENTES.',
      finalKicker: '31 de outubro', finalTitle: 'A NOITE SERÁ MACABRA.', finalCopy: 'Recife · Biruta Bar · 21h',
      buyWhatsapp: 'Comprar sem taxa', buyCheckout: 'Comprar online', soldOut: 'Esgotado', comingSoon: 'Em breve', hidden: 'Oculto',
      days: 'Dias', hours: 'Horas', minutes: 'Min', seconds: 'Seg'
    },
    es: {
      navExperience: 'Experiencia', navSound: 'Música', navDjs: 'DJs', navVenue: 'Lugar', navTickets: 'Entradas',
      heroTitle: 'EL HALLOWEEN MÁS OSCURO DE GTRZ.',
      heroCopy: 'Una noche de Halloween, pista y latinidad. Macabra nace para convertir el 31 de octubre en ritual.',
      heroCta: 'Comprar entrada',
      manifestoKicker: 'Una nueva noche', manifestoTitle: 'RECIFE, PREPÁRATE.',
      manifestoCopy: 'Macabra es el encuentro entre horror, fantasía, música y pista. Una experiencia de GTRZ conectada con la energía de La Rumba, pero con universo propio.',
      soundKicker: 'Sonido de la noche', soundTitle: 'DEL PERREO A LAS SOMBRAS.',
      soundCopy: 'Reggaeton, dembow, funk, pop y hits latinos atraviesan la madrugada en una pista que no se detiene.',
      djsKicker: 'En el control', djsTitle: 'QUIÉN CONDUCE EL RITUAL.', djsIntro: 'Los DJs y artistas aparecerán aquí.', djsEmpty: 'Line-up próximamente.',
      ticketsKicker: 'Entradas', ticketsTitle: 'ELIGE TU ENTRADA.',
      venueKicker: 'Dónde será', venueTitle: 'BIRUTA BAR · RECIFE', venueCopy: '31 de octubre, desde las 21:00.', openMap: 'Cómo llegar',
      faqKicker: 'Antes de la noche', faqTitle: 'PREGUNTAS FRECUENTES.',
      finalKicker: '31 de octubre', finalTitle: 'LA NOCHE SERÁ MACABRA.', finalCopy: 'Recife · Biruta Bar · 21:00',
      buyWhatsapp: 'Comprar sin tasa', buyCheckout: 'Comprar online', soldOut: 'Agotado', comingSoon: 'Próximamente', hidden: 'Oculto',
      days: 'Días', hours: 'Horas', minutes: 'Min', seconds: 'Seg'
    }
  },
  faq: [
    { id: 'fantasia', active: true, question: { pt: 'Preciso ir fantasiado?', es: '¿Necesito ir disfrazado?' }, answer: { pt: 'A fantasia é incentivada, mas não obrigatória.', es: 'El disfraz es recomendado, pero no obligatorio.' } },
    { id: 'idade', active: true, question: { pt: 'Qual a classificação?', es: '¿Cuál es la edad mínima?' }, answer: { pt: 'Evento para maiores de 18 anos. Documento oficial com foto poderá ser solicitado.', es: 'Evento para mayores de 18 años. Se podrá solicitar documento oficial con foto.' } }
  ],
  sections: [
    { id: 'hero', label: 'Hero', active: true },
    { id: 'manifesto', label: 'Manifesto', active: true },
    { id: 'sound', label: 'Música', active: true },
    { id: 'djs', label: 'DJs', active: true },
    { id: 'tickets', label: 'Ingressos', active: true },
    { id: 'venue', label: 'Local', active: true },
    { id: 'faq', label: 'FAQ', active: true },
    { id: 'final', label: 'Final', active: true }
  ],
  seo: {
    title: 'Macabra — Halloween GTRZ · Recife',
    description: 'Macabra, a festa de Halloween da GTRZ em Recife. 31 de outubro, às 21h, no Biruta Bar.',
    shareTitle: 'MACABRA · 31 DE OUTUBRO',
    shareDescription: 'Recife, prepara-te. A noite será Macabra.'
  }
};

export function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...extraHeaders } });
}

export function deepMerge(base, patch) {
  if (!patch || typeof patch !== 'object' || Array.isArray(patch)) return structuredClone(base);
  const out = structuredClone(base);
  for (const [key, value] of Object.entries(patch)) {
    if (value && typeof value === 'object' && !Array.isArray(value) && base?.[key] && typeof base[key] === 'object' && !Array.isArray(base[key])) out[key] = deepMerge(base[key], value);
    else out[key] = value;
  }
  return out;
}

function normalize(config) {
  const c = deepMerge(DEFAULT_CONFIG, config || {});
  c.tickets = Array.isArray(c.tickets) ? c.tickets.slice(0, 100) : [];
  c.djs = Array.isArray(c.djs) ? c.djs.slice(0, 100) : [];
  c.faq = Array.isArray(c.faq) ? c.faq.slice(0, 100) : [];
  c.genres = Array.isArray(c.genres) ? c.genres.slice(0, 100) : [];
  c.sections = Array.isArray(c.sections) ? c.sections : structuredClone(DEFAULT_CONFIG.sections);
  return c;
}

async function ensureSchema(env) {
  if (!env.DB) throw new Error('D1 binding DB não configurado');
  await env.DB.prepare(`CREATE TABLE IF NOT EXISTS macabra_site_config (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    data TEXT NOT NULL,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`).run();
  const row = await env.DB.prepare('SELECT id FROM macabra_site_config WHERE id = 1').first();
  if (!row) await env.DB.prepare('INSERT INTO macabra_site_config (id, data) VALUES (1, ?)').bind(JSON.stringify(DEFAULT_CONFIG)).run();
}

export async function getConfig(env) {
  if (!env.DB) return structuredClone(DEFAULT_CONFIG);
  await ensureSchema(env);
  const row = await env.DB.prepare('SELECT data FROM macabra_site_config WHERE id = 1').first();
  try { return normalize(JSON.parse(row?.data || '{}')); } catch { return structuredClone(DEFAULT_CONFIG); }
}

export async function saveConfig(env, config) {
  await ensureSchema(env);
  const clean = normalize(config);
  await env.DB.prepare('UPDATE macabra_site_config SET data = ?, updated_at = CURRENT_TIMESTAMP WHERE id = 1').bind(JSON.stringify(clean)).run();
  return clean;
}
