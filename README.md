# Betarchivo 1.0

Astro static multilingual creative portfolio. This is a development checkpoint, not a deployed production release.

## Local development
Node 22+; `npm ci`, `npm run dev`. Build with `npm run build`; output is `dist`.

## Content
- `src/data/config.ts`: contact email, social links, deployment origin.
- `src/data/ui.ts`: EN / ES / 简体中文 interface translations.
- `src/data/projects.ts`: typed project inventory and translated case studies.
- `src/data/services.ts`: service content.
- `src/styles/global.css`: visual system and responsive layouts.

Only ENTRE FLORES and Student Hub Spain are currently displayed. Other inventory entries remain unpublished pending content and permission. No fictional metrics, testimonials, contact addresses, or completed integrations. ENTRE FLORES screenshot is an actual project capture; its live link remains unset because the source site is owner-private. Student Hub uses an explicitly labelled typographic cover.

## Deployment
Cloudflare Pages target: `npm run build`, output directory `dist`. Set `SITE_URL` to the real origin. Set `DEPLOY_ENV=production` ONLY for an approved production build. Unconfigured builds are noindex; no made-up canonical origin is emitted. Production publication requires owner confirmation.

This project does not depend on ChatGPT authentication or hosting. No runtime third-party font/CDN dependency. Font packages are bundled locally and OFL licenses are included. Chinese typography uses device-native fonts.

## Outstanding
Cloudflare account authorization and preview deployment; GitHub repository creation/linking; mainland China multi-region/operator verification; real device QA; contact channel; approved assets/links for other projects. No Core Web Vitals or mainland accessibility claim is made.
