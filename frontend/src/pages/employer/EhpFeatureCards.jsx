import { Link } from 'react-router-dom'

const ACTIONS = [
  {
    label: '구인공고 등록', color: '#4A8FE7', bg: '#F0F6FF', path: '/jobs/post',
    icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>,
  },
  {
    label: '지원자 확인', color: '#E75480', bg: '#FFF0F5', path: '/applicants',
    icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  },
  {
    label: '채용 관리', color: '#27AE60', bg: '#F0FBF5', path: '/manage',
    icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  },
  {
    label: '인재 검색', color: '#9B59B6', bg: '#F7EEFF', path: '/talents',
    icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>,
  },
  {
    label: '찜한 인재', color: '#e04444', bg: '#FFF0F0', path: '/wishlist',
    icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
  },
]

export default function EhpFeatureCards() {
  return (
    <section className="jsp-categories">
      <div className="jsp-inner">
        <div className="jsp-cat-grid">
          {ACTIONS.map(action => (
            <Link key={action.label} to={action.path} className="jsp-cat-item" style={{ textDecoration: 'none' }}>
              <div className="jsp-cat-icon" style={{ background: action.bg, color: action.color }}>
                {action.icon}
              </div>
              <span className="jsp-cat-label">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
