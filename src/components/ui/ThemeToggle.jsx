import { useStore } from '../../hooks/useStore'
import { setState } from '../../utils/store'

const META = { dark: '#07080a', light: '#f2f1ec' }

/** Dark / light switch. The choice is remembered and applied before first paint (see index.html). */
export function applyTheme(theme) {
  const root = document.documentElement
  // cross-fade colours for the duration of the switch only
  root.classList.add('theme-anim')
  if (theme === 'light') root.dataset.theme = 'light'
  else delete root.dataset.theme
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', META[theme])
  try {
    localStorage.setItem('theme', theme)
  } catch {
    /* storage unavailable: the choice lasts for this visit */
  }
  setState({ theme })
  window.setTimeout(() => root.classList.remove('theme-anim'), 600)
}

export default function ThemeToggle() {
  const theme = useStore('theme')
  const next = theme === 'dark' ? 'light' : 'dark'

  return (
    <button
      type="button"
      onClick={() => applyTheme(next)}
      aria-label={`Switch to ${next} mode`}
      data-cursor="link"
      className="meta group flex items-center gap-2 py-2 text-mute transition-colors hover:text-fg"
    >
      {/* half-filled square: the two modes in one mark */}
      <span aria-hidden="true" className="relative block h-[9px] w-[9px] overflow-hidden border border-current">
        <span className={`absolute inset-y-0 left-0 w-1/2 bg-current transition-transform duration-500 ${theme === 'light' ? 'translate-x-full' : ''}`} />
      </span>
      <span className="hidden sm:inline">Theme</span>
      <span className="text-fg">{theme === 'dark' ? 'Dark' : 'Light'}</span>
    </button>
  )
}
