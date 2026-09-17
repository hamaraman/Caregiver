import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import HomeNav from './home/HomeNav'
import { fetchMyJobs, fetchApplicantsForJob, closeJob as closeJobApi, reopenJob as reopenJobApi } from '../api'
import './RecruitManagePage.css'

export default function RecruitManagePage() {
  const navigate = useNavigate()
  const [myJobs, setMyJobs] = useState([])
  const [applicantsByJob, setApplicantsByJob] = useState({})
  const [loading, setLoading] = useState(true)
  const [confirmJobId, setConfirmJobId] = useState(null)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchMyJobs()
      .then(async jobs => {
        setMyJobs(jobs)
        const entries = await Promise.all(
          jobs.map(job => fetchApplicantsForJob(job.id).then(list => [job.id, list]).catch(() => [job.id, []]))
        )
        setApplicantsByJob(Object.fromEntries(entries))
      })
      .catch(() => setMyJobs([]))
      .finally(() => setLoading(false))
  }, [])

  const isClosed = (id) => myJobs.find(j => j.id === id)?.closed ?? false

  const closeJob = async (id) => {
    try {
      const updated = await closeJobApi(id)
      setMyJobs(prev => prev.map(j => j.id === id ? updated : j))
    } catch (err) {
      alert(err.message || '마감 처리에 실패했습니다.')
    } finally {
      setConfirmJobId(null)
    }
  }

  const reopenJob = async (id) => {
    try {
      const updated = await reopenJobApi(id)
      setMyJobs(prev => prev.map(j => j.id === id ? updated : j))
    } catch (err) {
      alert(err.message || '재개 처리에 실패했습니다.')
    }
  }

  const countApplicants = (jobId) => (applicantsByJob[jobId] || []).length

  const filteredJobs = myJobs.filter((job) => {
    if (filter === 'active') return !isClosed(job.id)
    if (filter === 'closed') return isClosed(job.id)
    return true
  })

  const activeCount = myJobs.filter((j) => !isClosed(j.id)).length
  const closedCount = myJobs.filter((j) => isClosed(j.id)).length
  const totalApplicants = Object.values(applicantsByJob).flat().length

  const filterCards = [
    { key: 'all',    label: '전체',   val: myJobs.length,     unit: '개', mod: '',          valMod: '' },
    { key: 'active', label: '진행중', val: activeCount,       unit: '개', mod: '--active',   valMod: '--active' },
    { key: 'closed', label: '마감',   val: closedCount,       unit: '개', mod: '--closed',   valMod: '' },
  ]

  return (
    <>
      <HomeNav />
      <div className="rm-page">
        <div className="container">
          <div className="rm-top">
            <div>
              <h2 className="rm-title">채용 관리</h2>
              <p className="rm-subtitle">등록한 공고를 확인하고 채용 상태를 관리하세요</p>
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
              <span className="rm-summary-label">총 지원자</span>
              <span className="rm-summary-val rm-summary-val--people">
                {totalApplicants}<span className="rm-summary-unit">명</span>
              </span>
            </div>
          </div>

          {/* 공고 목록 */}
          <div className="rm-list">
            {loading && <div className="rm-empty">불러오는 중입니다...</div>}
            {!loading && filteredJobs.length === 0 && (
              <div className="rm-empty">
                {filter === 'closed' ? '마감된 공고가 없습니다.' : '공고가 없습니다.'}
              </div>
            )}
            {filteredJobs.map((job) => {
              const closed = isClosed(job.id)
              const appCnt = countApplicants(job.id)
              return (
                <div key={job.id} className={`rm-card${closed ? ' rm-card--closed' : ''}`} onClick={() => navigate(`/manage/${job.id}`)} style={{ cursor: 'pointer' }}>
                  <div className="rm-card-top">
                    <div className="rm-card-info">
                      <div className="rm-card-title-row">
                        <span className={`rm-status-badge ${closed ? 'rm-status-badge--closed' : 'rm-status-badge--active'}`}>
                          {closed ? '마감' : '진행중'}
                        </span>
                        <span className="rm-card-title">{job.type}</span>
                      </div>
                      <div className="rm-card-meta">
                        <span>{job.location}</span>
                        <span className="rm-meta-dot">·</span>
                        <span>{job.pay}</span>
                        <span className="rm-meta-dot">·</span>
                        <span>{job.time} / {job.workType}</span>
                      </div>
                      <div className="rm-card-dates">
                        <span className="rm-date-item">등록일 {job.date}</span>
                      </div>
                    </div>

                    <div className="rm-card-right">
                      <Link to={`/applicants`} className="rm-applicant-btn">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2"/>
                          <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                        지원자 {appCnt}명
                      </Link>
                    </div>
                  </div>

                  <div className="rm-card-footer" onClick={e => e.stopPropagation()}>
                    <Link to={`/job/${job.id}`} className="rm-btn rm-btn--ghost">
                      공고 보기
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
