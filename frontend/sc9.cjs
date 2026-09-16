const { chromium } = require("playwright");
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 1400 });
  await page.goto("http://localhost:5173");
  await page.waitForTimeout(1200);
  await page.locator(".cta-banner").scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);
  await page.locator(".cta-banner").screenshot({ path: "screenshot-cta3.png" });
  await browser.close();
})();
