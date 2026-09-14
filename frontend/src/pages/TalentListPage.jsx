import { useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
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

const doList = ['서울','경기','인천','강원','충북','충남','대전','세종','전북','전남','광주','경북','경남','대구','부산','울산','제주']
const jobTypes = ['전체','요양보호사','간병인','가사도우미','사회복지사','간호사','간호조무사','물리치료사','활동지원사','조리원','영양사','시설장','사무원','운전원']
const expOptions = ['전체','신입','1년 이상','3년 이상','5년 이상','10년 이상']
const popularJobTypes = ['요양보호사','간병인','가사도우미','사회복지사','간호사','활동지원사']

export default function TalentListPage() {
  const { user } = useAuth()
  const [keyword, setKeyword] = useState('')
  const [sidebarRegion, setSidebarRegion] = useState('')
  const [selectedJobType, setSelectedJobType] = useState('전체')
  const [expFilter, setExpFilter] = useState('전체')
  const [sort, setSort] = useState('최신순')
  const [viewMode, setViewMode] = useState(() => localStorage.getItem('tl-viewMode') || 'list')
  const [page, setPage] = useState(1)
  const [alertJob, setAlertJob] = useState('')
  const [alertRegion, setAlertRegion] = useState('')

  const filtered = talents
    .filter(t => !sidebarRegion || t.region === sidebarRegion || t.wishRegion.includes(sidebarRegion))
    .filter(t => selectedJobType === '전체' || t.jobType === selectedJobType)
    .filter(t => expFilter === '전체' || expNum(t.experience) >= expNum(expFilter))
    .filter(t => !keyword || t.jobType.includes(keyword) || t.wishRegion.includes(keyword) || t.certs.some(c => c.includes(keyword)))
    .sort((a, b) => sort === '경력순' ? expNum(b.experience) - expNum(a.experience) : a.id - b.id)

  const ITEMS_PER_PAGE = 10
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  const resetFilters = () => {
    setSidebarRegion('')
    setSelectedJobType('전체')
    setExpFilter('전체')
    setKeyword('')
    setPage(1)
  }

  return (
    <>
      <Header />

      {/* ── Hero ── */}
      <section className="tl-hero">
        <div className="container">
          <p className="tl-hero-eyebrow">전국 요양·돌봄 인재 플랫폼</p>
          <h1 className="tl-hero-title">원하는 인재를 <span className="tl-hero-accent">지금 바로</span> 찾아보세요</h1>
          <div className="tl-hero-search">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            <input
              className="tl-hero-input"
              type="text"
              placeholder="자격증, 직종, 희망지역 검색"
              value={keyword}
              onChange={e => { setKeyword(e.target.value); setPage(1) }}
            />
            <button className="tl-hero-search-btn" aria-label="검색">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            </button>
          </div>
          <div className="tl-hero-tags">
            <span className="tl-hero-tag-label">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
              인기직종
            </span>
            {popularJobTypes.map(tag => (
              <button
                key={tag}
                className={`tl-hero-tag${selectedJobType === tag ? ' tl-hero-tag--active' : ''}`}
                onClick={() => { setSelectedJobType(tag); setPage(1) }}
              >{tag}</button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Page body ── */}
      <div className="tl-page">
        <div className="container">
          <div className="tl-body">

            {/* Left sidebar */}
            <aside className="tl-sidebar">
              <div className="tl-sidebar-header">
                <span className="tl-sidebar-title">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="20" y2="12"/><line x1="12" y1="18" x2="20" y2="18"/></svg>
                  필터
                </span>
                <button className="tl-sidebar-reset" onClick={resetFilters}>초기화</button>
              </div>

              <div className="tl-sidebar-group">
                <label className="tl-sidebar-label">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
                  지역
                </label>
                <select className="tl-sidebar-select" value={sidebarRegion} onChange={e => { setSidebarRegion(e.target.value); setPage(1) }}>
                  <option value="">지역 선택</option>
                  {doList.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              <div className="tl-sidebar-group">
                <label className="tl-sidebar-label">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
                  직종
                </label>
                <select className="tl-sidebar-select" value={selectedJobType} onChange={e => { setSelectedJobType(e.target.value); setPage(1) }}>
                  {jobTypes.map(j => <option key={j} value={j}>{j}</option>)}
                </select>
              </div>

              <div className="tl-sidebar-group">
                <label className="tl-sidebar-label">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  경력
                </label>
                <select className="tl-sidebar-select" value={expFilter} onChange={e => { setExpFilter(e.target.value); setPage(1) }}>
                  {expOptions.map(e => <option key={e} value={e}>{e}</option>)}
                </select>
              </div>

              <button className="tl-sidebar-btn" onClick={() => setPage(1)}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
                인재 검색
              </button>
            </aside>

            {/* Main content */}
            <div className="tl-main">

              {/* 맞춤 인재 추천 */}
              {recommendedTalents.length > 0 && user?.userType === 'business' && (
                <div className="tl-recommend-section">
                  <div className="tl-recommend-header">
                    <div className="tl-recommend-title">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="#4A8FE7" stroke="#4A8FE7" strokeWidth="1.5" strokeLinejoin="round"/>
                      </svg>
                      맞춤 인재 추천
                    </div>
                    <p className="tl-recommend-sub">
                      등록하신 공고 조건
                      {myRegions.length > 0 && <span className="tl-recommend-tag">{myRegions.join(' · ')}</span>}
                      {myJobTypes.length > 0 && <span className="tl-recommend-tag">{myJobTypes.join(' · ')}</span>}
                      에 맞는 인재예요
                    </p>
                  </div>
                  <div className="tl-recommend-list">
                    {recommendedTalents.map(t => (
                      <Link to={`/talents/${t.id}`} key={t.id} className="tl-rec-card">
                        <span className="tl-rec-badge">✦ 추천</span>
                        <div className="tl-rec-card-top">
                          <div className="tl-rec-avatar">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={t.gender === '여' ? '#4A8FE7' : '#5b8def'} strokeWidth="1.8">
                              <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                            </svg>
                          </div>
                          <div>
                            <div className="tl-rec-name">
                              {t.name}
                              <span className={`tl-gender-badge tl-gender-badge--${t.gender === '여' ? 'f' : 'm'}`}>{t.gender}</span>
                            </div>
                            <div className="tl-rec-info">{t.age}세 · {t.location}</div>
                          </div>
                        </div>
                        <div className="tl-rec-mid">
                          <span>{t.jobType}</span>
                          <span className="tl-rec-dot">·</span>
                          <span>{t.experience}</span>
                        </div>
                        <div className="tl-rec-wage">{t.wageType} {t.wageAmount.toLocaleString()}원</div>
                        <div className="tl-rec-tags">
                          {t.tags.map(tag => (
                            <span key={tag} className="tl-rec-match-tag">{tag}</span>
                          ))}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* 결과 바 */}
              <div className="tl-result-bar">
                <div className="tl-result-bar-left">
                  <span className="tl-result-count">총 <strong>{filtered.length}</strong>명의 인재</span>
                </div>
                <div className="tl-result-bar-right">
                  <div className="tl-sort-group">
                    {['최신순','경력순'].map(s => (
                      <button key={s} className={`tl-sort-btn${sort === s ? ' tl-sort-btn--active' : ''}`} onClick={() => setSort(s)}>{s}</button>
                    ))}
                  </div>
                  <div className="tl-view-toggle">
                    <button className={`tl-view-btn ${viewMode === 'list' ? 'tl-view-btn--active' : ''}`} onClick={() => { setViewMode('list'); localStorage.setItem('tl-viewMode', 'list') }} title="리스트">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
                      </svg>
                    </button>
                    <button className={`tl-view-btn ${viewMode === 'card' ? 'tl-view-btn--active' : ''}`} onClick={() => { setViewMode('card'); localStorage.setItem('tl-viewMode', 'card') }} title="카드">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <rect x="3" y="3" width="8" height="8" rx="1"/><rect x="13" y="3" width="8" height="8" rx="1"/>
                        <rect x="3" y="13" width="8" height="8" rx="1"/><rect x="13" y="13" width="8" height="8" rx="1"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* 목록 */}
              {viewMode === 'list' ? (
                <div className="tl-card-list">
                  {paginated.length === 0
                    ? <div className="tl-empty">조건에 맞는 인재가 없습니다.</div>
                    : paginated.map(t => (
                      <Link to={`/talents/${t.id}`} className="tl-talent-card" key={t.id}>
                        <div className="tl-talent-avatar">
                          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={t.gender === '여' ? '#4A8FE7' : '#5b8def'} strokeWidth="1.8">
                            <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                          </svg>
                        </div>
                        <div className="tl-talent-body">
                          <div className="tl-talent-name-row">
                            <span className="tl-talent-name">{t.name}</span>
                            <span className={`tl-gender-badge tl-gender-badge--${t.gender === '여' ? 'f' : 'm'}`}>{t.gender}</span>
                            <span className="tl-age">{t.age}세</span>
                            <span className="tl-status-badge">구직중</span>
                          </div>
                          <div className="tl-talent-meta">
                            {t.jobType} · {t.experience} · {t.wishRegion}
                          </div>
                          {t.certs && t.certs.length > 0 && (
                            <div className="tl-talent-tags">
                              {t.certs.map(c => <span key={c} className="tl-cert-tag">{c}</span>)}
                            </div>
                          )}
                        </div>
                        <div className="tl-talent-right">
                          <div className="tl-talent-wage">{t.wageType} {t.wageAmount.toLocaleString()}원</div>
                          <div className="tl-talent-worktype">{t.workType}</div>
                        </div>
                      </Link>
                    ))
                  }
                </div>
              ) : (
                <div className="tl-grid">
                  {paginated.length === 0
                    ? <div className="tl-empty">조건에 맞는 인재가 없습니다.</div>
                    : paginated.map(t => (
                      <Link to={`/talents/${t.id}`} className="tl-grid-card" key={t.id}>
                        <div className="tl-grid-card-top">
                          <div className={`tl-grid-avatar tl-grid-avatar--${t.gender === '여' ? 'f' : 'm'}`}>
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={t.gender === '여' ? '#4A8FE7' : '#5b8def'} strokeWidth="1.8">
                              <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                            </svg>
                          </div>
                          <div>
                            <div className="tl-grid-name">
                              {t.name}
                              <span className={`tl-gender-badge tl-gender-badge--${t.gender === '여' ? 'f' : 'm'}`}>{t.gender}</span>
                              <span className="tl-age">{t.age}세</span>
                            </div>
                            <span className="tl-status-badge">구직중</span>
                          </div>
                        </div>
                        <div className="tl-grid-info">
                          <div className="tl-grid-row"><span className="tl-grid-label">직종</span><span>{t.jobType}</span></div>
                          <div className="tl-grid-row"><span className="tl-grid-label">경력</span><span>{t.experience}</span></div>
                          <div className="tl-grid-row"><span className="tl-grid-label">지역</span><span>{t.wishRegion}</span></div>
                          <div className="tl-grid-row"><span className="tl-grid-label">형태</span><span>{t.workType}</span></div>
                        </div>
                        <div className="tl-grid-wage">{t.wageType} {t.wageAmount.toLocaleString()}원</div>
                      </Link>
                    ))
                  }
                </div>
              )}

              {/* 페이지네이션 */}
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

            </div>

            {/* Right sidebar */}
            <aside className="tl-right">
              <div className="tl-alert-card">
                <div className="tl-alert-title">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                  인재 알림 받기
                </div>
                <p className="tl-alert-desc">조건에 맞는 새 인재가 등록되면 알려드려요</p>
                <input className="tl-alert-input" placeholder="관심 직종 입력" value={alertJob} onChange={e => setAlertJob(e.target.value)} />
                <input className="tl-alert-input" placeholder="희망 지역 입력" value={alertRegion} onChange={e => setAlertRegion(e.target.value)} />
                <button className="tl-alert-btn">알림 신청하기</button>
              </div>
            </aside>

          </div>
        </div>
      </div>
    </>
  )
}
