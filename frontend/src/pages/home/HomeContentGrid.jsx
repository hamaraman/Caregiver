import { useState } from 'react'
import { Link } from 'react-router-dom'

const REGION_TABS = ['전체', '서울', '경기', '인천', '대구', '광주', '울산']

const POPULAR_HIRE = [
  { rank: 1, region: '서울', count: '1,245건' },
  { rank: 2, region: '경기', count: '892건' },
  { rank: 3, region: '인천', count: '431건' },
  { rank: 4, region: '부산', count: '287건' },
  { rank: 5, region: '대구', count: '201건' },
]

const POPULAR_JOB = [
  { rank: 1, region: '서울', count: '1,102건' },
  { rank: 2, region: '경기', count: '843건' },
  { rank: 3, region: '인천', count: '402건' },
  { rank: 4, region: '부산', count: '256건' },
  { rank: 5, region: '대전', count: '198건' },
]

const RECENT_LISTINGS = [
  { id: 1, title: '요양보호사 구인 (주간)', location: '서울 성남구', pay: '시급 14,000원', hours: '09:00-15:00', timeAgo: '5분 전' },
  { id: 2, title: '요양보호사 (야간)', location: '경기 성남시', pay: '시급 13,500원', hours: '16:00-22:00', timeAgo: '12분 전' },
  { id: 5, title: '간병인 (상시)', location: '대구 달서구', pay: '월급 4,500,000원', hours: '08:00-17:00', timeAgo: '28분 전' },
  { id: 3, title: '요양보호사 (오후)', location: '인천 남동구', pay: '시급 13,000원', hours: '13:00-18:00', timeAgo: '1시간 전' },
  { id: 4, title: '요양보호사 (주간)', location: '부산 해운대구', pay: '시급 13,500원', hours: '09:00-15:00', timeAgo: '2시간 전' },
]

const NOTICES = [
  { type: '공지', title: '요양이지 서비스 점검 안내', date: '2026.09.05' },
  { type: '공지', title: '포인트 정책 변경 안내', date: '2026.09.04' },
  { type: '안내', title: '구인공고 등록 방법 안내', date: '2026.09.03' },
  { type: '안내', title: '인재정보 이용 방법 안내', date: '2026.09.02' },
  { type: 'FAQ', title: '자주 묻는 질문 모음', date: '2026.09.01' },
]

export default function HomeContentGrid() {
  const [regionTab, setRegionTab] = useState('전체')
  const [listingTab, setListingTab] = useState('구인공고')

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
            {POPULAR_HIRE.map(r => (
              <Link key={r.rank} to={`/listings?region=${r.region}`} className="hp-popular-row hp-popular-row--link">
                <span className={`hp-popular-rank ${r.rank <= 3 ? 'top' : ''}`}>{r.rank}</span>
                <span className="hp-popular-region">{r.region}</span>
                <span className="hp-popular-count">{r.count}</span>
              </Link>
            ))}
          </div>
          <div className="hp-popular-divider" />
          <div className="hp-popular-col">
            <div className="hp-popular-col-header">
              <p className="hp-popular-col-title">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#4A8FE7" strokeWidth="2.5" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
                인기 구직 지역
              </p>
              <Link to="/jobs" className="hp-more-btn">전체보기 ›</Link>
            </div>
            {POPULAR_JOB.map(r => (
              <Link key={r.rank} to={`/jobs?region=${r.region}`} className="hp-popular-row hp-popular-row--link">
                <span className={`hp-popular-rank ${r.rank <= 3 ? 'top' : ''}`}>{r.rank}</span>
                <span className="hp-popular-region">{r.region}</span>
                <span className="hp-popular-count">{r.count}</span>
              </Link>
            ))}
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
          {RECENT_LISTINGS.map((job) => (
            <li key={job.id}>
              <Link to={`/jobs/${job.id}`} className="hp-listing-item" style={{textDecoration:'none',color:'inherit',display:'block'}}>
                <div className="hp-listing-top">
                  <span className="hp-listing-badge">구인</span>
                  <span className="hp-listing-title">{job.title}</span>
                  <span className="hp-listing-ago">{job.timeAgo}</span>
                </div>
                <p className="hp-listing-sub">{job.location} · <span className="hp-listing-pay">{job.pay}</span> · {job.hours}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* 공지사항 & 이용안내 */}
      <div className="hp-card">
        <div className="hp-card-header">
          <h2 className="hp-card-title">공지사항 &amp; 이용안내</h2>
          <button className="hp-more-btn">전체보기 ›</button>
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
          <button className="hp-notice-cta-btn">이용안내 보기 →</button>
        </div>
      </div>

    </div>
  )
}
