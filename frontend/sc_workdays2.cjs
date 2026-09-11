const { chromium } = require('playwright')

;(async () => {
  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage()
  await page.setViewportSize({ width: 490, height: 900 })
  await page.goto('http://127.0.0.1:5173/jobs/post')
  await page.waitForTimeout(1200)

  const el = await page.$('.jp-check-group--wrap')
  if (el) {
    const box = await el.boundingBox()
    await page.screenshot({
      path: 'sc_workdays_crop.png',
      clip: { x: 0, y: box.y - 40, width: 490, height: box.height + 80 }
    })
  }

  await browser.close()
  console.log('done')
})()
