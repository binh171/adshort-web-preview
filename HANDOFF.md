# AdShort Web — Handoff pointer

**Latest self-contained handoff:** `Claude Creative/research/ADSHORT_WEB_HANDOFF_2026-07-08.md`
(builds on `ADSHORT_WEB_BUILD_HANDOFF_2026-07-07.md` for the BE-seam contract + file tree).
Repo of docs: `binh171/claude-creative`, branch `research/adshort-web-analysis`.

## Quick state (2026-07-08)
- React 18 + Vite 5 + TS, HashRouter, base `/adshort-web-preview/`. `npm run dev` → localhost:5173.
- **All features P0+P1+P2 done (12+ surfaces). ALL COMMITTED + PUSHED** to `main` (HEAD `e0dfe74`) → GitHub Pages live at `https://binh171.github.io/adshort-web-preview/`. `npm run build` + `tsc --noEmit` both clean.
- Engine MOCKED via single seam `src/lib/be.ts` (swap to real `fetch()` when BE contract lands).
- Real license-safe images (`public/posters/`, 14) + hover-to-play clips (`public/clips/`, 6) across app. Premium visual pass (ambient mesh, glass, tactile buttons, oversized type). Demo-mode toggle (◯/◉ topbar) hides prototype/dev chrome for pitching.
- Design: `DESIGN.md` (OKLCH hue-166 emerald + iOS-26 Liquid Glass + dark). Font system-ui (deliberate, no Inter/serif).

## ⚠️ NEXT SESSION — priority #1
**Redesign the nav / topbar + buttons for a luxury, trendy feel** (owner explicitly unhappy: 8 flat text tabs, not premium, wants grouped/smooth/luxury nav + higher browse UX). See full handoff §4 for direction (grouped nav, animated sliding active indicator, floating glass nav, ⌘K palette, pill buttons; refs `glass/arc.md` + `editorial/linear.md`). Then: wire real BE (§ contract), optional multi-niche clips.

## Hard rules
Ask before paid gen (fal/superdesign/Imagen) · license-safe images only (Pexels; no competitor IP) · verify light+dark+mobile via playwright + screenshot, kill dev by-PID · Vietnamese comms, EN code · no em-dash in visible copy.
