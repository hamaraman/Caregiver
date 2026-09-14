import { Link } from 'react-router-dom'
import './FeatureCards.css'

const features = [
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="3"/><line x1="7" y1="8" x2="17" y2="8"/><line x1="7" y1="12" x2="17" y2="12"/><line x1="7" y1="16" x2="13" y2="16"/></svg>,
    color: '#4A8FE7', bg: '#e8f1ff', label: '구인공고 등록', to: '/jobs/post',
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>,
    color: '#06b6d4', bg: '#e0f7fa', label: '지원자 확인', to: '/applicants',
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>,
    color: '#f59e0b', bg: '#fef3e2', label: '채용 관리', to: '/manage',
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    color: '#8b5cf6', bg: '#f0ebff', label: '인재 검색', to: '/talents',
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
    color: '#f97316', bg: '#fff4ed', label: '서류 심사', to: null,
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    color: '#10b981', bg: '#e6f9f3', label: '면접 일정', to: null,
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
    color: '#4A8FE7', bg: '#e8f1ff', label: '공고 현황', to: '/jobs',
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>,
    color: '#94a3b8', bg: '#f1f5f9', label: '기타', to: null,
  },
]

export default function FeatureCards() {
  return (
    <section className="features-section">
      <div className="features-label">
        <div className="features-label-icon">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#4A8FE7" strokeWidth="2" strokeLinecap="round">
            <rect x="3" y="3" width="18" height="18" rx="3"/>
            <line x1="7" y1="8" x2="17" y2="8"/>
            <line x1="7" y1="12" x2="17" y2="12"/>
            <line x1="7" y1="16" x2="13" y2="16"/>
          </svg>
        </div>
        <div>
          <h2 className="features-label-title">채용 기능</h2>
          <p className="features-label-desc">필요한 기능을 선택해<br/>채용 업무를 빠르게 처리하세요.</p>
        </div>
      </div>

      <div className="features-grid">
        {features.map((f) => {
          const inner = (
            <>
              <div className="feature-item-icon" style={{ color: f.color, background: f.bg }}>
                {f.icon}
              </div>
              <span className="feature-item-label">{f.label}</span>
            </>
          )
          return f.to ? (
            <Link key={f.label} to={f.to} className="feature-item">
              {inner}
            </Link>
          ) : (
            <div key={f.label} className="feature-item feature-item--inactive">
              {inner}
            </div>
          )
        })}
      </div>
    </section>
  )
}
