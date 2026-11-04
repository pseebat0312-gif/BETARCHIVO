# Cloudflare Pages handoff

Build command: `npm run build`
Output: `dist`
Node: 22 or newer
Environment variable `SITE_URL`: the actual site origin (no invented placeholder is committed).
`DEPLOY_ENV`: omit or set `preview` for Preview. Set `production` only after owner confirmation.

Keep production publishing disabled until the owner approves. The current Git branch is `preview`. Do not connect an automatic production deploy to this branch. This repository is portable: the build output is plain HTML/CSS/JS, fonts and images.

The first Cloudflare account login and GitHub repository connection have not been completed. No deployment URL has been obtained. Free infrastructure only; do not purchase a domain or activate paid services without owner approval.

For mainland China acceptance, record date, domain, province, operator (China Mobile/Unicom/Telecom), DNS/TLS, first HTML and essential asset loading, EN/ES/ZH navigation and refresh, and drawer controls. Use the final domain and real mainland probes; overseas curl checks do not establish mainland accessibility.
