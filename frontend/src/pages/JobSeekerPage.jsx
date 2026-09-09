import './JobSeekerPage.css'
import JspHeader from './jobseeker/JspHeader'
import JspHero from './jobseeker/JspHero'
import JspFeatureCards from './jobseeker/JspFeatureCards'
import JspJobTable from './jobseeker/JspJobTable'

export default function JobSeekerPage() {
  return (
    <div className="jsp-root">
      <JspHeader />
      <JspHero />
      <JspFeatureCards />
      <JspJobTable />
    </div>
  )
}
