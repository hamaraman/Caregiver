import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import HomeNav from './home/HomeNav'
import AuthGuard from '../components/AuthGuard'
import { fetchMyJobs, fetchApplicantsForJob, updateApplicationStatus, fetchApplicantResume } from '../api'
import './ApplicantsPage.css'

const STATUS_LIST = ['검토중', '합격', '불합격']

const STATUS_STYLE = {
  '검토중': { bg: '#f0f4ff', color: '#5b8def', border: '#c2d4f8' },
  '합격':   { bg: '#e8f8e8', color: '#2a9a2a', border: '#b8e8b8' },
  '불합격': { bg: '#fef0f0', color: '#e04040', border: '#f0c0c0' },
}

function ResumePanel({ applicantId }) {
  const [resume, setResume] = useState(undefined)

  useEffect(() => {
    fetchApplicantResume(applicantId).then(setResume)
  }, [applicantId])

  if (resume === undefined) return <div className="ap-resume-panel">이력서를 불러오는 중입니다...</div>
  if (!resume) return <div className="ap-resume-panel">등록된 이력서가 없습니다.</div>

  return (
    <div className="ap-resume-panel">
      <div className="ap-card-row"><span className="ap-card-label">연락처</span><span>{resume.phone || '-'}</span></div>
      <div className="ap-card-row"><span className="ap-card-label">생년월일</span><span>{resume.birth || '-'}</span></div>
      <div className="ap-card-row"><span className="ap-card-label">거주지역</span><span>{resume.region || '-'}</span></div>
      <div className="ap-card-row"><span className="ap-card-label">희망근무지</span><span>{resume.workRegion || '-'}</span></div>
      <div className="ap-card-row"><span className="ap-card-label">희망근무형태</span><span>{(resume.workTypes || []).join(', ') || '-'}</span></div>
      <div className="ap-card-row"><span className="ap-card-label">희망급여</span><span>{resume.salary || '-'}</span></div>
      <div className="ap-card-row"><span className="ap-card-label">자격증</span><span>{resume.cert || '-'}</span></div>
      <div className="ap-card-row"><span className="ap-card-label">경력</span><span>{resume.expPeriod || '-'}</span></div>
      {resume.intro && <p className="ap-card-intro">{resume.intro}</p>}
    </div>
  )
}

export default function ApplicantsPage() {
  const [myJobs, setMyJobs] = useState([])
  const [applicantsByJob, setApplicantsByJob] = useState({})
  const [loading, setLoading] = useState(true)
  const [selectedJobId, setSelectedJobId] = useState(null)
  const [expandedAppId, setExpandedAppId] = useState(null)

  useEffect(() => {
    fetchMyJobs()
      .then(async jobs => {
        setMyJobs(jobs)
        setSelectedJobId(jobs[0]?.id ?? null)
        const entries = await Promise.all(
          jobs.map(job => fetchApplicantsForJob(job.id).then(list => [job.id, list]).catch(() => [job.id, []]))
        )
        setApplicantsByJob(Object.fromEntries(entries))
      })
      .catch(() => setMyJobs([]))
      .finally(() => setLoading(false))
  }, [])

  const currentApplicants = applicantsByJob[selectedJobId] || []
  const selectedJob = myJobs.find((j) => j.id === selectedJobId)

  const changeStatus = async (appId, status) => {
    try {
      await updateApplicationStatus(appId, status)
      setApplicantsByJob(prev => ({
        ...prev,
        [selectedJobId]: (prev[selectedJobId] || []).map(a => a.id === appId ? { ...a, status } : a),
      }))
    } catch {
      // 무시
    }
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

          {loading && <div className="ap-empty">불러오는 중입니다...</div>}
          {!loading && myJobs.length === 0 && <div className="ap-empty">등록한 공고가 없습니다.</div>}

          {myJobs.length > 0 && (
            <>
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
                      <span className="ap-tab-title">{job.type}</span>
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
                  <span className="ap-summary-name">{selectedJob.facility}</span>
                  <span className="ap-summary-dot">·</span>
                  <span className="ap-summary-title">{selectedJob.type}</span>
                  <span className="ap-summary-dot">·</span>
                  <span className="ap-summary-wage">{selectedJob.pay}</span>
                  <Link to={`/job/${selectedJob.id}`} className="ap-summary-link">공고 보기</Link>
                </div>
              )}

              {/* 지원자 목록 */}
              <div className="ap-result-bar">
                <span className="ap-result-count">
                  총 <strong>{currentApplicants.length}</strong>명 지원
                </span>
                <span className="ap-result-tip">* 이력서 보기를 클릭하면 상세 정보를 확인할 수 있어요</span>
              </div>

              {currentApplicants.length === 0 ? (
                <div className="ap-empty">아직 지원자가 없어요</div>
              ) : (
                <div className="ap-list">
                  {currentApplicants.map((app) => {
                    const stStyle = STATUS_STYLE[app.status] || {}
                    const expanded = expandedAppId === app.id
                    return (
                      <div key={app.id} className="ap-card">
                        <div className="ap-card-top-row">
                          {/* 왼쪽: 프로필 */}
                          <div className="ap-card-left">
                            <div className="ap-avatar">
                              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                                <circle cx="12" cy="8" r="4" stroke="#5b8def" strokeWidth="1.8"/>
                                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="#5b8def" strokeWidth="1.8" strokeLinecap="round"/>
                              </svg>
                            </div>
                            <div>
                              <span className="ap-card-name">{app.applicantName || '지원자'}</span>
                              <p className="ap-card-age">{app.applicantEmail}</p>
                            </div>
                          </div>

                          {/* 중간: 지원일 */}
                          <div className="ap-card-mid">
                            <div className="ap-card-row">
                              <span className="ap-card-label">지원일</span>
                              <span>{app.appliedAt}</span>
                            </div>
                          </div>

                          {/* 오른쪽: 상태 */}
                          <div className="ap-card-right">
                            <div
                              className="ap-status-badge"
                              style={{ background: stStyle.bg, color: stStyle.color, border: `1px solid ${stStyle.border}` }}
                            >
                              {app.status}
                            </div>
                            <div className="ap-status-btns">
                              {STATUS_LIST.filter((s) => s !== app.status).map((s) => (
                                <button
                                  key={s}
                                  className="ap-status-change-btn"
                                  onClick={() => changeStatus(app.id, s)}
                                >
                                  {s}
                                </button>
                              ))}
                            </div>
                            <button
                              className="ap-resume-btn"
                              onClick={() => setExpandedAppId(expanded ? null : app.id)}
                            >
                              {expanded ? '이력서 닫기' : '이력서 보기'}
                            </button>
                          </div>
                        </div>

                        {expanded && <ResumePanel applicantId={app.applicantId} />}
                      </div>
                    )
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  )
}
