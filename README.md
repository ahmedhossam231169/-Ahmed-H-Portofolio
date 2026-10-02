# Ahmed Hossam — Portfolio

React · Vite · Tailwind CSS v4 · GSAP + ScrollTrigger + SplitText · Motion · Lenis · Three.js / React Three Fiber

```bash
npm install
npm run dev      # local dev server
npm run build    # production build → dist/
npm run preview  # serve the production build
```

The design system and the reasoning behind it are in [DESIGN.md](DESIGN.md).

## Adding your content

No project details have been invented. Until you add real content, empty fields are hidden in production.
In dev they appear as dim `[ … pending ]` markers so you can see what is missing.

| File | What to fill in |
|---|---|
| `src/data/projects.js` | Filled from projects.md (7 projects). Fields: `name`, `type`, `description`, `highlights` (shown on flagship panels), `tech`, `live`, `github`, `image`, and **`scale` (1–3)**, which sets each panel's width and composition. |
| `src/data/skills.js` | Your real skill graph. `parent` draws the tree edges, `related` adds faint cross-links, and `context` is optional detail text. The constellation and the mobile tree lay themselves out automatically. |
| `src/data/site.js` | `email`, `socials[].href`, and optionally `location`. |

Project screenshots live in `public/project-images/<slug>/`. The site loads `cover.webp` from each one (slugs: loopin, routeposts, freshcart, adasa, wanderlust, cosmos, contacthub).
If a cover is missing, that panel shows a generated schematic instead.

## Experience tiers

| Context | What runs |
|---|---|
| Desktop (≥1024px, mouse) | Intro, pinned hero, pinned About beats, horizontal work track, radial constellation, custom cursor, full 3D |
| Touch / tablet / narrow | Same story with scroll-native layouts: vertical work spine, skills tree, no custom cursor, lighter 3D (70 nodes) |
| `prefers-reduced-motion` | No intro, no smooth scroll, no pinning or scrubbing, a static 3D frame. All content is visible immediately. |

The intro plays once per browser session. Skip it with Esc, Enter, Space, or the "Skip intro" button.
Interface sound is off by default and only starts after the user turns it on.
