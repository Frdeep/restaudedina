const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs/promises');
(async()=>{
 const {createServer}=await import('../server.mjs');const server=createServer();await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port;
 let browser;
 try{
  browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox']});await fs.mkdir('artifacts/final-touch',{recursive:true});
  const context=await browser.newContext({reducedMotion:'reduce',viewport:{width:1440,height:1000}}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(String(e)));
  await context.route(/https:\/\/((www\.)?(instagram|facebook)|maps\.google|www\.google)\.com\/.*/,r=>r.fulfill({status:200,contentType:'text/html',body:'<p>Fixture technique externe</p>'}));
  for(const width of [320,390,768,1024,1440]){
   await page.setViewportSize({width,height:1000});await page.goto(base,{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   const heading=await page.locator('.hero-heading').boundingBox(),video=await page.locator('.hero-film').boundingBox(),summary=await page.locator('.hero-summary').boundingBox();
   if(width<=760){assert.ok(heading.y+heading.height<=video.y+1);assert.ok(video.y+video.height<=summary.y+1);assert.ok(Math.abs(video.x+video.width/2-width/2)<=1,`video not centered ${width}`);}else assert.ok(video.x>heading.x+heading.width-1);
   const qr=page.locator('.footer-qr img');assert.equal(await qr.count(),1);await qr.scrollIntoViewIfNeeded();await qr.evaluate(img=>img.decode());assert.equal(await qr.isVisible(),true);assert.equal(await qr.locator('..').getAttribute('href'),'https://restaudedina.vercel.app/');
   await qr.screenshot({path:`artifacts/final-touch/qr-${width}.png`});
   if(width===390||width===1440){await page.locator('.hero-feature').screenshot({path:`artifacts/final-touch/hero-${width}.png`});await page.locator('.footer-bottom').screenshot({path:`artifacts/final-touch/footer-${width}.png`});}
  }
  await page.emulateMedia({reducedMotion:'no-preference'});await page.locator('.marquee').scrollIntoViewIfNeeded();
  await page.waitForFunction(()=>getComputedStyle(document.querySelector('.marquee-track')).animationName==='marquee');
  const position=()=>page.locator('.marquee-track').evaluate(el=>getComputedStyle(el).transform);
  const before=await position();await page.waitForTimeout(180);assert.notEqual(await position(),before);
  const control=page.locator('.marquee-control');await control.click();assert.equal(await control.getAttribute('aria-pressed'),'true');const paused=await position();await page.waitForTimeout(180);assert.equal(await position(),paused);
  await control.click();await page.waitForTimeout(180);assert.notEqual(await position(),paused);
  const group=await page.locator('.marquee-track>span').first().boundingBox();assert.ok(group.width>=1440,'ribbon repeated group must cover wide viewport');
  await page.emulateMedia({reducedMotion:'reduce'});await page.waitForFunction(()=>document.querySelector('.marquee-control').hidden);assert.equal(await control.isVisible(),false);assert.equal(await page.locator('.marquee-track').evaluate(el=>getComputedStyle(el).animationName),'none');
  await page.goto(base+'/produit-thieb.html',{waitUntil:'networkidle'});assert.equal(await page.locator('.commerce-footer .footer-qr img').count(),1);assert.equal(await page.locator('.commerce-footer .footer-qr').isVisible(),true);
  assert.deepEqual(errors,[]);console.log('OK : hero centré et ordonné sur mobile, desktop conservé, QR à cinq largeurs et fiches, défilement réel, pause/reprise et mouvement réduit.');
 }finally{if(browser)await browser.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exitCode=1;});
