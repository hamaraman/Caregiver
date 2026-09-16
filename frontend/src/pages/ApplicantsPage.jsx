import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import HomeNav from './home/HomeNav'
import AuthGuard from '../components/AuthGuard'
import { fetchMyJobs, fetchApplicantsForJob, updateApplicationStatus, fetchApplicantResume } from '../api'
import './ApplicantsPage.css'

const STATUS_LIST = ['검토중', '합격', '불합격']

const MOCK_JOBS = [
  { id: 1, type: '요양보호사', location: '서울 강남구', facility: '행복요양원', pay: '시급 12,000원' },
  { id: 2, type: '간병인', location: '경기 수원시', facility: '수원방문요양센터', pay: '시급 11,500원' },
  { id: 3, type: '사회복지사', location: '부산 해운대구', facility: '해운대복지관', pay: '월급 2,800,000원' },
]
const MOCK_APPLICANTS = {
  1: [
    { id: 1, applicantId: 101, applicantName: '김미영', applicantEmail: 'kim@example.com', appliedAt: '09.10', status: '검토중' },
    { id: 2, applicantId: 102, applicantName: '이순자', applicantEmail: 'lee@example.com', appliedAt: '09.11', status: '합격' },
    { id: 3, applicantId: 103, applicantName: '박경희', applicantEmail: 'park@example.com', appliedAt: '09.12', status: '불합격' },
  ],
  2: [
    { id: 4, applicantId: 104, applicantName: '최영숙', applicantEmail: 'choi@example.com', appliedAt: '09.13', status: '검토중' },
    { id: 5, applicantId: 105, applicantName: '정명자', applicantEmail: 'jung@example.com', appliedAt: '09.14', status: '검토중' },
  ],
  3: [],
}
const MOCK_RESUMES = {
  101: { phone: '010-1234-5678', birth: '1975-03-12', region: '서울 강남구', workRegion: '서울 강남·서초', workTypes: ['출·퇴근형'], salary: '시급 12,000원', cert: '요양보호사 1급', expPeriod: '3년 2개월', intro: '성실하고 책임감 있는 요양보호사입니다.' },
  102: { phone: '010-2345-6789', birth: '1968-07-22', region: '서울 서초구', workRegion: '서울 강남·서초·송파', workTypes: ['출·퇴근형', '입주형'], salary: '시급 11,500원', cert: '요양보호사 1급', expPeriod: '8년 5개월', intro: '오랜 경력을 바탕으로 어르신을 정성껏 돌봅니다.' },
  103: { phone: '010-3456-7890', birth: '1982-11-05', region: '서울 송파구', workRegion: '서울 전체', workTypes: ['출·퇴근형'], salary: '협의', cert: '요양보호사 2급', expPeriod: '신입', intro: '' },
  104: { phone: '010-4567-8901', birth: '1970-01-30', region: '경기 수원시', workRegion: '경기 수원·화성', workTypes: ['출·퇴근형'], salary: '시급 11,000원', cert: '요양보호사 1급', expPeriod: '5년', intro: '' },
  105: { phone: '010-5678-9012', birth: '1965-09-15', region: '경기 용인시', workRegion: '경기 전체', workTypes: ['입주형'], salary: '협의', cert: '간호조무사', expPeriod: '12년', intro: '요양병원 근무 경험이 있습니다.' },
}

const STATUS_STYLE = {
  '검토중': { bg: '#f0f4ff', color: '#5b8def', border: '#c2d4f8' },
  '합격':   { bg: '#e8f8e8', color: '#2a9a2a', border: '#b8e8b8' },
  '불합격': { bg: '#fef0f0', color: '#e04040', border: '#f0c0c0' },
}

function ResumePanel({ applicantId, mockResume }) {
  const [resume, setResume] = useState(mockResume !== undefined ? mockResume : undefined)

  useEffect(() => {
    if (mockResume !== undefined) return
    fetchApplicantResume(applicantId).then(setResume)
  }, [applicantId, mockResume])

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
    setMyJobs(MOCK_JOBS)
    setSelectedJobId(MOCK_JOBS[0].id)
    setApplicantsByJob(MOCK_APPLICANTS)
    setLoading(false)
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

                        {expanded && <ResumePanel applicantId={app.applicantId} mockResume={MOCK_RESUMES[app.applicantId]} />}
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
