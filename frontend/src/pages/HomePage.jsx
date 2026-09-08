import { useEffect, useState } from 'react'
import './HomePage.css'
import { fetchCurrentUser, logout } from '../api'

const NAV_ITEMS = [
  { label: '홈', sub: [],
    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
  { label: '구직', sub: ['요양보호사 구직', '간호조무사 구직', '사회복지사 구직', '물리치료사 구직'],
    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg> },
  { label: '구인', sub: ['채용공고 등록', '구인 현황', '인재 찾기'],
    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
  { label: '커뮤니티', sub: ['자유게시판', '취업 후기', '자격증 정보', 'Q&A'],
    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> },
  { label: '고객센터', sub: ['공지사항', 'FAQ', '1:1 문의'],
    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.5 2 2 0 0 1 3.6 1.32h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 8.5a16 16 0 0 0 6 6l.86-.86a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg> },
]

const REGIONS = ['서울', '경기', '인천', '부산', '대구', '대전', '광주', '울산', '세종']

const TODAY_STATS = [
  { label: '새로운 구인공고', value: '128', unit: '건', color: '#4A8FE7', bg: '#eff4ff',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="7" y1="8" x2="17" y2="8"/><line x1="7" y1="12" x2="17" y2="12"/><line x1="7" y1="16" x2="13" y2="16"/></svg> },
  { label: '새로운 인재정보', value: '46', unit: '건', color: '#e91e8c', bg: '#fff0f7',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg> },
  { label: '오늘 마감되는 공고', value: '12', unit: '건', color: '#0bc5a8', bg: '#e8faf7',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
  { label: '관심공고 업데이트', value: '3', unit: '건', color: '#9b59b6', bg: '#f5eeff',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg> },
]

const QUICK_MENUS = [
  { label: '일자리 찾기', color: '#4A8FE7', bg: '#eff4ff', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg> },
  { label: '인재정보', color: '#e91e8c', bg: '#fff0f7', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg> },
  { label: '구인공고 등록', color: '#9b59b6', bg: '#f5eeff', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg> },
  { label: '인재 찾기', color: '#0bc5a8', bg: '#e8faf7', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
  { label: '내 지원현황', color: '#f97316', bg: '#fff4ed', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="16" x2="13" y2="16"/></svg> },
  { label: '내 공고관리', color: '#4A8FE7', bg: '#eff4ff', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg> },
  { label: '포인트', color: '#ca8a04', bg: '#fefce8', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 10.5h5a1.5 1.5 0 0 1 0 3H8"/></svg> },
  { label: '커뮤니티', color: '#9b59b6', bg: '#f5eeff', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> },
]

const REGION_TABS = ['전체', '서울', '경기', '인천', '대구', '광주', '울산']

const POPULAR_HIRE = [
  { rank: 1, region: '서울', count: '1,245건' },
  { rank: 2, region: '경기', count: '892건' },
  { rank: 3, region: '인천', count: '431건' },
  { rank: 4, region: '부산', count: '287건' },
  { rank: 5, region: '대구', count: '201건' },
]

const POPULAR_JOB = [
  { rank: 1, region: '서울', count: '1,102건' },
  { rank: 2, region: '경기', count: '843건' },
  { rank: 3, region: '인천', count: '402건' },
  { rank: 4, region: '부산', count: '256건' },
  { rank: 5, region: '대전', count: '198건' },
]

const RECENT_LISTINGS = [
  { title: '요양보호사 구인 (주간)', location: '서울 성남구', pay: '시급 14,000원', hours: '09:00-15:00', timeAgo: '5분 전' },
  { title: '요양보호사 (야간)', location: '경기 성남시', pay: '시급 13,500원', hours: '16:00-22:00', timeAgo: '12분 전' },
  { title: '간병인 (상시)', location: '대구 달서구', pay: '월급 4,500,000원', hours: '08:00-17:00', timeAgo: '28분 전' },
  { title: '요양보호사 (오후)', location: '인천 남동구', pay: '시급 13,000원', hours: '13:00-18:00', timeAgo: '1시간 전' },
  { title: '요양보호사 (주간)', location: '부산 해운대구', pay: '시급 13,500원', hours: '09:00-15:00', timeAgo: '2시간 전' },
]

const NOTICES = [
  { type: '공지', title: '요양나라 서비스 점검 안내', date: '2026.09.05' },
  { type: '공지', title: '포인트 정책 변경 안내', date: '2026.09.04' },
  { type: '안내', title: '구인공고 등록 방법 안내', date: '2026.09.03' },
  { type: '안내', title: '인재정보 이용 방법 안내', date: '2026.09.02' },
  { type: 'FAQ', title: '자주 묻는 질문 모음', date: '2026.09.01' },
]

export default function HomePage({ onNavigate }) {
  const [activeNav, setActiveNav] = useState(null)
  const [selectedRegion, setSelectedRegion] = useState('')
  const [keyword, setKeyword] = useState('')
  const [regionTab, setRegionTab] = useState('전체')
  const [listingTab, setListingTab] = useState('구인공고')
  const [user, setUser] = useState(null)

  useEffect(() => {
    fetchCurrentUser()
      .then(setUser)
      .catch(() => setUser(null))
  }, [])

  const handleLogout = async () => {
    await logout().catch(() => {})
    setUser(null)
  }

  return (
    <div className="hp-root">

      {/* ── NAV ── */}
      <nav className="hp-nav">
        <div className="hp-nav-inner">
          <div className="hp-logo">
            <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
              <rect width="38" height="38" rx="10" fill="#4A8FE7"/>
              <text x="19" y="25" textAnchor="middle" fontSize="13" fontWeight="800" fill="#fff" fontFamily="sans-serif">YN</text>
              <path d="M26 10c1.8 0 3 1.5 3 3s-1.2 3.5-3 5c-1.8-1.5-3-3-3-5s1.2-3 3-3z" fill="#e91e8c" opacity="0.9"/>
            </svg>
            <div className="hp-logo-text">
              <span className="hp-logo-tagline">요양보호사 구인구직 국내 1위</span>
              <span className="hp-logo-name">요양나라</span>
            </div>
          </div>

          <ul className="hp-nav-list">
            {NAV_ITEMS.map(item => (
              <li key={item.label} className="hp-nav-group"
                onMouseEnter={() => setActiveNav(item.label)}
                onMouseLeave={() => setActiveNav(null)}
              >
                <button className={`hp-nav-btn ${item.label === '홈' ? 'active' : ''}`}>
                  <span className="hp-nav-icon">{item.icon}</span>
                  {item.label}
                  {item.sub.length > 0 && <span className="hp-nav-caret">▾</span>}
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
            <button className="hp-btn-search" aria-label="검색">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
              </svg>
            </button>
            {user ? (
              <>
                <span className="hp-user-greeting">{user.name || user.email}님</span>
                <button className="hp-btn-login" onClick={handleLogout}>로그아웃</button>
              </>
            ) : (
              <>
                <button className="hp-btn-login" onClick={() => onNavigate('login')}>로그인</button>
                <button className="hp-btn-signup">회원가입</button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="hp-hero">
        <img src="/caregiver-hero.png" className="hp-hero-photo" alt="" aria-hidden="true" />
        <div className="hp-hero-inner">
          <div className="hp-hero-content">
            <p className="hp-hero-sub">사람과 사람을 이어주는 따뜻한 일자리 플랫폼</p>
            <h1 className="hp-hero-title">요양나라에 오신 것을 환영합니다.</h1>
            <p className="hp-hero-desc">요양보호사, 간병인, 돌봄 일자리를 찾거나<br />인재를 등록하고 싶으신가요? 지금 바로 시작해보세요.</p>
            <div className="hp-search-wrap">
              <input
                className="hp-search-input"
                placeholder="지역, 근무형태, 직종, 키워드로 검색해보세요."
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
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
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

          <div className="hp-hero-cards">
            <button className="hp-hero-card" onClick={() => onNavigate('jobseeker')}>
              <p className="hp-hcard-label">일자리를 찾고 계신가요?</p>
              <div className="hp-hcard-icon hp-hcard-icon--blue">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                </svg>
              </div>
              <p className="hp-hcard-title">구직하기</p>
              <p className="hp-hcard-desc">요양보호사, 간병인, 돌봄 일자리를<br />지금 바로 찾아보세요.</p>
              <div className="hp-hcard-arrow hp-hcard-arrow--blue">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </div>
            </button>

            <button className="hp-hero-card">
              <p className="hp-hcard-label">인재를 찾고 계신가요?</p>
              <div className="hp-hcard-icon hp-hcard-icon--pink">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2"/><line x1="7" y1="8" x2="17" y2="8"/><line x1="7" y1="12" x2="17" y2="12"/><line x1="7" y1="16" x2="13" y2="16"/>
                </svg>
              </div>
              <p className="hp-hcard-title">구인공고 등록</p>
              <p className="hp-hcard-desc">필요한 인재를 쉽고 빠르게<br />찾아보세요.</p>
              <div className="hp-hcard-arrow hp-hcard-arrow--pink">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* ── TODAY STATS ── */}
      <section className="hp-today">
        <div className="hp-today-inner">
          <div className="hp-today-lead">
            <div className="hp-today-bell">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4A8FE7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
            </div>
            <div>
              <p className="hp-today-title">오늘 확인해보세요</p>
              <p className="hp-today-sub">지금 바로 확인해야 할 중요한 정보를 모아드려요.</p>
            </div>
          </div>
          <div className="hp-today-stats">
            {TODAY_STATS.map(s => (
              <button key={s.label} className="hp-today-stat">
                <div className="hp-today-stat-icon" style={{ background: s.bg, color: s.color }}>{s.icon}</div>
                <div className="hp-today-stat-body">
                  <p className="hp-today-stat-label">{s.label}</p>
                  <p className="hp-today-stat-value" style={{ color: s.color }}>{s.value}<em>{s.unit}</em></p>
                </div>
                <span className="hp-today-stat-caret">›</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── QUICK MENU ── */}
      <section className="hp-quick">
        <div className="hp-quick-inner">
          <div className="hp-quick-lead">
            <p className="hp-quick-lead-title">빠른 메뉴</p>
            <p className="hp-quick-lead-sub">자주 찾는 서비스를<br />한눈에 이용하세요.</p>
          </div>
          <div className="hp-quick-items">
            {QUICK_MENUS.map(m => (
              <button key={m.label} className="hp-quick-item">
                <div className="hp-quick-icon" style={{ background: m.bg, color: m.color }}>{m.icon}</div>
                <span className="hp-quick-label">{m.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTENT GRID ── */}
      <div className="hp-content">

        {/* 지역별 인기 정보 */}
        <div className="hp-card">
          <div className="hp-card-header">
            <h2 className="hp-card-title">지역별 인기 정보</h2>
            <button className="hp-more-btn">전체보기 ›</button>
          </div>
          <div className="hp-rtabs">
            {REGION_TABS.map(t => (
              <button key={t} className={`hp-rtab ${regionTab === t ? 'active' : ''}`}
                onClick={() => setRegionTab(t)}>{t}</button>
            ))}
          </div>
          <div className="hp-popular-grid">
            <div className="hp-popular-col">
              <p className="hp-popular-col-title">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#e91e8c" strokeWidth="2.5" strokeLinecap="round"><path d="M21 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                인기 구인 지역
              </p>
              {POPULAR_HIRE.map(r => (
                <div key={r.rank} className="hp-popular-row">
                  <span className={`hp-popular-rank ${r.rank <= 3 ? 'top' : ''}`}>{r.rank}</span>
                  <span className="hp-popular-region">{r.region}</span>
                  <span className="hp-popular-count">{r.count}</span>
                </div>
              ))}
            </div>
            <div className="hp-popular-divider" />
            <div className="hp-popular-col">
              <p className="hp-popular-col-title">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#4A8FE7" strokeWidth="2.5" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
                인기 구직 지역
              </p>
              {POPULAR_JOB.map(r => (
                <div key={r.rank} className="hp-popular-row">
                  <span className={`hp-popular-rank ${r.rank <= 3 ? 'top' : ''}`}>{r.rank}</span>
                  <span className="hp-popular-region">{r.region}</span>
                  <span className="hp-popular-count">{r.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 최근 등록된 정보 */}
        <div className="hp-card">
          <div className="hp-card-header">
            <h2 className="hp-card-title">최근 등록된 정보</h2>
            <button className="hp-more-btn">전체보기 ›</button>
          </div>
          <div className="hp-ltabs">
            {['구인공고', '인재정보'].map(t => (
              <button key={t} className={`hp-ltab ${listingTab === t ? 'active' : ''}`}
                onClick={() => setListingTab(t)}>{t}</button>
            ))}
          </div>
          <ul className="hp-listing-list">
            {RECENT_LISTINGS.map((job, i) => (
              <li key={i} className="hp-listing-item">
                <div className="hp-listing-top">
                  <span className="hp-listing-badge">구인</span>
                  <span className="hp-listing-title">{job.title}</span>
                  <span className="hp-listing-ago">{job.timeAgo}</span>
                </div>
                <p className="hp-listing-sub">{job.location} · <span className="hp-listing-pay">{job.pay}</span> · {job.hours}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* 공지사항 & 이용안내 */}
        <div className="hp-card">
          <div className="hp-card-header">
            <h2 className="hp-card-title">공지사항 &amp; 이용안내</h2>
            <button className="hp-more-btn">전체보기 ›</button>
          </div>
          <ul className="hp-notice-list">
            {NOTICES.map((n, i) => (
              <li key={i} className="hp-notice-item">
                <span className={`hp-notice-badge hp-notice-badge--${n.type === '공지' ? 'blue' : n.type === '안내' ? 'teal' : 'gray'}`}>{n.type}</span>
                <span className="hp-notice-title">{n.title}</span>
                <span className="hp-notice-date">{n.date}</span>
              </li>
            ))}
          </ul>
          <div className="hp-notice-cta">
            <div className="hp-notice-cta-icon">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill="#e91e8c" opacity="0.85"/>
              </svg>
            </div>
            <p className="hp-notice-cta-text">함께 만드는 더 좋은 돌봄 사회<br /><span>요양나라가 함께합니다.</span></p>
            <button className="hp-notice-cta-btn">이용안내 보기 →</button>
          </div>
        </div>

      </div>

      {/* ── FOOTER ── */}
      <footer className="hp-footer">
        <div className="hp-footer-links">
          <a href="#">이용약관</a><span>·</span>
          <a href="#">개인정보처리방침</a><span>·</span>
          <a href="#">공지사항</a><span>·</span>
          <a href="#">FAQ</a><span>·</span>
          <a href="#">고객센터</a>
        </div>
        <p className="hp-footer-copy">© 2026 요양나라. All rights reserved.</p>
      </footer>

    </div>
  )
}
