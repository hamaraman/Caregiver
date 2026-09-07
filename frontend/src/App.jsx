import { useState } from 'react'
import LoginPage from './pages/LoginPage'
import JobSeekerPage from './pages/JobSeekerPage'
import HomePage from './pages/HomePage'

function App() {
  const initial = new URLSearchParams(window.location.search).get('page') || 'login'
  const [page, setPage] = useState(initial)

  if (page === 'login')     return <LoginPage onNavigate={setPage} />
  if (page === 'jobseeker') return <JobSeekerPage onNavigate={setPage} />
  return <HomePage onNavigate={setPage} />
}

export default App
