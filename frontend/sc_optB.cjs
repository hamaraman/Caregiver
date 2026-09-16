// Option B 미리보기: 카드를 핑크 배경으로, 섹션 헤더는 텍스트 강조만
const { chromium } = require('playwright')
const fs = require('fs')

const css = `
.tl-recommend-section {
  background: #fff;
  border: 2px solid #e91e8c;
  border-radius: 18px;
  overflow: hidden;
  margin-bottom: 20px;
  box-shadow: 0 4px 20px rgba(233,30,140,0.1);
}
.tl-recommend-header {
  background: #fff;
  padding: 18px 24px 0;
}
.tl-recommend-title {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 17px;
  font-weight: 800;
  color: #e91e8c;
  margin-bottom: 6px;
}
.tl-recommend-title svg path { fill: #e91e8c; stroke: #e91e8c; }
.tl-recommend-sub {
  font-size: 13px;
  color: #888;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 16px;
}
.tl-recommend-tag {
  display: inline-block;
  background: #fce4f1;
  color: #c01070;
  border: 1px solid #f0b8d8;
  border-radius: 20px;
  padding: 2px 10px;
  font-size: 12px;
  font-weight: 700;
}
.tl-recommend-list {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  padding: 0 18px 18px;
}
.tl-rec-card {
  background: linear-gradient(160deg, #fff0f7 0%, #fff8fb 100%);
  border-radius: 14px;
  border: 1.5px solid #f0b8d8;
  padding: 16px;
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;
  transition: box-shadow 0.15s, border-color 0.15s, transform 0.15s;
}
.tl-rec-card:hover {
  border-color: #e91e8c;
  box-shadow: 0 4px 14px rgba(233,30,140,0.14);
  transform: translateY(-2px);
}
`

;(async () => {
  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage()
  await page.setViewportSize({ width: 1280, height: 900 })
  await page.goto('http://127.0.0.1:5173/talents')
  await page.waitForTimeout(1000)
  await page.addStyleTag({ content: css })
  await page.waitForTimeout(300)
  await page.screenshot({ path: 'sc_optB.png' })
  await browser.close()
  console.log('done')
})()
