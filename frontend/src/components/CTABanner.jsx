import { Link } from 'react-router-dom'
import './CTABanner.css'

export default function CTABanner() {
  return (
    <div className="cta-banner">
      <div className="cta-building-icon">
        <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
          <rect x="8" y="16" width="36" height="32" rx="3" fill="#c5b4e3" opacity="0.5"/>
          <rect x="14" y="8" width="24" height="40" rx="2" fill="#9b79d4"/>
          <rect x="20" y="14" width="5" height="5" rx="1" fill="#fff" opacity="0.8"/>
          <rect x="27" y="14" width="5" height="5" rx="1" fill="#fff" opacity="0.8"/>
          <rect x="20" y="23" width="5" height="5" rx="1" fill="#fff" opacity="0.8"/>
          <rect x="27" y="23" width="5" height="5" rx="1" fill="#fff" opacity="0.8"/>
          <rect x="20" y="32" width="5" height="5" rx="1" fill="#fff" opacity="0.8"/>
          <rect x="27" y="32" width="5" height="5" rx="1" fill="#fff" opacity="0.8"/>
          <rect x="23" y="40" width="6" height="8" rx="1" fill="#7b56b5"/>
        </svg>
      </div>

      <p className="cta-text">
        구인공고 등록부터 맞춤 인재 추천까지<br />
        <strong>요양이지에서 한 번에 해결하세요!</strong>
      </p>

      <div className="cta-actions">
        <Link to="/jobs/post" className="cta-btn cta-btn--primary">구인공고 등록하기</Link>
        <Link to="/talents" className="cta-btn cta-btn--secondary" style={{ textDecoration: 'none' }}>맞춤인재추천받기</Link>
      </div>

      <div className="cta-person-icon">
        <svg width="72" height="72" viewBox="0 0 56 56" fill="none">
          <circle cx="28" cy="18" r="10" fill="#f8a5c2"/>
          <ellipse cx="28" cy="42" rx="16" ry="14" fill="#e91e8c" opacity="0.15"/>
          <ellipse cx="28" cy="42" rx="12" ry="10" fill="#e91e8c" opacity="0.25"/>
          <circle cx="28" cy="18" r="7" fill="#f2ccc0"/>
          <path d="M18 48c0-8 4.5-13 10-13s10 5 10 13" fill="#e91e8c" opacity="0.4"/>
        </svg>
      </div>
    </div>
  )
}
