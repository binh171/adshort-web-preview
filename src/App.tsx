import { Routes, Route, Navigate, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useApp } from './lib/store'
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
          {tab('batch', '⚡ Batch', '/batch')}
          {tab('trending', '🔥 Trending', '/trending')}
          {tab('intel', '📊 Intel', '/intelligence')}
          {tab('inbox', 'Inbox', '/inbox')}
          {tab('product', 'Product', '/product')}
          {tab('library', 'Library', '/library')}
        </div>
        <div className="right">
          <button className="tab" onClick={() => nav('/onboarding')}>▶ First run</button>
          <button className="credits" onClick={() => nav('/billing')}>🎬 <b className="mono">{credits}</b> videos left</button>
          <button className="upgrade" onClick={() => nav('/billing')}>▲ Upgrade</button>
        </div>
      </div>
      <div className="bebanner"><div className="in">
        <b>⚠️ PROTOTYPE, logic/flow real, engine mocked.</b> Steps marked <span className="betag">⧗ BE</span> hit the backend adapter (<code>src/lib/be.ts</code>), mock today → swap to real API when the contract lands. Not a shipped build.
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
        <Route path="*" element={<Navigate to="/advideo" replace />} />
      </Route>
    </Routes>
  )
}
