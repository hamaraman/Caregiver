const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1200, height: 900 });
  await page.goto('http://localhost:5173/jobs');
  await page.waitForLoadState('networkidle');

  // 비활성 입력란 클릭 (jl-wage-range 영역)
  await page.click('.jl-wage-range');
  await page.waitForTimeout(200);

  const filterBar = await page.$('.jl-filter-bar');
  await filterBar.screenshot({ path: 'C:\\yoyang\\screenshot_hint.png' });

  await browser.close();
  console.log('done');
})();
