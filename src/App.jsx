import { Outlet } from 'react-router-dom'
import TopBanner from './components/TopBanner.jsx'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import './App.css'

function AppLayout() {
  return (
    <div className="site">
      <TopBanner />
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default AppLayout
