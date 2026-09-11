import './HomePage.css'
import HomeNav from './home/HomeNav'
import HomeHero from './home/HomeHero'
import HomeTodayStats from './home/HomeTodayStats'
import HomeQuickMenu from './home/HomeQuickMenu'
import HomeContentGrid from './home/HomeContentGrid'

export default function HomePage() {
  return (
    <div className="hp-root">
      <HomeNav />
      <HomeHero />
      <HomeTodayStats />
      <HomeQuickMenu />
      <HomeContentGrid />
    </div>
  )
}
