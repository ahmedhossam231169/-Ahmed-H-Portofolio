import { useStore } from '../../hooks/useStore'
import { setState } from '../../utils/store'
import { enableAudio, play } from '../../utils/sound'

/** Sound is off by default. Turning it on is an explicit user gesture, so the AudioContext can start. */
export default function SoundToggle() {
  const on = useStore('sound')

  const toggle = () => {
    const next = !on
    if (next) enableAudio()
    setState({ sound: next })
    if (next) requestAnimationFrame(() => play('select'))
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={on}
      aria-label={on ? 'Turn interface sound off' : 'Turn interface sound on'}
      data-cursor="link"
      className="meta group flex items-center gap-2 py-2 text-mute transition-colors hover:text-fg"
    >
      <span aria-hidden="true" className="flex h-3 items-end gap-[2px]">
        {[0.5, 1, 0.7, 0.35].map((h, i) => (
          <span
            key={i}
            className={`w-px origin-bottom transition-all duration-500 ${on ? 'bg-accent' : 'bg-current'}`}
            style={{
              height: `${(on ? h : 0.2) * 100}%`,
              animation: on ? `eq 1.${2 + i}s ${i * 0.1}s ease-in-out infinite alternate` : 'none',
            }}
          />
        ))}
      </span>
      <span className="hidden sm:inline">Sound</span>
      <span className={on ? 'text-fg' : ''}>{on ? 'On' : 'Off'}</span>
    </button>
  )
}
