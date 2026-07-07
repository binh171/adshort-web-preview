import { useState } from 'react'
import { useApp } from '../lib/store'
import { PLANS } from '../data/plans'
import { startCheckout } from '../lib/be'

export default function Billing() {
  const { credits, plan, setPlan } = useApp()
  const [busy, setBusy] = useState<string | null>(null)
  const [toast, setToast] = useState('')

  const choose = async (id: string) => {
    setBusy(id)
    const r = await startCheckout(id) // ⧗ BE/Stripe
    setPlan(id)
    setBusy(null)
    setToast(r.note)
    setTimeout(() => setToast(''), 3200)
  }

  return (
    <div className="stage">
      <div className="crumb"><b>Plans</b> · pay for winning ads, not locked-in seats</div>
      <h2 className="title">Test more angles, keep more winners</h2>
      <p className="sub">Flat weekly credits that auto-reset, no hoarding. No watermark, ever. Cancel same-day and keep the credits you already have. One winning angle pays for the month.</p>

      <div className="pricing">
        {PLANS.map((p) => (
          <div className={'plan' + (p.popular ? ' pop' : '') + (plan === p.id ? ' current' : '')} key={p.id}>
            {p.popular && <span className="poptag">Most popular</span>}
            <div className="pname">{p.name}</div>
            <div className="ptag">{p.tagline}</div>
            <div className="pprice"><b>${p.price}</b><span>/mo</span></div>
            <div className="pcredits">{p.creditsWk ? `${p.creditsWk} credits / week` : 'Unlimited (relaxed)'}</div>
            <ul className="pfeat">{p.features.map((f, i) => <li key={i}>{f}</li>)}</ul>
            <button className={'btn ' + (p.popular ? 'pri' : 'sec') + ' block'} disabled={busy === p.id || plan === p.id} onClick={() => choose(p.id)}>
              {plan === p.id ? '✓ Current plan' : busy === p.id ? 'Opening checkout…' : p.cta}
              {p.id !== 'creator' && plan !== p.id && <span className="betag">⧗ Stripe</span>}
            </button>
          </div>
        ))}
      </div>

      <div className="freeline">
        <b>Free trial</b> · 15 credits · 14 days · <b>credit-limit, not watermark</b> · cancel same-day &amp; keep your credits, no cancel-trap. You have <b className="mono">{credits}</b> credits now on the <b>{plan}</b> plan.
      </div>

      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}
