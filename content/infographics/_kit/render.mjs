// Renders an infographic piece to PNG. Forked from
// public/branding/linkedin-personal/render.mjs, which still owns the banner
// sizes and file naming. The differences are only three: the default canvas is
// the LinkedIn portrait post (1080x1350), a piece is a folder with an
// index.html in it, and the output lands next to that file as poster.png.
//
// No npm dependencies. It drives whatever Chrome is already on the machine.
//
//   node public/content/infographics/_kit/render.mjs
//   node public/content/infographics/_kit/render.mjs 02-volume-is-dead
//   RENDER_2X=1 node public/content/infographics/_kit/render.mjs
//
// Override the browser with CHROME_PATH=/path/to/chrome if detection fails.

import { execFileSync } from "node:child_process";
import {
  existsSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync
} from "node:fs";
import { tmpdir } from "node:os";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const DIR = dirname(fileURLToPath(import.meta.url));
const PIECES = dirname(DIR);

// LinkedIn portrait post, the 4:5 crop that never gets cropped in feed.
// A page can opt out with <meta name="render-size" content="1080x1080" />.
const DEFAULT_SIZE = { width: 1080, height: 1350 };
const SCALES = process.env.RENDER_2X === "1" ? [1, 2] : [1];

function sizeOf(page) {
  const match = readFileSync(page, "utf8").match(
    /<meta\s+name="render-size"\s+content="(\d+)x(\d+)"/i
  );

  return match
    ? { width: Number(match[1]), height: Number(match[2]) }
    : DEFAULT_SIZE;
}

// An index.html is the piece itself, so it renders under the poster name.
// Anything else keeps its own filename, which is how variants get compared.
function outputName(page) {
  const file = basename(page);

  return file === "index.html" ? "poster" : file.replace(/\.html$/, "");
}

// Real binaries only. Distro wrapper scripts tend to force a shared profile
// directory, and a single stuck instance then blocks every later run.
const CANDIDATES = [
  process.env.CHROME_PATH,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/opt/google/chrome/chrome",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser"
].filter(Boolean);

const chrome = CANDIDATES.find((candidate) => existsSync(candidate));

if (!chrome) {
  console.error("No Chrome found. Set CHROME_PATH to a Chrome or Chromium binary.");
  process.exit(1);
}

// A request is a piece folder, a folder name, or a single html file.
function pagesFrom(target) {
  const path = resolve(PIECES, target);

  if (!existsSync(path)) return [];
  if (statSync(path).isFile()) return [path];

  return readdirSync(path)
    .filter((name) => name.endsWith(".html"))
    .sort()
    .map((name) => join(path, name));
}

const requested = process.argv.slice(2);
const targets = requested.length
  ? requested
  : readdirSync(PIECES, { withFileTypes: true })
      .filter((entry) => entry.isDirectory() && !entry.name.startsWith("_"))
      .map((entry) => entry.name)
      .sort();

const pages = targets.flatMap(pagesFrom);

if (!pages.length) {
  console.error("No piece found. Expected a folder with an index.html in it.");
  process.exit(1);
}

for (const page of pages) {
  const slug = join(dirname(page), outputName(page));
  const { width, height } = sizeOf(page);

  for (const scale of SCALES) {
    const out = scale === 1 ? `${slug}.png` : `${slug}@2x.png`;
    // Chrome writes profile junk into the data dir, so give each run its own.
    const profile = mkdtempSync(join(tmpdir(), "traction-infographic-"));

    try {
      execFileSync(
        chrome,
        [
          "--headless",
          "--no-sandbox",
          "--disable-gpu",
          "--disable-dev-shm-usage",
          "--hide-scrollbars",
          "--no-first-run",
          "--no-default-browser-check",
          "--disable-background-networking",
          "--disable-component-update",
          "--disable-sync",
          `--user-data-dir=${profile}`,
          // Web fonts and images need to settle before the frame is captured.
          "--virtual-time-budget=10000",
          `--window-size=${width},${height}`,
          `--force-device-scale-factor=${scale}`,
          `--screenshot=${out}`,
          pathToFileURL(page).href
        ],
        { stdio: ["ignore", "ignore", "ignore"], timeout: 90_000 }
      );
      console.log(`${out.replace(`${PIECES}/`, "")}  ${width * scale}x${height * scale}`);
    } catch {
      console.error(`Failed to render ${page} at ${scale}x`);
      process.exitCode = 1;
    } finally {
      rmSync(profile, { force: true, recursive: true });
    }
  }
}
