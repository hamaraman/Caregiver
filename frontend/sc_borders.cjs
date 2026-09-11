const { chromium } = require('playwright')

;(async () => {
  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage()
  await page.setViewportSize({ width: 1280, height: 900 })

  // 채용관리 - 필터 카드 링
  await page.goto('http://127.0.0.1:5173/manage')
  await page.waitForTimeout(1000)
  const summaryBox = await (await page.$('.rm-summary-row')).boundingBox()
  await page.screenshot({ path: 'sc_b_manage.png', clip: { x: summaryBox.x - 10, y: summaryBox.y - 10, width: summaryBox.width + 20, height: summaryBox.height + 20 } })

  // 구인공고 목록 - 필터 박스 border
  await page.goto('http://127.0.0.1:5173/jobs')
  await page.waitForTimeout(1000)
  const filterBox = await (await page.$('.jl-filter-bar')).boundingBox()
  await page.screenshot({ path: 'sc_b_jobs.png', clip: { x: filterBox.x - 10, y: filterBox.y - 10, width: filterBox.width + 20, height: Math.min(filterBox.height, 200) + 20 } })

  // 인재정보 - 필터 박스 + 추천 섹션 border
  await page.goto('http://127.0.0.1:5173/talents')
  await page.waitForTimeout(1000)
  const tlFilter = await (await page.$('.tl-filter-box')).boundingBox()
  await page.screenshot({ path: 'sc_b_talents.png', clip: { x: tlFilter.x - 10, y: tlFilter.y - 10, width: tlFilter.width + 20, height: Math.min(tlFilter.height, 160) + 20 } })

  // 추천 섹션 (핑크 border)
  const recBox = await (await page.$('.tl-recommend-section')).boundingBox()
  await page.screenshot({ path: 'sc_b_rec.png', clip: { x: recBox.x - 10, y: recBox.y - 10, width: recBox.width + 20, height: Math.min(recBox.height, 80) + 20 } })

  await browser.close()
  console.log('done')
})()
