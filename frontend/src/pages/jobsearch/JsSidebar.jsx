import { Link } from 'react-router-dom'

const POPULAR_KEYWORDS = [
  { rank: 1, keyword: '요양보호사', change: 'up' },
  { rank: 2, keyword: '서울 주간', change: 'same' },
  { rank: 3, keyword: '간호조무사', change: 'up' },
  { rank: 4, keyword: '경기 파트타임', change: 'down' },
  { rank: 5, keyword: '사회복지사', change: 'new' },
]

function ChangeIcon({ change }) {
  if (change === 'up') return <span className="js-rank-change js-rank-change--up">▲</span>
  if (change === 'down') return <span className="js-rank-change js-rank-change--down">▼</span>
  if (change === 'new') return <span className="js-rank-change js-rank-change--new">NEW</span>
  return <span className="js-rank-change">-</span>
}

export default function JsSidebar() {
  return (
    <aside className="js-sidebar">

      {/* 인기 검색어 */}
      <div className="js-sidebar-card">
        <div className="js-sidebar-card-title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4A8FE7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
          </svg>
          인기 검색어 TOP 5
        </div>
        <ul className="js-popular-list">
          {POPULAR_KEYWORDS.map(item => (
            <li key={item.rank} className="js-popular-item">
              <span className={`js-rank-num ${item.rank <= 3 ? 'top' : ''}`}>{item.rank}</span>
              <span className="js-rank-kw">{item.keyword}</span>
              <ChangeIcon change={item.change} />
            </li>
          ))}
        </ul>
        <p className="js-popular-updated">2026.09.09 기준</p>
      </div>

      {/* 추천 일자리 알림 */}
      <div className="js-sidebar-card js-sidebar-card--blue">
        <div className="js-sidebar-card-title" style={{ color: '#fff' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
          맞춤 일자리 알림 받기
        </div>
        <p className="js-sidebar-blue-desc">조건에 맞는 새 공고가 등록되면 바로 알려드려요!</p>
        <div className="js-sidebar-blue-fields">
          <input className="js-sidebar-input" placeholder="이메일 주소 입력" />
          <button className="js-sidebar-alert-btn">알림 신청</button>
        </div>
      </div>

      {/* 빠른 이력서 등록 */}
      <div className="js-sidebar-card">
        <div className="js-sidebar-card-title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4A8FE7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/>
          </svg>
          이력서 등록하고 취업 성공!
        </div>
        <p className="js-sidebar-desc">이력서를 등록하면 구인업체가 먼저 연락해와요.</p>
        <Link to="/job-register" className="js-sidebar-register-btn">이력서 등록하기 →</Link>
      </div>

      {/* 궁금한 점 상담 */}
      <div className="js-sidebar-card">
        <div className="js-sidebar-card-title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4A8FE7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          궁금한 점이 있으신가요?
        </div>
        <ul className="js-faq-list">
          <li className="js-faq-item">
            <button className="js-faq-btn">구직 등록은 어떻게 하나요?</button>
          </li>
          <li className="js-faq-item">
            <button className="js-faq-btn">급여는 어떻게 결정되나요?</button>
          </li>
          <li className="js-faq-item">
            <button className="js-faq-btn">4대보험 가입이 필수인가요?</button>
          </li>
          <li className="js-faq-item">
            <button className="js-faq-btn">허위 공고 신고 방법이 궁금해요</button>
          </li>
        </ul>
        <a href="#" className="js-sidebar-more">고객센터 바로가기 →</a>
      </div>

    </aside>
  )
}
