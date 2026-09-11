const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1200, height: 900 });

  // ① 칩 버전 — 경기 선택
  await page.goto('http://localhost:5173/jobs');
  await page.waitForLoadState('networkidle');
  await page.click('button.jl-chip:has-text("경기")');
  await page.waitForTimeout(400);
  const filterBar = await page.$('.jl-filter-bar');
  await filterBar.screenshot({ path: 'C:\\yoyang\\screenshot_chips_gyeonggi.png' });

  await browser.close();
  console.log('done');
})();
