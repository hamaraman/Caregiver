import './JobSeekerPage.css'
import HomeNav from './home/HomeNav'
import EhpHero from './employer/EhpHero'
import EhpFeatureCards from './employer/EhpFeatureCards'
import EhpMainContent from './employer/EhpMainContent'

export default function EmployerHomePage() {
  return (
    <div className="jsp-root">
      <HomeNav />
      <EhpHero />
      <EhpFeatureCards />
      <EhpMainContent />
    </div>
  )
}
