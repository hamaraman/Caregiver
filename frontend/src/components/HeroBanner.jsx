import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './HeroBanner.css'

const regions = ['서울', '경기', '인천', '부산', '대구', '대전', '광주', '울산', '세종']

export default function HeroBanner() {
  const [selectedRegions, setSelectedRegions] = useState([])
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  const goToJobs = () => {
    const params = new URLSearchParams()
    if (query.trim()) params.set('q', query.trim())
    if (selectedRegions.length > 0) params.set('region', selectedRegions.join(','))
    navigate(`/talents${params.toString() ? '?' + params.toString() : ''}`)
  }

  const toggleRegion = (region) => {
    setSelectedRegions(prev =>
      prev.includes(region) ? prev.filter(r => r !== region) : [...prev, region]
    )
  }

  return (
    <section className="hero">
      <div className="hero-inner">
        <div className="hero-content">
          <p className="hero-eyebrow">빠르고 정확한 인재 채용을 도와드립니다.</p>
          <h1 className="hero-title">
            원하는 인재를<br />
            <span className="hero-highlight">지금 바로 찾아보세요.</span>
          </h1>
          <p className="hero-desc">
            요양보호사, 간병인, 돌봄 인재를 한눈에!<br />
            구인공고 등록부터 채용 관리까지 한 번에 해결하세요.
          </p>

          <div className="hero-search">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2" strokeLinecap="round" style={{flexShrink:0}}>
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
            <input
              type="text"
              className="search-input"
              placeholder="직종, 지역, 근무조건으로 인재를 검색해보세요"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && goToJobs()}
            />
            <button className="search-btn" onClick={() => goToJobs()}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="8" stroke="#fff" strokeWidth="2.5" />
                <path d="M21 21l-4.35-4.35" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <div className="region-tabs">
            <span className="region-label">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
              </svg>
              인기지역
            </span>
            {regions.map((region) => (
              <button
                key={region}
                className={`region-tab ${selectedRegions.includes(region) ? 'region-tab--active' : ''}`}
                onClick={() => toggleRegion(region)}
              >
                {region}
              </button>
            ))}
            <button className="region-tab region-tab--more" onClick={goToJobs}>›</button>
          </div>
        </div>

        <div className="hero-image">
          <img src="/caregiver-hero.png" className="hero-photo" alt="요양 인재" />
        </div>
      </div>
    </section>
  )
}
