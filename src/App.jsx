import { Outlet } from 'react-router-dom'
import { Ticker } from './components/Ticker.jsx'
import { Header } from './components/Header.jsx'
import { Footer } from './components/Footer.jsx'
import './App.css'

function AppLayout() {
  return (
    <div className="site">
      <Ticker />
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default AppLayout
