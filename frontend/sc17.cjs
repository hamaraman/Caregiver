const { chromium } = require("playwright");
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 500 });
  await page.goto("http://localhost:5173");
  await page.waitForTimeout(1200);
  await page.hover(".nav-dropdown-wrap");
  await page.waitForTimeout(500);
  await page.screenshot({ path: "screenshot-glass2.png", clip: { x: 400, y: 0, width: 500, height: 300 } });
  await browser.close();
})();
