// Local integration checks. Meta responses are intentionally mocked: no claim of
// provider acceptance or production rendering is inferred from these tests.
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs/promises');
(async()=>{
 const {createServer,restaurant}=await import('../server.mjs');
 const {buildCatalog}=await import('./catalog.mjs');const {productVisual}=await import('./shop-ui.mjs');
 const C=buildCatalog(restaurant),server=createServer();await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port;
 let browser;
 try{
  browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox'],headless:true});await fs.mkdir('artifacts/v3',{recursive:true});
  const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'}),page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(String(e)));
  let requests=0;await context.route(/https:\/\/www\.(instagram|facebook)\.com\/.*/,route=>{requests++;return route.fulfill({status:200,contentType:'text/html',body:'<!doctype html><html lang="fr"><title>Fixture technique</title><p>Réponse Meta simulée pour le test technique, pas une publication.</p></html>'});});
  await page.goto(base,{waitUntil:'networkidle'});assert.equal(requests,0);
  for(const p of C.products){
   const link=page.locator(`[data-product-id="${p.id}"]`);await link.focus();
   const visual=page.locator('#dish-preview .product-visual');await visual.waitFor({state:'visible'});
   assert.ok((await visual.locator('img').getAttribute('src')).includes(p.media.file));assert.equal(await page.locator('.preview-name').textContent(),p.name);
   if(p.media.crop!=='none')assert.ok(await visual.evaluate((el,crop)=>el.classList.contains('crop-'+crop),p.media.crop));
   await visual.locator('img').evaluate(img=>img.decode());assert.ok(await visual.locator('img').evaluate(img=>img.naturalWidth>0));
   await page.keyboard.press('Escape');assert.equal(await page.locator('#dish-preview').isVisible(),false);
  }
  console.log('OK : les 32 titres affichent leur média associé, décodable et étiqueté.');
  await page.locator('.social-bento').screenshot({path:'artifacts/v3/bento-before-consent-1440.png'});
  for(const width of [320,390,768,1024,1440]){
   await page.setViewportSize({width,height:950});
   for(const service of ['instagram','facebook'])await page.locator(`[data-social-load=${service}]`).click();
   assert.equal(await page.locator('iframe').count(),4);
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   for(const frame of await page.locator('iframe').all())assert.ok(await frame.evaluate(el=>el.getBoundingClientRect().width<=innerWidth));
   if(width===320)await page.screenshot({path:'artifacts/v3/bento-loaded-320-routing-fixture.png',fullPage:true});
   for(const service of ['instagram','facebook'])await page.locator(`[data-social-load=${service}]`).click();assert.equal(await page.locator('iframe').count(),0);
  }
  await page.setViewportSize({width:1600,height:1200});
  const galleryContext=await browser.newContext({viewport:{width:1600,height:1200},bypassCSP:true});
  const gallery=await galleryContext.newPage();await gallery.goto(base,{waitUntil:"networkidle"});
  // CSP bypass applies only to this isolated, non-shipped review fixture.
  // Render the actual shared product component into a local-only review gallery.
  await gallery.setContent('<!doctype html><html lang="fr"><head><base href="'+base+'/"><link rel="stylesheet" href="'+base+'/styles.css"></head><body><main class="media-review">'+C.products.map(p=>'<article>'+productVisual(p)+'<h2>'+p.name+'</h2><p>'+p.media.label+'</p></article>').join('')+'</main></body></html>');
  await gallery.addStyleTag({content:'.media-review{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:16px;padding:24px}.media-review article{border:1px solid #ddd;padding:8px}.media-review h2{font:600 16px Outfit;letter-spacing:0}.media-review p{font:12px Outfit}.media-review .product-visual{aspect-ratio:1}'});
  for(const img of await gallery.locator('img').all())await img.evaluate(el=>{el.loading='eager';return el.decode();});
  await gallery.evaluate(()=>document.fonts.ready);
  await gallery.screenshot({path:'artifacts/v3/catalogue-32-photos.png',fullPage:true});
  assert.deepEqual(errors,[]);console.log('OK : 4 lecteurs officiels sur consentement, liens/retrait, cinq largeurs avec lecteurs, galerie des 32 produits. Contenu externe simulé.');
 }finally{if(browser)await browser.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exitCode=1;});
