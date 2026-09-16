import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDragScroll } from '../../hooks/useDragScroll'

const REGIONS = ['서울', '경기', '인천', '부산', '대구', '대전', '광주', '울산', '세종']
const MORE_REGIONS = ['강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주']

export default function JspHero() {
  const navigate = useNavigate()
  const [keyword, setKeyword] = useState('')
  const [showMore, setShowMore] = useState(false)
  const [selectedRegion, setSelectedRegion] = useState('')
  const dragScroll = useDragScroll()

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (keyword.trim()) params.set('q', keyword.trim())
    if (selectedRegion) params.set('region', selectedRegion)
    navigate(`/jobs${params.toString() ? '?' + params.toString() : ''}`)
  }

  return (
    <section className="jsp-hero">
      <img src="/jobseeker-hero.png" className="jsp-hero-photo" alt="" aria-hidden="true" />
      <div className="jsp-hero-inner">
        <div className="jsp-hero-text">
          <p className="jsp-hero-eyebrow">당신의 새로운 시작을 응원합니다.</p>
          <h1 className="jsp-hero-title">
            원하는 조건의 일자리를<br />
            <span className="jsp-hero-accent">지금 바로 찾아보세요.</span>
          </h1>
          <p className="jsp-hero-desc">
            요양보호사, 간병인, 돌봄 일자리를 한눈에!<br />
            지금, 당신에게 꼭 맞는 일자리를 만나보세요.
          </p>

          <div className="jsp-search-box">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}>
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
            <input
              className="jsp-search-input"
              placeholder="지역, 근무형태, 직종, 키워드로 검색해보세요"
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
            />
            <button className="jsp-search-btn" aria-label="검색" onClick={handleSearch}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
              </svg>
            </button>
          </div>

          <div className="jsp-region-chips" {...dragScroll}>
            <span className="jsp-region-label">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
              </svg>
              인기지역
            </span>
            {REGIONS.map(r => (
              <button
                key={r}
                className={`jsp-chip ${selectedRegion === r ? 'active' : ''}`}
                onClick={() => { setSelectedRegion(r); navigate(`/jobs?region=${encodeURIComponent(r)}`) }}
              >
                {r}
              </button>
            ))}
            {showMore && MORE_REGIONS.map(r => (
              <button
                key={r}
                className="jsp-chip"
                onClick={() => navigate(`/jobs?region=${encodeURIComponent(r)}`)}
              >
                {r}
              </button>
            ))}
            <button className="jsp-chip jsp-chip--more" onClick={() => setShowMore(v => !v)} aria-label={showMore ? '접기' : '더보기'}>
              {showMore ? '‹' : '›'}
            </button>
          </div>
        </div>

      </div>
    </section>
  )
}
