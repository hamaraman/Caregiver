import { useState } from 'react'

const KEYWORDS = ['요양보호사', '간호조무사', '사회복지사', '주간', '야간', '서울', '경기', '부산']

export default function JsHero() {
  const [keyword, setKeyword] = useState('')
  const [activeKw, setActiveKw] = useState(null)

  return (
    <section className="js-hero">
      <div className="js-hero-inner">

        {/* 좌: 타이틀 + 검색 */}
        <div className="js-hero-content">
          <p className="js-hero-eyebrow">좋은 일자리를 찾는 당신을 응원합니다!</p>
          <h1 className="js-hero-title">
            지금, 나에게 맞는 <span className="js-hero-accent">일자리</span>를 찾아보세요
          </h1>
          <p className="js-hero-desc">
            요양보호사, 간병인, 돌봄 일자리를 한눈에!<br />
            지금, 요양이지에서 더 좋은 근무 조건의 일자리를 찾아보세요.
          </p>

          <div className="js-search-bar">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}>
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
            <input
              className="js-search-input"
              placeholder="지역, 근무형태, 직무를 검색해보세요"
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
            />
            <button className="js-search-btn">검색하기</button>
          </div>

          <div className="js-kw-row">
            <span className="js-kw-label">인기검색어</span>
            {KEYWORDS.map(k => (
              <button
                key={k}
                className={`js-kw-chip ${activeKw === k ? 'active' : ''}`}
                onClick={() => setActiveKw(k)}
              >{k}</button>
            ))}
          </div>
        </div>

        {/* 우: 캐릭터 + 맞춤 추천 카드 */}
        <div className="js-hero-right">
          <div className="js-hero-char">
            <div className="js-char-bubble">좋은 일자리,<br />함께 찾드려요! ♡</div>
            <div className="js-char-arch">
              <span className="js-char-emoji">👩‍⚕️</span>
            </div>
          </div>

          <div className="js-rec-card">
            <div className="js-rec-card-header">
              <div className="js-rec-card-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4A8FE7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
                </svg>
              </div>
              <span className="js-rec-card-title">맞춤 일자리 추천</span>
            </div>
            <p className="js-rec-card-desc">회원님의 경험과 선호조건을 분석하여 딱 맞는 일자리를 추천해드립니다.</p>
            <button className="js-rec-card-btn">맞춤 추천 받기 →</button>
            <div className="js-rec-dots">
              <span className="js-rec-dot active" /><span className="js-rec-dot" /><span className="js-rec-dot" />
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
