import { useAuth } from '../hooks/useAuth'
import './AuthGuard.css'

export default function AuthGuard({ require: requiredType, children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="ag-loading">
        <div className="ag-spinner" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="ag-block">
        <div className="ag-card">
          <div className="ag-icon">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
              <rect x="5" y="11" width="14" height="10" rx="2" stroke="#e91e8c" strokeWidth="2"/>
              <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="#e91e8c" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <h2 className="ag-title">로그인이 필요한 서비스입니다</h2>
          <p className="ag-desc">
            해당 페이지는 로그인 후 이용할 수 있습니다.<br />
            로그인하고 다양한 채용 서비스를 이용해보세요.
          </p>
          <div className="ag-actions">
            <button
              className="ag-btn ag-btn--primary"
              onClick={() => { window.location.href = 'http://localhost:5173/' }}
            >
              로그인하기
            </button>
            <button
              className="ag-btn ag-btn--secondary"
              onClick={() => { window.location.href = 'http://localhost:5173/?page=signup' }}
            >
              회원가입
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (requiredType === 'business' && user.userType !== 'business') {
    return (
      <div className="ag-block">
        <div className="ag-card">
          <div className="ag-icon ag-icon--warn">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="#f97316" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="9" cy="7" r="4" stroke="#f97316" strokeWidth="2"/>
              <line x1="19" y1="8" x2="19" y2="14" stroke="#f97316" strokeWidth="2" strokeLinecap="round"/>
              <line x1="22" y1="11" x2="16" y2="11" stroke="#f97316" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <h2 className="ag-title">사업자 계정이 필요합니다</h2>
          <p className="ag-desc">
            이 페이지는 구인자(사업주) 계정만 이용할 수 있습니다.<br />
            사업자 계정으로 다시 로그인해주세요.
          </p>
          <div className="ag-actions">
            <button
              className="ag-btn ag-btn--primary"
              onClick={() => { window.location.href = 'http://localhost:5173/' }}
            >
              다른 계정으로 로그인
            </button>
          </div>
        </div>
      </div>
    )
  }

  return children
}
