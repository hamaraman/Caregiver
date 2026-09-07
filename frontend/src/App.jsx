import Header from './components/Header'
import HeroBanner from './components/HeroBanner'
import FeatureCards from './components/FeatureCards'
import JobListings from './components/JobListings'
import CTABanner from './components/CTABanner'
import Footer from './components/Footer'
import './App.css'

function App() {
  return (
    <div className="app">
      <Header />
      <main>
        <HeroBanner />
        <div className="container">
          <FeatureCards />
          <JobListings />
          <CTABanner />
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default App
