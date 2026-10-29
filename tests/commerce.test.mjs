import {test,after} from 'node:test';
import assert from 'node:assert/strict';
import {createServer,restaurant} from '../server.mjs';
import {buildCatalog} from '../scripts/catalog.mjs';
import {sanitizeCart,addItem,cartTotal,CART_TTL} from '../public/cart-core.js';
const C=buildCatalog(restaurant),empty=()=>({version:1,updatedAt:Date.now(),lines:[]}),plain={sides:[],sauces:[]};
const server=createServer();await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));after(()=>new Promise(resolve=>server.close(resolve)));
const base=`http://127.0.0.1:${server.address().port}`;
test('catalogue et chaque fiche produit sont accessibles avec prix et description',async()=>{
 const api=await (await fetch(base+'/api/catalog')).json();assert.equal(api.products.length,32);assert.equal(api.orderEnabled,false);
 for(const p of C.products){const response=await fetch(base+'/'+p.url.slice(2));assert.equal(response.status,200,p.id);const html=await response.text();assert.ok(html.includes('data-product-form="'+p.id+'"'));assert.ok(html.includes('aucun débit'));}
 assert.equal((await fetch(base+'/produit-inconnu.html')).status,404);
});
test('vidéo accessible, HEAD et plages HTTP valides',async()=>{
 const head=await fetch(base+'/video/dina-hero.mp4',{method:'HEAD'});assert.equal(head.status,200);assert.equal(head.headers.get('content-type'),'video/mp4');assert.equal(head.headers.get('accept-ranges'),'bytes');
 const res=await fetch(base+'/video/dina-hero.mp4',{headers:{Range:'bytes=0-31'}});assert.equal(res.status,206);assert.equal((await res.arrayBuffer()).byteLength,32);assert.ok(res.headers.get('content-range').startsWith('bytes 0-31/'));
 const suffix=await fetch(base+'/video/dina-hero.mp4',{headers:{Range:'bytes=-8'}});assert.equal(suffix.status,206);assert.equal((await suffix.arrayBuffer()).byteLength,8);
 for(const range of ['bytes=999999999-','bytes=10-5','bytes=-0','potato'])assert.equal((await fetch(base+'/video/dina-hero.mp4',{headers:{Range:range}})).status,416);
});
test('panier, documents autonomes et scripts sont servis',async()=>{
 for(const name of ['panier.html','mentions.html','cgu.html','cgv.html','confidentialite.html','catalog.js','shop.js','cart-core.js'])assert.equal((await fetch(base+'/'+name)).status,200,name);
 assert.equal((await fetch(base+'/api/orders',{method:'POST',body:'{}'})).status,405);
});
test('addition en centimes et regroupement des sélections identiques',()=>{
 let cart=addItem(empty(),C,'yassa',3,plain);assert.equal(cartTotal(cart,C),5250);
 cart=addItem(cart,C,'yassa',2,plain);assert.equal(cart.lines.length,1);assert.equal(cart.lines[0].qty,5);assert.equal(cartTotal(cart,C),8750);
});
test('choix inclus obligatoires et sélections distinctes',()=>{
 assert.throws(()=>addItem(empty(),C,'demi-poulet',1,plain));
 const a={sides:['Riz blanc'],sauces:['Blanche']},b={sides:['Bananes aloko'],sauces:['Verte']};
 let cart=addItem(empty(),C,'demi-poulet',1,a);cart=addItem(cart,C,'demi-poulet',1,b);assert.equal(cart.lines.length,2);assert.equal(cartTotal(cart,C),3200);
 assert.throws(()=>addItem(empty(),C,'demi-poulet',1,{sides:['Un choix inventé'],sauces:['Blanche']}));
});
test('quantités et références invalides rejetées',()=>{
 for(const qty of [0,-1,1.5,21,NaN,Infinity])assert.throws(()=>addItem(empty(),C,'thieb',qty,plain));
 assert.throws(()=>addItem(empty(),C,'fake',1,plain));
 assert.throws(()=>addItem(addItem(empty(),C,'thieb',20,plain),C,'thieb',1,plain));
});
test('stockage corrompu, expiré et choix mal formés ne cassent pas le panier',()=>{
 for(const raw of ['invalid','null','{}','{"version":1,"lines":[]}',JSON.stringify({...empty(),updatedAt:Date.now()-CART_TTL-100})])assert.deepEqual(sanitizeCart(raw,C).lines,[]);
 const missing={...empty(),lines:[{productId:'thieb',qty:1,choices:{}}]};assert.deepEqual(sanitizeCart(missing,C).lines,[]);
 const mixed={...empty(),lines:[{productId:'thieb',qty:2,priceCents:1,choices:plain},{productId:'fake',qty:1,choices:plain}]};const cart=sanitizeCart(mixed,C);assert.equal(cart.lines.length,1);assert.equal(cartTotal(cart,C),3400);assert.equal(cart.lines[0].priceCents,undefined);
});
test('nouveau profil et trois publications Instagram fournis par le client',()=>{
 assert.equal(C.socials.instagram,'https://www.instagram.com/la_cuisine_de_dina/');assert.equal(C.socials.instagramPosts.length,3);assert.ok(C.socials.instagramPosts[0].includes('Cu_9HepI3N5'));
});

test('mentions légales reprennent les renseignements de société fournis sans publier la naissance',async()=>{const html=await(await fetch(base+'/mentions.html')).text();for(const expected of ['DF DINA’S FOOD','951 262 922 00010','FR84951262922','500,00','Medina Tall'])assert.ok(html.includes(expected),expected);assert.ok(!html.includes('1989'));});

test('chaque produit dispose de fichiers médias servis, sans assortiment de secours pour les plats',async()=>{
 for(const p of C.products){
  for(const width of [480,960,1440]){const r=await fetch(base+`/media/${p.media.file}-${width}.webp`,{method:'HEAD'});assert.equal(r.status,200,p.id+' '+width);assert.equal(r.headers.get('content-type'),'image/webp');}
  if(['plats','grillades','chawarmas'].includes(p.category))assert.ok(!/assortiment|photo spécifique.*venir/i.test(p.media.label),p.id);
 }
 const lookup=id=>C.products.find(p=>p.id===id).media;
 for(const ids of [['yassa','mafe','thiou'],['brochettes-poulet','brochettes-boeuf','brochettes-agneau','brochettes-mixtes'],['pastels','fatayas','nems'],['bissap-rouge','bissap-blanc','bouye','gingembre','sodas']])assert.equal(new Set(ids.map(id=>{const m=lookup(id);return m.file+'/'+m.crop;})).size,ids.length);
 assert.ok(lookup('box-30').label.includes('non représentées exactement'));
});
test('accueil partage une URL canonique sans fragment et widgets gardent les vrais permaliens',async()=>{
 const html=await(await fetch(base)).text();assert.ok(html.includes('<link rel="canonical" href="https://restaudedina.vercel.app/">'));assert.ok(html.includes('class="social-bento"'));
 for(const url of C.socials.instagramPosts)assert.ok(html.includes(url));
 assert.equal((await fetch(base+'/social-feed.js')).status,200);
 assert.ok(!html.includes('<iframe'));
});


test('widgets autonomes : liens officiels et présentation native, sans dépendance aux agrégateurs',async()=>{
 const html=await(await fetch(base)).text(),script=await(await fetch(base+'/social-feed.js')).text();
 for(const source of [html,script])assert.ok(!/elfsight|commonninja/i.test(source));
 assert.equal((html.match(/data-post-url=/g)||[]).length,3);
 for(const url of C.socials.instagramPosts)assert.ok(html.includes('data-post-url="'+url+'"'));
 assert.ok(html.includes('network-avatar-instagram'));assert.ok(html.includes('facebook-page-header'));
 assert.ok(html.includes('Afficher les publications Instagram'));assert.ok(html.includes('Afficher les publications Facebook'));
});
