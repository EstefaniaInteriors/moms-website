/**
 * Build-time sitemap generator.
 *
 * Walks the real image files in public/images and writes public/sitemap.xml with
 * ONLY URLs that actually exist — so the sitemap can never drift out of sync with
 * the photos again (the previous hand-written sitemap pointed Google at many
 * renamed/deleted images that 404'd, so they never got indexed).
 *
 * Image URLs use the same raw.githubusercontent.com host the site loads from.
 * Runs first in `npm run build`.
 */
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';
import { readdirSync, statSync, writeFileSync } from 'node:fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const imagesDir = join(root, 'public', 'images');

const SITE = 'https://estefaniabustamante.com';
const RAW = 'https://raw.githubusercontent.com/EstefaniaInteriors/moms-website/main';
const IMG_RE = /\.(jpe?g|png|gif|webp)$/i;

// Recursively collect image file paths (relative to repo root, e.g. "public/images/...").
function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else if (IMG_RE.test(name)) out.push(relative(root, full));
  }
  return out;
}

// Encode a repo-relative path into a URL (encode each segment, keep the slashes).
const toUrl = (p) => `${RAW}/${p.split('/').map(encodeURIComponent).join('/')}`;
const xmlEscape = (s) => s.replace(/[<>&'"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[c]));

const allImages = walk(imagesDir);
const byTop = (top) => allImages.filter((p) => p.startsWith(`public/images/${top}/`));

// Map image folders -> pages, with a human title for each image.
const interiors = byTop('interiors').map((p) => {
  const loc = p.split('/')[3] || 'New York'; // public/images/interiors/<Location>/<file>
  return { loc: toUrl(p), title: `Estefania Bustamante interiors — ${loc}, New York` };
});
const art = byTop('art').map((p) => ({ loc: toUrl(p), title: 'Art curated by Estefania Interiors, New York' }));
const hero = byTop('hero-shots').map((p) => ({ loc: toUrl(p), title: 'Estefania Interiors — New York interior design' }));

const pages = [
  { path: '/', priority: '1.0', images: hero },
  { path: '/interiors', priority: '0.9', images: interiors },
  { path: '/art', priority: '0.9', images: art },
  { path: '/about', priority: '0.7', images: [] },
  { path: '/contact', priority: '0.6', images: [] },
];

const urlXml = (page) => {
  const imgs = page.images
    .map((im) => `    <image:image>\n      <image:loc>${xmlEscape(im.loc)}</image:loc>\n      <image:title>${xmlEscape(im.title)}</image:title>\n    </image:image>`)
    .join('\n');
  return `  <url>\n    <loc>${SITE}${page.path}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>${page.priority}</priority>${imgs ? '\n' + imgs : ''}\n  </url>`;
};

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n\n${pages.map(urlXml).join('\n\n')}\n\n</urlset>\n`;

writeFileSync(join(root, 'public', 'sitemap.xml'), xml, 'utf8');
const total = interiors.length + art.length + hero.length;
console.log(`✅ sitemap.xml generated — ${total} real images (interiors ${interiors.length}, art ${art.length}, hero ${hero.length})`);
