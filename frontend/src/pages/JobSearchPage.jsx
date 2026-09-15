import { useState } from 'react'
import './JobSearchPage.css'
import HomeNav from './home/HomeNav'
import JsHero from './jobsearch/JsHero'
import JsFilter from './jobsearch/JsFilter'
import JsJobList from './jobsearch/JsJobList'
import JsSidebar from './jobsearch/JsSidebar'

export default function JobSearchPage() {
  const [region, setRegion] = useState('')

  return (
    <div className="js-root">
      <HomeNav />
      <JsHero region={region} onRegionChange={setRegion} />
      <div className="js-body">
        <div className="js-body-inner">
          <JsFilter region={region} onRegionChange={setRegion} />
          <JsJobList region={region} />
          <JsSidebar />
        </div>
      </div>
    </div>
  )
}
