const FEATURE_CARDS = [
  { color: '#4A8FE7', icon: '📋', title: '일자리 찾기', desc: '지역·직종별로 내게 맞는 일자리를 빠르게 찾아보세요' },
  { color: '#6FCF97', icon: '📝', title: '이력서 등록', desc: '이력서를 등록하면 업체가 먼저 연락해 드려요' },
  { color: '#F2994A', icon: '✅', title: '지원 현황', desc: '지원한 공고의 진행 상황을 한눈에 확인하세요' },
  { color: '#BB6BD9', icon: '⭐', title: '맞춤 일자리 추천', desc: '내 경력과 조건에 맞는 일자리를 자동으로 추천받으세요' },
]

export default function JspFeatureCards() {
  return (
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
  )
}
