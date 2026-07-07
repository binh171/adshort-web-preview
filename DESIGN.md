# AdShort Web — DESIGN.md

> Nguồn-sự-thật thiết kế cho `adshort-web-preview`. Mọi module mới (Editor, Billing, Onboarding, Connect, Intelligence, Timing) bám file này.
> Grounded từ `src/styles/global.css` thật + ref Liquid Glass (`research/design-refs/.../glass/apple.md`). OKLCH convert chính xác từ hex hiện có (không đổi màu brand).
> Dòng chảy: **iOS-26 soft-futurism, emerald, light-first**. Calm · premium · trustworthy — bán *ad thắng* cho seller, không phải đồ chơi AI.

---

## 1. Design tokens (OKLCH, anchor 1 hue)

Toàn hệ neutral + brand cùng **hue 166** (đo được từ palette cũ → cohesion sẵn có). Giữ hex làm fallback, OKLCH là nguồn chỉnh.

```css
:root{
  --brand-hue: 166;               /* anchor duy nhất — đổi hue = đổi cả hệ */

  /* brand (emerald) */
  --brand:      oklch(44.2% 0.087 166);   /* #0C6248 primary action, links */
  --brand-dk:   oklch(31.2% 0.058 166);   /* #083A2B hover/pressed, deep bg */
  --brand-br:   oklch(65.3% 0.134 166);   /* #16A97A glow, focus ring, accents */
  --brand-soft: oklch(94.7% 0.016 166);   /* #E4F1EB chip/badge fill */
  --brand-line: oklch(86.3% 0.049 166);   /* #B4DDCC brand hairline */

  /* neutral (green-tinted → không dùng gray thuần) */
  --bg:      oklch(97.0% 0.004 166);  --panel:   oklch(100% 0 166);
  --panel-2: oklch(95.2% 0.009 166);  --raise:   oklch(93.5% 0.012 166);
  --ink:     oklch(23.2% 0.024 166);  --ink-2:   oklch(39.8% 0.026 166);
  --muted:   oklch(55.5% 0.025 166);  --faint:   oklch(70%   0.020 166);
  --line:    oklch(91.1% 0.012 166);  --line-2:  oklch(85%   0.015 166);
  --dark:    oklch(20.6% 0.017 166);  /* CTO bar, video slots */

  /* semantic (chỉ 3, dùng tiết chế — 1 tint/surface) */
  --gold: oklch(61.8% 0.128 72);   --gold-soft: oklch(97% 0.02 82);   /* BE/upgrade */
  --leak: oklch(52.9% 0.146 25);                                       /* churn/error/leak */

  /* vibrancy materials (Liquid Glass — alpha trên backdrop-blur) */
  --mat-thin:    color-mix(in oklab, var(--bg) 62%, transparent);
  --mat-regular: color-mix(in oklab, var(--bg) 80%, transparent);
  --mat-thick:   color-mix(in oklab, var(--bg) 92%, transparent);
  --blur: blur(20px) saturate(180%);
}
```

**Rule màu:** 1 tint/surface. `--brand` cho primary action duy nhất mỗi màn. `--gold`=BE/upgrade, `--leak`=cảnh báo. KHÔNG trộn gold+brand cùng 1 bề mặt (trừ endcard).

---

## 2. Typography

- **UI + body:** `system-ui, -apple-system, "Segoe UI Variable", "Segoe UI", Roboto, sans-serif` (Windows-first, không ép SF Pro vì host chính là Win). **KHÔNG thay bằng Inter.**
- **Mono:** `ui-monospace, "SF Mono", "Cascadia Code", "Segoe UI Mono"` — chip góc-thật, cost, ROI, status (giọng "kỹ thuật/số liệu").
- Scale (rem): 0.6 / 0.72 / 0.78 / 0.86 / 0.9 / 1.0 / **1.15** / clamp(1.4,2.6vw,1.9) — title dùng clamp.
- Weight: body 400/450, label 600, heading **750**, brand 800. Letter-spacing heading −.02em, body −.003em. `text-wrap:balance` cho heading.

---

## 3. Spacing · radius · elevation

- **8pt base:** 4 / 8 / 12 / 16 / 20 / 24 / 32 / 44 / 56 / 80.
- **Radius:** input 10 · button/chip 11 · panel/card 14 · sheet-top 16 · startbar 16 · pill/badge 20.
- **Elevation = material trước, shadow sau.** Chrome (topbar/nav/sheet) dùng material+blur, KHÔNG shadow. Card lift chỉ khi hover: `--shadow: 0 14px 34px -18px oklch(30% 0.03 166 / .4)`.
- Touch ≥44px, desktop-dense ≥28px.

---

## 4. Component contracts (khớp global.css hiện có)

| Thành phần | Spec |
|---|---|
| **Chrome** (topbar, sheet, nav) | material `--mat-regular` + `backdrop-filter: var(--blur)`, hairline `--line` đáy. Nổi trên content, không viền cứng |
| **Button primary** | `--brand` fill, #fff, radius 11, weight 700, hover `--brand-dk`, active scale .98 |
| **Button secondary** | `--panel-2` fill, `--line` viền, hover → `--brand-line`+`--brand` text |
| **Card / panel** | `--panel`, radius 14, hairline `--line` (mỏng). Hover lift + shadow. *Đích: giảm viền cứng, thiên material khi là overlay* |
| **Chip (góc thật)** | mono, `--brand-soft` fill, `--brand-line` viền, radius 7 |
| **Input / brief** | `--panel-2`/`#FAFCFB` fill, radius 10, focus = halo 4px `--brand-br` @18% (KHÔNG viền cứng khi focus) |
| **Segmented / seg** | `--panel-2`, on = `--brand` fill #fff |
| **BE tag ⧗** | `--gold-soft`, `--gold-line`, dành riêng điểm chờ backend |
| **Video slot / CTO bar** | `--dark` bg, accent `--brand-br` |

---

## 5. Motion (tinh tế — không màu mè)

- Transition chuẩn: `.15s` (bg/color), `.12s` (transform). Card lift `.15s`.
- Progress fill `.5s`; spinner `1s linear`.
- **Progressive reveal** (Generating): variant 1 hiện trước rồi 2,3 — không chờ cả 3. Khớp doctrine giảm 36% cảm-giác-chờ.
- Tôn trọng `prefers-reduced-motion` (đã có; mở rộng cho mọi anim mới).

## 6. Responsive

- Breakpoint 840px: gallery 4→2 col, grid2/results3/vgrid→1 col, tabs ẩn (→ menu), startbar dọc.
- Aspect video **Meta-first**: 9:16 / 4:5 / 1:1. KHÔNG 16:9 mặc định.
- `env(safe-area-inset-*)` + `@media (prefers-color-scheme)` cho PWA.

---

## 7. Do / Don't (agent guide)

**DO:** 1 brand-tint/surface · material+blur cho chrome · radius 11/14 · hue-anchor 166 cho mọi màu mới · mono cho số liệu/góc-thật · progressive reveal · real-footage ⧗BE seam rõ.

**DON'T:** Inter thay system font · trộn gold+brand 1 surface · shadow chồng lên material (giết blur) · viền cứng 1px trên overlay/sheet · gray thuần (dùng green-tinted neutral) · card-trong-card-trong-card · block-black-fade first frame.

---

## 8. Trạng thái & gap (migration)

- **Đang có:** light emerald ổn, glass mới ở topbar. Nhiều card/panel còn hard-border 1px.
- **Đích khi build module mới:** overlay/sheet/nav chuyển material+blur; card giữ hairline mảnh + radius, bỏ dần viền cứng ở lớp nổi; focus dùng halo thay viền.
- **Dark mode:** chưa có. Khi làm: đảo `--bg`↔`--dark`, giữ hue 166, material dùng `--dark` base.
```
--bg-dark: oklch(15% 0.012 166); --panel-dark: oklch(20.6% 0.017 166);
```
