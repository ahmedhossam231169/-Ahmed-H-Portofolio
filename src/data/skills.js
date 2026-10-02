/**
 * SKILLS CONSTELLATION
 *
 * Structure is a tree rooted at CORE. `parent` creates the edges.
 * `related` adds cross-links (drawn fainter). `context` is one short sentence
 * of real usage, taken from the projects in src/data/projects.js and the CV.
 */
export const categories = {
  core: { label: 'Core' },
  foundation: { label: 'Foundation' },
  framework: { label: 'Framework' },
  motion: { label: 'Motion' },
  spatial: { label: '3D / WebGL' },
  tooling: { label: 'Tooling' },
}

export const skills = [
  {
    id: 'core',
    name: 'Core',
    category: 'core',
    parent: null,
    context: 'The web platform everything else builds on, across seven projects from vanilla JS dashboards to a full-stack platform.',
  },

  {
    id: 'html',
    name: 'HTML',
    category: 'foundation',
    parent: 'core',
    related: ['css'],
    context: 'Semantic, accessible markup in every project, including the fully right-to-left Arabic blog Adasa.',
  },
  {
    id: 'css',
    name: 'CSS',
    category: 'foundation',
    parent: 'core',
    related: ['tailwind'],
    context: 'Responsive layouts and design tokens, with modular CSS in Wanderlust.',
  },
  {
    id: 'js',
    name: 'JavaScript',
    category: 'foundation',
    parent: 'core',
    related: ['react'],
    context: 'Framework-free apps: Wanderlust, COSMOS and ContactHub run on ES modules, the Fetch API and LocalStorage.',
  },
  {
    id: 'ts',
    name: 'TypeScript',
    category: 'foundation',
    parent: 'js',
    related: ['react', 'next'],
    context: 'Typed front and back end in LoopIn, and typed service layers in RoutePosts and FreshCart.',
  },

  {
    id: 'react',
    name: 'React',
    category: 'framework',
    parent: 'js',
    related: ['r3f', 'motion'],
    context: 'LoopIn, RoutePosts and Adasa, using Context, protected routes and reusable components.',
  },
  {
    id: 'next',
    name: 'Next.js',
    category: 'framework',
    parent: 'react',
    related: ['tailwind'],
    context: 'FreshCart: App Router, NextAuth, route protection through middleware, and server actions.',
  },

  {
    id: 'gsap',
    name: 'GSAP',
    category: 'motion',
    parent: 'js',
    related: ['lenis'],
    context: 'This portfolio: pinned scroll scenes, the horizontal work track and SplitText reveals.',
  },
  {
    id: 'motion',
    name: 'Motion',
    category: 'motion',
    parent: 'react',
    related: [],
    context: 'This portfolio: menu, skill panel and other small interface transitions.',
  },
  {
    id: 'lenis',
    name: 'Lenis',
    category: 'motion',
    parent: 'gsap',
    related: [],
    context: 'This portfolio: smooth scrolling kept in sync with GSAP ScrollTrigger.',
  },

  {
    id: 'three',
    name: 'Three.js',
    category: 'spatial',
    parent: 'js',
    related: ['r3f'],
    context: 'This portfolio: the instanced node network behind every section.',
  },
  {
    id: 'r3f',
    name: 'React Three Fiber',
    category: 'spatial',
    parent: 'react',
    related: [],
    context: 'This portfolio: the 3D scene as React components, lazy-loaded after first paint.',
  },

  {
    id: 'tailwind',
    name: 'Tailwind CSS',
    category: 'tooling',
    parent: 'css',
    related: [],
    context: 'Tailwind v4 in RoutePosts, FreshCart, Adasa and this site; LoopIn’s light and dark themes.',
  },
  {
    id: 'bootstrap',
    name: 'Bootstrap',
    category: 'tooling',
    parent: 'css',
    related: [],
    context: 'ContactHub: Bootstrap 5 layout with SweetAlert2 confirmations.',
  },
  {
    id: 'vite',
    name: 'Vite',
    category: 'tooling',
    parent: 'core',
    related: ['react'],
    context: 'Build tool for LoopIn, RoutePosts, Adasa and this portfolio.',
  },
]
