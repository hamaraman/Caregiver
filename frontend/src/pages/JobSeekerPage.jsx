import './JobSeekerPage.css'
import HomeNav from './home/HomeNav'
import JspHero from './jobseeker/JspHero'
import JspFeatureCards from './jobseeker/JspFeatureCards'
import JspJobTable from './jobseeker/JspJobTable'

export default function JobSeekerPage() {
  return (
    <div className="jsp-root">
      <HomeNav />
      <JspHero />
      <JspFeatureCards />
      <JspJobTable />
    </div>
  )
}
