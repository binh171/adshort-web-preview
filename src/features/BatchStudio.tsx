import { useState } from 'react'
import { useApp } from '../lib/store'
import { FORMATS } from '../data/formats'
import { detectProduct, streamBatch, type BatchCell, type BatchCombo } from '../lib/be'

const WIN_GATE = 70 // predicted win% at/above this = a "keeper"

export default function BatchStudio() {
  const { product, setProduct, credits, spend, saveToLibrary } = useApp()
  const [selF, setSelF] = useState<string[]>(['review', 'beforeafter'])
  const [selA, setSelA] = useState<string[]>([])
  const [busy, setBusy] = useState(false)
  const [running, setRunning] = useState(false)
  const [done, setDone] = useState(false)
  const [cells, setCells] = useState<BatchCell[]>([])
  const [pct, setPct] = useState(0)
  const [status, setStatus] = useState('')

  const lockable = FORMATS.filter((f) => f.lock !== 'defer')
  const toggle = (arr: string[], set: (v: string[]) => void, id: string) =>
    set(arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id])

  // combos = selected formats × selected angles
  const combos: BatchCombo[] = product
    ? selF.flatMap((fid) => selA.map((aid) => ({
        formatId: fid,
        formatName: FORMATS.find((f) => f.id === fid)!.name,
        angleId: aid,
        angle: product.angles.find((a) => a.id === aid)!.label,
      })))
    : []
  const K = combos.length
  const enough = credits >= K

  const detectSample = async () => {
    setBusy(true)
    const p = await detectProduct(null)
    setProduct(p)
    setSelA(p.angles.map((a) => a.id)) // default: all angles selected
    setBusy(false)
  }

  const run = async () => {
    if (!K || !enough) return
    setRunning(true); setDone(false); setCells([]); setPct(0)
    spend(K) // ⧗ BE: batch consumes K credits
    for await (const s of streamBatch(combos)) { setCells(s.cells); setPct(s.pct); setStatus(s.status) }
    setRunning(false); setDone(true)
  }

  const keepers = cells.filter((c) => (c.winPred ?? 0) >= WIN_GATE)
  const saveWinners = () => {
    keepers.forEach((c) => saveToLibrary({
      id: `batch-${c.id}-${c.formatName}`,
      format: c.formatName,
      product: product!.productName,
      poster: c.poster,
      winRate: c.winPred,
      date: 'today',
      category: product!.category,
      status: 'fresh', // just generated — no live performance yet
    }))
  }

  return (
    <div className="stage">
      <div className="crumb"><b>Batch Studio</b> · test many angles at once — the web-only wedge</div>
      <h2 className="title">Batch Studio</h2>
      <p className="sub">Pick a few formats and a few real angles — generate the whole matrix in one run. <b>Test 15 winning angles for the price of one Fiverr video.</b> Your phone gens one at a time; the cockpit gens the grid.</p>

      {!product ? (
        <div className="stub" style={{ marginTop: 24 }}>
          <div className="ic">📦</div>
          <h3>Start from a product</h3>
          <p>Pick a product (or open Inbox to use a phone capture). We detect its angles, then you build the matrix.</p>
          <button className="btn pri" style={{ marginTop: 16 }} disabled={busy} onClick={detectSample}>
            {busy ? 'Detecting…' : 'Detect a sample product'} <span className="betag">⧗ BE</span>
          </button>
        </div>
      ) : (
        <>
          <div className="panel" style={{ marginTop: 16 }}>
            <h4>1 · Formats <span className="sub" style={{ margin: 0, textTransform: 'none', letterSpacing: 0 }}>({selF.length} picked · TestFlight-safe only)</span></h4>
            <div className="cats" style={{ margin: '0 0 6px' }}>
              {lockable.map((f) => (
                <button key={f.id} className={'cat' + (selF.includes(f.id) ? ' on' : '')} onClick={() => toggle(selF, setSelF, f.id)}>{f.name}</button>
              ))}
            </div>
            <h4 style={{ marginTop: 14 }}>2 · Real angles <span className="sub" style={{ margin: 0, textTransform: 'none', letterSpacing: 0 }}>({product.productName})</span></h4>
            <div className="cats" style={{ margin: 0 }}>
              {product.angles.map((a) => (
                <button key={a.id} className={'cat' + (selA.includes(a.id) ? ' on' : '')} onClick={() => toggle(selA, setSelA, a.id)}>◈ {a.label}</button>
              ))}
            </div>
          </div>

          <div className="actionbar" style={{ marginTop: 14 }}>
            <div>
              <div className="bcount"><b>{K}</b> variant{K === 1 ? '' : 's'} <span className="sub" style={{ margin: 0 }}>= {selF.length} format × {selA.length} angle</span></div>
              <div className="cost" style={{ textAlign: 'left', marginTop: 2 }}>≈ {K} credits · ${(K * 0.45).toFixed(2)}–{(K * 0.88).toFixed(2)} <span className="betag">⧗ BE gen/render</span></div>
            </div>
            <div className="spacer" />
            {!enough && K > 0 && <span className="sub" style={{ margin: 0, color: 'var(--leak)' }}>Need {K} credits (have {credits})</span>}
            <button className="btn pri lg" disabled={!K || !enough || running} onClick={run}>
              {running ? 'Rendering matrix…' : `⚡ Generate ${K || ''} variant${K === 1 ? '' : 's'}`}
            </button>
          </div>

          {(running || done) && (
            <div style={{ marginTop: 18 }}>
              {running && <>
                <div className="status">{status}</div>
                <div className="prog"><div className="fill" style={{ width: pct + '%' }} /></div>
              </>}
              {done && <div className="actionbar" style={{ marginBottom: 14 }}>
                <b>✓ {cells.length} rendered · {keepers.length} predicted keepers (win ≥ {WIN_GATE}%)</b>
                <div className="spacer" />
                <button className="btn sec" disabled={!keepers.length} onClick={saveWinners}>💾 Save {keepers.length} winners to Library</button>
              </div>}
              {done && <div className="note" style={{ marginBottom: 14 }}>🧬 <b>Hybrid mix tip:</b> these are AI test variants. Pair the top keeper with <b>one real-creator proof clip</b> — the 80% AI-test / 20% real-proof mix converts +23% and hardens Meta compliance.</div>}
              <div className="bgrid">
                {cells.map((c) => (
                  <div className={'bcell' + (c.ready ? ' done' : '')} key={c.id}>
                    <div className="ph" style={{ background: c.ready ? c.poster : 'var(--panel-2)' }}>
                      {!c.ready && <div className="spin" />}
                      {c.ready && <span className="winpred" style={{ background: (c.winPred! >= WIN_GATE) ? 'var(--brand)' : 'rgba(10,20,15,.6)' }}>win {c.winPred}%</span>}
                    </div>
                    <div className="blabel"><b>{c.formatName}</b><span>◈ {c.angle}</span></div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
