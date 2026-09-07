import { useState } from 'react'
import './JobListings.css'

const jobs = [
  {
    id: 1,
    title: '요양보호사 (주간)',
    badge: '급구',
    badgeColor: 'red',
    location: '서울 강남구',
    wage: '시급 14,000원',
    hours: '09:00~15:00',
    days: '주 5일',
    date: '09.06',
    liked: false,
  },
  {
    id: 2,
    title: '요양보호사 (야간)',
    badge: null,
    location: '경기 성남시',
    wage: '시급 13,500원',
    hours: '16:00~22:00',
    days: '주 5일',
    date: '09.05',
    liked: false,
  },
  {
    id: 3,
    title: '요양보호사 (오후)',
    badge: null,
    location: '인천 남동구',
    wage: '시급 13,000원',
    hours: '13:00~18:00',
    days: '주 5일',
    date: '09.05',
    liked: false,
  },
  {
    id: 4,
    title: '요양보호사 (주간)',
    badge: null,
    location: '부산 해운대구',
    wage: '시급 14,500원',
    hours: '09:00~15:00',
    days: '주 5일',
    date: '09.04',
    liked: false,
  },
  {
    id: 5,
    title: '간병인(상시)',
    badge: null,
    location: '대구 달서구',
    wage: '월급 4,500,000원',
    hours: '08:00~17:00',
    days: '주 5일',
    date: '09.03',
    liked: false,
  },
  {
    id: 6,
    title: '요양보호사 (교대)',
    badge: null,
    location: '광주 북구',
    wage: '시급 13,000원',
    hours: '07:00~13:00',
    days: '주 5일',
    date: '09.02',
    liked: false,
  },
  {
    id: 7,
    title: '요양보호사 (주간)',
    badge: '추천',
    badgeColor: 'purple',
    location: '대전 서구',
    wage: '시급 13,500원',
    hours: '09:00~15:00',
    days: '주 5일',
    date: '09.01',
    liked: false,
  },
  {
    id: 8,
    title: '간병인(야간)',
    badge: null,
    location: '울산 남구',
    wage: '월급 4,200,000원',
    hours: '17:00~09:00',
    days: '주 5일',
    date: '08.31',
    liked: false,
  },
]

export default function JobListings() {
  const [likedJobs, setLikedJobs] = useState({})

  const toggleLike = (id) => {
    setLikedJobs((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <section className="job-listings">
      <div className="job-listings-header">
        <h2 className="job-listings-title">최근 등록된 구인 공고</h2>
        <a href="#" className="job-listings-more">더보기 ›</a>
      </div>

      <div className="job-table">
        {jobs.map((job) => (
          <div className="job-row" key={job.id}>
            <div className="job-title-cell">
              <span className="job-title">{job.title}</span>
              {job.badge && (
                <span className={`job-badge job-badge--${job.badgeColor}`}>
                  {job.badge}
                </span>
              )}
            </div>
            <div className="job-location">{job.location}</div>
            <div className="job-wage">{job.wage}</div>
            <div className="job-hours">{job.hours}</div>
            <div className="job-days">{job.days}</div>
            <div className="job-date">{job.date}</div>
            <button
              className={`job-like ${likedJobs[job.id] ? 'job-like--active' : ''}`}
              onClick={() => toggleLike(job.id)}
              aria-label="좋아요"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill={likedJobs[job.id] ? '#e91e8c' : 'none'} stroke={likedJobs[job.id] ? '#e91e8c' : '#ccc'} strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}
