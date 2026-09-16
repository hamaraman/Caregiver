const { chromium } = require('playwright')
const path = require('path')

const pages = [
  { url: 'http://127.0.0.1:5173/',           out: '../docs/screenshots/home.png',       full: true  },
  { url: 'http://127.0.0.1:5173/jobs',       out: '../docs/screenshots/jobs.png',       full: false },
  { url: 'http://127.0.0.1:5173/jobs/post',  out: '../docs/screenshots/post.png',       full: false },
  { url: 'http://127.0.0.1:5173/talents',    out: '../docs/screenshots/talents.png',    full: false },
  { url: 'http://127.0.0.1:5173/applicants', out: '../docs/screenshots/applicants.png', full: false },
  { url: 'http://127.0.0.1:5173/manage',     out: '../docs/screenshots/manage.png',     full: false },
]

;(async () => {
  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage()
  await page.setViewportSize({ width: 1280, height: 900 })

  for (const p of pages) {
    await page.goto(p.url)
    await page.waitForTimeout(1000)
    await page.screenshot({ path: path.resolve(__dirname, p.out), fullPage: p.full })
    console.log('done:', p.out)
  }

  await browser.close()
})()
