import { useParams, Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { fetchJob, applyToJob, likeJob, unlikeJob } from '../api'
import { addRecentJob } from '../hooks/useJobStorage'
import { useAuth } from '../hooks/useAuth'
import HomeNav from './home/HomeNav'
import './JobDetailPage.css'

const SHIFT_STYLE = {
  주간: { bg: '#EFF5FF', color: '#4A8FE7' },
  야간: { bg: '#F3F0FF', color: '#7C5CBF' },
  단기: { bg: '#FFF8EC', color: '#E07800' },
}

function authUrl(path) {
  return `${window.location.origin}${path}?redirect=${encodeURIComponent(window.location.href)}`
}

export default function JobDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [liking, setLiking] = useState(false)
  const [applied, setApplied] = useState(false)
  const [applying, setApplying] = useState(false)

  useEffect(() => {
    setLoading(true)
    setApplied(false)
    fetchJob(Number(id))
      .then(setJob)
      .catch(() => setJob(null))
      .finally(() => setLoading(false))
    addRecentJob(Number(id))
  }, [id])

  const handleApply = async () => {
    if (!user) {
      if (confirm('로그인이 필요합니다. 로그인 페이지로 이동할까요?')) {
        window.location.href = authUrl('/login')
      }
      return
    }
    setApplying(true)
    try {
      await applyToJob(Number(id))
      setApplied(true)
      alert('지원이 완료되었습니다.')
    } catch (err) {
      if (err.message && err.message.includes('이미 지원')) {
        setApplied(true)
      }
      alert(err.message || '지원 중 오류가 발생했습니다.')
    } finally {
      setApplying(false)
    }
  }

  const handleLike = async () => {
    if (!user) {
      if (confirm('로그인이 필요합니다. 로그인 페이지로 이동할까요?')) {
        window.location.href = authUrl('/login')
      }
      return
    }
    setLiking(true)
    try {
      const updated = job.liked ? await unlikeJob(Number(id)) : await likeJob(Number(id))
      setJob(updated)
    } catch (err) {
      alert(err.message || '찜하기 처리 중 오류가 발생했습니다.')
    } finally {
      setLiking(false)
    }
  }

  const contactVisible = job ? (job.phonePublic !== '로그인 후 확인' || !!user) : true

  const handleContact = () => {
    if (!contactVisible) {
      if (confirm('로그인 후 확인 가능합니다. 로그인 페이지로 이동할까요?')) {
        window.location.href = authUrl('/login')
      }
      return
    }
    if (job && job.contact && /\d{2,4}-\d{3,4}-\d{4}/.test(job.contact)) {
      window.location.href = `tel:${job.contact}`
    } else {
      alert(job?.contact || '등록된 연락처가 없습니다.')
    }
  }

  if (loading) {
    return (
      <>
        <HomeNav />
        <div className="jd-not-found"><p>불러오는 중입니다...</p></div>
      </>
    )
  }

  if (!job) {
    return (
      <>
        <HomeNav />
        <div className="jd-not-found">
          <p>존재하지 않는 공고입니다.</p>
          <button className="jd-back-link" onClick={() => navigate(-1)}>← 목록으로 돌아가기</button>
        </div>
      </>
    )
  }

  const s = SHIFT_STYLE[job.shift] || {}

  return (
    <div className="jd-page">
      <HomeNav />
      <div className="jd-inner">

        <button className="jd-back-link" onClick={() => navigate(-1)}>← 목록으로 돌아가기</button>

        <div className="jd-layout">

          {/* 메인 콘텐츠 */}
          <div className="jd-main">

            <div className="jd-header-card">
              <div className="jd-header-top">
                {job.closed && (
                  <span className="jd-shift-badge" style={{ background: '#f0f0f0', color: '#999' }}>마감</span>
                )}
                <span className="jd-shift-badge" style={{ background: s.bg, color: s.color }}>
                  {job.shift}
                </span>
                <button
                  className="jd-like-btn"
                  onClick={handleLike}
                  disabled={liking}
                  aria-label="찜하기"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24"
                    fill={job.liked ? '#e04444' : 'none'}
                    stroke={job.liked ? '#e04444' : '#ccc'}
                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                </button>
              </div>

              <h1 className="jd-title">{job.type}</h1>
              <p className="jd-facility">{job.facility}</p>

              <div className="jd-meta-grid">
                <div className="jd-meta-item">
                  <span className="jd-meta-label">근무지</span>
                  <span className="jd-meta-value">{job.location}</span>
                </div>
                <div className="jd-meta-item">
                  <span className="jd-meta-label">급여</span>
                  <span className="jd-meta-value jd-pay">{job.pay}</span>
                </div>
                <div className="jd-meta-item">
                  <span className="jd-meta-label">근무형태</span>
                  <span className="jd-meta-value">{job.workType}</span>
                </div>
                <div className="jd-meta-item">
                  <span className="jd-meta-label">근무시간</span>
                  <span className="jd-meta-value">{job.time}</span>
                </div>
                <div className="jd-meta-item">
                  <span className="jd-meta-label">주소</span>
                  <span className="jd-meta-value">{job.address}</span>
                </div>
                <div className="jd-meta-item">
                  <span className="jd-meta-label">등록일</span>
                  <span className="jd-meta-value">2026.{job.date}</span>
                </div>
              </div>
            </div>

            <div className="jd-section-card">
              <h2 className="jd-section-title">모집 내용</h2>
              <p className="jd-desc">{job.desc}</p>
            </div>

            <div className="jd-section-card">
              <h2 className="jd-section-title">지원 자격</h2>
              <ul className="jd-list">
                {job.requirements.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>

            {job.benefits.length > 0 && (
              <div className="jd-section-card">
                <h2 className="jd-section-title">복리후생</h2>
                <div className="jd-benefit-chips">
                  {job.benefits.map((b, i) => (
                    <span key={i} className="jd-benefit-chip">{b}</span>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* 사이드바 */}
          <div className="jd-sidebar">
            <div className="jd-apply-card">
              <p className="jd-apply-label">지원 문의</p>
              <p className="jd-apply-contact">{contactVisible ? job.contact : '로그인 후 확인 가능합니다.'}</p>
              {job.closed
                ? <button className="jd-apply-btn" disabled>마감된 공고입니다</button>
                : <button className="jd-apply-btn" onClick={handleApply} disabled={applying || applied}>
                    {applied ? '지원 완료' : applying ? '지원 중...' : '지원하기'}
                  </button>
              }
              <button className="jd-contact-btn" onClick={handleContact}>전화 문의</button>
            </div>

            <div className="jd-info-card">
              <p className="jd-info-title">이력서를 미리 준비하세요</p>
              <p className="jd-info-desc">이력서 등록 후 지원하면 합격률이 높아집니다.</p>
              <Link to="/job-register" className="jd-resume-link">이력서 등록하기 →</Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
