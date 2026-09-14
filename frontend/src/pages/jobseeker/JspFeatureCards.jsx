import { Link } from 'react-router-dom'
import { useAuthContext } from '../../contexts/AuthContext'

const BASE_LINKS = [
  {
    color: '#4A8FE7', bg: '#EFF5FF', label: '일자리 찾기', path: '/jobs',
    icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>,
  },
  {
    color: '#27AE60', bg: '#EDFBF3', label: '구직 등록', path: '/job-register',
    icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>,
  },
  {
    color: '#F39C12', bg: '#FFF8EC', label: '지원 현황', path: '/my-applications',
    icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="7" y1="8" x2="17" y2="8"/><line x1="7" y1="12" x2="17" y2="12"/><line x1="7" y1="16" x2="13" y2="16"/></svg>,
  },
  {
    color: '#F39C12', bg: '#FFF8EC', label: '최근 본 일자리', path: '/recent-jobs',
    icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  },
]

const WISH_LINK = {
  color: '#E75480', bg: '#FFF0F5', label: '찜한 일자리', path: '/wishlist',
  icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
}

export default function JspFeatureCards() {
  const { user } = useAuthContext()
  const links = user ? [...BASE_LINKS, WISH_LINK] : BASE_LINKS

  return (
    <section className="jsp-categories">
      <div className="jsp-inner">
        <div className="jsp-cat-grid">
          {links.map(link => (
            <Link key={link.label} to={link.path} className="jsp-cat-item" style={{ textDecoration: 'none' }}>
              <div className="jsp-cat-icon" style={{ background: link.bg, color: link.color }}>
                {link.icon}
              </div>
              <span className="jsp-cat-label">{link.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
