import { useState, type CSSProperties } from 'react'
import { useNavigate } from 'react-router-dom'
import { FORMATS, CATEGORIES } from '../../data/formats'
import { AFFORDANCE } from '../../data/seasons'
import { useApp } from '../../lib/store'
import { detectProduct } from '../../lib/be'
import { clip } from '../../lib/img'
import HoverVideo from '../HoverVideo'

const FMT_CLIP: Record<string, string> = {
  review: 'beauty3', beforeafter: 'beauty4', demo: 'home', unboxing: 'beauty1',
  testimonial: 'beauty2', hero: 'beauty2', turntable: 'beauty4', petreaction: 'pet',
}

export default function Explore() {
  const nav = useNavigate()
  const { setProduct, setFormat, product } = useApp()
  const [cat, setCat] = useState('All')
  const [busy, setBusy] = useState(false)

  const start = async (formatId: string) => {
    setFormat(formatId)
    setBusy(true)
    const p = product ?? (await detectProduct(null)) // ⧗ BE detect + remove-BG (mock)
    setProduct(p)
    setBusy(false)
    nav('/advideo/create')
  }

  // template-first: once the product is known, recommend formats that fit its category
  // (contextual routing) and dim the ones we'd skip, with the reason.
  const aff = product?.category ? AFFORDANCE[product.category] : undefined
  const recSet = new Set(aff?.rec ?? [])
  const supMap = new Map<string, string>(aff?.sup ?? [])

  const base = FORMATS.filter((f) => cat === 'All' || f.category === cat)
  const rank = (id: string) => (recSet.has(id) ? 0 : supMap.has(id) ? 2 : 1)
  const shown = aff ? [...base].sort((a, b) => rank(a.id) - rank(b.id)) : base

  return (
    <div className="stage">
      <div className="crumb"><b>AdVideo</b> · pick a format or start from your product</div>
      <h2 className="title">What are we selling today?</h2>
      <p className="sub">Real product footage in, a scroll-stopping ad out. Pick a proven format, or upload your product and we'll suggest one.</p>

      {aff ? (
        <div className="recbar">
          <b>Recommended for {product!.productName} · {product!.category}</b>
          <span>These formats fit {product!.category} best. Dimmed ones we'd skip for this category, with why, so you don't burn a test.</span>
        </div>
      ) : (
        <div className="startbar">
          <div className="txt">
            <h3>{product ? `✓ ${product.productName}` : 'Start from your product'}</h3>
            <p>{product
              ? 'Ready from your phone, background cut, angles detected. Pick a format below and we skip straight to the brief.'
              : 'Upload your real photos (or send from phone). We detect the product, cut the background, and pick the best angles, no fantasy AI, no "looks-cheap" avatars.'}</p>
          </div>
          <button className="up" onClick={() => start('review')} disabled={busy}>
            <span className="ic">{busy ? '⏳' : product ? '✓' : '⬆'}</span>
            {busy ? 'Detecting…' : product ? 'Use this product' : 'Upload / choose product'}
            <span className="betag">{product ? '📱 from phone' : '⧗ BE detect + remove-BG'}</span>
          </button>
        </div>
      )}

      <div className="cats">
        {CATEGORIES.map((c) => (
          <button key={c} className={'cat' + (c === cat ? ' on' : '')} onClick={() => setCat(c)}>{c}</button>
        ))}
      </div>

      <div className="gal">
        {shown.map((f, i) => {
          const rec = recSet.has(f.id)
          const supReason = supMap.get(f.id)
          return (
            <button className={'card' + (supReason ? ' dim' : '')} key={f.id} onClick={() => start(f.id)} disabled={busy} style={{ '--i': i } as CSSProperties}>
              <HoverVideo className="ph" poster={f.poster} src={clip(FMT_CLIP[f.id] ?? 'beauty2')}>
                {f.lock !== 'defer' && <span className={'locktag ' + f.lock}>{f.lock === 'lock' ? 'TestFlight' : 'Constrain'}</span>}
                {rec && <span className="recflag">✓ Fits {product!.category}</span>}
                {f.fit}
              </HoverVideo>
              <div className="meta">
                <span className="fmt">{f.name}</span>
                <span className="roi">{'★'.repeat(f.roi)}</span>
              </div>
              {supReason && <div className="supreason">Skip for {product!.category}: {supReason}</div>}
            </button>
          )
        })}
      </div>
    </div>
  )
}
