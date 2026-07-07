# AdShort Web (desktop)

Production React + Vite + TS frontend for AdShort's desktop web — **AdVideo-first** build.
Prototype logic is real; the backend engine is mocked behind one seam.

## The BE seam (important)
All backend calls live in **`src/lib/be.ts`** (product-detect + remove-BG, brain shot-script,
gen/render, publish, intelligence). They return **mock** data today. When the BE contract lands,
swap each function body to a real `fetch(VITE_BE_URL + ...)` — component code doesn't change.
UI spots that hit the seam are flagged `⧗ BE`.

## Run
```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # -> dist/  (deployed to GitHub Pages via Actions)
```

## Structure
- `src/App.tsx` — shell + HashRouter (Pages-safe)
- `src/lib/be.ts` — **BE adapter (the seam)**
- `src/lib/store.tsx` — app state (product, draft, variants, library, credits)
- `src/data/formats.ts` — format catalog + TestFlight lock set (mirrors the Format QC Audit)
- `src/features/advideo/` — Explore → Console → Generating → Results (the deep flow)
- `src/features/onboarding/FirstRun.tsx` — <5-min aha flow
- `src/features/Library.tsx`, `Stub.tsx` — library + stubbed Store/Product tabs

## Scope
AdVideo deep (v1). Store/Product stubbed. P1 next: Editor, Billing, Onboarding polish.
P2: Connect, Intelligence, Timing engine.

Analysis & rationale: see `research/` on branch `research/adshort-web-analysis` in the
`claude-creative` repo (CORE handoff + engine prompt teardown + format QC audit).
