const { chromium } = require('playwright')

;(async () => {
  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage()
  await page.setViewportSize({ width: 1280, height: 900 })
  await page.goto('http://127.0.0.1:5173/manage')
  await page.waitForTimeout(1200)

  // 기본 (전체 선택 상태)
  await page.screenshot({ path: 'sc_manage_filter_all.png', fullPage: false })

  // 진행중 클릭
  const btns = await page.$$('.rm-summary-card-btn')
  await btns[1].click()
  await page.waitForTimeout(300)
  await page.screenshot({ path: 'sc_manage_filter_active.png', fullPage: false })

  // 마감 클릭
  await btns[2].click()
  await page.waitForTimeout(300)
  await page.screenshot({ path: 'sc_manage_filter_closed.png', fullPage: false })

  await browser.close()
  console.log('done')
})()
