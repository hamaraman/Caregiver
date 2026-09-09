const QUICK_MENUS = [
  { label: '일자리 찾기', color: '#4A8FE7', bg: '#eff4ff', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg> },
  { label: '인재정보', color: '#e91e8c', bg: '#fff0f7', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg> },
  { label: '구인공고 등록', color: '#9b59b6', bg: '#f5eeff', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg> },
  { label: '인재 찾기', color: '#0bc5a8', bg: '#e8faf7', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
  { label: '내 지원현황', color: '#f97316', bg: '#fff4ed', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="16" x2="13" y2="16"/></svg> },
  { label: '내 공고관리', color: '#4A8FE7', bg: '#eff4ff', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg> },
  { label: '포인트', color: '#ca8a04', bg: '#fefce8', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 10.5h5a1.5 1.5 0 0 1 0 3H8"/></svg> },
  { label: '커뮤니티', color: '#9b59b6', bg: '#f5eeff', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> },
]

export default function HomeQuickMenu() {
  return (
    <section className="hp-quick">
      <div className="hp-quick-inner">
        <div className="hp-quick-lead">
          <p className="hp-quick-lead-title">빠른 메뉴</p>
          <p className="hp-quick-lead-sub">자주 찾는 서비스를<br />한눈에 이용하세요.</p>
        </div>
        <div className="hp-quick-items">
          {QUICK_MENUS.map(m => (
            <button key={m.label} className="hp-quick-item">
              <div className="hp-quick-icon" style={{ background: m.bg, color: m.color }}>{m.icon}</div>
              <span className="hp-quick-label">{m.label}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
