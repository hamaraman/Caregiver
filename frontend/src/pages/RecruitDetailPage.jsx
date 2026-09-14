import { useParams, Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import Header from '../components/Header'
import HiredWorkerModal from '../components/HiredWorkerModal'
import { jobs } from '../data/jobs'
import { applicants } from '../data/applicants'
import { talents } from '../data/talents'
import './RecruitDetailPage.css'

export default function RecruitDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const job = jobs.find(j => j.id === Number(id))

  const jobApplicants = job
    ? applicants
        .filter(a => a.jobId === job.id)
        .map(a => ({ ...a, talent: talents.find(t => t.id === a.talentId) }))
        .filter(a => a.talent)
    : []

  const [statuses, setStatuses] = useState(() =>
    Object.fromEntries(jobApplicants.map(a => [a.id, a.status]))
  )
  const [selectedAppId, setSelectedAppId] = useState(null)
  const [memos, setMemos] = useState({})

  const updateStatus = (appId, newStatus) => {
    setStatuses(prev => ({ ...prev, [appId]: newStatus }))
  }

  const hiredApplicants = jobApplicants.filter(a => (statuses[a.id] ?? a.status) === '합격')
  const selectedApp = jobApplicants.find(a => a.id === selectedAppId) ?? null

  if (!job) {
    return (
      <>
        <Header />
        <div className="rd-page">
          <div className="container">
            <p className="rd-not-found">공고를 찾을 수 없습니다.</p>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Header />
      <div className="rd-page">
        <div className="container">
          <button className="rd-back" onClick={() => navigate(-1)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            채용 관리로 돌아가기
          </button>

          {/* 공고 요약 */}
          <section className="rd-section">
            <h2 className="rd-section-title">공고 요약</h2>
            <div className="rd-job-card">
              <div className="rd-job-header">
                <div className="rd-job-title-row">
                  <span className="rd-status-badge rd-status-badge--active">진행중</span>
                  <span className="rd-job-title">{job.postTitle || job.title}</span>
                  {job.badge && (
                    <span className={`rd-badge rd-badge--${job.badgeColor ?? 'red'}`}>{job.badge}</span>
                  )}
                </div>
                <Link to={`/jobs/${job.id}`} className="rd-view-btn">공고 보기</Link>
              </div>

              <div className="rd-job-meta">
                <div className="rd-meta-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
                  {job.location}
                </div>
                <div className="rd-meta-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2" strokeLinecap="round"/></svg>
                  {job.hours} / {job.days}
                </div>
                <div className="rd-meta-item rd-meta-wage">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#e91e8c" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20" strokeLinecap="round"/></svg>
                  {job.wage}
                </div>
              </div>

              <div className="rd-job-dates">
                <span>등록일 {job.date}</span>
                <span className="rd-dot">·</span>
                <span>마감일 {job.deadline}</span>
                <span className="rd-dot">·</span>
                <span>{job.employForm}</span>
              </div>

              <div className="rd-divider" />

              <div className="rd-care-row">
                <div className="rd-care-block">
                  <span className="rd-care-label">케어 대상</span>
                  <div className="rd-tag-group">
                    <span className="rd-tag">{job.careGender === '여' ? '여성' : '남성'} {job.careAge}세</span>
                    <span className="rd-tag">장기요양 {job.careGrade}</span>
                    {job.careCondition?.map(c => <span key={c} className="rd-tag">{c}</span>)}
                  </div>
                </div>
                <div className="rd-care-block">
                  <span className="rd-care-label">담당 업무</span>
                  <div className="rd-tag-group">
                    {job.careWork?.map(w => <span key={w} className="rd-tag rd-tag--pink">{w}</span>)}
                  </div>
                </div>
              </div>

              {job.companyName && (
                <div className="rd-company-row">
                  <span className="rd-company-name">{job.companyName}</span>
                  {job.companyPhone && <span className="rd-company-phone">{job.companyPhone}</span>}
                  {job.managerName && <span className="rd-company-manager">담당 {job.managerName}</span>}
                </div>
              )}
            </div>
          </section>

          {/* 채용 인원 */}
          <section className="rd-section">
            <h2 className="rd-section-title">
              채용 인원
              <span className="rd-applicant-count">{hiredApplicants.length}명</span>
            </h2>

            {hiredApplicants.length === 0 ? (
              <div className="rd-empty">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ddd" strokeWidth="1.5">
                  <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" strokeLinecap="round"/>
                </svg>
                <p>합격 처리된 지원자가 없습니다.</p>
                <Link to="/applicants" className="rd-goto-applicants">지원자 확인하러 가기 →</Link>
              </div>
            ) : (
              <div className="rd-applicant-grid">
                {hiredApplicants.map(a => {
                  const t = a.talent
                  return (
                    <div
                      key={a.id}
                      className="rd-applicant-card"
                      onClick={() => setSelectedAppId(a.id)}
                    >
                      <div className="rd-app-header">
                        <div className="rd-app-name-row">
                          <span className="rd-app-name">{t.name}</span>
                          <span className={`rd-gender-badge rd-gender-badge--${t.gender === '여' ? 'f' : 'm'}`}>{t.gender}</span>
                          <span className="rd-age">{t.age}세</span>
                        </div>
                        <span className="rd-hired-chip">✓ 합격</span>
                      </div>

                      <div className="rd-app-info">
                        <div className="rd-app-row">
                          <span className="rd-app-label">직종</span>
                          <span className="rd-app-value">{t.jobType}</span>
                        </div>
                        <div className="rd-app-row">
                          <span className="rd-app-label">경력</span>
                          <span className="rd-app-value">{t.experience}</span>
                        </div>
                        <div className="rd-app-row">
                          <span className="rd-app-label">근무형태</span>
                          <span className="rd-app-value">{t.workType}</span>
                        </div>
                        <div className="rd-app-row">
                          <span className="rd-app-label">희망임금</span>
                          <span className="rd-app-value rd-app-wage">{t.wageType} {t.wageAmount.toLocaleString()}원</span>
                        </div>
                      </div>

                      <div className="rd-app-certs">
                        {t.certs?.map(c => <span key={c} className="rd-cert-tag">{c}</span>)}
                      </div>

                      <div className="rd-app-footer">
                        <span className="rd-apply-date">지원일 {a.applyDate}</span>
                        <span className="rd-card-hint">클릭하여 상세 보기</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </section>
        </div>
      </div>

      {selectedApp && (
        <HiredWorkerModal
          app={selectedApp}
          job={job}
          memo={memos[selectedApp.id] ?? ''}
          onMemoChange={val => setMemos(prev => ({ ...prev, [selectedApp.id]: val }))}
          onClose={() => setSelectedAppId(null)}
        />
      )}
    </>
  )
}
