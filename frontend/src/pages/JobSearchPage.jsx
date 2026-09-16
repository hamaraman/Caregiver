import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import './JobSearchPage.css'
import HomeNav from './home/HomeNav'
import JsHero from './jobsearch/JsHero'
import JsFilter from './jobsearch/JsFilter'
import JsJobList from './jobsearch/JsJobList'
import JsSidebar from './jobsearch/JsSidebar'

export default function JobSearchPage() {
  const [searchParams] = useSearchParams()
  const [region, setRegion] = useState(searchParams.get('region') || '')
  const [keyword, setKeyword] = useState(searchParams.get('q') || '')
  const [jobType, setJobType] = useState('')
  const [workTypes, setWorkTypes] = useState(['전체'])
  const [salary, setSalary] = useState('')
  const [career, setCareer] = useState('전체 선택')

  const resetFilters = () => {
    setRegion(''); setJobType(''); setWorkTypes(['전체']); setSalary(''); setCareer('전체 선택')
  }

  return (
    <div className="js-root">
      <HomeNav />
      <JsHero region={region} onRegionChange={setRegion} keyword={keyword} onKeywordChange={setKeyword} />
      <div className="js-body">
        <div className="js-body-inner">
          <JsFilter
            region={region} onRegionChange={setRegion}
            jobType={jobType} onJobTypeChange={setJobType}
            workTypes={workTypes} onWorkTypesChange={setWorkTypes}
            salary={salary} onSalaryChange={setSalary}
            career={career} onCareerChange={setCareer}
            onReset={resetFilters}
          />
          <JsJobList region={region} keyword={keyword} jobType={jobType} workTypes={workTypes} salary={salary} career={career} />
          <JsSidebar />
        </div>
      </div>
    </div>
  )
}
