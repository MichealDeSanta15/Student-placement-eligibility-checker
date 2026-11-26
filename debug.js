const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  page.on('pageerror', e => console.log('PAGEERROR: ' + e.message));
  page.on('console', m => console.log('CONSOLE[' + m.type() + ']: ' + m.text()));

  await page.goto('http://localhost:8080/', { waitUntil: 'load' });

  console.log('script tag loaded=' + await page.evaluate(() =>
    Array.from(document.scripts).map(s => s.src).join(',')));
  console.log('stat count=' + await page.evaluate(() => document.querySelectorAll('.stat-num').length));
  console.log('data-values=' + await page.evaluate(() =>
    Array.from(document.querySelectorAll('.stat-num')).map(e => e.getAttribute('data-value')).join(',')));
  console.log('rAF works=' + await page.evaluate(() => new Promise(res => {
    let fired = false;
    requestAnimationFrame(() => { fired = true; res(true); });
    setTimeout(() => { if (!fired) res(false); }, 800);
  })));

  await page.waitForTimeout(2500);
  console.log('after 2.5s=' + await page.evaluate(() =>
    Array.from(document.querySelectorAll('.stat-num')).map(e => e.textContent).join(',')));

  await browser.close();
})();
