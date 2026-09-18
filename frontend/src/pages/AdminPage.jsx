import { useState, useEffect } from 'react'
import HomeNav from './home/HomeNav'
import AuthGuard from '../components/AuthGuard'
import {
  fetchAdminStats, fetchAdminUsers, deleteAdminUser,
  fetchAdminJobs, deleteAdminJob, fetchAdminApplications,
} from '../api'
import './AdminPage.css'

const TABS = [
  { key: 'users', label: '회원' },
  { key: 'jobs', label: '공고' },
  { key: 'applications', label: '지원 내역' },
]

export default function AdminPage() {
  const [tab, setTab] = useState('users')
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [jobs, setJobs] = useState([])
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([fetchAdminStats(), fetchAdminUsers(), fetchAdminJobs(), fetchAdminApplications()])
      .then(([s, u, j, a]) => {
        setStats(s)
        setUsers(u)
        setJobs(j)
        setApplications(a)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const removeUser = async (id) => {
    if (!window.confirm('이 회원을 삭제할까요? 되돌릴 수 없습니다.')) return
    try {
      await deleteAdminUser(id)
      setUsers(prev => prev.filter(u => u.id !== id))
    } catch (err) {
      alert(err.message || '삭제에 실패했습니다.')
    }
  }

  const removeJob = async (id) => {
    if (!window.confirm('이 공고를 삭제할까요? 되돌릴 수 없습니다.')) return
    try {
      await deleteAdminJob(id)
      setJobs(prev => prev.filter(j => j.id !== id))
    } catch (err) {
      alert(err.message || '삭제에 실패했습니다.')
    }
  }

  const tabCount = { users: users.length, jobs: jobs.length, applications: applications.length }

  return (
    <>
      <HomeNav />
      <AuthGuard require="admin">
        <div className="ap-page">
          <div className="container">
            <h2 className="ap-title">관리자 페이지</h2>

            <div className="ap-summary-row">
              <div className="ap-summary-card">
                <span className="ap-summary-label">전체 회원</span>
                <span className="ap-summary-val">{stats?.totalUsers ?? '-'}</span>
              </div>
              <div className="ap-summary-card">
                <span className="ap-summary-label">개인 / 사업자</span>
                <span className="ap-summary-val">{stats ? `${stats.personalUsers} / ${stats.businessUsers}` : '-'}</span>
              </div>
              <div className="ap-summary-card">
                <span className="ap-summary-label">전체 공고</span>
                <span className="ap-summary-val">{stats?.totalJobs ?? '-'}</span>
              </div>
              <div className="ap-summary-card">
                <span className="ap-summary-label">진행중 / 마감</span>
                <span className="ap-summary-val">{stats ? `${stats.activeJobs} / ${stats.closedJobs}` : '-'}</span>
              </div>
              <div className="ap-summary-card">
                <span className="ap-summary-label">전체 지원</span>
                <span className="ap-summary-val">{stats?.totalApplications ?? '-'}</span>
              </div>
            </div>

            <div className="ap-tabs">
              {TABS.map(t => (
                <button
                  key={t.key}
                  className={`ap-tab${tab === t.key ? ' ap-tab--active' : ''}`}
                  onClick={() => setTab(t.key)}
                >
                  {t.label} ({tabCount[t.key]})
                </button>
              ))}
            </div>

            {loading && <div className="ap-empty">불러오는 중입니다...</div>}

            {!loading && tab === 'users' && (
              <div className="ap-table-wrap">
                <table className="ap-table">
                  <thead>
                    <tr>
                      <th>ID</th><th>이름</th><th>이메일</th><th>유형</th><th>연락처</th><th>업체명</th><th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u.id}>
                        <td>{u.id}</td>
                        <td>{u.name}</td>
                        <td>{u.email}</td>
                        <td>{u.userType}</td>
                        <td>{u.phone || '-'}</td>
                        <td>{u.companyName || '-'}</td>
                        <td><button className="ap-btn ap-btn--danger" onClick={() => removeUser(u.id)}>삭제</button></td>
                      </tr>
                    ))}
                    {users.length === 0 && <tr><td colSpan={7} className="ap-empty-cell">회원이 없습니다.</td></tr>}
                  </tbody>
                </table>
              </div>
            )}

            {!loading && tab === 'jobs' && (
              <div className="ap-table-wrap">
                <table className="ap-table">
                  <thead>
                    <tr>
                      <th>ID</th><th>제목</th><th>업체명</th><th>지역</th><th>상태</th><th>등록일</th><th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobs.map(j => (
                      <tr key={j.id}>
                        <td>{j.id}</td>
                        <td>{j.postTitle || j.title}</td>
                        <td>{j.companyName}</td>
                        <td>{j.location}</td>
                        <td>{j.closed ? '마감' : '진행중'}</td>
                        <td>{j.date}</td>
                        <td><button className="ap-btn ap-btn--danger" onClick={() => removeJob(j.id)}>삭제</button></td>
                      </tr>
                    ))}
                    {jobs.length === 0 && <tr><td colSpan={7} className="ap-empty-cell">공고가 없습니다.</td></tr>}
                  </tbody>
                </table>
              </div>
            )}

            {!loading && tab === 'applications' && (
              <div className="ap-table-wrap">
                <table className="ap-table">
                  <thead>
                    <tr>
                      <th>ID</th><th>공고</th><th>지원자</th><th>이메일</th><th>상태</th><th>지원일</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map(a => (
                      <tr key={a.id}>
                        <td>{a.id}</td>
                        <td>{a.jobTitle || `#${a.jobId}`}</td>
                        <td>{a.applicantName || `#${a.applicantId}`}</td>
                        <td>{a.applicantEmail || '-'}</td>
                        <td>{a.status}</td>
                        <td>{a.appliedAt}</td>
                      </tr>
                    ))}
                    {applications.length === 0 && <tr><td colSpan={6} className="ap-empty-cell">지원 내역이 없습니다.</td></tr>}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </AuthGuard>
    </>
  )
}
