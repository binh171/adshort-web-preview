import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp, type AdStatus, type LibraryItem } from '../lib/store'
import { FORMATS } from '../data/formats'
import { detectProduct } from '../lib/be'

type Filter = 'all' | AdStatus
const STATUS_LABEL: Record<AdStatus, string> = { scaling: 'Scaling', fresh: 'Fresh', fatigued: 'Fatigued' }
const avg = (a: number[]) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0)

export default function Library() {
  const { library, setProduct, setFormat } = useApp()
  const nav = useNavigate()
  const [q, setQ] = useState('')
  const [filter, setFilter] = useState<Filter>('all')
  const [sort, setSort] = useState<'win' | 'recent'>('win')
  const [busy, setBusy] = useState<string | null>(null)

  // second-brain: what worked, by format & category
  const insight = useMemo(() => {
    const byFmt: Record<string, number[]> = {}
    const byCat: Record<string, number[]> = {}
    library.forEach((i) => {
      if (i.winRate == null) return
      ;(byFmt[i.format] ??= []).push(i.winRate)
      if (i.category) (byCat[i.category] ??= []).push(i.winRate)
    })
    const top = (m: Record<string, number[]>) =>
      Object.entries(m).map(([k, v]) => [k, avg(v)] as const).sort((a, b) => b[1] - a[1])[0]
    return {
      topFmt: top(byFmt),
      topCat: top(byCat),
      total: library.length,
      scaling: library.filter((i) => i.status === 'scaling').length,
    }
  }, [library])

  const shown = useMemo(() => {
    let list = library.filter((i) => (i.product + i.format + (i.category ?? '')).toLowerCase().includes(q.toLowerCase()))
    if (filter !== 'all') list = list.filter((i) => i.status === filter)
    return [...list].sort((a, b) => (sort === 'win' ? (b.winRate ?? 0) - (a.winRate ?? 0) : 0))
  }, [library, q, filter, sort])

  // remix loop: relaunch a proven product+format straight into the console (skips re-upload)
  const remix = async (i: LibraryItem) => {
    setBusy(i.id)
    const p = await detectProduct(null)
    setProduct({ ...p, productName: i.product, category: i.category ?? p.category })
    const f = FORMATS.find((x) => x.name === i.format)
    if (f) { setFormat(f.id); nav('/advideo/create') } else nav('/advideo')
  }

  return (
    <div className="stage">
      <div className="crumb"><b>Library</b> · your ad system-of-record, what worked, by product / format / month</div>
      <h2 className="title">Your creative library</h2>
      <p className="sub">Every ad + how it performed, in one memory. The moat against churn: your winners stay searchable and one-click remixable, Fresh &amp; Scaling, never a "loser" verdict.</p>

      {/* second-brain insights */}
      <div className="insights">
        <div className="insight"><div className="v">{insight.total}</div><div className="k">Ads on record</div></div>
        <div className="insight"><div className="v">{insight.scaling}</div><div className="k">Scaling now</div></div>
        <div className="insight"><div className="v" style={{ fontSize: '1rem' }}>{insight.topFmt?.[0] ?? '-'}</div><div className="k">Best format · {insight.topFmt ? Math.round(insight.topFmt[1]) + '% avg' : ''}</div></div>
        <div className="insight"><div className="v" style={{ fontSize: '1rem' }}>{insight.topCat?.[0] ?? '-'}</div><div className="k">Best category · {insight.topCat ? Math.round(insight.topCat[1]) + '% avg' : ''}</div></div>
      </div>

      <div className="filters">
        {(['all', 'scaling', 'fresh', 'fatigued'] as Filter[]).map((f) => (
          <button key={f} className={'cat' + (filter === f ? ' on' : '')} onClick={() => setFilter(f)}>
            {f === 'all' ? 'All' : STATUS_LABEL[f]}
          </button>
        ))}
        <span className="spacer" style={{ flex: 1 }} />
        <div className="seg">
          <button className={sort === 'win' ? 'on' : ''} onClick={() => setSort('win')}>Win-rate</button>
          <button className={sort === 'recent' ? 'on' : ''} onClick={() => setSort('recent')}>Recent</button>
        </div>
      </div>
      <div className="searchbar">
        <input placeholder="Search product / format / category…" value={q} onChange={(e) => setQ(e.target.value)} />
        <span className="sub" style={{ margin: 0 }}>{shown.length} items</span>
      </div>

      <div className="libgrid">
        {shown.map((i) => (
          <div className="card" key={i.id}>
            <div className="ph" style={{ background: i.poster }}>
              {i.status && <span className={'statusbadge ' + i.status}>{STATUS_LABEL[i.status]}</span>}
              {i.winRate != null && <span className="winpred" style={{ background: i.winRate >= 70 ? 'var(--brand)' : 'rgba(10,20,15,.6)' }}>win {i.winRate}%</span>}
              {i.product}
            </div>
            <div className="meta">
              <span className="fmt">{i.format}</span>
              <span className="roi">{i.category ?? i.date}</span>
            </div>
            {(i.ctr != null || i.spend != null) && (
              <div className="metrics">
                {i.ctr != null && <span>CTR <b>{i.ctr}%</b></span>}
                {i.spend != null && <span>spend <b>${i.spend}</b></span>}
                <span className="mono" style={{ color: 'var(--muted)' }}>{i.date}</span>
              </div>
            )}
            <div className="libact">
              <button className="btn sec block" disabled={busy === i.id} onClick={() => remix(i)}>
                {busy === i.id ? 'Loading…' : '↻ Remix'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
