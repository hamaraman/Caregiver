import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import HomePage from './pages/HomePage'
import JobListingsPage from './pages/JobListingsPage'
import JobPostPage from './pages/JobPostPage'
import JobDetailPage from './pages/JobDetailPage'
import TalentListPage from './pages/TalentListPage'
import TalentDetailPage from './pages/TalentDetailPage'
import ApplicantsPage from './pages/ApplicantsPage'
import RecruitManagePage from './pages/RecruitManagePage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import JobSeekerPage from './pages/JobSeekerPage'
import JobRegisterPage from './pages/JobRegisterPage'
import JobSearchPage from './pages/JobSearchPage'
import EmployerHomePage from './pages/EmployerHomePage'
import ScrollToTop from './components/ScrollToTop'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/jobs" element={<JobSearchPage />} />
        <Route path="/jobs/post" element={<JobPostPage />} />
        <Route path="/job/:id" element={<JobDetailPage />} />
        <Route path="/listings" element={<JobListingsPage />} />
        <Route path="/talents" element={<TalentListPage />} />
        <Route path="/talents/:id" element={<TalentDetailPage />} />
        <Route path="/applicants" element={<ApplicantsPage />} />
        <Route path="/manage" element={<RecruitManagePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/jobseeker" element={<JobSeekerPage />} />
        <Route path="/job-register" element={<JobRegisterPage />} />
        <Route path="/employer" element={<EmployerHomePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  )
}

export default App
