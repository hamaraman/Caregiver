import './FeatureCards.css'

const features = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="2"/>
        <line x1="7" y1="8" x2="17" y2="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <line x1="7" y1="12" x2="17" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <line x1="7" y1="16" x2="13" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    color: '#e91e8c',
    iconBg: '#fff0f7',
    shadow: 'rgba(233,30,140,0.18)',
    topBar: 'linear-gradient(90deg, #e91e8c, #ff6eb4)',
    title: '구인 등록하기',
    desc: '간편하게 구인공고를\n등록해보세요',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2"/>
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    color: '#5b8def',
    iconBg: '#eff4ff',
    shadow: 'rgba(91,141,239,0.18)',
    topBar: 'linear-gradient(90deg, #5b8def, #93b8f8)',
    title: '지원자 확인',
    desc: '지원한 인재의 이력서를\n바로 확인할 수 있어요',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
        <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    color: '#f97316',
    iconBg: '#fff4ed',
    shadow: 'rgba(249,115,22,0.18)',
    topBar: 'linear-gradient(90deg, #f97316, #fbbf6a)',
    title: '채용 관리',
    desc: '지원자 관리부터\n채용까지 한 번에!',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    color: '#17a2b8',
    iconBg: '#e8f8fb',
    shadow: 'rgba(23,162,184,0.18)',
    topBar: 'linear-gradient(90deg, #17a2b8, #5dd3e8)',
    title: '맞춤 인재 추천',
    desc: '내 조건에 맞는\n우수 인재를 추천받으세요',
  },
]

export default function FeatureCards() {
  return (
    <section className="features">
      {features.map((f) => (
        <div
          className="feature-card"
          key={f.title}
          style={{ '--card-shadow': f.shadow, '--card-color': f.color }}
        >
          <div className="feature-card-bar" style={{ background: f.topBar }} />
          <div className="feature-icon" style={{ color: f.color, background: f.iconBg }}>
            {f.icon}
          </div>
          <h3 className="feature-title" style={{ color: f.color }}>{f.title}</h3>
          <p className="feature-desc">{f.desc}</p>
        </div>
      ))}
    </section>
  )
}
