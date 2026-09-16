const { chromium } = require('playwright')

;(async () => {
  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage()
  await page.setViewportSize({ width: 490, height: 4000 })
  await page.goto('http://127.0.0.1:5173/jobs/post')
  await page.waitForTimeout(1200)

  const el = await page.$('.jp-check-group--wrap')
  if (el) {
    const box = await el.boundingBox()
    console.log('box:', JSON.stringify(box))
    await page.screenshot({
      path: 'sc_workdays_crop.png',
      clip: { x: 0, y: Math.max(0, box.y - 40), width: 490, height: box.height + 80 }
    })
  } else {
    console.log('element not found')
    await page.screenshot({ path: 'sc_workdays_crop.png' })
  }

  await browser.close()
  console.log('done')
})()
