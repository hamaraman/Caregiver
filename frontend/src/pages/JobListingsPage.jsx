import { useState } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { jobs } from '../data/jobs'
import './JobListingsPage.css'

const doList = ['서울','경기','인천','강원','충북','충남','대전','세종','전북','전남','광주','경북','경남','대구','부산','울산','제주']
const jobTypes = ['전체','요양보호사','간병인','가사도우미','사회복지사','간호사','간호조무사','물리치료사','활동지원사','조리원','영양사','시설장','사무원','운전원']
const workTimeOptions = ['전체','주간','야간','단기']
const popularJobTypes = ['요양보호사','간병인','방문요양','사회복지사','간호조무사','물리치료사']
const ITEMS_PER_PAGE = 10

const toMonthly = (job) => {
  const amount = parseInt(job.wage.replace(/[^0-9]/g, ''))
  return job.type === '시급' ? amount * 176 : amount
}

export default function JobListingsPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [sidebarRegion, setSidebarRegion] = useState('')
  const [selectedJobType, setSelectedJobType] = useState('전체')
  const [workTime, setWorkTime] = useState('전체')
  const [sortOrder, setSortOrder] = useState('최신순')
  const [page, setPage] = useState(1)
  const [likedJobs, setLikedJobs] = useState({})
  const [alertJob, setAlertJob] = useState('')
  const [alertRegion, setAlertRegion] = useState('')

  const resetFilters = () => {
    setSidebarRegion('')
    setSelectedJobType('전체')
    setWorkTime('전체')
    setQuery('')
    setPage(1)
  }

  const filtered = jobs.filter((job) => {
    const matchRegion = !sidebarRegion || job.region === sidebarRegion || job.location.includes(sidebarRegion)
    const matchType = selectedJobType === '전체' || job.jobType === selectedJobType
    const matchTime = workTime === '전체' || job.shift === workTime
    const matchQuery = !query || job.title.includes(query) || job.location.includes(query)
    return matchRegion && matchType && matchTime && matchQuery
  })

  const sorted = [...filtered].sort((a, b) => {
    if (sortOrder === '임금높은순') return toMonthly(b) - toMonthly(a)
    return a.id - b.id
  })

  const totalPages = Math.ceil(sorted.length / ITEMS_PER_PAGE)
  const paginated = sorted.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)
  const toggleLike = (id) => setLikedJobs((prev) => ({ ...prev, [id]: !prev[id] }))

  const calcDDay = (deadline) => {
    if (!deadline || deadline === '상시') return null
    const today = new Date(); today.setHours(0, 0, 0, 0)
    const diff = Math.ceil((new Date(deadline) - today) / 86400000)
    if (diff < 0) return '마감'
    if (diff === 0) return 'D-Day'
    return `D-${diff}`
  }

  return (
    <div className="app">
      <Header />

      {/* ── Hero ── */}
      <section className="jlp-hero">
        <div className="container">
          <p className="jlp-hero-eyebrow">전국 요양·돌봄 구인공고 플랫폼</p>
          <h1 className="jlp-hero-title">모든 구인공고를 <span className="jlp-hero-accent">한눈에</span> 확인하세요</h1>
          <div className="jlp-hero-search">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            <input
              className="jlp-hero-input"
              type="text"
              placeholder="직종, 지역, 시설명으로 검색"
              value={query}
              onChange={e => { setQuery(e.target.value); setPage(1) }}
              onKeyDown={e => e.key === 'Enter' && setPage(1)}
            />
            <button className="jlp-hero-search-btn" aria-label="검색">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            </button>
          </div>
          <div className="jlp-hero-tags">
            <span className="jlp-hero-tag-label">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
              인기직종
            </span>
            {popularJobTypes.map(tag => (
              <button
                key={tag}
                className={`jlp-hero-tag${selectedJobType === tag ? ' jlp-hero-tag--active' : ''}`}
                onClick={() => { setSelectedJobType(tag); setPage(1) }}
              >{tag}</button>
            ))}
          </div>
        </div>
      </section>

      <main className="jl-page">
        <div className="container">
          <div className="jlp-body">

            {/* Left sidebar */}
            <aside className="jlp-sidebar">
              <div className="jlp-sidebar-header">
                <span className="jlp-sidebar-title">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="20" y2="12"/><line x1="12" y1="18" x2="20" y2="18"/></svg>
                  필터
                </span>
                <button className="jlp-sidebar-reset" onClick={resetFilters}>초기화</button>
              </div>

              <div className="jlp-sidebar-group">
                <label className="jlp-sidebar-label">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
                  지역
                </label>
                <select className="jlp-sidebar-select" value={sidebarRegion} onChange={e => { setSidebarRegion(e.target.value); setPage(1) }}>
                  <option value="">지역 선택</option>
                  {doList.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              <div className="jlp-sidebar-group">
                <label className="jlp-sidebar-label">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
                  직종
                </label>
                <select className="jlp-sidebar-select" value={selectedJobType} onChange={e => { setSelectedJobType(e.target.value); setPage(1) }}>
                  {jobTypes.map(j => <option key={j} value={j}>{j}</option>)}
                </select>
              </div>

              <div className="jlp-sidebar-group">
                <label className="jlp-sidebar-label">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  근무시간대
                </label>
                <div className="jlp-time-chips">
                  {workTimeOptions.map(w => (
                    <button
                      key={w}
                      className={`jlp-time-chip${workTime === w ? ' jlp-time-chip--active' : ''}`}
                      onClick={() => { setWorkTime(w); setPage(1) }}
                    >{w}</button>
                  ))}
                </div>
              </div>

              <button className="jlp-sidebar-btn" onClick={() => setPage(1)}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
                공고 검색
              </button>
            </aside>

            {/* Main content */}
            <div className="jlp-main">
              <div className="jlp-result-bar">
                <span className="jlp-result-count">총 <strong>{sorted.length}</strong>개의 공고</span>
                <div className="jlp-sort-group">
                  {['최신순','임금높은순'].map(s => (
                    <button key={s} className={`jlp-sort-btn${sortOrder === s ? ' jlp-sort-btn--active' : ''}`} onClick={() => { setSortOrder(s); setPage(1) }}>{s}</button>
                  ))}
                </div>
              </div>

              <div className="jlp-table">
                {paginated.length === 0 ? (
                  <div className="jlp-empty">조건에 맞는 공고가 없습니다.</div>
                ) : paginated.map((job) => {
                  const dday = calcDDay(job.deadline)
                  const isUrgent = dday && dday !== '마감' && parseInt(dday.replace('D-','')) <= 3
                  const shiftStyle =
                    job.shift === '야간' ? { background: '#1a2640', color: '#a0c0f0' } :
                    job.shift === '단기' ? { background: '#e8fff0', color: '#2a9a5a' } :
                    { background: '#e8f4ff', color: '#4A8FE7' }
                  return (
                    <Link to={`/jobs/${job.id}`} className="jlp-row" key={job.id} onClick={e => e.target.closest('.jlp-like') && e.preventDefault()}>
                      <div className="jlp-row-body">
                        <div className="jlp-row-top">
                          {job.shift && <span className="jlp-shift-badge" style={shiftStyle}>{job.shift}</span>}
                          <span className="jlp-job-title">{job.title}</span>
                          {job.companyName && <span className="jlp-company">{job.companyName}</span>}
                        </div>
                        <div className="jlp-row-meta">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#bbd4f0" strokeWidth="2" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                          <span>{job.location}</span>
                          <span className="jlp-meta-dot">·</span>
                          <span>{job.days}</span>
                          <span className="jlp-meta-dot">·</span>
                          <span>{job.hours}</span>
                        </div>
                        <div className="jlp-row-tags">
                          {(job.displayTags || []).map(tag => (
                            <span key={tag} className="jlp-tag">{tag}</span>
                          ))}
                        </div>
                      </div>
                      <div className="jlp-row-right">
                        <span className="jlp-wage">{job.wage}</span>
                        <div className="jlp-row-date-wrap">
                          {dday && <span className={`jlp-dday${isUrgent ? ' jlp-dday--urgent' : ''}`}>{dday}</span>}
                          <span className="jlp-date">{job.date}</span>
                        </div>
                        <button className={`jlp-like${likedJobs[job.id] ? ' jlp-like--active' : ''}`} onClick={e => { e.preventDefault(); toggleLike(job.id) }}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill={likedJobs[job.id] ? '#4A8FE7' : 'none'} stroke={likedJobs[job.id] ? '#4A8FE7' : '#ccc'} strokeWidth="2">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                          </svg>
                        </button>
                      </div>
                    </Link>
                  )
                })}
              </div>

              {totalPages > 1 && (
                <div className="jlp-pagination">
                  <button className="jlp-page-btn" disabled={page === 1} onClick={() => setPage(page - 1)}>‹</button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button key={p} className={`jlp-page-btn${page === p ? ' jlp-page-btn--active' : ''}`} onClick={() => setPage(p)}>{p}</button>
                  ))}
                  <button className="jlp-page-btn" disabled={page === totalPages} onClick={() => setPage(page + 1)}>›</button>
                </div>
              )}
            </div>

            {/* Right sidebar */}
            <aside className="jlp-right">
              <div className="jlp-cta-card">
                <div className="jlp-cta-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="3"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
                </div>
                <h3 className="jlp-cta-title">구인공고 등록하기</h3>
                <p className="jlp-cta-desc">우리 시설에 딱 맞는 인재를 지금 바로 찾아보세요</p>
                <Link to="/jobs/post" className="jlp-cta-btn">공고 등록하기</Link>
              </div>

              <div className="jlp-alert-card">
                <div className="jlp-alert-title">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                  공고 알림 받기
                </div>
                <p className="jlp-alert-desc">조건에 맞는 새 공고가 올라오면 알려드려요</p>
                <input className="jlp-alert-input" placeholder="관심 직종" value={alertJob} onChange={e => setAlertJob(e.target.value)} />
                <input className="jlp-alert-input" placeholder="희망 지역" value={alertRegion} onChange={e => setAlertRegion(e.target.value)} />
                <button className="jlp-alert-btn">알림 신청</button>
              </div>
            </aside>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
