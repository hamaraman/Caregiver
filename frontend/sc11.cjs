const { chromium } = require("playwright");
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 600 });
  await page.goto("http://localhost:5173");
  await page.waitForTimeout(1000);
  await page.hover(".nav-dropdown-wrap");
  await page.waitForTimeout(300);
  await page.screenshot({ path: "screenshot-dropdown.png", clip: { x: 0, y: 0, width: 1280, height: 340 } });
  await browser.close();
})();
