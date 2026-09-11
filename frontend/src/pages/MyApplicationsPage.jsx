import { useState } from 'react'
import HomeNav from './home/HomeNav'
import { JOB_LIST } from '../data/jobs'
import './MyApplicationsPage.css'

const MY_APPLIED_IDS = [1, 5, 8, 15, 23]
const STATUS_MAP = {
  1:  '검토중',
  5:  '합격',
  8:  '검토중',
  15: '불합격',
  23: '합격',
}
const APPLY_DATES = {
  1:  '09.06',
  5:  '09.03',
  8:  '09.01',
  15: '08.27',
  23: '08.20',
}

const STATUS_STYLE = {
  '검토중': { bg: '#fff8e1', color: '#f59f00' },
  '합격':   { bg: '#e8fff0', color: '#2a9a5a' },
  '불합격': { bg: '#fff0f0', color: '#e74c3c' },
}

export default function MyApplicationsPage() {
  const [filter, setFilter] = useState('전체')
  const myJobs = JOB_LIST.filter(j => MY_APPLIED_IDS.includes(j.id))

  const counts = {
    전체: myJobs.length,
    검토중: myJobs.filter(j => STATUS_MAP[j.id] === '검토중').length,
    합격: myJobs.filter(j => STATUS_MAP[j.id] === '합격').length,
    불합격: myJobs.filter(j => STATUS_MAP[j.id] === '불합격').length,
  }

  const filtered = filter === '전체' ? myJobs : myJobs.filter(j => STATUS_MAP[j.id] === filter)

  return (
    <div className="ma-root">
      <HomeNav />

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
            {filtered.length === 0 && (
              <div className="ma-empty">해당 상태의 지원 내역이 없습니다.</div>
            )}
            {filtered.map(job => {
              const status = STATUS_MAP[job.id]
              const style = STATUS_STYLE[status]
              return (
                <div key={job.id} className="ma-row">
                  <div className="ma-row-logo">{job.facility.charAt(0)}</div>
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
                      {status}
                    </span>
                    <span className="ma-apply-date">지원일 {APPLY_DATES[job.id]}</span>
                  </div>
                </div>
              )
            })}
          </div>

        </div>
      </div>
    </div>
  )
}
