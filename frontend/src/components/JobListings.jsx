import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './JobListings.css'

export default function JobListings() {
  const [jobs, setJobs] = useState([])
  const [likedJobs, setLikedJobs] = useState({})
  const navigate = useNavigate()

  useEffect(() => {
    fetch('/api/jobs')
      .then(res => res.json())
      .then(data => setJobs(data))
      .catch(err => console.error(err))
  }, [])

  const toggleLike = (id) => {
    setLikedJobs((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <section className="job-listings">
      <div className="job-listings-header">
        <h2 className="job-listings-title">최근 등록된 구인 공고</h2>
        <Link to="/jobs" className="job-listings-more">더보기 ›</Link>
      </div>

      <div className="job-table">
        {jobs.map((job) => (
          <div className="job-row" key={job.id} onClick={e => { if (!e.target.closest('.job-like')) navigate(`/job/${job.id}`) }} style={{cursor:'pointer'}}>
            <div className="job-title-cell">
              <span className="job-title">{job.title}</span>
              {job.badge && (
                <span className={`job-badge job-badge--${job.badgeColor}`}>
                  {job.badge}
                </span>
              )}
            </div>
            <div className="job-meta-primary">
              <span className="job-location">{job.location}</span>
              <span className="job-wage">{job.wage}</span>
            </div>
            <div className="job-meta-secondary">
              <span className="job-hours">{job.hours}</span>
              <span className="job-days">{job.days}</span>
              <span className="job-date">{job.date}</span>
            </div>
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
