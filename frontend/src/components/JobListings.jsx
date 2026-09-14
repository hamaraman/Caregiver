import { Link, useNavigate } from 'react-router-dom'
import './JobListings.css'

const jobs = [
  { id: 1, badge: '주간', badgeColor: 'day',   title: '요양보호사(주간)',  location: '서울 강남구', days: '주 5일', wage: '시급 14,000원', hours: '09:00~15:00', date: '09.06' },
  { id: 2, badge: '야간', badgeColor: 'night',  title: '요양보호사(야간)',  location: '경기 성남시', days: '주 5일', wage: '시급 13,500원', hours: '16:00~22:00', date: '09.05' },
  { id: 3, badge: '단기', badgeColor: 'short',  title: '방문요양사',        location: '인천 부평구', days: '주 3일', wage: '시급 12,500원', hours: '08:00~13:00', date: '09.05' },
  { id: 4, badge: '주간', badgeColor: 'day',    title: '재가요양보호사',    location: '서울 송파구', days: '주 5일', wage: '월 2,200,000원', hours: '09:00~18:00', date: '09.04' },
  { id: 5, badge: '야간', badgeColor: 'night',  title: '간호조무사(야간)',  location: '인천 남동구', days: '주 5일', wage: '시급 15,000원', hours: '22:00~06:00', date: '09.03' },
  { id: 6, badge: '주간', badgeColor: 'day',    title: '요양보호사(주간)',  location: '경기 과천시', days: '주 5일', wage: '시급 12,000원', hours: '09:00~17:00', date: '09.02' },
  { id: 7, badge: '단기', badgeColor: 'short',  title: '방문요양사',        location: '대구 북구',   days: '주 3일', wage: '시급 11,500원', hours: '10:00~15:00', date: '09.01' },
]

const quickMenus = [
  {
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4A8FE7" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="3"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>,
    bg: '#e8f1ff',
    title: '구인공고 빠른 등록',
    desc: '새 구인공고를 간편하게 등록하기',
    to: '/jobs/post',
  },
  {
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>,
    bg: '#e0f7fa',
    title: '지원자 이력서 확인',
    desc: '내 공고에 지원한 인재 이력서 보기',
    to: '/applicants',
  },
  {
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    bg: '#fef3e2',
    title: '면접 일정 관리',
    desc: '예정된 면접 일정을 확인하고 관리하기',
    to: '/manage',
  },
  {
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    bg: '#f0ebff',
    title: '맞춤 인재 추천받기',
    desc: '내 조건에 맞는 우수 인재를 추천받기',
    to: '/talents',
  },
]

export default function JobListings() {
  const navigate = useNavigate()

  return (
    <section className="jl-wrap">
      {/* Left: job table */}
      <div className="jl-left">
        <div className="jl-header">
          <h2 className="jl-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4A8FE7" strokeWidth="2.2" strokeLinecap="round">
              <rect x="3" y="3" width="18" height="18" rx="3"/>
              <line x1="7" y1="8" x2="17" y2="8"/>
              <line x1="7" y1="12" x2="17" y2="12"/>
              <line x1="7" y1="16" x2="13" y2="16"/>
            </svg>
            최근 구인 공고
          </h2>
          <Link to="/jobs" className="jl-more">더보기 ›</Link>
        </div>

        <div className="jl-table">
          <div className="jl-table-head">
            <span>직종</span>
            <span>근무지</span>
            <span>근무형태</span>
            <span>급여</span>
            <span>근무시간</span>
            <span>등록일</span>
            <span>상태</span>
          </div>
          {jobs.map((job) => (
            <div
              className="jl-row"
              key={job.id}
              onClick={() => navigate(`/jobs/${job.id}`)}
            >
              <div className="jl-title-cell">
                <span className={`jl-badge jl-badge--${job.badgeColor}`}>{job.badge}</span>
                <span className="jl-job-title">{job.title}</span>
              </div>
              <span className="jl-cell">{job.location}</span>
              <span className="jl-cell">{job.days}</span>
              <span className="jl-cell jl-wage">{job.wage}</span>
              <span className="jl-cell">{job.hours}</span>
              <span className="jl-cell jl-date">{job.date}</span>
              <span className="jl-status">모집중</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right: quick menu */}
      <div className="jl-right">
        <div className="jl-quick-card">
          <div className="jl-quick-header">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#4A8FE7" strokeWidth="2.2" strokeLinecap="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
            채용 빠른 메뉴
          </div>
          <div className="jl-quick-list">
            {quickMenus.map((m) => (
              <Link key={m.title} to={m.to} className="jl-quick-item">
                <div className="jl-quick-icon" style={{ background: m.bg }}>{m.icon}</div>
                <div className="jl-quick-text">
                  <span className="jl-quick-title">{m.title}</span>
                  <span className="jl-quick-desc">{m.desc}</span>
                </div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
              </Link>
            ))}
          </div>
        </div>

        <div className="jl-cta-card">
          <div className="jl-cta-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#4A8FE7" strokeWidth="1.8" strokeLinecap="round">
              <rect x="3" y="3" width="18" height="18" rx="3"/>
              <line x1="7" y1="8" x2="17" y2="8"/>
              <line x1="7" y1="12" x2="17" y2="12"/>
              <line x1="7" y1="16" x2="13" y2="16"/>
            </svg>
          </div>
          <p className="jl-cta-text">구인공고를 등록하고<br />우수한 인재를 만나보세요!</p>
          <Link to="/jobs/post" className="jl-cta-btn">구인공고 등록하기 →</Link>
        </div>
      </div>
    </section>
  )
}
