import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import HomeNav from './home/HomeNav'
import ApplicantModal from '../components/ApplicantModal'
import { updateApplicationStatus } from '../api'
import { MOCK_JOBS, MOCK_APPLICANTS, MOCK_RESUMES } from '../data/mockManage'
import './ApplicantsPage.css'

const STATUS_STYLE = {
  '검토중': { bg: '#f0f4ff', color: '#5b8def', border: '#c2d4f8' },
  '합격':   { bg: '#e8f8e8', color: '#2a9a2a', border: '#b8e8b8' },
  '불합격': { bg: '#fef0f0', color: '#e04040', border: '#f0c0c0' },
}

const maskName = (name) => {
  if (!name || name.length < 2) return name
  return name[0] + '**'
}

function deriveAge(birth) {
  const m = /^(\d{4})/.exec(birth || '')
  if (!m) return null
  return new Date().getFullYear() - Number(m[1]) + 1
}

export default function ApplicantsPage() {
  const [myJobs] = useState(MOCK_JOBS)
  const [applicantsByJob, setApplicantsByJob] = useState(MOCK_APPLICANTS)
  const [selectedJobId, setSelectedJobId] = useState(MOCK_JOBS[0].id)
  const [modalApp, setModalApp] = useState(null)
  const navigate = useNavigate()

  const currentApplicants = applicantsByJob[selectedJobId] || []
  const selectedJob = myJobs.find((j) => j.id === selectedJobId)

  const changeStatus = (appId, status) => {
    setApplicantsByJob(prev => ({
      ...prev,
      [selectedJobId]: (prev[selectedJobId] || []).map(a => a.id === appId ? { ...a, status } : a),
    }))
    if (modalApp?.id === appId) {
      setModalApp(prev => ({ ...prev, status }))
    }
    updateApplicationStatus(appId, status).catch(() => {})
  }

  const openModal = (app) => {
    const resume = MOCK_RESUMES[app.applicantId]
    setModalApp({
      id: app.id,
      applicantName: app.applicantName,
      appliedAt: app.appliedAt,
      status: app.status,
      talent: resume ?? {},
    })
  }

  const countByJob = (jobId) => (applicantsByJob[jobId] || []).length

  return (
    <>
      <HomeNav />
      <div className="ap-page">
        <div className="container">
          <div className="ap-top">
            <h2 className="ap-title">지원자 확인</h2>
            <p className="ap-subtitle">내 공고에 지원한 인재의 이력서를 확인하세요</p>
          </div>

          {/* 공고 탭 — 클릭 시 공고요약 페이지로 이동 */}
          <div className="ap-job-tabs">
            {myJobs.map((job) => {
              const cnt = countByJob(job.id)
              return (
                <button
                  key={job.id}
                  className={`ap-job-tab${job.id === selectedJobId ? ' ap-job-tab--active' : ''}`}
                  onClick={() => setSelectedJobId(job.id)}
                >
                  <span className="ap-tab-title">{job.type}</span>
                  <span className="ap-tab-loc">{job.location}</span>
                  <span className={`ap-tab-cnt${cnt > 0 ? ' ap-tab-cnt--has' : ''}`}>
                    지원자 {cnt}명
                  </span>
                </button>
              )
            })}
          </div>

          {/* 공고 요약 바 — 클릭 시 상세 페이지 이동 */}
          {selectedJob && (
            <div
              className="ap-job-summary"
              onClick={() => navigate(`/applicants/${selectedJob.id}`)}
              style={{ cursor: 'pointer' }}
            >
              <span className="ap-summary-name">{selectedJob.facility}</span>
              <span className="ap-summary-dot">·</span>
              <span className="ap-summary-title">{selectedJob.title || selectedJob.type}</span>
              <span className="ap-summary-dot">·</span>
              <span className="ap-summary-wage">{selectedJob.pay}</span>
              <Link
                to={`/job/${selectedJob.id}`}
                className="ap-summary-link"
                onClick={e => e.stopPropagation()}
              >공고 보기</Link>
            </div>
          )}

          {/* 결과 바 */}
          <div className="ap-result-bar">
            <span className="ap-result-count">
              총 <strong>{currentApplicants.length}</strong>명 지원
            </span>
            <span className="ap-result-tip">* 이름 또는 이력서 버튼을 클릭하면 이력서를 확인할 수 있어요</span>
          </div>

          {currentApplicants.length === 0 ? (
            <div className="ap-empty">아직 지원자가 없어요</div>
          ) : (
            <div className="ap-list">
              {currentApplicants.map((app) => {
                const resume = MOCK_RESUMES[app.applicantId]
                const stStyle = STATUS_STYLE[app.status] || {}
                return (
                  <div
                    key={app.id}
                    className="ap-card"
                    onClick={() => openModal(app)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="ap-card-top-row">

                      {/* 아바타 */}
                      <div className={`ap-avatar ap-avatar--${resume?.gender === '여' ? 'f' : 'm'}`}>
                        <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="8" r="4" stroke="#5b8def" strokeWidth="1.8"/>
                          <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="#5b8def" strokeWidth="1.8" strokeLinecap="round"/>
                        </svg>
                      </div>

                      {/* 프로필 */}
                      <div className="ap-card-profile">
                        <div className="ap-card-name-row">
                          <button
                            className="ap-card-name"
                            onClick={(e) => { e.stopPropagation(); openModal(app) }}
                          >
                            {maskName(app.applicantName)}
                          </button>
                          {resume?.gender && (
                            <span className={`ap-gender-badge ap-gender-badge--${resume.gender === '여' ? 'f' : 'm'}`}>{resume.gender}</span>
                          )}
                        </div>
                        <p className="ap-card-age">
                          {resume ? `${deriveAge(resume.birth) ?? '-'}세 · ${resume.region || '-'}` : ' '}
                        </p>
                        <div className="ap-card-certs">
                          {resume?.cert && <span className="ap-cert-tag">{resume.cert}</span>}
                        </div>
                      </div>

                      {/* 지원 정보 그리드 */}
                      <div className="ap-card-mid">
                        <span className="ap-card-label">근무형태</span>
                        <span>{resume ? ((resume.workTypes || []).join(', ') || '-') : '-'}</span>
                        <span className="ap-card-label">경력</span>
                        <span>{resume ? (resume.isNew ? '신입' : (resume.expPeriod || '-')) : '-'}</span>
                        <span className="ap-card-label">희망급여</span>
                        <span className="ap-wage">{resume?.salary || '-'}</span>
                        <span className="ap-card-label">지원일</span>
                        <span>{app.appliedAt}</span>
                      </div>

                      {/* 상태 및 액션 */}
                      <div className="ap-card-right">
                        <div
                          className="ap-status-badge"
                          style={{ background: stStyle.bg, color: stStyle.color, border: `1px solid ${stStyle.border}` }}
                        >
                          {app.status}
                        </div>
                        <button
                          className="ap-resume-btn"
                          onClick={(e) => { e.stopPropagation(); openModal(app) }}
                        >
                          이력서 보기
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* 이력서 모달 */}
      {modalApp && (
        <ApplicantModal
          app={modalApp}
          status={modalApp.status}
          onStatusChange={(status) => changeStatus(modalApp.id, status)}
          onClose={() => setModalApp(null)}
        />
      )}
    </>
  )
}
