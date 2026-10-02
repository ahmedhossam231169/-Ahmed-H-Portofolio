# Brief — Rewrite "About" + add "Journey" (experience) from the CV

**Goal:** the About copy is generic right now (it could describe any developer). Rewrite it
from Ahmed's real CV (`public/cv/Ahmed_Hossam_CV.pdf`, the same file as the CV he sent),
add a **Journey** section for his education and training, and fill in the empty
**Skills** context. Every fact below comes from the CV or from the project code
(`src/data/projects.js`). **Do not invent anything:** no job titles, companies, years
of experience, or metrics that aren't listed here.

Work within the existing design system (`DESIGN.md`): dark, typographic, hairlines instead
of cards, Geist + Geist Mono, and the blue accent `#2f6bff` only for state/active marks.

---

## 1. Facts from the CV (source of truth)

**Identity**
- Ahmed Hossam, Frontend Developer, Alexandria, Egypt
- Email `ah7428839@gmail.com` · GitHub `ahmedhossam231169` · LinkedIn `ahmed-hossam`
  (all already in `src/data/site.js`)
- Languages: Arabic (native), English B1

**CV "About me" (original wording)**
> Frontend Developer skilled in building responsive, user-focused web applications with
> React.js, Next.js, TypeScript, JavaScript (ES6+), and Tailwind CSS. Completed an accredited
> Frontend Development Diploma at Route Academy and built full projects end-to-end, from
> single-page interfaces to a full-stack developer community platform. Experienced with
> AI-assisted development and automation workflows, with a strong drive for self-learning
> and writing clean, maintainable code.

**Education & training** (no paid work experience is listed on the CV, so don't add any)
| Dates | What | Where |
|---|---|---|
| 02/2025 – 09/2026 | Diploma in Front-End Development | Route Academy, Alexandria |
| 09/2026 | Digitera Program, Technical Track (certificate of completion) | iCareer × Plan International Egypt. Part of the "Ready for Tomorrow" youth employment program, supported by Denmark's Ministry of Foreign Affairs |
| 08/2026 | Claude 101 (prompting, practical use cases, AI-assisted productivity) | Anthropic Academy |
| 2022 – 2026 | Bachelor's degree in Sports Science | Alexandria University |

**Skills on the CV:** HTML5, CSS3, Bootstrap, JavaScript (ES6+), Tailwind CSS, TypeScript,
React.js, Next.js, Git/GitHub, GitLab, Docker, AI-assisted development, end-to-end builds.
The LoopIn project adds: Node.js, Express, Prisma, PostgreSQL, Socket.io, JWT/OAuth, Zod.

**Projects listed on the CV:** LoopIn (full-stack, 06–09/2026), RoutePosts (08–09/2026),
Wanderlust (07/2026). All three are already in `src/data/projects.js`.

---

## 2. About section — `src/sections/About/About.jsx`

**Keep the structure exactly as it is.** There are 3 beats, and their keywords
**Build / Digital / Experiences.** echo the hero headline. The GSAP scrub in
`src/animations/typography/about.js` reads `[data-beat]`, `[data-beat-word]` and
`[data-beat-text]`, so change only the data in `BEATS`, not the markup.

Constraint: the text is set very large (`max-w-[26ch]`, about 1.5–2.6rem). Keep each `text`
to **~18–26 words**, the same length as now, or the pinned stage overflows on laptops.

**Current (generic):** "I'm a frontend developer. I turn ideas and designs into interfaces…" /
"I solve problems creatively…" / "What drives me is building digital experiences people remember…"

**Proposed copy** (written from the CV; show it to Ahmed before committing and adjust the tone if he asks):

```js
const BEATS = [
  {
    word: 'Build',
    label: 'Who I am',
    text: 'I’m Ahmed, a frontend developer from Alexandria. I build web apps with React, Next.js and TypeScript, from the first screen to deployment.',
  },
  {
    word: 'Digital',
    label: 'How I got here',
    text: 'I finished Route Academy’s Frontend Diploma, then went further: REST APIs, auth, real-time chat, and a full-stack platform on Node and PostgreSQL.',
  },
  {
    word: 'Experiences.',
    label: 'What I care about',
    text: 'Clean, maintainable code and interfaces that feel fast. I use AI tools to work faster, and I learn whatever the next project needs.',
  },
]
```

Also update:
- `SectionLabel meta`: keep `"Build · Digital · Experiences"`
- sr-only `<h2>`: `"About — Ahmed Hossam, frontend developer"`
- Optional: a small mono meta line under the stack, in the same style as other `meta` labels:
  `ALEXANDRIA, EG · ARABIC / ENGLISH · OPEN TO WORK`. Ask Ahmed about "open to work" first.

---

## 3. New section — Journey (education & training)

Ahmed asked for an experience section. The CV has **no jobs**, so this section is
**Journey**: education and training, presented honestly. Don't call it "Work Experience".

**Placement:** after About, before Work.
- `src/data/site.js` → `sections`: insert `{ id: 'journey', index: '02', label: 'Journey' }`
  and renumber: Work `03`, Skills `04`, Contact `05`
- Update the `index` props on each section's `SectionLabel` to match
- Add `<Journey />` in `src/App.jsx` between `<About />` and `<Projects />`
- Give the section `data-section="journey"`, so the nav indicator and 3D state pick it up.
  Check `src/three/CodeArchitecture` for a per-section switch and add a case if one exists
- Update the information architecture in `DESIGN.md` §1

**Data:** new file `src/data/journey.js`, newest first:

```js
export const journey = [
  {
    date: '02/2025 — 09/2026',
    title: 'Diploma in Front-End Development',
    org: 'Route Academy',
    place: 'Alexandria',
    text: 'From HTML, CSS and JavaScript to React, Next.js and TypeScript. RoutePosts and FreshCart were built on Route’s APIs.',
    tags: ['React', 'Next.js', 'TypeScript', 'Tailwind'],
  },
  {
    date: '09/2026',
    title: 'Digitera Program — Technical Track',
    org: 'iCareer × Plan International Egypt',
    place: 'Alexandria',
    text: 'Certificate of completion. Professional development and new technical skills, part of the “Ready for Tomorrow” youth employment program.',
    tags: [],
  },
  {
    date: '08/2026',
    title: 'Claude 101',
    org: 'Anthropic Academy',
    place: 'Online',
    text: 'Prompting techniques and best practices for using AI assistants in real development work.',
    tags: ['AI-assisted development'],
  },
  {
    date: '2022 — 2026',
    title: 'B.Sc. Sports Science',
    org: 'Alexandria University',
    place: 'Alexandria',
    text: null,
    tags: [],
  },
]
```

The Sports Science degree has no extra text on purpose. It's honest background, not
something to sell. Ask Ahmed whether he wants it shown at all; if not, remove the entry.

**Layout (follow DESIGN.md):**
- `SectionLabel index="02" title="Journey" meta="Education · Training"`
- Each entry is one row on the 12-column grid with a hairline above it, and no card backgrounds:
  - cols 1–3: `date` in mono `meta` (text-dim)
  - cols 4–9: `title` (Geist 500, h2-ish), with `org · place` under it in mono meta, then `text` in body/mute
  - cols 10–12: `tags` as mono uppercase labels
- On mobile, stack date → title → org → text → tags
- A small blue dot (accent) **only** on the most recent entry, as the "current" state LED
- Motion: reuse `lineReveal` for titles and `metaReveal` for the meta/tags from
  `src/animations/typography/reveal.js`, via `useGsap` (same pattern as the other sections).
  Respect reduced motion; content must be visible without JS animation
- Optional: under the list, one line linking to the CV (`site.cv`):
  `DOWNLOAD CV ↓`, styled like the existing CV link in Hero/Contact

---

## 4. Skills — `src/data/skills.js`

The file says `TODO: replace/extend with your actual skill set and add context`, and every
`context` is `null`, so the detail panel shows "context pending". Replace it with the CV
skill set. Keep the tree shape (`parent` makes edges, `related` makes faint links), but don't
make it too wide, because `layout.js` gives each subtree a wedge sized by its leaf count.
Around 18–22 nodes is fine.

Suggested categories: keep `core, foundation, framework, motion, spatial, tooling`, and add
`backend: { label: 'Backend' }`.

| id | name | category | parent | context (from real projects) |
|---|---|---|---|---|
| html | HTML5 | foundation | core | Semantic, accessible markup in every project, including the Arabic RTL blog Adasa. |
| css | CSS3 | foundation | core | Responsive layouts and design tokens; modular CSS in Wanderlust. |
| js | JavaScript (ES6+) | foundation | core | Framework-free apps: Wanderlust, COSMOS and ContactHub use ES modules, fetch and LocalStorage. |
| ts | TypeScript | foundation | js | Typed front and back end in LoopIn; typed service layers in RoutePosts and FreshCart. |
| react | React | framework | js | LoopIn, RoutePosts and Adasa, plus Context, protected routes and custom hooks. |
| next | Next.js | framework | react | FreshCart: App Router, NextAuth, route protection, server actions. |
| tailwind | Tailwind CSS | tooling | css | v4 in RoutePosts, FreshCart, Adasa and this site. |
| bootstrap | Bootstrap | tooling | css | ContactHub. |
| node | Node.js + Express | backend | ts | LoopIn's REST API (~76 endpoints) with Zod validation and a single error contract. |
| prisma | Prisma + PostgreSQL | backend | node | LoopIn's data layer and migrations. |
| socket | Socket.io | backend | node | LoopIn: real-time chat, typing indicator, presence, live notifications. |
| auth | Auth (JWT / OAuth) | backend | node | LoopIn: GitHub + Google OAuth, rotating refresh tokens. RoutePosts and FreshCart: token auth. |
| gsap | GSAP | motion | js | This portfolio: pinned scroll scenes, SplitText reveals. |
| motion | Motion | motion | react | This portfolio: micro-interactions. |
| lenis | Lenis | motion | gsap | This portfolio: smooth scroll synced to GSAP. |
| three | Three.js | spatial | js | This portfolio's background scene. |
| r3f | React Three Fiber | spatial | react | This portfolio; a 3D product scene for a coffee brand. |
| git | Git / GitHub | tooling | core | Everything versioned on GitHub; GitHub Actions CI on LoopIn. |
| docker | Docker | tooling | git | LoopIn: Dockerfile, docker-compose. |
| ai | AI-assisted dev | tooling | core | Claude 101 (Anthropic Academy); used daily to build and review. |

Suggested `related` links: html↔css, css↔tailwind, js↔react, react↔next, ts↔react,
node↔prisma, react↔socket (client), gsap↔lenis, react↔r3f, three↔r3f.

Keep each `context` to **one short sentence**, about 2–3 lines in the `max-w-[36ch]` detail panel.

---

## 5. Checklist

- [ ] Proposed About copy shown to Ahmed and approved before committing
- [ ] About beats stay at 3 with the same keywords; no markup changes
- [ ] Journey section added; nav indexes renumbered everywhere (site.js, SectionLabels, DESIGN.md)
- [ ] skills.js filled in; no "context pending" left in dev
- [ ] `npm run build` passes; check desktop (pinned About still fits at 1366×768) and mobile
- [ ] No invented facts: everything traces back to §1 or `src/data/projects.js`

---

## 6. Things to tell Ahmed about the CV itself (not the site)

- The **LoopIn** entry in the CV still contains template leftovers: the literal headings
  "Short version (one line):" and "Bullet version:". Keep one version and delete those
  labels before sending the CV anywhere.
- "skills of prompt search for information on the Internet" reads awkwardly. Something
  like "Technical research & documentation" is cleaner.
- The site's `public/cv/Ahmed_Hossam_CV.pdf` is the same file. Replace it after fixing the CV.
