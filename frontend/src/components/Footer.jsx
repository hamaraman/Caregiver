import { Link } from 'react-router-dom'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-links">
        <a href="#" onClick={e => { e.preventDefault(); alert('준비 중인 페이지입니다.') }}>이용약관</a>
        <span>·</span>
        <a href="#" onClick={e => { e.preventDefault(); alert('준비 중인 페이지입니다.') }}>개인정보처리방침</a>
        <span>·</span>
        <Link to="/support?tab=notice">공지사항</Link>
        <span>·</span>
        <Link to="/support?tab=faq">FAQ</Link>
        <span>·</span>
        <Link to="/support?tab=contact">고객센터</Link>
      </div>
      <p className="footer-copy">© 2026 요양이지. All rights reserved.</p>
    </footer>
  )
}
