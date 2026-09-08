const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1200, height: 900 });
  await page.goto('http://localhost:5173/jobs');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(500);

  await page.screenshot({ path: 'C:\\yoyang\\screenshot_filters.png', clip: { x: 0, y: 60, width: 1200, height: 420 } });

  await browser.close();
  console.log('done');
})();
