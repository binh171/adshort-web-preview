import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../lib/store'
import { FORMATS } from '../data/formats'
import { detectProduct } from '../lib/be'
import { SEASONS, AFFORDANCE, PRODUCT_CATS } from '../data/seasons'
import { PageHead } from './Page'

const MONTH_IDX = new Date().getMonth() // browser-live: engine follows the real calendar
const fmt = (id: string) => FORMATS.find((f) => f.id === id)

export default function Trending() {
  const { product, setProduct, setFormat } = useApp()
  const nav = useNavigate()
  const [cat, setCat] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const now = SEASONS[MONTH_IDX]
  const next = SEASONS[(MONTH_IDX + 1) % 12]
  const aff = cat ? AFFORDANCE[cat] : null

  // route a seasonal/affordance pick straight into creation with the format preset
  const startFormat = async (fid: string) => {
    setBusy(true)
    const p = product ?? (await detectProduct(null))
    setProduct(p)
    setFormat(fid)
    nav('/advideo/create')
  }

  return (
    <div className="stage">
      <PageHead
        eyebrow={<><b>Trending</b> · build for the season before it peaks</>}
        title={<>Trending now · {now.month}</>}
        sub={<>Sellers who pre-stock win the season. We surface what's surging now, what to build for next month, and the right format per category, the contextual routing no competitor does.</>}
      />

      {/* build-ahead: month X built in X−1 */}
      <div className="panel aheadcard">
        <div>
          <div className="aheadlbl">⏭ Build ahead · {next.month}</div>
          <h3 style={{ marginTop: 4 }}>{next.surging[0]}</h3>
          <p className="sub" style={{ marginTop: 2 }}>{next.angle}, start now. Rule: build month X in X−1.</p>
        </div>
        <div className="aheadfmt">
          {next.formatIds.slice(0, 3).map((id) => fmt(id) && (
            <button key={id} className="btn sec" disabled={busy} onClick={() => startFormat(id)}>{fmt(id)!.name} →</button>
          ))}
        </div>
      </div>

      {/* surging now */}
      <h4 className="sech">🔥 Surging now, {now.surging.join(' · ')}</h4>
      <div className="cats" style={{ margin: '0 0 8px' }}>
        <span className="chip" style={{ fontFamily: 'var(--sans)' }}>Angle: {now.angle}</span>
        {now.extra && <span className="chip" style={{ fontFamily: 'var(--sans)' }}>+ {now.extra}</span>}
      </div>
      <div className="trendgrid">
        {now.formatIds.map((id) => {
          const f = fmt(id); if (!f) return null
          return (
            <button key={id} className="card" disabled={busy} onClick={() => startFormat(id)}>
              <div className="ph" style={{ background: f.poster }}>
                <span className="locktag lock">SEASONAL</span>
                {f.fit}
              </div>
              <div className="meta"><span className="fmt">{f.name}</span><span className="roi">{'★'.repeat(f.roi)}</span></div>
            </button>
          )
        })}
      </div>

      {/* category → right format */}
      <h4 className="sech" style={{ marginTop: 24 }}>🎯 Right format for your category</h4>
      <div className="cats">
        {PRODUCT_CATS.map((c) => <button key={c} className={'cat' + (cat === c ? ' on' : '')} onClick={() => setCat(c)}>{c}</button>)}
      </div>
      {aff && (
        <div className="grid2" style={{ marginTop: 12, gridTemplateColumns: '1fr 1fr' }}>
          <div className="panel">
            <h4>✅ Recommended for {cat}</h4>
            <div className="cats" style={{ margin: 0 }}>
              {aff.rec.length
                ? aff.rec.map((id) => fmt(id) && <button key={id} className="cat on" disabled={busy} onClick={() => startFormat(id)}>{fmt(id)!.name} →</button>)
                : <span className="sub" style={{ margin: 0 }}>No LOCK format yet, deferred (try-on/VTON is desktop-heavy, not in the real-footage set).</span>}
            </div>
          </div>
          <div className="panel">
            <h4>⚠️ Suppressed (low-ROI / risky combo)</h4>
            {aff.sup.length
              ? aff.sup.map(([f, why], i) => (
                  <div key={i} className="note" style={{ marginTop: i ? 8 : 0 }}><b>{f === '*' ? 'All formats' : (fmt(f)?.name ?? f)}</b>, {why}</div>
                ))
              : <span className="sub" style={{ margin: 0 }}>Nothing suppressed for this category.</span>}
          </div>
        </div>
      )}
    </div>
  )
}
