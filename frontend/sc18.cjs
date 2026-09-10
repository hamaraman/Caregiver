const { chromium } = require("playwright");
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 500 });
  await page.goto("http://localhost:5173");
  await page.waitForTimeout(1200);
  await page.hover(".nav-dropdown-wrap");
  await page.waitForTimeout(500);
  await page.screenshot({ path: "screenshot-glass3.png", clip: { x: 380, y: 0, width: 520, height: 320 } });
  await browser.close();
})();
