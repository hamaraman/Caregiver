const { chromium } = require('playwright')

;(async () => {
  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage()
  await page.setViewportSize({ width: 390, height: 844 })

  await page.goto('http://127.0.0.1:5173/')
  await page.waitForTimeout(1000)
  await page.click('.hamburger-btn')
  await page.waitForTimeout(300)
  await page.screenshot({ path: 'sc_mob_hamburger_open.png' })

  await browser.close()
  console.log('done')
})()
