const { chromium } = require("playwright");
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("http://localhost:5173/jobs");
  await page.waitForTimeout(1500);
  await page.locator(".jl-filter-bar").screenshot({ path: "screenshot-filterbar2.png" });
  await browser.close();
})();
