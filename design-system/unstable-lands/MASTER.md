# Design System Master File

> **LOGIC:** When building a specific page, first check `design-system/unstable-lands/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file.

---

**Project:** Unstable Lands — ALLMIND Memory Index
**Generated:** 2026-08-28
**Category:** Gaming wiki / AI terminal
**Locked style:** ALLMIND Memory Index (Cyberpunk HUD + Sci-Fi FUI + AI-Native)
**Design Dials:** Variance 8/10 | Motion 8/10 | Density 7/10

Catalog search suggested Brutalism + Orbitron. **Overridden** by campaign canon: ALLMIND is clinical (Armored Core 6), framed like Library of Ruina dossiers, Cyrillic-safe fonts only.

---

## Global Rules

### Color Palette (semantic)

| Role | Hex | CSS Variable | Meaning |
|------|-----|--------------|---------|
| Background | `#05060A` | `--color-bg` | OLED void |
| Elevated | `#0A0D14` | `--color-bg-elevated` | Status / chrome |
| Card | `#0E1218` | `--color-bg-card` | Panels |
| Surface | `#141A22` | `--color-surface` | Inputs |
| Light / headings | `#E8C872` | `--color-gold` | Выход Света |
| ALLMIND / system | `#7EC8C8` | `--color-argalius` | Links, HUD |
| Distortion | `#E85A7A` | `--color-distortion` | Errors, alerts |
| Foreground | `#E6E4DC` | `--color-text` | Body |
| Muted | `#9AA3B2` | `--color-text-muted` | Meta |
| Border | `#2A3344` | `--color-border` | HUD lines |

Contrast: body text ≥ 4.5:1 on plates/scrims. Never put body text on raw artwork.

### Typography (Cyrillic required)

- **Display:** Unbounded
- **UI + articles:** IBM Plex Sans
- **Chrome / MEM ids:** IBM Plex Mono (JetBrains Mono fallback)
- **Forbidden:** Orbitron, Cinzel, Share Tech Mono (no Cyrillic)

### Intensity modes

Attribute `data-intensity` on `<html>`:

- `archive` — table/phone default. No boot, grain, hologram, Flip morph. Larger type.
- `operator` — standard HUD, grain, card stagger, status scramble.
- `spectacle` — desktop first-visit. Boot, SplitText hero, Flip, hologram.

`prefers-reduced-motion: reduce` always forces `archive`.

Text scale: `data-text-scale="100|115|130"`.

### Motion

- Animate only `transform` and `opacity`.
- Exit ≤ 250ms on mobile.
- GSAP via `useGsap()` (context + matchMedia + kill on unmount).
- Flip + View Transitions for card→dossier on spectacle/desktop only.
- Pause looping timelines when `document.hidden`.
- No Lenis, no ScrollSmoother, no pin on mobile, no CRT flicker.

### HUD discipline

Persistent: dock, Recall, thin status bar.
Contextual: boot, hologram, TOC, related, random memory.
Not HUD: full-bleed portrait, scanlines over text.

### Anti-patterns

- Synthwave pink/cyan 80s
- Matrix-green CLI as body type
- Emoji as icons
- Hide header on scroll
- 600ms layout morph on touch
- Color as the only state signal
