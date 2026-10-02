/**
 * Section header row: index — title ............ meta
 * The hairline between is the same edge used everywhere else in the system.
 */
export default function SectionLabel({ index, title, meta, className = '' }) {
  return (
    <div className={`meta flex items-center gap-4 text-mute ${className}`} data-section-label>
      <span className="text-fg">
        <span className="text-accent">{index}</span> — {title}
      </span>
      <span aria-hidden="true" className="hairline flex-1" />
      {meta && <span className="text-dim">{meta}</span>}
    </div>
  )
}
