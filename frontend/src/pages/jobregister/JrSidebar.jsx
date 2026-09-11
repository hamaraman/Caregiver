const FAQ_ITEMS = [
  '구직 등록은 어떻게 하나요?',
  '등록한 정보는 언제까지 유지되나요?',
  '이력서 수정은 어떻게 하나요?',
  '채용 결과는 어떻게 확인할 수 있나요?',
]

export default function JrSidebar() {
  return (
    <aside className="jr-sidebar">
      {/* 구직 등록 안내 */}
      <div className="jr-sidebar-card">
        <h4 className="jr-sidebar-card-title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4A8FE7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="7" y1="8" x2="17" y2="8"/><line x1="7" y1="12" x2="17" y2="12"/><line x1="7" y1="16" x2="13" y2="16"/></svg>
          구직 등록 안내
        </h4>
        <ul className="jr-info-list">
          <li>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4A8FE7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            등록하신 정보는 구인업체에 공개됩니다.
          </li>
          <li>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4A8FE7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            정확한 정보 입력이 더 좋은 조건의 일자리를 만나는 데 도움이 됩니다.
          </li>
          <li>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4A8FE7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            이력서와 자격증을 첨부하시면 채용 확률이 높아집니다.
          </li>
        </ul>
      </div>

      {/* 일자리 찾기 배너 */}
      <div className="jr-sidebar-banner">
        <div className="jr-banner-body">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          <div>
            <p className="jr-banner-title">지금, 나에게 맞는<br />일자리를 찾아보세요!</p>
            <p className="jr-banner-sub">다양한 요양시설의 채용 정보를<br />한눈에 확인할 수 있습니다.</p>
          </div>
        </div>
        <button className="jr-banner-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4A8FE7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </button>
      </div>

      {/* 자주 묻는 질문 */}
      <div className="jr-sidebar-card">
        <div className="jr-faq-header">
          <h4 className="jr-sidebar-card-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4A8FE7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            자주 묻는 질문
          </h4>
          <button className="jr-more-link">더보기 ›</button>
        </div>
        <ul className="jr-faq-list">
          {FAQ_ITEMS.map(q => (
            <li key={q} className="jr-faq-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4A8FE7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              <span>{q}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  )
}
