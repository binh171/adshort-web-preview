import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FORMATS, CATEGORIES } from '../../data/formats'
import { useApp } from '../../lib/store'
import { detectProduct } from '../../lib/be'

export default function Explore() {
  const nav = useNavigate()
  const { setProduct, setFormat, product } = useApp()
  const [cat, setCat] = useState('All')
  const [busy, setBusy] = useState(false)

  const start = async (formatId: string) => {
    setFormat(formatId)
    setBusy(true)
    // ⧗ BE: detect + remove-BG on upload (mock). Skip if already detected.
    const p = product ?? (await detectProduct(null))
    setProduct(p)
    setBusy(false)
    nav('/advideo/create')
  }

  const shown = FORMATS.filter((f) => cat === 'All' || f.category === cat)

  return (
    <div className="stage">
      <div className="crumb"><b>AdVideo</b> · pick a format or start from your product</div>
      <h2 className="title">What are we selling today?</h2>
      <p className="sub">Real product footage in, a scroll-stopping ad out. Pick a proven format — or upload your product and we'll suggest one.</p>

      <div className="startbar">
        <div className="txt">
          <h3>{product ? `✓ ${product.productName}` : 'Start from your product'}</h3>
          <p>{product
            ? 'Ready from your phone — background cut, angles detected. Pick a format below and we skip straight to the brief.'
            : 'Upload your real photos (or send from phone). We detect the product, cut the background, and pick the best angles — no fantasy AI, no "looks-cheap" avatars.'}</p>
        </div>
        <button className="up" onClick={() => start('review')} disabled={busy}>
          <span className="ic">{busy ? '⏳' : product ? '✓' : '⬆'}</span>
          {busy ? 'Detecting…' : product ? 'Use this product' : 'Upload / choose product'}
          <span className="betag">{product ? '📱 from phone' : '⧗ BE detect + remove-BG'}</span>
        </button>
      </div>

      <div className="cats">
        {CATEGORIES.map((c) => (
          <button key={c} className={'cat' + (c === cat ? ' on' : '')} onClick={() => setCat(c)}>{c}</button>
        ))}
      </div>

      <div className="gal">
        {shown.map((f) => (
          <button className="card" key={f.id} onClick={() => start(f.id)} disabled={busy}>
            <div className="ph" style={{ background: f.poster }}>
              {f.lock !== 'defer' && <span className={'locktag ' + f.lock}>{f.lock === 'lock' ? 'TestFlight' : 'Constrain'}</span>}
              {f.fit}
            </div>
            <div className="meta">
              <span className="fmt">{f.name}</span>
              <span className="roi">{'★'.repeat(f.roi)}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
