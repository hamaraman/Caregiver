const { chromium } = require('playwright')

;(async () => {
  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage()
  await page.setViewportSize({ width: 390, height: 900 })
  await page.goto('http://127.0.0.1:5173/manage')
  await page.waitForTimeout(1200)

  const el = await page.$('.rm-summary-row')
  const box = await el.boundingBox()
  await page.screenshot({
    path: 'sc_manage_summary.png',
    clip: { x: 0, y: Math.max(0, box.y - 20), width: 390, height: box.height + 40 }
  })

  await browser.close()
  console.log('done')
})()
