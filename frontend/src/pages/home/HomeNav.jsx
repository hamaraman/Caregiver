import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

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

export default function HomeNav({ user, onLogout }) {
  const navigate = useNavigate()
  const [activeNav, setActiveNav] = useState(null)

  return (
    <nav className="hp-nav">
      <div className="hp-nav-inner">
        <div className="hp-logo">
          <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
            <rect width="38" height="38" rx="10" fill="#4A8FE7"/>
            <text x="19" y="25" textAnchor="middle" fontSize="13" fontWeight="800" fill="#fff" fontFamily="sans-serif">YE</text>
          </svg>
          <div className="hp-logo-text">
            <span className="hp-logo-tagline">전국 요양·돌봄 일자리 플랫폼</span>
            <span className="hp-logo-name">요양이지</span>
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
              <button className="hp-btn-login" onClick={onLogout}>로그아웃</button>
            </>
          ) : (
            <>
              <button className="hp-btn-login" onClick={() => navigate('/login')}>로그인</button>
              <button className="hp-btn-signup" onClick={() => navigate('/signup')}>회원가입</button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
