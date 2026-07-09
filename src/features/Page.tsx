import type { ReactNode } from 'react'

// Shared page header: eyebrow (crumb) + title + subtitle, one frame across surfaces.
// ponytail: no CTA/toolbar slot yet — no surface has a header action; add an `action`
// prop (rendered top-right) the day one does.
export function PageHead({ eyebrow, title, sub }: { eyebrow?: ReactNode; title: ReactNode; sub?: ReactNode }) {
  return (
    <>
      {eyebrow && <div className="crumb">{eyebrow}</div>}
      <h2 className="title">{title}</h2>
      {sub && <p className="sub">{sub}</p>}
    </>
  )
}
