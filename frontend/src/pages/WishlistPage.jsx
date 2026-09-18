import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { fetchLikedJobs, unlikeJob, fetchLikedResumes, unlikeResume } from '../api'
import AuthGuard from '../components/AuthGuard'
import HomeNav from './home/HomeNav'
import { useAuth } from '../hooks/useAuth'
import { SHIFT_STYLE } from '../data/shiftStyles'
import './JobSeekerPage.css'
import './TalentListPage.css'

const HeartFilled = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="#e04444" stroke="#e04444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
)

function WishlistContent() {
  const { user } = useAuth()
  const isBusiness = user?.userType === 'business'
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = isBusiness ? fetchLikedResumes : fetchLikedJobs
    fetch().then(setItems).catch(() => setItems([])).finally(() => setLoading(false))
  }, [isBusiness])

  const handleRemove = async (id) => {
    try {
      isBusiness ? await unlikeResume(id) : await unlikeJob(id)
      setItems(prev => prev.filter(x => x.id !== id))
    } catch { /* 무시 */ }
  }

  const title = isBusiness ? '찜한 인재' : '찜한 일자리'
  const emptyMsg = isBusiness ? '찜한 인재가 없습니다.' : '찜한 일자리가 없습니다.'

  return (
    <section className="jsp-section">
      <div className="jsp-inner">
        <div className="jsp-section-header" style={{ marginBottom: '24px' }}>
          <div className="jsp-section-title-wrap">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#e04444" stroke="#e04444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            <h2 className="jsp-section-title">{title}</h2>
          </div>
          <span style={{ fontSize: '13px', color: '#999' }}>총 {items.length}개</span>
        </div>

        {loading ? (
          <p className="jsp-side-empty" style={{ padding: '48px 0', textAlign: 'center' }}>불러오는 중입니다...</p>
        ) : items.length === 0 ? (
          <p className="jsp-side-empty" style={{ padding: '48px 0', textAlign: 'center' }}>{emptyMsg}</p>
        ) : isBusiness ? (
          <table className="jsp-table">
            <thead>
              <tr><th>이름</th><th>직종</th><th>경력</th><th>희망지역</th><th>희망급여</th><th>등록일</th><th></th></tr>
            </thead>
            <tbody>
              {items.map(t => (
                <tr key={t.id}>
                  <td>
                    <Link to={`/talents/${t.id}`} className="jsp-job-type-cell">
                      <span className={`tl-gender-badge tl-gender-badge--${t.gender === '여' ? 'f' : 'm'}`}>{t.gender}</span>
                      <span className="jsp-job-type-name">{t.name}</span>
                    </Link>
                  </td>
                  <td>{t.jobType}</td>
                  <td>{t.experience}</td>
                  <td>{t.wishRegion}</td>
                  <td className="jsp-pay">{t.wageLabel}</td>
                  <td className="jsp-date">{t.date}</td>
                  <td><button className="jsp-like-btn" onClick={() => handleRemove(t.id)} aria-label="찜 해제"><HeartFilled /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table className="jsp-table">
            <thead>
              <tr><th>직종</th><th>근무지</th><th>근무형태</th><th>급여</th><th>근무시간</th><th>등록일</th><th></th></tr>
            </thead>
            <tbody>
              {items.map(job => {
                const s = SHIFT_STYLE[job.shift] || {}
                return (
                  <tr key={job.id}>
                    <td>
                      <Link to={`/job/${job.id}`} className="jsp-job-type-cell">
                        <span className="jsp-shift-badge" style={{ background: s.bg, color: s.color }}>{job.shift}</span>
                        <span className="jsp-job-type-name">{job.type}</span>
                        {job.closed && <span className="jsp-shift-badge" style={{ background: '#f0f0f0', color: '#999' }}>마감</span>}
                      </Link>
                    </td>
                    <td>{job.location}</td>
                    <td>{job.workType}</td>
                    <td className="jsp-pay">{job.pay}</td>
                    <td>{job.time}</td>
                    <td className="jsp-date">{job.date}</td>
                    <td><button className="jsp-like-btn" onClick={() => handleRemove(job.id)} aria-label="찜 해제"><HeartFilled /></button></td>
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
