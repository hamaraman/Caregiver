import { useState } from 'react'
import { Link } from 'react-router-dom'
import { JOB_LIST } from '../../data/jobs'

const SORT_TABS = ['최신순', '마감임박순', '급여높은순', '인기순']
const PAGE_SIZE = 15

const SHIFT_STYLE = {
  주간: { bg: '#EFF5FF', color: '#4A8FE7' },
  야간: { bg: '#F3F0FF', color: '#7C5CBF' },
  단기: { bg: '#FFF8EC', color: '#E07800' },
}

function JobRow({ job }) {
  const s = SHIFT_STYLE[job.shift] || {}
  const ddayColor = job.dday <= 3 ? '#e74c3c' : job.dday <= 7 ? '#f39c12' : '#8a9ab5'

  return (
    <Link to={`/job/${job.id}`} className="js-job-row">
      <div className="js-job-row-main">
        <div className="js-job-row-top">
          <span className="js-job-row-badge" style={{ background: s.bg, color: s.color }}>{job.shift}</span>
          <span className="js-job-row-type">{job.type}</span>
          <span className="js-job-row-facility">{job.facility}</span>
        </div>
        <div className="js-job-row-meta">
          <span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
            </svg>
            {job.location}
          </span>
          <span className="js-job-row-dot">·</span>
          <span>{job.workType}</span>
          <span className="js-job-row-dot">·</span>
          <span>{job.time}</span>
        </div>
        <div className="js-job-row-tags">
          {job.tags.map(t => <span key={t} className="js-job-row-tag">{t}</span>)}
        </div>
      </div>
      <div className="js-job-row-right">
        <span className="js-job-row-pay">{job.pay}</span>
        <div className="js-job-row-footer">
          <span className="js-job-row-dday" style={{ color: ddayColor }}>D-{job.dday}</span>
          <span className="js-job-row-date">{job.date} 등록</span>
        </div>
      </div>
    </Link>
  )
}

export default function JsJobList() {
  const [sort, setSort] = useState('최신순')
  const [page, setPage] = useState(1)

  const totalPages = Math.ceil(JOB_LIST.length / PAGE_SIZE)
  const paged = JOB_LIST.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <section className="js-joblist">
      <div className="js-notice-banner">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4A8FE7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <span>허위 구인공고 신고는 고객센터(1588-0000)로 연락주세요.</span>
      </div>

      <div className="js-list-header">
        <span className="js-list-count">총 <strong>{JOB_LIST.length}</strong>개의 일자리</span>
        <div className="js-sort-tabs">
          {SORT_TABS.map(t => (
            <button
              key={t}
              className={`js-sort-tab ${sort === t ? 'active' : ''}`}
              onClick={() => { setSort(t); setPage(1) }}
            >{t}</button>
          ))}
        </div>
      </div>

      <div className="js-rows">
        {paged.map(job => <JobRow key={job.id} job={job} />)}
      </div>

      <div className="js-pagination">
        <button className="js-page-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
          <button key={n} className={`js-page-num ${page === n ? 'active' : ''}`} onClick={() => setPage(n)}>{n}</button>
        ))}
        <button className="js-page-btn" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      </div>
    </section>
  )
}
