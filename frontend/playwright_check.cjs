const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1200, height: 900 });

  const consoleMsgs = [];
  page.on('console', msg => consoleMsgs.push(`[${msg.type()}] ${msg.text()}`));

  await page.goto('http://localhost:5173/jobs', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);

  const title = await page.title();
  const bodyText = await page.evaluate(() => document.body.innerText.slice(0, 200));
  console.log('Title:', title);
  console.log('Body:', bodyText);
  console.log('Console:', consoleMsgs.filter(m => m.includes('error') || m.includes('Error')));

  await browser.close();
})();
