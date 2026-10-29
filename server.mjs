import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { renderHome, renderCard } from './scripts/render.mjs';

export const root = path.dirname(fileURLToPath(import.meta.url));
export const restaurant = JSON.parse(await readFile(path.join(root, 'data/restaurant.json'), 'utf8'));
const mime = { '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.pdf': 'application/pdf' };

export function createServer() {
  return http.createServer(async (req, res) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Content-Security-Policy', "default-src 'self'; style-src 'self'; script-src 'self'; img-src 'self' data:; base-uri 'none'; frame-ancestors 'none'; form-action 'none'");
    const send = (status, type, body) => { res.writeHead(status, { 'Content-Type': type }); res.end(req.method === 'HEAD' ? undefined : body); };
    if (!['GET', 'HEAD'].includes(req.method)) { res.setHeader('Allow', 'GET, HEAD'); return send(405, 'text/plain; charset=utf-8', 'Méthode non autorisée'); }
    let pathname;
    try { pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); }
    catch { return send(400, 'text/plain', 'Requête invalide'); }
    if (pathname === '/api/health') return send(200, 'application/json', JSON.stringify({ status: 'ok' }));
    if (pathname === '/api/menu') return send(200, 'application/json; charset=utf-8', JSON.stringify({ categories: restaurant.categories, provenance: restaurant.provenance }));
    if (pathname === '/api/restaurant') {
      const { categories, ...info } = restaurant;
      return send(200, 'application/json; charset=utf-8', JSON.stringify(info));
    }
    if (pathname === '/' || pathname === '/index.html') return send(200, 'text/html; charset=utf-8', renderHome(restaurant));
    if (['/carte', '/carte/', '/carte.html'].includes(pathname)) return send(200, 'text/html; charset=utf-8', renderCard(restaurant));
    const publicDir = path.join(root, 'public');
    const target = path.resolve(publicDir, '.' + pathname);
    if (!target.startsWith(publicDir + path.sep) || pathname.includes('\0')) return send(404, 'text/plain', 'Page introuvable');
    if (!mime[path.extname(target)]) return send(404, 'text/plain', 'Page introuvable');
    try { return send(200, mime[path.extname(target)], await readFile(target)); }
    catch { return send(404, 'text/plain; charset=utf-8', 'Page introuvable'); }
  });
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT || 3000);
  createServer().listen(port, '0.0.0.0', () => console.log(`La Cuisine de Dina : serveur démarré sur le port ${port}`));
}
