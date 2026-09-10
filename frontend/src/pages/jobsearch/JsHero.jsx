import { useState } from 'react'

const REGIONS = ['서울', '경기', '인천', '부산', '대구', '대전', '광주', '울산', '세종']

export default function JsHero() {
  const [keyword, setKeyword] = useState('')
  const [selectedRegion, setSelectedRegion] = useState('')

  return (
    <section className="js-hero">
      <div className="js-hero-inner">
        <p className="js-hero-eyebrow">전국 요양·돌봄 일자리 플랫폼</p>
        <h1 className="js-hero-title">
          원하는 일자리를 <span className="js-hero-accent">지금 바로</span> 찾아보세요
        </h1>

        <div className="js-search-bar">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}>
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <input
            className="js-search-input"
            placeholder="지역, 근무형태, 직종, 키워드로 검색해보세요"
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
          />
          <button className="js-search-btn">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
          </button>
        </div>

        <div className="js-region-row">
          <span className="js-region-label">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
            </svg>
            인기지역
          </span>
          {REGIONS.map(r => (
            <button
              key={r}
              className={`js-region-chip ${selectedRegion === r ? 'active' : ''}`}
              onClick={() => setSelectedRegion(r)}
            >{r}</button>
          ))}
          <button className="js-region-chip js-region-chip--more">›</button>
        </div>
      </div>
    </section>
  )
}
