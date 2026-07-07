import { Routes, Route, Navigate, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useApp } from './lib/store'
import Explore from './features/advideo/Explore'
import Console from './features/advideo/Console'
import Generating from './features/advideo/Generating'
import Results from './features/advideo/Results'
import Library from './features/Library'
import FirstRun from './features/onboarding/FirstRun'
import Stub from './features/Stub'

function Shell() {
  const { credits } = useApp()
  const nav = useNavigate()
  const { pathname } = useLocation()
  const tab = (id: string, label: string, to: string) => (
    <button className={'tab' + (pathname.startsWith(to) ? ' on' : '')} onClick={() => nav(to)} key={id}>{label}</button>
  )
  return (
    <div className="shell">
      <div className="topbar">
        <div className="brand"><span className="dot" />AdShort</div>
        <div className="tabs">
          {tab('store', 'Store', '/store')}
          {tab('advideo', 'AdVideo', '/advideo')}
          {tab('product', 'Product', '/product')}
          {tab('library', 'Library', '/library')}
        </div>
        <div className="right">
          <button className="tab" onClick={() => nav('/onboarding')}>▶ First run</button>
          <span className="credits">🎬 <b className="mono">{credits}</b> videos left</span>
          <span className="upgrade">▲ Upgrade</span>
        </div>
      </div>
      <div className="bebanner"><div className="in">
        <b>⚠️ PROTOTYPE — logic/flow real, engine mocked.</b> Steps marked <span className="betag">⧗ BE</span> hit the backend adapter (<code>src/lib/be.ts</code>), mock today → swap to real API when the contract lands. Not a shipped build.
      </div></div>
      <Outlet />
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route element={<Shell />}>
        <Route path="/" element={<Navigate to="/advideo" replace />} />
        <Route path="/onboarding" element={<FirstRun />} />
        <Route path="/advideo" element={<Explore />} />
        <Route path="/advideo/create" element={<Console />} />
        <Route path="/advideo/generating" element={<Generating />} />
        <Route path="/advideo/results" element={<Results />} />
        <Route path="/library" element={<Library />} />
        <Route path="/store" element={<Stub tab="Store" desc="Image editor for product photos (Photoroom-style). Stubbed in this AdVideo-first build." icon="🖼️" />} />
        <Route path="/product" element={<Stub tab="Product" desc="Product library & angle manager. Stubbed in this AdVideo-first build." icon="📦" />} />
        <Route path="*" element={<Navigate to="/advideo" replace />} />
      </Route>
    </Routes>
  )
}
