// ============================================================================
// BE ADAPTER — the single seam between the web app and the backend engine.
// Everything here is MOCK today. When the BE contract lands, swap each function
// body to a real `fetch(BE_URL + ...)` — the component code never changes.
// ⧗ BE items flagged in UI map 1:1 to the functions below.
// ============================================================================

import { poster } from './img'

export type Angle = { id: string; label: string; kind: 'front' | 'label' | 'texture' | 'side' | 'detail'; url: string }
export type DetectResult = { category: string; productName: string; label: string; angles: Angle[] }
export type Variant = { id: string; style: 'Cinematic' | 'Demo' | 'Hook'; poster: string; ready: boolean }
export type GenProgress = { pct: number; status: string; variants: Variant[] }

const BE_URL = import.meta.env.VITE_BE_URL ?? '' // set when BE is wired

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))
// video-frame look: soft top-left light source + bottom scrim (text legibility) over the product-tone base
const grad = (a: string, b: string) =>
  `radial-gradient(90% 60% at 22% 12%, rgba(255,255,255,.20), transparent 55%), linear-gradient(0deg, rgba(0,0,0,.28), transparent 42%), linear-gradient(158deg, ${a} 6%, ${b})`

// ⧗ BE: product-detect + remove-BG. Mock returns a plausible angle set.
export async function detectProduct(_files: File[] | null): Promise<DetectResult> {
  await wait(700)
  return {
    category: 'Skincare',
    productName: 'The Inkey List Hyaluronic Acid Serum',
    label: 'The Inkey List',
    angles: [
      { id: 'front', label: 'front', kind: 'front', url: grad('#c98a6a', '#7a4a38') },
      { id: 'label', label: 'label', kind: 'label', url: grad('#7ab98f', '#2f6a4a') },
      { id: 'texture', label: 'texture', kind: 'texture', url: grad('#6a92c9', '#2f4f7a') },
    ],
  }
}

// ⧗ BE: brain writes the shot-script from format + detected product.
export async function buildBrief(formatId: string, product: DetectResult): Promise<string> {
  await wait(300)
  const briefs: Record<string, string> = {
    review: `Open on a warm handheld close-up of {front} held to natural window light. Creator turns it to show {label} and reads the key claim. Mid beat: slow push-in on {texture} as it is applied. VO: warm, casual — "Ever notice how…". End on a confident verdict with {front} in soft focus. Style: raw phone-camera, real, no filter.`,
    demo: `Hero shot of {front} on a clean surface. Hand enters, picks it up, demonstrates the one-tap use. Push-in on {texture} solving the problem in under 5s. VO: crisp problem→solution. Style: bright, clean, product-first.`,
    beforeafter: `Split intro: dull "before" state, then {front} applied. Slow reveal of the "after" glow on {texture}. VO: honest, results-led (no unrealistic claims). Style: soft natural light, authentic.`,
    testimonial: `Real person to camera holding {front}, warm room tone. They recount the result, glance to {label}. VO intent: skeptic → convinced → recommends. Style: cozy, trustworthy, phone-shot.`,
    unboxing: `Hands open the package, reveal {front}. Turn to {label}, quick look at {texture}. VO: excited discovery. Style: tactile, warm, ASMR-ish.`,
  }
  return briefs[formatId] ?? briefs.review
}

// ⧗ BE: enqueue a render job. Mock returns an id.
export async function startGeneration(_brief: string, _opts: unknown): Promise<{ jobId: string }> {
  await wait(300)
  return { jobId: 'mock_' + Math.floor(performance.now()) }
}

// ⧗ BE: poll job. Mock drives a progressive reveal (variant 1 first, 2 & 3 after).
// Real BE latency ~59–99s/clip → parallel render + progressive reveal.
export async function* streamProgress(): AsyncGenerator<GenProgress> {
  const variants: Variant[] = [
    { id: 'v0', style: 'Cinematic', poster: poster('product_hero'), ready: false },
    { id: 'v1', style: 'Demo', poster: poster('ugc'), ready: false },
    { id: 'v2', style: 'Hook', poster: poster('cream'), ready: false },
  ]
  const steps: [number, string][] = [
    [12, 'Analyzing your product angles…'],
    [34, 'Elevating hero shot…'],
    [58, 'Animating angles — variant 1 ready'],
    [80, 'Rendering variants 2 & 3…'],
    [96, 'Adding music & captions…'],
    [100, 'Composing final cuts'],
  ]
  for (let i = 0; i < steps.length; i++) {
    if (i === 2) variants[0].ready = true
    if (i === 4) { variants[1].ready = true; variants[2].ready = true }
    yield { pct: steps[i][0], status: steps[i][1], variants: variants.map((v) => ({ ...v })) }
    await wait(900)
  }
}

// ⧗ BE/OAuth: publish to Meta. Mock only.
export async function publishToMeta(_variantId: string): Promise<{ ok: boolean; note: string }> {
  await wait(500)
  return { ok: false, note: '⧗ BE/OAuth not wired — export MP4 for now.' }
}

// ---- Handoff: phone app (capture+monitor) → web cockpit (production) ----
export type PhoneItem = {
  id: string
  kind: 'capture' | 'draft'
  product: string
  posters: string[]   // captured phone photos (gradients as mock)
  source: string      // 'iPhone 15 Pro'
  ago: string
  status: 'new' | 'used'
  note?: string       // drafts: 'started on phone · 1 quick variant'
}

const INBOX: PhoneItem[] = [
  { id: 'c1', kind: 'capture', product: 'Ceramic Pour-Over Set', posters: [poster('coffee')], source: 'iPhone 15 Pro', ago: '12m ago', status: 'new' },
  { id: 'c2', kind: 'capture', product: 'Matcha Whisk Kit', posters: [poster('matcha')], source: 'iPhone 15 Pro', ago: '2h ago', status: 'new' },
  { id: 'c3', kind: 'draft', product: 'Linen Apron', posters: [poster('apron')], source: 'iPhone 15 Pro', ago: 'yesterday', status: 'used', note: 'started on phone · 1 quick variant' },
  { id: 'c4', kind: 'capture', product: 'Beard Oil 30ml', posters: [poster('beard_oil')], source: 'iPad', ago: '2d ago', status: 'used' },
]

// ⧗ BE: pull assets captured on the phone app + cloud-synced drafts.
export async function fetchInbox(): Promise<PhoneItem[]> {
  await wait(500)
  return INBOX.map((i) => ({ ...i }))
}

// ⧗ BE: issue a short-lived pairing token so the phone app can push captures here.
export async function pairPhone(): Promise<{ code: string; expiresIn: number }> {
  await wait(300)
  return { code: 'ADS-7Q4K2', expiresIn: 120 }
}

// ---- Batch Studio: the cockpit wedge — N formats × M angles → a matrix in one run ----
export type BatchCombo = { formatId: string; formatName: string; angleId: string; angle: string }
export type BatchCell = { id: string; formatName: string; angle: string; poster: string; ready: boolean; winPred?: number }

const BATCH_PAL: [string, string][] = [
  ['#c98a6a', '#5a3226'], ['#7ab98f', '#265a3e'], ['#6a92c9', '#26385a'],
  ['#b57bb0', '#5a2f57'], ['#c9a86a', '#5a4526'], ['#6ac9bd', '#265a52'],
]

// ⧗ BE: enqueue a batch render. Mock drives a progressive matrix reveal + a mock win-prediction.
export async function* streamBatch(combos: BatchCombo[]): AsyncGenerator<{ pct: number; status: string; cells: BatchCell[] }> {
  const cells: BatchCell[] = combos.map((c, i) => {
    const [a, b] = BATCH_PAL[i % BATCH_PAL.length]
    return { id: `b${i}`, formatName: c.formatName, angle: c.angle, poster: grad(a, b), ready: false }
  })
  for (let i = 0; i < cells.length; i++) {
    cells[i].ready = true
    cells[i].winPred = 52 + ((i * 17 + cells[i].formatName.length * 7) % 42) // deterministic mock 52–93
    yield {
      pct: Math.round(((i + 1) / cells.length) * 100),
      status: `Rendering ${cells[i].formatName} · ◈ ${cells[i].angle} — ${i + 1}/${cells.length}`,
      cells: cells.map((x) => ({ ...x })),
    }
    await wait(550)
  }
}

// ---- Connect pre-flight (models the REAL silent-fail friction, not a happy-path button) ----
export type ReadyCheck = { id: string; label: string; status: 'pass' | 'warn' | 'block'; detail: string }

// ⧗ BE/OAuth: audit Meta connect readiness BEFORE the OAuth handshake — surfaces the
// causes of the ~40% silent OAuth failures (BM role, scope, app-review limbo).
export async function checkMetaReadiness(): Promise<ReadyCheck[]> {
  await wait(600)
  return [
    { id: 'bm', label: 'Business Manager admin role', status: 'warn', detail: '~40% of connects fail silently here — you need Admin (not Employee) on the ad account.' },
    { id: 'scope', label: 'ads_management permission', status: 'pass', detail: 'Scope will be requested — AdShort can then create & read ads.' },
    { id: 'review', label: 'App-review status (live publish)', status: 'warn', detail: 'One-click publish needs Meta app-review (2–3 weeks). Export MP4 works today, no review.' },
    { id: 'pixel', label: 'Pixel access (feeds Intelligence)', status: 'pass', detail: 'Pixel readable — CTR / hold-rate / frequency will flow into Intelligence.' },
  ]
}

// ---- Compliance pre-flight (USP #3, moat by Q4-26: EU AI Act + FTC + Meta modesty) ----
export type ComplianceCheck = { id: string; label: string; status: 'pass' | 'warn' | 'block' | 'pending'; detail: string; be?: boolean }

// ⧗ BE (C2PA embed): rest are client-side heuristics on category × format × disclosure.
export async function checkCompliance(ctx: { category?: string; formatName?: string; disclosed: boolean }): Promise<ComplianceCheck[]> {
  await wait(250)
  const health = ['Supplement', 'Beauty', 'Skincare', 'Fitness'].includes(ctx.category ?? '')
  const beforeAfter = (ctx.formatName ?? '').toLowerCase().includes('before')
  return [
    { id: 'modesty', label: 'Meta modesty policy', status: 'pass', detail: 'Real product footage, no restricted content.' },
    { id: 'disclosure', label: 'AI disclosure', status: ctx.disclosed ? 'pass' : 'warn', detail: ctx.disclosed ? '"Made with AI" label embedded on export.' : 'Enable the label — Meta favors disclosed AI creative, avoids reach penalty.' },
    { id: 'claims', label: 'Claim safety', status: health && beforeAfter ? 'warn' : 'pass', detail: health && beforeAfter ? 'Health/beauty before-after: avoid "guaranteed results" — add "results may vary".' : 'No high-risk health/beauty claims detected.' },
    { id: 'authenticity', label: 'Authenticity / AI-look', status: 'pass', detail: 'Real footage — low AI-look risk. Winning mix: 80% AI test + 20% real-creator proof (+23% conv).' },
    { id: 'c2pa', label: 'C2PA provenance', status: 'pending', be: true, detail: 'Content Credentials embedded at export (real-footage = zero compliance tax).' },
    { id: 'platform', label: 'Platform aspect', status: 'pass', detail: 'Meta-first 9:16 / 4:5 / 1:1.' },
  ]
}

// ---- Deep Editor: structured shot-script (SHOT_SCRIPT schema from engine analysis) ----
export type Beat = { id: string; tStart: number; tEnd: number; angle: string; action: string; vo: string }

// ⧗ BE brain: returns the beat timeline for a format × product (mock derives from real angles).
export async function buildShotScript(_formatId: string, product: DetectResult): Promise<Beat[]> {
  await wait(300)
  const a = product.angles
  const at = (i: number) => a[i]?.label ?? a[0]?.label ?? 'front'
  return [
    { id: 'b1', tStart: 0, tEnd: 3, angle: at(0), action: 'Hero close-up in natural window light', vo: 'Hook — "Ever notice how…"' },
    { id: 'b2', tStart: 3, tEnd: 6, angle: at(1), action: 'Turn to show the label / key claim', vo: 'Skepticism → the detail' },
    { id: 'b3', tStart: 6, tEnd: 9, angle: at(2), action: 'Slow push-in on texture as it is used', vo: 'Proof — how it actually works' },
    { id: 'b4', tStart: 9, tEnd: 10, angle: at(0), action: 'End card + product + CTA', vo: 'Verdict — "Install now"' },
  ]
}

// ⧗ BE/Stripe: hosted checkout (web) — iOS uses IAP. Mock sets the plan locally.
export async function startCheckout(_tier: string): Promise<{ ok: boolean; note: string }> {
  await wait(500)
  return { ok: false, note: '⧗ Stripe checkout not wired — plan applied (mock). Real hosted-checkout swaps in here.' }
}

export const isBEWired = () => Boolean(BE_URL)
