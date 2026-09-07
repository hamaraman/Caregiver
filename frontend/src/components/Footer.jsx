import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-logo">
          <div className="footer-logo-icon">
            <span>YN</span>
          </div>
          <span className="footer-logo-name">요양나라</span>
        </div>
        <div className="footer-info">
          <p>요양보호사 구인구직 플랫폼 | 사업자등록번호: 000-00-00000</p>
          <p>대표: 홍길동 | 주소: 서울특별시 강남구 테헤란로 123</p>
          <p>고객센터: 1588-0000 | 이메일: info@yoyangnara.co.kr</p>
          <p className="footer-copy">© 2024 요양나라. All rights reserved.</p>
        </div>
        <div className="footer-links">
          <a href="#">이용약관</a>
          <a href="#">개인정보처리방침</a>
          <a href="#">고객센터</a>
        </div>
      </div>
    </footer>
  )
}
