import { useState } from 'react'
import { useApp } from '../lib/store'

export default function Library() {
  const { library } = useApp()
  const [q, setQ] = useState('')
  const shown = library.filter((i) => (i.product + i.format).toLowerCase().includes(q.toLowerCase()))

  return (
    <div className="stage">
      <div className="crumb"><b>Library</b> · your winners, searchable &amp; remixable</div>
      <h2 className="title">Your creative library</h2>
      <p className="sub">Every ad you make lands here — search by product / format / win-rate, one-tap remix. This is the anti-churn memory.</p>
      <div className="searchbar">
        <input placeholder="Search product or format…" value={q} onChange={(e) => setQ(e.target.value)} />
        <span className="sub" style={{ margin: 0 }}>{shown.length} items</span>
      </div>
      <div className="libgrid">
        {shown.map((i) => (
          <div className="card" key={i.id}>
            <div className="ph" style={{ background: i.poster }}>{i.product}</div>
            <div className="meta">
              <span className="fmt">{i.format}</span>
              {i.winRate ? <span className="winbadge">win {i.winRate}%</span> : <span className="roi">{i.date}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
