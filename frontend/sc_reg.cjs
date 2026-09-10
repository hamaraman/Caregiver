const { chromium } = require("playwright");
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("http://localhost:5173/jobs");
  await page.waitForTimeout(1200);
  // 경기 클릭
  await page.click("text=경기");
  await page.waitForTimeout(400);
  await page.locator(".jl-filter-bar").screenshot({ path: "screenshot-region2.png" });
  await browser.close();
})();
