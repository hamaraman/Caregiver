const { chromium } = require('playwright')

;(async () => {
  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage()
  await page.setViewportSize({ width: 490, height: 900 })
  await page.goto('http://127.0.0.1:5173/jobs/post')
  await page.waitForTimeout(1200)
  await page.screenshot({ path: 'sc_workdays.png', fullPage: true })
  await browser.close()
  console.log('done')
})()
