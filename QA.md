# Verification — 2026-10-30

## Passed on the restored revision
- Astro build: 26 HTML files (21 content pages, 3 localized error pages, root redirect, generic 404).
- Build checks: 384 internal link references, 36 asset references, lang/title/description metadata, one h1 per localized page; no missing referenced local file.
- Browser: desktop home, drawer selection and Enter-to-close; mobile menu open and Escape-to-close; work filters and empty results; category retention through language switching and reload; case navigation; inquiry project context across languages; browser back.
- 390px iframe viewport tests of EN/ES/ZH: actual content width 375px, scroll width 375px; no horizontal overflow observed. These are browser viewport tests, not physical iPhone/Safari tests.
- Static build served with Astro preview: filter and refresh verified.
- Full HTTP route sweep was not completed: shell localhost could not reach the managed preview daemon. Direct navigation/reload was tested through the browser on selected routes; all output paths were checked on disk.
- Site-specific browser console errors not observed. Browser extension metadata errors were present and are not emitted by the site.
- Student Hub live URL and GitHub repository each returned HTTP 200 from this environment. This checks reachability, not every upstream feature.
- Client interaction JS: 1,817 bytes before transfer compression. Scripts externalized to comply with configured CSP.

## Not verified / incomplete
- Cloudflare preview or production deployment: not performed; account sign-in required.
- Cloudflare `_headers`/`_redirects` execution: requires deployed validation.
- GitHub push: no target repository created or linked yet. Local Git commit and bundle included.
- Mainland China: no regional/operator probes available; not verified.
- Core Web Vitals / Lighthouse / screen-reader audit / physical-device Safari: not measured.
- Contact channel deliberately unset. No submission form or fake success.
- Three inventory categories withheld pending approved material; case studies reflect supplied facts and are not a complete development retrospective.
- Final canonical/hreflang/OG origins require real SITE_URL; current preview is noindex.

## Next steps after account connection
Create a free Pages project and a non-production preview branch deployment. Confirm preview URL, direct/refresh routes, assets, drawers, language navigation, response headers, and accessible controls. Ask owner to review before any production publication. Test mainland regions/operators separately and record failures as well as successes.
