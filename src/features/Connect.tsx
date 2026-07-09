import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../lib/store'
import { checkMetaReadiness, type ReadyCheck } from '../lib/be'
import { PageHead } from './Page'

const ICON: Record<ReadyCheck['status'], string> = { pass: '✓', warn: '!', block: '⛔' }

export default function Connect() {
  const nav = useNavigate()
  const { metaConnected, setMetaConnected } = useApp()
  const [shopify, setShopify] = useState(false)
  const [checks, setChecks] = useState<ReadyCheck[] | null>(null)
  const [auditing, setAuditing] = useState(false)

  const runAudit = async () => {
    setAuditing(true)
    const c = await checkMetaReadiness() // ⧗ BE/OAuth pre-flight
    setChecks(c)
    setAuditing(false)
  }
  const blocked = checks?.some((c) => c.status === 'block')

  return (
    <div className="stage">
      <PageHead
        eyebrow={<><b>Connect</b> · export-first, connect only to publish in one click</>}
        title="Connect your channels"
        sub={<>You never need to connect to use AdShort, export MP4 and upload yourself (most sellers prefer the control). Connect only if you want one-click publish. Shopify links instantly; Meta we pre-flight first so you don't hit a silent failure.</>}
      />

      <div className="grid2" style={{ marginTop: 16, gridTemplateColumns: '1fr 1fr' }}>
        {/* Shopify — decoupled, instant */}
        <div className="panel connectcard">
          <div className="cxhead"><span className="cxname">🛍 Shopify</span>{shopify ? <span className="cbadge pass">Connected</span> : <span className="cbadge warn">Not linked</span>}</div>
          <p className="sub" style={{ margin: '4px 0 14px' }}>Pull products, images and prices to skip manual upload. Instant OAuth, low friction.</p>
          <button className="btn sec block" disabled={shopify} onClick={() => setShopify(true)}>{shopify ? '✓ 24 products pulled' : 'Link Shopify'}<span className="betag">⧗ OAuth</span></button>
        </div>

        {/* Meta — gated, pre-flight audited */}
        <div className="panel connectcard">
          <div className="cxhead"><span className="cxname">📣 Meta</span>{metaConnected ? <span className="cbadge pass">Connected</span> : <span className="cbadge warn">Pre-flight first</span>}</div>
          <p className="sub" style={{ margin: '4px 0 14px' }}>Publish straight to Ads Manager. We check readiness before the handshake, 40% of connects fail silently otherwise.</p>
          {!checks && !metaConnected && (
            <button className="btn sec block" disabled={auditing} onClick={runAudit}>{auditing ? 'Running pre-flight…' : 'Run Meta pre-flight'}<span className="betag">⧗ OAuth</span></button>
          )}
          {checks && !metaConnected && (
            <>
              <div className="clist" style={{ marginBottom: 14 }}>
                {checks.map((c) => (
                  <div className={'crow ' + c.status} key={c.id}>
                    <span className="cico">{ICON[c.status]}</span>
                    <div><b>{c.label}</b><div className="cdetail">{c.detail}</div></div>
                  </div>
                ))}
              </div>
              <button className="btn pri block" disabled={blocked} onClick={() => setMetaConnected(true)}>{blocked ? 'Resolve blockers first' : 'Finish connecting Meta'}</button>
            </>
          )}
          {metaConnected && <div className="note" style={{ background: 'var(--brand-soft)', borderColor: 'var(--brand-line)', color: 'var(--brand)' }}>✓ Meta connected, you can one-click publish from any variant. Live publish still routes through app-review.</div>}
        </div>
      </div>

      {/* B5 — CAPI health: verify it's live (we don't set it up; that's Meta's job) */}
      <div className="panel capicard" style={{ marginTop: 16 }}>
        <div className="cxhead">
          <span className="cxname">📊 Conversions API health</span>
          {metaConnected ? <span className="cbadge pass">Healthy</span> : <span className="cbadge warn">Connect Meta to verify</span>}
        </div>
        <p className="sub" style={{ margin: '4px 0 14px' }}>Sellers lose 15&ndash;30% of conversions when the Conversions API isn't firing, and most don't know. We verify it's live and healthy; we never touch your setup.</p>
        {metaConnected ? (
          <div className="capirows">
            <div className="capirow"><span>Pixel events</span><b className="mono">1,240 / wk</b></div>
            <div className="capirow"><span>CAPI events</span><b className="mono">1,410 / wk</b></div>
            <div className="capirow ok"><span>Net recovered vs pixel-only</span><b className="mono">+13.7%</b></div>
            <span className="betag">⧗ BE · Meta pixel + CAPI feed</span>
          </div>
        ) : (
          <a className="link" href="https://www.facebook.com/business/help/2041148702652965" target="_blank" rel="noopener noreferrer">Set up the Conversions API in Meta docs →</a>
        )}
      </div>

      <div className="freeline" style={{ marginTop: 16 }}>
        <b>Export-first, always.</b> No connection required to make or download ads, connect is a convenience, not a gate. Decoupled: Shopify links instantly; Meta stays optional until you actually want to publish.
      </div>
    </div>
  )
}
