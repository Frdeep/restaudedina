import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { createServer, restaurant } from '../server.mjs';
const server = createServer();
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const base = `http://127.0.0.1:${server.address().port}`;
after(() => new Promise(resolve => server.close(resolve)));
test('page contenant tous les plats et les liens restaurant', async () => {
  const res = await fetch(base); const html = await res.text();
  assert.equal(res.status, 200);
  for (const c of restaurant.categories) for (const i of c.items) assert.ok(html.includes(`data-dish="${i.id}"`));
  assert.ok(html.includes(restaurant.phoneLink)); assert.ok(html.includes(restaurant.orderUrl));
  assert.ok(res.headers.get('content-security-policy').includes("frame-ancestors 'none'"));
});
test('API menu cohérente, tarifs non validés et identifiants uniques', async () => {
  const data = await (await fetch(base + '/api/menu')).json();
  assert.deepEqual(data.categories, restaurant.categories); assert.equal(data.provenance.validated, false);
  assert.ok(data.provenance.notice.includes('Uber Eats'));
  const ids = data.categories.flatMap(c => c.items.map(i => i.id)); assert.equal(new Set(ids).size, ids.length);
});
test('API restaurant et santé', async () => {
  assert.deepEqual(await (await fetch(base + '/api/health')).json(), {status:'ok'});
  const data = await (await fetch(base + '/api/restaurant')).json();
  assert.equal(data.address, restaurant.address); assert.equal(data.categories, undefined);
});
test('carte recto verso : chaque plat présent exactement une fois', async () => {
  const res = await fetch(base + '/carte.html'); const html = await res.text();
  assert.equal(res.status,200); assert.equal((html.match(/class="menu-sheet"/g)||[]).length,2);
  for (const c of restaurant.categories) for (const i of c.items) assert.equal(html.split(`data-dish="${i.id}"`).length - 1,1);
});
test('fichiers privés, traversée et routes inconnues inaccessibles', async () => {
  for (const url of ['/server.mjs','/data/restaurant.json','/.git/config','/%2e%2e%2fpackage.json','/unknown']) assert.equal((await fetch(base+url)).status,404);
  assert.equal((await fetch(base+'/%XX')).status,400);
  assert.equal((await fetch(base+'/',{method:'POST'})).status,405);
});
test('CSS, JS et icône accessibles et HEAD sans corps', async () => {
  for (const name of ['styles.css','app.js','favicon.svg']) assert.equal((await fetch(base+'/'+name)).status,200);
  const head = await fetch(base,{method:'HEAD'}); assert.equal(head.status,200); assert.equal(await head.text(),'');
});
test('aperçus sociaux liés aux vrais comptes sans charger les scripts Meta', async () => {
  const html = await (await fetch(base)).text();
  assert.ok(html.includes('https://www.instagram.com/la_cuisine_de_dina/'));
  assert.ok(html.includes('La-Cuisine-De-DINA-100060362415980'));
  assert.ok(!html.includes('/rees/'));
  assert.ok(html.includes('<iframe'));assert.ok(html.includes('https://www.instagram.com/cuisinededina/'));assert.ok(!html.includes('data-social-load'));
  assert.ok(!html.includes('connect.facebook.net'));
});
test('photos studio, logo, polices locales et scripts de mouvement accessibles', async () => {
  const html = await (await fetch(base)).text();
  const sources = [...html.matchAll(/(?:src|href)="\.\/([^"#]+)"/g)].map(m=>m[1]).filter(s=>/\.(webp|ttf|js|css|svg)$/.test(s));
  for(const file of new Set(sources)) {
    const res = await fetch(base+'/'+file);
    assert.equal(res.status,200,file);
    assert.ok((await res.arrayBuffer()).byteLength>0,file);
  }
});
test('informations, provenance des rendus et suppléments sont consultables', async () => {
  const res=await fetch(base+'/informations.html');
  assert.equal(res.status,200);
  assert.ok((await res.text()).includes('recréées par IA'));
  assert.deepEqual(restaurant.sides,['Riz blanc','Bananes aloko','Frites de patate douce','Frites maison','Attiéké']);
  assert.equal(restaurant.categories.flatMap(c=>c.items).length,32);
});
