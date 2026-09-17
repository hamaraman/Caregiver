import { useParams, Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import HomeNav from './home/HomeNav'
import ApplicantModal, { StatusDropdown } from '../components/ApplicantModal'
import { fetchJobRaw, fetchApplicantsForJob, fetchApplicantResume, updateApplicationStatus } from '../api'
import './RecruitDetailPage.css'

export default function ApplicantDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const jobId = Number(id)

  const [job, setJob] = useState(undefined)
  const [applications, setApplications] = useState([])
  const [resumesByApplicant, setResumesByApplicant] = useState({})
  const [selectedAppId, setSelectedAppId] = useState(null)

  useEffect(() => {
    fetchJobRaw(jobId).then(setJob).catch(() => setJob(null))
    fetchApplicantsForJob(jobId).then(setApplications).catch(() => setApplications([]))
  }, [jobId])

  useEffect(() => {
    applications.forEach(a => {
      if (resumesByApplicant[a.applicantId] !== undefined) return
      fetchApplicantResume(a.applicantId).then(resume =>
        setResumesByApplicant(prev => ({ ...prev, [a.applicantId]: resume }))
      )
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applications])

  const applicantsWithTalent = applications.map(a => ({ ...a, talent: resumesByApplicant[a.applicantId] ?? {} }))

  const updateStatus = (appId, newStatus) => {
    const prevApplications = applications
    setApplications(prev => prev.map(a => a.id === appId ? { ...a, status: newStatus } : a))
    updateApplicationStatus(appId, newStatus).catch(() => {
      alert('상태 변경에 실패했습니다.')
      setApplications(prevApplications)
    })
  }

  const selectedApp = applicantsWithTalent.find(a => a.id === selectedAppId) ?? null

  if (job === undefined) {
    return (
      <>
        <HomeNav />
        <div className="rd-page">
          <div className="container">
            <p className="rd-not-found">불러오는 중입니다...</p>
          </div>
        </div>
      </>
    )
  }

  if (!job) {
    return (
      <>
        <HomeNav />
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
      <HomeNav />
      <div className="rd-page">
        <div className="container">
          <button className="rd-back" onClick={() => navigate('/applicants')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            지원자 확인으로 돌아가기
          </button>

          {/* 공고 요약 */}
          <section className="rd-section">
            <h2 className="rd-section-title">공고 요약</h2>
            <div className="rd-job-card">
              <div className="rd-job-header">
                <div className="rd-job-title-row">
                  <span className={`rd-status-badge ${job.closed ? 'rd-status-badge--closed' : 'rd-status-badge--active'}`}>
                    {job.closed ? '마감' : '진행중'}
                  </span>
                  <span className="rd-job-title">{job.postTitle}</span>
                </div>
                <Link to={`/job/${job.id}`} className="rd-view-btn">공고 보기</Link>
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
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4A8FE7" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20" strokeLinecap="round"/></svg>
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

          {/* 전체 지원자 */}
          <section className="rd-section">
            <h2 className="rd-section-title">
              전체 지원자
              <span className="rd-applicant-count">{applicantsWithTalent.length}명</span>
            </h2>

            {applicantsWithTalent.length === 0 ? (
              <div className="rd-empty">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ddd" strokeWidth="1.5">
                  <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" strokeLinecap="round"/>
                </svg>
                <p>아직 지원자가 없습니다.</p>
              </div>
            ) : (
              <div className="rd-applicant-grid">
                {applicantsWithTalent.map(a => {
                  const t = a.talent
                  return (
                    <div
                      key={a.id}
                      className="rd-applicant-card"
                      onClick={() => setSelectedAppId(a.id)}
                    >
                      <div className="rd-app-header">
                        <div className="rd-app-name-row">
                          <span className="rd-app-name">{a.applicantName}</span>
                          {t.gender && (
                            <span className={`rd-gender-badge rd-gender-badge--${t.gender === '여' ? 'f' : 'm'}`}>{t.gender}</span>
                          )}
                        </div>
                        <StatusDropdown
                          status={a.status}
                          onChange={newStatus => updateStatus(a.id, newStatus)}
                        />
                      </div>

                      <div className="rd-app-info">
                        <div className="rd-app-row">
                          <span className="rd-app-label">경력</span>
                          <span className="rd-app-value">{t.isNew ? '신입' : (t.expPeriod || '-')}</span>
                        </div>
                        <div className="rd-app-row">
                          <span className="rd-app-label">근무형태</span>
                          <span className="rd-app-value">{(t.workTypes || []).join(', ') || '-'}</span>
                        </div>
                        <div className="rd-app-row">
                          <span className="rd-app-label">희망임금</span>
                          <span className="rd-app-value rd-app-wage">{t.salary || '협의'}</span>
                        </div>
                      </div>

                      {t.cert && (
                        <div className="rd-app-certs">
                          <span className="rd-cert-tag">{t.cert}</span>
                        </div>
                      )}

                      <div className="rd-app-footer">
                        <span className="rd-apply-date">지원일 {a.appliedAt}</span>
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
        <ApplicantModal
          app={selectedApp}
          status={selectedApp.status}
          onStatusChange={newStatus => updateStatus(selectedApp.id, newStatus)}
          onClose={() => setSelectedAppId(null)}
        />
      )}
    </>
  )
}
