const { chromium } = require('playwright')

;(async () => {
  const browser = await chromium.launch({ headless: true })

  // 1. 비로그인 상태 (섹션 없음)
  const page1 = await browser.newPage()
  await page1.setViewportSize({ width: 1280, height: 800 })
  await page1.route('**/api/auth/me', route => route.abort())
  await page1.goto('http://127.0.0.1:5173/jobs')
  await page1.waitForTimeout(1500)
  await page1.screenshot({ path: 'sc_myposts_guest.png' })
  console.log('guest done')

  // 2. 구인자 로그인 상태 (섹션 표시)
  const page2 = await browser.newPage()
  await page2.setViewportSize({ width: 1280, height: 800 })
  await page2.route('**/api/auth/me', route =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ id: 1, name: '테스트사업자', email: 'test@biz.com', userType: 'business' }),
    })
  )
  await page2.goto('http://127.0.0.1:5173/jobs')
  await page2.waitForTimeout(1500)
  await page2.screenshot({ path: 'sc_myposts_biz.png' })
  console.log('biz done')

  await browser.close()
  console.log('all done')
})()
