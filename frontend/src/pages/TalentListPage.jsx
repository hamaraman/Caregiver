import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import HomeNav from './home/HomeNav'
import { talents } from '../data/talents'
import { jobs } from '../data/jobs'
import { myJobIds } from '../data/applicants'
import { useAuth } from '../hooks/useAuth'
import './TalentListPage.css'

const myJobs = jobs.filter(j => myJobIds.includes(j.id))
const myRegions = [...new Set(myJobs.map(j => j.region))]
const myJobTypes = [...new Set(myJobs.map(j => j.jobType))]

const expOrder = { '신입':0,'1년 이상':1,'2년 이상':2,'3년 이상':3,'4년 이상':4,'5년 이상':5,'7년 이상':7,'8년 이상':8,'10년 이상':10,'12년 이상':12 }
const expNum = (str) => expOrder[str] ?? 0

const myMinExp = Math.min(...myJobs.map(j => expNum(j.experience)))

function scoreTalent(t) {
  let score = 0
  const tags = []
  if (myRegions.includes(t.region)) { score += 2; tags.push('지역 일치') }
  if (myJobTypes.includes(t.jobType)) { score += 2; tags.push('직종 일치') }
  if (expNum(t.experience) >= myMinExp) { score += 1; tags.push('경력 충족') }
  return { score, tags }
}

const recommendedTalents = talents
  .map(t => ({ ...t, ...scoreTalent(t) }))
  .filter(t => t.score >= 3)
  .sort((a, b) => b.score - a.score || expNum(b.experience) - expNum(a.experience))
  .slice(0, 4)

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
const JOB_TYPES = ['전체','요양보호사','간병인','가사도우미','사회복지사','간호사','간호조무사','물리치료사','활동지원사','조리원','영양사','시설장','사무원','운전원']
const POPULAR_JOB_TYPES = ['요양보호사','간병인','가사도우미','사회복지사','간호사','활동지원사']
const EXP_OPTIONS = ['전체','신입','1년 이상','3년 이상','5년 이상','10년 이상']

function makeKey(do_, si) { return si ? `${do_} ${si}` : do_ }

export default function TalentListPage() {
  const { user } = useAuth()
  const [selectedRegions, setSelectedRegions] = useState([])
  const [panelOpen, setPanelOpen] = useState(false)
  const [panelDo, setPanelDo] = useState('')
  const [selectedJobType, setSelectedJobType] = useState('전체')
  const [expFilter, setExpFilter] = useState('전체')
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
  const clearAll = () => { setSelectedRegions([]); setPanelDo(''); setSelectedJobType('전체'); setExpFilter('전체'); setKeyword('') }

  const siList = panelDo ? regionTree[panelDo] || [] : []

  const filtered = talents
    .filter(t => {
      if (selectedRegions.length === 0) return true
      return selectedRegions.some(r => {
        if (!r.includes(' ')) return t.region === r
        const [do_, si] = r.split(' ')
        return t.region === do_ && t.location.includes(si)
      })
    })
    .filter(t => selectedJobType === '전체' || t.jobType === selectedJobType)
    .filter(t => expFilter === '전체' || expNum(t.experience) >= expNum(expFilter))
    .filter(t => !keyword || t.jobType.includes(keyword) || t.wishRegion.includes(keyword) || t.certs.some(c => c.includes(keyword)))
    .sort((a, b) => sort === '경력순' ? expNum(b.experience) - expNum(a.experience) : a.id - b.id)

  useEffect(() => { setPage(1) }, [selectedRegions, selectedJobType, expFilter, keyword, sort])

  const ITEMS_PER_PAGE = 10
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  return (
    <>
      <HomeNav />
      <div className="tl-root">

        {/* 히어로 */}
        <section className="tl-hero">
          <div className="tl-hero-inner">
            <p className="tl-hero-eyebrow">전국 요양·돌봄 인재 플랫폼</p>
            <h1 className="tl-hero-title">
              원하는 인재를 <span className="tl-hero-accent">지금 바로</span> 찾아보세요
            </h1>
            <div className="tl-search-bar">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}>
                <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
              </svg>
              <input
                className="tl-search-input"
                placeholder="자격증, 직종, 희망지역 검색"
                value={keyword}
                onChange={e => setKeyword(e.target.value)}
              />
              <button className="tl-search-btn">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                </svg>
              </button>
            </div>
            <div className="tl-jobtype-row">
              <span className="tl-jobtype-label">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
                인기직종
              </span>
              {POPULAR_JOB_TYPES.map(j => (
                <button
                  key={j}
                  className={`tl-jobtype-chip${selectedJobType === j ? ' active' : ''}`}
                  onClick={() => setSelectedJobType(selectedJobType === j ? '전체' : j)}
                >{j}</button>
              ))}
            </div>
          </div>
        </section>

        {/* 바디 3-컬럼 */}
        <div className="tl-body">
          <div className="tl-body-inner">

            {/* 왼쪽: 필터 사이드바 */}
            <aside className="tl-filter">
              <div className="tl-filter-header">
                <span className="tl-filter-title">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
                  </svg>
                  필터
                </span>
                <button className="tl-filter-reset" onClick={clearAll}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.99"/>
                  </svg>
                  초기화
                </button>
              </div>

              {/* 지역 */}
              <div className="tl-filter-section">
                <div className="tl-filter-sec-title">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                  </svg>
                  지역
                </div>
                <div className="tl-region-wrap" ref={panelRef}>
                  <div className="tl-region-trigger" onClick={() => setPanelOpen(v => !v)}>
                    {selectedRegions.length === 0
                      ? <span className="tl-region-placeholder">지역 선택</span>
                      : <div className="tl-region-chips">
                          {selectedRegions.map(r => (
                            <span key={r} className="tl-region-chip">
                              {r}
                              <button className="tl-region-chip-remove" onClick={e => { e.stopPropagation(); removeRegion(r) }}>×</button>
                            </span>
                          ))}
                        </div>
                    }
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
                  </div>

                  {panelOpen && (
                    <div className="tl-region-panel">
                      <div className="tl-panel-do-row">
                        {doList.map(d => {
                          const active = selectedRegions.includes(d) || selectedRegions.some(r => r.startsWith(d + ' '))
                          return (
                            <button
                              key={d}
                              className={`tl-panel-do-chip${panelDo === d ? ' tl-panel-do-chip--focused' : ''}${active ? ' tl-panel-do-chip--active' : ''}`}
                              onClick={() => setPanelDo(panelDo === d ? '' : d)}
                            >{d}</button>
                          )
                        })}
                      </div>
                      {panelDo && (
                        <>
                          <div className="tl-panel-divider" />
                          <div className="tl-panel-si-header">
                            <span>{panelDo}</span>
                            <button
                              className={`tl-panel-do-all${selectedRegions.includes(panelDo) ? ' tl-panel-do-all--active' : ''}`}
                              onClick={() => toggleDo(panelDo)}
                            >전체 선택</button>
                          </div>
                          <div className="tl-panel-si-row">
                            {siList.map(s => {
                              const key = makeKey(panelDo, s)
                              const active = selectedRegions.includes(key) || selectedRegions.includes(panelDo)
                              return (
                                <button
                                  key={s}
                                  className={`tl-panel-si-chip${active ? ' tl-panel-si-chip--active' : ''}`}
                                  onClick={() => toggleSi(s)}
                                >{s}</button>
                              )
                            })}
                          </div>
                        </>
                      )}
                      <div className="tl-panel-footer">
                        <button className="tl-panel-clear" onClick={() => { setSelectedRegions([]); setPanelDo('') }}>초기화</button>
                        <button className="tl-panel-confirm" onClick={() => setPanelOpen(false)}>선택 완료</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 직종 */}
              <div className="tl-filter-section">
                <div className="tl-filter-sec-title">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
                  </svg>
                  직종
                </div>
                <div className="tl-filter-select-wrap">
                  <select className="tl-filter-select" value={selectedJobType} onChange={e => setSelectedJobType(e.target.value)}>
                    {JOB_TYPES.map(j => <option key={j} value={j}>{j}</option>)}
                  </select>
                </div>
              </div>

              {/* 경력 */}
              <div className="tl-filter-section">
                <div className="tl-filter-sec-title">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                  </svg>
                  경력
                </div>
                <div className="tl-filter-select-wrap">
                  <select className="tl-filter-select" value={expFilter} onChange={e => setExpFilter(e.target.value)}>
                    {EXP_OPTIONS.map(e => <option key={e} value={e}>{e}</option>)}
                  </select>
                </div>
              </div>

              <button className="tl-filter-search-btn" onClick={() => setPage(1)}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                </svg>
                인재 검색
              </button>
            </aside>

            {/* 중앙: 인재 목록 */}
            <main className="tl-main">
              <div className="tl-list-header">
                <span className="tl-list-count">총 <strong>{filtered.length}</strong>명의 인재</span>
                <div className="tl-sort-tabs">
                  {['최신순','경력순'].map(s => (
                    <button key={s} className={`tl-sort-tab${sort === s ? ' active' : ''}`} onClick={() => setSort(s)}>{s}</button>
                  ))}
                </div>
              </div>

              <div className="tl-rows">
                {paginated.length === 0
                  ? <div className="tl-empty">조건에 맞는 인재가 없습니다.</div>
                  : paginated.map(t => (
                    <Link to={`/talents/${t.id}`} className="tl-talent-row" key={t.id}>
                      <div className="tl-talent-row-left">
                        <div className={`tl-talent-avatar tl-talent-avatar--${t.gender === '여' ? 'f' : 'm'}`}>
                          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={t.gender === '여' ? '#e91e8c' : '#5b8def'} strokeWidth="1.8">
                            <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                          </svg>
                        </div>
                        <div className="tl-talent-row-body">
                          <div className="tl-talent-row-top">
                            <span className="tl-talent-name">{t.name}</span>
                            <span className={`tl-gender-badge tl-gender-badge--${t.gender === '여' ? 'f' : 'm'}`}>{t.gender}</span>
                            <span className="tl-age">{t.age}세</span>
                            <span className="tl-status-badge">구직중</span>
                          </div>
                          <div className="tl-talent-row-meta">
                            {t.jobType}
                            <span className="tl-row-dot">·</span>
                            {t.experience}
                            <span className="tl-row-dot">·</span>
                            {t.wishRegion}
                          </div>
                          <div className="tl-talent-row-tags">
                            {t.certs.slice(0, 2).map(c => (
                              <span key={c} className="tl-talent-tag">{c}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="tl-talent-row-right">
                        <span className="tl-talent-wage">{t.wageType} {t.wageAmount.toLocaleString()}원</span>
                        <span className="tl-talent-worktype">{t.workType}</span>
                      </div>
                    </Link>
                  ))
                }
              </div>

              {totalPages > 1 && (
                <div className="tl-pagination">
                  <button className="tl-page-btn" disabled={page === 1} onClick={() => setPage(page - 1)}>‹</button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button
                      key={p}
                      className={`tl-page-btn${page === p ? ' tl-page-btn--active' : ''}`}
                      onClick={() => setPage(p)}
                    >{p}</button>
                  ))}
                  <button className="tl-page-btn" disabled={page === totalPages} onClick={() => setPage(page + 1)}>›</button>
                </div>
              )}
            </main>

            {/* 오른쪽: 사이드바 */}
            <aside className="tl-sidebar">
              {user?.userType === 'business' && recommendedTalents.length > 0 && (
                <div className="tl-sidebar-card">
                  <div className="tl-sidebar-card-title">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="#4A8FE7" stroke="#4A8FE7" strokeWidth="1.5" strokeLinejoin="round"/>
                    </svg>
                    맞춤 인재 추천
                  </div>
                  {recommendedTalents.map(t => (
                    <Link to={`/talents/${t.id}`} key={t.id} className="tl-sidebar-talent">
                      <div className={`tl-rec-avatar tl-rec-avatar--${t.gender === '여' ? 'f' : 'm'}`}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={t.gender === '여' ? '#e91e8c' : '#5b8def'} strokeWidth="1.8">
                          <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                        </svg>
                      </div>
                      <div className="tl-sidebar-talent-info">
                        <div className="tl-sidebar-talent-name">
                          {t.name}
                          <span className={`tl-gender-badge tl-gender-badge--${t.gender === '여' ? 'f' : 'm'}`}>{t.gender}</span>
                        </div>
                        <div className="tl-sidebar-talent-meta">{t.jobType} · {t.experience}</div>
                      </div>
                      <div className="tl-sidebar-talent-wage">{t.wageAmount.toLocaleString()}원</div>
                    </Link>
                  ))}
                </div>
              )}

              <div className="tl-sidebar-card tl-sidebar-card--blue">
                <div className="tl-sidebar-card-title" style={{color:'#fff'}}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                  </svg>
                  인재 알림 받기
                </div>
                <p className="tl-sidebar-blue-desc">조건에 맞는 새 인재가 등록되면 알려드려요</p>
                <div className="tl-sidebar-blue-fields">
                  <input className="tl-sidebar-input" placeholder="관심 직종 입력" />
                  <input className="tl-sidebar-input" placeholder="희망 지역 입력" />
                  <button className="tl-sidebar-alert-btn">알림 신청하기</button>
                </div>
              </div>
            </aside>

          </div>
        </div>


      </div>
    </>
  )
}
