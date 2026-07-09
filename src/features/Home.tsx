import { useState, type CSSProperties } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../lib/store'
import { detectProduct } from '../lib/be'
import { clip, poster } from '../lib/img'
import { SEASONS } from '../data/seasons'
import HoverVideo from './HoverVideo'

const CAT_CLIP: Record<string, string> = {
  Beauty: 'beauty1', Skincare: 'beauty3', Supplement: 'beauty2', Home: 'home', Pet: 'pet',
}

export default function Home() {
  const nav = useNavigate()
  const { library, setProduct, setFormat, product } = useApp()
  const [busy, setBusy] = useState(false)
  const [url, setUrl] = useState('')

  const startFromProduct = async () => {
    setBusy(true)
    const p = product ?? (await detectProduct(null)) // ⧗ BE detect + remove-BG (mock)
    setProduct(p)
    setBusy(false)
    nav('/advideo')
  }
  const remix = async () => {
    const p = await detectProduct(null)
    setProduct(p); setFormat('review'); nav('/advideo/create')
  }

  const recent = library.slice(0, 6)
  // hero backdrop: our own posters as a dim ghost-collage (UI8-style depth, license-safe)
  const posters = library.map((l) => l.poster).filter(Boolean)
  const fallback = ['beauty1', 'beauty2', 'beauty3', 'home', 'pet', 'ugc', 'coffee', 'matcha']
  const collage = Array.from({ length: 18 }, (_, i) => (posters.length ? posters[i % posters.length] : poster(fallback[i % fallback.length])))
  const nextSeason = SEASONS[(new Date().getMonth() + 1) % 12]
  const best = library.reduce<(typeof library)[number] | null>((a, b) => (!a || (b.winRate ?? 0) > (a.winRate ?? 0) ? b : a), null)

  return (
    <div className="stage">
      {/* HERO — emerald-energy: centered oversized headline + glowing Generate bar */}
      <section className="hero heroB">
        <div className="herocollage" aria-hidden="true">
          {collage.map((bg, i) => (
            <span key={i} style={{ background: bg }} />
          ))}
        </div>
        <div className="heroeye">Real footage in, scroll-stopping ad out</div>
        <h1 className="herobig">Turn one product into<br /><span className="em">ten winning ads</span>.</h1>
        <p className="herosub">Paste your store link or upload a photo. We detect, edit, narrate and export for Meta, at the scale your ads need. Real footage only, no avatars.</p>
        <div className="genbar">
          <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Paste your Shopify / product URL, or upload a photo" aria-label="Product URL" />
          <button className="btn pri" onClick={startFromProduct} disabled={busy}>{busy ? 'Detecting…' : 'Generate'}</button>
        </div>
        <div className="herolinks">
          <button className="link" onClick={() => nav('/advideo')}>Browse formats →</button>
          <button className="link" onClick={() => nav('/inbox')}>📱 Send from phone →</button>
        </div>
      </section>

      {/* ZONE 2 — jump back in */}
      <div className="homehead">
        <h3>Jump back in</h3>
        <button className="link" onClick={() => nav('/library')}>View all →</button>
      </div>
      {recent.length ? (
        <div className="gal">
          {recent.map((it, i) => (
            <button className="card" key={it.id} onClick={() => remix()} style={{ '--i': i } as CSSProperties}>
              <HoverVideo className="ph" poster={it.poster} src={clip(CAT_CLIP[it.category ?? ''] ?? 'beauty2')} cta="↻ Remix this">
                {it.status && <span className={'rstat ' + it.status}>{it.status}</span>}
                {it.winRate != null && <span className="rbadge">{it.winRate}%</span>}
              </HoverVideo>
              <div className="meta">
                <span className="fmt">{it.product}</span>
                <span className="roi">{it.format}</span>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="empty"><b>No ads yet.</b> Start your first video above, it lands here as a reusable record.</div>
      )}

      {/* ZONE 3 — what to make next */}
      <div className="homehead"><h3>What to make next</h3></div>
      <div className="nextrow">
        <button className="nextcard" onClick={() => nav('/trending')}>
          <span className="nlabel">🗓 Build ahead · {nextSeason.month}</span>
          <b>{nextSeason.surging[0]}</b>
          <span className="nsub">{nextSeason.angle}. Pre-stock now, sellers who build early win the season.</span>
          <span className="ngo">Explore templates →</span>
        </button>
        {best && (
          <button className="nextcard" onClick={() => remix()}>
            <span className="nlabel">📊 On record</span>
            <b>{best.category} · {best.format} won {best.winRate}%</b>
            <span className="nsub">Your best segment so far. Remix it for a fresh variant before it fatigues.</span>
            <span className="ngo">Remix →</span>
          </button>
        )}
      </div>
    </div>
  )
}
