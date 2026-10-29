import { mkdir, readFile, writeFile, cp } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderHome, renderCard, renderInfo } from './render.mjs';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const d = JSON.parse(await readFile(path.join(root, 'data/restaurant.json'), 'utf8'));
const out = path.join(root, 'artifacts/site');
await mkdir(out, { recursive: true });
await cp(path.join(root, 'public'), out, { recursive: true });
await writeFile(path.join(out, 'index.html'), renderHome(d));
await writeFile(path.join(out, 'carte.html'), renderCard(d));
console.log('Export statique : artifacts/site (ouvrir index.html, aucune installation).');

await writeFile(path.join(out, 'informations.html'), renderInfo(d));
