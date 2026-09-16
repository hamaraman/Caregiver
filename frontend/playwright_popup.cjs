const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1200, height: 1100 });
  await page.goto('http://localhost:5173/jobs');
  await page.waitForLoadState('networkidle');

  // 트리거 클릭
  await page.click('.jl-region-trigger');
  await page.waitForTimeout(300);

  // 서울 클릭해서 시·구 나오게
  await page.click('.jl-panel-do-chip:has-text("서울")');
  await page.waitForTimeout(300);

  // 강남구, 서초구 선택
  await page.click('.jl-panel-si-chip:has-text("강남구")');
  await page.waitForTimeout(100);
  await page.click('.jl-panel-si-chip:has-text("서초구")');
  await page.waitForTimeout(200);

  // 패널 열린 상태 — 필터바 + 패널 전체
  await page.screenshot({ path: 'C:\\yoyang\\screenshot_popup_open.png', clip: { x: 0, y: 60, width: 1200, height: 620 } });

  // 선택 완료
  await page.click('.jl-panel-confirm');
  await page.waitForTimeout(300);

  // 닫힌 후 트리거에 선택된 칩 상태
  const filterBar = await page.$('.jl-filter-bar');
  await filterBar.screenshot({ path: 'C:\\yoyang\\screenshot_popup_closed.png' });

  await browser.close();
  console.log('done');
})();
