import { useEffect, useState } from 'react'
import './HomePage.css'
import { fetchCurrentUser, logout } from '../api'
import HomeNav from './home/HomeNav'
import HomeHero from './home/HomeHero'
import HomeTodayStats from './home/HomeTodayStats'
import HomeQuickMenu from './home/HomeQuickMenu'
import HomeContentGrid from './home/HomeContentGrid'

export default function HomePage() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    fetchCurrentUser()
      .then(setUser)
      .catch(() => setUser(null))
  }, [])

  const handleLogout = async () => {
    await logout().catch(() => {})
    setUser(null)
  }

  return (
    <div className="hp-root">
      <HomeNav user={user} onLogout={handleLogout} />
      <HomeHero />
      <HomeTodayStats />
      <HomeQuickMenu />
      <HomeContentGrid />
      <footer className="hp-footer">
        <div className="hp-footer-links">
          <a href="#">이용약관</a><span>·</span>
          <a href="#">개인정보처리방침</a><span>·</span>
          <a href="#">공지사항</a><span>·</span>
          <a href="#">FAQ</a><span>·</span>
          <a href="#">고객센터</a>
        </div>
        <p className="hp-footer-copy">© 2026 요양이지. All rights reserved.</p>
      </footer>
    </div>
  )
}
