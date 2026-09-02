# Macabra Landing + CMS

Landing oficial da Macabra com painel administrativo próprio.

## Stack

- Cloudflare Pages + Pages Functions
- Cloudflare D1 para configuração
- Google Drive para mídia
- HTML/CSS/JS sem framework

## Painel

Acesse `/admin/`.

O CMS permite editar evento, identidade visual, ingressos ilimitados, DJs ilimitados, fotos e enquadramento, música, textos PT/ES, FAQ, ordem/visibilidade das seções, links, SEO e JSON completo.

## Variáveis/bindings no Cloudflare

- `DB` — binding D1
- `ADMIN_PASSWORD` — senha do painel
- `SESSION_SECRET` — segredo longo e aleatório
- `GOOGLE_DRIVE_CLIENT_ID`
- `GOOGLE_DRIVE_CLIENT_SECRET`
- `GOOGLE_DRIVE_FOLDER_ID`
- `DRIVE_ENCRYPTION_KEY` — recomendado; se ausente usa `SESSION_SECRET`
- `PUBLIC_ORIGIN` — opcional, ex. `https://macabra.seudominio.com`

Depois do deploy, entre no painel e conecte o Google Drive antes de enviar imagens.
