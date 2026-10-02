import { memo } from 'react'
import ProjectVisual from './ProjectVisual'

const VARIANT = { 3: 'feature', 2: 'split', 1: 'compact' }
const DEV = import.meta.env.DEV

/**
 * One project = one node on the work bus.
 * `scale` (from the data) decides width and composition, and index parity flips it,
 * so neighbouring panels never share a layout.
 */
function ProjectPanel({ project, total }) {
  const variant = VARIANT[project.scale] || 'split'
  const flip = Number(project.index) % 2 === 0
  const link = project.live || project.github

  const visual = (
    <ProjectVisual
      project={project}
      variant={variant}
      className={
        variant === 'feature'
          ? 'aspect-[4/5] sm:aspect-[16/10] lg:aspect-auto lg:h-[56vh]'
          : variant === 'split'
            ? 'aspect-[16/10] lg:aspect-auto lg:h-[42vh]'
            : 'aspect-[4/5] lg:aspect-auto lg:h-[48vh]'
      }
    />
  )

  return (
    <article
      data-panel
      aria-labelledby={`p-${project.index}-title`}
      className={`panel panel--${variant} ${flip ? 'panel--flip' : ''}`}
    >
      {/* bus segment */}
      <div className="panel-head meta text-dim" aria-hidden="true">
        <span data-panel-node className="panel-node" />
        <span className="text-mute">
          {project.index}
          <span className="text-dim"> / {String(total).padStart(2, '0')}</span>
        </span>
        <span className="hairline flex-1" />
        {project.year && <span>{project.year}</span>}
      </div>

      <div className="panel-body">
        <div data-panel-visual className="panel-visual">
          {link ? (
            <a
              href={link}
              target="_blank"
              rel="noreferrer"
              data-cursor="view"
              aria-label={`Open ${project.name}${project.live ? ' live site' : ' repository'} (new tab)`}
              className="block"
            >
              {visual}
            </a>
          ) : (
            visual
          )}
        </div>

        <div className="panel-copy">
          <h3
            id={`p-${project.index}-title`}
            data-panel-title
            className="panel-title font-medium tracking-[-0.045em] uppercase"
          >
            {project.name}
          </h3>

          <div className="panel-meta">
            {project.type && (
              <p data-panel-meta className="meta text-dim">
                {project.type}
              </p>
            )}

            {project.description ? (
              <p data-panel-meta className="max-w-[40ch] text-[15px] leading-relaxed text-mute">
                {project.description}
              </p>
            ) : (
              DEV && (
                <p data-panel-meta className="meta text-dim">
                  [ description pending — src/data/projects.js ]
                </p>
              )
            )}

            {variant === 'feature' && project.highlights.length > 0 && (
              <ul data-panel-meta className="flex flex-col gap-1.5 text-[13px] leading-snug text-mute" aria-label="Highlights">
                {project.highlights.map((h) => (
                  <li key={h} className="flex gap-3">
                    <span aria-hidden="true" className="mt-[0.55em] h-px w-3 shrink-0 bg-line-strong" />
                    {h}
                  </li>
                ))}
              </ul>
            )}

            {project.tech.length > 0 && (
              <ul data-panel-meta className="meta flex flex-wrap gap-x-3 gap-y-1 text-mute" aria-label="Technologies">
                {project.tech.map((t, i) => (
                  <li key={t}>
                    {i > 0 && (
                      <span aria-hidden="true" className="mr-3 text-dim">
                        /
                      </span>
                    )}
                    {t}
                  </li>
                ))}
              </ul>
            )}

            {(project.live || project.github) && (
              <div data-panel-meta className="flex gap-6">
                {project.live && <PanelLink href={project.live}>Live site</PanelLink>}
                {project.github && <PanelLink href={project.github}>Source</PanelLink>}
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}

function PanelLink({ href, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      data-cursor="link"
      data-magnetic="0.2"
      className="meta group inline-flex items-center gap-2 py-2 text-fg"
    >
      <span className="relative">
        {children}
        <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-500 ease-[var(--ease-expo)] group-hover:scale-x-100 group-focus-visible:scale-x-100" />
      </span>
      <span aria-hidden="true" className="text-accent">
        ↗
      </span>
      <span className="sr-only">(opens in new tab)</span>
    </a>
  )
}

export default memo(ProjectPanel)
