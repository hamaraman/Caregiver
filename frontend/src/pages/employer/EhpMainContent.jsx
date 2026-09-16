import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { fetchMyJobs, fetchApplicantsForJob } from '../../api'
import { SHIFT_STYLE } from '../../data/shiftStyles'

const STATUS_COLOR = {
  검토중: { color: '#F39C12', bg: '#FFF8EC' },
  합격:   { color: '#27AE60', bg: '#EDFBF3' },
  불합격:  { color: '#E74C3C', bg: '#FEF0EF' },
}

export default function EhpMainContent() {
  const [myJobs, setMyJobs] = useState([])
  const [applicantsByJob, setApplicantsByJob] = useState({})
  const [loading, setLoading] = useState(true)

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

  const applicantCount = (jobId) => (applicantsByJob[jobId] || []).length

  const allApplicants = Object.values(applicantsByJob).flat()
  const STATS = {
    검토중: allApplicants.filter(a => a.status === '검토중').length,
    합격: allApplicants.filter(a => a.status === '합격').length,
    불합격: allApplicants.filter(a => a.status === '불합격').length,
  }

  const jobsById = Object.fromEntries(myJobs.map(j => [j.id, j]))
  const recentApplicants = [...allApplicants]
    .sort((a, b) => b.id - a.id)
    .slice(0, 5)
    .map(a => ({ ...a, job: jobsById[a.jobId] }))

  return (
    <>
      <section className="jsp-section">
        <div className="jsp-inner">
          <div className="jsp-content-grid">

            {/* ── Left: 내 공고 관리 ── */}
            <div className="jsp-main-col">
              <div className="jsp-main-card">
                <div className="jsp-section-header">
                  <div className="jsp-section-title-wrap">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4A8FE7" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2"/><line x1="7" y1="8" x2="17" y2="8"/><line x1="7" y1="12" x2="17" y2="12"/><line x1="7" y1="16" x2="13" y2="16"/>
                    </svg>
                    <h2 className="jsp-section-title">내 공고 관리</h2>
                  </div>
                  <Link to="/listings" className="jsp-more-btn">더보기 ›</Link>
                </div>

                <table className="jsp-table">
                  <thead>
                    <tr>
                      <th>공고명</th><th>근무지</th><th>급여</th>
                      <th>등록일</th><th>지원자</th><th>상태</th><th>관리</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading && (
                      <tr><td colSpan={7}>불러오는 중입니다...</td></tr>
                    )}
                    {!loading && myJobs.length === 0 && (
                      <tr><td colSpan={7}>등록한 공고가 없습니다.</td></tr>
                    )}
                    {myJobs.map(job => {
                      const s = SHIFT_STYLE[job.shift] || {}
                      const count = applicantCount(job.id)
                      return (
                        <tr key={job.id}>
                          <td>
                            <Link to={`/job/${job.id}`} className="jsp-job-type-cell">
                              <span className="jsp-shift-badge" style={{ background: s.bg, color: s.color }}>{job.shift}</span>
                              <span className="jsp-job-type-name">{job.type}</span>
                            </Link>
                          </td>
                          <td>{job.location}</td>
                          <td className="jsp-pay">{job.pay}</td>
                          <td className="jsp-date">{job.date}</td>
                          <td>
                            <Link to="/applicants" style={{ color: '#4A8FE7', fontWeight: 700, fontSize: 13 }}>
                              {count}명
                            </Link>
                          </td>
                          <td>
                            <span style={{ fontSize: 12, color: job.closed ? '#999' : '#27AE60', fontWeight: 700 }}>
                              {job.closed ? '마감' : '모집중'}
                            </span>
                          </td>
                          <td>
                            <Link to={`/job/${job.id}`} className="jsp-more-btn" style={{ fontSize: 12 }}>수정</Link>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ── Right: 사이드바 ── */}
            <div className="jsp-side-col">

              {/* 지원 현황 요약 */}
              <div className="jsp-side-card">
                <div className="jsp-side-card-header">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4A8FE7" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                  </svg>
                  <span>지원 현황</span>
                  <Link to="/applicants" className="jsp-more-btn" style={{ marginLeft: 'auto', fontSize: '12px' }}>전체보기 ›</Link>
                </div>
                <div style={{ display: 'flex', gap: 8, padding: '4px 0 8px' }}>
                  {Object.entries(STATS).map(([label, count]) => {
                    const st = STATUS_COLOR[label] || {}
                    return (
                      <div key={label} style={{ flex: 1, textAlign: 'center', background: st.bg, borderRadius: 10, padding: '10px 4px' }}>
                        <div style={{ fontSize: 20, fontWeight: 800, color: st.color }}>{count}</div>
                        <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>{label}</div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* 최근 지원자 */}
              <div className="jsp-side-card">
                <div className="jsp-side-card-header">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#27AE60" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                  </svg>
                  <span>최근 지원자</span>
                  <Link to="/applicants" className="jsp-more-btn" style={{ marginLeft: 'auto', fontSize: '12px' }}>더보기 ›</Link>
                </div>
                {recentApplicants.length === 0 && !loading && (
                  <p className="jsp-side-empty">아직 지원자가 없습니다.</p>
                )}
                {recentApplicants.map(a => {
                  const sc = STATUS_COLOR[a.status] || {}
                  return (
                    <Link key={a.id} to="/applicants" className="jsp-side-job-item">
                      <div className="jsp-side-job-top">
                        <span style={{ fontSize: 13, fontWeight: 700, color: '#333' }}>{a.applicantName ?? '지원자'}</span>
                        <span style={{ fontSize: 11, background: sc.bg, color: sc.color, borderRadius: 6, padding: '2px 6px', marginLeft: 'auto' }}>{a.status}</span>
                      </div>
                      <div className="jsp-side-job-info">{a.job?.type} · {a.appliedAt} 지원</div>
                    </Link>
                  )
                })}
              </div>

            </div>

          </div>
        </div>
      </section>

      <section className="jsp-cta">
        <div className="jsp-inner jsp-cta-inner">
          <div className="jsp-cta-icon-wrap">
            <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <div>
            <p className="jsp-cta-eyebrow">지금, 최적의 인재를 만나보세요.</p>
            <h3 className="jsp-cta-title">구인공고 등록부터 채용까지, 요양이지가 함께합니다.</h3>
          </div>
          <Link to="/jobs/post" className="jsp-cta-btn">구인공고 등록하기 →</Link>
        </div>
      </section>
    </>
  )
}
