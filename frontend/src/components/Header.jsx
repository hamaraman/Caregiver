import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './Header.css'
import { fetchCurrentUser, logout } from '../api'

const guinSubMenu = [
  {
    label: '구인공고 목록',
    desc: '등록된 모든 구인공고를 확인하세요',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="2"/>
        <line x1="7" y1="8" x2="17" y2="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <line x1="7" y1="12" x2="17" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <line x1="7" y1="16" x2="12" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    color: '#7c3aed',
    bg: '#f3f0ff',
  },
  {
    label: '구인 공고 등록',
    desc: '간편하게 구인공고를 등록해보세요',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="2"/>
        <line x1="7" y1="8" x2="17" y2="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <line x1="7" y1="12" x2="17" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <line x1="7" y1="16" x2="13" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    color: '#e91e8c',
    bg: '#fff0f7',
  },
  {
    label: '지원자 확인',
    desc: '지원한 인재의 이력서를 바로 확인',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2"/>
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    color: '#5b8def',
    bg: '#eff4ff',
  },
  {
    label: '채용 관리',
    desc: '지원자 관리부터 채용까지 한 번에',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
        <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    color: '#f97316',
    bg: '#fff4ed',
  },
  {
    label: '맞춤 인재 추천',
    desc: '내 조건에 맞는 우수 인재를 추천',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    color: '#17a2b8',
    bg: '#e8f8fb',
  },
]

const navItems = [
  { label: '홈', href: '/' },
  { label: '구직', href: '/jobs' },
  { label: '구인', href: '#', hasDropdown: true },
  { label: '커뮤니티', href: '#' },
  { label: '고객센터', href: '#' },
]

const subLinkMap = {
  '구인공고 목록': '/jobs',
  '구인 공고 등록': '/jobs/post',
  '지원자 확인': '/applicants',
  '채용 관리': '/manage',
  '맞춤 인재 추천': '/talents',
}

export default function Header() {
  const [active, setActive] = useState('구인')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    let cancelled = false
    const checkUser = () => {
      fetchCurrentUser()
        .then((u) => { if (!cancelled) setUser(u) })
        .catch(() => { if (!cancelled) setUser(null) })
    }
    checkUser()
    const intervalId = setInterval(checkUser, 2000)
    return () => {
      cancelled = true
      clearInterval(intervalId)
    }
  }, [])

  const handleLogout = async () => {
    await logout().catch(() => {})
    setUser(null)
  }

  const closeMobile = () => setMobileMenuOpen(false)

  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="logo" onClick={closeMobile}>
          <div className="logo-icon">
            <span className="logo-yn">YE</span>
          </div>
          <div className="logo-text">
            <span className="logo-sub">요양보호사 구인구직 국내 1위</span>
            <span className="logo-name">요양이지</span>
          </div>
        </Link>

        <nav className="nav">
          {navItems.map((item) =>
            item.hasDropdown ? (
              <div
                key={item.label}
                className="nav-dropdown-wrap"
                onMouseEnter={() => setDropdownOpen(true)}
                onMouseLeave={() => setDropdownOpen(false)}
              >
                <a
                  href={item.href}
                  className={`nav-item ${active === item.label ? 'nav-item--active' : ''}`}
                  onClick={() => setActive(item.label)}
                >
                  {item.label}
                </a>

                {dropdownOpen && (
                  <div className="nav-dropdown">
                    {guinSubMenu.map((sub) => {
                      const to = subLinkMap[sub.label]
                      return to
                        ? <Link key={sub.label} to={to} className="nav-dropdown-item">
                            <span className="nav-dropdown-label">{sub.label}</span>
                          </Link>
                        : <a key={sub.label} href="#" className="nav-dropdown-item">
                            <span className="nav-dropdown-label">{sub.label}</span>
                          </a>
                    })}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={item.label}
                to={item.href}
                className={`nav-item ${active === item.label ? 'nav-item--active' : ''}`}
                onClick={() => setActive(item.label)}
              >
                {item.label}
              </Link>
            )
          )}
        </nav>

        <div className="header-actions">
          {user ? (
            <>
              <span className="user-greeting">{user.name || user.email}님 환영합니다</span>
              <button className="btn-login" onClick={handleLogout}>로그아웃</button>
            </>
          ) : (
            <>
              <button className="btn-login" onClick={() => { window.location.href = 'http://localhost:5173/' }}>로그인</button>
              <button className="btn-signup" onClick={() => { window.location.href = 'http://localhost:5173/?page=signup' }}>회원가입</button>
            </>
          )}
        </div>

        <button
          className="hamburger-btn"
          onClick={() => setMobileMenuOpen((v) => !v)}
          aria-label="메뉴"
        >
          {mobileMenuOpen ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <line x1="18" y1="6" x2="6" y2="18" stroke="#444" strokeWidth="2.5" strokeLinecap="round"/>
              <line x1="6" y1="6" x2="18" y2="18" stroke="#444" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <line x1="3" y1="6" x2="21" y2="6" stroke="#444" strokeWidth="2.5" strokeLinecap="round"/>
              <line x1="3" y1="12" x2="21" y2="12" stroke="#444" strokeWidth="2.5" strokeLinecap="round"/>
              <line x1="3" y1="18" x2="21" y2="18" stroke="#444" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          )}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="mobile-menu">
          <nav className="mobile-nav">
            {navItems.map((item) =>
              item.hasDropdown ? (
                <div key={item.label} className="mobile-nav-section">
                  <span className="mobile-nav-section-label">{item.label}</span>
                  {guinSubMenu.map((sub) => {
                    const to = subLinkMap[sub.label]
                    return to ? (
                      <Link key={sub.label} to={to} className="mobile-nav-sub-item" onClick={closeMobile}>
                        {sub.label}
                      </Link>
                    ) : (
                      <a key={sub.label} href="#" className="mobile-nav-sub-item" onClick={closeMobile}>
                        {sub.label}
                      </a>
                    )
                  })}
                </div>
              ) : (
                <Link
                  key={item.label}
                  to={item.href}
                  className="mobile-nav-item"
                  onClick={() => { setActive(item.label); closeMobile() }}
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>
          <div className="mobile-menu-actions">
            {user ? (
              <>
                <span className="mobile-user-greeting">{user.name || user.email}님</span>
                <button className="mobile-btn-login" onClick={() => { handleLogout(); closeMobile() }}>로그아웃</button>
              </>
            ) : (
              <>
                <button className="mobile-btn-login" onClick={() => { window.location.href = 'http://localhost:5173/'; closeMobile() }}>로그인</button>
                <button className="mobile-btn-signup" onClick={() => { window.location.href = 'http://localhost:5173/?page=signup'; closeMobile() }}>회원가입</button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
