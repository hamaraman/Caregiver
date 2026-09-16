const { chromium } = require('playwright')
;(async () => {
  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage()
  await page.setViewportSize({ width: 1280, height: 900 })

  await page.goto('http://127.0.0.1:5173/jobs')
  await page.waitForTimeout(1000)
  await page.screenshot({ path: 'sc_cmp_jobs.png' })

  await page.goto('http://127.0.0.1:5173/talents')
  await page.waitForTimeout(1000)
  await page.screenshot({ path: 'sc_cmp_talents.png' })

  await browser.close()
})()
