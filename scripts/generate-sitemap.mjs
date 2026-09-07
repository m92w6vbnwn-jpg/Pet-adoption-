#!/usr/bin/env node
/**
 * Writes public/sitemap.xml with absolute GitHub Pages URLs.
 * Run before `next build` so the file is copied into out/.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const base = "https://m92w6vbnwn-jpg.github.io/Pet-adoption-";

const petsSrc = fs.readFileSync(path.join(root, "src/data/pets.ts"), "utf8");
const breedsSrc = fs.readFileSync(path.join(root, "src/data/breeds.ts"), "utf8");

const petIds = [...petsSrc.matchAll(/id:\s*"([^"]+)"/g)].map((m) => m[1]);
const breedSlugs = [...breedsSrc.matchAll(/slug:\s*"([^"]+)"/g)].map((m) => m[1]);

const staticPaths = [
  "/",
  "/browse/",
  "/apply/",
  "/breeds/",
  "/about/",
  "/how-it-works/",
  "/contact/",
];

const urls = [
  ...staticPaths,
  ...petIds.map((id) => `/pets/${id}/`),
  ...breedSlugs.map((slug) => `/breeds/${slug}/`),
];

const today = new Date().toISOString().slice(0, 10);

const body = urls
  .map(
    (loc) => `  <url>
    <loc>${base}${loc}</loc>
    <lastmod>${today}</lastmod>
  </url>`
  )
  .join("\n");

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;

const outPath = path.join(root, "public/sitemap.xml");
fs.writeFileSync(outPath, xml, "utf8");
console.log(
  `Wrote ${outPath} (${urls.length} URLs: ${staticPaths.length} static, ${petIds.length} pets, ${breedSlugs.length} breeds)`
);
