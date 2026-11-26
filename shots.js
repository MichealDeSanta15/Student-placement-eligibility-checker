const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1200, height: 900 } });
  await page.goto('http://localhost:8080/', { waitUntil: 'load' });
  await page.waitForTimeout(1500);

  const tabs = ['students', 'companies', 'check', 'ranking', 'manage'];
  for (const t of tabs) {
    await page.click('.tab[data-tab="' + t + '"]');
    await page.waitForTimeout(600);
    await page.screenshot({ path: 'tab-' + t + '.png' });
  }
  await browser.close();
})();
