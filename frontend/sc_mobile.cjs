const { chromium } = require('playwright')

;(async () => {
  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage()
  await page.setViewportSize({ width: 390, height: 844 })

  await page.goto('http://127.0.0.1:5173/')
  await page.waitForTimeout(1500)
  await page.screenshot({ path: 'sc_mob_home.png' })

  await page.goto('http://127.0.0.1:5173/jobs')
  await page.waitForTimeout(1000)
  await page.screenshot({ path: 'sc_mob_jobs.png' })

  await page.goto('http://127.0.0.1:5173/talents')
  await page.waitForTimeout(1000)
  await page.screenshot({ path: 'sc_mob_talents.png' })

  await page.goto('http://127.0.0.1:5173/applicants')
  await page.waitForTimeout(1000)
  await page.screenshot({ path: 'sc_mob_applicants.png' })

  await page.goto('http://127.0.0.1:5173/manage')
  await page.waitForTimeout(1000)
  await page.screenshot({ path: 'sc_mob_manage.png' })

  await browser.close()
  console.log('done')
})()
