const { chromium } = require("playwright");
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("http://localhost:5173/jobs");
  await page.waitForTimeout(1500);
  await page.screenshot({ path: "screenshot-search-new.png", clip: { x: 0, y: 60, width: 1280, height: 360 } });
  await browser.close();
})();
