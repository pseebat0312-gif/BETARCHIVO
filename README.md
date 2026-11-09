# BETARCHIVO

**An independent creative archive by beta.**

A multilingual portfolio and growing digital studio exploring creative web design, interactive experiences, useful digital products, and data visualization. Based in Madrid, BETARCHIVO brings together design, code, curiosity, and experimentation.

**Live site:** https://betarchivo.pages.dev/

## Selected work

- **ENTRE FLORES** — an interactive floral atelier, seasonal garden, and bouquet-building experience. [Explore the project](https://a045baf2.entre-flores.pages.dev/#home).
- **PLAYGROUND LAB** — interactive explorations of mathematics, statistics, probability, and programming.
- **Student Hub Spain** — a digital product for students in Spain.
- **Interactive Phone Simulator** — a playful, narrative-driven web experience.
- **Little Experiments** — smaller creative coding and interactive projects.

Projects are independent experiments and works in progress; individual case studies describe their own scope.

## Services

1. **Creative Websites** — portfolios, landing pages, and distinctive small-brand websites.
2. **Interactive Web Experiences** — playful interactions, storytelling, and creative prototypes.
3. **Small Digital Products** — lightweight tools, web applications, and functional prototypes.
4. **Data Visualization** — interactive charts, visual reports, and data stories.

## Built with

- Astro, HTML, CSS, and JavaScript/TypeScript
- English, Spanish, and Simplified Chinese content
- Responsive layouts, reusable components, and interactive project drawers
- Cloudflare Pages hosting

## Run locally

Requires a compatible Node.js version for the installed Astro release (check `package.json` and Astro's current requirements).

```bash
npm ci
npm run dev
```

Build and preview:

```bash
npm run build
npm run preview
```

The static build is generated in `dist/`.

## Project structure

```text
src/
  pages/          # Localized pages and project case studies
  components/     # Shared interface components
  data/           # Projects, services, translations, configuration
  styles/         # Global styling and responsive design
public/           # Static images and other assets
```

## Deploy on Cloudflare Pages

For an existing Cloudflare Pages project connected to GitHub, push to the configured **production branch**; Cloudflare should start a new build automatically.

For a new Git-connected Pages project, configure:

| Setting | Value |
| --- | --- |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | Repository root (unless the Astro project is in a subfolder) |

Check `src/data/config.ts` and any site URL / indexing environment variables before a production release. Keep the existing Cloudflare project instead of creating a duplicate if GitHub integration is already configured.

## Notes

BETARCHIVO is a personal creative practice, not a large agency. Descriptions and case studies should reflect real work; no invented clients, testimonials, or performance metrics. This repository contains website source code, not private credentials.

© 2026 beta / BETARCHIVO. Project content and imagery may have separate usage rights; do not assume they are licensed for reuse.
