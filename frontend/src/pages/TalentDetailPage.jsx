import { useParams, useNavigate, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { fetchJobSeeker } from '../api'
import { isLikedTalent, toggleLikedTalent } from '../hooks/useJobStorage'
import HomeNav from './home/HomeNav'
import './TalentDetailPage.css'

export default function TalentDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [talent, setTalent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [contactVisible, setContactVisible] = useState(false)
  const [liked, setLiked] = useState(() => isLikedTalent(id))

  useEffect(() => {
    setLoading(true)
    fetchJobSeeker(id)
      .then(setTalent)
      .catch(() => setTalent(null))
      .finally(() => setLoading(false))
    setLiked(isLikedTalent(id))
  }, [id])

  const handleLike = () => {
    const next = toggleLikedTalent(id)
    setLiked(next)
  }

  if (loading) {
    return (
      <>
        <HomeNav />
        <div className="td-page"><div className="td-inner"><p className="td-placeholder">인재 정보를 불러오는 중입니다...</p></div></div>
      </>
    )
  }

  if (!talent) {
    return (
      <>
        <HomeNav />
        <div className="td-page"><div className="td-inner"><p className="td-placeholder">인재 정보를 찾을 수 없습니다.</p></div></div>
      </>
    )
  }

  return (
    <>
      <HomeNav />
      <div className="td-page">
        <div className="td-inner">

          <button className="td-back" onClick={() => navigate(-1)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
            목록으로
          </button>

          {/* 프로필 헤더 카드 */}
          <div className="td-header-card">
            <div className="td-header-top">
              <span className="td-status-badge">구직중</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {talent.date && <span className="td-registered">{talent.date} 등록</span>}
                <button className={`td-like-btn${liked ? ' td-like-btn--active' : ''}`} onClick={handleLike} aria-label={liked ? '관심 인재 해제' : '관심 인재 등록'}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill={liked ? '#e04444' : 'none'} stroke={liked ? '#e04444' : '#bbb'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                </button>
              </div>
            </div>

            <div className="td-profile">
              <div className={`td-avatar td-avatar--${talent.gender === '여' ? 'f' : 'm'}`}>
                <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke={talent.gender === '여' ? '#4A8FE7' : '#5b8def'} strokeWidth="1.5">
                  <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                </svg>
              </div>

              <div className="td-profile-main">
                <div className="td-name-row">
                  <h1 className="td-name">{talent.name}</h1>
                  <span className={`td-gender-badge td-gender-badge--${talent.gender === '여' ? 'f' : 'm'}`}>{talent.gender}</span>
                  <span className="td-age">{talent.age}세</span>
                </div>
                <div className="td-location">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2" strokeLinecap="round">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/>
                  </svg>
                  {talent.location}
                </div>
                <div className="td-cert-tags">
                  {talent.certs.map(c => <span key={c} className="td-cert-tag">{c}</span>)}
                </div>
              </div>

              <div className="td-wage-block">
                <div className="td-wage-label">희망 급여</div>
                <div className="td-wage-value">{talent.wageLabel}</div>
                <div className="td-worktype">{talent.workType}</div>
              </div>
            </div>
          </div>

          <div className="td-layout">
            <div className="td-main">

              {/* 기본 정보 */}
              <section className="td-card">
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

              {/* 자격증 및 근무 이력 */}
              <section className="td-card">
                <h2 className="td-section-title">자격증 및 경력</h2>
                <div className="td-cert-list">
                  {talent.certs.map(c => (
                    <div key={c} className="td-cert-item">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4A8FE7" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                      {c}
                    </div>
                  ))}
                </div>
                {talent.workHistory.length > 0 && (
                  <>
                    <div className="td-sub-label">근무 이력</div>
                    <div className="td-history">
                      {talent.workHistory.map((h, i) => (
                        <div key={i} className="td-history-item">
                          <div className="td-history-dot" />
                          <div>
                            <div className="td-history-place">{h.place}</div>
                            <div className="td-history-detail">{h.role} · {h.period}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </section>

              {/* 희망 근무 조건 */}
              <section className="td-card">
                <h2 className="td-section-title">희망 근무 조건</h2>
                <div className="td-grid">
                  <div className="td-item"><span className="td-label">근무 형태</span><span className="td-value">{talent.workType}</span></div>
                  <div className="td-item"><span className="td-label">희망 급여</span><span className="td-value td-value--wage">{talent.wageLabel}</span></div>
                  <div className="td-item td-item--full"><span className="td-label">희망 지역</span><span className="td-value">{talent.wishRegion}</span></div>
                  <div className="td-item"><span className="td-label">희망 요일</span><span className="td-value">{talent.wishDays.join(' · ')}</span></div>
                  <div className="td-item"><span className="td-label">희망 시간</span><span className="td-value">{talent.wishHours}</span></div>
                </div>
              </section>

              {/* 자기소개 */}
              <section className="td-card">
                <h2 className="td-section-title">자기소개</h2>
                <p className="td-intro">{talent.intro}</p>
              </section>

            </div>

            {/* 사이드바: 연락처 */}
            <aside className="td-sidebar">
              <div className="td-contact-card">
                <div className="td-contact-title">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.18 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 6.13 6.13l1.17-1.17a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                  연락처
                </div>
                {contactVisible
                  ? <div className="td-contact-revealed">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#4A8FE7" strokeWidth="2" strokeLinecap="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.18 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 6.13 6.13l1.17-1.17a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                      </svg>
                      {talent.phone || '연락처가 등록되지 않았습니다.'}
                    </div>
                  : <>
                      <p className="td-contact-desc">연락처를 확인하려면 아래 버튼을 눌러주세요.</p>
                      <button className="td-contact-btn" onClick={() => setContactVisible(true)}>연락처 확인하기</button>
                    </>
                }
              </div>

              <Link to={`/talents?q=${encodeURIComponent(talent.jobType)}`} className="td-similar-card">
                <div className="td-similar-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4A8FE7" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                </div>
                <div className="td-similar-text">비슷한 인재 보기</div>
                <div className="td-similar-sub">{talent.jobType} · {talent.experience}</div>
                <svg className="td-similar-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4A8FE7" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
              </Link>

              <div className="td-summary-card">
                <div className="td-summary-title">인재 요약</div>
                <div className="td-summary-row">
                  <span className="td-summary-label">직종</span>
                  <span className="td-summary-value">{talent.jobType}</span>
                </div>
                <div className="td-summary-row">
                  <span className="td-summary-label">경력</span>
                  <span className="td-summary-value td-summary-value--point">{talent.experience}</span>
                </div>
                <div className="td-summary-row">
                  <span className="td-summary-label">희망급여</span>
                  <span className="td-summary-value td-summary-value--wage">{talent.wageLabel}</span>
                </div>
                <div className="td-summary-row">
                  <span className="td-summary-label">근무형태</span>
                  <span className="td-summary-value">{talent.workType}</span>
                </div>
              </div>

            </aside>
          </div>

        </div>
      </div>
    </>
  )
}
