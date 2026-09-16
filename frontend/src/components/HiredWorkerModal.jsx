import { useState, useEffect } from 'react'
import './HiredWorkerModal.css'

// 실제 서비스에서는 API로 받을 데이터 — 여기서는 mock
const MOCK_CONTACT = {
  9:  { phone: '010-3824-5917', emergency: '010-7712-3344 (배우자)' },
  11: { phone: '010-5503-8826', emergency: '010-9901-2255 (자녀)' },
}
const MOCK_START = {
  3: '2026.09.20',
  7: '2026.09.18',
}
const DEFAULT_CONTACT = { phone: '010-0000-0000', emergency: '미등록' }

export default function HiredWorkerModal({ app, job, memo, onMemoChange, onClose }) {
  const t = app.talent
  const contact = MOCK_CONTACT[t.id] ?? DEFAULT_CONTACT
  const startDate = MOCK_START[app.id] ?? '협의 예정'

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', handler)
    }
  }, [onClose])

  return (
    <div className="hwm-overlay" onClick={onClose}>
      <div className="hwm-modal" onClick={e => e.stopPropagation()}>

        {/* 헤더 */}
        <div className="hwm-header">
          <div className="hwm-header-left">
            <div className="hwm-avatar">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="8" r="4" stroke="#4A8FE7" strokeWidth="1.8"/>
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="#4A8FE7" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <div className="hwm-name-row">
                <span className="hwm-name">{t.name}</span>
                <span className={`hwm-gender hwm-gender--${t.gender === '여' ? 'f' : 'm'}`}>{t.gender}</span>
                <span className="hwm-age">{t.age}세</span>
              </div>
              <div className="hwm-sub">{t.jobType} · {t.location}</div>
            </div>
          </div>
          <div className="hwm-header-right">
            <span className="hwm-hired-chip">✓ 합격</span>
            <button className="hwm-close" onClick={onClose}>✕</button>
          </div>
        </div>

        {/* 바디 */}
        <div className="hwm-body">

          {/* 근무 정보 */}
          <section className="hwm-section">
            <h3 className="hwm-section-title">근무 정보</h3>
            <div className="hwm-grid">
              <div className="hwm-item">
                <span className="hwm-label">근무 시작일</span>
                <span className="hwm-value">{startDate}</span>
              </div>
              <div className="hwm-item">
                <span className="hwm-label">근무 일정</span>
                <span className="hwm-value">{job.days}</span>
              </div>
              <div className="hwm-item">
                <span className="hwm-label">근무 시간</span>
                <span className="hwm-value">{job.hours}</span>
              </div>
              <div className="hwm-item">
                <span className="hwm-label">근무 형태</span>
                <span className="hwm-value">{t.workType}</span>
              </div>
            </div>
          </section>

          {/* 연락처 */}
          <section className="hwm-section">
            <h3 className="hwm-section-title">연락처</h3>
            <div className="hwm-grid">
              <div className="hwm-item">
                <span className="hwm-label">전화번호</span>
                <span className="hwm-value hwm-phone">{contact.phone}</span>
              </div>
              <div className="hwm-item">
                <span className="hwm-label">비상연락처</span>
                <span className="hwm-value">{contact.emergency}</span>
              </div>
              <div className="hwm-item hwm-item--full">
                <span className="hwm-label">거주 지역</span>
                <span className="hwm-value">{t.location}</span>
              </div>
            </div>
          </section>

          {/* 계약 정보 */}
          <section className="hwm-section">
            <h3 className="hwm-section-title">계약 정보</h3>
            <div className="hwm-grid">
              <div className="hwm-item">
                <span className="hwm-label">확정 임금</span>
                <span className="hwm-value hwm-wage">{job.wage}</span>
              </div>
              <div className="hwm-item">
                <span className="hwm-label">고용 형태</span>
                <span className="hwm-value">{job.employForm}</span>
              </div>
              <div className="hwm-item">
                <span className="hwm-label">지원일</span>
                <span className="hwm-value">{app.applyDate}</span>
              </div>
              <div className="hwm-item">
                <span className="hwm-label">경력</span>
                <span className="hwm-value">{t.experience}</span>
              </div>
            </div>
          </section>

          {/* 메모 */}
          <section className="hwm-section">
            <h3 className="hwm-section-title">메모 / 특이사항</h3>
            <textarea
              className="hwm-memo"
              value={memo}
              onChange={e => onMemoChange(e.target.value)}
              placeholder="담당자 메모를 입력하세요..."
              rows={4}
            />
          </section>

        </div>

        {/* 푸터 */}
        <div className="hwm-footer">
          <button className="hwm-footer-close" onClick={onClose}>닫기</button>
        </div>

      </div>
    </div>
  )
}
