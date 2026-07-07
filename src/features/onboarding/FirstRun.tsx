import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../lib/store'
import { detectProduct } from '../../lib/be'

const EX = [
  { fmt: 'Skincare · review', b: 'linear-gradient(160deg,#c98a6a,#7a4a38)' },
  { fmt: 'Pet · demo', b: 'linear-gradient(160deg,#7ab98f,#2f6a4a)' },
  { fmt: 'Supplement · testimonial', b: 'linear-gradient(160deg,#c9b46a,#7a682f)' },
]

export default function FirstRun() {
  const nav = useNavigate()
  const { setProduct, setFormat } = useApp()
  const [busy, setBusy] = useState(false)

  const start = async () => {
    setBusy(true)
    setFormat('review')
    const p = await detectProduct(null) // ⧗ BE
    setProduct(p)
    setBusy(false)
    nav('/advideo/create')
  }

  return (
    <div className="stage">
      <div className="ob">
        <div className="crumb" style={{ justifyContent: 'center' }}>First run · aha before the wall</div>
        <h2 className="title" style={{ fontSize: '2.1rem' }}>Turn your product photo into a scroll-stopping ad — in minutes.</h2>
        <p className="sub" style={{ margin: '12px auto 0' }}>1,240 sellers made an ad this week. No credit card. No design skills. Real footage, not "looks-cheap" avatars.</p>
        <div className="exlist">
          {EX.map((e, i) => (
            <div className="ex" key={i}>
              <div className="ba">
                <div className="half" style={{ background: '#E7ECE9', color: '#8aa' }}>BEFORE</div>
                <div className="half" style={{ background: e.b }}>▶ 0:10 AD</div>
              </div>
              <div className="meta" style={{ padding: '9px 11px' }}><span className="fmt">{e.fmt}</span></div>
            </div>
          ))}
        </div>
        <button className="btn pri lg" onClick={start} disabled={busy}>
          {busy ? '⏳ Detecting your product…' : 'Make a video like this →'}
          {!busy && <span className="betag">⧗ BE detect + remove-BG</span>}
        </button>
      </div>
    </div>
  )
}
