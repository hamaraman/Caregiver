import './JobRegisterPage.css'
import HomeNav from './home/HomeNav'
import JrHero from './jobregister/JrHero'
import JrForm from './jobregister/JrForm'
import JrSidebar from './jobregister/JrSidebar'
import AuthGuard from '../components/AuthGuard'

export default function JobRegisterPage() {
  return (
    <AuthGuard>
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
    </AuthGuard>
  )
}
