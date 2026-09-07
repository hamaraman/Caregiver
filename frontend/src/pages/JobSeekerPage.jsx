import { useState } from 'react'
import './JobSeekerPage.css'

const NAV_ITEMS = [
  {
    label: '홈',
    sub: [],
  },
  {
    label: '구직',
    sub: ['일자리 찾기', '이력서 등록', '지원 현황', '맞춤 일자리 추천'],
  },
  {
    label: '구인',
    sub: ['구인 등록하기', '지원자 확인', '채용 관리', '맞춤 인재 추천'],
  },
  {
    label: '커뮤니티',
    sub: ['공지사항', '취업 후기', '자유게시판', 'Q&A'],
  },
  {
    label: '고객센터',
    sub: ['공지사항', 'FAQ', '1:1 문의', '신고센터'],
  },
]

const REGIONS = ['전체', '서울', '경기', '인천', '부산', '대구', '대전', '광주', '울산', '세종']

const FEATURE_CARDS = [
  {
    color: '#4A8FE7',
    icon: '📋',
    title: '일자리 찾기',
    desc: '지역·직종별로 내게 맞는 일자리를 빠르게 찾아보세요',
  },
  {
    color: '#6FCF97',
    icon: '📝',
    title: '이력서 등록',
    desc: '이력서를 등록하면 업체가 먼저 연락해 드려요',
  },
  {
    color: '#F2994A',
    icon: '✅',
    title: '지원 현황',
    desc: '지원한 공고의 진행 상황을 한눈에 확인하세요',
  },
  {
    color: '#BB6BD9',
    icon: '⭐',
    title: '맞춤 일자리 추천',
    desc: '내 경력과 조건에 맞는 일자리를 자동으로 추천받으세요',
  },
]

const JOB_LIST = [
  {
    id: 1,
    type: '요양보호사(주간)',
    badge: '급구',
    company: '행복한요양원',
    location: '서울 강남구',
    pay: '시급 14,000원',
    time: '09:00~15:00',
    days: '주 5일',
    date: '09.06',
    liked: false,
  },
  {
    id: 2,
    type: '요양보호사(야간)',
    badge: null,
    company: '햇살케어센터',
    location: '경기 성남시',
    pay: '시급 13,500원',
    time: '16:00~22:00',
    days: '주 5일',
    date: '09.05',
    liked: false,
  },
  {
    id: 3,
    type: '방문요양사',
    badge: '인기',
    company: '사랑나눔재가센터',
    location: '인천 부평구',
    pay: '시급 12,500원',
    time: '08:00~13:00',
    days: '주 3일',
    date: '09.05',
    liked: true,
  },
  {
    id: 4,
    type: '재가요양보호사',
    badge: null,
    company: '서울노인복지센터',
    location: '서울 송파구',
    pay: '월 2,200,000원',
    time: '09:00~18:00',
    days: '주 5일',
    date: '09.04',
    liked: false,
  },
  {
    id: 5,
    type: '간호보조(야간)',
    badge: '급구',
    company: '인천케어홈',
    location: '인천 남동구',
    pay: '시급 15,000원',
    time: '22:00~06:00',
    days: '주 5일',
    date: '09.03',
    liked: false,
  },
  {
    id: 6,
    type: '요양보호사(주간)',
    badge: null,
    company: '경기복지재단',
    location: '경기 수원시',
    pay: '시급 12,000원',
    time: '09:00~17:00',
    days: '주 5일',
    date: '09.02',
    liked: false,
  },
  {
    id: 7,
    type: '방문요양사',
    badge: null,
    company: '대구복지센터',
    location: '대구 달서구',
    pay: '시급 11,500원',
    time: '10:00~15:00',
    days: '주 3일',
    date: '09.01',
    liked: false,
  },
]

export default function JobSeekerPage() {
  const [activeNav, setActiveNav] = useState('구직')
  const [selectedRegion, setSelectedRegion] = useState('전체')
  const [keyword, setKeyword] = useState('')
  const [likes, setLikes] = useState(() =>
    Object.fromEntries(JOB_LIST.map(j => [j.id, j.liked]))
  )

  function toggleLike(id) {
    setLikes(prev => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div className="jsp-root">
      {/* ── Header ── */}
      <header className="jsp-header">
        <div className="jsp-header-inner">
          <div className="jsp-logo">
            <span className="jsp-logo-badge">YN</span>
            <div className="jsp-logo-text-wrap">
              <span className="jsp-logo-sub">요양보호사 구인구직 서비스 No.1</span>
              <span className="jsp-logo-text">요양나라</span>
            </div>
          </div>

          <nav className="jsp-nav">
            {NAV_ITEMS.map(item => (
              <div key={item.label} className="jsp-nav-group">
                <button
                  className={`jsp-nav-item ${activeNav === item.label ? 'active' : ''}`}
                  onClick={() => setActiveNav(item.label)}
                >
                  {item.label}
                  {item.sub.length > 0 && <span className="jsp-nav-arrow">▾</span>}
                </button>
                {item.sub.length > 0 && (
                  <div className="jsp-dropdown">
                    {item.sub.map(sub => (
                      <button key={sub} className="jsp-dropdown-item">{sub}</button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="jsp-auth">
            <button className="jsp-btn-ghost">로그인</button>
            <button className="jsp-btn-primary">회원가입</button>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="jsp-hero">
        <div className="jsp-hero-inner">
          <div className="jsp-hero-text">
            <p className="jsp-hero-eyebrow">요양나라와 함께라면</p>
            <h1 className="jsp-hero-title">
              당신의 따뜻한 돌봄이<br />
              더 좋은 일자리로<br />
              이어지도록
            </h1>
            <p className="jsp-hero-desc">
              간편한 구직 등록으로, 빠르고 정확하게<br />
              원하는 일자리를 찾을 수 있습니다.
            </p>

            <div className="jsp-search-box">
              <span className="jsp-search-icon">🔍</span>
              <input
                className="jsp-search-input"
                placeholder="직종, 근무형태, 지역을 검색해보세요"
                value={keyword}
                onChange={e => setKeyword(e.target.value)}
              />
              <button className="jsp-search-btn">검색</button>
            </div>

            <div className="jsp-region-chips">
              {REGIONS.map(r => (
                <button
                  key={r}
                  className={`jsp-chip ${selectedRegion === r ? 'active' : ''}`}
                  onClick={() => setSelectedRegion(r)}
                >
                  {r}
                </button>
              ))}
              <button className="jsp-chip jsp-chip--more">›</button>
            </div>
          </div>

          <div className="jsp-hero-image">
            <div className="jsp-hero-arch">
              <span className="jsp-hero-emoji">👩‍⚕️</span>
              <div className="jsp-hero-bubble">
                좋은 일자리를<br />함께 찾아드려요! 🎉
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Feature Cards ── */}
      <section className="jsp-features">
        <div className="jsp-inner">
          {FEATURE_CARDS.map(card => (
            <button key={card.title} className="jsp-feature-card">
              <div className="jsp-feature-bar" style={{ background: card.color }} />
              <span className="jsp-feature-icon">{card.icon}</span>
              <span className="jsp-feature-title">{card.title}</span>
              <span className="jsp-feature-desc">{card.desc}</span>
            </button>
          ))}
        </div>
      </section>

      {/* ── Job List ── */}
      <section className="jsp-section">
        <div className="jsp-inner">
          <div className="jsp-section-header">
            <h2 className="jsp-section-title">최근 등록된 구직 공고</h2>
            <button className="jsp-more-btn">더보기 ›</button>
          </div>

          <table className="jsp-table">
            <thead>
              <tr>
                <th>직종</th>
                <th>업체명</th>
                <th>지역</th>
                <th>급여</th>
                <th>근무시간</th>
                <th>근무형태</th>
                <th>등록일</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {JOB_LIST.map(job => (
                <tr key={job.id}>
                  <td>
                    <div className="jsp-job-type-cell">
                      {job.badge && (
                        <span className={`jsp-badge jsp-badge--${job.badge === '급구' ? 'urgent' : 'popular'}`}>
                          {job.badge}
                        </span>
                      )}
                      <span className="jsp-job-type-name">{job.type}</span>
                    </div>
                  </td>
                  <td className="jsp-company-name">{job.company}</td>
                  <td>{job.location}</td>
                  <td className="jsp-pay">{job.pay}</td>
                  <td>{job.time}</td>
                  <td>{job.days}</td>
                  <td className="jsp-date">{job.date}</td>
                  <td>
                    <button
                      className={`jsp-like-btn ${likes[job.id] ? 'liked' : ''}`}
                      onClick={() => toggleLike(job.id)}
                      aria-label="찜하기"
                    >
                      {likes[job.id] ? '♥' : '♡'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="jsp-cta">
        <div className="jsp-inner jsp-cta-inner">
          <div>
            <p className="jsp-cta-eyebrow">이력서를 등록하면</p>
            <h3 className="jsp-cta-title">업체가 먼저 연락해요!</h3>
            <p className="jsp-cta-desc">지금 이력서를 등록하고 맞춤 일자리 제안을 받아보세요.</p>
          </div>
          <button className="jsp-cta-btn">이력서 등록하기 →</button>
        </div>
      </section>
    </div>
  )
}
