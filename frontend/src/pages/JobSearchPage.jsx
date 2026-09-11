import './JobSearchPage.css'
import HomeNav from './home/HomeNav'
import JsHero from './jobsearch/JsHero'
import JsFilter from './jobsearch/JsFilter'
import JsJobList from './jobsearch/JsJobList'
import JsSidebar from './jobsearch/JsSidebar'

export default function JobSearchPage() {
  const handleSearch = () => {}

  return (
    <div className="js-root">
      <HomeNav />
      <JsHero />
      <div className="js-body">
        <div className="js-body-inner">
          <JsFilter onSearch={handleSearch} />
          <JsJobList />
          <JsSidebar />
        </div>
      </div>
      <footer className="js-footer">
        <div className="js-footer-links">
          <a href="#">이용약관</a><span>·</span>
          <a href="#">개인정보처리방침</a><span>·</span>
          <a href="#">공지사항</a><span>·</span>
          <a href="#">FAQ</a><span>·</span>
          <a href="#">고객센터</a>
        </div>
        <p className="js-footer-copy">© 2026 요양이지. All rights reserved.</p>
      </footer>
    </div>
  )
}
