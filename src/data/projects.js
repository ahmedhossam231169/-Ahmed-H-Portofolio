/**
 * PROJECT DATA (source: projects.md, written from each project's code)
 *
 * Fields
 *  name         string              project title
 *  type         string              short category label (meta line)
 *  description  string              one or two short sentences
 *  highlights   string[]            short points, shown on featured (scale 3) panels only
 *  tech         string[]            key technologies (kept short; the full stack is in the repo)
 *  live         string | null       live URL
 *  github       string | null       repository URL
 *  image        string | null       cover image. Lives in public/project-images/<slug>/cover.webp.
 *                                   If the file is missing, the panel falls back to a generated schematic.
 *  scale        1 | 2 | 3           relative importance → width and composition on the work track.
 *                                   3 = flagship.
 */
const img = (slug) => `${import.meta.env.BASE_URL}project-images/${slug}/cover.webp`

export const projects = [
  {
    name: 'LoopIn',
    type: 'Full-stack platform · real-time',
    description:
      'A LinkedIn-style network for developers. They post code, projects and questions, chat in real time, join communities and import their GitHub repos. Recruiters get talent search, shortlists and job posts.',
    highlights: [
      'REST API with ~76 endpoints',
      'Socket.io chat, presence and live notifications',
      'OAuth + rotating refresh tokens with replay detection',
      'Recruiter talent search and candidate shortlists',
    ],
    tech: ['React', 'TypeScript', 'Node.js', 'Express', 'Prisma', 'PostgreSQL', 'Socket.io', 'Docker'],
    live: 'https://loopin-beta-lovat.vercel.app',
    github: 'https://github.com/ahmedhossam231169/LoopIn',
    image: img('loopin'),
    scale: 3,
  },
  {
    name: 'RoutePosts',
    type: 'Social network · REST API',
    description:
      'A Facebook/Twitter-style social app. Users sign up, publish posts with images, comment, like, share and follow suggested people.',
    highlights: [
      'Full post CRUD with image upload and emoji',
      'Zod + React Hook Form validation, guarded routes',
      'Pull-to-refresh, skeleton loaders, toasts',
      'Typed service layer per API resource',
    ],
    tech: ['React 19', 'TypeScript', 'Tailwind CSS v4', 'HeroUI', 'Zod', 'Axios'],
    live: 'https://route-posts-iota.vercel.app',
    github: 'https://github.com/ahmedhossam231169/RoutePosts',
    image: img('routeposts'),
    scale: 3,
  },
  {
    name: 'FreshCart',
    type: 'E-commerce · Next.js',
    description:
      'An online store: browse products, categories and brands, view product details, and manage a cart and wishlist behind NextAuth authentication.',
    highlights: [
      'NextAuth credentials + JWT session',
      'Route protection via Next.js middleware with callbackUrl',
      'Cart and wishlist with live navbar counters',
      'Server actions and Context',
    ],
    tech: ['Next.js 16', 'React 19', 'TypeScript', 'NextAuth', 'Tailwind CSS v4', 'shadcn/ui'],
    live: null, // not deployed yet
    github: null, // not pushed yet
    image: img('freshcart'),
    scale: 3,
  },
  {
    name: 'Adasa',
    type: 'Photography blog · Arabic RTL',
    description:
      'An Arabic right-to-left blog about photography, with featured and latest articles, categories, and a full article page for each post.',
    tech: ['React 19', 'Vite', 'React Router', 'Tailwind CSS v4', 'HeroUI'],
    live: 'https://adasa-ten.vercel.app',
    github: 'https://github.com/ahmedhossam231169/adasa',
    image: img('adasa'),
    scale: 2,
  },
  {
    name: 'Wanderlust',
    type: 'Travel planner · vanilla JS',
    description:
      'A travel-planning dashboard: pick a country and city to see holidays, long weekends, weather, events, sun times and currency rates, then save favorites into trip plans.',
    tech: ['JavaScript (ES Modules)', 'Fetch API', '6 public APIs', 'LocalStorage'],
    live: 'https://ahmedhossam231169.github.io/Wanderlust/',
    github: 'https://github.com/ahmedhossam231169/Wanderlust',
    image: img('wanderlust'),
    scale: 2,
  },
  {
    name: 'COSMOS',
    type: 'Space dashboard',
    description:
      'NASA’s Astronomy Picture of the Day by date, upcoming rocket launches, and an interactive guide to the planets.',
    tech: ['JavaScript', 'NASA APOD', 'Launch Library 2', 'Solar System OpenData'],
    live: 'https://ahmedhossam231169.github.io/cosmos-space/',
    github: 'https://github.com/ahmedhossam231169/cosmos-space',
    image: img('cosmos'),
    scale: 1,
  },
  {
    name: 'ContactHub',
    type: 'Contact manager · CRUD',
    description:
      'Add, edit, search and delete contacts, mark Favorites and Emergency contacts, with regex validation for Arabic/English names and Egyptian mobile numbers.',
    tech: ['JavaScript', 'Bootstrap 5', 'LocalStorage', 'SweetAlert2'],
    live: 'https://ahmedhossam231169.github.io/ContactHub/',
    github: 'https://github.com/ahmedhossam231169/ContactHub',
    image: img('contacthub'),
    scale: 1,
  },
].map((p, i) => ({ highlights: [], ...p, index: String(i + 1).padStart(2, '0') }))
