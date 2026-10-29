// Vérification de développement : utilise Playwright et Chromium déjà fournis par l'environnement.
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const path = require('node:path');
const http = require('node:http');
const fs = require('node:fs/promises');
(async () => {
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(String(e)));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  for (const width of [320,768,1024,1440]) {
    await page.setViewportSize({width,height:1000});
    await page.goto('http://127.0.0.1:3000/', {waitUntil:'networkidle'});
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `débordement à ${width}px`);
    assert.equal(await page.locator('h1').count(),1);
    await page.getByRole('button',{name:'Les plats',exact:true}).click();
    assert.equal(await page.locator('.menu-group:visible').count(),1);
    assert.equal(await page.locator('.menu-group:visible li').count(),5);
    await page.getByRole('button',{name:'Tout découvrir'}).click();
    assert.equal(await page.locator('.menu-group:visible li').count(),22);
    if(width === 320) {
      const toggle = page.locator('.nav-toggle');
      await toggle.click(); assert.equal(await toggle.getAttribute('aria-expanded'),'true');
      await page.keyboard.press('Escape'); assert.equal(await toggle.getAttribute('aria-expanded'),'false');
      assert.equal(await toggle.evaluate(e => document.activeElement===e),true);
    }
    await page.screenshot({path:`artifacts/site-${width}.png`,fullPage:true});
    console.log(`OK ${width}px : aucun débordement, filtres et ${width===320?'menu clavier':'contenu'}`);
  }
  await page.goto('http://127.0.0.1:3000/carte.html',{waitUntil:'networkidle'});
  await page.emulateMedia({media:'print'});
  const sheets = await page.locator('.menu-sheet').evaluateAll(nodes => nodes.map(n => ({height:n.clientHeight,content:n.scrollHeight})));
  assert.ok(sheets.every(s=>s.content<=s.height+1),JSON.stringify(sheets));
  await page.pdf({path:'artifacts/carte-dina-recto-verso.pdf',preferCSSPageSize:true,printBackground:true,displayHeaderFooter:false});
  await page.screenshot({path:'artifacts/carte.png',fullPage:true});
  await page.emulateMedia({media:'screen'});
  const exported = http.createServer(async (req,res) => {
    const file = path.basename(req.url.split('?')[0]) || 'index.html';
    try { const body = await fs.readFile(path.resolve('artifacts/site',file)); res.setHeader('Content-Type', file.endsWith('.css')?'text/css':file.endsWith('.js')?'text/javascript':file.endsWith('.svg')?'image/svg+xml':'text/html'); res.end(body); }
    catch {res.writeHead(404);res.end();}
  });
  await new Promise(resolve=>exported.listen(0,'127.0.0.1',resolve));
  await page.goto('http://127.0.0.1:'+exported.address().port+'/index.html',{waitUntil:'networkidle'});
  await page.getByRole('button',{name:'Les boissons',exact:true}).click();
  assert.equal(await page.locator('.menu-group:visible li').count(),4);
  assert.deepEqual(errors,[]);
  await new Promise(resolve=>exported.close(resolve));
  console.log('OK carte imprimable, export statique servi en HTTP et aucune erreur console.');
  await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
