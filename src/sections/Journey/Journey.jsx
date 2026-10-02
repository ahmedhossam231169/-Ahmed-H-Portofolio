import { useRef } from 'react'
import { journey } from '../../data/journey'
import { cvHref } from '../../data/site'
import SectionLabel from '../../components/typography/SectionLabel'
import { useGsap } from '../../animations/utils/useGsap'
import { lineReveal, metaReveal } from '../../animations/typography/reveal'

/**
 * 02 — Journey: education and training, read like a log.
 * Hairline rows on the 12-column grid. The only accent is the LED on the latest entry.
 */
export default function Journey() {
  const root = useRef(null)

  useGsap(
    ({ motion }) => {
      if (!motion) return
      lineReveal(root.current.querySelector('[data-journey-heading]'))
      root.current.querySelectorAll('[data-journey-row]').forEach((row) => {
        lineReveal(row.querySelector('[data-journey-title]'), { trigger: row, start: 'top 82%' })
        metaReveal(row.querySelectorAll('[data-journey-meta]'), { trigger: row, start: 'top 82%', delay: 0.15 })
      })
    },
    root,
  )

  return (
    <section
      id="journey"
      ref={root}
      data-section="journey"
      tabIndex={-1}
      aria-labelledby="journey-title"
      className="gutter relative py-[16vh] outline-none"
    >
      <SectionLabel index="02" title="Journey" meta="Education · Training" />

      <h2
        id="journey-title"
        data-journey-heading
        className="mt-14 text-[clamp(2.25rem,4.2vw,4rem)] leading-[0.95] font-medium tracking-[-0.045em] uppercase"
      >
        Education
        <br />
        <span className="font-light text-mute">&amp; training.</span>
      </h2>

      <ol className="mt-16 border-b border-line">
        {journey.map((item, i) => (
          <li
            key={item.title}
            data-journey-row
            className="grid gap-4 border-t border-line py-8 md:grid-cols-12 md:gap-8 md:py-10"
          >
            <p data-journey-meta className="meta flex items-center gap-3 self-start text-dim md:col-span-3 md:pt-2">
              {i === 0 && <span className="led" aria-label="Most recent" role="img" />}
              <time>{item.date}</time>
            </p>

            <div className="md:col-span-6">
              <h3
                data-journey-title
                className="text-[clamp(1.5rem,2.6vw,2.5rem)] leading-[1.05] font-medium tracking-[-0.035em]"
              >
                {item.title}
              </h3>
              <p data-journey-meta className="meta mt-3 text-mute">
                {item.org} <span className="text-dim">·</span> {item.place}
              </p>
              {item.text && (
                <p data-journey-meta className="mt-4 max-w-[52ch] text-[15px] leading-relaxed text-mute">
                  {item.text}
                </p>
              )}
            </div>

            {item.tags.length > 0 && (
              <ul
                data-journey-meta
                aria-label="Topics"
                className="meta flex flex-wrap gap-x-3 gap-y-1 self-start text-mute md:col-span-3 md:justify-end md:pt-2 md:text-right"
              >
                {item.tags.map((t, j) => (
                  <li key={t}>
                    {j > 0 && (
                      <span aria-hidden="true" className="mr-3 text-dim">
                        /
                      </span>
                    )}
                    {t}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ol>

      {cvHref && (
        <a
          href={cvHref}
          download
          data-cursor="link"
          className="meta group mt-10 inline-flex items-center gap-3 py-2 text-mute transition-colors hover:text-fg"
        >
          Full details in the CV
          <span aria-hidden="true" className="text-dim">
            ·
          </span>
          <span className="text-fg">Download CV</span>
          <span aria-hidden="true" className="transition-colors group-hover:text-accent">
            ↓
          </span>
        </a>
      )}
    </section>
  )
}
