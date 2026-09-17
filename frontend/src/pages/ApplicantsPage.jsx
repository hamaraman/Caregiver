import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import HomeNav from './home/HomeNav'
import ApplicantModal from '../components/ApplicantModal'
import { updateApplicationStatus } from '../api'
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

const MOCK_JOBS = [
  { id: 1, type: '요양보호사 (주간)', location: '서울 강남구', facility: '강남재가복지센터', title: '강남구 요양보호사 급구 (주간)', pay: '시급 14,000원' },
  { id: 2, type: '요양보호사 (주간)', location: '부산 해운대구', facility: '해운대복지관', title: '해운대구 요양보호사 모집', pay: '시급 13,000원' },
  { id: 3, type: '요양보호사 (야간)', location: '대전 서구', facility: '대전요양원', title: '대전 서구 요양보호사 채용', pay: '시급 15,000원' },
  { id: 4, type: '요양보호사 (주간)', location: '서울 서초구', facility: '서초복지센터', title: '서초구 요양보호사 (주간)', pay: '시급 13,500원' },
]

const MOCK_APPLICANTS = {
  1: [
    { id: 1, applicantId: 101, applicantName: '김미영', status: '검토중', appliedAt: '09.06', jobId: 1 },
    { id: 2, applicantId: 102, applicantName: '최순자', status: '검토중', appliedAt: '09.06', jobId: 1 },
    { id: 3, applicantId: 103, applicantName: '장명희', status: '합격',   appliedAt: '09.05', jobId: 1 },
    { id: 4, applicantId: 104, applicantName: '이경숙', status: '불합격', appliedAt: '09.04', jobId: 1 },
  ],
  2: [
    { id: 5, applicantId: 105, applicantName: '박영희', status: '검토중', appliedAt: '09.07', jobId: 2 },
    { id: 6, applicantId: 106, applicantName: '정순영', status: '검토중', appliedAt: '09.08', jobId: 2 },
    { id: 7, applicantId: 107, applicantName: '강미숙', status: '검토중', appliedAt: '09.07', jobId: 2 },
  ],
  3: [
    { id: 8, applicantId: 108, applicantName: '윤선미', status: '검토중', appliedAt: '09.09', jobId: 3 },
    { id: 9, applicantId: 109, applicantName: '임정숙', status: '합격',   appliedAt: '09.08', jobId: 3 },
  ],
  4: [],
}

const MOCK_RESUMES = {
  101: { id: 101, gender: '여', birth: '1976-03-12', phone: '010-1234-5678', region: '경기 성남시', workRegion: '서울 강남·서초', workTypes: ['출·퇴근형'], salary: '시급 13,500원', cert: '요양보호사 1급', isNew: false, expPeriod: '3년 이상', intro: '성실하고 책임감 있는 요양보호사입니다.' },
  102: { id: 102, gender: '여', birth: '1964-07-22', phone: '010-2345-6789', region: '서울 송파구', workRegion: '서울 강남·서초·송파', workTypes: ['출·퇴근형', '입주형'], salary: '시급 15,000원', cert: '요양보호사 1급', isNew: false, expPeriod: '10년 이상', intro: '오랜 경력을 바탕으로 어르신을 정성껏 돌봅니다.' },
  103: { id: 103, gender: '여', birth: '1974-11-05', phone: '010-3456-7890', region: '서울 마포구', workRegion: '서울 전체', workTypes: ['출·퇴근형'], salary: '시급 13,500원', cert: '요양보호사 1급', isNew: false, expPeriod: '4년 이상', intro: '' },
  104: { id: 104, gender: '여', birth: '1969-01-30', phone: '010-4567-8901', region: '서울 강동구', workRegion: '서울 동부', workTypes: ['출·퇴근형'], salary: '시급 12,000원', cert: '요양보호사 1급', isNew: true, expPeriod: null, intro: '' },
  105: { id: 105, gender: '여', birth: '1972-09-15', phone: '010-5678-9012', region: '부산 해운대구', workRegion: '부산 전체', workTypes: ['출·퇴근형'], salary: '시급 13,000원', cert: '요양보호사 1급', isNew: false, expPeriod: '5년 이상', intro: '' },
  106: { id: 106, gender: '여', birth: '1979-04-20', phone: '010-6789-0123', region: '부산 수영구', workRegion: '부산 동부', workTypes: ['출·퇴근형'], salary: '시급 12,500원', cert: '요양보호사 2급', isNew: false, expPeriod: '2년', intro: '' },
  107: { id: 107, gender: '여', birth: '1966-12-01', phone: '010-7890-1234', region: '부산 동래구', workRegion: '부산 전체', workTypes: ['출·퇴근형', '입주형'], salary: '시급 14,000원', cert: '요양보호사 1급', isNew: false, expPeriod: '8년 이상', intro: '요양병원 근무 경험이 있습니다.' },
  108: { id: 108, gender: '여', birth: '1981-06-10', phone: '010-8901-2345', region: '대전 서구', workRegion: '대전 전체', workTypes: ['출·퇴근형'], salary: '시급 12,000원', cert: '요양보호사 1급', isNew: false, expPeriod: '1년', intro: '' },
  109: { id: 109, gender: '여', birth: '1962-02-28', phone: '010-9012-3456', region: '대전 유성구', workRegion: '대전·세종', workTypes: ['출·퇴근형', '입주형'], salary: '시급 13,000원', cert: '요양보호사 1급', isNew: false, expPeriod: '15년 이상', intro: '20년 가까운 경력의 베테랑입니다.' },
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
                  onClick={() => {
                    setSelectedJobId(job.id)
                    navigate(`/manage/${job.id}`)
                  }}
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

          {/* 공고 요약 바 */}
          {selectedJob && (
            <div className="ap-job-summary">
              <span className="ap-summary-name">{selectedJob.facility}</span>
              <span className="ap-summary-dot">·</span>
              <span className="ap-summary-title">{selectedJob.title || selectedJob.type}</span>
              <span className="ap-summary-dot">·</span>
              <span className="ap-summary-wage">{selectedJob.pay}</span>
              <Link to={`/job/${selectedJob.id}`} className="ap-summary-link">공고 보기</Link>
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
