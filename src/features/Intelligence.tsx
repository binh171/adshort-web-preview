import { useApp, type LibraryItem } from '../lib/store'

// Honest signals (USP #2/#8): Fresh / Scale / Refresh — never a blind "Winner/Loser".
// Post-ATT reality: CTR/hold/frequency are pixel-clean; ROAS needs $1.5–2k for significance.
const BASELINE_CTR = 1.5

type Metric = { ctr: number; hold: number; freq: number; spend: number; conf: 'low' | 'building' | 'significant'; rec: string; why: string }

// ⧗ BE: real metrics come from the seller's Meta pixel. Mock derives from library fields.
function analyze(i: LibraryItem): Metric {
  const ctr = i.ctr ?? 1.6
  const hold = Math.round(48 + (i.winRate ?? 60) * 0.35)
  const freq = i.status === 'fatigued' ? 3.1 : i.status === 'scaling' ? 1.7 : 2.2
  const spend = i.spend ?? 0
  const conf: Metric['conf'] = spend >= 500 ? 'significant' : spend >= 200 ? 'building' : 'low'
  let rec = 'Keep testing', why = `Only $${spend} spent, below significance. Give it ~$${Math.max(0, 500 - spend)} more before a scale call.`
  if (i.status === 'fatigued') {
    rec = 'Refresh'; why = `Frequency ${freq}× (fatigue) and CTR sliding. Fresh creative on the same offer, don't kill a working product.`
  } else if (conf === 'significant' && ctr >= 2) {
    rec = 'Scale'; why = `CTR ${ctr}% vs ${BASELINE_CTR}% baseline, hold-rate ${hold}%, significant at $${spend}. Raise budget 20-30%.`
  }
  return { ctr, hold, freq, spend, conf, rec, why }
}

export default function Intelligence() {
  const { library } = useApp()
  const rows = library.map((i) => ({ i, m: analyze(i) }))
  const scaling = rows.filter((r) => r.m.rec === 'Scale').length
  const refresh = rows.filter((r) => r.m.rec === 'Refresh').length

  return (
    <div className="stage">
      <div className="crumb"><b>Intelligence</b> · honest signals, why, not just a score</div>
      <h2 className="title">What to scale, what to refresh</h2>
      <p className="sub">Pixel-clean CTR, hold-rate &amp; frequency with a confidence band, and the <b>reason</b> behind every call. No blind "winner/loser": Motion shows a number, we tell you why. <span className="betag">⧗ BE metrics (Meta pixel)</span></p>

      <div className="insights">
        <div className="insight"><div className="v">{rows.length}</div><div className="k">Ads tracked</div></div>
        <div className="insight"><div className="v">{scaling}</div><div className="k">Ready to scale</div></div>
        <div className="insight"><div className="v">{refresh}</div><div className="k">Need refresh</div></div>
        <div className="insight"><div className="v" style={{ fontSize: '1rem' }}>CTR {BASELINE_CTR}%</div><div className="k">Your baseline</div></div>
      </div>

      <div className="intellist">
        {rows.map(({ i, m }) => (
          <div className="intelrow" key={i.id}>
            <div className="ithumb" style={{ background: i.poster }} />
            <div className="imeta">
              <div><b>{i.product}</b> <span className="sub" style={{ margin: 0 }}>· {i.format}</span></div>
              <div className="imetrics">
                <span>CTR <b>{m.ctr}%</b></span>
                <span>Hold <b>{m.hold}%</b></span>
                <span>Freq <b>{m.freq}×</b></span>
                <span>Spend <b>${m.spend}</b></span>
                <span className={'conf ' + m.conf}>● {m.conf}</span>
              </div>
            </div>
            <div className="irec">
              <span className={'recpill ' + m.rec.split(' ')[0].toLowerCase()}>{m.rec}</span>
              <div className="iwhy">{m.why}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
