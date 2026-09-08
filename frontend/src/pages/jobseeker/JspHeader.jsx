import { useState } from 'react'

const NAV_ITEMS = [
  { label: '홈', sub: [] },
  { label: '구직', sub: ['일자리 찾기', '이력서 등록', '지원 현황', '맞춤 일자리 추천'] },
  { label: '구인', sub: ['구인 등록하기', '지원자 확인', '채용 관리', '맞춤 인재 추천'] },
  { label: '커뮤니티', sub: ['공지사항', '취업 후기', '자유게시판', 'Q&A'] },
  { label: '고객센터', sub: ['공지사항', 'FAQ', '1:1 문의', '신고센터'] },
]

export default function JspHeader({ onNavigate }) {
  const [activeNav, setActiveNav] = useState('구직')

  return (
    <header className="jsp-header">
      <div className="jsp-header-inner">
        <div className="jsp-logo">
          <span className="jsp-logo-badge">YN</span>
          <div className="jsp-logo-text-wrap">
            <span className="jsp-logo-sub">요양보호사 구인구직 서비스 No.1</span>
            <span className="jsp-logo-text">요양이지</span>
          </div>
        </div>

        <nav className="jsp-nav">
          {NAV_ITEMS.map(item => (
            <div key={item.label} className="jsp-nav-group">
              <button
                className={`jsp-nav-item ${activeNav === item.label ? 'active' : ''}`}
                onClick={() => setActiveNav(item.label)}
              >
                {item.label}
                {item.sub.length > 0 && <span className="jsp-nav-arrow">▾</span>}
              </button>
              {item.sub.length > 0 && (
                <div className="jsp-dropdown">
                  {item.sub.map(sub => (
                    <button key={sub} className="jsp-dropdown-item">{sub}</button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="jsp-auth">
          <button className="jsp-btn-ghost" onClick={() => onNavigate('login')}>로그인</button>
          <button className="jsp-btn-primary" onClick={() => onNavigate('signup')}>회원가입</button>
        </div>
      </div>
    </header>
  )
}
