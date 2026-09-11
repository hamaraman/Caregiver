import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import HomeNav from './home/HomeNav'
import { jobs } from '../data/jobs'
import { applicants, myJobIds } from '../data/applicants'
import { useAuth } from '../hooks/useAuth'
import './JobListingsPage.css'

const regionTree = {
  '서울': ['강남구','서초구','송파구','강동구','마포구','영등포구','종로구','중구','용산구','성동구','광진구','노원구','강북구','도봉구','은평구','서대문구','동대문구','중랑구','성북구','강서구','양천구','구로구','금천구','관악구','동작구'],
  '경기': ['수원시','성남시','고양시','용인시','부천시','안산시','화성시','남양주시','안양시','평택시','시흥시','파주시','의정부시','김포시','광명시','광주시','하남시','군포시','오산시','이천시','안성시','양주시','구리시','포천시','의왕시','여주시','동두천시','과천시','가평군','양평군','연천군'],
  '인천': ['미추홀구','연수구','남동구','부평구','계양구','서구','중구','동구','강화군','옹진군'],
  '강원': ['춘천시','원주시','강릉시','동해시','태백시','속초시','삼척시','홍천군','횡성군','영월군','평창군','정선군','철원군','화천군','양구군','인제군','고성군','양양군'],
  '충북': ['청주시','충주시','제천시','보은군','옥천군','영동군','증평군','진천군','괴산군','음성군','단양군'],
  '충남': ['천안시','공주시','보령시','아산시','서산시','논산시','계룡시','당진시','금산군','부여군','서천군','청양군','홍성군','예산군','태안군'],
  '대전': ['동구','중구','서구','유성구','대덕구'],
  '세종': ['세종시'],
  '전북': ['전주시','군산시','익산시','정읍시','남원시','김제시','완주군','진안군','무주군','장수군','임실군','순창군','고창군','부안군'],
  '전남': ['목포시','여수시','순천시','나주시','광양시','담양군','곡성군','구례군','고흥군','보성군','화순군','장흥군','강진군','해남군','영암군','무안군','함평군','영광군','장성군','완도군','진도군','신안군'],
  '광주': ['동구','서구','남구','북구','광산구'],
  '경북': ['포항시','경주시','김천시','안동시','구미시','영주시','영천시','상주시','문경시','경산시','군위군','의성군','청송군','영양군','영덕군','청도군','고령군','성주군','칠곡군','예천군','봉화군','울진군','울릉군'],
  '경남': ['창원시','진주시','통영시','사천시','김해시','밀양시','거제시','양산시','의령군','함안군','창녕군','고성군','남해군','하동군','산청군','함양군','거창군','합천군'],
  '대구': ['중구','동구','서구','남구','북구','수성구','달서구','달성군'],
  '부산': ['중구','서구','동구','영도구','부산진구','동래구','남구','북구','해운대구','사하구','금정구','강서구','연제구','수영구','사상구','기장군'],
  '울산': ['중구','남구','동구','북구','울주군'],
  '제주': ['제주시','서귀포시'],
}

const doList = Object.keys(regionTree)
const JOB_TYPES = ['전체','요양보호사','간병인','방문요양','가사도우미','사회복지사','간호조무사','물리치료사','활동지원사','작업치료사','돌봄교사']
const SHIFT_TYPES = ['전체','주간','야간','단기']
const POPULAR_TYPES = ['요양보호사','간병인','방문요양','사회복지사','간호조무사','물리치료사']
const ITEMS_PER_PAGE = 10

function makeKey(do_, si) { return si ? `${do_} ${si}` : do_ }
function getDo(location) { return location ? location.split(' ')[0] : '' }

export default function JobListingsPage() {
  const { user } = useAuth()
  const myJobs = jobs.filter(j => myJobIds.includes(j.id))
  const countApplicants = (jobId) => applicants.filter(a => a.jobId === jobId).length

  const [selectedRegions, setSelectedRegions] = useState([])
  const [panelOpen, setPanelOpen] = useState(false)
  const [panelDo, setPanelDo] = useState('')
  const [selectedJobType, setSelectedJobType] = useState('전체')
  const [selectedShift, setSelectedShift] = useState('전체')
  const [keyword, setKeyword] = useState('')
  const [sort, setSort] = useState('최신순')
  const [page, setPage] = useState(1)
  const panelRef = useRef(null)

  useEffect(() => {
    if (!panelOpen) return
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) setPanelOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [panelOpen])

  const toggleDo = (do_) => {
    if (selectedRegions.includes(do_)) {
      setSelectedRegions(prev => prev.filter(r => !r.startsWith(do_)))
    } else {
      setSelectedRegions(prev => [...prev.filter(r => !r.startsWith(do_)), do_])
    }
    setPanelDo(do_)
  }

  const toggleSi = (si) => {
    const key = makeKey(panelDo, si)
    if (selectedRegions.includes(key)) {
      setSelectedRegions(prev => prev.filter(r => r !== key))
    } else {
      setSelectedRegions(prev => [...prev.filter(r => r !== panelDo), key])
    }
  }

  const removeRegion = (key) => setSelectedRegions(prev => prev.filter(r => r !== key))
  const clearAll = () => { setSelectedRegions([]); setPanelDo(''); setSelectedJobType('전체'); setSelectedShift('전체'); setKeyword('') }

  const siList = panelDo ? regionTree[panelDo] || [] : []

  const filtered = jobs
    .filter(j => {
      if (selectedRegions.length === 0) return true
      return selectedRegions.some(r => {
        if (!r.includes(' ')) return getDo(j.location) === r
        const [do_, si] = r.split(' ')
        return getDo(j.location) === do_ && j.location.includes(si)
      })
    })
    .filter(j => selectedJobType === '전체' || j.type.includes(selectedJobType))
    .filter(j => selectedShift === '전체' || j.shift === selectedShift)
    .filter(j => !keyword || j.type.includes(keyword) || j.location.includes(keyword) || j.facility.includes(keyword))
    .sort((a, b) => sort === '임금높은순'
      ? parseInt(b.pay.replace(/[^0-9]/g, '')) - parseInt(a.pay.replace(/[^0-9]/g, ''))
      : a.id - b.id
    )

  useEffect(() => { setPage(1) }, [selectedRegions, selectedJobType, selectedShift, keyword, sort])

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  const SHIFT_COLOR = { '주간': { bg: '#e8f4ff', color: '#4A8FE7' }, '야간': { bg: '#1a2640', color: '#a0c0f0' }, '단기': { bg: '#e8fff0', color: '#2a9a5a' } }

  return (
    <>
      <HomeNav />
      <div className="jl2-root">

        {/* 히어로 */}
        <section className="jl2-hero">
          <div className="jl2-hero-inner">
            <p className="jl2-hero-eyebrow">전국 요양·돌봄 구인공고 플랫폼</p>
            <h1 className="jl2-hero-title">
              모든 구인공고를 <span className="jl2-hero-accent">한눈에</span> 확인하세요
            </h1>
            <div className="jl2-search-bar">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}>
                <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
              </svg>
              <input
                className="jl2-search-input"
                placeholder="직종, 지역, 시설명으로 검색"
                value={keyword}
                onChange={e => setKeyword(e.target.value)}
              />
              <button className="jl2-search-btn">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                </svg>
              </button>
            </div>
            <div className="jl2-type-row">
              <span className="jl2-type-label">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
                </svg>
                인기직종
              </span>
              {POPULAR_TYPES.map(t => (
                <button
                  key={t}
                  className={`jl2-type-chip${selectedJobType === t ? ' active' : ''}`}
                  onClick={() => setSelectedJobType(selectedJobType === t ? '전체' : t)}
                >{t}</button>
              ))}
            </div>
          </div>
        </section>

        {/* 바디 3-컬럼 */}
        <div className="jl2-body">
          <div className="jl2-body-inner">

            {/* 왼쪽 필터 사이드바 */}
            <aside className="jl2-filter">
              <div className="jl2-filter-header">
                <span className="jl2-filter-title">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
                  </svg>
                  필터
                </span>
                <button className="jl2-filter-reset" onClick={clearAll}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.99"/>
                  </svg>
                  초기화
                </button>
              </div>

              {/* 지역 */}
              <div className="jl2-filter-section">
                <div className="jl2-filter-sec-title">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                  </svg>
                  지역
                </div>
                <div className="jl2-region-wrap" ref={panelRef}>
                  <div className="jl2-region-trigger" onClick={() => setPanelOpen(v => !v)}>
                    {selectedRegions.length === 0
                      ? <span className="jl2-region-placeholder">지역 선택</span>
                      : <div className="jl2-region-chips">
                          {selectedRegions.map(r => (
                            <span key={r} className="jl2-region-chip">
                              {r}
                              <button className="jl2-region-chip-remove" onClick={e => { e.stopPropagation(); removeRegion(r) }}>×</button>
                            </span>
                          ))}
                        </div>
                    }
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
                  </div>
                  {panelOpen && (
                    <div className="jl2-region-panel">
                      <div className="jl2-panel-do-row">
                        {doList.map(d => {
                          const active = selectedRegions.includes(d) || selectedRegions.some(r => r.startsWith(d + ' '))
                          return (
                            <button
                              key={d}
                              className={`jl2-panel-do-chip${panelDo === d ? ' jl2-panel-do-chip--focused' : ''}${active ? ' jl2-panel-do-chip--active' : ''}`}
                              onClick={() => setPanelDo(panelDo === d ? '' : d)}
                            >{d}</button>
                          )
                        })}
                      </div>
                      {panelDo && (
                        <>
                          <div className="jl2-panel-divider" />
                          <div className="jl2-panel-si-header">
                            <span>{panelDo}</span>
                            <button
                              className={`jl2-panel-do-all${selectedRegions.includes(panelDo) ? ' jl2-panel-do-all--active' : ''}`}
                              onClick={() => toggleDo(panelDo)}
                            >전체 선택</button>
                          </div>
                          <div className="jl2-panel-si-row">
                            {siList.map(s => {
                              const key = makeKey(panelDo, s)
                              const active = selectedRegions.includes(key) || selectedRegions.includes(panelDo)
                              return (
                                <button
                                  key={s}
                                  className={`jl2-panel-si-chip${active ? ' jl2-panel-si-chip--active' : ''}`}
                                  onClick={() => toggleSi(s)}
                                >{s}</button>
                              )
                            })}
                          </div>
                        </>
                      )}
                      <div className="jl2-panel-footer">
                        <button className="jl2-panel-clear" onClick={() => { setSelectedRegions([]); setPanelDo('') }}>초기화</button>
                        <button className="jl2-panel-confirm" onClick={() => setPanelOpen(false)}>선택 완료</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 직종 */}
              <div className="jl2-filter-section">
                <div className="jl2-filter-sec-title">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
                  </svg>
                  직종
                </div>
                <div className="jl2-filter-select-wrap">
                  <select className="jl2-filter-select" value={selectedJobType} onChange={e => setSelectedJobType(e.target.value)}>
                    {JOB_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              {/* 근무시간대 */}
              <div className="jl2-filter-section">
                <div className="jl2-filter-sec-title">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                  </svg>
                  근무시간대
                </div>
                <div className="jl2-shift-chips">
                  {SHIFT_TYPES.map(s => (
                    <button key={s} className={`jl2-shift-chip${selectedShift === s ? ' active' : ''}`} onClick={() => setSelectedShift(s)}>{s}</button>
                  ))}
                </div>
              </div>

              <button className="jl2-filter-search-btn" onClick={() => setPage(1)}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                </svg>
                공고 검색
              </button>
            </aside>

            {/* 중앙: 공고 목록 */}
            <main className="jl2-main">
              <div className="jl2-list-header">
                <span className="jl2-list-count">총 <strong>{filtered.length}</strong>개의 공고</span>
                <div className="jl2-sort-tabs">
                  {['최신순','임금높은순'].map(s => (
                    <button key={s} className={`jl2-sort-tab${sort === s ? ' active' : ''}`} onClick={() => setSort(s)}>{s}</button>
                  ))}
                </div>
              </div>

              <div className="jl2-rows">
                {paginated.length === 0
                  ? <div className="jl2-empty">조건에 맞는 공고가 없습니다.</div>
                  : paginated.map(job => {
                    const shiftStyle = SHIFT_COLOR[job.shift] || { bg: '#f0f4fa', color: '#6b7a99' }
                    return (
                      <Link to={`/jobs/${job.id}`} className="jl2-job-row" key={job.id}>
                        <div className="jl2-job-row-main">
                          <div className="jl2-job-row-top">
                            <span className="jl2-job-row-badge" style={{ background: shiftStyle.bg, color: shiftStyle.color }}>
                              {job.shift}
                            </span>
                            <span className="jl2-job-row-type">{job.type}</span>
                            <span className="jl2-job-row-facility">{job.facility}</span>
                          </div>
                          <div className="jl2-job-row-meta">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{color:'#b0bdd4',flexShrink:0}}>
                              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                            </svg>
                            {job.location}
                            <span className="jl2-dot">·</span>
                            {job.workType}
                            <span className="jl2-dot">·</span>
                            {job.time}
                          </div>
                          <div className="jl2-job-row-tags">
                            {job.tags.slice(0, 3).map(t => (
                              <span key={t} className="jl2-job-row-tag">{t}</span>
                            ))}
                          </div>
                        </div>
                        <div className="jl2-job-row-right">
                          <div className="jl2-job-row-pay">{job.pay}</div>
                          <div className="jl2-job-row-footer">
                            <span className={`jl2-dday${job.dday <= 3 ? ' urgent' : ''}`}>
                              {job.dday === 0 ? 'D-DAY' : `D-${job.dday}`}
                            </span>
                            <span className="jl2-job-date">{job.date}</span>
                          </div>
                        </div>
                      </Link>
                    )
                  })
                }
              </div>

              {totalPages > 1 && (
                <div className="jl2-pagination">
                  <button className="jl2-page-btn" disabled={page === 1} onClick={() => setPage(page - 1)}>‹</button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button key={p} className={`jl2-page-btn${page === p ? ' jl2-page-btn--active' : ''}`} onClick={() => setPage(p)}>{p}</button>
                  ))}
                  <button className="jl2-page-btn" disabled={page === totalPages} onClick={() => setPage(page + 1)}>›</button>
                </div>
              )}
            </main>

            {/* 오른쪽 사이드바 */}
            <aside className="jl2-sidebar">
              {user?.userType === 'business' && myJobs.length > 0 && (
                <div className="jl2-sidebar-card">
                  <div className="jl2-sidebar-card-title">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4A8FE7" strokeWidth="2.2" strokeLinecap="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                    내 구인공고
                  </div>
                  {myJobs.map(job => (
                    <Link to={`/jobs/${job.id}`} key={job.id} className="jl2-my-job">
                      <div className="jl2-my-job-title">{job.type}</div>
                      <div className="jl2-my-job-meta">{job.location} · {job.pay}</div>
                      <div className="jl2-my-job-footer">
                        <span className="jl2-my-job-status">진행중</span>
                        <span className="jl2-my-job-cnt">지원자 {countApplicants(job.id)}명</span>
                      </div>
                    </Link>
                  ))}
                  <Link to="/manage" className="jl2-sidebar-more">채용 관리 →</Link>
                </div>
              )}

              <div className="jl2-sidebar-card jl2-sidebar-card--blue">
                <div className="jl2-sidebar-card-title" style={{color:'#fff'}}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                  구인공고 등록하기
                </div>
                <p className="jl2-sidebar-blue-desc">우리 시설에 딱 맞는 인재를 지금 바로 찾아보세요</p>
                <Link to="/jobs/post" className="jl2-sidebar-post-btn">공고 등록하기</Link>
              </div>

              <div className="jl2-sidebar-card">
                <div className="jl2-sidebar-card-title">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4A8FE7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                  </svg>
                  공고 알림 받기
                </div>
                <p className="jl2-sidebar-desc">조건에 맞는 새 공고가 올라오면 알려드려요</p>
                <div className="jl2-sidebar-fields">
                  <input className="jl2-sidebar-input" placeholder="관심 직종" />
                  <input className="jl2-sidebar-input" placeholder="희망 지역" />
                  <button className="jl2-sidebar-alert-btn">알림 신청</button>
                </div>
              </div>
            </aside>

          </div>
        </div>

        {/* 푸터 */}
        <footer className="jl2-footer">
          <div className="jl2-footer-links">
            <a href="#">이용약관</a><span>|</span>
            <a href="#">개인정보처리방침</a><span>|</span>
            <a href="#">운영정책</a><span>|</span>
            <a href="#">고객센터</a>
          </div>
          <p className="jl2-footer-copy">© 2025 Caregiver Platform. All rights reserved.</p>
        </footer>

      </div>
    </>
  )
}
