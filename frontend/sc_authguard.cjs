const { chromium } = require('playwright')

;(async () => {
  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage()
  await page.setViewportSize({ width: 1280, height: 800 })

  await page.goto('http://127.0.0.1:5173/manage')
  await page.waitForTimeout(2000)
  await page.screenshot({ path: 'sc_ag_manage.png' })

  await page.goto('http://127.0.0.1:5173/applicants')
  await page.waitForTimeout(2000)
  await page.screenshot({ path: 'sc_ag_applicants.png' })

  await page.goto('http://127.0.0.1:5173/jobs/post')
  await page.waitForTimeout(2000)
  await page.screenshot({ path: 'sc_ag_post.png' })

  await browser.close()
  console.log('done')
})()
