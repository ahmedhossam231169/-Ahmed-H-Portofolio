/**
 * JOURNEY: education and training, newest first (source: CV).
 * There's no paid work on the CV, so this is deliberately not called "experience".
 *
 *  date   string           as written on the CV
 *  title  string
 *  org    string
 *  place  string
 *  text   string | null    one or two short sentences
 *  tags   string[]
 */
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
    place: 'Cairo',
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
]
