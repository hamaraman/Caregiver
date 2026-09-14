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
    </div>
  )
}
