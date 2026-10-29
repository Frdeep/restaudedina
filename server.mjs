import { createReadStream } from 'node:fs';
import {buildCatalog,catalogScript} from './scripts/catalog.mjs';
import {renderProduct,renderCart,renderLegal} from './scripts/shop-render.mjs';
import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { renderHome, renderCard, renderInfo } from './scripts/render.mjs';

export const root = path.dirname(fileURLToPath(import.meta.url));
export const restaurant = JSON.parse(await readFile(path.join(root, 'data/restaurant.json'), 'utf8'));
const mime = { '.mp4': 'video/mp4', '.ttf': 'font/ttf', '.txt': 'text/plain; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.pdf': 'application/pdf' };

export function createServer() {
  return http.createServer(async (req, res) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Content-Security-Policy', "default-src 'self'; style-src 'self'; script-src 'self'; img-src 'self' data:; media-src 'self'; frame-src https://www.facebook.com https://www.instagram.com https://maps.google.com https://www.google.com; base-uri 'none'; frame-ancestors 'none'; form-action 'none'");
    const send = (status, type, body) => { res.writeHead(status, { 'Content-Type': type }); res.end(req.method === 'HEAD' ? undefined : body); };
    if (!['GET', 'HEAD'].includes(req.method)) { res.setHeader('Allow', 'GET, HEAD'); return send(405, 'text/plain; charset=utf-8', 'Méthode non autorisée'); }
    let pathname;
    try { pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); }
    catch { return send(400, 'text/plain', 'Requête invalide'); }
    if (pathname === '/catalog.js') return send(200, 'text/javascript; charset=utf-8', catalogScript(restaurant));
    if (pathname === '/api/catalog') return send(200, 'application/json; charset=utf-8', JSON.stringify(buildCatalog(restaurant)));
    if (pathname === '/panier.html') return send(200, 'text/html; charset=utf-8', renderCart(restaurant));
    const productMatch = pathname.match(/^\/produit-([a-z0-9-]+)\.html$/);
    if (productMatch) { const html=renderProduct(restaurant,productMatch[1]);return send(html?200:404,'text/html; charset=utf-8',html||'Plat introuvable'); }
    const legalMatch=pathname.match(/^\/(mentions|cgu|cgv|confidentialite)\.html$/);
    if (legalMatch) return send(200,'text/html; charset=utf-8',renderLegal(restaurant,legalMatch[1]));
    if (pathname === '/api/health') return send(200, 'application/json', JSON.stringify({ status: 'ok' }));
    if (pathname === '/api/menu') return send(200, 'application/json; charset=utf-8', JSON.stringify({ categories: restaurant.categories, provenance: restaurant.provenance }));
    if (pathname === '/api/restaurant') {
      const { categories, ...info } = restaurant;
      return send(200, 'application/json; charset=utf-8', JSON.stringify(info));
    }
    if (pathname === '/' || pathname === '/index.html') return send(200, 'text/html; charset=utf-8', renderHome(restaurant));
    if (pathname === '/carte/') { res.writeHead(302, { Location: '/carte.html' }); return res.end(); }
    if (pathname === '/informations.html') return send(200, 'text/html; charset=utf-8', renderInfo(restaurant));
    if (['/carte', '/carte.html'].includes(pathname)) return send(200, 'text/html; charset=utf-8', renderCard(restaurant));
    const publicDir = path.join(root, 'public');
    const target = path.resolve(publicDir, '.' + pathname);
    if (!target.startsWith(publicDir + path.sep) || pathname.includes('\0')) return send(404, 'text/plain', 'Page introuvable');
    if (!mime[path.extname(target)]) return send(404, 'text/plain', 'Page introuvable');
    if (path.extname(target)==='.mp4') {
      try {
        const {size}=await stat(target);let start=0,end=size-1,status=200;
        if(req.headers.range){
          const match=/^bytes=(\d*)-(\d*)$/.exec(req.headers.range);
          if(!match||(!match[1]&&!match[2])){res.setHeader('Content-Range',`bytes */${size}`);return send(416,'text/plain','Plage invalide');}
          if(!match[1]){const suffix=Number(match[2]);if(!Number.isSafeInteger(suffix)||suffix<=0){res.setHeader('Content-Range',`bytes */${size}`);return send(416,'text/plain','Plage invalide');}start=Math.max(0,size-suffix);}
          else {start=Number(match[1]);end=match[2]?Number(match[2]):size-1;}
          if(!Number.isSafeInteger(start)||!Number.isSafeInteger(end)||start<0||start>=size||end<start){res.setHeader('Content-Range',`bytes */${size}`);return send(416,'text/plain','Plage invalide');}
          end=Math.min(end,size-1);status=206;res.setHeader('Content-Range',`bytes ${start}-${end}/${size}`);
        }
        res.writeHead(status,{'Content-Type':'video/mp4','Accept-Ranges':'bytes','Content-Length':end-start+1});
        if(req.method==='HEAD')return res.end();
        const stream=createReadStream(target,{start,end});stream.on('error',()=>res.destroy());res.on('close',()=>stream.destroy());stream.pipe(res);return;
      } catch {return send(404,'text/plain','Vidéo introuvable');}
    }
    try { return send(200, mime[path.extname(target)], await readFile(target)); }
    catch { return send(404, 'text/plain; charset=utf-8', 'Page introuvable'); }
  });
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT || 3000);
  createServer().listen(port, '0.0.0.0', () => console.log(`La Cuisine de Dina : serveur démarré sur le port ${port}`));
}
