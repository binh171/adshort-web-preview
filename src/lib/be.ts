// ============================================================================
// BE ADAPTER — the single seam between the web app and the backend engine.
// Everything here is MOCK today. When the BE contract lands, swap each function
// body to a real `fetch(BE_URL + ...)` — the component code never changes.
// ⧗ BE items flagged in UI map 1:1 to the functions below.
// ============================================================================

export type Angle = { id: string; label: string; kind: 'front' | 'label' | 'texture' | 'side' | 'detail'; url: string }
export type DetectResult = { category: string; productName: string; label: string; angles: Angle[] }
export type Variant = { id: string; style: 'Cinematic' | 'Demo' | 'Hook'; poster: string; ready: boolean }
export type GenProgress = { pct: number; status: string; variants: Variant[] }

const BE_URL = import.meta.env.VITE_BE_URL ?? '' // set when BE is wired

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))
const grad = (a: string, b: string) => `linear-gradient(160deg, ${a}, ${b})`

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
    { id: 'v0', style: 'Cinematic', poster: grad('#c98a6a', '#5a3226'), ready: false },
    { id: 'v1', style: 'Demo', poster: grad('#6a92c9', '#26385a'), ready: false },
    { id: 'v2', style: 'Hook', poster: grad('#7ab98f', '#265a3e'), ready: false },
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

export const isBEWired = () => Boolean(BE_URL)
