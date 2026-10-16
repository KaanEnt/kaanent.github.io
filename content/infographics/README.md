# Infographics

Tracked LinkedIn pieces, built as plain HTML on the site's own tokens and fonts.
Open an `index.html` in a browser, edit the markup, re-render. Nothing here is
an AI image, so every number on a poster stays editable text.

Traction is the publisher of these pieces, not the subject of them. The footer
is the only place the brand appears.

## Layout

```
_kit/                     tokens.css, primitives.css, render.mjs
<nn>-<slug>/index.html    the piece, one fixed canvas
<nn>-<slug>/caption.md    the post body, exactly as it goes out
<nn>-<slug>/poster.png    the rendered upload
<nn>-<slug>/objects/      hand drawn SVG objects for that piece
<nn>-<slug>/logos/        vendor marks used by that piece
```

## Sizes

| Surface | Canvas |
| --- | --- |
| LinkedIn portrait post | 1080 x 1350 (the renderer default) |
| Square post | 1080 x 1080 (set it per page, see below) |

A page declares its own canvas, which is also what the renderer reads:

```html
<meta name="render-size" content="1080x1350" />
```

## Rendering

```bash
node public/content/infographics/_kit/render.mjs                    # every piece
node public/content/infographics/_kit/render.mjs 02-volume-is-dead  # just one
RENDER_2X=1 node public/content/infographics/_kit/render.mjs        # add @2x
```

`index.html` renders to `poster.png` beside it. Any other `*.html` in a piece
folder keeps its own name, which is how variants get compared.

The script is a fork of `public/branding/linkedin-personal/render.mjs` and drives
whatever Chrome is already installed. Point it somewhere else with
`CHROME_PATH=/path/to/chrome`. It needs no npm packages, but fonts load from
Google Fonts, so render with a network connection. The banner renderer is
untouched and still owns the 1584 x 396 covers.

## Tokens

`_kit/tokens.css` carries the five values from `lib/tokens.ts` unchanged, then a
short poster-only block.

| Token | Value | Used for |
| --- | --- | --- |
| Cream | `#FFFEF9` | Page field, type on dark fields |
| Exuberant Orange | `#E86800` | The path, station 01, one accent per surface |
| Candied Yams | `#F9A765` | A station field and the pale objects |
| Ink | `#353536` | Type on light fields |
| Near black | `#080807` | Type that has to hold on an orange field |
| Deep | `#C45500` | Exuberant Orange darkened, for a station that sits under 01 |

Candied Yams and Exuberant Orange never share a surface. Station 03 is a candied
field, so its label runs in Deep, not in Exuberant Orange.

Fonts are Fraunces for everything structural and Newsreader Medium Italic for
every label. Sentence case only. No forced uppercase, no em dashes.

## Composition rules baked in

- A piece is a path with stations on it, never four equal bands. Stations differ
  in size, fill, and rotation so the eye is told where to start.
- Objects, then the path, then the stations. Objects stay pale and never compete
  with a station.
- Logos are official vendor SVGs in vendor colour, with the vendor named
  underneath. A vendor with no official mark to hand gets a named colour chip.
  Never an invented monogram.
- The footer is a portrait, a name, a role, the wordmark, and the domain.

## The pieces

| Piece | Idea | Canvas |
| --- | --- | --- |
| `02-volume-is-dead` | Outbound in 2026 as a four station process map: authenticate, cap, invite, waterfall then keep. | 1080 x 1350 |

### Sourcing for `02-volume-is-dead`

- Station 01 is platform rule. Gmail, Yahoo, and Outlook treat 5,000 messages a
  day to their consumer inboxes as bulk sending, and bulk senders without SPF,
  DKIM, and DMARC get an SMTP reject.
- Station 02 is a practitioner guideline, not a platform rule. The roughly 30
  sends per inbox per day figure comes from Instantly's July 2026 ops guide.
  Do not attribute it to Google.
- Station 03 is a working ceiling, not a published quota. LinkedIn does not
  publish an invite cap, and Sales Navigator ships 50 InMails a month.
- Station 04 is method, not a vendor claim. Clay, HubSpot, and Findymail are
  named as the category tools, not as the stack Traction runs.
