import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

// ponytail: flat surface list is enough — no fuzzy lib, plain substring match
type Cmd = { label: string; to: string; hint: string }
const CMDS: Cmd[] = [
  { label: 'AdVideo', to: '/advideo', hint: 'Create a video ad' },
  { label: 'Batch Studio', to: '/batch', hint: 'N formats x M angles' },
  { label: 'Trending', to: '/trending', hint: 'Seasonal timing engine' },
  { label: 'Intelligence', to: '/intelligence', hint: 'Performance signals' },
  { label: 'Library', to: '/library', hint: 'Your ads on record' },
  { label: 'Inbox', to: '/inbox', hint: 'Captures from phone' },
  { label: 'Billing', to: '/billing', hint: 'Plans & credits' },
  { label: 'Connect', to: '/connect', hint: 'Meta & Shopify' },
  { label: 'Store', to: '/store', hint: 'Product photo editor' },
  { label: 'Product', to: '/product', hint: 'Product library' },
  { label: 'First run', to: '/onboarding', hint: 'Onboarding flow' },
]

export default function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const [i, setI] = useState(0)
  const nav = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setOpen(o => !o) }
      else if (e.key === 'Escape') setOpen(false)
    }
    const onOpen = () => setOpen(true)
    window.addEventListener('keydown', onKey)
    window.addEventListener('cmdk-open', onOpen)
    return () => { window.removeEventListener('keydown', onKey); window.removeEventListener('cmdk-open', onOpen) }
  }, [])

  useEffect(() => { if (open) { setQ(''); setI(0); setTimeout(() => inputRef.current?.focus(), 20) } }, [open])

  if (!open) return null
  const list = CMDS.filter(c => (c.label + ' ' + c.hint).toLowerCase().includes(q.toLowerCase()))
  const go = (c?: Cmd) => { const t = c || list[i]; if (t) { nav(t.to); setOpen(false) } }
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setI(v => Math.min(v + 1, list.length - 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setI(v => Math.max(v - 1, 0)) }
    else if (e.key === 'Enter') { e.preventDefault(); go() }
  }

  return (
    <div className="cmdk-back" onClick={() => setOpen(false)}>
      <div className="cmdk" onClick={e => e.stopPropagation()} role="dialog" aria-label="Command palette">
        <div className="cmdk-in">
          <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
          <input ref={inputRef} value={q} onChange={e => { setQ(e.target.value); setI(0) }} onKeyDown={onKey}
            placeholder="Jump to a surface..." aria-label="Search surfaces" />
          <kbd>esc</kbd>
        </div>
        <div className="cmdk-list">
          {list.length === 0 && <div className="cmdk-empty">No matches</div>}
          {list.map((c, idx) => (
            <button key={c.to} className={'cmdk-item' + (idx === i ? ' on' : '')}
              onMouseEnter={() => setI(idx)} onClick={() => go(c)}>
              <span className="cmdk-label">{c.label}</span>
              <span className="cmdk-hint">{c.hint}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
