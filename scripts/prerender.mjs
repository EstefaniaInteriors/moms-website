/**
 * Post-build prerendering.
 *
 * After `vite build` produces the JS-only SPA in dist/, this script loads each
 * indexable route in a headless browser, lets React + react-helmet render, and
 * writes the fully-rendered HTML back to dist/<route>/index.html. Search engines
 * (and social/AI crawlers) then receive real content instead of an empty shell.
 *
 * It is intentionally NON-FATAL: if anything goes wrong it warns and exits 0 so a
 * prerender hiccup can never block a deploy — the plain SPA build still ships.
 *
 * Runs locally as part of `npm run build` (we deploy the prebuilt dist/).
 */
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { mkdirSync, writeFileSync } from 'node:fs';
import sirv from 'sirv';
import puppeteer from 'puppeteer';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = join(__dirname, '..', 'dist');

// Indexable routes only. /portfolio and the 404 page are noindex, so skip them.
const ROUTES = ['/', '/interiors', '/art', '/about', '/contact'];
const PORT = 4183;

async function main() {
  // Serve dist/ with SPA fallback so every route boots the app shell.
  const assets = sirv(distDir, { single: true, dev: false });
  const server = createServer((req, res) =>
    assets(req, res, () => {
      res.statusCode = 404;
      res.end('Not found');
    })
  );
  await new Promise((resolve) => server.listen(PORT, resolve));

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const rendered = {};
  for (const route of ROUTES) {
    const page = await browser.newPage();
    const url = `http://localhost:${PORT}${route}`;
    try {
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 20000 });
    } catch {
      console.warn(`  ⚠ ${route}: network idle timed out — capturing current DOM`);
    }
    // Wait until React has actually painted something into #root.
    try {
      await page.waitForFunction(
        () => {
          const r = document.querySelector('#root');
          return r && r.children.length > 0;
        },
        { timeout: 8000 }
      );
    } catch {
      console.warn(`  ⚠ ${route}: #root stayed empty`);
    }
    // Small settle so react-helmet finishes writing <title>/meta into <head>.
    await new Promise((r) => setTimeout(r, 800));
    rendered[route] = await page.content();
    await page.close();
    console.log(`  ✓ ${route} (${(rendered[route].length / 1024).toFixed(0)} KB)`);
  }

  await browser.close();
  server.close();

  for (const [route, html] of Object.entries(rendered)) {
    const outPath =
      route === '/' ? join(distDir, 'index.html') : join(distDir, route, 'index.html');
    mkdirSync(dirname(outPath), { recursive: true });
    writeFileSync(outPath, html, 'utf8');
  }
  console.log(`✅ Prerendered ${ROUTES.length} routes into dist/`);
}

main().catch((err) => {
  console.warn('⚠ Prerender skipped (SPA build still valid):', err.message);
  process.exit(0); // never block a deploy
});
