const { chromium } = require("playwright");
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 500 });
  await page.goto("http://localhost:5173");
  await page.waitForTimeout(1000);
  await page.hover(".nav-dropdown-wrap");
  await page.waitForTimeout(300);
  await page.hover(".nav-dropdown-item:nth-child(2)");
  await page.waitForTimeout(200);
  await page.screenshot({ path: "screenshot-pastel.png", clip: { x: 430, y: 45, width: 290, height: 240 } });
  await browser.close();
})();
