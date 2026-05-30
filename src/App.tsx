import { Suspense, lazy, useEffect, useState } from 'react'
import { AppLoader } from './components/AppLoader'
import { AppModal } from './components/AppModal'
import { AboutSection } from './components/AboutSection'
import { AppsShowcase } from './components/AppsShowcase'
import { ContactSection } from './components/ContactSection'
import { FaqSection } from './components/FaqSection'
import { HeroIntro } from './components/HeroIntro'
import { LegalSection } from './components/LegalSection'
import { ReviewsCarousel } from './components/ReviewsCarousel'
import { SiteFooter } from './components/SiteFooter'
import { TopNav } from './components/TopNav'
import type { AppItem } from './types/site'

const LegalDocumentModal = lazy(() =>
  import('./components/LegalDocumentModal').then((module) => ({ default: module.LegalDocumentModal })),
)

/*
Purpose: Top-level SPA composition for intro, apps, reviews and footer.
Key dependencies: local modular sections and modal state handling.
Integration: Main route rendered by src/main.tsx.
*/
function App() {
  const [activeApp, setActiveApp] = useState<AppItem | null>(null)
  const [activeLegalSlug, setActiveLegalSlug] = useState<string | null>(() => {
    const params = new URLSearchParams(window.location.search)
    return params.get('legal')
  })
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
    const syncLegalFromUrl = () => {
      const params = new URLSearchParams(window.location.search)
      setActiveLegalSlug(params.get('legal'))
    }

    window.addEventListener('popstate', syncLegalFromUrl)

    return () => {
      window.removeEventListener('popstate', syncLegalFromUrl)
    }
  }, [])

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

  const openLegalDocument = (slug: string) => {
    const nextUrl = new URL(window.location.href)
    nextUrl.searchParams.set('legal', slug)
    window.history.pushState({}, '', nextUrl)
    setActiveApp(null)
    setActiveLegalSlug(slug)
  }

  const closeLegalDocument = () => {
    const nextUrl = new URL(window.location.href)
    nextUrl.searchParams.delete('legal')
    window.history.pushState({}, '', nextUrl)
    setActiveLegalSlug(null)
  }

  return (
    <div className="page-shell">
      <AppLoader isVisible={isLoading} />
      <TopNav theme={theme} onToggleTheme={toggleTheme} />

      <main>
        <HeroIntro />
        <AboutSection />
        <AppsShowcase onOpenApp={setActiveApp} />
        <LegalSection onOpenLegal={openLegalDocument} />
        <ReviewsCarousel />
        <FaqSection />
        <ContactSection />
      </main>

      <SiteFooter />
      <AppModal app={activeApp} onClose={() => setActiveApp(null)} onOpenLegal={openLegalDocument} />
      <Suspense fallback={null}>
        <LegalDocumentModal slug={activeLegalSlug} onClose={closeLegalDocument} onOpenLegal={openLegalDocument} />
      </Suspense>
    </div>
  )
}

export default App
