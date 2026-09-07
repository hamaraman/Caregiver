import { useState } from 'react'
import './HomePage.css'

const NAV_ITEMS = [
  { label: '홈', sub: [] },
  { label: '구직', sub: ['요양보호사 구직', '간호조무사 구직', '사회복지사 구직', '물리치료사 구직'] },
  { label: '구인', sub: ['채용공고 등록', '구인 현황', '인재 찾기'] },
  { label: '커뮤니티', sub: ['자유게시판', '취업 후기', '자격증 정보', 'Q&A'] },
  { label: '고객센터', sub: ['공지사항', 'FAQ', '1:1 문의'] },
]

const REGIONS = ['전체', '서울', '경기', '인천', '부산', '대구', '대전', '광주', '울산', '세종']

const STATS = [
  { icon: '👤', label: '등록 구직자', value: '12,846', unit: '명' },
  { icon: '🏥', label: '등록 업체',   value: '3,241',  unit: '개' },
  { icon: '📋', label: '진행 중 공고', value: '1,028',  unit: '건' },
  { icon: '✅', label: '이번달 매칭', value: '487',    unit: '건' },
]

const QUICK_MENUS = [
  { emoji: '🔍', label: '일자리 찾기' },
  { emoji: '📝', label: '구직 등록' },
  { emoji: '📄', label: '이력서 등록' },
  { emoji: '🏢', label: '구인 찾기' },
  { emoji: '🚗', label: '방문요양' },
  { emoji: '🏠', label: '재가요양' },
  { emoji: '🏥', label: '요양원' },
  { emoji: '❤️', label: '복지관' },
]

const REGION_RANKS = [
  { rank: 1, region: '서울', job: '요양보호사(주간)', count: 119 },
  { rank: 2, region: '서울', job: '방문요양사',       count: 98  },
  { rank: 3, region: '경기', job: '요양보호사',       count: 156 },
  { rank: 4, region: '경기', job: '방문요양사',       count: 142 },
  { rank: 5, region: '인천', job: '요양보호사',       count: 87  },
  { rank: 6, region: '부산', job: '요양보호사(야간)', count: 74  },
  { rank: 7, region: '대구', job: '방문요양사',       count: 68  },
  { rank: 8, region: '광주', job: '요양보호사',       count: 52  },
]

const RECENT_JOBS = [
  { badge: '긴급', badgeColor: 'red',    company: '행복한요양원',     title: '요양보호사(주간)', location: '서울 강남구', pay: '시급 14,000원', date: '09.06' },
  { badge: '인기', badgeColor: 'orange', company: '사랑나눔재가센터', title: '방문요양사',       location: '인천 부평구', pay: '시급 12,500원', date: '09.05' },
  { badge: '',     badgeColor: '',       company: '햇살케어센터',     title: '요양보호사(야간)', location: '경기 성남시', pay: '시급 13,500원', date: '09.05' },
  { badge: '긴급', badgeColor: 'red',    company: '인천케이홈',       title: '간호조무사(야간)', location: '인천 남동구', pay: '시급 15,000원', date: '09.03' },
  { badge: '',     badgeColor: '',       company: '서울노인복지센터', title: '재가요양보호사',   location: '서울 송파구', pay: '월 2,200,000원', date: '09.04' },
]

const CERTS = [
  { name: '요양보호사', tag: '1급',    desc: '노인 돌봄 전문 국가자격증',   color: '#4A8FE7' },
  { name: '사회복지사', tag: '2급',    desc: '복지 서비스 전문 국가자격증', color: '#27ae60' },
  { name: '간호조무사', tag: '국가자격', desc: '의료보조 전문 국가자격증',   color: '#e67e22' },
  { name: '물리치료사', tag: '국가면허', desc: '재활치료 전문 국가자격증',   color: '#9b59b6' },
]

export default function HomePage({ onNavigate }) {
  const [activeNav, setActiveNav]         = useState(null)
  const [selectedRegion, setSelectedRegion] = useState('전체')
  const [keyword, setKeyword]             = useState('')

  return (
    <div className="hp-root">

      {/* ── NAV ── */}
      <nav className="hp-nav">
        <div className="hp-nav-inner">
          <div className="hp-logo">
            <span className="hp-logo-badge">YN</span>
            <span className="hp-logo-name">요양나라</span>
          </div>
          <ul className="hp-nav-list">
            {NAV_ITEMS.map(item => (
              <li key={item.label} className="hp-nav-group"
                onMouseEnter={() => setActiveNav(item.label)}
                onMouseLeave={() => setActiveNav(null)}
              >
                <button className={`hp-nav-btn ${item.label === '홈' ? 'active' : ''}`}>
                  {item.label}
                  {item.sub.length > 0 && <span className="hp-nav-arrow">▾</span>}
                </button>
                {item.sub.length > 0 && activeNav === item.label && (
                  <div className="hp-dropdown">
                    {item.sub.map(s => (
                      <button key={s} className="hp-dropdown-item">{s}</button>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
          <div className="hp-nav-actions">
            <button className="hp-btn-login" onClick={() => onNavigate('login')}>로그인</button>
            <button className="hp-btn-signup">회원가입</button>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="hp-hero">
        <img src="/caregiver-hero.png" className="hp-hero-photo" alt="" aria-hidden="true" />
        <div className="hp-hero-content">
          <div className="hp-hero-text">
            <p className="hp-hero-sub">사람과 사람을 이어주는 마음 따뜻한 일자리 플랫폼</p>
            <h1 className="hp-hero-title">요양나라에 오신<br />것을 환영합니다.</h1>
            <div className="hp-search-wrap">
              <span className="hp-search-icon">🔍</span>
              <input
                className="hp-search-input"
                placeholder="직종, 근무형태, 지역을 검색해보세요"
                value={keyword}
                onChange={e => setKeyword(e.target.value)}
              />
              <button className="hp-search-btn">검색</button>
            </div>
            <div className="hp-region-chips">
              {REGIONS.map(r => (
                <button key={r}
                  className={`hp-chip ${selectedRegion === r ? 'active' : ''}`}
                  onClick={() => setSelectedRegion(r)}
                >{r}</button>
              ))}
            </div>
          </div>

          <div className="hp-hero-cards">
            <button className="hp-hero-card hp-hero-card--blue" onClick={() => onNavigate('jobseeker')}>
              <span className="hp-hero-card-icon">🔍</span>
              <span className="hp-hero-card-label">구직하기</span>
              <span className="hp-hero-card-desc">일자리를 찾고 있나요?</span>
            </button>
            <button className="hp-hero-card hp-hero-card--pink">
              <span className="hp-hero-card-icon">📋</span>
              <span className="hp-hero-card-label">구인공고 등록</span>
              <span className="hp-hero-card-desc">인재를 찾고 있나요?</span>
            </button>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="hp-stats">
        <p className="hp-stats-title">요양 인력 네트워크 등록 현황</p>
        <div className="hp-stats-grid">
          {STATS.map(s => (
            <div key={s.label} className="hp-stat-item">
              <span className="hp-stat-icon">{s.icon}</span>
              <span className="hp-stat-value">{s.value}<em>{s.unit}</em></span>
              <span className="hp-stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── QUICK MENU ── */}
      <section className="hp-quick">
        <div className="hp-quick-inner">
          {QUICK_MENUS.map(m => (
            <button key={m.label} className="hp-quick-item">
              <span className="hp-quick-icon">{m.emoji}</span>
              <span className="hp-quick-label">{m.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* ── CONTENT GRID ── */}
      <section className="hp-content">

        {/* 지역별 인기 직종 */}
        <div className="hp-card">
          <h2 className="hp-card-title">지역별 인기 직종</h2>
          <table className="hp-rank-table">
            <thead>
              <tr>
                <th>순위</th><th>지역</th><th>직종</th><th>공고</th>
              </tr>
            </thead>
            <tbody>
              {REGION_RANKS.map(r => (
                <tr key={r.rank}>
                  <td><span className={`hp-rank ${r.rank <= 3 ? 'top' : ''}`}>{r.rank}</span></td>
                  <td>{r.region}</td>
                  <td>{r.job}</td>
                  <td>{r.count}건</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 최근 구인 등록 */}
        <div className="hp-card">
          <div className="hp-card-header">
            <h2 className="hp-card-title">최근 구인 등록</h2>
            <button className="hp-more-btn">더보기 ›</button>
          </div>
          <ul className="hp-job-list">
            {RECENT_JOBS.map((job, i) => (
              <li key={i} className="hp-job-item">
                <div className="hp-job-top">
                  {job.badge && <span className={`hp-badge hp-badge--${job.badgeColor}`}>{job.badge}</span>}
                  <span className="hp-job-title">{job.title}</span>
                  <span className="hp-job-date">{job.date}</span>
                </div>
                <div className="hp-job-bottom">
                  <span>{job.company}</span>
                  <span className="hp-sep">·</span>
                  <span>{job.location}</span>
                  <span className="hp-sep">·</span>
                  <span className="hp-job-pay">{job.pay}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* 요양나라 자격증관 */}
        <div className="hp-card">
          <h2 className="hp-card-title">요양나라 자격증관</h2>
          <ul className="hp-cert-list">
            {CERTS.map(c => (
              <li key={c.name} className="hp-cert-item">
                <div className="hp-cert-bar" style={{ background: c.color }} />
                <div className="hp-cert-info">
                  <div className="hp-cert-name-row">
                    <span className="hp-cert-name">{c.name}</span>
                    <span className="hp-cert-tag" style={{ color: c.color }}>{c.tag}</span>
                  </div>
                  <p className="hp-cert-desc">{c.desc}</p>
                </div>
                <button className="hp-cert-btn">›</button>
              </li>
            ))}
          </ul>
        </div>

      </section>

      {/* ── FOOTER ── */}
      <footer className="hp-footer">
        <p>© 2026 요양나라. All rights reserved.</p>
        <p>고객센터: 1588-0000 · 평일 09:00 ~ 18:00</p>
      </footer>

    </div>
  )
}
