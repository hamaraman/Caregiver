const { chromium } = require('playwright')

;(async () => {
  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage()
  await page.setViewportSize({ width: 1280, height: 900 })

  await page.goto('http://localhost:5173/applicants')
  await page.waitForTimeout(1200)
  await page.screenshot({ path: 'sc_applicants.png', fullPage: false })

  await page.goto('http://localhost:5173/manage')
  await page.waitForTimeout(1200)
  await page.screenshot({ path: 'sc_manage.png', fullPage: false })

  await browser.close()
  console.log('done')
})()
