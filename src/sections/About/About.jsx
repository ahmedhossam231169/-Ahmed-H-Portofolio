import { useRef } from 'react'
import SectionLabel from '../../components/typography/SectionLabel'
import { site } from '../../data/site'
import { useGsap } from '../../animations/utils/useGsap'
import { aboutDesktop, aboutMobile } from '../../animations/typography/about'

/**
 * 01 — The hero statement, unpacked into three beats.
 * Each keyword carries one part of the story: who, how he got here, what he cares about.
 * Every fact comes from the CV and the projects in src/data/projects.js.
 */
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

export default function About() {
  const root = useRef(null)

  useGsap(
    ({ desktop, motion }) => {
      if (!motion) return
      const stage = root.current.querySelector('[data-about-stage]')
      if (desktop) aboutDesktop(stage)
      else aboutMobile(stage)
    },
    root,
  )

  return (
    <section
      id="about"
      ref={root}
      data-section="about"
      tabIndex={-1}
      aria-labelledby="about-title"
      className="relative outline-none"
    >
      <div data-about-stage className="about-stage gutter relative flex flex-col py-24">
        <SectionLabel index="01" title="About" meta="Build · Digital · Experiences" />
        <h2 id="about-title" className="sr-only">
          About — Ahmed Hossam, frontend developer
        </h2>

        <div className="about-stack mt-16 flex-1">
          {BEATS.map((b, i) => (
            <article key={b.word} data-beat className="about-beat grid gap-6 lg:grid-cols-12 lg:gap-8">
              <div className="lg:col-span-6">
                <p className="meta mb-4 flex items-center gap-3 text-dim">
                  <span className="text-mute">
                    {String(i + 1).padStart(2, '0')} / {String(BEATS.length).padStart(2, '0')}
                  </span>
                  <span aria-hidden="true" className="h-px w-8 bg-line-strong" />
                  {b.label}
                </p>
                <div className="line-mask">
                  <h3
                    data-beat-word
                    className="display text-[clamp(2.5rem,14vw,10rem)] lg:text-[clamp(4rem,9vw,10rem)]"
                  >
                    {b.word.replace('.', '')}
                    {b.word.endsWith('.') && <span className="text-accent">.</span>}
                  </h3>
                </div>
              </div>
              <p
                data-beat-text
                className="max-w-[26ch] text-[clamp(1.5rem,2.7vw,2.6rem)] leading-[1.15] font-light tracking-[-0.025em] lg:col-span-5 lg:col-start-8 lg:self-end"
              >
                {b.text}
              </p>
            </article>
          ))}
        </div>

        <p className="meta mt-16 flex flex-wrap items-center gap-x-3 gap-y-1 text-dim">
          {[site.location, site.languages].filter(Boolean).map((t) => (
            <span key={t} className="flex items-center gap-3">
              {t}
              <span aria-hidden="true">·</span>
            </span>
          ))}
          {site.availability && (
            <span className="flex items-center gap-2 text-fg">
              <span aria-hidden="true" className="led" />
              {site.availability}
            </span>
          )}
        </p>

        <div aria-hidden="true" className="about-progress hairline relative mt-6 hidden overflow-hidden">
          <div data-about-progress className="absolute inset-0 origin-left scale-x-0 bg-fg/50" />
        </div>
      </div>
    </section>
  )
}
