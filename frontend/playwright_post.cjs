const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1200, height: 900 });
  await page.goto('http://localhost:5173/jobs/post', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'C:\\yoyang\\screenshot_post.png', fullPage: true });
  await browser.close();
  console.log('done');
})();
