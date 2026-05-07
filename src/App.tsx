/**
 * App — Raíz de la aplicación. Ensambla Navbar, Hero, AppsSection y Footer.
 */
import './index.css'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import AppsSection from './components/AppsSection'
import Footer from './components/Footer'

export default function App() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100svh' }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Hero />
        <AppsSection />
      </main>
      <Footer />
    </div>
  )
}

