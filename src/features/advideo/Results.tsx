import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../lib/store'
import { publishToMeta } from '../../lib/be'
import { FORMATS } from '../../data/formats'
import { clip } from '../../lib/img'
import Compliance from './Compliance'
import VideoModal from '../VideoModal'

const CLIPS = ['beauty2', 'beauty3', 'beauty4'] // sample preview per variant

export default function Results() {
  const nav = useNavigate()
  const { variants, selected, setSelected, product, formatId, saveToLibrary, metaConnected } = useApp()
  const [toast, setToast] = useState('')
  const [canExport, setCanExport] = useState(true)
  const [preview, setPreview] = useState<string | null>(null)
  const fmt = FORMATS.find((f) => f.id === formatId)

  if (!variants.length || !product) { nav('/advideo'); return null }

  const flash = (m: string) => { setToast(m); setTimeout(() => setToast(''), 2600) }

  const save = () => {
    const v = variants.find((x) => x.id === selected) ?? variants[0]
    saveToLibrary({ id: 'lib_' + Date.now(), format: fmt?.name ?? 'UGC', product: product.productName, poster: v.poster, winRate: undefined, date: 'today' })
    flash('Saved to library ✓')
  }
  const publish = async () => {
    if (!metaConnected) { nav('/connect'); return } // pre-flight before any handshake
    const r = await publishToMeta(selected ?? 'v0') // ⧗ BE/OAuth
    flash(r.ok ? 'Published to Meta ✓' : r.note)
  }

  return (
    <div className="stage">
      <button className="back" onClick={() => nav('/advideo/create')}>← Tweak the brief</button>
      <h2 className="title">Three takes on your product</h2>
      <p className="sub">All from your real footage. Pick one, tweak inline, then export or save to your library.</p>

      <div className="results3">
        {variants.map((v, i) => (
          <button className={'rv' + (v.id === selected ? ' sel' : '')} key={v.id} onClick={() => { setSelected(v.id); setPreview(clip(CLIPS[i % CLIPS.length])) }}>
            <div className="ph" style={{ background: v.poster }}><span className="tagf">{v.style}</span>0:10 · 9:16</div>
          </button>
        ))}
      </div>

      <div className="trust">
        <span className="t">✓ Your real product</span>
        <span className="t">✓ Fully editable</span>
        <span className="t">✓ C2PA-safe for Meta</span>
        <span className="t">✓ +32% CTR vs static</span>
      </div>

      <div className="addons" style={{ marginBottom: 16 }}>
        <button className="pill" onClick={() => flash('Music swapped ✓')}>🎵 Swap music</button>
        <button className="pill" onClick={() => nav('/advideo/editor')}>✏️ Open editor</button>
        <button className="pill" onClick={() => flash('Mood changed ✓')}>🎬 Change mood</button>
        <button className="pill" onClick={() => nav('/advideo/generating')}>↻ Regenerate</button>
      </div>

      <Compliance category={product.category} formatName={fmt?.name} onGate={setCanExport} />

      <div className="actionbar" style={{ marginTop: 14 }}>
        <button className="btn pri" disabled={!canExport} onClick={() => flash('Exported MP4 (C2PA-embedded, Ads-Manager ready) ✓')}>⬇ Export MP4</button>
        <button className="btn sec" onClick={save}>🗂 Save to library</button>
        <button className="btn sec" onClick={publish}>🔗 {metaConnected ? 'Publish to Meta →' : 'Connect Meta to publish →'}<span className="betag">⧗ BE/OAuth</span></button>
        <span className="spacer">Publish &amp; batch unlock on a plan · export free to verify</span>
      </div>

      {toast && (
        <div style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', background: 'var(--dark)', color: '#eafaf3', padding: '11px 20px', borderRadius: 12, fontSize: '.88rem', fontWeight: 600, boxShadow: 'var(--shadow)', zIndex: 60 }}>{toast}</div>
      )}

      <VideoModal src={preview} onClose={() => setPreview(null)} />
    </div>
  )
}
