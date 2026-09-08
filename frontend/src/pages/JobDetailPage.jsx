import { useParams, Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { jobs } from '../data/jobs'
import Header from '../components/Header'
import { useAuth } from '../hooks/useAuth'
import './JobDetailPage.css'

export default function JobDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const job = jobs.find(j => j.id === Number(id))
  const [liked, setLiked] = useState(false)
  const { user } = useAuth()

  if (!job) {
    return (
      <>
        <Header />
        <div className="jd-not-found">
          <p>공고를 찾을 수 없습니다.</p>
          <Link to="/jobs">목록으로 돌아가기</Link>
        </div>
      </>
    )
  }

  const isUrgent = job.badge === '급구'
  const isRecommend = job.badge === '추천'

  return (
    <>
      <Header />
      <div className="jd-page">
        <div className="container">

          {/* 상단 헤더 카드 */}
          <div className="jd-hero">
            <div className="jd-hero-top">
              <button className="jd-back" onClick={() => navigate(-1)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <polyline points="15 18 9 12 15 6"/>
                </svg>
                목록으로
              </button>
              <div className="jd-hero-badges">
                {isUrgent && <span className="jd-badge jd-badge--urgent">급구</span>}
                {isRecommend && <span className="jd-badge jd-badge--recommend">추천</span>}
                <span className="jd-badge jd-badge--type">{job.jobType}</span>
                <span className="jd-badge jd-badge--work">{job.workType}</span>
              </div>
            </div>

            <h1 className="jd-title">{job.postTitle}</h1>

            <div className="jd-key-info">
              <div className="jd-key-item">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#e91e8c" strokeWidth="2" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                {job.location}
              </div>
              <div className="jd-key-item">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#e91e8c" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>
                {job.hours} · {job.days}
              </div>
              <div className="jd-key-item jd-key-item--wage">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#e91e8c" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                {job.wage}
              </div>
              <div className="jd-key-item">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#e91e8c" strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                마감 {job.deadline === '상시' ? '상시모집' : job.deadline}
              </div>
            </div>

            <div className="jd-hero-actions">
              {job.applyMethod.includes('바로지원') && user?.userType !== 'business' && (
                <button
                  className={`jd-apply-btn${!user ? ' jd-apply-btn--guest' : ''}`}
                  onClick={() => { if (!user) window.location.href = 'http://localhost:5173/' }}
                >
                  {user ? '바로지원하기' : '로그인 후 지원하기'}
                </button>
              )}
              <button
                className={`jd-like-btn${liked ? ' jd-like-btn--active' : ''}`}
                onClick={() => setLiked(v => !v)}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill={liked ? '#e91e8c' : 'none'} stroke={liked ? '#e91e8c' : '#aaa'} strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
                {liked ? '관심 등록됨' : '관심공고'}
              </button>
            </div>
          </div>

          <div className="jd-body">
            {/* 근무 조건 */}
            <section className="jd-section">
              <h2 className="jd-section-title">근무 조건</h2>
              <div className="jd-grid">
                <div className="jd-item"><span className="jd-label">직종</span><span className="jd-value">{job.jobType}</span></div>
                <div className="jd-item"><span className="jd-label">시설 종류</span><span className="jd-value">{job.facility}</span></div>
                <div className="jd-item"><span className="jd-label">근무 형태</span><span className="jd-value">{job.workType}</span></div>
                <div className="jd-item"><span className="jd-label">고용 형태</span><span className="jd-value">{job.employForm}</span></div>
                <div className="jd-item"><span className="jd-label">학력</span><span className="jd-value">{job.education}</span></div>
                <div className="jd-item"><span className="jd-label">경력</span><span className="jd-value">{job.experience}</span></div>
                <div className="jd-item"><span className="jd-label">근무 요일</span><span className="jd-value">{job.weekdays.join(' · ')}</span></div>
                <div className="jd-item"><span className="jd-label">근무 시간</span><span className="jd-value">{job.hours}</span></div>
                <div className="jd-item"><span className="jd-label">급여</span><span className="jd-value jd-value--wage">{job.wage}</span></div>
                <div className="jd-item"><span className="jd-label">모집 마감</span><span className="jd-value">{job.deadline === '상시' ? '상시모집' : job.deadline}</span></div>
              </div>
            </section>

            {/* 케어대상자 정보 */}
            <section className="jd-section">
              <h2 className="jd-section-title">케어대상자 정보</h2>
              <div className="jd-grid">
                <div className="jd-item"><span className="jd-label">성별</span><span className="jd-value">{job.careGender}</span></div>
                <div className="jd-item"><span className="jd-label">나이</span><span className="jd-value">만 {job.careAge}세</span></div>
                <div className="jd-item"><span className="jd-label">요양 등급</span><span className="jd-value">{job.careGrade}</span></div>
                <div className="jd-item jd-item--full">
                  <span className="jd-label">상태</span>
                  <span className="jd-value">
                    <span className="jd-tags">{job.careCondition.map(c => <span key={c} className="jd-tag">{c}</span>)}</span>
                  </span>
                </div>
                <div className="jd-item jd-item--full">
                  <span className="jd-label">업무 내용</span>
                  <span className="jd-value">
                    <span className="jd-tags">{job.careWork.map(w => <span key={w} className="jd-tag jd-tag--work">{w}</span>)}</span>
                  </span>
                </div>
              </div>
            </section>

            {/* 공고 내용 */}
            <section className="jd-section">
              <h2 className="jd-section-title">공고 내용</h2>
              <p className="jd-detail-text">{job.postDetail}</p>
              <div className="jd-apply-methods">
                <span className="jd-label">접수 방법</span>
                <span className="jd-tags">{job.applyMethod.map(m => {
                  if (m === '바로지원') {
                    return (
                      <span key={m} className="jd-tag jd-tag--direct" style={{cursor:'pointer'}}
                        onClick={() => document.querySelector('.jd-apply-btn')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}>
                        {m}
                      </span>
                    )
                  }
                  if (m === '전화') {
                    return (
                      <a key={m} href={`tel:${job.companyPhone}`} className="jd-tag jd-tag--apply">{m}</a>
                    )
                  }
                  if (m === '방문접수') {
                    return (
                      <a key={m} href={`https://map.kakao.com/link/search/${encodeURIComponent(job.companyAddr)}`} target="_blank" rel="noopener noreferrer" className="jd-tag jd-tag--apply">{m}</a>
                    )
                  }
                  if (m === '이메일') {
                    return (
                      <a key={m} href={`mailto:${job.companyEmail || ''}`} className="jd-tag jd-tag--apply">{m}</a>
                    )
                  }
                  return <span key={m} className="jd-tag jd-tag--apply">{m}</span>
                })}</span>
              </div>
            </section>

            {/* 업체 정보 */}
            <section className="jd-section">
              <h2 className="jd-section-title">업체 정보</h2>
              <div className="jd-grid">
                <div className="jd-item"><span className="jd-label">업체명</span><span className="jd-value">{job.companyName}</span></div>
                <div className="jd-item"><span className="jd-label">전화번호</span><span className="jd-value">{job.companyPhone}</span></div>
                <div className="jd-item jd-item--full"><span className="jd-label">주소</span><span className="jd-value">{job.companyAddr}</span></div>
              </div>
            </section>

            {/* 담당자 정보 */}
            <section className="jd-section">
              <h2 className="jd-section-title">담당자 정보</h2>
              <div className="jd-grid">
                <div className="jd-item"><span className="jd-label">담당자</span><span className="jd-value">{job.managerName}</span></div>
              </div>
            </section>
          </div>

          {/* 하단 지원 버튼 */}
          {job.applyMethod.includes('바로지원') && user?.userType !== 'business' && (
            <div className="jd-bottom-actions">
              <button
                className={`jd-apply-btn jd-apply-btn--lg${!user ? ' jd-apply-btn--guest' : ''}`}
                onClick={() => { if (!user) window.location.href = 'http://localhost:5173/' }}
              >
                {user ? '바로지원하기' : '로그인 후 지원하기'}
              </button>
            </div>
          )}

        </div>
      </div>
    </>
  )
}
