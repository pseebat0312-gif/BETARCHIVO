# BETARCHIVO — Design Specification (pre-development)

Status: design direction confirmed in discussion; **not** a command to build or deploy the full site. Preserve existing source and work in phases.

## Identity and visual language
BETARCHIVO is beta's independent personal creative brand and portfolio, not a fictional large agency. Concept: **contemporary editorial × creative studio × subtle vintage archive**, presented as an immersive but usable 3D archive. Keep interface copy minimal; projects and capabilities must remain discoverable by recruiters.

Approved palette:
- Warm Ivory `#F5F1E8`
- Deep Matcha `#65745B`
- Deep Ocean `#1C3040`
- Vintage Burgundy `#793D4A`
- Soft Sage `#A7B19B`

Materials: realistic wood cabinet with convincing grain, thickness and joinery; restrained aged brass hardware, textured paper and physical folders. A subtle mysterious atmosphere, never a cartoon, sci-fi, or generic luxury mockup. Lighting combines natural ambient illumination with directed spotlights. Composition uses hierarchical drawer sizes/placement, viewed from a slightly angled 3D camera showing the cabinet's depth. The exhibition space is deliberate and architecturally credible.

## Home — immersive archive
- The hero is the **cabinet itself**, not large typography or an “Explore the Work” CTA.
- One drawer corresponds to one project category; a featured-project top drawer may duplicate entries that also appear in their category drawer.
- Opening a drawer: user selects drawer -> physically slides on plausible rails -> camera approaches the drawer -> contents are revealed -> choose an archive folder -> folder moves coherently to the approved display surface -> mechanical fastener is opened -> folder opens -> transition to a modern project page.
- Real physical constraints: drawer travel limits, clearance, hinge/pivot points, folder thickness, occlusion, shadows, contact surfaces, and no teleporting objects or clipping.
- Cabinet interior layout: layered, intentional archive arrangement; distinguish category and individual project files.
- Keep everyday motion restrained; reserve ceremonial timing for opening and unsealing a file. Motion is reversible/interruptible safely; camera navigation and return to cabinet must restore state.
- A hidden archive/secret mechanism exists as an optional discoverable interaction, not a barrier to the main work.
- Camera exploration is guided with modest freedom, not uncontrolled wandering.
- Mobile uses a purpose-designed **vertical cabinet** interaction with touch-friendly drawers, not a cramped desktop 3D viewport.

## Archive and content system
- Archive Index: a clear alternative navigation path, with a way back to the cabinet.
- Category drawers and featured drawer share canonical project records. Stable archive IDs; no IDs derived from array positions.
- Project covers: bespoke, editorial, visually varied but coherent; use actual project media, not generic placeholders masquerading as final work.
- Each project detail page: consistent information architecture with its own visual personality. Make capabilities, role, process, outcomes, media, and live/source links legible and honest. Keep navigation to other projects and return to cabinet.
- About is a personal archive, with an optional secret file/hidden detail. Services and Contact remain visible in the top navigation, with simpler archive-themed interactions than the homepage.
- Public contact targets requested: `studiobetarchivo@gmail.com` and Instagram `@betarchivo`. Verify before publishing.
- Maintain full English, Spanish and Chinese localization, natural wording, correct font rendering, routing and SEO.
- Content, labels, archive IDs, project descriptions, cover references and translations should live in editable data/config files rather than 3D component source.

## Technical direction (to validate against repository)
- Keep Astro as the site shell; introduce Three.js/React Three Fiber only where beneficial. GSAP can orchestrate transitions where licensing and compatibility permit.
- Prefer a genuine Blender-built or appropriately licensed free model exported as optimized GLB; procedural Blender modeling is acceptable. Do not substitute CSS perspective for real 3D.
- State-driven interaction (illustrative): `idle -> drawer-open -> file-selected -> on-display -> unsealed -> project-open`; support reverse navigation and interruption.
- Use original/CC0 textures and HDRI where possible; verify every asset license. No paid model purchase without user approval.
- Provide a useful non-WebGL fallback, keyboard path, reduced-motion behavior, graceful loading and mobile performance.
- First implement and validate **one production-quality drawer prototype**, then expand after user review. Do not call an untested mockup a finished implementation.

## Visual and technical references (inspiration, not licensed code)
- https://bruno-simon.com/ — spatial interaction and discoverability, not its cartoon style.
- https://tympanus.net/codrops/ — camera choreography and editorial interaction techniques; inspect the specific example and its license before reuse.
- https://polyhaven.com/ — CC0 materials and HDRIs.
- https://ambientcg.com/ — material library; verify individual licensing and attribution.
- https://threejs.org/ and https://docs.pmnd.rs/react-three-fiber — rendering and integration documentation.
- https://www.blender.org/ — modeling pipeline.

## Quality gate
No automatic production deployment. Verify build, routes, translations, project navigation, actual model interactions, mobile touch, keyboard, reduced motion, loading, and realistic geometry before calling a phase complete. Record measured performance rather than inventing figures.
