import { useState, useEffect } from 'react'
import HomeNav from './home/HomeNav'
import AuthGuard from '../components/AuthGuard'
import { fetchMyApplications } from '../api'
import './MyApplicationsPage.css'

const STATUS_STYLE = {
  '검토중': { bg: '#fff8e1', color: '#f59f00' },
  '합격':   { bg: '#e8fff0', color: '#2a9a5a' },
  '불합격': { bg: '#fff0f0', color: '#e74c3c' },
}

export default function MyApplicationsPage() {
  const [filter, setFilter] = useState('전체')
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMyApplications()
      .then(setApplications)
      .catch(() => setApplications([]))
      .finally(() => setLoading(false))
  }, [])

  const withJob = applications.filter(a => a.job)

  const counts = {
    전체: withJob.length,
    검토중: withJob.filter(a => a.status === '검토중').length,
    합격: withJob.filter(a => a.status === '합격').length,
    불합격: withJob.filter(a => a.status === '불합격').length,
  }

  const filtered = filter === '전체' ? withJob : withJob.filter(a => a.status === filter)

  return (
    <div className="ma-root">
      <HomeNav />
      <AuthGuard>

      <div className="ma-hero">
        <div className="ma-hero-inner">
          <span className="ma-hero-eyebrow">내 구직 활동</span>
          <h1 className="ma-hero-title">지원 현황</h1>
          <p className="ma-hero-sub">지원한 공고의 진행 상태를 확인하세요.</p>
        </div>
      </div>

      <div className="ma-body">
        <div className="ma-body-inner">

          <div className="ma-stats">
            {['전체', '검토중', '합격', '불합격'].map(s => (
              <button
                key={s}
                className={`ma-stat-btn ${filter === s ? 'active' : ''} ma-stat-btn--${s}`}
                onClick={() => setFilter(s)}
              >
                <span className="ma-stat-label">{s}</span>
                <span className="ma-stat-count">{counts[s]}</span>
              </button>
            ))}
          </div>

          <div className="ma-list">
            {loading && <div className="ma-empty">불러오는 중입니다...</div>}
            {!loading && filtered.length === 0 && (
              <div className="ma-empty">해당 상태의 지원 내역이 없습니다.</div>
            )}
            {filtered.map(app => {
              const job = app.job
              const style = STATUS_STYLE[app.status] || {}
              return (
                <div key={app.id} className="ma-row">
                  <div className="ma-row-logo">{(job.facility || job.type).charAt(0)}</div>
                  <div className="ma-row-info">
                    <div className="ma-row-type">{job.type}</div>
                    <div className="ma-row-facility">{job.facility}</div>
                    <div className="ma-row-meta">
                      <span>{job.location}</span>
                      <span>·</span>
                      <span>{job.workType}</span>
                      <span>·</span>
                      <span>{job.pay}</span>
                    </div>
                  </div>
                  <div className="ma-row-right">
                    <span
                      className="ma-status-badge"
                      style={{ background: style.bg, color: style.color }}
                    >
                      {app.status}
                    </span>
                    <span className="ma-apply-date">지원일 {app.appliedAt}</span>
                  </div>
                </div>
              )
            })}
          </div>

        </div>
      </div>
      </AuthGuard>
    </div>
  )
}
