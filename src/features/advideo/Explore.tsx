import { useState, type CSSProperties } from 'react'
import { useNavigate } from 'react-router-dom'
import { FORMATS, CATEGORIES } from '../../data/formats'
import { AFFORDANCE } from '../../data/seasons'
import { useApp } from '../../lib/store'
import { detectProduct, buildBrief } from '../../lib/be'
import { clip } from '../../lib/img'
import HoverVideo from '../HoverVideo'
import { PageHead } from '../Page'

const FMT_CLIP: Record<string, string> = {
  review: 'beauty3', beforeafter: 'beauty4', demo: 'home', unboxing: 'beauty1',
  testimonial: 'beauty2', hero: 'beauty2', turntable: 'beauty4', petreaction: 'pet',
}
const ASPECTS = [
  { id: '9:16', label: '9:16 · Reels / TikTok' },
  { id: '4:5', label: '4:5 · Feed' },
  { id: '1:1', label: '1:1 · Square' },
]
const DURATIONS = ['15s', '10s', '30s']
// quick-start: product category → its best-fit format (affordance routing)
const QUICK = [
  { cat: 'Beauty', fmt: 'beforeafter', ic: '🧴', tone: 'linear-gradient(135deg,#c98a6a,#5a3226)' },
  { cat: 'Supplement', fmt: 'testimonial', ic: '💊', tone: 'linear-gradient(135deg,#7ab98f,#265a3e)' },
  { cat: 'Pet', fmt: 'petreaction', ic: '🐾', tone: 'linear-gradient(135deg,#6a92c9,#26385a)' },
  { cat: 'Home', fmt: 'demo', ic: '🏠', tone: 'linear-gradient(135deg,#c9a86a,#5a4526)' },
]

export default function Explore() {
  const nav = useNavigate()
  const { setProduct, setFormat, product, credits } = useApp()
  const [cat, setCat] = useState('All')
  const [busy, setBusy] = useState(false)
  const [selFmt, setSelFmt] = useState('review')
  const [aspect, setAspect] = useState('9:16')
  const [dur, setDur] = useState('15s')
  const [pop, setPop] = useState<string | null>(null)
  const [focus, setFocus] = useState(false)
  const [detail, setDetail] = useState<string | null>(null)
  const [brief, setBrief] = useState('')

  const go = async (formatId: string) => {
    setFormat(formatId)
    setBusy(true)
    const p = product ?? (await detectProduct(null)) // ⧗ BE detect + remove-BG (mock)
    setProduct(p)
    setBusy(false)
    nav('/advideo/create')
  }
  const quick = async (q: (typeof QUICK)[number]) => {
    setBusy(true)
    const p = await detectProduct(null)
    setProduct({ ...p, category: q.cat })
    setFormat(q.fmt)
    setBusy(false)
    nav('/advideo/create')
  }
  const openDetail = async (formatId: string) => {
    setDetail(formatId)
    setBrief('')
    const b = await buildBrief(formatId, product ?? ({} as never)) // ⧗ BE brain (mock)
    setBrief(b)
  }

  // template-first: recommend formats that fit the detected product's category
  const aff = product?.category ? AFFORDANCE[product.category] : undefined
  const recSet = new Set(aff?.rec ?? [])
  const supMap = new Map<string, string>(aff?.sup ?? [])
  const base = FORMATS.filter((f) => cat === 'All' || f.category === cat)
  const rank = (id: string) => (recSet.has(id) ? 0 : supMap.has(id) ? 2 : 1)
  const shown = aff ? [...base].sort((a, b) => rank(a.id) - rank(b.id)) : base

  const selName = FORMATS.find((f) => f.id === selFmt)?.name ?? 'Pick a format'
  const detailFmt = detail ? FORMATS.find((f) => f.id === detail) : null

  return (
    <div className="stage" onClick={() => setPop(null)}>
      <PageHead
        eyebrow={<><b>AdVideo</b> · your creation cockpit</>}
        title="What are we selling today?"
        sub={<>Real product footage in, a scroll-stopping ad out. Drop a product and generate, or preview a proven format below.</>}
      />

      {/* ===== COCKPIT CONSOLE — the star of the screen ===== */}
      <div className="cockpit">
        <div className={'console2' + (focus ? ' on' : '')} onClick={(e) => e.stopPropagation()}>
          <div className="c2tabs">
            <button className="on">Video</button>
            <button className="ghost" title="Image ads — coming soon">Image</button>
          </div>
          <div className="c2body">
            <button className={'c2slot' + (product ? ' filled' : '')} onClick={() => go(selFmt)} disabled={busy} title="Upload / detect product">
              {product ? <><span className="tick">✓</span><span className="lbl">{product.productName.split(' ').slice(0, 2).join(' ')}</span></> : <><span className="plus">+</span><span className="lbl">Product</span></>}
            </button>
            <div
              className="c2prompt"
              contentEditable
              suppressContentEditableWarning
              data-ph="Paste your Shopify / product URL, or describe the ad you want — we write the shot-script."
              onFocus={() => setFocus(true)}
              onBlur={() => setFocus(false)}
            />
          </div>
          <div className="c2bar">
            <div className="c2chip-wrap">
              <button className={'c2chip' + (pop === 'fmt' ? ' open' : '')} onClick={(e) => { e.stopPropagation(); setPop(pop === 'fmt' ? null : 'fmt') }}>
                <span className="k">Format</span> {selName} <span className="cv">▾</span>
              </button>
              {pop === 'fmt' && (
                <div className="c2pop">
                  <div className="pl">Format</div>
                  {FORMATS.map((f) => (
                    <button key={f.id} className={'opt' + (f.id === selFmt ? ' sel' : '')} onClick={(e) => { e.stopPropagation(); setSelFmt(f.id); setPop(null) }}>
                      {f.name}{recSet.has(f.id) && <span className="ct">✓ fits {product!.category}</span>}
                      <span className="hint">{f.fit}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="c2chip-wrap">
              <button className={'c2chip' + (pop === 'ar' ? ' open' : '')} onClick={(e) => { e.stopPropagation(); setPop(pop === 'ar' ? null : 'ar') }}>{aspect} <span className="cv">▾</span></button>
              {pop === 'ar' && (
                <div className="c2pop">
                  <div className="pl">Aspect</div>
                  {ASPECTS.map((a) => <button key={a.id} className={'opt' + (a.id === aspect ? ' sel' : '')} onClick={(e) => { e.stopPropagation(); setAspect(a.id); setPop(null) }}>{a.label}</button>)}
                </div>
              )}
            </div>
            <div className="c2chip-wrap">
              <button className={'c2chip' + (pop === 'dur' ? ' open' : '')} onClick={(e) => { e.stopPropagation(); setPop(pop === 'dur' ? null : 'dur') }}>{dur} <span className="cv">▾</span></button>
              {pop === 'dur' && (
                <div className="c2pop">
                  <div className="pl">Duration</div>
                  {DURATIONS.map((d) => <button key={d} className={'opt' + (d === dur ? ' sel' : '')} onClick={(e) => { e.stopPropagation(); setDur(d); setPop(null) }}>{d}</button>)}
                </div>
              )}
            </div>
            <span className="c2grow" />
            <span className="c2cnt">◱ 3 credits <span className="of">/ {credits}</span></span>
            <button className="c2go" onClick={() => go(selFmt)} disabled={busy}>{busy ? 'Detecting…' : <>⚡ Generate</>}</button>
          </div>
        </div>

        <div className="qstart">
          <span className="ql">Quick start</span>
          {QUICK.map((q) => (
            <button key={q.cat} className="qpill" onClick={() => quick(q)} disabled={busy}>
              <span className="ic" style={{ background: q.tone }}>{q.ic}</span>{q.cat} ad
            </button>
          ))}
          <span className="betag">⧗ BE detect + remove-BG</span>
        </div>
      </div>

      {/* ===== TEMPLATE GALLERY — tap to preview ===== */}
      <div className="galhead">
        <h3>{aff ? <>Formats that fit <b>{product!.category}</b></> : 'Proven formats'}</h3>
        <span className="sub" style={{ margin: 0 }}>{aff ? 'Dimmed = we’d skip it for this category, with why.' : 'Tap a card to preview the shot-script.'}</span>
      </div>
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
            <button className={'card' + (supReason ? ' dim' : '')} key={f.id} onClick={() => openDetail(f.id)} style={{ '--i': i } as CSSProperties}>
              <HoverVideo className="ph" poster={f.poster} src={clip(FMT_CLIP[f.id] ?? 'beauty2')} cta="▶ Preview">
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

      {/* ===== FORMAT DETAIL MODAL (TikTok-style: preview + brief + CTA) ===== */}
      {detailFmt && (
        <div className="fmtback" onClick={() => setDetail(null)}>
          <div className="fmtmodal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <button className="fmtx" onClick={() => setDetail(null)} aria-label="Close">✕</button>
            <div className="fmtgrid">
              <HoverVideo className="fmtplay" poster={detailFmt.poster} src={clip(FMT_CLIP[detailFmt.id] ?? 'beauty2')}>
                <span className="dur">{dur}</span>
              </HoverVideo>
              <div className="fmtcol">
                <h3>{detailFmt.name}</h3>
                <div className="fmtchips">
                  <span className="oc">Fits <b>{detailFmt.fit}</b></span>
                  <span className="oc">ROI <b>{'★'.repeat(detailFmt.roi)}</b></span>
                  <span className="oc">{detailFmt.lock === 'lock' ? 'TestFlight-ready' : detailFmt.lock === 'constrain' ? 'Constrained' : 'Deferred'}</span>
                </div>
                <div className="fmtcard">
                  <h4>Shot-script <span className="betag">⧗ BE brain</span></h4>
                  <p>{brief || 'Writing the shot-script…'}</p>
                </div>
                <button className="btn pri block" disabled={busy} onClick={() => go(detailFmt.id)}>{busy ? 'Detecting…' : '✦ Use this format →'}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
