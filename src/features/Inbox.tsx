import { useEffect, useState, type ReactElement } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../lib/store'
import { fetchInbox, pairPhone, detectProduct, type PhoneItem } from '../lib/be'

// Faux QR (deterministic from seed) — reads as a scan code without a lib.
function qrSvg(seed: string) {
  const N = 21
  const code = seed.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  const isFinder = (x: number, y: number) => {
    const f = (ox: number, oy: number) => x >= ox && x <= ox + 6 && y >= oy && y <= oy + 6
    return f(0, 0) || f(N - 7, 0) || f(0, N - 7)
  }
  const cells: ReactElement[] = []
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    if (isFinder(x, y)) continue
    if ((code * (x + 3) * (y + 7)) % 7 < 3) cells.push(<rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} />)
  }
  const finder = (ox: number, oy: number): ReactElement => (
    <g key={`f${ox}-${oy}`}>
      <rect x={ox} y={oy} width={7} height={7} fill="none" stroke="currentColor" strokeWidth={1} />
      <rect x={ox + 2} y={oy + 2} width={3} height={3} />
    </g>
  )
  return (
    <svg viewBox={`-1 -1 ${N + 2} ${N + 2}`} width="104" height="104" fill="currentColor" shapeRendering="crispEdges" aria-label="pairing QR">
      {cells}{finder(0, 0)}{finder(N - 7, 0)}{finder(0, N - 7)}
    </svg>
  )
}

export default function Inbox() {
  const { setProduct } = useApp()
  const nav = useNavigate()
  const [items, setItems] = useState<PhoneItem[] | null>(null)
  const [pair, setPair] = useState<{ code: string; expiresIn: number } | null>(null)
  const [busy, setBusy] = useState<string | null>(null)

  useEffect(() => { fetchInbox().then(setItems) }, [])

  // Handoff payoff: photos already shot on the phone → detect (⧗ BE) → into the cockpit with
  // the product preset, so the format gallery skips re-upload. Pick a format → straight to console.
  const createFrom = async (it: PhoneItem) => {
    setBusy(it.id)
    const p = await detectProduct(null)
    setProduct({ ...p, productName: it.product })
    nav('/advideo')
  }

  const newCount = items?.filter((i) => i.status === 'new').length ?? 0

  return (
    <div className="stage">
      <div className="crumb"><b>Inbox</b> · the bridge between your phone and this cockpit</div>
      <h2 className="title">From your phone</h2>
      <p className="sub">You shoot products on your phone; the heavy production lives here on the web. Captures and drafts you send from the AdShort app land in this inbox — no re-upload.</p>

      {/* app ⇄ web split — deliberately different surfaces, one cloud-synced draft */}
      <div className="split">
        <div className="side web">
          <div className="lbl">🖥️ Web · production cockpit</div>
          <ul><li>Batch-generate variants</li><li>Deep edit &amp; captions</li><li>Connect &amp; publish to Meta</li><li>Library &amp; performance</li><li>Billing</li></ul>
        </div>
        <div className="arrow">⇄<span>cloud-synced draft</span></div>
        <div className="side app">
          <div className="lbl">📱 Phone · capture &amp; monitor</div>
          <ul><li>Snap product photos</li><li>Quick 1-tap gen</li><li>Watch CPM / CTR live</li><li>Approve or pause on the go</li></ul>
        </div>
      </div>

      {/* QR bridge */}
      <div className="panel qrpanel">
        <div className="qrtxt">
          <h4 style={{ marginBottom: 6 }}>Send from your phone <span className="betag">⧗ BE</span></h4>
          <p className="sub" style={{ marginTop: 0 }}>Pair the AdShort app to push captures straight into this cockpit session.</p>
          {pair
            ? <p className="paircode mono">Pairing code <b>{pair.code}</b> · expires in {pair.expiresIn}s</p>
            : <button className="btn sec" style={{ marginTop: 12 }} onClick={() => pairPhone().then(setPair)}>Pair my phone</button>}
        </div>
        <div className="qrbox">{qrSvg(pair?.code ?? 'ADSHORT')}</div>
      </div>

      <div className="sub" style={{ margin: '22px 0 10px' }}>{items ? `${newCount} new · ${items.length} total` : 'Syncing from your phone…'}</div>
      <div className="libgrid">
        {(items ?? []).map((it) => (
          <div className="card capture" key={it.id}>
            <div className="ph" style={{ background: it.posters[0] }}>
              {it.status === 'new' && <span className="locktag lock">NEW</span>}
              <span className="srcbadge">📱 {it.source} · {it.ago}</span>
              {it.product}
            </div>
            <div className="meta">
              <span className="fmt">{it.kind === 'draft' ? '✎ Draft' : 'Capture'}</span>
              {it.note && <span className="roi" style={{ fontFamily: 'var(--sans)', fontWeight: 500 }}>{it.note}</span>}
            </div>
            <div className="capact">
              <button className="btn pri block" disabled={busy === it.id} onClick={() => createFrom(it)}>
                {busy === it.id ? 'Detecting…' : it.kind === 'draft' ? 'Continue draft →' : 'Create ad →'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
