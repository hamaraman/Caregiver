import { useState } from 'react'
import LoginPage from './pages/LoginPage'
import JobSeekerPage from './pages/JobSeekerPage'
import './App.css'

// TODO: 아래 컴포넌트들은 팀원이 구현 후 연결 예정
// import Header from './components/Header'
// import HeroBanner from './components/HeroBanner'
// import FeatureCards from './components/FeatureCards'
// import JobListings from './components/JobListings'
// import CTABanner from './components/CTABanner'
// import Footer from './components/Footer'

function App() {
  const [page, setPage] = useState('login') // 'login' | 'jobseeker'

  if (page === 'login') return <LoginPage onNavigate={setPage} />
  return <JobSeekerPage onNavigate={setPage} />
}

export default App
