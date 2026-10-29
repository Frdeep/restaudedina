// Vérification de développement : utilise Playwright et Chromium déjà fournis par l'environnement.
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const path = require('node:path');
const http = require('node:http');
const fs = require('node:fs/promises');
(async () => {
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', args: ['--no-sandbox'] });
  const page = await browser.newPage({reducedMotion:'reduce'});
  const errors = [];
  page.on('pageerror', e => errors.push(String(e)));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  for (const width of [320,390,768,1024,1440]) {
    await page.setViewportSize({width,height:1000});
    await page.goto('http://127.0.0.1:3000/', {waitUntil:'networkidle'});
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `débordement à ${width}px`);
    assert.equal(await page.locator('h1').count(),1);
    await page.getByRole('button',{name:'Les plats',exact:true}).click();
    assert.equal(await page.locator('.menu-group:visible').count(),1);
    assert.equal(await page.locator('.menu-group:visible li').count(),5);
    await page.getByRole('button',{name:'Tout découvrir'}).click();
    assert.equal(await page.locator('.menu-group:visible li').count(),32);
    if(width === 320) {
      const toggle = page.locator('.nav-toggle');
      await toggle.click(); assert.equal(await toggle.getAttribute('aria-expanded'),'true');
      await page.keyboard.press('Escape'); assert.equal(await toggle.getAttribute('aria-expanded'),'false');
      assert.equal(await toggle.evaluate(e => document.activeElement===e),true);
    }
    for(const img of await page.locator('img').all()){await img.scrollIntoViewIfNeeded();await img.evaluate(el=>el.decode());}
    await page.locator('#social').scrollIntoViewIfNeeded();
    await page.evaluate(()=>window.scrollTo(0,0));
    await page.screenshot({path:`artifacts/site-${width}.png`,fullPage:true});
    console.log(`OK ${width}px : aucun débordement, filtres et ${width===320?'menu clavier':'contenu'}`);
  }
  assert.equal(await page.locator('.social-card').count(),2);
  for(const img of await page.locator('img').all()){await img.scrollIntoViewIfNeeded();await img.evaluate(el=>el.decode());}
  assert.equal(await page.locator('img').evaluateAll(nodes=>nodes.every(n=>n.complete&&n.naturalWidth>0)),true);
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.goto('http://127.0.0.1:3000/',{waitUntil:'networkidle'});
  assert.ok(await page.evaluate(()=>window.ScrollTrigger.getAll().length>0));
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.waitForTimeout(100);
  assert.equal(await page.evaluate(()=>window.ScrollTrigger.getAll().length),0);
  assert.equal(await page.locator('.social-card').first().locator('.social-embed-actions a').getAttribute('href'),'https://www.instagram.com/la_cuisine_de_dina/');
  await page.goto('http://127.0.0.1:3000/carte.html',{waitUntil:'networkidle'});
  await page.emulateMedia({media:'print'});
  const sheets = await page.locator('.menu-sheet').evaluateAll(nodes => nodes.map(n => ({height:n.clientHeight,content:n.scrollHeight})));
  assert.ok(sheets.every(s=>s.content<=s.height+1),JSON.stringify(sheets));
  await page.pdf({path:'artifacts/carte-dina-recto-verso.pdf',preferCSSPageSize:true,printBackground:true,displayHeaderFooter:false});
  await page.screenshot({path:'artifacts/carte.png',fullPage:true});
  await page.emulateMedia({media:'screen'});
  const exported = http.createServer(async (req,res) => {
    const file = decodeURIComponent(req.url.split('?')[0]).replace(/^\//,'') || 'index.html';
    try { const body = await fs.readFile(path.resolve('artifacts/site',file)); res.setHeader('Content-Type', file.endsWith('.css')?'text/css':file.endsWith('.js')?'text/javascript':file.endsWith('.svg')?'image/svg+xml':file.endsWith('.webp')?'image/webp':file.endsWith('.ttf')?'font/ttf':file.endsWith('.mp4')?'video/mp4':file.endsWith('.jpg')?'image/jpeg':file.endsWith('.pdf')?'application/pdf':'text/html'); res.end(body); }
    catch {res.writeHead(404);res.end();}
  });
  await new Promise(resolve=>exported.listen(0,'127.0.0.1',resolve));
  await page.goto('http://127.0.0.1:'+exported.address().port+'/index.html',{waitUntil:'networkidle'});
  await page.getByRole('button',{name:'Les boissons',exact:true}).click();
  assert.equal(await page.locator('.menu-group:visible li').count(),5);
  const noJS=await browser.newPage({javaScriptEnabled:false,viewport:{width:390,height:844}});
  await noJS.goto('http://127.0.0.1:3000/',{waitUntil:'networkidle'});
  assert.equal(await noJS.locator('.menu-group:visible li').count(),32);
  assert.equal(await noJS.locator('#navigation').isVisible(),true);
  await noJS.close();
  const download=await page.request.get('http://127.0.0.1:3000/carte-dina-recto-verso.pdf');
  assert.equal(download.status(),200);
  assert.ok(download.headers()['content-type'].includes('application/pdf'));
  const pdfText=require('node:child_process').execFileSync('pdftotext',['-layout','public/carte-dina-recto-verso.pdf','-'],{encoding:'utf8'});
  const normal=s=>s.normalize('NFD').replace(/[^\p{L}\p{N}]/gu,'').toLowerCase();
  const menu=JSON.parse(await fs.readFile('data/restaurant.json','utf8'));
  for(const item of menu.categories.flatMap(c=>c.items)){assert.ok(normal(pdfText).includes(normal(item.name)),item.name);assert.ok(pdfText.replace(/\s/g,'').includes(item.price.toFixed(2).replace('.',',')),String(item.price));}
  assert.deepEqual(errors,[]);
  await new Promise(resolve=>exported.close(resolve));
  console.log('OK PDF deux faces et tarifs, export statique, mode sans JavaScript et aucune erreur console.');
  await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
