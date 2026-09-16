const { chromium } = require("playwright");
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("http://localhost:5173/jobs");
  await page.waitForTimeout(1500);
  await page.screenshot({ path: "screenshot-filter2.png", clip: { x: 80, y: 95, width: 1120, height: 280 } });
  await browser.close();
})();
