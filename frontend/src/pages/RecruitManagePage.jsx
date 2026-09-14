import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { jobs } from '../data/jobs'
import { applicants, myJobIds } from '../data/applicants'
import './RecruitManagePage.css'

export default function RecruitManagePage() {
  const navigate = useNavigate()
  const myJobs = jobs.filter((j) => myJobIds.includes(j.id))
  const [closedJobs, setClosedJobs] = useState([])
  const [confirmJobId, setConfirmJobId] = useState(null)
  const [filter, setFilter] = useState('all')

  const isClosed = (id) => closedJobs.includes(id)

  const closeJob = (id) => {
    setClosedJobs((prev) => [...prev, id])
    setConfirmJobId(null)
  }

  const reopenJob = (id) => {
    setClosedJobs((prev) => prev.filter((i) => i !== id))
  }

  const countHired = (jobId) => applicants.filter((a) => a.jobId === jobId && a.status === '합격').length

  const filteredJobs = myJobs.filter((job) => {
    if (filter === 'active') return !isClosed(job.id)
    if (filter === 'closed') return isClosed(job.id)
    return true
  })

  const activeCount = myJobs.filter((j) => !isClosed(j.id)).length
  const totalHired = applicants.filter((a) => myJobIds.includes(a.jobId) && a.status === '합격').length

  const filterCards = [
    { key: 'all',    label: '전체',   val: myJobs.length,     unit: '개', mod: '',         valMod: '' },
    { key: 'active', label: '진행중', val: activeCount,       unit: '개', mod: '--active',  valMod: '--active' },
    { key: 'closed', label: '마감',   val: closedJobs.length, unit: '개', mod: '--closed',  valMod: '' },
  ]

  return (
    <>
      <Header />
      <div className="rm-page">
        <div className="container">
          <div className="rm-top">
            <div>
              <h2 className="rm-title">채용 관리</h2>
              <p className="rm-subtitle">합격 처리한 채용 인원을 공고별로 확인하세요</p>
            </div>
            <Link to="/jobs/post" className="rm-post-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              공고 등록하기
            </Link>
          </div>

          {/* 요약 카드 */}
          <div className="rm-summary-row">
            {filterCards.map(({ key, label, val, unit, mod, valMod }) => (
              <button
                key={key}
                className={`rm-summary-card rm-summary-card-btn${mod ? ` rm-summary-card${mod}` : ''}${filter === key ? ' rm-summary-card--sel' : ''}`}
                onClick={() => setFilter(key)}
              >
                <span className="rm-summary-label">{label}</span>
                <span className={`rm-summary-val${valMod ? ` rm-summary-val${valMod}` : ''}`}>
                  {val}<span className="rm-summary-unit">{unit}</span>
                </span>
              </button>
            ))}
            <div className="rm-summary-card rm-summary-card--people">
              <span className="rm-summary-label">총 채용 인원</span>
              <span className="rm-summary-val rm-summary-val--people">
                {totalHired}<span className="rm-summary-unit">명</span>
              </span>
            </div>
          </div>

          {/* 공고 목록 */}
          <div className="rm-list">
            {filteredJobs.length === 0 && (
              <div className="rm-empty">
                {filter === 'closed' ? '마감된 공고가 없습니다.' : '공고가 없습니다.'}
              </div>
            )}
            {filteredJobs.map((job) => {
              const closed = isClosed(job.id)
              const hiredCnt = countHired(job.id)
              return (
                <div
                  key={job.id}
                  className={`rm-card${closed ? ' rm-card--closed' : ''}`}
                  onClick={() => navigate(`/manage/${job.id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="rm-card-top">
                    <div className="rm-card-info">
                      <div className="rm-card-title-row">
                        <span className={`rm-status-badge ${closed ? 'rm-status-badge--closed' : 'rm-status-badge--active'}`}>
                          {closed ? '마감' : '진행중'}
                        </span>
                        <span className="rm-card-title">{job.postTitle || job.title}</span>
                        {job.badge && (
                          <span className={`rm-badge rm-badge--${job.badgeColor ?? 'red'}`}>
                            {job.badge}
                          </span>
                        )}
                      </div>
                      <div className="rm-card-meta">
                        <span>{job.location}</span>
                        <span className="rm-meta-dot">·</span>
                        <span>{job.wage}</span>
                        <span className="rm-meta-dot">·</span>
                        <span>{job.hours} / {job.days}</span>
                      </div>
                      <div className="rm-card-dates">
                        <span className="rm-date-item">등록일 {job.date}</span>
                        <span className="rm-meta-dot">·</span>
                        <span className="rm-date-item">마감일 {job.deadline}</span>
                      </div>
                    </div>

                    <div className="rm-card-right" onClick={e => e.stopPropagation()}>
                      <div className={`rm-hired-badge${hiredCnt > 0 ? ' rm-hired-badge--has' : ''}`}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                          <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        채용 {hiredCnt}명
                      </div>
                    </div>
                  </div>

                  <div className="rm-card-footer" onClick={e => e.stopPropagation()}>
                    <Link to={`/jobs/${job.id}`} className="rm-btn rm-btn--ghost">
                      공고 보기
                    </Link>
                    <Link to={`/applicants`} className="rm-btn rm-btn--ghost">
                      지원자 확인
                    </Link>
                    {closed ? (
                      <button className="rm-btn rm-btn--reopen" onClick={() => reopenJob(job.id)}>
                        재개하기
                      </button>
                    ) : (
                      confirmJobId === job.id ? (
                        <div className="rm-confirm-row">
                          <span className="rm-confirm-text">정말 마감하시겠어요?</span>
                          <button className="rm-btn rm-btn--danger" onClick={() => closeJob(job.id)}>마감</button>
                          <button className="rm-btn rm-btn--cancel" onClick={() => setConfirmJobId(null)}>취소</button>
                        </div>
                      ) : (
                        <button className="rm-btn rm-btn--close" onClick={() => setConfirmJobId(job.id)}>
                          마감처리
                        </button>
                      )
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}
