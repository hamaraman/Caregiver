import { useParams, Link, useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { fetchJob, applyToJob, likeJob, unlikeJob } from '../api'
import { addRecentJob } from '../hooks/useJobStorage'
import { useAuth } from '../hooks/useAuth'
import HomeNav from './home/HomeNav'
import { SHIFT_STYLE } from '../data/shiftStyles'
import './JobDetailPage.css'

function authUrl(path) {
  return `${window.location.origin}${path}?redirect=${encodeURIComponent(window.location.href)}`
}

function InfoRow({ label, value }) {
  return (
    <div className="jd-cond-item">
      <span className="jd-meta-label">{label}</span>
      <span className="jd-meta-value">{value || '-'}</span>
    </div>
  )
}

function KakaoMap({ address }) {
  const ref = useRef(null)

  useEffect(() => {
    if (!address || !ref.current) return
    if (!window.kakao?.maps) return
    window.kakao.maps.load(() => {
      const geocoder = new window.kakao.maps.services.Geocoder()
      geocoder.addressSearch(address, (result, status) => {
        if (status !== window.kakao.maps.services.Status.OK) return
        const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x)
        const map = new window.kakao.maps.Map(ref.current, { center: coords, level: 4 })
        new window.kakao.maps.Marker({ position: coords, map })
      })
    })
  }, [address])

  return <div ref={ref} className="jd-map-container" />
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
      if (err.message && err.message.includes('이미 지원')) setApplied(true)
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
    if (user.userType === 'business') return
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
          <button className="jd-back-link" onClick={() => navigate(-1)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            목록으로 돌아가기
          </button>
        </div>
      </>
    )
  }

  const s = SHIFT_STYLE[job.shift] || {}
  const mapAddress = job.address || job.location
  const hasCareInfo = job.careGender || job.careAge || job.careGrade || job.careCondition.length > 0 || job.careWork.length > 0
  const hasApplyInfo = job.applyMethod.length > 0 || job.applyEmail || job.applyFax || job.companyUrl
  const hasCompanyInfo = job.companyPhone || job.companyAddr || job.managerName

  const weekdayLabel = job.weekdays.length
    ? job.weekdays.join(', ') + (job.daysNegotiable ? ' (협의 가능)' : '')
    : null

  return (
    <div className="jd-page">
      <HomeNav />
      <div className="jd-inner">

        <button className="jd-back-link" onClick={() => navigate(-1)}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          목록으로 돌아가기
        </button>

        <div className="jd-layout">

          {/* ── 메인 콘텐츠 ── */}
          <div className="jd-main">

            {/* 헤더 카드 */}
            <div className="jd-header-card">
              <div className="jd-header-top">
                {job.closed && (
                  <span className="jd-shift-badge" style={{ background: '#f0f0f0', color: '#999' }}>마감</span>
                )}
                <span className="jd-shift-badge" style={{ background: s.bg, color: s.color }}>
                  {job.shift}
                </span>
                {user?.userType !== 'business' && (
                  <button className="jd-like-btn" onClick={handleLike} disabled={liking} aria-label="찜하기">
                    <svg width="20" height="20" viewBox="0 0 24 24"
                      fill={job.liked ? '#e04444' : 'none'}
                      stroke={job.liked ? '#e04444' : '#ccc'}
                      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                  </button>
                )}
              </div>

              <h1 className="jd-title">{job.type}</h1>
              <p className="jd-facility">{job.facility}</p>

              <div className="jd-meta-grid">
                <InfoRow label="근무지" value={job.location} />
                <div className="jd-cond-item">
                  <span className="jd-meta-label">급여</span>
                  <span className="jd-meta-value jd-pay">{job.pay}</span>
                </div>
                <InfoRow label="근무형태" value={job.workType} />
                <InfoRow label="근무시간" value={job.time} />
                <InfoRow label="주소" value={job.address} />
                <InfoRow label="등록일" value={job.date ? `2026.${job.date}` : '-'} />
              </div>
            </div>

            {/* 근무 조건 상세 */}
            <div className="jd-section-card">
              <h2 className="jd-section-title">근무 조건 상세</h2>
              <div className="jd-cond-grid">
                <InfoRow label="직종" value={job.type} />
                <InfoRow label="시설형태" value={job.facility} />
                <InfoRow label="근무형태" value={job.workForm} />
                <InfoRow label="고용형태" value={job.employForm} />
                <InfoRow label="요일" value={weekdayLabel} />
                <InfoRow label="학력" value={job.experience ? null : job.tags.find(t => t)} />
                <InfoRow label="경력" value={job.experience} />
                <InfoRow label="마감일" value={job.deadline} />
              </div>
            </div>

            {/* 케어 대상자 정보 */}
            {hasCareInfo && (
              <div className="jd-section-card">
                <h2 className="jd-section-title">케어 대상자 정보</h2>
                <div className="jd-cond-grid">
                  <InfoRow label="성별" value={job.careGender} />
                  <InfoRow label="연령" value={job.careAge} />
                  <InfoRow label="등급" value={job.careGrade} />
                </div>
                {job.careCondition.length > 0 && (
                  <>
                    <p className="jd-sub-label">케어 대상 상태</p>
                    <div className="jd-benefit-chips">
                      {job.careCondition.map((c, i) => <span key={i} className="jd-benefit-chip">{c}</span>)}
                    </div>
                  </>
                )}
                {job.careWork.length > 0 && (
                  <>
                    <p className="jd-sub-label">케어 업무</p>
                    <div className="jd-benefit-chips">
                      {job.careWork.map((w, i) => <span key={i} className="jd-care-chip">{w}</span>)}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* 모집 내용 */}
            <div className="jd-section-card">
              <h2 className="jd-section-title">모집 내용</h2>
              <p className="jd-desc">{job.desc}</p>
            </div>

            {/* 지원 자격 */}
            <div className="jd-section-card">
              <h2 className="jd-section-title">지원 자격</h2>
              <ul className="jd-list">
                {job.requirements.map((r, i) => <li key={i}>{r}</li>)}
              </ul>
            </div>

            {/* 복리후생 */}
            {job.benefits.length > 0 && (
              <div className="jd-section-card">
                <h2 className="jd-section-title">복리후생</h2>
                <div className="jd-benefit-chips">
                  {job.benefits.map((b, i) => <span key={i} className="jd-benefit-chip">{b}</span>)}
                </div>
              </div>
            )}

            {/* 지원 방법 */}
            {hasApplyInfo && (
              <div className="jd-section-card">
                <h2 className="jd-section-title">지원 방법</h2>
                <div className="jd-cond-grid">
                  {job.applyEmail && <InfoRow label="이메일" value={job.applyEmail} />}
                  {job.applyFax && <InfoRow label="팩스" value={job.applyFax} />}
                  {job.companyUrl && (
                    <div className="jd-cond-item">
                      <span className="jd-meta-label">홈페이지</span>
                      <a href={job.companyUrl} target="_blank" rel="noreferrer" className="jd-meta-link">{job.companyUrl}</a>
                    </div>
                  )}
                </div>
                {job.applyMethod.length > 0 && (
                  <div className="jd-benefit-chips" style={{ marginTop: 12 }}>
                    {job.applyMethod.map((m, i) => <span key={i} className="jd-apply-method-chip">{m}</span>)}
                  </div>
                )}
              </div>
            )}

            {/* 근무지 위치 (지도) */}
            <div className="jd-section-card">
              <h2 className="jd-section-title">근무지 위치</h2>
              <p className="jd-map-addr">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4A8FE7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 5 }}>
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                </svg>
                {mapAddress}
              </p>
              <KakaoMap address={mapAddress} />
            </div>

            {/* 업체 정보 */}
            {hasCompanyInfo && (
              <div className="jd-section-card">
                <h2 className="jd-section-title">업체 정보</h2>
                <div className="jd-cond-grid">
                  <InfoRow label="업체명" value={job.facility} />
                  {job.companyPhone && <InfoRow label="대표 전화" value={job.companyPhone} />}
                  {job.managerName && <InfoRow label="담당자" value={job.managerName} />}
                  {job.managerPhone && <InfoRow label="담당자 연락처" value={job.managerPhone} />}
                  {job.managerEmail && <InfoRow label="담당자 이메일" value={job.managerEmail} />}
                  {job.companyAddr && (
                    <InfoRow
                      label="주소"
                      value={[job.companyAddr, job.companyAddrDetail].filter(Boolean).join(' ')}
                    />
                  )}
                </div>
              </div>
            )}

          </div>

          {/* ── 사이드바 ── */}
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
