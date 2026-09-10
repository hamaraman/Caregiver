import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import HomePage from './pages/HomePage'
import JobSeekerPage from './pages/JobSeekerPage'
import JobRegisterPage from './pages/JobRegisterPage'
import JobSearchPage from './pages/JobSearchPage'
import JobDetailPage from './pages/JobDetailPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/jobseeker" element={<JobSeekerPage />} />
      <Route path="/job-register" element={<JobRegisterPage />} />
      <Route path="/jobs" element={<JobSearchPage />} />
      <Route path="/job/:id" element={<JobDetailPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
