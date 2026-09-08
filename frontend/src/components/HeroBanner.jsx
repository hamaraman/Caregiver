import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './HeroBanner.css'

const regions = ['전체', '서울', '경기', '인천', '부산', '대구', '대전', '광주', '울산', '세종']

export default function HeroBanner() {
  const [selectedRegions, setSelectedRegions] = useState([])
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  const goToJobs = () => {
    const params = new URLSearchParams()
    if (query.trim()) params.set('q', query.trim())
    if (selectedRegions.length > 0) params.set('region', selectedRegions.join(','))
    navigate(`/jobs${params.toString() ? '?' + params.toString() : ''}`)
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
          <h1 className="hero-title">
            믿을 수 있는 인재를<br />
            <span className="hero-highlight">요양이지에서 만나보세요</span>
          </h1>
          <p className="hero-desc">
            간편한 구인 등록으로, 빠르고 정확하게<br />
            원하는 인재를 채용할 수 있습니다.
          </p>

          <div className="hero-search">
            <input
              type="text"
              className="search-input"
              placeholder="지역, 근무형태, 직무를 검색해보세요"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && goToJobs()}
            />
            <button className="search-btn" onClick={() => goToJobs()}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="7" stroke="#fff" strokeWidth="2.5" />
                <path d="M16.5 16.5L21 21" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <div className="region-tabs">
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
          <div className="hero-img-wrapper">
            <div className="hero-bubble">
              좋은 인재와<br />함께 성장하세요! 💕
            </div>
            <div className="hero-avatar">
              <svg viewBox="0 0 200 280" fill="none" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="100" cy="260" rx="80" ry="20" fill="rgba(233,30,140,0.08)" />
                <circle cx="100" cy="80" r="55" fill="#f8d7e8" />
                <ellipse cx="100" cy="200" rx="60" ry="80" fill="#fff" />
                <rect x="50" y="160" width="100" height="120" rx="20" fill="#f5e6ed" />
                <circle cx="100" cy="80" r="42" fill="#e8c0d0" />
                <ellipse cx="100" cy="78" rx="30" ry="35" fill="#f2ccc0" />
                <path d="M70 110 Q100 140 130 110" stroke="#e8c0d0" strokeWidth="3" fill="none" />
                <text x="100" y="95" textAnchor="middle" fontSize="12" fill="#c96" fontWeight="bold">😊</text>
                <rect x="40" y="155" width="120" height="10" rx="5" fill="#e91e8c" opacity="0.2" />
                <rect x="55" y="165" width="90" height="100" rx="15" fill="#fff5fa" />
                <rect x="65" y="175" width="70" height="8" rx="4" fill="#e91e8c" opacity="0.3" />
                <rect x="65" y="190" width="50" height="8" rx="4" fill="#e91e8c" opacity="0.2" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
