import { Link } from 'react-router-dom'

const JOBSEEKER_MENUS = [
  { label: '일자리 찾기',  path: '/jobs',            color: '#4A8FE7', bg: '#dbeeff', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg> },
  { label: '구직 등록',   path: '/job-register',    color: '#4A8FE7', bg: '#dbeeff', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg> },
  { label: '내 지원현황', path: '/my-applications', color: '#4A8FE7', bg: '#dbeeff', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="16" x2="13" y2="16"/></svg> },
]

const EMPLOYER_MENUS = [
  { label: '인재 찾기',    path: '/talents',   color: '#e91e8c', bg: '#ffd6ee', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
  { label: '구인공고 목록', path: '/listings',  color: '#e91e8c', bg: '#ffd6ee', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg> },
  { label: '구인공고 등록', path: '/jobs/post', color: '#e91e8c', bg: '#ffd6ee', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg> },
  { label: '내 공고관리',  path: '/manage',    color: '#e91e8c', bg: '#ffd6ee', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg> },
]

export default function HomeQuickMenu() {
  return (
    <section className="hp-quick">
      <div className="hp-quick-inner">

        <div className="hp-quick-card hp-quick-card--js">
          <div className="hp-quick-card-head">
            <span className="hp-quick-card-badge hp-quick-card-badge--js">구직</span>
            <span className="hp-quick-card-desc">일자리를 찾고 계신가요?</span>
          </div>
          <div className="hp-quick-items">
            {JOBSEEKER_MENUS.map(m => (
              <Link key={m.label} to={m.path} className="hp-quick-item">
                <div className="hp-quick-icon" style={{ background: m.bg, color: m.color }}>{m.icon}</div>
                <span className="hp-quick-label">{m.label}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="hp-quick-card hp-quick-card--em">
          <div className="hp-quick-card-head">
            <span className="hp-quick-card-badge hp-quick-card-badge--em">구인</span>
            <span className="hp-quick-card-desc">인재를 찾고 계신가요?</span>
          </div>
          <div className="hp-quick-items">
            {EMPLOYER_MENUS.map(m => (
              <Link key={m.label} to={m.path} className="hp-quick-item">
                <div className="hp-quick-icon" style={{ background: m.bg, color: m.color }}>{m.icon}</div>
                <span className="hp-quick-label">{m.label}</span>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
