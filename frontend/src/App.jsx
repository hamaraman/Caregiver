import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import JobListingsPage from './pages/JobListingsPage'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/jobs" element={<JobListingsPage />} />
    </Routes>
  )
}

export default App
