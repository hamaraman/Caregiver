import './JobRegisterPage.css'
import HomeNav from './home/HomeNav'
import JrHero from './jobregister/JrHero'
import JrForm from './jobregister/JrForm'
import JrSidebar from './jobregister/JrSidebar'

export default function JobRegisterPage() {
  return (
    <div className="jr-root">
      <HomeNav />
      <JrHero />
      <div className="jr-body">
        <div className="jr-body-inner">
          <JrForm />
          <JrSidebar />
        </div>
      </div>
    </div>
  )
}
