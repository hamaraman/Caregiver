const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1200, height: 900 });
  await page.goto('http://localhost:5173/jobs');
  await page.waitForLoadState('networkidle');

  // 시급 선택
  await page.click('.jl-chip:has-text("시급")');
  await page.waitForTimeout(300);

  const filterBar = await page.$('.jl-filter-bar');
  await filterBar.screenshot({ path: 'C:\\yoyang\\screenshot_wage.png' });

  await browser.close();
  console.log('done');
})();
