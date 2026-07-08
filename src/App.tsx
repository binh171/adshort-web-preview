import { Routes, Route, Navigate, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useLayoutEffect, useRef, useState } from 'react'
import { useApp } from './lib/store'
import CommandPalette from './features/CommandPalette'
import Home from './features/Home'
import Explore from './features/advideo/Explore'
import Console from './features/advideo/Console'
import Generating from './features/advideo/Generating'
import Results from './features/advideo/Results'
import Editor from './features/advideo/Editor'
import Library from './features/Library'
import Inbox from './features/Inbox'
import BatchStudio from './features/BatchStudio'
import Trending from './features/Trending'
import Billing from './features/Billing'
import Intelligence from './features/Intelligence'
import Connect from './features/Connect'
import FirstRun from './features/onboarding/FirstRun'
import Stub from './features/Stub'

// line-icon set (one consistent family, replaces mixed emoji) — 16px stroke, currentColor
const ICONS: Record<string, JSX.Element> = {
  advideo: <><path d="M4 5h16v14H4z" /><path d="m10 9 5 3-5 3z" /></>,
  batch: <><rect x="3.5" y="3.5" width="7" height="7" rx="1.2" /><rect x="13.5" y="3.5" width="7" height="7" rx="1.2" /><rect x="3.5" y="13.5" width="7" height="7" rx="1.2" /><rect x="13.5" y="13.5" width="7" height="7" rx="1.2" /></>,
  trending: <><path d="m3 16 5-5 4 4 8-9" /><path d="M15 6h6v6" /></>,
  intel: <><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" /></>,
  library: <><path d="M4 5v15l8-4 8 4V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1z" /></>,
  inbox: <><path d="M4 13h4l2 3h4l2-3h4" /><path d="M5 5h14l2 8v5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-5z" /></>,
}
// grouped nav — Create / Grow / Assets (functional grouping, not a flat row)
const NAV_GROUPS: { id: string; label: string; to: string }[][] = [
  [{ id: 'advideo', label: 'AdVideo', to: '/advideo' }, { id: 'batch', label: 'Batch', to: '/batch' }],
  [{ id: 'trending', label: 'Trending', to: '/trending' }, { id: 'intel', label: 'Intel', to: '/intelligence' }],
  [{ id: 'library', label: 'Library', to: '/library' }, { id: 'inbox', label: 'Inbox', to: '/inbox' }],
]

function Shell() {
  const { credits, demo, setDemo } = useApp()
  const nav = useNavigate()
  const { pathname } = useLocation()
  const segRef = useRef<HTMLDivElement>(null)
  const [slider, setSlider] = useState({ x: 0, w: 0, show: false })

  // measure the active pill and slide the indicator to it (re-run on route + resize)
  useLayoutEffect(() => {
    const measure = () => {
      const seg = segRef.current
      const active = seg?.querySelector('.navpill.on') as HTMLElement | null
      if (!seg || !active) { setSlider(s => ({ ...s, show: false })); return }
      setSlider({ x: active.offsetLeft, w: active.offsetWidth, show: true })
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [pathname])

  return (
    <div className={'shell' + (demo ? ' demo' : '')}>
      <div className="topbar">
        <button className="brand" onClick={() => nav('/home')} title="Home"><span className="dot" />AdShort</button>
        <div className="navseg" ref={segRef}>
          {slider.show && <span className="navslider" style={{ transform: `translateX(${slider.x}px)`, width: slider.w }} />}
          {NAV_GROUPS.map((group, gi) => (
            <div className="navgroup" key={gi}>
              {gi > 0 && <span className="navsep" />}
              {group.map(t => (
                <button key={t.id} className={'navpill' + (pathname.startsWith(t.to) ? ' on' : '')} onClick={() => nav(t.to)}>
                  <svg viewBox="0 0 24 24">{ICONS[t.id]}</svg>{t.label}
                </button>
              ))}
            </div>
          ))}
        </div>
        <div className="right">
          <button className="cmdk-trigger" onClick={() => window.dispatchEvent(new Event('cmdk-open'))} title="Command palette (Cmd/Ctrl + K)">
            <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
            <span className="l">Jump</span><kbd>⌘K</kbd>
          </button>
          <button className="demotoggle" onClick={() => setDemo(!demo)} title={demo ? 'Demo mode ON — click to reveal prototype chrome' : 'Demo mode OFF — click to hide prototype/dev chrome for a clean pitch'}>{demo ? '◉' : '◯'}</button>
          <button className="credits" onClick={() => nav('/billing')}>🎬 <b className="mono">{credits}</b> credits</button>
          <button className="upgrade" onClick={() => nav('/billing')}>▲ Upgrade</button>
        </div>
      </div>
      {!demo && <div className="bebanner"><div className="in">
        <b>⚠️ PROTOTYPE, logic/flow real, engine mocked.</b> Steps marked <span className="betag">⧗ BE</span> hit the backend adapter (<code>src/lib/be.ts</code>), mock today → swap to real API when the contract lands. Not a shipped build.
      </div></div>}
      <CommandPalette />
      <Outlet />
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route element={<Shell />}>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/onboarding" element={<FirstRun />} />
        <Route path="/advideo" element={<Explore />} />
        <Route path="/advideo/create" element={<Console />} />
        <Route path="/advideo/generating" element={<Generating />} />
        <Route path="/advideo/results" element={<Results />} />
        <Route path="/advideo/editor" element={<Editor />} />
        <Route path="/batch" element={<BatchStudio />} />
        <Route path="/trending" element={<Trending />} />
        <Route path="/billing" element={<Billing />} />
        <Route path="/intelligence" element={<Intelligence />} />
        <Route path="/connect" element={<Connect />} />
        <Route path="/inbox" element={<Inbox />} />
        <Route path="/library" element={<Library />} />
        <Route path="/store" element={<Stub tab="Store" desc="Image editor for product photos (Photoroom-style). Stubbed in this AdVideo-first build." icon="🖼️" />} />
        <Route path="/product" element={<Stub tab="Product" desc="Product library & angle manager. Stubbed in this AdVideo-first build." icon="📦" />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Route>
    </Routes>
  )
}
