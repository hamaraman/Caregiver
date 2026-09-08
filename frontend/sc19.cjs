const { chromium } = require("playwright");
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 500 });
  await page.goto("http://localhost:5173");
  await page.waitForTimeout(1200);
  await page.hover(".nav-dropdown-wrap");
  await page.waitForTimeout(400);
  // hover second item to show highlight
  await page.hover(".nav-dropdown-item:nth-child(2)");
  await page.waitForTimeout(200);
  await page.screenshot({ path: "screenshot-clean.png", clip: { x: 380, y: 0, width: 520, height: 300 } });
  await browser.close();
})();
