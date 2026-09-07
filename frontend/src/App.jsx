import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import JobListingsPage from './pages/JobListingsPage'
import JobPostPage from './pages/JobPostPage'
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
    </Routes>
    </>
  )
}

export default App
