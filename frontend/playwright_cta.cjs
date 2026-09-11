const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1200, height: 900 });

  // 홈 페이지 로드
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  // CTA 버튼 클릭
  await page.click('.cta-btn--primary');
  await page.waitForTimeout(800);

  const url = page.url();
  console.log('현재 URL:', url);

  await page.screenshot({ path: 'C:\\yoyang\\screenshot_cta.png', fullPage: false });
  await browser.close();
  console.log(url.includes('/jobs/post') ? 'PASS' : 'FAIL');
})();
