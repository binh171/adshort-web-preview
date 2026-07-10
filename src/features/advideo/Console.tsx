import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../lib/store'
import { buildBrief } from '../../lib/be'
import { FORMATS } from '../../data/formats'
import { PageHead } from '../Page'
import { Music, Mic, Camera, Sparkles, Settings } from 'lucide-react'

const ASPECTS = ['9:16', '4:5', '1:1'] as const
const LENGTHS = [8, 10, 15] as const

export default function Console() {
  const nav = useNavigate()
  const { product, formatId, brief, setBrief, opts, setOpts } = useApp()
  const [loading, setLoading] = useState(true)
  const fmt = FORMATS.find((f) => f.id === formatId)

  useEffect(() => {
    if (!product || !formatId) { nav('/advideo'); return }
    let live = true
    setLoading(true)
    // ⧗ BE: brain writes the shot-script.
    buildBrief(formatId, product).then((b) => { if (live) { setBrief(b); setLoading(false) } })
    return () => { live = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product, formatId])

  if (!product) return null
  // render {token} placeholders as readable angle references
  const display = brief.replace(/\{(\w+)\}/g, '◈ $1')

  return (
    <div className="stage">
      <button className="back" onClick={() => nav('/advideo')}>← Back to formats</button>
      <PageHead
        title={<>Brief: <span style={{ color: 'var(--brand)' }}>{fmt?.name}</span> · {product.productName}</>}
        sub={<>The brain wrote the shot-script from your format. The ◈ chips are <b>your real product angles</b>. Edit any word before generating.</>}
      />

      <div className="grid2" style={{ marginTop: 16 }}>
        <div className="panel">
          <h4>Shot-script (editable) <span className="betag">⧗ BE brain</span></h4>
          <textarea
            className="brief"
            style={{ width: '100%', resize: 'vertical', fontFamily: 'var(--sans)' }}
            rows={7}
            value={loading ? 'Writing your shot-script…' : display}
            onChange={(e) => setBrief(e.target.value)}
            disabled={loading}
          />
          <div className="angles">
            {product.angles.map((a) => (
              <div className="angle" key={a.id} style={{ background: a.url }}>{a.label}</div>
            ))}
            <div className="angle add" title="add another real angle">+</div>
          </div>
          <div className="note"><Settings size={13} style={{ verticalAlign: '-2px', marginRight: 5, opacity: 0.85 }} />Engine (real-footage): these animate <b>your uploaded angles</b> via i2v + compose, not a text-to-fantasy model. Product stays pinned (element-lock); only safe knobs are editable.</div>
        </div>

        <div className="panel">
          <h4>Controls</h4>
          <div className="ctrl"><span className="k">Aspect (Meta-first)</span>
            <div className="seg">{ASPECTS.map((a) => <button key={a} className={opts.aspect === a ? 'on' : ''} onClick={() => setOpts({ aspect: a })}>{a}</button>)}</div>
          </div>
          <div className="ctrl"><span className="k">Length</span>
            <div className="seg">{LENGTHS.map((l) => <button key={l} className={opts.length === l ? 'on' : ''} onClick={() => setOpts({ length: l })}>{l}s</button>)}</div>
          </div>
          <div className="ctrl"><span className="k">Hook</span><div className="seg"><button className="on">{opts.hook}</button></div></div>
          <h4 style={{ marginTop: 16 }}>Add-ons</h4>
          <div className="addons toggles">
            <button className={'addon' + (opts.music ? ' on' : '')} onClick={() => setOpts({ music: !opts.music })}><Music size={15} /> Music · Upbeat</button>
            <button className="addon"><Mic size={15} /> Voiceover</button>
            <button className="addon"><Camera size={15} /> Camera push-in</button>
          </div>
          <button className="btn pri block lg" style={{ marginTop: 16 }} disabled={loading} onClick={() => nav('/advideo/generating')}><Sparkles size={18} /> Generate 3 variants</button>
          <div className="cost">≈ 3 videos · {opts.aspect} · {opts.length}s <span className="betag">⧗ BE gen/render</span></div>
        </div>
      </div>

      <div className="ctobar">
        <b>CTO, feasible with today's engine?</b> Yes: Seedream/NB elevate → Kling 2.5T i2v (animate real angles) → ffmpeg compose · ~$0.45-0.88/clip.
        <div><span className="k">real-angle gate</span><span className="k">brain shot-script</span><span className="k">i2v not t2v</span><span className="k">⚠ 3× latency → parallel + progressive reveal</span></div>
      </div>
    </div>
  )
}
