import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import ApplicantModal, { StatusDropdown } from '../components/ApplicantModal'
import { jobs } from '../data/jobs'
import { talents } from '../data/talents'
import { applicants, myJobIds } from '../data/applicants'
import './ApplicantsPage.css'

export default function ApplicantsPage() {
  const navigate = useNavigate()
  const myJobs = jobs.filter((j) => myJobIds.includes(j.id))
  const [selectedJobId, setSelectedJobId] = useState(myJobs[0]?.id ?? null)
  const [statusMap, setStatusMap] = useState(() => {
    const m = {}
    applicants.forEach((a) => { m[a.id] = a.status })
    return m
  })
  const [selectedAppId, setSelectedAppId] = useState(null)

  const currentApplicants = applicants.filter((a) => a.jobId === selectedJobId)
  const selectedJob = myJobs.find((j) => j.id === selectedJobId)

  const changeStatus = (appId, status) => {
    setStatusMap((prev) => ({ ...prev, [appId]: status }))
  }

  const countByJob = (jobId) => applicants.filter((a) => a.jobId === jobId).length

  const selectedApp = selectedAppId
    ? (() => {
        const a = applicants.find(ap => ap.id === selectedAppId)
        if (!a) return null
        const talent = talents.find(t => t.id === a.talentId)
        return talent ? { ...a, talent } : null
      })()
    : null

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
                  onClick={() => navigate(`/applicants/${job.id}`)}
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
          </div>

          {currentApplicants.length === 0 ? (
            <div className="ap-empty">아직 지원자가 없어요</div>
          ) : (
            <div className="ap-list">
              {currentApplicants.map((app) => {
                const talent = talents.find((t) => t.id === app.talentId)
                if (!talent) return null
                const st = statusMap[app.id]
                return (
                  <div
                    key={app.id}
                    className="ap-card"
                    onClick={() => setSelectedAppId(app.id)}
                  >
                    {/* 왼쪽: 프로필 */}
                    <div className="ap-card-left">
                      <div className="ap-avatar">
                        <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="8" r="4" stroke="#4A8FE7" strokeWidth="1.8"/>
                          <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="#4A8FE7" strokeWidth="1.8" strokeLinecap="round"/>
                        </svg>
                      </div>
                      <div>
                        <div className="ap-card-name" onClick={e => e.stopPropagation()}>
                          {talent.name}
                          <span className={`ap-gender-badge ap-gender-badge--${talent.gender === '여' ? 'f' : 'm'}`}>
                            {talent.gender}
                          </span>
                        </div>
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
                    <div className="ap-card-right" onClick={e => e.stopPropagation()}>
                      <StatusDropdown
                        status={st}
                        onChange={newStatus => changeStatus(app.id, newStatus)}
                      />
                      <Link to={`/talents/${talent.id}`} className="ap-resume-btn" onClick={e => e.stopPropagation()}>
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

      {selectedApp && (
        <ApplicantModal
          app={selectedApp}
          status={statusMap[selectedApp.id] ?? selectedApp.status}
          onStatusChange={newStatus => changeStatus(selectedApp.id, newStatus)}
          onClose={() => setSelectedAppId(null)}
        />
      )}
    </>
  )
}
