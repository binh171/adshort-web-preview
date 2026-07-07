import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../lib/store'
import { streamProgress, type Variant } from '../../lib/be'

export default function Generating() {
  const nav = useNavigate()
  const { product, setVariants, setSelected, spend } = useApp()
  const [pct, setPct] = useState(0)
  const [status, setStatus] = useState('Starting…')
  const [vs, setVs] = useState<Variant[]>([])

  useEffect(() => {
    if (!product) { nav('/advideo'); return }
    let live = true
    ;(async () => {
      // ⧗ BE: poll render job — progressive reveal (variant 1 first).
      for await (const p of streamProgress()) {
        if (!live) return
        setPct(p.pct); setStatus(p.status); setVs(p.variants)
      }
      if (!live) return
      const final = [
        { id: 'v0', style: 'Cinematic', poster: 'linear-gradient(160deg,#c98a6a,#5a3226)', ready: true },
        { id: 'v1', style: 'Demo', poster: 'linear-gradient(160deg,#6a92c9,#26385a)', ready: true },
        { id: 'v2', style: 'Hook', poster: 'linear-gradient(160deg,#7ab98f,#265a3e)', ready: true },
      ] as Variant[]
      setVariants(final); setSelected('v0'); spend(3)
      setTimeout(() => live && nav('/advideo/results'), 500)
    })()
    return () => { live = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product])

  return (
    <div className="stage">
      <div className="genwrap">
        <h2 className="title">Making your 3 variants…</h2>
        <p className="sub">Rendered in parallel, the first shows the moment it's ready, no staring at a spinner. <span className="betag">⧗ BE render</span></p>
        <div className="prog"><div className="fill" style={{ width: pct + '%' }} /></div>
        <div className="status">{status}</div>
        <div className="vgrid">
          {(vs.length ? vs : [{ id: 'v0', style: 'Cinematic' }, { id: 'v1', style: 'Demo' }, { id: 'v2', style: 'Hook' }] as Variant[]).map((v) => (
            <div className={'vslot' + (v.ready ? ' done' : '')} key={v.id} style={v.ready ? { background: v.poster } : undefined}>
              {v.ready ? <span>{v.style} ✓</span> : <><div className="spin" /><span>{v.style}</span></>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
