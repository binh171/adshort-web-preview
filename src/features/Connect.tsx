import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../lib/store'
import { checkMetaReadiness, type ReadyCheck } from '../lib/be'

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
      <div className="crumb"><b>Connect</b> · export-first — connect only to publish in one click</div>
      <h2 className="title">Connect your channels</h2>
      <p className="sub">You never need to connect to use AdShort — export MP4 and upload yourself (most sellers prefer the control). Connect only if you want one-click publish. Shopify links instantly; Meta we pre-flight first so you don't hit a silent failure.</p>

      <div className="grid2" style={{ marginTop: 16, gridTemplateColumns: '1fr 1fr' }}>
        {/* Shopify — decoupled, instant */}
        <div className="panel connectcard">
          <div className="cxhead"><span className="cxname">🛍 Shopify</span>{shopify ? <span className="cbadge pass">Connected</span> : <span className="cbadge warn">Not linked</span>}</div>
          <p className="sub" style={{ margin: '4px 0 14px' }}>Pull products, images and prices to skip manual upload. Instant OAuth, low friction.</p>
          <button className="btn sec block" disabled={shopify} onClick={() => setShopify(true)}>{shopify ? '✓ Store linked' : 'Link Shopify'}<span className="betag">⧗ OAuth</span></button>
        </div>

        {/* Meta — gated, pre-flight audited */}
        <div className="panel connectcard">
          <div className="cxhead"><span className="cxname">📣 Meta</span>{metaConnected ? <span className="cbadge pass">Connected</span> : <span className="cbadge warn">Pre-flight first</span>}</div>
          <p className="sub" style={{ margin: '4px 0 14px' }}>Publish straight to Ads Manager. We check readiness before the handshake — 40% of connects fail silently otherwise.</p>
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
          {metaConnected && <div className="note" style={{ background: 'var(--brand-soft)', borderColor: 'var(--brand-line)', color: 'var(--brand)' }}>✓ Meta connected — you can one-click publish from any variant. Live publish still routes through app-review.</div>}
        </div>
      </div>

      <div className="freeline" style={{ marginTop: 16 }}>
        <b>Export-first, always.</b> No connection required to make or download ads — connect is a convenience, not a gate. Decoupled: Shopify links instantly; Meta stays optional until you actually want to publish.
      </div>
    </div>
  )
}
