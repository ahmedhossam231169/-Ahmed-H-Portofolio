import { memo } from 'react'
import { AnimatePresence, m } from 'motion/react'
import { categories } from '../../data/skills'

const EASE = [0.16, 1, 0.3, 1]

/**
 * Mobile composition: the same graph read as a branching tree.
 * Each node is a disclosure button, and its details expand inline.
 */
function Branch({ node, depth, selected, onSelect, renderDetail }) {
  const open = selected === node.id
  return (
    <li className="relative">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => onSelect(open ? null : node.id)}
        className="flex min-h-11 w-full items-center gap-3 py-2 text-left"
      >
        <span aria-hidden="true" className="-ml-5 h-px w-4 shrink-0 bg-line-strong" />
        <span
          aria-hidden="true"
          className={`h-[7px] w-[7px] shrink-0 transition-colors ${open ? 'bg-accent' : 'bg-mute'}`}
        />
        <span className={depth === 0 ? 'meta text-fg' : `text-[17px] ${open ? 'text-fg' : 'text-fg/85'}`}>
          {node.name}
        </span>
        <span className="meta ml-auto text-dim">{categories[node.category]?.label}</span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <m.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="pb-4 pl-5">{renderDetail(node.id, { compact: true })}</div>
          </m.div>
        )}
      </AnimatePresence>
      {node.children.length > 0 && (
        <ul className="ml-[3px] border-l border-line pl-5">
          {node.children.map((c) => (
            <Branch
              key={c.id}
              node={c}
              depth={depth + 1}
              selected={selected}
              onSelect={onSelect}
              renderDetail={renderDetail}
            />
          ))}
        </ul>
      )}
    </li>
  )
}

function SkillTree({ layout, selected, onSelect, renderDetail }) {
  return (
    <ul className="pl-5">
      <Branch node={layout.root} depth={0} selected={selected} onSelect={onSelect} renderDetail={renderDetail} />
    </ul>
  )
}

export default memo(SkillTree)
