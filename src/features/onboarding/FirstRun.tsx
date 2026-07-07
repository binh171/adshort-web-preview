import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../lib/store'
import { detectProduct } from '../../lib/be'

const EX = [
  { cat: 'Skincare', fmt: 'review', dur: '0:10' },
  { cat: 'Pet', fmt: 'demo', dur: '0:08' },
  { cat: 'Supplement', fmt: 'testimonial', dur: '0:12' },
]

export default function FirstRun() {
  const nav = useNavigate()
  const { setProduct, setFormat } = useApp()
  const [busy, setBusy] = useState(false)
  const [url, setUrl] = useState('')
  const [drag, setDrag] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const begin = async (files: File[] | null) => {
    setBusy(true)
    setFormat('review')
    const p = await detectProduct(files)
    setProduct(p)
    setBusy(false)
    nav('/advideo/create')
  }

  return (
    <div className="stage">
      <div className="obsplit">
        {/* left: message + input (left-aligned, breaks the centered-hero tell) */}
        <div className="obleft">
          <div className="crumb">First run · aha before the wall</div>
          <h2 className="obh1">Your product photo in. A scroll-stopping ad out.</h2>
          <p className="sub obsub">Ready in minutes. No signup to try, download before you pay.</p>

          <div className="startbox">
            <div
              className={'dropzone' + (drag ? ' over' : '')}
              onClick={() => fileRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDrag(true) }}
              onDragLeave={() => setDrag(false)}
              onDrop={(e) => { e.preventDefault(); setDrag(false); begin(Array.from(e.dataTransfer.files)) }}
            >
              <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={(e) => begin(e.target.files ? Array.from(e.target.files) : null)} />
              <div className="dzic">{busy ? '⏳' : '⬆'}</div>
              <div className="dztitle">{busy ? 'Detecting your product…' : 'Drop product photos here'}</div>
              <div className="sub" style={{ margin: '4px auto 0' }}>or click to upload · a few angles work best <span className="betag">⧗ BE detect + remove-BG</span></div>
            </div>
            <div className="altrow">
              <div className="urlbox">
                <input placeholder="…or paste your Shopify / product URL" value={url} onChange={(e) => setUrl(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && begin(null)} />
                <button className="btn sec" disabled={busy} onClick={() => begin(null)}>Import</button>
              </div>
              <button className="btn sec" disabled={busy} onClick={() => nav('/inbox')}>📱 Send from phone</button>
            </div>
            <button className="tryline" disabled={busy} onClick={() => begin(null)}>No store URL yet? Try a sample product →</button>
          </div>

          <div className="proofstat">
            <span className="stars">★★★★★</span>
            <span><b>1,240</b> sellers shipped an ad this week</span>
          </div>
        </div>

        {/* right: the asset — a vertical proof rail (not 3 equal cards) */}
        <div className="obright">
          <div className="proofhead">Real footage in, ad out</div>
          <div className="prooflist">
            {EX.map((e, i) => (
              <div className="proofrow" key={i}>
                <div className="ba">
                  <div className="pbefore"><span className="ptag">Before</span>Raw photo</div>
                  <div className="pseam">→</div>
                  <div className="pafter"><span className="ptag">Ad</span><span className="play">▶</span><span className="pdur">{e.dur}</span></div>
                </div>
                <div className="exlabel">{e.cat} · {e.fmt}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
