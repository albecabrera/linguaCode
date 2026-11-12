# LinguaCode design system

_Synchronised inventory of values found in current project stylesheets. This document describes existing styles; it does not introduce a replacement global theme._

## Sources

- `pages/assets/site.css` — catalog and shared public surface.
- `public/assets/app.css` — public catalog/app surface.
- `public/assets/dashboard.css` — dashboard cards.
- `pages/eduplay/style.css` — EduPlay surface.
- Module styles: `pages/adelante2-kahoot/style.css`, `automaten/style.css`, `einmaleins/style.css`, `hardware-software/style.css`, `imperfecto/style.css`, `java-interaktiv/style.css`, `java/style.css`, `kara/style.css`, `ki8/style.css`, `primzahlen/style.css`, `simple-past/style.css`, `spanisch-tauziehen/style.css`, `tastatur/style.css`, `teilbarkeit/style.css`, and `teiler/style.css`.

## Typography

- Predominant local stack: `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif` (`pages/assets/site.css`, `public/assets/app.css`, and most module styles).
- Compact local stack: `system-ui, sans-serif` (`pages/eduplay/style.css`, `pages/tastatur/style.css`, `pages/teilbarkeit/style.css`).
- Monospace code stack: `ui-monospace, SFMono-Regular, Menlo, monospace` or `ui-monospace,monospace` (`public/assets/app.css`, `pages/java-interaktiv/style.css`, `pages/automaten/style.css`).
- Some game modules import Nunito from Google Fonts (`pages/adelante2-kahoot/style.css`, `pages/primzahlen/style.css`, `pages/spanisch-tauziehen/style.css`). The standalone artboard intentionally uses only the local system stack and no external URL.
- Common heading ranges found: `clamp(2rem, 4vw, 4rem)` to `clamp(3.8rem, 10vw, 7rem)`; catalog hero headings reach `clamp(2.8rem, 6vw, 5.8rem)`.
- Common body rhythm: `16px/1.5` or `16px/1.55`; EduPlay uses `1rem/1.55`; Tastatur uses `17px/1.45`.

## Color inventory

### Shared/catalog green-orange palette

| Token / role | Value | Source |
| --- | --- | --- |
| ink | `#19252f` | `pages/assets/site.css`, `public/assets/app.css` |
| forest | `#172e38` | `pages/simple-past/style.css`, `pages/tastatur/style.css`, `pages/ki8/style.css` |
| paper | `#f7f8f7` | `pages/assets/site.css`, `public/assets/app.css` |
| cream panel | `#f5f4ed` | `pages/simple-past/style.css`, `pages/tastatur/style.css` |
| mint | `#a9d9c8` | `pages/assets/site.css`, `public/assets/app.css`, `pages/simple-past/style.css` |
| orange accent | `#e86e4a` | `pages/assets/site.css`, `public/assets/app.css` |
| coral accent | `#ef7654` / `#ef7657` | `pages/automaten/style.css`, `pages/hardware-software/style.css`, `pages/simple-past/style.css` |
| line | `#dce3e0` | `pages/assets/site.css`, `public/assets/app.css` |
| muted | `#57696e` / `#64727c` | `pages/assets/site.css`, `public/assets/app.css` |
| emerald | `#20816f` | `pages/simple-past/style.css`, `pages/tastatur/style.css` |
| moss | `#318e76` | `pages/ki8/style.css` |
| rust | `#a84628` | `pages/simple-past/style.css`, `pages/tastatur/style.css` |
| ochre | `#b96d13` | `pages/simple-past/style.css`, `pages/teilbarkeit/style.css` |
| white | `#fff` | shared cards and controls across the catalog/modules |

### Current module families

| Family | Observed values | Source examples |
| --- | --- | --- |
| EduPlay | ink `#202944`, paper `#f5f6fc`, purple `#7652c9`, blue `#2879c9`, orange `#b75a00`, green `#16724e` | `pages/eduplay/style.css` |
| Violet game | ink `#20264f`, navy `#172554`, blue `#2878e8`, pink `#ff4e8c`, mint `#46ddbd`, yellow `#ffd452` | `pages/adelante2-kahoot/style.css`, `pages/primzahlen/style.css`, `pages/spanisch-tauziehen/style.css` |
| Blue/purple learning | ink `#26334d`, paper `#f5f7fb`, accent `#e67553`, blue `#dce9ff`, mint `#c8eddf`, gold `#f4c94d` | `pages/einmaleins/style.css` |
| Dark code editor | background `#090b10`, surface `#171c25`, editor `#0d1117`, text `#f5f7fa`, blue `#4c9aff`, orange `#f89820`, success `#3ddc84`, error `#ff5c68` | `pages/java-interaktiv/style.css` |
| Math / challenge | background `#090b10` family plus `#4c9aff`, `#3ddc84`, `#ffc857`, `#63b3ed` | `pages/java-interaktiv/style.css` |
| Hardware / typing | ink `#19252f`, paper `#f7f8f7`, blue `#1463b5`, green `#156d47`, red `#b32a33` | `pages/tastatur/style.css` |

## Surfaces, borders, and geometry

- Shared catalog content width: `1120px` in `public/assets/app.css`; liquid-glass catalog width: `1440px` in `pages/assets/site.css`.
- Other established widths: `1000px` (`pages/simple-past/style.css`), `1050px` (`pages/teilbarkeit/style.css`), `1080px` (`pages/automaten/style.css`), `1180px` (`pages/adelante2-kahoot/style.css`), `1200px` (`pages/eduplay/style.css`), `1350px` (`pages/kara/style.css`), `1440px` (`pages/java-interaktiv/style.css`), and `1600px` (`pages/tastatur/style.css`).
- Common card radius: `1rem`; larger module cards use `1.2rem`, `1.25rem`, `1.4rem`, `1.5rem`, `24px`, or `28px`.
- Catalog liquid glass: hero `2rem`, cards `1.5rem`, pills `999px`, surface `rgba(255,255,255,.72)`, border `rgba(87,105,110,.25)`, blur `18px` / `24px`.
- Dark catalog glass: surface `rgba(23,46,56,.85)`, border `rgba(169,217,200,.3)`, panel `#172e38`.
- Common borders: `1px solid` line tokens; interactive game controls also use `2px–4px` borders.
- Common shadows: `0 10px 35px rgba(23,46,56,.06)`, `0 10px 35px #172e3809`, `0 14px 38px #26334d14`, and module-specific high-contrast game shadows.

## Components and interaction

- Header patterns: dark `#19252f` / `#172e38` bars with white text and mint brand accents; EduPlay uses a white top bar.
- Buttons: rounded `.6rem–.8rem`, minimum heights from `44px` to `60px`, with accent fills, secondary pale fills, and disabled opacity around `.55–.7`.
- Focus: visible outlines are consistently `3px–4px`, commonly emerald `#20816f`, mint `#a9d9c8`, blue `#67a6e8`, or yellow `#ffd452`.
- Progress: rounded tracks (`.65rem–22px` tall), commonly filled with accent or mint-to-yellow / blue-to-success gradients.
- Feedback: positive surfaces commonly mint/green (`#d5f4e2`, `#d9fff4`, `#d9fff3`); negative surfaces commonly pale red/orange (`#ffe2e0`, `#f9ddd8`, `#fff0dc`). Feedback is also communicated with text and borders, not color alone.
- Motion found in modules includes short `.15s–.35s` transitions, pop/flip/appear animations, confetti, and reduced-motion media queries.

## Artboard contract

`design/system.html` is a self-contained 1440px reference board. It uses only system fonts, inline CSS, values found in the sources above, no external URLs, and demonstrates the shared catalog palette alongside the EduPlay, violet-game, and dark-editor families.
