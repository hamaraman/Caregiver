import { useState } from 'react'
import { Link } from 'react-router-dom'
import { JOB_LIST } from '../data/jobs'
import { getWishlist, toggleWishlist } from '../hooks/useJobStorage'
import AuthGuard from '../components/AuthGuard'
import HomeNav from './home/HomeNav'
import './JobSeekerPage.css'

const SHIFT_STYLE = {
  주간: { bg: '#EFF5FF', color: '#4A8FE7' },
  야간: { bg: '#F3F0FF', color: '#7C5CBF' },
  단기: { bg: '#FFF8EC', color: '#E07800' },
}

const HeartFilled = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="#e04444" stroke="#e04444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
)

function WishlistContent() {
  const [wishlist, setWishlist] = useState(() => getWishlist())
  const jobs = JOB_LIST.filter(j => wishlist.includes(j.id))

  const handleRemove = (id) => {
    toggleWishlist(id)
    setWishlist(getWishlist())
  }

  return (
    <section className="jsp-section">
      <div className="jsp-inner">
        <div className="jsp-section-header" style={{ marginBottom: '24px' }}>
          <div className="jsp-section-title-wrap">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#e04444" stroke="#e04444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            <h2 className="jsp-section-title">찜한 일자리</h2>
          </div>
          <span style={{ fontSize: '13px', color: '#999' }}>총 {jobs.length}개</span>
        </div>

        {jobs.length === 0 ? (
          <p className="jsp-side-empty" style={{ padding: '48px 0', textAlign: 'center' }}>
            찜한 일자리가 없습니다.
          </p>
        ) : (
          <table className="jsp-table">
            <thead>
              <tr>
                <th>직종</th><th>근무지</th><th>근무형태</th>
                <th>급여</th><th>근무시간</th><th>등록일</th><th></th>
              </tr>
            </thead>
            <tbody>
              {jobs.map(job => {
                const s = SHIFT_STYLE[job.shift] || {}
                return (
                  <tr key={job.id}>
                    <td>
                      <Link to={`/job/${job.id}`} className="jsp-job-type-cell">
                        <span className="jsp-shift-badge" style={{ background: s.bg, color: s.color }}>{job.shift}</span>
                        <span className="jsp-job-type-name">{job.type}</span>
                      </Link>
                    </td>
                    <td>{job.location}</td>
                    <td>{job.workType}</td>
                    <td className="jsp-pay">{job.pay}</td>
                    <td>{job.time}</td>
                    <td className="jsp-date">{job.date}</td>
                    <td>
                      <button
                        className="jsp-like-btn"
                        onClick={() => handleRemove(job.id)}
                        aria-label="찜 해제"
                      >
                        <HeartFilled />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </section>
  )
}

export default function WishlistPage() {
  return (
    <div className="jsp-root">
      <HomeNav />
      <AuthGuard>
        <WishlistContent />
      </AuthGuard>
    </div>
  )
}
