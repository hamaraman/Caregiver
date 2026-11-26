import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchJobs, fetchJobSeekers, fetchLikedJobs } from '../../api'

const ICONS = {
  job: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="7" y1="8" x2="17" y2="8"/><line x1="7" y1="12" x2="17" y2="12"/><line x1="7" y1="16" x2="13" y2="16"/></svg>,
  talent: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>,
  deadline: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  wish: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
}

export default function HomeTodayStats() {
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)

  useEffect(() => {
    Promise.all([
      fetchJobs(),
      fetchJobSeekers(),
      fetchLikedJobs().catch(() => []), // 비로그인 상태면 401 - 나머지 통계는 그대로 보여준다
    ]).then(([jobs, caregivers, likedJobs]) => {
      // "오늘 등록된 것"만 세면 등록이 없는 날 전부 0으로 보여 전체 규모와 7일 이내 마감으로 바꿨다
      setStats({
        newJobs: jobs.length,
        newCaregivers: caregivers.length,
        closingToday: jobs.filter(j => j.dday != null && j.dday >= 0 && j.dday <= 7).length,
        wishCount: likedJobs.length,
      })
    }).catch(() => setStats({ newJobs: 0, newCaregivers: 0, closingToday: 0, wishCount: 0 }))
  }, [])

  const s = stats || { newJobs: 0, newCaregivers: 0, closingToday: 0, wishCount: 0 }

  const items = [
    { label: '진행 중인 구인공고', value: s.newJobs, color: '#4A8FE7', bg: '#eff4ff', icon: ICONS.job, path: '/jobs' },
    { label: '등록된 인재', value: s.newCaregivers, color: '#e91e8c', bg: '#fdeef8', icon: ICONS.talent, path: '/talents' },
    { label: '7일 이내 마감 공고', value: s.closingToday, color: '#0bc5a8', bg: '#e8faf7', icon: ICONS.deadline, path: '/jobs' },
    { label: '찜한 일자리', value: s.wishCount, color: '#9b59b6', bg: '#f5eeff', icon: ICONS.wish, path: '/wishlist' },
  ]

  return (
    <section className="hp-today">
      <div className="hp-today-inner">
        <div className="hp-today-stats">
          {items.map(s => (
            <button key={s.label} className="hp-today-stat" onClick={() => navigate(s.path)}>
              <div className="hp-today-stat-icon" style={{ background: s.bg, color: s.color }}>{s.icon}</div>
              <div className="hp-today-stat-body">
                <p className="hp-today-stat-label">{s.label}</p>
                <p className="hp-today-stat-value" style={{ color: s.color }}>{s.value}<em>건</em></p>
              </div>
              <span className="hp-today-stat-caret">›</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
