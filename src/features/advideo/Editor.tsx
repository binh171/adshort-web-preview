import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../lib/store'
import { buildShotScript, type Beat } from '../../lib/be'
import { FORMATS } from '../../data/formats'

const ASPECTS = ['9:16', '4:5', '1:1'] as const
const LENGTHS = [8, 10, 15] as const
const AR: Record<string, string> = { '9:16': '9/16', '4:5': '4/5', '1:1': '1/1' }

export default function Editor() {
  const nav = useNavigate()
  const { product, formatId, variants, selected, opts, setOpts } = useApp()
  const [beats, setBeats] = useState<Beat[]>([])
  const [loading, setLoading] = useState(true)
  const [caption, setCaption] = useState(true)
  const [captionText, setCaptionText] = useState('Real footage · Install now')
  const [toast, setToast] = useState('')
  const fmt = FORMATS.find((f) => f.id === formatId)
  const v = variants.find((x) => x.id === selected) ?? variants[0]

  useEffect(() => {
    if (!product) { nav('/advideo'); return }
    buildShotScript(formatId ?? 'review', product).then((b) => { setBeats(b); setLoading(false) })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product, formatId])

  if (!product || !v) return null

  const setBeat = (id: string, patch: Partial<Beat>) => setBeats((bs) => bs.map((b) => (b.id === id ? { ...b, ...patch } : b)))
  const flash = (m: string) => { setToast(m); setTimeout(() => setToast(''), 2400) }

  return (
    <div className="stage">
      <button className="back" onClick={() => nav('/advideo/results')}>← Back to variants</button>
      <h2 className="title">Editor — <span style={{ color: 'var(--brand)' }}>{fmt?.name}</span> · {product.productName}</h2>
      <p className="sub">Fine-tune the shot-script beat by beat, trim, caption and pick the aspect — then export. Product stays pinned (element-lock); you edit timing &amp; story, not hallucinated scenes.</p>

      <div className="grid2" style={{ marginTop: 16, gridTemplateColumns: '1.15fr 1fr' }}>
        <div className="panel">
          <h4>Shot-script timeline <span className="betag">⧗ BE brain</span></h4>
          {loading ? <div className="sub" style={{ margin: 0 }}>Loading beats…</div> : (
            <div className="timeline">
              {beats.map((b) => (
                <div className="beat" key={b.id}>
                  <div className="btime mono">{b.tStart}–{b.tEnd}s</div>
                  <div className="bbody">
                    <span className="chip" style={{ alignSelf: 'flex-start' }}>◈ {b.angle}</span>
                    <input className="bin" value={b.action} onChange={(e) => setBeat(b.id, { action: e.target.value })} />
                    <input className="bin vo" value={b.vo} onChange={(e) => setBeat(b.id, { vo: e.target.value })} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="panel" style={{ marginBottom: 14 }}>
            <h4>Preview</h4>
            <div className="edprevwrap">
              <div className="edprev" style={{ aspectRatio: AR[opts.aspect], height: 320, background: v.poster }}>
                <span className="tagf">{v.style} · {opts.aspect} · {opts.length}s</span>
                {caption && <div className="edcap">{captionText}</div>}
              </div>
            </div>
          </div>
          <div className="panel">
            <h4>Controls</h4>
            <div className="ctrl"><span className="k">Aspect (Meta-first)</span><div className="seg">{ASPECTS.map((a) => <button key={a} className={opts.aspect === a ? 'on' : ''} onClick={() => setOpts({ aspect: a })}>{a}</button>)}</div></div>
            <div className="ctrl"><span className="k">Length (trim)</span><div className="seg">{LENGTHS.map((l) => <button key={l} className={opts.length === l ? 'on' : ''} onClick={() => setOpts({ length: l })}>{l}s</button>)}</div></div>
            <div className="ctrl"><span className="k">Music</span><button className={'addon' + (opts.music ? ' on' : '')} onClick={() => setOpts({ music: !opts.music })}>🎵 {opts.music ? 'On' : 'Off'}</button></div>
            <div className="ctrl"><span className="k">Caption</span><button className={'addon' + (caption ? ' on' : '')} onClick={() => setCaption((c) => !c)}>💬 {caption ? 'On' : 'Off'}</button></div>
            {caption && <input className="bin" style={{ width: '100%', marginTop: 8 }} value={captionText} onChange={(e) => setCaptionText(e.target.value)} />}
            <button className="btn pri block lg" style={{ marginTop: 14 }} onClick={() => flash('Exported ' + opts.aspect + ' MP4 · C2PA embedded ✓')}>⬇ Export {opts.aspect} MP4</button>
          </div>
        </div>
      </div>
      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}
