import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { jobs } from '../data/jobs'
import { myJobIds } from '../data/applicants'
import { useAuth } from '../hooks/useAuth'
import './JobListingsPage.css'

const regionTree = {
  '전체': [],
  '서울': ['강남구', '서초구', '송파구', '강동구', '마포구', '영등포구', '종로구', '중구', '용산구', '성동구', '광진구', '노원구', '강북구', '도봉구', '은평구', '서대문구', '동대문구', '중랑구', '성북구', '강서구', '양천구', '구로구', '금천구', '관악구', '동작구'],
  '경기': ['수원시', '성남시', '고양시', '용인시', '부천시', '안산시', '화성시', '남양주시', '안양시', '평택시', '시흥시', '파주시', '의정부시', '김포시', '광명시', '광주시', '하남시', '군포시', '오산시', '이천시', '안성시', '양주시', '구리시', '포천시', '의왕시', '여주시', '동두천시', '과천시', '가평군', '양평군', '연천군'],
  '인천': ['미추홀구', '연수구', '남동구', '부평구', '계양구', '서구', '중구', '동구', '강화군', '옹진군'],
  '강원': ['춘천시', '원주시', '강릉시', '동해시', '태백시', '속초시', '삼척시', '홍천군', '횡성군', '영월군', '평창군', '정선군', '철원군', '화천군', '양구군', '인제군', '고성군', '양양군'],
  '충북': ['청주시', '충주시', '제천시', '보은군', '옥천군', '영동군', '증평군', '진천군', '괴산군', '음성군', '단양군'],
  '충남': ['천안시', '공주시', '보령시', '아산시', '서산시', '논산시', '계룡시', '당진시', '금산군', '부여군', '서천군', '청양군', '홍성군', '예산군', '태안군'],
  '대전': ['동구', '중구', '서구', '유성구', '대덕구'],
  '세종': ['세종시'],
  '전북': ['전주시', '군산시', '익산시', '정읍시', '남원시', '김제시', '완주군', '진안군', '무주군', '장수군', '임실군', '순창군', '고창군', '부안군'],
  '전남': ['목포시', '여수시', '순천시', '나주시', '광양시', '담양군', '곡성군', '구례군', '고흥군', '보성군', '화순군', '장흥군', '강진군', '해남군', '영암군', '무안군', '함평군', '영광군', '장성군', '완도군', '진도군', '신안군'],
  '광주': ['동구', '서구', '남구', '북구', '광산구'],
  '경북': ['포항시', '경주시', '김천시', '안동시', '구미시', '영주시', '영천시', '상주시', '문경시', '경산시', '군위군', '의성군', '청송군', '영양군', '영덕군', '청도군', '고령군', '성주군', '칠곡군', '예천군', '봉화군', '울진군', '울릉군'],
  '경남': ['창원시', '진주시', '통영시', '사천시', '김해시', '밀양시', '거제시', '양산시', '의령군', '함안군', '창녕군', '고성군', '남해군', '하동군', '산청군', '함양군', '거창군', '합천군'],
  '대구': ['중구', '동구', '서구', '남구', '북구', '수성구', '달서구', '달성군'],
  '부산': ['중구', '서구', '동구', '영도구', '부산진구', '동래구', '남구', '북구', '해운대구', '사하구', '금정구', '강서구', '연제구', '수영구', '사상구', '기장군'],
  '울산': ['중구', '남구', '동구', '북구', '울주군'],
  '제주': ['제주시', '서귀포시'],
}

const doList = Object.keys(regionTree).filter(d => d !== '전체')
const jobTypes = ['전체', '요양보호사', '간병인', '가사도우미', '사회복지사', '간호사', '간호조무사', '물리치료사', '활동지원사', '조리원', '영양사', '시설장', '사무원', '운전원']
const workTypes = ['전체', '출·퇴근형', '입주형', '재택형', '협의후결정']
const ITEMS_PER_PAGE = 10

// key: "서울 강남구" or "경기" (도 전체)
function makeKey(do_, si) {
  return si ? `${do_} ${si}` : do_
}

export default function JobListingsPage() {
  const { user } = useAuth()
  const myJobs = jobs.filter(j => myJobIds.includes(j.id))
  const [selectedRegions, setSelectedRegions] = useState([]) // ["서울 강남구", "경기"]
  const [panelOpen, setPanelOpen] = useState(false)
  const [panelDo, setPanelDo] = useState('')            // 패널 내 현재 도
  const [selectedJobType, setSelectedJobType] = useState('전체')
  const [jobTypeExpanded, setJobTypeExpanded] = useState(false)
  const [selectedWorkType, setSelectedWorkType] = useState('전체')
  const [showWageHint, setShowWageHint] = useState(false)
  const [sortOrder, setSortOrder] = useState('최신순')
  const [quickFilter, setQuickFilter] = useState('')
  const [wageType, setWageType] = useState('전체')
  const [wageMin, setWageMin] = useState('')
  const [wageMax, setWageMax] = useState('')
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [likedJobs, setLikedJobs] = useState({})
  const panelRef = useRef(null)

  // 패널 외부 클릭 시 닫기
  useEffect(() => {
    if (!panelOpen) return
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setPanelOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [panelOpen])

  const toggleLike = (id) => setLikedJobs((prev) => ({ ...prev, [id]: !prev[id] }))

  const openPanel = () => {
    setPanelDo(panelDo || '')
    setPanelOpen(true)
  }

  // 패널에서 도 전체 선택/해제
  const toggleDo = (do_) => {
    const key = do_
    if (selectedRegions.includes(key)) {
      // 해당 도 전체 및 시·구 항목 모두 제거
      setSelectedRegions(prev => prev.filter(r => !r.startsWith(do_)))
    } else {
      // 기존에 해당 도의 시·구 항목들 제거 후 도 전체 추가
      setSelectedRegions(prev => [...prev.filter(r => !r.startsWith(do_)), key])
    }
    setPanelDo(do_)
    setPage(1)
  }

  // 패널에서 시·구 선택/해제
  const toggleSi = (si) => {
    const key = makeKey(panelDo, si)
    const doKey = panelDo
    if (selectedRegions.includes(key)) {
      setSelectedRegions(prev => prev.filter(r => r !== key))
    } else {
      // 도 전체 선택 해제 후 시·구 추가
      setSelectedRegions(prev => [...prev.filter(r => r !== doKey), key])
    }
    setPage(1)
  }

  // 선택된 지역 개별 제거
  const removeRegion = (key) => {
    setSelectedRegions(prev => prev.filter(r => r !== key))
    setPage(1)
  }

  // 전체 초기화
  const clearRegions = () => {
    setSelectedRegions([])
    setPanelDo('')
    setPage(1)
  }

  const siList = panelDo ? regionTree[panelDo] || [] : []

  const filtered = jobs.filter((job) => {
    const matchRegion =
      selectedRegions.length === 0 ||
      selectedRegions.some((r) => {
        if (!r.includes(' ')) {
          return job.region === r
        }
        const [do_, si] = r.split(' ')
        return job.region === do_ && job.location.includes(si)
      })
    const matchType = selectedJobType === '전체' || job.jobType === selectedJobType
    const matchWork = selectedWorkType === '전체' || job.workType === selectedWorkType
    const matchWage = (() => {
      if (wageType !== '전체' && job.type !== wageType) return false
      const amount = parseInt(job.wage.replace(/[^0-9]/g, ''))
      if (wageMin !== '' && amount < parseInt(wageMin.replace(/,/g, ''))) return false
      if (wageMax !== '' && amount > parseInt(wageMax.replace(/,/g, ''))) return false
      return true
    })()
    const matchQuery = !query || job.title.includes(query) || job.location.includes(query)
    const matchQuick = !quickFilter || job.badge === quickFilter
    return matchRegion && matchType && matchWork && matchWage && matchQuery && matchQuick
  })

  // 시급을 월급 환산(×176)해서 비교
  const toMonthly = (job) => {
    const amount = parseInt(job.wage.replace(/[^0-9]/g, ''))
    return job.type === '시급' ? amount * 176 : amount
  }

  const sorted = [...filtered].sort((a, b) => {
    if (sortOrder === '임금높은순') return toMonthly(b) - toMonthly(a)
    return a.id - b.id  // 최신순: id 낮을수록 최신
  })

  const totalPages = Math.ceil(sorted.length / ITEMS_PER_PAGE)
  const paginated = sorted.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  return (
    <div className="app">
      <Header />
      <main className="jl-page">
        <div className="container">

          <div className="jl-top">
            <div className="jl-breadcrumb">
              <Link to="/">홈</Link> › 구인공고 목록
            </div>
            <h2 className="jl-title">구인공고 목록</h2>
          </div>

          <div className="jl-filter-bar">
            {/* 검색 — 전체 너비 */}
            <div className="jl-search">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/>
                <path d="M16.5 16.5L21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <input
                type="text"
                placeholder="직종, 지역으로 검색해보세요"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setPage(1) }}
              />
              <button className="jl-search-btn" aria-label="검색">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle cx="11" cy="11" r="7" stroke="#fff" strokeWidth="2.5"/>
                  <path d="M16.5 16.5L21 21" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            <div className="jl-filter-body">
              <div className="jl-filter-left">
                <div className="jl-filters">
              {/* 지역 선택 — 팝업 트리거 */}
              <div className="jl-filter-group">
                <span className="jl-filter-label">지역</span>
                <div className="jl-region-wrap" ref={panelRef}>
                  {/* 트리거 */}
                  <div className="jl-region-trigger" onClick={openPanel}>
                    {selectedRegions.length === 0 ? (
                      <span className="jl-region-placeholder">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#e91e8c" strokeWidth="2.5">
                          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                          <circle cx="12" cy="9" r="2.5"/>
                        </svg>
                        지역 선택
                      </span>
                    ) : (
                      <div className="jl-region-selected-chips">
                        {selectedRegions.map((r) => (
                          <span key={r} className="jl-region-chip">
                            {r}
                            <button
                              className="jl-region-chip-remove"
                              onClick={(e) => { e.stopPropagation(); removeRegion(r) }}
                            >×</button>
                          </span>
                        ))}
                      </div>
                    )}
                    <svg className="jl-region-arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2.5">
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </div>

                  {/* 팝업 패널 */}
                  {panelOpen && (
                    <div className="jl-region-panel">
                      {/* 도 선택 행 */}
                      <div className="jl-panel-do-row">
                        {doList.map((d) => {
                          const isDo = selectedRegions.includes(d)
                          const hasSi = selectedRegions.some(r => r.startsWith(d + ' '))
                          const active = isDo || hasSi
                          return (
                            <button
                              key={d}
                              className={`jl-panel-do-chip ${panelDo === d ? 'jl-panel-do-chip--focused' : ''} ${active ? 'jl-panel-do-chip--active' : ''}`}
                              onClick={() => setPanelDo(panelDo === d ? '' : d)}
                            >{d}</button>
                          )
                        })}
                      </div>

                      {/* 시·구 선택 영역 */}
                      {panelDo && (
                        <>
                          <div className="jl-panel-divider" />
                          <div className="jl-panel-si-header">
                            <span>{panelDo}</span>
                            <button
                              className={`jl-panel-do-all ${selectedRegions.includes(panelDo) ? 'jl-panel-do-all--active' : ''}`}
                              onClick={() => toggleDo(panelDo)}
                            >전체 선택</button>
                          </div>
                          <div className="jl-panel-si-row">
                            {siList.map((s) => {
                              const key = makeKey(panelDo, s)
                              const active = selectedRegions.includes(key) || selectedRegions.includes(panelDo)
                              return (
                                <button
                                  key={s}
                                  className={`jl-panel-si-chip ${active ? 'jl-panel-si-chip--active' : ''}`}
                                  onClick={() => toggleSi(s)}
                                >{s}</button>
                              )
                            })}
                          </div>
                        </>
                      )}

                      {/* 하단 버튼 */}
                      <div className="jl-panel-footer">
                        <button className="jl-panel-clear" onClick={clearRegions}>초기화</button>
                        <button className="jl-panel-confirm" onClick={() => setPanelOpen(false)}>선택 완료</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 직종 */}
              <div className="jl-filter-group">
                <span className="jl-filter-label">직종</span>
                <div className="jl-chip-wrap">
                  {(jobTypeExpanded ? jobTypes : jobTypes.slice(0, 7)).map((t) => (
                    <button
                      key={t}
                      className={`jl-chip ${selectedJobType === t ? 'jl-chip--active' : ''}`}
                      onClick={() => { setSelectedJobType(t); setPage(1) }}
                    >{t}</button>
                  ))}
                  <button
                    className="jl-chip jl-chip--more"
                    onClick={() => setJobTypeExpanded(v => !v)}
                  >
                    {jobTypeExpanded ? '접기 ↑' : `더보기 +${jobTypes.length - 7}`}
                  </button>
                </div>
              </div>

              {/* 근무형태 */}
              <div className="jl-filter-group">
                <span className="jl-filter-label">형태</span>
                {workTypes.map((w) => (
                  <button
                    key={w}
                    className={`jl-chip ${selectedWorkType === w ? 'jl-chip--active' : ''}`}
                    onClick={() => { setSelectedWorkType(w); setPage(1) }}
                  >{w}</button>
                ))}
              </div>

              {/* 급여 */}
              <div className="jl-filter-group jl-filter-group--wage">
                <span className="jl-filter-label">급여</span>
                <div className="jl-wage-row">
                  {['전체', '시급', '월급'].map((w) => (
                    <button
                      key={w}
                      className={`jl-chip ${wageType === w ? 'jl-chip--active' : ''}`}
                      onClick={() => { setWageType(w); setWageMin(''); setWageMax(''); setPage(1) }}
                    >{w}</button>
                  ))}
                  <div
                    className="jl-wage-range"
                    onMouseEnter={() => wageType === '전체' && setShowWageHint(true)}
                    onMouseLeave={() => setShowWageHint(false)}
                  >
                    <input
                      className={`jl-wage-input ${wageType === '전체' ? 'jl-wage-input--disabled' : ''}`}
                      type="number"
                      placeholder="최소 (원)"
                      value={wageMin}
                      min="0"
                      disabled={wageType === '전체'}
                      onChange={(e) => { setWageMin(e.target.value); setPage(1) }}
                    />
                    <span className={`jl-wage-sep ${wageType === '전체' ? 'jl-wage-sep--disabled' : ''}`}>~</span>
                    <input
                      className={`jl-wage-input ${wageType === '전체' ? 'jl-wage-input--disabled' : ''}`}
                      type="number"
                      placeholder="최대 (원)"
                      value={wageMax}
                      min="0"
                      disabled={wageType === '전체'}
                      onChange={(e) => { setWageMax(e.target.value); setPage(1) }}
                    />
                    {showWageHint && (
                      <div className="jl-wage-hint">급여 형태 선택 후 입력</div>
                    )}
                  </div>
                </div>
              </div>
              </div>  {/* jl-filters */}
            </div>    {/* jl-filter-left */}

              {/* 오른쪽: 정렬 + 빠른 조건 */}
              <div className="jl-filter-right">
                <div className="jl-right-section">
                  <span className="jl-right-label">정렬</span>
                  <div className="jl-sort-btns">
                    {['최신순', '임금높은순'].map((s) => (
                      <button
                        key={s}
                        className={`jl-sort-btn ${sortOrder === s ? 'jl-sort-btn--active' : ''}`}
                        onClick={() => { setSortOrder(s); setPage(1) }}
                      >{s}</button>
                    ))}
                  </div>
                </div>
                <div className="jl-right-divider" />
                <div className="jl-right-section">
                  <span className="jl-right-label">빠른 조건</span>
                  <div className="jl-sort-btns">
                    {['급구', '추천'].map((q) => (
                      <button
                        key={q}
                        className={`jl-sort-btn ${quickFilter === q ? 'jl-sort-btn--active' : ''}`}
                        onClick={() => { setQuickFilter(quickFilter === q ? '' : q); setPage(1) }}
                      >{q}</button>
                    ))}
                  </div>
                </div>
              </div>
            </div>  {/* jl-filter-body */}
          </div>    {/* jl-filter-bar */}

          {/* 내가 쓴 공고 */}
          {user?.userType === 'business' && myJobs.length > 0 && (
            <div className="jl-myposts">
              <div className="jl-myposts-header">
                <span className="jl-myposts-title">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#e91e8c" strokeWidth="2.2" strokeLinecap="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                  내 구인공고
                </span>
                <Link to="/manage" className="jl-myposts-manage">채용 관리 →</Link>
              </div>
              <div className="jl-myposts-list">
                {myJobs.map(job => (
                  <Link to={`/jobs/${job.id}`} key={job.id} className="jl-mypost-card">
                    <span className="jl-mypost-badge">진행중</span>
                    <p className="jl-mypost-title">{job.postTitle || job.title}</p>
                    <p className="jl-mypost-meta">{job.location} · {job.wage}</p>
                    <p className="jl-mypost-date">등록 {job.date}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* 결과 수 */}
          <div className="jl-result-count">
            총 <strong>{sorted.length}</strong>개의 공고
          </div>

          {/* 목록 */}
          <div className="jl-table">
            {paginated.length === 0 ? (
              <div className="jl-empty">조건에 맞는 공고가 없습니다.</div>
            ) : paginated.map((job) => (
              <div className="jl-row" key={job.id}>
                <div className="jl-title-cell">
                  <Link to={`/jobs/${job.id}`} className="jl-job-title">{job.title}</Link>
                  {job.badge && (
                    <span className={`job-badge job-badge--${job.badgeColor}`}>{job.badge}</span>
                  )}
                </div>
                <div className="jl-location">{job.location}</div>
                <div className="jl-wage">{job.wage}</div>
                <div className="jl-hours">{job.hours}</div>
                <div className="jl-days">{job.days}</div>
                <div className="jl-date">{job.date}</div>
                <button
                  className={`job-like ${likedJobs[job.id] ? 'job-like--active' : ''}`}
                  onClick={() => toggleLike(job.id)}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24"
                    fill={likedJobs[job.id] ? '#e91e8c' : 'none'}
                    stroke={likedJobs[job.id] ? '#e91e8c' : '#ccc'}
                    strokeWidth="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                </button>
              </div>
            ))}
          </div>

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div className="jl-pagination">
              <button className="jl-page-btn" disabled={page === 1} onClick={() => setPage(page - 1)}>‹</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  className={`jl-page-btn ${page === p ? 'jl-page-btn--active' : ''}`}
                  onClick={() => setPage(p)}
                >{p}</button>
              ))}
              <button className="jl-page-btn" disabled={page === totalPages} onClick={() => setPage(page + 1)}>›</button>
            </div>
          )}

        </div>
      </main>
      <Footer />
    </div>
  )
}
