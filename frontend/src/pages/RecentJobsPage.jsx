import { Link } from 'react-router-dom'
import { JOB_LIST } from '../data/jobs'
import { getRecentJobs } from '../hooks/useJobStorage'
import HomeNav from './home/HomeNav'
import './JobSeekerPage.css'

const SHIFT_STYLE = {
  주간: { bg: '#EFF5FF', color: '#4A8FE7' },
  야간: { bg: '#F3F0FF', color: '#7C5CBF' },
  단기: { bg: '#FFF8EC', color: '#E07800' },
}

export default function RecentJobsPage() {
  const entries = getRecentJobs()
  const jobs = entries
    .map(e => JOB_LIST.find(j => j.id === e.id))
    .filter(Boolean)

  return (
    <div className="jsp-root">
      <HomeNav />
      <section className="jsp-section">
        <div className="jsp-inner">
          <div className="jsp-section-header" style={{ marginBottom: '24px' }}>
            <div className="jsp-section-title-wrap">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F39C12" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
              <h2 className="jsp-section-title">최근 본 일자리</h2>
            </div>
            <span style={{ fontSize: '13px', color: '#999' }}>최근 7일 이내 조회한 공고</span>
          </div>

          {jobs.length === 0 ? (
            <p className="jsp-side-empty" style={{ padding: '48px 0', textAlign: 'center' }}>
              최근 본 일자리가 없습니다.
            </p>
          ) : (
            <table className="jsp-table">
              <thead>
                <tr>
                  <th>직종</th><th>근무지</th><th>근무형태</th>
                  <th>급여</th><th>근무시간</th><th>등록일</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map(job => {
                  const s = SHIFT_STYLE[job.shift] || {}
                  return (
                    <tr key={job.id}>
                      <td>
                        <Link to={`/job/${job.id}`} className="jsp-job-type-cell">
                          <span className="jsp-shift-badge" style={{ background: s.bg, color: s.color }}>{job.shift}</span>
                          <span className="jsp-job-type-name">{job.type}</span>
                        </Link>
                      </td>
                      <td>{job.location}</td>
                      <td>{job.workType}</td>
                      <td className="jsp-pay">{job.pay}</td>
                      <td>{job.time}</td>
                      <td className="jsp-date">{job.date}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  )
}
