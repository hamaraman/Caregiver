import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import '../HomePage.css'
import { fetchCurrentUser, logout } from '../../api'

const NAV_ITEMS = [
  { label: '홈', path: '/',
    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    sub: [] },
  { label: '구직', path: '/jobseeker',
    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>,
    sub: ['요양보호사 구직', '간호조무사 구직', '사회복지사 구직', '물리치료사 구직'] },
  { label: '구인', path: '/employer',
    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    sub: ['채용공고 등록', '구인 현황', '인재 찾기'] },
  { label: '커뮤니티', path: '/community',
    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
    sub: ['자유게시판', '취업 후기', '자격증 정보', 'Q&A'] },
  { label: '고객센터', path: '/support',
    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.5 2 2 0 0 1 3.6 1.32h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 8.5a16 16 0 0 0 6 6l.86-.86a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
    sub: ['공지사항', 'FAQ', '1:1 문의'] },
]

export default function HomeNav() {
  const location = useLocation()
  const navigate = useNavigate()
  const [activeNav, setActiveNav] = useState(null)
  const [user, setUser] = useState(null)

  useEffect(() => {
    fetchCurrentUser().then(setUser).catch(() => setUser(null))
  }, [])

  const handleLogout = async () => {
    await logout().catch(() => {})
    setUser(null)
  }

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname === path

  return (
    <nav className="hp-nav">
      <div className="hp-nav-inner">
        <Link to="/" className="hp-logo" style={{ textDecoration: 'none' }}>
          <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
            <rect width="38" height="38" rx="10" fill="#4A8FE7"/>
            <text x="19" y="25" textAnchor="middle" fontSize="13" fontWeight="800" fill="#fff" fontFamily="sans-serif">YE</text>
          </svg>
          <div className="hp-logo-text">
            <span className="hp-logo-tagline">전국 요양·돌봄 일자리 플랫폼</span>
            <span className="hp-logo-name">요양이지</span>
          </div>
        </Link>

        <ul className="hp-nav-list">
          {NAV_ITEMS.map(item => (
            <li key={item.label} className="hp-nav-group"
              onMouseEnter={() => setActiveNav(item.label)}
              onMouseLeave={() => setActiveNav(null)}
            >
              <button className={`hp-nav-btn ${isActive(item.path) ? 'active' : ''}`} onClick={() => navigate(item.path)}>
                <span className="hp-nav-icon">{item.icon}</span>
                <span className="hp-nav-label" data-text={item.label}>{item.label}</span>
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
              <Link to="/login" className="hp-btn-login">로그인</Link>
              <Link to="/signup" className="hp-btn-signup">회원가입</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
