const { chromium } = require("playwright");
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 1400 });
  await page.goto("http://localhost:5173");
  await page.waitForTimeout(1200);
  const el = page.locator(".cta-banner");
  await el.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await el.screenshot({ path: "screenshot-cta.png" });
  await browser.close();
})();
