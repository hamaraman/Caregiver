import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { fetchJob } from '../api'
import { getRecentJobs } from '../hooks/useJobStorage'
import HomeNav from './home/HomeNav'
import { SHIFT_STYLE } from '../data/shiftStyles'
import './JobSeekerPage.css'

export default function RecentJobsPage() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // fetchJobs()는 공개 검색 목록이라 마감된 공고를 빼므로, 최근 본 공고는 각각 개별 조회한다.
    const ids = getRecentJobs().map(e => e.id)
    Promise.all(ids.map(id => fetchJob(id).catch(() => null)))
      .then(list => setJobs(list.filter(Boolean)))
      .finally(() => setLoading(false))
  }, [])

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

          {loading ? (
            <p className="jsp-side-empty" style={{ padding: '48px 0', textAlign: 'center' }}>
              불러오는 중입니다...
            </p>
          ) : jobs.length === 0 ? (
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
                          {job.closed && (
                            <span className="jsp-shift-badge" style={{ background: '#f0f0f0', color: '#999' }}>마감</span>
                          )}
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
