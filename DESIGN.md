# Design System — Ahmed Hossam Portfolio

The concept: **the site is a running system.** The hero network, the project "bus", and the
skills constellation all use one visual language: nodes, edges, and signals moving along them.
Typography is the content. The 3D scene sits behind it as atmosphere.

## 1. Information architecture

```
[Intro]   8s, skippable · graph assembles → name → roles → signal runs through the graph → wipes into hero
00 Hero   BUILD / DIGITAL / EXPERIENCES.   (pinned, typography transforms on scroll)
01 About    three beats from the CV (who · how I got here · what I care about), word-by-word scrub
           + one meta line: location · languages · ● open to work
02 Journey  education & training as hairline rows (Route diploma, Digitera, Claude 101); LED on latest
03 Work     horizontal "system bus": 7 projects of varying width/composition (vertical on mobile)
04 Skills   constellation: CORE → foundation → framework → motion / 3D / tooling
05 Contact  one statement, one action
```
Nav order follows the page: 01 About · 02 Journey · 03 Work · 04 Skills · 05 Contact.

## 2. Color

| Token | Value | Use |
|---|---|---|
| `--c-bg` | `#07080a` | page (dominant) |
| `--c-bg-2` | `#0c0d10` | raised planes, previews |
| `--c-line` | `rgba(237,237,232,.09)` | hairlines, grid |
| `--c-fg` | `#ededE8` | primary type (off-white) |
| `--c-mute` | `#8b8e94` | secondary type (AA on bg) |
| `--c-dim` | `#55585e` | tertiary meta labels only |
| `--c-accent` | `#2f6bff` | electric blue. Only used for **state**: active, live, signal, focus |

Rule: blue never fills a large area. It marks things that are active, like a status LED.

**Light mode** is the same system on paper: `data-theme="light"` on `<html>` swaps the tokens
(`bg #f2f1ec`, `bg-2 #e8e7e1`, `fg #0c0d0f`, `mute #5b5e64`, `dim #85888e`, `accent #2453f2`).
Dark stays the default. The choice is saved, and an inline script in `index.html` applies it before
first paint. The 3D network, intro graph and skills graph read the same tokens. Resting project
screenshots wash out (grayscale + opacity) instead of darkening.

## 3. Typography

- **Geist** (geometric sans), used for display, headings, nav, and project titles. Weights 300 / 500 / 600.
- **Geist Mono**: indices, tech, coordinates, labels. Always uppercase, 10–12px, tracking `.08em`.

Scale (fluid):
`display` clamp(4rem, 13.2vw, 15rem) · `h1` clamp(2.5rem, 7vw, 7rem) · `h2` clamp(1.75rem, 3.6vw, 3.25rem)
· `body` 1rem–1.125rem · `meta` 0.6875rem mono.
Display type is set tight (`-0.055em`, line-height .82). Large type only appears in the hero, the
about statements, and the contact statement. Everything else is small, so the contrast reads as intentional.

## 4. Spacing

A 4px base unit. Page gutter `--gutter: clamp(16px, 3.2vw, 48px)`. Sections are separated by
viewport-relative space (`20vh`+), not by boxes. There are no cards with backgrounds; structure comes from hairlines
and a 12-column grid that shows faintly in the hero.

## 5. Motion

| Layer | Tool | Examples |
|---|---|---|
| 1. Cinematic | GSAP timelines | intro, hero pin, horizontal work track |
| 2. Section | ScrollTrigger | about scrub, section → 3D state |
| 3. Reveal | GSAP + SplitText | line masks, metadata appearing |
| 4. Micro | Motion | skill detail presence, nav show/hide, sound toggle |
| Scroll | Lenis | smooth scroll driven by GSAP's ticker |

Easing: `expo.out` for entrances, `power2.inOut` for transitions, linear for scrubs.
Durations: micro 0.25s · reveal 0.9s · cinematic 1.2–1.6s.
Reduced motion: no Lenis, no pinning, no scrubs, a static 3D frame, and the intro is skipped. All content is visible by default.

## 6. 3D: Code Architecture

Four layered planes of nodes at different depths. Each plane is a tier of a system (UI → components →
services → data). Edges connect nodes within a plane and step between neighbouring planes. A few
"packets" travel along edges (data flow).
- Nodes: one `InstancedMesh` (octahedron, 8 tris). Edges: one `LineSegments`. Packets: one `Points`.
- Reacts to the pointer (parallax tilt), scroll (camera dolly and rotation), and section (spread, opacity, focus).
- Quality: desktop 160 nodes and 24 packets at DPR ≤ 1.75. Mobile 70 nodes and 8 packets at DPR ≤ 1.25.
- Loads lazily after first paint. Rendering pauses when the tab is hidden. Reduced motion renders on demand only.

## 7. Responsive strategy

- **≥1024 + fine pointer**: full experience: pinned hero, horizontal work, radial constellation, custom cursor.
- **<1024 / touch**: the hero is not pinned, so type shifts with plain scroll. Work becomes a vertical bus with a spine
  on the left, and each project gets its own crop. Skills become a vertical branch tree. No cursor. Lighter 3D.
- `overflow-x: clip` on `html`/`body` prevents page-level horizontal overflow.

## 8. Component architecture

```
src/
  data/          site.js · projects.js · skills.js   (content only)
  utils/         store.js (mutable app state) · device.js · sound.js
  hooks/         useMediaQuery · useReducedMotion · useStore
  animations/    gsap.js (plugin setup) · scroll/lenis.js · hero/ · projects/ · typography/
  three/         CodeArchitecture/ (Canvas, Network, graph builder)
  components/    navigation/ · cursor/ · common/ (Intro) · ui/ · typography/
  sections/      Hero · About · Projects · Skills · Contact
```
Values that update every frame (scroll, pointer, section) live in a mutable store outside React.
Components read them in `useFrame` or rAF, so they never cause re-renders.

## 9. Creative-director review (done against rendered screenshots at 1440, 1280, 820, 375 and 320px)

| Question | Finding → action |
|---|---|
| Template / AI-generated look? | No cards, gradients or glass. Structure comes from hairlines, indices and type scale. The project panels each use one of three compositions, and parity flips them, so no two neighbours match. |
| Too many effects? | The first pass let the 3D network compete with the hero type. Regular nodes are now muted grey, edges fainter, and the scene recedes behind text-heavy sections (about 0.45, work 0.22, skills 0.16). |
| Is the 3D helping the story? | It is the same node/edge language as the intro graph, the work bus and the skills constellation, so the site reads as one system. Near-camera hub nodes were shrinking into large grey diamonds in Skills/Contact, so hubs got smaller and the camera was pulled back. |
| Does the typography feel intentional? | Only three moments are large: hero, About keywords, contact. Everything else is 11px mono or 15px body. The hero words are sized individually on mobile (BUILD 24vw / DIGITAL 19.5vw / EXPERIENCES. 12.6vw) instead of being shrunk. |
| Is the work section memorable? | The pinned horizontal track carries a signal along the bus that lights each project's node, with a live 0X / 06 counter, title parallax that runs against the track, and image drift inside crop-marked frames. |
| Technical without noise? | Live readouts (pointer coordinates, scroll %, render %) are dim and small, and every one shows real data. Blue only marks state: active node, nav LED, focus, the full stops. |

Defects fixed during review: horizontal clipping of drifting hero type, an empty upper two-thirds in About
(now a diagonal composition), display type overflowing at 320px, the stale cursor mode when content scrolls
under a still pointer, and the hero context being torn down with the intro's GSAP context.
