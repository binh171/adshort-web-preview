import { useEffect, useState } from 'react'
import { checkCompliance, type ComplianceCheck } from '../../lib/be'

const ICON: Record<ComplianceCheck['status'], string> = { pass: '✓', warn: '!', block: '⛔', pending: '⧗' }

// Pre-flight gate before Export/Publish. onGate(false) only on a hard block (warns still allow export).
export default function Compliance({ category, formatName, onGate }: { category?: string; formatName?: string; onGate: (ok: boolean) => void }) {
  const [disclosed, setDisclosed] = useState(true)
  const [checks, setChecks] = useState<ComplianceCheck[]>([])

  useEffect(() => {
    let live = true
    checkCompliance({ category, formatName, disclosed }).then((c) => {
      if (!live) return
      setChecks(c)
      onGate(!c.some((x) => x.status === 'block'))
    })
    return () => { live = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, formatName, disclosed])

  const worst = checks.some((c) => c.status === 'block') ? 'block' : checks.some((c) => c.status === 'warn') ? 'warn' : 'pass'
  const worstLabel = worst === 'pass' ? 'Clear' : worst === 'warn' ? 'Review' : 'Blocked'

  return (
    <div className="panel compliance">
      <h4>🛡 Compliance pre-flight <span className={'cbadge ' + worst}>{worstLabel}</span></h4>
      <div className="realproof">
        <span className="rpbadge">✓ 100% Real Creator Proof</span>
        <span className="t">Built from your real footage, so it skips synthetic-media disclosure and EU AI Act watermarking. Authenticity is your edge, not a compliance tax.</span>
      </div>
      <label className="cdisc"><input type="checkbox" checked={disclosed} onChange={(e) => setDisclosed(e.target.checked)} /> Embed "Made with AI" label on export</label>
      <div className="clist">
        {checks.map((c) => (
          <div className={'crow ' + c.status} key={c.id}>
            <span className="cico">{ICON[c.status]}</span>
            <div>
              <b>{c.label}</b> {c.be && <span className="betag">⧗ BE</span>}
              <div className="cdetail">{c.detail}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
