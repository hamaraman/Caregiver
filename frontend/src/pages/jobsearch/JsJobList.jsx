import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { fetchJobs } from '../../api'

const SORT_TABS = ['최신순', '마감임박순', '급여높은순', '인기순']
const PAGE_SIZE = 15

const SHIFT_STYLE = {
  주간: { bg: '#EFF5FF', color: '#4A8FE7' },
  야간: { bg: '#F3F0FF', color: '#7C5CBF' },
  단기: { bg: '#FFF8EC', color: '#E07800' },
}

function parsePay(pay) {
  const m = /^(시급|일급|월급)\s*([\d,]+)/.exec(pay || '')
  return m ? { type: m[1], amount: Number(m[2].replace(/,/g, '')) } : null
}

const SALARY_THRESHOLDS = {
  '시급 10,000원~': { type: '시급', amount: 10000 },
  '시급 11,000원~': { type: '시급', amount: 11000 },
  '시급 12,000원~': { type: '시급', amount: 12000 },
  '월급 1,000,000원~': { type: '월급', amount: 1000000 },
  '월급 1,500,000원~': { type: '월급', amount: 1500000 },
}

function matchesSalary(job, salary) {
  if (!salary || salary === '전체') return true
  const threshold = SALARY_THRESHOLDS[salary]
  if (!threshold) return true
  const jobPay = parsePay(job.pay)
  return !!jobPay && jobPay.type === threshold.type && jobPay.amount >= threshold.amount
}

function expNum(str) {
  if (!str || str.includes('무관') || str.includes('신입')) return 0
  const m = /(\d+)/.exec(str)
  return m ? Number(m[1]) : 0
}

const CAREER_MAX = { '신입 가능': 0, '1년 미만': 0, '1년 이상': 1, '3년 이상': 3, '5년 이상': 5 }

function matchesCareer(job, career) {
  if (!career || career === '전체 선택') return true
  const max = CAREER_MAX[career]
  return max == null || expNum(job.experience) <= max
}

function sortJobs(jobs, sort) {
  const arr = [...jobs]
  if (sort === '마감임박순') {
    return arr.sort((a, b) => (a.dday ?? Infinity) - (b.dday ?? Infinity))
  }
  if (sort === '급여높은순') {
    return arr.sort((a, b) => (parsePay(b.pay)?.amount ?? -1) - (parsePay(a.pay)?.amount ?? -1))
  }
  if (sort === '인기순') {
    return arr.sort((a, b) => b.likeCount - a.likeCount || b.id - a.id)
  }
  return arr.sort((a, b) => b.id - a.id)
}

function matchesWorkType(job, workTypes) {
  if (!workTypes || workTypes.includes('전체')) return true
  return workTypes.some(t => {
    if (t === '주간' || t === '야간') return job.shift === t
    if (t === '파트타임') return job.employForm === '아르바이트'
    if (t === '교대') return job.employForm === '교대' || job.tags.includes('교대')
    return false
  })
}

function JobRow({ job }) {
  const s = SHIFT_STYLE[job.shift] || {}
  const ddayColor = job.dday == null ? '#8a9ab5' : job.dday <= 3 ? '#e74c3c' : job.dday <= 7 ? '#f39c12' : '#8a9ab5'

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
          {job.dday != null && (
            <span className="js-job-row-dday" style={{ color: ddayColor }}>D-{job.dday}</span>
          )}
          <span className="js-job-row-date">{job.date} 등록</span>
        </div>
      </div>
    </Link>
  )
}

export default function JsJobList({ region, keyword = '', jobType = '', workTypes = ['전체'], salary = '', career = '전체 선택' }) {
  const [jobList, setJobList] = useState([])
  const [loading, setLoading] = useState(true)
  const [sort, setSort] = useState('최신순')
  const [page, setPage] = useState(1)

  useEffect(() => {
    setLoading(true)
    setPage(1)
    fetchJobs(region)
      .then(list => setJobList([...list].sort((a, b) => b.id - a.id)))
      .catch(() => setJobList([]))
      .finally(() => setLoading(false))
  }, [region])

  useEffect(() => { setPage(1) }, [keyword, jobType, workTypes, salary, career])

  const filtered = jobList
    .filter(j => !keyword || [j.type, j.location, j.facility, j.title, ...j.tags].some(v => v && v.includes(keyword)))
    .filter(j => !jobType || j.type === jobType)
    .filter(j => matchesWorkType(j, workTypes))
    .filter(j => matchesSalary(j, salary))
    .filter(j => matchesCareer(j, career))
  const sorted = sortJobs(filtered, sort)

  const totalPages = Math.ceil(sorted.length / PAGE_SIZE)
  const paged = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <section className="js-joblist">
      <div className="js-notice-banner">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4A8FE7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <span>허위 구인공고 신고는 고객센터(1588-0000)로 연락주세요.</span>
      </div>

      <div className="js-list-header">
        <span className="js-list-count">총 <strong>{filtered.length}</strong>개의 일자리</span>
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
        {loading
          ? <div className="js-empty">일자리를 불러오는 중입니다...</div>
          : paged.length === 0
          ? <div className="js-empty">등록된 일자리가 없습니다.</div>
          : paged.map(job => <JobRow key={job.id} job={job} />)
        }
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
