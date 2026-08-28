# kaanent.github.io

A static mirror of the Traction site, served at <https://kaanent.github.io/>.
The live site is <https://www.traction.it.com>.

Every file here except this README is generated. Edit the Traction repo, then
regenerate; hand edits are lost on the next build.

## Regenerating

From a copy of the Traction repo, applied to the copy and not to Traction
itself, since none of it belongs in the Vercel build:

1. `next.config.ts` gets `output: "export"` and `images: { unoptimized: true }`.
   Pages has no Node runtime and no image optimiser.
2. Delete `app/api/lead`. It is a POST handler, which a static export cannot
   carry. Both lead forms then need their `fetch("/api/lead", ...)` swapped for
   `window.location.href = "https://www.traction.it.com/#call"`, so a visitor
   who submits here lands on the live form rather than hitting a dead endpoint.
3. Add `export const dynamic = "force-static"` to `app/icon.tsx` and
   `app/opengraph-image.tsx`. Generated images have to be resolved at build.
4. Point `metadataBase` at `https://www.traction.it.com`, add a `canonical`
   alternate to the same, and set `robots: { index: false, follow: false }`.
   Rewrite `app/robots.ts` to disallow all and delete `app/sitemap.ts`. A
   second public copy of the site would otherwise compete with the real one.
5. `npx next build`, then from `out/`: drop `branding/` (25MB of LinkedIn
   working files no page references), drop `opengraph-image` (every page points
   at the live domain's copy), delete `.DS_Store`, rename `icon` to `icon.png`
   and fix the `/icon?` references, and `touch .nojekyll` so Pages stops hiding
   the `_next/` directory.
6. Copy `out/` over this repo and commit.

## Known gaps

- The lead forms validate here but submit on the live site.
- `/api/summary` is served without a file extension, so Pages types it as
  `application/octet-stream` rather than JSON.
