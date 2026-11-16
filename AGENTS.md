# BETARCHIVO — Codex Project Instructions

## Scope and safety
- Work only on the explicitly selected development branch (`dev/3d-archive` unless the user changes it). Never merge to `main`, deploy to production, alter secrets, or delete existing work without explicit approval.
- This is an existing personal creative portfolio, not a new agency or greenfield project. Inspect the actual repository before changing architecture.
- Preserve existing Astro site, routes, EN/ES/ZH localization, SEO, project data, content, and functioning pages. Avoid rewriting the site to React. Use a focused hydrated island for 3D only if appropriate after verifying compatibility.
- Keep content editable in dedicated data files; no hardcoded project records inside 3D components. Use stable archive IDs independent of display order.
- Prefer free, legally reusable tools and assets. Log each third-party asset's source, author, license, attribution requirements, and modifications. Do not install or run unreviewed third-party scripts.
- Never invent credentials, project achievements, client testimonials, metrics, or working features.
- Report actual tests and limitations; never claim to have tested a device/browser without doing so.

## Design source of truth
- Read `docs/DESIGN_SPEC.md` before any UI, animation, asset, or 3D task. Treat it as the approved design direction, not permission to build all phases at once.
- For frontend design tasks, read `.agents/skills/frontend-design/SKILL.md` first. This is a repository-local reference; do not assume the cloud Codex runtime has registered it as a globally installed skill. Its LICENSE.txt is retained unchanged.
- If skill guidance conflicts with the BETARCHIVO-specific brief, follow the BETARCHIVO brief. No generic AI templates or decorative motion for its own sake.
- Do not treat visual reference sites as code or asset licenses. Implement original designs.

## Working protocol
1. Inspect relevant files and summarize the smallest safe implementation plan.
2. Make a narrow, reviewable change on the development branch only; do not combine unrelated redesigns.
3. Run available checks and document commands/results.
4. Provide a short file-change list, remaining risks, and preview instructions.
5. Obtain approval before expanding from one-drawer prototype to the full cabinet or changing production configuration.

## Performance and accessibility
- Mobile-first usable interaction, keyboard support, visible focus, reduced-motion behavior, loading/error fallbacks, and no blocking of access to portfolio projects when WebGL is unavailable.
- Physically coherent 3D geometry and state-driven transitions; prevent click races, clipping, impossible object motion, and broken back navigation.
