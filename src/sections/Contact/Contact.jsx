import { useRef } from 'react'
import { site, cvHref } from '../../data/site'
import SectionLabel from '../../components/typography/SectionLabel'
import { useGsap } from '../../animations/utils/useGsap'
import { lineReveal, metaReveal } from '../../animations/typography/reveal'
import { scrollToTarget } from '../../animations/scroll/lenis'

const DEV = import.meta.env.DEV

/** 05: one statement, one action. The 3D network converges behind it. */
export default function Contact() {
  const root = useRef(null)
  const socials = site.socials.filter((s) => s.href)

  useGsap(
    ({ motion }) => {
      if (!motion) return
      lineReveal(root.current.querySelector('[data-contact-title]'), { stagger: 0.12 })
      metaReveal(root.current.querySelectorAll('[data-contact-meta]'), {
        trigger: root.current.querySelector('[data-contact-title]'),
        start: 'top 70%',
        delay: 0.4,
      })
    },
    root,
  )

  return (
    <section
      id="contact"
      ref={root}
      data-section="contact"
      tabIndex={-1}
      aria-labelledby="contact-title"
      className="gutter relative flex min-h-svh flex-col pt-[16vh] pb-8 outline-none"
    >
      <SectionLabel index="05" title="Contact" meta="Open channel" />

      <div className="flex flex-1 flex-col justify-center py-[12vh]">
        <h2
          id="contact-title"
          data-contact-title
          className="display text-[clamp(3rem,10.5vw,12rem)]"
        >
          Let’s build
          <br />
          <span className="font-light">something</span>
          <span className="text-accent">.</span>
        </h2>

        <div className="mt-14 grid gap-10 md:grid-cols-12">
          <div data-contact-meta className="md:col-span-7">
            {site.email ? (
              <a
                href={`mailto:${site.email}`}
                data-cursor="link"
                data-magnetic="0.15"
                className="group inline-flex items-baseline gap-4 text-[clamp(1.25rem,3vw,2.75rem)] font-light tracking-[-0.03em]"
              >
                <span className="relative">
                  {site.email}
                  <span className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-100 bg-line-strong transition-transform duration-700 ease-[var(--ease-expo)] group-hover:origin-left group-hover:bg-accent" />
                </span>
                <span aria-hidden="true" className="text-accent transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1">
                  ↗
                </span>
              </a>
            ) : (
              DEV && <p className="meta text-dim">[ email pending — src/data/site.js ]</p>
            )}
            {site.phone && (
              <p className="meta mt-6 flex items-center gap-3 text-dim">
                <span>Phone</span>
                <span aria-hidden="true" className="h-px w-6 bg-line-strong" />
                <a
                  href={`tel:${site.phone.href}`}
                  data-cursor="link"
                  className="py-2 text-mute tabular-nums transition-colors hover:text-fg"
                >
                  {site.phone.display}
                </a>
              </p>
            )}
          </div>

          {(socials.length > 0 || site.cv) && (
            <ul data-contact-meta className="flex flex-col gap-2 md:col-span-3 md:col-start-10" aria-label="Profiles and CV">
              {socials.map((s) => (
                <li key={s.label}>
                  <ChannelLink href={s.href} external>
                    {s.label}
                  </ChannelLink>
                </li>
              ))}
              {site.cv && (
                <li>
                  <ChannelLink href={cvHref} download="Ahmed_Hossam_CV.pdf">
                    Download CV <span className="text-dim">· PDF</span>
                  </ChannelLink>
                </li>
              )}
            </ul>
          )}
        </div>
      </div>

      <footer className="meta grid grid-cols-2 gap-4 border-t border-line pt-6 text-dim md:grid-cols-4">
        <p>
          © {new Date().getFullYear()} {site.name}
        </p>
        <p className="hidden md:block">{site.role}</p>
        <p className="hidden md:block">Built with React · Three.js · GSAP</p>
        <p className="text-right">
          <a
            href="#top"
            data-cursor="link"
            onClick={(e) => {
              e.preventDefault()
              scrollToTarget('#top')
              document.getElementById('top')?.focus({ preventScroll: true })
            }}
            className="py-2 text-mute transition-colors hover:text-fg"
          >
            Back to top ↑
          </a>
        </p>
      </footer>
    </section>
  )
}

function ChannelLink({ href, external, download, children }) {
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
      {...(download ? { download } : {})}
      data-cursor="link"
      className="meta group flex items-center justify-between border-b border-line py-3 text-mute transition-colors hover:text-fg"
    >
      <span>{children}</span>
      <span aria-hidden="true" className="transition-colors group-hover:text-accent">
        {download ? '↓' : '↗'}
      </span>
      {external && <span className="sr-only">(opens in new tab)</span>}
    </a>
  )
}
