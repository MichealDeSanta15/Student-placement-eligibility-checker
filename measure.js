const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1200, height: 900 } });
  await page.goto('http://localhost:8080/', { waitUntil: 'load' });
  await page.click('.tab[data-tab="companies"]');
  await page.waitForTimeout(600);

  const info = await page.evaluate(() => {
    const table = document.querySelector('#companies table');
    const ths = Array.from(table.querySelectorAll('thead th'));
    const tds = Array.from(table.querySelectorAll('tbody tr')[0].children);
    const pack = (el) => {
      const r = el.getBoundingClientRect();
      return {
        text: el.textContent.trim(),
        left: Math.round(r.left),
        right: Math.round(r.right),
        width: Math.round(r.width),
        align: getComputedStyle(el).textAlign
      };
    };
    return { headers: ths.map(pack), firstRow: tds.map(pack) };
  });
  console.log(JSON.stringify(info, null, 1));
  await browser.close();
})();
