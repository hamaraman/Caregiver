import { useState } from 'react'

const REGIONS = ['전체', '서울', '경기', '인천', '부산', '대구', '대전', '광주', '울산', '세종']

export default function JspHero() {
  const [selectedRegion, setSelectedRegion] = useState('전체')
  const [keyword, setKeyword] = useState('')

  return (
    <section className="jsp-hero">
      <div className="jsp-hero-inner">
        <div className="jsp-hero-text">
          <p className="jsp-hero-eyebrow">요양이지와 함께라면</p>
          <h1 className="jsp-hero-title">
            당신의 따뜻한 돌봄이<br />
            더 좋은 일자리로<br />
            이어지도록
          </h1>
          <p className="jsp-hero-desc">
            간편한 구직 등록으로, 빠르고 정확하게<br />
            원하는 일자리를 찾을 수 있습니다.
          </p>

          <div className="jsp-search-box">
            <span className="jsp-search-icon">🔍</span>
            <input
              className="jsp-search-input"
              placeholder="직종, 근무형태, 지역을 검색해보세요"
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
            />
            <button className="jsp-search-btn">검색</button>
          </div>

          <div className="jsp-region-chips">
            {REGIONS.map(r => (
              <button
                key={r}
                className={`jsp-chip ${selectedRegion === r ? 'active' : ''}`}
                onClick={() => setSelectedRegion(r)}
              >
                {r}
              </button>
            ))}
            <button className="jsp-chip jsp-chip--more">›</button>
          </div>
        </div>

        <div className="jsp-hero-image">
          <div className="jsp-hero-arch">
            <span className="jsp-hero-emoji">👩‍⚕️</span>
            <div className="jsp-hero-bubble">
              좋은 일자리를<br />함께 찾아드려요! 🎉
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
