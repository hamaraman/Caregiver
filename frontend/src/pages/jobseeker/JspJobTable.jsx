import { useState } from 'react'
import { Link } from 'react-router-dom'

const JOB_LIST = [
  { id: 1, shift: '주간', type: '요양보호사(주간)', location: '서울 강남구', workType: '주 5일', pay: '시급 14,000원', time: '09:00~15:00', date: '09.06', liked: false },
  { id: 2, shift: '야간', type: '요양보호사(야간)', location: '경기 성남시', workType: '주 5일', pay: '시급 13,500원', time: '16:00~22:00', date: '09.05', liked: false },
  { id: 3, shift: '단기', type: '방문요양사', location: '인천 부평구', workType: '주 3일', pay: '시급 12,500원', time: '08:00~13:00', date: '09.05', liked: true },
  { id: 4, shift: '주간', type: '재가요양보호사', location: '서울 송파구', workType: '주 5일', pay: '월 2,200,000원', time: '09:00~18:00', date: '09.04', liked: false },
  { id: 5, shift: '야간', type: '간호조무사(야간)', location: '인천 남동구', workType: '주 5일', pay: '시급 15,000원', time: '22:00~06:00', date: '09.03', liked: false },
  { id: 6, shift: '주간', type: '요양보호사(주간)', location: '경기 과천시', workType: '주 5일', pay: '시급 12,000원', time: '09:00~17:00', date: '09.02', liked: false },
  { id: 7, shift: '단기', type: '방문요양사', location: '대구 북구', workType: '주 3일', pay: '시급 11,500원', time: '10:00~15:00', date: '09.01', liked: false },
]

const QUICK_LINKS = [
  {
    color: '#4A8FE7', bg: '#EFF5FF',
    title: '내 지역 근처 일자리',
    desc: '현재 위치 기반으로 가까운 일자리 확인하기',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  },
  {
    color: '#27AE60', bg: '#EDFBF3',
    title: '희망 근무조건으로 찾기',
    desc: '근무형태, 급여, 근무시간을 설정하기',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  },
  {
    color: '#F39C12', bg: '#FFF8EC',
    title: '최근 본 일자리',
    desc: '최근에 본 일자리 다시 확인하기',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  },
  {
    color: '#E75480', bg: '#FFF0F5',
    title: '찜한 일자리',
    desc: '관심있는 일자리 모아보기',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
  },
]

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

export default function JspJobTable() {
  const [likes, setLikes] = useState(() =>
    Object.fromEntries(JOB_LIST.map(j => [j.id, j.liked]))
  )

  return (
    <>
      <section className="jsp-section">
        <div className="jsp-inner">
          <div className="jsp-content-grid">

            {/* ── Left: 추천 일자리 ── */}
            <div className="jsp-main-col">
              <div className="jsp-section-header">
                <div className="jsp-section-title-wrap">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4A8FE7" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="7" width="20" height="15" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
                  </svg>
                  <h2 className="jsp-section-title">추천 일자리</h2>
                </div>
                <button className="jsp-more-btn">더보기 ›</button>
              </div>

              <table className="jsp-table">
                <thead>
                  <tr>
                    <th>직종</th><th>근무지</th><th>근무형태</th>
                    <th>급여</th><th>근무시간</th><th>등록일</th><th></th>
                  </tr>
                </thead>
                <tbody>
                  {JOB_LIST.map(job => {
                    const s = SHIFT_STYLE[job.shift] || {}
                    return (
                      <tr key={job.id}>
                        <td>
                          <div className="jsp-job-type-cell">
                            <span className="jsp-shift-badge" style={{ background: s.bg, color: s.color }}>
                              {job.shift}
                            </span>
                            <span className="jsp-job-type-name">{job.type}</span>
                          </div>
                        </td>
                        <td>{job.location}</td>
                        <td>{job.workType}</td>
                        <td className="jsp-pay">{job.pay}</td>
                        <td>{job.time}</td>
                        <td className="jsp-date">{job.date}</td>
                        <td>
                          <button
                            className="jsp-like-btn"
                            onClick={() => setLikes(p => ({ ...p, [job.id]: !p[job.id] }))}
                            aria-label="찜하기"
                          >
                            {likes[job.id] ? <HeartFilled /> : <HeartEmpty />}
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* ── Right: 사이드바 ── */}
            <div className="jsp-side-col">
              <div className="jsp-sidebar-card">
                <div className="jsp-sidebar-header">
                  <div className="jsp-sidebar-title-wrap">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#4A8FE7" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                    </svg>
                    <span className="jsp-sidebar-title">맞춤 일자리 찾기</span>
                  </div>
                  <button className="jsp-more-btn">더보기 ›</button>
                </div>

                <ul className="jsp-quick-links">
                  {QUICK_LINKS.map(link => (
                    <li key={link.title}>
                      <button className="jsp-quick-link">
                        <span className="jsp-quick-link-icon" style={{ background: link.bg, color: link.color }}>
                          {link.icon}
                        </span>
                        <span className="jsp-quick-link-text">
                          <span className="jsp-quick-link-title">{link.title}</span>
                          <span className="jsp-quick-link-desc">{link.desc}</span>
                        </span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M9 18l6-6-6-6"/>
                        </svg>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="jsp-resume-box">
                <div className="jsp-resume-box-icon">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#4A8FE7" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2"/><line x1="7" y1="8" x2="17" y2="8"/><line x1="7" y1="12" x2="17" y2="12"/><line x1="7" y1="16" x2="13" y2="16"/>
                  </svg>
                </div>
                <p className="jsp-resume-box-text">이력서를 등록하고<br />더 많은 일자리를 받아보세요!</p>
                <Link to="/job-register" className="jsp-resume-box-btn">이력서 등록하기 →</Link>
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
