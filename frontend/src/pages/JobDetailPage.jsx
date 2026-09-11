import { useParams, Link } from 'react-router-dom'
import { useState } from 'react'
import { JOB_LIST } from '../data/jobs'
import './JobDetailPage.css'

const SHIFT_STYLE = {
  주간: { bg: '#EFF5FF', color: '#4A8FE7' },
  야간: { bg: '#F3F0FF', color: '#7C5CBF' },
  단기: { bg: '#FFF8EC', color: '#E07800' },
}

export default function JobDetailPage() {
  const { id } = useParams()
  const job = JOB_LIST.find(j => j.id === Number(id))
  const [liked, setLiked] = useState(job?.liked ?? false)

  if (!job) {
    return (
      <div className="jd-not-found">
        <p>존재하지 않는 공고입니다.</p>
        <Link to="/jobseeker" className="jd-back-link">← 목록으로 돌아가기</Link>
      </div>
    )
  }

  const s = SHIFT_STYLE[job.shift] || {}

  return (
    <div className="jd-page">
      <div className="jd-inner">

        <Link to="/jobseeker" className="jd-back-link">← 목록으로 돌아가기</Link>

        <div className="jd-layout">

          {/* 메인 콘텐츠 */}
          <div className="jd-main">

            <div className="jd-header-card">
              <div className="jd-header-top">
                <span className="jd-shift-badge" style={{ background: s.bg, color: s.color }}>
                  {job.shift}
                </span>
                <button
                  className="jd-like-btn"
                  onClick={() => setLiked(p => !p)}
                  aria-label="찜하기"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24"
                    fill={liked ? '#e04444' : 'none'}
                    stroke={liked ? '#e04444' : '#ccc'}
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

            <div className="jd-section-card">
              <h2 className="jd-section-title">복리후생</h2>
              <div className="jd-benefit-chips">
                {job.benefits.map((b, i) => (
                  <span key={i} className="jd-benefit-chip">{b}</span>
                ))}
              </div>
            </div>

          </div>

          {/* 사이드바 */}
          <div className="jd-sidebar">
            <div className="jd-apply-card">
              <p className="jd-apply-label">지원 문의</p>
              <p className="jd-apply-contact">{job.contact}</p>
              <button className="jd-apply-btn">지원하기</button>
              <button className="jd-contact-btn">전화 문의</button>
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
