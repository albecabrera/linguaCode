# LinguaCode design system (source sync)

Sources inspected: `pages/assets/site.css`, `pages/simple-past/style.css`, `pages/ki8/style.css`. Only values present in these files are listed. This is an inventory, not a new global theme.

## Color
| Token | Value | Usage | Source |
| --- | --- | --- | --- |
| ink | #19252f | header/text | pages/assets/site.css |
| paper | #f7f8f7 | page background | pages/assets/site.css |
| mint | #a9d9c8 | brand accent | pages/assets/site.css |
| orange | #e86e4a | CTAs | pages/assets/site.css |
| line | #dce3e0 | separators | pages/assets/site.css |
| forest | #172e38 | trainer text/header | pages/simple-past/style.css |
| cream | #f5f4ed | trainer background | pages/simple-past/style.css |
| emerald | #20816f | focus/progress | pages/simple-past/style.css |
| rust | #a84628 | headings | pages/simple-past/style.css |
| moss | #318e76 | module tone | pages/ki8/style.css |
| ochre | #b96d13 | module tone | pages/ki8/style.css |
| slate | #57696e | hint text | pages/simple-past/style.css |
| white | #fff | cards | pages/simple-past/style.css |

## Typography and layout
- System font stack (`system-ui`, `-apple-system`, `Segoe UI`, `sans-serif`) from `pages/simple-past/style.css`; no external fonts.
- Hero heading uses `clamp(2.6rem,7vw,5rem)` / line-height `1.05`; body uses natural system text from `pages/simple-past/style.css`.
- Content max-width `1000px`; main padding `2rem 1.2rem 4rem`; card padding `clamp(1.25rem,4vw,2.5rem)` (`pages/simple-past/style.css`).
- Existing card radius `1.1rem`, field/button radius `.6rem`, and card shadow `0 10px 35px #172e3809` (`pages/simple-past/style.css`).
- Existing components: dark header with mint brand, white panel on cream, emerald focus ring, buttons at least comfortably tappable, feedback in text as well as color (`pages/simple-past/style.css`).

## Self-check for artboards
Use only colors and font families above; compare used colors and fonts before opening a board. Illustration geometry may be square/blocky while controls remain usable and accessible.
