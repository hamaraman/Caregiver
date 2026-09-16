const { chromium } = require('playwright')
const path = require('path')
const fs = require('fs')

const OUT = path.resolve(__dirname, '../docs/screenshots')
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true })

const BIZ_USER = { id: 1, name: '테스트사업자', email: 'test@biz.com', userType: 'business' }

async function shot(page, url, file, mockUser = null) {
  if (mockUser) {
    await page.route('**/api/auth/me', route =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(mockUser) })
    )
  } else {
    await page.route('**/api/auth/me', route => route.abort())
  }
  await page.goto(url)
  await page.waitForTimeout(1200)
  await page.screenshot({ path: path.join(OUT, file), fullPage: false })
  console.log('✓', file)
}

;(async () => {
  const browser = await chromium.launch({ headless: true })

  // 데스크탑 (1280x800)
  const desk = await browser.newPage()
  await desk.setViewportSize({ width: 1280, height: 800 })

  await shot(desk, 'http://127.0.0.1:5173/', 'home.png')
  await shot(desk, 'http://127.0.0.1:5173/jobs', 'jobs.png', BIZ_USER)
  await shot(desk, 'http://127.0.0.1:5173/jobs/1', 'job-detail.png')
  await shot(desk, 'http://127.0.0.1:5173/jobs/post', 'job-post.png', BIZ_USER)
  await shot(desk, 'http://127.0.0.1:5173/talents', 'talents.png', BIZ_USER)
  await shot(desk, 'http://127.0.0.1:5173/talents/1', 'talent-detail.png')
  await shot(desk, 'http://127.0.0.1:5173/applicants', 'applicants.png', BIZ_USER)
  await shot(desk, 'http://127.0.0.1:5173/manage', 'manage.png', BIZ_USER)

  // 모바일 (390x844)
  const mob = await browser.newPage()
  await mob.setViewportSize({ width: 390, height: 844 })
  await mob.route('**/api/auth/me', route => route.abort())
  await mob.goto('http://127.0.0.1:5173/')
  await mob.waitForTimeout(1200)
  await mob.screenshot({ path: path.join(OUT, 'mobile-home.png') })
  console.log('✓ mobile-home.png')

  await mob.goto('http://127.0.0.1:5173/jobs')
  await mob.waitForTimeout(1200)
  await mob.screenshot({ path: path.join(OUT, 'mobile-jobs.png') })
  console.log('✓ mobile-jobs.png')

  await browser.close()
  console.log('\ndone — saved to docs/screenshots/')
})()
