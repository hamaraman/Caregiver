import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { talents } from '../data/talents'
import Header from '../components/Header'
import './TalentDetailPage.css'

export default function TalentDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const talent = talents.find(t => t.id === Number(id))
  const [contactVisible, setContactVisible] = useState(false)

  if (!talent) {
    return (
      <>
        <Header />
        <div className="td-not-found">인재 정보를 찾을 수 없습니다.</div>
      </>
    )
  }

  return (
    <>
      <Header />
      <div className="td-page">
        <div className="container">

          {/* 히어로 */}
          <div className="td-hero">
            <div className="td-hero-top">
              <button className="td-back" onClick={() => navigate(-1)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
                목록으로
              </button>
              <span className="td-status-badge">구직중</span>
            </div>

            <div className="td-profile">
              <div className="td-avatar">
                {talent.gender === '여'
                  ? <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#e91e8c" strokeWidth="1.5"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
                  : <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#5b8def" strokeWidth="1.5"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
                }
              </div>
              <div className="td-profile-info">
                <div className="td-name-row">
                  <h1 className="td-name">{talent.name}</h1>
                  <span className={`td-gender-badge td-gender-badge--${talent.gender === '여' ? 'f' : 'm'}`}>{talent.gender}</span>
                  <span className="td-age">{talent.age}세</span>
                </div>
                <div className="td-location">{talent.location}</div>
                <div className="td-certs">
                  {talent.certs.map(c => <span key={c} className="td-cert-tag">{c}</span>)}
                </div>
              </div>
              <div className="td-hero-right">
                <div className="td-wish-wage">
                  희망 {talent.wageType} <strong>{talent.wageAmount.toLocaleString()}원</strong>
                </div>
                <div className="td-registered">{talent.date} 등록</div>
              </div>
            </div>
          </div>

          <div className="td-body">
            {/* 기본 정보 */}
            <section className="td-section">
              <h2 className="td-section-title">기본 정보</h2>
              <div className="td-grid">
                <div className="td-item"><span className="td-label">성별</span><span className="td-value">{talent.gender}</span></div>
                <div className="td-item"><span className="td-label">나이</span><span className="td-value">만 {talent.age}세</span></div>
                <div className="td-item"><span className="td-label">지역</span><span className="td-value">{talent.location}</span></div>
                <div className="td-item"><span className="td-label">학력</span><span className="td-value">{talent.education}</span></div>
                <div className="td-item"><span className="td-label">직종</span><span className="td-value">{talent.jobType}</span></div>
                <div className="td-item"><span className="td-label">경력</span><span className="td-value td-value--point">{talent.experience}</span></div>
              </div>
            </section>

            {/* 자격증 및 경력 */}
            <section className="td-section">
              <h2 className="td-section-title">자격증 및 경력</h2>
              <div className="td-certs-list">
                {talent.certs.map(c => (
                  <div key={c} className="td-cert-item">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#e91e8c" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                    {c}
                  </div>
                ))}
              </div>
              {talent.workHistory.length > 0 && (
                <div className="td-history">
                  <h3 className="td-sub-title">근무 이력</h3>
                  {talent.workHistory.map((h, i) => (
                    <div key={i} className="td-history-item">
                      <div className="td-history-dot" />
                      <div className="td-history-content">
                        <div className="td-history-place">{h.place}</div>
                        <div className="td-history-detail">{h.role} · {h.period}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* 희망 근무 조건 */}
            <section className="td-section">
              <h2 className="td-section-title">희망 근무 조건</h2>
              <div className="td-grid">
                <div className="td-item"><span className="td-label">근무 형태</span><span className="td-value">{talent.workType}</span></div>
                <div className="td-item"><span className="td-label">희망 급여</span><span className="td-value td-value--wage">{talent.wageType} {talent.wageAmount.toLocaleString()}원</span></div>
                <div className="td-item td-item--full"><span className="td-label">희망 지역</span><span className="td-value">{talent.wishRegion}</span></div>
                <div className="td-item"><span className="td-label">희망 요일</span><span className="td-value">{talent.wishDays.join(' · ')}</span></div>
                <div className="td-item"><span className="td-label">희망 시간</span><span className="td-value">{talent.wishHours}</span></div>
              </div>
            </section>

            {/* 자기소개 */}
            <section className="td-section">
              <h2 className="td-section-title">자기소개</h2>
              <p className="td-intro">{talent.intro}</p>
            </section>

            {/* 연락처 */}
            <section className="td-section">
              <h2 className="td-section-title">연락처</h2>
              {contactVisible
                ? <div className="td-contact-info">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#e91e8c" strokeWidth="2" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.18 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 6.13 6.13l1.17-1.17a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                    로그인 후 확인 가능합니다.
                  </div>
                : <button className="td-contact-btn" onClick={() => setContactVisible(true)}>
                    연락처 확인하기
                  </button>
              }
            </section>
          </div>

        </div>
      </div>
    </>
  )
}
