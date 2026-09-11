import { Link } from 'react-router-dom'
import { JOB_LIST } from '../../data/jobs'

const EMPLOYER_QUICK_LINKS = [
  {
    color: '#4A8FE7', bg: '#EFF5FF',
    title: '구인공고 빠른 등록',
    desc: '새 구인공고를 간편하게 등록하기',
    path: '/jobs/post',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>,
  },
  {
    color: '#27AE60', bg: '#EDFBF3',
    title: '지원자 이력서 확인',
    desc: '내 공고에 지원한 인재 이력서 보기',
    path: '/applicants',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>,
  },
  {
    color: '#F39C12', bg: '#FFF8EC',
    title: '면접 일정 관리',
    desc: '예정된 면접 일정을 확인하고 관리하기',
    path: '/manage',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  },
  {
    color: '#9B59B6', bg: '#F7EEFF',
    title: '맞춤 인재 추천받기',
    desc: '내 조건에 맞는 우수 인재를 추천받기',
    path: '/talents',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
  },
]

const STATUS_STYLE = {
  주간: { bg: '#EFF5FF', color: '#4A8FE7' },
  야간: { bg: '#F3F0FF', color: '#7C5CBF' },
  단기: { bg: '#FFF8EC', color: '#E07800' },
}

export default function EhpMainContent() {
  return (
    <>
      <section className="jsp-section">
        <div className="jsp-inner">
          <div className="jsp-content-grid">

            {/* ── Left: 최근 구인 공고 ── */}
            <div className="jsp-main-col">
              <div className="jsp-section-header">
                <div className="jsp-section-title-wrap">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4A8FE7" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2"/><line x1="7" y1="8" x2="17" y2="8"/><line x1="7" y1="12" x2="17" y2="12"/><line x1="7" y1="16" x2="13" y2="16"/>
                  </svg>
                  <h2 className="jsp-section-title">최근 구인 공고</h2>
                </div>
                <Link to="/listings" className="jsp-more-btn">더보기 ›</Link>
              </div>

              <table className="jsp-table">
                <thead>
                  <tr>
                    <th>직종</th><th>근무지</th><th>근무형태</th>
                    <th>급여</th><th>근무시간</th><th>등록일</th><th>상태</th>
                  </tr>
                </thead>
                <tbody>
                  {JOB_LIST.slice(0, 7).map(job => {
                    const s = STATUS_STYLE[job.shift] || {}
                    return (
                      <tr key={job.id}>
                        <td>
                          <Link to={`/job/${job.id}`} className="jsp-job-type-cell">
                            <span className="jsp-shift-badge" style={{ background: s.bg, color: s.color }}>
                              {job.shift}
                            </span>
                            <span className="jsp-job-type-name">{job.type}</span>
                          </Link>
                        </td>
                        <td>{job.location}</td>
                        <td>{job.workType}</td>
                        <td className="jsp-pay">{job.pay}</td>
                        <td>{job.time}</td>
                        <td className="jsp-date">{job.date}</td>
                        <td>
                          <span style={{ fontSize: 12, color: '#27AE60', fontWeight: 700 }}>모집중</span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* ── Right: 채용 빠른 메뉴 ── */}
            <div className="jsp-side-col">
              <div className="jsp-sidebar-card">
                <div className="jsp-sidebar-header">
                  <div className="jsp-sidebar-title-wrap">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#4A8FE7" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/>
                    </svg>
                    <span className="jsp-sidebar-title">채용 빠른 메뉴</span>
                  </div>
                </div>

                <ul className="jsp-quick-links">
                  {EMPLOYER_QUICK_LINKS.map(link => (
                    <li key={link.title}>
                      <Link to={link.path} className="jsp-quick-link" style={{ textDecoration: 'none' }}>
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
                      </Link>
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
                <p className="jsp-resume-box-text">구인공고를 등록하고<br />우수한 인재를 만나보세요!</p>
                <Link to="/jobs/post" className="jsp-resume-box-btn">구인공고 등록하기 →</Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      <section className="jsp-cta">
        <div className="jsp-inner jsp-cta-inner">
          <div className="jsp-cta-icon-wrap">
            <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <div>
            <p className="jsp-cta-eyebrow">지금, 최적의 인재를 만나보세요.</p>
            <h3 className="jsp-cta-title">구인공고 등록부터 채용까지, 요양이지가 함께합니다.</h3>
          </div>
          <Link to="/jobs/post" className="jsp-cta-btn">구인공고 등록하기 →</Link>
        </div>
      </section>
    </>
  )
}
