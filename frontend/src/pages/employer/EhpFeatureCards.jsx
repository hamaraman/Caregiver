import { useNavigate } from 'react-router-dom'

const EMPLOYER_ACTIONS = [
  {
    label: '구인공고 등록', color: '#4A8FE7', bg: '#EFF5FF',
    path: '/jobs/post',
    icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="7" y1="8" x2="17" y2="8"/><line x1="7" y1="12" x2="17" y2="12"/><line x1="7" y1="16" x2="13" y2="16"/></svg>,
  },
  {
    label: '지원자 확인', color: '#E75480', bg: '#FFF0F5',
    path: '/applicants',
    icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  },
  {
    label: '채용 관리', color: '#27AE60', bg: '#EDFBF3',
    path: '/manage',
    icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  },
  {
    label: '인재 검색', color: '#9B59B6', bg: '#F7EEFF',
    path: '/talents',
    icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>,
  },
  {
    label: '서류 심사', color: '#F39C12', bg: '#FFF8EC',
    path: '/applicants',
    icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
  },
  {
    label: '면접 일정', color: '#1ABC9C', bg: '#EAFAF6',
    path: '/manage',
    icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  },
  {
    label: '공고 현황', color: '#E74C3C', bg: '#FEF0EF',
    path: '/listings',
    icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>,
  },
  {
    label: '기타', color: '#7F8C8D', bg: '#F2F3F4',
    path: null,
    icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/><circle cx="5" cy="12" r="2"/></svg>,
  },
]

export default function EhpFeatureCards() {
  const navigate = useNavigate()

  return (
    <section className="jsp-categories">
      <div className="jsp-inner">
        <div className="jsp-categories-layout">
          <div className="jsp-cat-info">
            <div className="jsp-cat-info-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4A8FE7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2"/><line x1="7" y1="8" x2="17" y2="8"/><line x1="7" y1="12" x2="17" y2="12"/><line x1="7" y1="16" x2="13" y2="16"/>
              </svg>
            </div>
            <p className="jsp-cat-info-title">채용 기능</p>
            <p className="jsp-cat-info-desc">필요한 기능을 선택해<br />채용 업무를 빠르게 처리하세요.</p>
          </div>

          <div className="jsp-cat-grid">
            {EMPLOYER_ACTIONS.map(action => (
              <button
                key={action.label}
                className="jsp-cat-item"
                onClick={() => action.path && navigate(action.path)}
                disabled={!action.path}
              >
                <div className="jsp-cat-icon" style={{ background: action.bg, color: action.color }}>
                  {action.icon}
                </div>
                <span className="jsp-cat-label">{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
