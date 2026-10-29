// Local browser validation. Remote Meta/Maps responses are technical fixtures,
// never evidence that the providers accepted or rendered the real contents.
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs/promises');
(async()=>{
 const {createServer,restaurant}=await import('../server.mjs');
 const {buildCatalog}=await import('./catalog.mjs');const {productVisual}=await import('./shop-ui.mjs');
 const C=buildCatalog(restaurant),server=createServer();await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port;
 let browser;
 try{
  browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox'],headless:true});await fs.mkdir('artifacts/v4',{recursive:true});
  const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'}),page=await context.newPage(),errors=[],requests=[];
  page.on('pageerror',e=>errors.push(String(e)));
  await context.route(/https:\/\/((www\.)?(instagram|facebook)|maps\.google|www\.google)\.com\/.*/,route=>{requests.push(route.request().url());return route.fulfill({status:200,contentType:'text/html',body:'<!doctype html><html lang="fr"><title>Fixture externe de test</title><p>Réponse technique simulée. Aucun contenu social ou cartographique réel.</p></html>'});});
  await page.goto(base,{waitUntil:'networkidle'});assert.equal(await page.locator('[data-social-load]').count(),0);assert.equal(await page.locator('iframe').count(),6);
  for(const p of C.products){
   const link=page.locator(`[data-product-id="${p.id}"]`);await link.focus();const visual=page.locator('#dish-preview .product-visual');await visual.waitFor({state:'visible'});
   assert.ok((await visual.locator('img').getAttribute('src')).includes(p.media.file));assert.equal(await page.locator('.preview-name').textContent(),p.name);
   if(p.media.crop!=='none')assert.ok(await visual.evaluate((el,crop)=>el.classList.contains('crop-'+crop),p.media.crop));
   await visual.locator('img').evaluate(img=>img.decode());await page.keyboard.press('Escape');assert.equal(await page.locator('#dish-preview').isVisible(),false);
  }
  const primary=page.locator('[data-social-slot=instagram-cuisinededina]'),secondary=page.locator('[data-social-slot=instagram-la-cuisine-de-dina]');
  assert.equal(await primary.locator('iframe').count(),1);assert.ok((await primary.locator('iframe').getAttribute('src')).includes('/p/C4GlrBSofJx/embed/'));assert.equal(await secondary.locator('iframe').count(),3);
  assert.equal(await page.locator('a[href="https://www.instagram.com/stories/highlights/18057664687533926/"]').count(),1);assert.equal(await page.locator('iframe[src*=highlights]').count(),0);
  for(const width of [320,390,768,1024,1440]){
   await page.setViewportSize({width,height:950});await page.locator('.social-bento').scrollIntoViewIfNeeded();await page.waitForTimeout(80);
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`overflow ${width}`);
   for(const frame of await page.locator('iframe').all())assert.ok(await frame.evaluate(el=>el.getBoundingClientRect().width<=innerWidth));
   for(const key of ['instagram-cuisinededina','instagram-la-cuisine-de-dina','facebook'])await page.locator(`[data-social-retry=${key}]`).click();
   assert.equal(await page.locator('iframe').count(),6);assert.equal(await primary.locator('iframe').count(),1);assert.equal(await secondary.locator('iframe').count(),3);
   await page.locator('.social-bento').screenshot({path:`artifacts/v4/feeds-${width}-routing-fixtures.png`});
   await page.locator('.visit-map').screenshot({path:`artifacts/v4/maps-${width}-routing-fixture.png`});
  }
  const nojs=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});await nojs.route(/https:\/\/((www\.)?(instagram|facebook)|maps\.google|www\.google)\.com\/.*/,r=>r.fulfill({status:200,contentType:'text/html',body:'<p>Fixture de lecteur externe sans JavaScript du site</p>'}));
  const plain=await nojs.newPage();await plain.goto(base,{waitUntil:'networkidle'});assert.equal(await plain.locator('iframe').count(),6);assert.equal(await plain.locator('[data-social-load]').count(),0);assert.equal(await plain.locator('.restaurant-map').count(),1);
  const galleryContext=await browser.newContext({viewport:{width:1600,height:1200},bypassCSP:true});const gallery=await galleryContext.newPage();await gallery.route(/https:\/\/.*/,r=>r.fulfill({status:200,contentType:'text/html',body:'<p>Fixture</p>'}));await gallery.goto(base,{waitUntil:'networkidle'});
  await gallery.setContent('<!doctype html><html lang="fr"><head><base href="'+base+'/"><link rel="stylesheet" href="'+base+'/styles.css"></head><body><main class="media-review">'+C.products.map(p=>'<article>'+productVisual(p)+'<h2>'+p.name+'</h2><p>'+p.media.label+'</p></article>').join('')+'</main></body></html>');
  await gallery.addStyleTag({content:'.media-review{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:16px;padding:24px}.media-review article{border:1px solid #ddd;padding:8px}.media-review h2{font:600 16px Outfit;letter-spacing:0}.media-review p{font:12px Outfit}.media-review .product-visual{aspect-ratio:1}'});
  for(const img of await gallery.locator('img').all())await img.evaluate(el=>{el.loading='eager';return el.decode();});await gallery.evaluate(()=>document.fonts.ready);await gallery.screenshot({path:'artifacts/v4/catalogue-32-photos.png',fullPage:true});
  assert.deepEqual(errors,[]);assert.ok(requests.some(url=>url.includes('C4GlrBSofJx/embed/')));assert.ok(requests.some(url=>url.includes('maps.google.com')));
  console.log('OK : 32 aperçus, deux comptes distincts, 5 lecteurs sociaux et Maps automatiques, story en lien, nouvel essai, cinq largeurs et sans JavaScript. Réponses externes simulées.');
 }finally{if(browser)await browser.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exitCode=1;});
