import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import './ApplicantModal.css'

export const STATUS_MAP = {
  '검토중': { label: '검토중', cls: 'apm-status--review' },
  '합격':   { label: '합격',   cls: 'apm-status--pass'   },
  '불합격': { label: '불합격', cls: 'apm-status--fail'   },
}
const STATUS_OPTIONS = ['검토중', '합격', '불합격']

export function StatusDropdown({ status, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const st = STATUS_MAP[status] ?? STATUS_MAP['검토중']

  useEffect(() => {
    if (!open) return
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  return (
    <div className="apm-status-wrap" ref={ref} onClick={e => e.stopPropagation()}>
      <button
        className={`apm-status-chip ${st.cls} apm-status-chip--btn`}
        onClick={() => setOpen(v => !v)}
      >
        {st.label}
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      {open && (
        <div className="apm-status-dropdown">
          {STATUS_OPTIONS.map(opt => {
            const s = STATUS_MAP[opt]
            return (
              <button
                key={opt}
                className={`apm-status-option ${s.cls}${status === opt ? ' apm-status-option--active' : ''}`}
                onClick={() => { onChange(opt); setOpen(false) }}
              >
                {status === opt && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
                {opt}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default function ApplicantModal({ app, status, onStatusChange, onClose }) {
  const t = app.talent

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div className="apm-backdrop" onClick={onClose}>
      <div className="apm-modal" onClick={e => e.stopPropagation()}>
        <div className="apm-header">
          <div className="apm-name-row">
            <span className="apm-name">{t.name}</span>
            <span className={`apm-gender-badge apm-gender-badge--${t.gender === '여' ? 'f' : 'm'}`}>{t.gender}</span>
            <span className="apm-age">{t.age}세</span>
          </div>
          <div className="apm-header-right">
            <StatusDropdown status={status} onChange={onStatusChange} />
            <button className="apm-close" onClick={onClose}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </div>

        <div className="apm-body">
          <div className="apm-section">
            <span className="apm-section-label">기본 정보</span>
            <div className="apm-grid">
              <div className="apm-row"><span className="apm-label">직종</span><span className="apm-value">{t.jobType}</span></div>
              <div className="apm-row"><span className="apm-label">경력</span><span className="apm-value">{t.experience}</span></div>
              <div className="apm-row"><span className="apm-label">근무형태</span><span className="apm-value">{t.workType}</span></div>
              <div className="apm-row"><span className="apm-label">학력</span><span className="apm-value">{t.education}</span></div>
              <div className="apm-row"><span className="apm-label">거주지</span><span className="apm-value">{t.location}</span></div>
            </div>
          </div>

          {t.certs?.length > 0 && (
            <div className="apm-section">
              <span className="apm-section-label">자격증</span>
              <div className="apm-tag-group">
                {t.certs.map(c => <span key={c} className="apm-cert-tag">{c}</span>)}
              </div>
            </div>
          )}

          <div className="apm-section">
            <span className="apm-section-label">희망 조건</span>
            <div className="apm-grid">
              <div className="apm-row"><span className="apm-label">희망임금</span><span className="apm-value apm-wage">{t.wageType} {t.wageAmount.toLocaleString()}원</span></div>
              <div className="apm-row"><span className="apm-label">희망지역</span><span className="apm-value">{t.wishRegion}</span></div>
              <div className="apm-row"><span className="apm-label">희망요일</span><span className="apm-value">{t.wishDays?.join(', ')}</span></div>
              <div className="apm-row"><span className="apm-label">희망시간</span><span className="apm-value">{t.wishHours}</span></div>
            </div>
          </div>

          {t.workHistory?.length > 0 && (
            <div className="apm-section">
              <span className="apm-section-label">경력사항</span>
              <div className="apm-history">
                {t.workHistory.map((h, i) => (
                  <div key={i} className="apm-history-item">
                    <span className="apm-history-place">{h.place}</span>
                    <span className="apm-history-role">{h.role}</span>
                    <span className="apm-history-period">{h.period}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {t.intro && (
            <div className="apm-section">
              <span className="apm-section-label">자기소개</span>
              <p className="apm-intro">{t.intro}</p>
            </div>
          )}
        </div>

        <div className="apm-footer">
          <span className="apm-apply-date">지원일 {app.applyDate}</span>
          <Link to={`/talents/${t.id}`} className="apm-profile-btn" onClick={onClose}>
            이력서 전체 보기
          </Link>
        </div>
      </div>
    </div>
  )
}
