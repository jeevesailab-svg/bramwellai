# Bramwell brand asset kit

All assets are served from the site root (TanStack Start `public/`).

## Palette

| Token  | Hex       | Use                          |
| ------ | --------- | ---------------------------- |
| Ink    | `#1A1613` | Primary text, mono-dark mark |
| Cream  | `#FBF7EF` | Background                   |
| Orange | `#F26B2E` | Gradient stop 1              |
| Pink   | `#E43A8E` | Gradient stop 2              |
| Indigo | `#6674E8` | Gradient stop 3              |
| Gold   | `#F5C542` | `.ai` wordmark accent        |
| Mint   | `#8FE3C6` | Playful blob                 |
| Coral  | `#FFB199` | Playful blob                 |

Gradient: linear 0 to 50% to 100%, orange to pink to indigo.

## Logo variants (`public/`)

| File                    | Use                                                  |
| ----------------------- | ---------------------------------------------------- |
| `logo-mark.svg`         | Full-color speech-bubble + mic (default)             |
| `logo-horizontal.svg`   | Mark + "Bramwell.ai" wordmark, light backgrounds     |
| `logo-mono-dark.svg`    | Solid ink mark when gradient is not allowed          |
| `logo-mono-light.svg`   | Inverted white mark for dark backgrounds             |
| `favicon.svg`           | Browser tab icon, thicker strokes for 16px           |

In-app, `src/components/site/BramwellLogo.tsx` is the source of truth
for placement inside the product. The SVGs above are for embeds,
share cards, emails, decks and partner use.

## Social share

| File           | Size     | Use                                                    |
| -------------- | -------- | ------------------------------------------------------ |
| `og-image.png` | 1200x630 | `og:image` and `twitter:image` (summary_large_image) |

Absolute URL in production: `https://bramwellai.com/og-image.png`.

## Metadata pattern

Sitewide defaults live in `src/routes/__root.tsx`: `og:type: website`,
`og:site_name: Bramwell.ai`, `twitter:card: summary_large_image`,
plus `og:image` and `twitter:image` pointing at the card above.

Every shareable leaf route sets its own `title`, `description`,
`og:title`, `og:description`, `og:url` and `canonical`. Only add
`og:image` on a leaf route when the page has a meaningful hero image
that beats the site-wide card, since a leaf `og:image` overrides root.

## Tone

- Product name is always **Bramwell.ai** in prose. The `.ai` is the
  gold accent in the wordmark.
- Tagline: **Speak like the best in the room.**
- Never combine the gradient mark with a coloured background other
  than cream, white, or ink.
- Minimum clear space around the mark is half the mark's height.
