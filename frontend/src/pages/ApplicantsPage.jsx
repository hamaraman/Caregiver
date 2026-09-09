import { useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import AuthGuard from '../components/AuthGuard'
import { jobs } from '../data/jobs'
import { talents } from '../data/talents'
import { applicants, myJobIds } from '../data/applicants'
import './ApplicantsPage.css'

const STATUS_LIST = ['검토중', '합격', '불합격']

const STATUS_STYLE = {
  '검토중': { bg: '#f0f4ff', color: '#5b8def', border: '#c2d4f8' },
  '합격':   { bg: '#e8f8e8', color: '#2a9a2a', border: '#b8e8b8' },
  '불합격': { bg: '#fef0f0', color: '#e04040', border: '#f0c0c0' },
}

export default function ApplicantsPage() {
  const myJobs = jobs.filter((j) => myJobIds.includes(j.id))
  const [selectedJobId, setSelectedJobId] = useState(myJobs[0]?.id ?? null)
  const [statusMap, setStatusMap] = useState(() => {
    const m = {}
    applicants.forEach((a) => { m[a.id] = a.status })
    return m
  })

  const currentApplicants = applicants.filter((a) => a.jobId === selectedJobId)
  const selectedJob = myJobs.find((j) => j.id === selectedJobId)

  const changeStatus = (appId, status) => {
    setStatusMap((prev) => ({ ...prev, [appId]: status }))
  }

  const countByJob = (jobId) => applicants.filter((a) => a.jobId === jobId).length

  return (
    <>
      <Header />
      <div className="ap-page">
        <div className="container">
          <div className="ap-top">
            <h2 className="ap-title">지원자 확인</h2>
            <p className="ap-subtitle">내 공고에 지원한 인재의 이력서를 확인하세요</p>
          </div>

          {/* 공고 탭 */}
          <div className="ap-job-tabs">
            {myJobs.map((job) => {
              const cnt = countByJob(job.id)
              const isActive = job.id === selectedJobId
              return (
                <button
                  key={job.id}
                  className={`ap-job-tab${isActive ? ' ap-job-tab--active' : ''}`}
                  onClick={() => setSelectedJobId(job.id)}
                >
                  <span className="ap-tab-title">{job.title}</span>
                  <span className="ap-tab-loc">{job.location}</span>
                  <span className={`ap-tab-cnt${cnt > 0 ? ' ap-tab-cnt--has' : ''}`}>
                    지원자 {cnt}명
                  </span>
                </button>
              )
            })}
          </div>

          {/* 선택된 공고 요약 */}
          {selectedJob && (
            <div className="ap-job-summary">
              <span className="ap-summary-name">{selectedJob.companyName}</span>
              <span className="ap-summary-dot">·</span>
              <span className="ap-summary-title">{selectedJob.postTitle || selectedJob.title}</span>
              <span className="ap-summary-dot">·</span>
              <span className="ap-summary-wage">{selectedJob.wage}</span>
              <Link to={`/jobs/${selectedJob.id}`} className="ap-summary-link">공고 보기</Link>
            </div>
          )}

          {/* 지원자 목록 */}
          <div className="ap-result-bar">
            <span className="ap-result-count">
              총 <strong>{currentApplicants.length}</strong>명 지원
            </span>
            <span className="ap-result-tip">* 이름을 클릭하면 상세 이력서를 확인할 수 있어요</span>
          </div>

          {currentApplicants.length === 0 ? (
            <div className="ap-empty">아직 지원자가 없어요</div>
          ) : (
            <div className="ap-list">
              {currentApplicants.map((app) => {
                const talent = talents.find((t) => t.id === app.talentId)
                if (!talent) return null
                const st = statusMap[app.id]
                const stStyle = STATUS_STYLE[st]
                return (
                  <div key={app.id} className="ap-card">
                    {/* 왼쪽: 프로필 */}
                    <div className="ap-card-left">
                      <div className="ap-avatar">
                        <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="8" r="4" stroke="#e91e8c" strokeWidth="1.8"/>
                          <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="#e91e8c" strokeWidth="1.8" strokeLinecap="round"/>
                        </svg>
                      </div>
                      <div>
                        <Link to={`/talents/${talent.id}`} className="ap-card-name">
                          {talent.name}
                          <span className={`ap-gender-badge ap-gender-badge--${talent.gender === '여' ? 'f' : 'm'}`}>
                            {talent.gender}
                          </span>
                        </Link>
                        <p className="ap-card-age">{talent.age}세 · {talent.location}</p>
                        <div className="ap-card-certs">
                          {talent.certs.map((c) => (
                            <span key={c} className="ap-cert-tag">{c}</span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* 중간: 상세정보 */}
                    <div className="ap-card-mid">
                      <div className="ap-card-row">
                        <span className="ap-card-label">직종</span>
                        <span>{talent.jobType}</span>
                      </div>
                      <div className="ap-card-row">
                        <span className="ap-card-label">경력</span>
                        <span>{talent.experience}</span>
                      </div>
                      <div className="ap-card-row">
                        <span className="ap-card-label">희망급여</span>
                        <span className="ap-wage">
                          {talent.wageType} {talent.wageAmount.toLocaleString()}원
                        </span>
                      </div>
                      <div className="ap-card-row">
                        <span className="ap-card-label">지원일</span>
                        <span>{app.applyDate}</span>
                      </div>
                    </div>

                    {/* 오른쪽: 상태 */}
                    <div className="ap-card-right">
                      <div
                        className="ap-status-badge"
                        style={{ background: stStyle.bg, color: stStyle.color, border: `1px solid ${stStyle.border}` }}
                      >
                        {st}
                      </div>
                      <div className="ap-status-btns">
                        {STATUS_LIST.filter((s) => s !== st).map((s) => (
                          <button
                            key={s}
                            className="ap-status-change-btn"
                            onClick={() => changeStatus(app.id, s)}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                      <Link to={`/talents/${talent.id}`} className="ap-resume-btn">
                        이력서 보기
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
