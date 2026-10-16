# kaanent.github.io

A static mirror of the Traction site, served at <https://kaanent.github.io/>.
The live site is <https://www.traction.it.com>.

Every file here except this README is generated. Nobody edits this repo by
hand: every push to `main` in `KaanEnt/Traction` runs its Pages mirror
workflow, which builds the export with `scripts/pages-mirror.mjs` and pushes
it here with a deploy key scoped to this repo. To rebuild without a push, run
that workflow by hand from the Actions tab.

The script is where the mirror's differences from the live site live:
static export, noindex with a canonical link to the live domain, a robots.txt
that disallows everything, and no LinkedIn working files.

## Known gaps

- Forms send the visitor to the same page on the live site to submit.
- The booking calendar shows its error state, since availability comes from a
  route that only exists on Vercel.
- `/api/summary` is served without a file extension, so Pages types it as
  `application/octet-stream` rather than JSON.
