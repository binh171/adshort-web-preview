// Pricing tiers — grounded in research/ADSHORT_CREDIT_PRICING_ONBOARDING_RESEARCH.
// $19 entry (not $14.99 — under-anchors), weekly credit reset (anti-hoarding),
// free = credit-limit NOT watermark, Studio is the anchor (middle-of-three).
export type Plan = {
  id: string; name: string; price: number; creditsWk: number // 0 = unlimited-relaxed
  tagline: string; popular?: boolean; features: string[]; cta: string
}

export const PLANS: Plan[] = [
  {
    id: 'creator', name: 'Creator', price: 19, creditsWk: 100,
    tagline: 'Solo seller, testing angles',
    features: ['100 credits / week (auto-reset)', 'All 7 TestFlight-ready formats', 'Batch up to 3 variants', 'Export MP4 · C2PA embedded', 'Compliance pre-flight', 'No watermark, ever'],
    cta: 'Start Creator',
  },
  {
    id: 'studio', name: 'Studio', price: 29, creditsWk: 400, popular: true,
    tagline: 'Scaling — batch & publish',
    features: ['400 credits / week', 'Batch matrix — unlimited combos', 'Connect & Publish to Meta', 'Timing / Trend engine', 'Library performance history', 'Priority render'],
    cta: 'Choose Studio',
  },
  {
    id: 'agency', name: 'Agency', price: 69, creditsWk: 0,
    tagline: 'Teams, multi-brand',
    features: ['Unlimited relaxed credits', 'Everything in Studio', 'Multi-brand workspaces', 'Team seats', 'Intelligence dashboard', 'API access'],
    cta: 'Choose Agency',
  },
]
