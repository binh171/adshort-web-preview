# AdShort Web — Handoff pointer

**Full self-contained handoff:** `Claude Creative/research/ADSHORT_WEB_BUILD_HANDOFF_2026-07-07.md`
(repo `binh171/claude-creative`, branch `research/adshort-web-analysis`).

## Quick state (2026-07-07)
- React 18 + Vite 5 + TS, HashRouter, base `/adshort-web-preview/`. `npm run dev` → localhost:5173.
- **All features done (P0+P1+P2, 12+ surfaces).** Engine MOCKED via single seam `src/lib/be.ts` (swap to real `fetch()` when BE contract lands — components don't change).
- Design: `DESIGN.md` (OKLCH hue-166 emerald + iOS-26 Liquid Glass + dark mode). Font system-ui (deliberate).
- **NOT committed / NOT pushed** (owner directive). Last commit `9959d98`.

## Next (see full handoff §8)
1. Owner runs `superdesign login` → then agent drives superdesign (cloud, metered — confirm scope first).
2. `img2code` later: crawl real images to fill.
3. Wire real BE (see be.ts contract table in full handoff §4).
4. Commit + push only when owner approves.

## Hard rules
Ask before paid gen · no auto-push · verify light+dark+flow via playwright · Vietnamese comms.
