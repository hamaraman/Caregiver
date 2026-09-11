import { useState } from 'react'
import { Link } from 'react-router-dom'

const REGIONS = ['서울', '경기', '인천', '부산', '대구', '대전', '광주', '울산', '세종']

export default function HomeHero() {
  const [keyword, setKeyword] = useState('')
  const [selectedRegion, setSelectedRegion] = useState('')

  return (
    <section className="hp-hero">
      <img src="/caregiver-hero.png" className="hp-hero-photo" alt="" aria-hidden="true" />
      <div className="hp-hero-inner">
        <div className="hp-hero-content">
          <p className="hp-hero-sub">사람과 사람을 이어주는 따뜻한 일자리 플랫폼</p>
          <h1 className="hp-hero-title">요양이지에 오신 것을 환영합니다.</h1>
          <p className="hp-hero-desc">
            요양보호사, 간병인, 돌봄 일자리를 찾거나<br />
            인재를 등록하고 싶으신가요? 지금 바로 시작해보세요.
          </p>
          <div className="hp-search-wrap">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}>
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
            <input
              className="hp-search-input"
              placeholder="지역, 근무형태, 직종, 키워드로 검색해보세요"
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
            />
            <button className="hp-search-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
              </svg>
            </button>
          </div>
          <div className="hp-region-row">
            <span className="hp-region-label">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
              </svg>
              인기 지역
            </span>
            {REGIONS.map(r => (
              <button key={r}
                className={`hp-chip ${selectedRegion === r ? 'active' : ''}`}
                onClick={() => setSelectedRegion(r)}
              >{r}</button>
            ))}
            <button className="hp-chip hp-chip-more">›</button>
          </div>
        </div>

      </div>
    </section>
  )
}
