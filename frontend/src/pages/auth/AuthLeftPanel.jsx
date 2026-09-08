import './AuthLeftPanel.css'

const BENEFITS = [
  { label: '간편 가입',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg> },
  { label: '일자리 탐색',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg> },
  { label: '이력서 관리',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="7" y1="8" x2="17" y2="8"/><line x1="7" y1="12" x2="17" y2="12"/><line x1="7" y1="16" x2="13" y2="16"/></svg> },
  { label: '취업 성공',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg> },
]

export default function AuthLeftPanel({ title, desc }) {
  return (
    <div className="alp-left">
      <div className="alp-inner">
        <div className="alp-logo">
          <span className="alp-logo-badge">YN</span>
          <div className="alp-logo-text">
            <span className="alp-logo-sub">요양보호사 구인구직 서비스 No.1</span>
            <span className="alp-logo-name">요양이지</span>
          </div>
        </div>

        <div className="alp-hero">
          <p className="alp-tagline">사람과 사람을 이어주는 마음 따뜻한 일자리 플랫폼</p>
          <h1 className="alp-hero-title">{title}</h1>
          <p className="alp-hero-desc">{desc}</p>
        </div>

        <div className="alp-benefits">
          {BENEFITS.map(b => (
            <div key={b.label} className="alp-benefit-item">
              <span className="alp-benefit-icon">{b.icon}</span>
              <span className="alp-benefit-label">{b.label}</span>
            </div>
          ))}
        </div>
      </div>
      <img src="/caregiver-hero.png" alt="" className="alp-photo" aria-hidden="true" />
    </div>
  )
}
