// Project adapter for webapp-testing: use the installed Node Playwright runtime.
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
(async () => {
  const { createServer } = await import('../server.mjs');
  const server = createServer();
  await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve);});
  let browser;
  try {
    browser = await chromium.launch({executablePath:process.env.DINA_CHROMIUM_PATH || '/usr/bin/chromium',headless:true,args:['--no-sandbox']});
    await fs.mkdir('artifacts/skills',{recursive:true});
    const url=`http://127.0.0.1:${server.address().port}`;
    for(const width of [390,1440]) {
      const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});
      const errors=[];page.on('pageerror',error=>errors.push(String(error)));
      await page.goto(url,{waitUntil:'networkidle'});
      assert.equal(await page.getByRole('heading',{level:1}).count(),1);
      assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
      await page.getByRole('button',{name:'Les plats',exact:true}).click();
      assert.equal(await page.locator('.menu-group:visible li').count(),5);
      await page.getByRole('button',{name:'Tout découvrir'}).click();
      assert.equal(await page.locator('.menu-group:visible li').count(),32);
      if(width===390){
        const toggle=page.locator('.nav-toggle');await toggle.click();
        assert.equal(await toggle.getAttribute('aria-expanded'),'true');
        await page.keyboard.press('Escape');assert.equal(await toggle.getAttribute('aria-expanded'),'false');
        assert.ok(await toggle.evaluate(el=>el===document.activeElement));
      }
      await page.evaluate(()=>window.scrollTo(0,0));
      await page.screenshot({path:`artifacts/skills/skill-smoke-${width}.png`});
      assert.deepEqual(errors,[]);
      await page.close();console.log(`OK ${width}px: rendered DOM, filters, overflow and keyboard where applicable.`);
    }
  } finally {
    if(browser)await browser.close();
    await new Promise(resolve=>server.close(resolve));
  }
})().catch(error=>{console.error(error);process.exitCode=1;});
