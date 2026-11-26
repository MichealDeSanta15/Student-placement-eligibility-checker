const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1200, height: 800 } });
  await page.goto('http://localhost:8080/check?roll=106&company=Amazon', { waitUntil: 'load' });
  await page.waitForTimeout(700);
  await page.screenshot({ path: 'page-ok.png' });

  await page.goto('http://localhost:8080/check?roll=105&company=Amazon', { waitUntil: 'load' });
  await page.waitForTimeout(700);
  await page.screenshot({ path: 'page-no.png' });

  const p2 = await browser.newPage({ viewport: { width: 390, height: 780 } });
  await p2.goto('http://localhost:8080/', { waitUntil: 'load' });
  await p2.waitForTimeout(1500);
  await p2.screenshot({ path: 'm-students.png' });
  await p2.click('.tab[data-tab="ranking"]');
  await p2.waitForTimeout(500);
  await p2.screenshot({ path: 'm-ranking.png' });

  const ow = await p2.evaluate(() => ({
    doc: document.documentElement.scrollWidth,
    win: window.innerWidth
  }));
  console.log('MOBILE_WIDTHS=' + JSON.stringify(ow));

  await browser.close();
})();
