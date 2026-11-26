const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1200, height: 900 } });
  const errors = [];
  page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push('CONSOLE: ' + m.text()); });

  await page.goto('http://localhost:8080/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);

  const stats = await page.$$eval('.stat-num', els => els.map(e => e.textContent.trim()));
  console.log('STATS=' + JSON.stringify(stats));

  const activePanel = await page.$eval('.panel.active', e => e.id);
  console.log('ACTIVE_PANEL=' + activePanel);

  await page.click('.tab[data-tab="ranking"]');
  await page.waitForTimeout(400);
  console.log('AFTER_TAB=' + await page.$eval('.panel.active', e => e.id));
  console.log('RANKING_VISIBLE=' + await page.isVisible('#ranking table'));

  await page.click('.tab[data-tab="students"]');
  await page.waitForTimeout(300);

  await page.fill('#search', 'priya');
  await page.waitForTimeout(300);
  const visible = await page.$$eval('#studentTable tbody tr', rows =>
    rows.filter(r => !r.classList.contains('hide')).map(r => r.children[1].textContent.trim()));
  console.log('SEARCH_PRIYA=' + JSON.stringify(visible));

  await page.fill('#search', 'ECE');
  await page.waitForTimeout(300);
  const byBranch = await page.$$eval('#studentTable tbody tr', rows =>
    rows.filter(r => !r.classList.contains('hide')).length);
  console.log('SEARCH_ECE_COUNT=' + byBranch);

  await page.click('#clearSearch');
  await page.waitForTimeout(300);
  const allRows = await page.$$eval('#studentTable tbody tr', rows =>
    rows.filter(r => !r.classList.contains('hide')).length);
  console.log('AFTER_CLEAR=' + allRows);

  const firstPill = await page.$eval('#studentTable tbody tr td.num .pill', e => e.className + '|' + e.textContent);
  console.log('PILL=' + firstPill);

  await page.click('.tab[data-tab="check"]');
  await page.waitForTimeout(300);
  await page.selectOption('#roll', '106');
  await page.selectOption('#company', 'Amazon');
  await Promise.all([page.waitForNavigation(), page.click('#check button[type=submit]')]);
  const badge = await page.$eval('.badge', e => e.className + '|' + e.textContent.trim());
  console.log('CHECK_RESULT=' + badge);
  console.log('RESULT_BG=' + await page.$eval('.badge', e => getComputedStyle(e).backgroundColor));

  await page.goto('http://localhost:8080/', { waitUntil: 'networkidle' });
  await page.click('.tab[data-tab="manage"]');
  await page.waitForTimeout(300);
  const formCols = await page.$eval('.form-grid', e => getComputedStyle(e).gridTemplateColumns);
  console.log('FORM_GRID=' + formCols);

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 2);
  console.log('HORIZONTAL_OVERFLOW=' + overflow);

  await page.setViewportSize({ width: 390, height: 800 });
  await page.waitForTimeout(500);
  const mobileOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 2);
  const statCols = await page.$eval('.stats', e => getComputedStyle(e).gridTemplateColumns);
  console.log('MOBILE_OVERFLOW=' + mobileOverflow);
  console.log('MOBILE_STAT_COLS=' + statCols);

  await page.screenshot({ path: 'shot-mobile.png', fullPage: false });
  await page.setViewportSize({ width: 1200, height: 900 });
  await page.waitForTimeout(400);
  await page.screenshot({ path: 'shot-home.png', fullPage: true });
  await page.click('.tab[data-tab="ranking"]');
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'shot-ranking.png', fullPage: false });

  console.log('ERRORS=' + JSON.stringify(errors));
  await browser.close();
})();
