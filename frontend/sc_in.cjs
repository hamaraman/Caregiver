const { chromium } = require("playwright");
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("http://localhost:5173/jobs");
  await page.waitForTimeout(1500);
  await page.screenshot({ path: "screenshot-input.png", clip: { x: 80, y: 110, width: 800, height: 80 } });
  await browser.close();
})();
