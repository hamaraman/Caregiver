import { useState } from 'react'
import { Link } from 'react-router-dom'
import { JOB_LIST } from '../../data/jobs'
import { getRecentJobs, getWishlist, toggleWishlist } from '../../hooks/useJobStorage'

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

const HeartEmpty = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
)

function SideJobItem({ job, wishlist }) {
  const s = SHIFT_STYLE[job.shift] || {}
  const liked = wishlist?.includes(job.id)
  return (
    <Link to={`/job/${job.id}`} className="jsp-side-job-item">
      <div className="jsp-side-job-top">
        <span className="jsp-shift-badge" style={{ background: s.bg, color: s.color }}>{job.shift}</span>
        <span className="jsp-side-job-type">{job.type}</span>
        {liked && <HeartFilled />}
      </div>
      <div className="jsp-side-job-info">{job.facility} · {job.location}</div>
      <div className="jsp-side-job-pay">{job.pay}</div>
    </Link>
  )
}

export default function JspJobTable() {
  const [wishlist, setWishlist] = useState(() => getWishlist())

  const handleToggleLike = (id) => {
    toggleWishlist(id)
    setWishlist(getWishlist())
  }

  const recentJobs = getRecentJobs().slice(0, 5)
    .map(e => JOB_LIST.find(j => j.id === e.id)).filter(Boolean)

  const wishlistJobs = JOB_LIST.filter(j => wishlist.includes(j.id)).slice(0, 3)

  return (
    <>
      <section className="jsp-section">
        <div className="jsp-inner">
          <div className="jsp-content-grid">

            {/* ── Left: 추천 일자리 ── */}
            <div className="jsp-main-col">
              <div className="jsp-main-card">
              <div className="jsp-section-header">
                <div className="jsp-section-title-wrap">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4A8FE7" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="7" width="20" height="15" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
                  </svg>
                  <h2 className="jsp-section-title">추천 일자리</h2>
                </div>
                <Link to="/jobs" className="jsp-more-btn">더보기 ›</Link>
              </div>

              <table className="jsp-table">
                <thead>
                  <tr>
                    <th>직종</th><th>근무지</th><th>근무형태</th>
                    <th>급여</th><th>근무시간</th><th>등록일</th><th></th>
                  </tr>
                </thead>
                <tbody>
                  {JOB_LIST.slice(0, 13).map(job => {
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
                            onClick={() => handleToggleLike(job.id)}
                            aria-label="찜하기"
                          >
                            {wishlist.includes(job.id) ? <HeartFilled /> : <HeartEmpty />}
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
              </div>
            </div>

            {/* ── Right: 사이드바 ── */}
            <div className="jsp-side-col">

              <div className="jsp-side-card">
                <div className="jsp-side-card-header">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F39C12" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                  </svg>
                  <span>최근 본 일자리</span>
                  <Link to="/recent-jobs" className="jsp-more-btn" style={{ marginLeft: 'auto', fontSize: '12px' }}>더보기 ›</Link>
                </div>
                {recentJobs.length > 0
                  ? recentJobs.map(job => <SideJobItem key={job.id} job={job} wishlist={wishlist} />)
                  : <p className="jsp-side-empty">최근 본 일자리가 없습니다.</p>
                }
              </div>

              <div className="jsp-side-card">
                <div className="jsp-side-card-header">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#e04444" stroke="#e04444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                  <span>찜한 일자리</span>
                  <Link to="/wishlist" className="jsp-more-btn" style={{ marginLeft: 'auto', fontSize: '12px' }}>더보기 ›</Link>
                </div>
                {wishlistJobs.length > 0
                  ? wishlistJobs.map(job => <SideJobItem key={job.id} job={job} />)
                  : <p className="jsp-side-empty">찜한 일자리가 없습니다.</p>
                }
              </div>

            </div>

          </div>
        </div>
      </section>

      <section className="jsp-cta">
        <div className="jsp-inner jsp-cta-inner">
          <div className="jsp-cta-icon-wrap">
            <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2"/><line x1="7" y1="8" x2="17" y2="8"/><line x1="7" y1="12" x2="17" y2="12"/><line x1="7" y1="16" x2="13" y2="16"/>
            </svg>
          </div>
          <div>
            <p className="jsp-cta-eyebrow">지금, 당신의 꿈을 응원합니다.</p>
            <h3 className="jsp-cta-title">원하는 일자리를 찾는 첫걸음, 요양이지와 함께하세요.</h3>
          </div>
          <Link to="/job-register" className="jsp-cta-btn">이력서 등록하기 →</Link>
        </div>
      </section>
    </>
  )
}
