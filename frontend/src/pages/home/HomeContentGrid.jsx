import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { fetchJobs, fetchCaregivers } from '../../api'
import { NOTICES } from '../../data/notices'

const REGION_TABS = ['전체', '서울', '경기', '인천', '대구', '광주', '울산']

function rankByRegion(items) {
  const counts = {}
  items.forEach(item => {
    const region = item.region || (item.location ? item.location.split(' ')[0] : '')
    if (!region) return
    counts[region] = (counts[region] || 0) + 1
  })
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([region, count], i) => ({ rank: i + 1, region, count: `${count.toLocaleString()}건` }))
}

export default function HomeContentGrid() {
  const [regionTab, setRegionTab] = useState('전체')
  const [listingTab, setListingTab] = useState('구인공고')
  const [jobs, setJobs] = useState([])
  const [caregivers, setCaregivers] = useState([])

  useEffect(() => {
    fetchJobs().then(setJobs).catch(() => setJobs([]))
    fetchCaregivers().then(setCaregivers).catch(() => setCaregivers([]))
  }, [])

  const popularHireRegions = useMemo(() => rankByRegion(jobs), [jobs])
  const popularSeekerRegions = useMemo(() => rankByRegion(caregivers), [caregivers])

  const recentJobs = useMemo(
    () => [...jobs].sort((a, b) => b.id - a.id).slice(0, 5),
    [jobs]
  )
  const recentCaregivers = useMemo(
    () => [...caregivers].sort((a, b) => b.id - a.id).slice(0, 5),
    [caregivers]
  )

  return (
    <div className="hp-content">

      {/* 지역별 인기 정보 */}
      <div className="hp-card">
        <div className="hp-card-header">
          <h2 className="hp-card-title">지역별 인기 정보</h2>
        </div>
        <div className="hp-rtabs">
          {REGION_TABS.map(t => (
            <button key={t} className={`hp-rtab ${regionTab === t ? 'active' : ''}`}
              onClick={() => setRegionTab(t)}>{t}</button>
          ))}
        </div>
        <div className="hp-popular-grid">
          <div className="hp-popular-col">
            <div className="hp-popular-col-header">
              <p className="hp-popular-col-title">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#e91e8c" strokeWidth="2.5" strokeLinecap="round"><path d="M21 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                인기 구인 지역
              </p>
              <Link to="/listings" className="hp-more-btn">전체보기 ›</Link>
            </div>
            {popularHireRegions.length === 0
              ? <p className="hp-listing-empty">등록된 공고가 없습니다.</p>
              : popularHireRegions.map(r => (
                <Link key={r.rank} to={`/listings?region=${r.region}`} className="hp-popular-row hp-popular-row--link">
                  <span className={`hp-popular-rank ${r.rank <= 3 ? 'top' : ''}`}>{r.rank}</span>
                  <span className="hp-popular-region">{r.region}</span>
                  <span className="hp-popular-count">{r.count}</span>
                </Link>
              ))
            }
          </div>
          <div className="hp-popular-divider" />
          <div className="hp-popular-col">
            <div className="hp-popular-col-header">
              <p className="hp-popular-col-title">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#4A8FE7" strokeWidth="2.5" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
                인기 구직 지역
              </p>
              <Link to="/talents" className="hp-more-btn">전체보기 ›</Link>
            </div>
            {popularSeekerRegions.length === 0
              ? <p className="hp-listing-empty">등록된 인재 정보가 없습니다.</p>
              : popularSeekerRegions.map(r => (
                <Link key={r.rank} to={`/talents?region=${r.region}`} className="hp-popular-row hp-popular-row--link">
                  <span className={`hp-popular-rank ${r.rank <= 3 ? 'top' : ''}`}>{r.rank}</span>
                  <span className="hp-popular-region">{r.region}</span>
                  <span className="hp-popular-count">{r.count}</span>
                </Link>
              ))
            }
          </div>
        </div>
      </div>

      {/* 최근 등록된 정보 */}
      <div className="hp-card">
        <div className="hp-card-header">
          <h2 className="hp-card-title">최근 등록된 정보</h2>
          <Link to={listingTab === '구인공고' ? '/listings' : '/talents'} className="hp-more-btn">
            {listingTab} 전체보기 ›
          </Link>
        </div>
        <div className="hp-ltabs">
          {['구인공고', '인재정보'].map(t => (
            <button key={t} className={`hp-ltab ${listingTab === t ? 'active' : ''}`}
              onClick={() => setListingTab(t)}>{t}</button>
          ))}
        </div>
        <ul className="hp-listing-list">
          {listingTab === '구인공고'
            ? (recentJobs.length === 0
              ? <li className="hp-listing-empty">등록된 공고가 없습니다.</li>
              : recentJobs.map((job) => (
                <li key={job.id}>
                  <Link to={`/job/${job.id}`} className="hp-listing-item" style={{textDecoration:'none',color:'inherit',display:'block'}}>
                    <div className="hp-listing-top">
                      <span className="hp-listing-badge">구인</span>
                      <span className="hp-listing-title">{job.title}</span>
                      <span className="hp-listing-ago">{job.date}</span>
                    </div>
                    <p className="hp-listing-sub">{job.location} · <span className="hp-listing-pay">{job.pay}</span> · {job.time}</p>
                  </Link>
                </li>
              )))
            : (recentCaregivers.length === 0
              ? <li className="hp-listing-empty">등록된 인재 정보가 없습니다.</li>
              : recentCaregivers.map((c) => (
                <li key={c.id}>
                  <Link to={`/talents/${c.id}`} className="hp-listing-item" style={{textDecoration:'none',color:'inherit',display:'block'}}>
                    <div className="hp-listing-top">
                      <span className="hp-listing-badge">인재</span>
                      <span className="hp-listing-title">{c.jobType} · {c.name}</span>
                      <span className="hp-listing-ago">{c.date}</span>
                    </div>
                    <p className="hp-listing-sub">{c.location} · <span className="hp-listing-pay">{c.wageType} {c.wageAmount.toLocaleString()}원</span> · {c.experience}</p>
                  </Link>
                </li>
              )))
          }
        </ul>
      </div>

      {/* 공지사항 & 이용안내 */}
      <div className="hp-card">
        <div className="hp-card-header">
          <h2 className="hp-card-title">공지사항 &amp; 이용안내</h2>
          <Link to="/support?tab=notice" className="hp-more-btn">전체보기 ›</Link>
        </div>
        <ul className="hp-notice-list">
          {NOTICES.map((n, i) => (
            <li key={i} className="hp-notice-item">
              <span className={`hp-notice-badge hp-notice-badge--${n.type === '공지' ? 'blue' : n.type === '안내' ? 'teal' : 'gray'}`}>{n.type}</span>
              <span className="hp-notice-title">{n.title}</span>
              <span className="hp-notice-date">{n.date}</span>
            </li>
          ))}
        </ul>
        <div className="hp-notice-cta">
          <div className="hp-notice-cta-icon">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill="#e91e8c" opacity="0.85"/>
            </svg>
          </div>
          <p className="hp-notice-cta-text">함께 만드는 더 좋은 돌봄 사회<br /><span>요양이지가 함께합니다.</span></p>
          <Link to="/support" className="hp-notice-cta-btn">이용안내 보기 →</Link>
        </div>
      </div>

    </div>
  )
}
