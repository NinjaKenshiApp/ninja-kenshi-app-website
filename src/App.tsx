import { useEffect, useState } from 'react'
import { AppLoader } from './components/AppLoader'
import { AppModal } from './components/AppModal'
import { AboutSection } from './components/AboutSection'
import { AppsShowcase } from './components/AppsShowcase'
import { ContactSection } from './components/ContactSection'
import { FaqSection } from './components/FaqSection'
import { FloatingCta } from './components/FloatingCta'
import { HeroIntro } from './components/HeroIntro'
import { ReviewsCarousel } from './components/ReviewsCarousel'
import { SiteFooter } from './components/SiteFooter'
import { TopNav } from './components/TopNav'
import type { AppItem } from './types/site'

/*
Purpose: Top-level SPA composition for intro, apps, reviews and footer.
Key dependencies: local modular sections and modal state handling.
Integration: Main route rendered by src/main.tsx.
*/
function App() {
  const [activeApp, setActiveApp] = useState<AppItem | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const storedTheme = window.localStorage.getItem('ninja-theme')

    if (storedTheme === 'light' || storedTheme === 'dark') {
      return storedTheme
    }

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    return prefersDark ? 'dark' : 'light'
  })

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsLoading(false)
    }, 1400)

    return () => {
      window.clearTimeout(timer)
    }
  }, [])

  useEffect(() => {
    document.documentElement.classList.remove('theme-light', 'theme-dark')
    document.documentElement.classList.add(theme === 'dark' ? 'theme-dark' : 'theme-light')
    window.localStorage.setItem('ninja-theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((previous) => (previous === 'dark' ? 'light' : 'dark'))
  }

  return (
    <div className="page-shell">
      <AppLoader isVisible={isLoading} />
      <TopNav theme={theme} onToggleTheme={toggleTheme} />

      <main>
        <HeroIntro />
        <AboutSection />
        <AppsShowcase onOpenApp={setActiveApp} />
        <ReviewsCarousel />
        <FaqSection />
        <ContactSection />
      </main>

      <SiteFooter />
      <FloatingCta />
      <AppModal app={activeApp} onClose={() => setActiveApp(null)} />
    </div>
  )
}

export default App
