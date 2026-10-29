const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs/promises');
(async()=>{
 const {createServer}=await import('../server.mjs');const server=createServer();await new Promise(r=>server.listen(0,'127.0.0.1',r));const base=`http://127.0.0.1:${server.address().port}`;
 let browser;
 try{
  browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox']});await fs.mkdir('artifacts/v2',{recursive:true});
  const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'}),errors=[],metaRequests=[];
  context.on('page',page=>page.on('pageerror',e=>errors.push(String(e))));
  await context.route(/https:\/\/(www\.)?(instagram|facebook)\.com\/.*/,route=>{metaRequests.push(route.request().url());return route.fulfill({status:200,contentType:'text/html',body:'<!doctype html><title>Test du lecteur officiel</title><p>Contenu Meta simulé uniquement pour vérifier le routage et le consentement.</p>'});});
  const page=await context.newPage();await page.goto(base,{waitUntil:'networkidle'});
  assert.ok((await page.locator('h1').textContent()).includes('DINA'));assert.equal(metaRequests.length,0);assert.equal(await page.locator('iframe').count(),0);
  assert.equal(await page.locator('#hero-video').evaluate(v=>v.muted),true);assert.equal(await page.locator('#hero-video').evaluate(v=>v.paused),true);
  await page.locator('#video-sound').click();assert.equal(await page.locator('#hero-video').evaluate(v=>v.muted),false);await page.locator('#video-sound').click();assert.equal(await page.locator('#hero-video').evaluate(v=>v.muted),true);
  await page.locator('#hero-video').evaluate(async v=>{v.muted=true;await v.play();});
  await page.waitForFunction(()=>document.querySelector('#hero-video').currentTime>.1);
  await page.locator('#hero-video').evaluate(v=>v.pause());
  await page.getByRole('button',{name:'Les plats',exact:true}).click();
  const thieb=page.locator('[data-product-id="thieb"]');await thieb.hover();await page.locator('#dish-preview').waitFor({state:'visible'});assert.ok((await page.locator('.preview-name').textContent()).includes('Thiéb'));assert.ok(await page.locator('#dish-preview .crop-thieb').count());
  await thieb.dblclick();await page.waitForURL('**/produit-thieb.html');await page.waitForLoadState('networkidle');
  await page.locator('[name=quantity]').fill('2');await page.getByRole('button',{name:'Ajouter au panier',exact:true}).click();await page.locator('#cart-dialog').waitFor({state:'visible'});assert.ok((await page.locator('#cart-dialog [data-cart-total]').textContent()).includes('34,00'));
  await page.locator('#cart-dialog .cart-continue').click();await page.waitForURL('**/panier.html');await page.waitForLoadState('networkidle');
  await page.getByRole('button',{name:'Augmenter la quantité de Thiéb bou guinar',exact:true}).click();assert.ok((await page.locator('.checkout-card [data-cart-total]').textContent()).includes('51,00'));assert.equal(await page.locator('[data-cart-items]').first().locator('[data-cart-action=plus]').evaluate(el=>el===document.activeElement),true);
  assert.equal(await page.locator('[data-demo-checkout]').isDisabled(),true);await page.locator('#demo-accept').check();await page.locator('[data-demo-checkout]').click();assert.equal(await page.locator('#demo-result').isVisible(),true);assert.ok((await page.locator('#demo-result').textContent()).includes('n’a pas été envoyée'));assert.equal(await page.locator('input[type=email],input[autocomplete=cc-number]').count(),0);
  await page.reload({waitUntil:'networkidle'});assert.ok((await page.locator('.checkout-card [data-cart-total]').textContent()).includes('51,00'));await page.getByRole('button',{name:'Retirer Thiéb bou guinar',exact:true}).click();assert.equal(await page.locator('.cart-empty-card').isVisible(),true);await page.locator('.cart-page-grid [data-cart-undo] button').click();assert.ok((await page.locator('.checkout-card [data-cart-total]').textContent()).includes('51,00'));await page.screenshot({path:'artifacts/v2/panier-desktop.png',fullPage:true});
  await page.goto(base+'/produit-demi-poulet.html',{waitUntil:'networkidle'});await page.locator('[name=side-0]').selectOption('Riz blanc');await page.locator('[name=sauce-0]').selectOption('Blanche');await page.getByRole('button',{name:'Ajouter au panier',exact:true}).click();await page.locator('#cart-dialog').waitFor({state:'visible'});assert.ok((await page.locator('#cart-dialog').textContent()).includes('Riz blanc · Blanche'));await page.keyboard.press('Escape');assert.equal(await page.locator('#cart-dialog').isVisible(),false);
  await page.goto(base,{waitUntil:'networkidle'});await page.locator('[data-legal=mentions]').first().click();await page.locator('#legal-mentions').waitFor({state:'visible'});assert.ok((await page.locator('#legal-mentions').textContent()).includes('DINA’S FOOD'));await page.keyboard.press('Escape');assert.equal(await page.locator('#legal-mentions').isVisible(),false);assert.equal(await page.locator('[data-legal=mentions]').first().evaluate(el=>el===document.activeElement),true);
  await page.locator('[data-social-load=instagram]').click();await page.waitForFunction(()=>document.querySelector('[data-social-slot=instagram] iframe')?.contentWindow);await page.waitForTimeout(100);assert.ok(await page.locator('[data-social-slot=instagram] iframe').getAttribute('src').then(s=>s.includes('Cu_9HepI3N5/embed/')));
  await page.getByRole('button',{name:'Publication Instagram suivante',exact:true}).click();assert.ok((await page.locator('[data-social-slot=instagram] iframe').getAttribute('src')).includes('Cuc2b7iIV3K/embed/'));
  await page.locator('[data-social-load=instagram]').click();assert.equal(await page.locator('[data-social-slot=instagram] iframe').count(),0);
  await page.locator('[data-social-load=facebook]').click();assert.ok((await page.locator('[data-social-slot=facebook] iframe').getAttribute('src')).includes('plugins/page.php'));await page.locator('[data-social-load=facebook]').click();assert.equal(await page.locator('iframe').count(),0);
  for(const width of [320,390,768,1024,1440]){
   await page.setViewportSize({width,height:900});
   for(const route of ['/','/produit-thieb.html','/produit-dibi-agneau-4.html','/panier.html']){
    await page.goto(base+route,{waitUntil:'networkidle'});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${width}px ${route}`);
   }
   await page.goto(base,{waitUntil:'networkidle'});await page.screenshot({path:`artifacts/v2/hero-${width}.png`});
   console.log(`OK ${width}px : accueil, fiches et panier sans débordement`);
  }
  const touch=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true,reducedMotion:'reduce'});const phone=await touch.newPage();phone.on('pageerror',e=>errors.push(String(e)));await phone.goto(base,{waitUntil:'networkidle'});
  await phone.getByRole('button',{name:'Les plats',exact:true}).click();const link=phone.locator('[data-product-id="thieb"]');await link.scrollIntoViewIfNeeded();await link.tap();assert.equal(await phone.locator('#dish-preview').isVisible(),true);await link.tap();await phone.waitForURL('**/produit-thieb.html');await phone.waitForLoadState('networkidle');await phone.screenshot({path:'artifacts/v2/produit-mobile.png',fullPage:true});
  await phone.locator('[name=quantity]').fill('1');await phone.getByRole('button',{name:'Ajouter au panier',exact:true}).click();await phone.locator('#cart-dialog').waitFor({state:'visible'});await phone.keyboard.press('Escape');assert.equal(await phone.locator('#cart-dialog').isVisible(),false);
  await phone.evaluate(()=>localStorage.setItem('dina.cart.v1','{"version":1,"updatedAt":'+Date.now()+',"lines":[{"productId":"thieb","qty":2,"choices":{}}]}'));await phone.goto(base+'/panier.html',{waitUntil:'networkidle'});assert.equal(await phone.locator('.cart-empty-card').isVisible(),true);
  const nojs=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});const plain=await nojs.newPage();await plain.goto(base,{waitUntil:'networkidle'});assert.equal(await plain.locator('.dish-link').count(),32);await plain.locator('[data-product-id=thieb]').click();await plain.waitForURL('**/produit-thieb.html');assert.equal(await plain.getByRole('button',{name:'Ajouter au panier'}).isDisabled(),true);await plain.goto(base+'/mentions.html');assert.ok((await plain.locator('main').textContent()).includes('SIREN 951 262 922'));
  assert.deepEqual(errors,[]);assert.ok(metaRequests.length>0);console.log('OK : double activation souris/tactile, panier persistant et choix, démonstration, dialogues/clavier, Meta sur consentement (contenu simulé), stockage invalide, pages sans JS.');
 }finally{if(browser)await browser.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exitCode=1;});
