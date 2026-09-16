const { chromium } = require("playwright");
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("http://localhost:5173/jobs");
  await page.waitForTimeout(1500);
  await page.screenshot({ path: "screenshot-input2.png", clip: { x: 80, y: 130, width: 720, height: 70 } });
  await browser.close();
})();
