// Regenerates public/og.png at build time from the live plugin catalog so the
// social-preview image always reflects the current counts (never goes stale).
// Run with bun:  bun run ./scripts/og.mjs   (invoked automatically before `astro build`)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PLUGINS, CATEGORY_ORDER } from '../src/data/plugins.ts';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(__dirname, '..', 'public', 'og.png');

// Mirror the site's live counts.
const cats = CATEGORY_ORDER.filter((c) => PLUGINS.some((p) => p.cat === c));
const total = PLUGINS.length;
const catCount = cats.length;
const totalStars = PLUGINS.reduce((s, p) => s + (p.stars ?? 0), 0);

// Brand palette (Hallmark Cobalt theme).
const paper = '#f7f8fa';
const ink = '#1c2230';
const ink2 = '#3a4153';
const muted = '#98a2b3';
const cobalt = '#2b6fe3';

const statsLine = `${total.toLocaleString('en-US')} plugins · ${catCount} categories · ${totalStars.toLocaleString('en-US')} ★`;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${paper}"/>

  <!-- top label -->
  <text x="72" y="92" font-family="ui-monospace, 'JetBrains Mono', Menlo, Consolas, monospace" font-size="34" fill="${muted}" letter-spacing="1">awesome-dsh-plugins</text>

  <!-- accent rule -->
  <rect x="72" y="146" width="120" height="6" rx="3" fill="${cobalt}"/>

  <!-- heading -->
  <text x="72" y="268" font-family="'Space Grotesk', 'Helvetica Neue', Arial, sans-serif" font-size="86" font-weight="700" fill="${ink}">Every DeepSeek</text>
  <text x="72" y="368" font-family="'Space Grotesk', 'Helvetica Neue', Arial, sans-serif" font-size="86" font-weight="700" fill="${ink}">Harness plugin,</text>
  <text x="72" y="468" xml:space="preserve" font-family="'Space Grotesk', 'Helvetica Neue', Arial, sans-serif" font-size="86" font-weight="700"><tspan fill="${ink}">one </tspan><tspan fill="${cobalt}">catalog.</tspan></text>

  <!-- live stats footer -->
  <text x="72" y="568" font-family="ui-monospace, 'JetBrains Mono', Menlo, Consolas, monospace" font-size="28" fill="${ink2}" letter-spacing="2">${statsLine.toUpperCase()}</text>
</svg>`;

await sharp(Buffer.from(svg)).png().toFile(OUT);

const { size } = fs.statSync(OUT);
console.log(`[og] wrote ${OUT} — ${total} plugins, ${catCount} categories, ${totalStars.toLocaleString('en-US')}★ (${(size / 1024).toFixed(1)} KB)`);
