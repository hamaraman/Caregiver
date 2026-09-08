import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import JobListingsPage from './pages/JobListingsPage'
import JobPostPage from './pages/JobPostPage'
import JobDetailPage from './pages/JobDetailPage'
import TalentListPage from './pages/TalentListPage'
import TalentDetailPage from './pages/TalentDetailPage'
import ScrollToTop from './components/ScrollToTop'
import './App.css'

function App() {
  return (
    <>
    <ScrollToTop />
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/jobs" element={<JobListingsPage />} />
      <Route path="/jobs/post" element={<JobPostPage />} />
      <Route path="/jobs/:id" element={<JobDetailPage />} />
      <Route path="/talents" element={<TalentListPage />} />
      <Route path="/talents/:id" element={<TalentDetailPage />} />
    </Routes>
    </>
  )
}

export default App
