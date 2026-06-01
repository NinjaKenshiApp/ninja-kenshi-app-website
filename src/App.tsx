import { Suspense, lazy, useEffect, useState } from 'react'
import { AppModal } from './components/AppModal'
import { AboutSection } from './components/AboutSection'
import { AppsShowcase } from './components/AppsShowcase'
import { ContactSection } from './components/ContactSection'
import { FaqSection } from './components/FaqSection'
import { HeroIntro } from './components/HeroIntro'
import { ReviewsCarousel } from './components/ReviewsCarousel'
import { SiteFooter } from './components/SiteFooter'
import { TopNav } from './components/TopNav'
import { CinematicBackground } from './components/cinematic/CinematicBackground'
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

  const openLegalDocument = (slug: string) => {
    const nextUrl = new URL(window.location.href)
    nextUrl.searchParams.set('legal', slug)
    window.history.pushState({}, '', nextUrl)
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
      <CinematicBackground className="site-cosmos-bg" />

      <div className="page-content-layer">
        <TopNav />

        <main>
          <HeroIntro />
          <AboutSection />
          <AppsShowcase onOpenApp={setActiveApp} />
          <ReviewsCarousel />
          <FaqSection />
          <ContactSection />
        </main>

        <SiteFooter />
        <AppModal app={activeApp} onClose={() => setActiveApp(null)} onOpenLegal={openLegalDocument} />
        <Suspense fallback={null}>
          <LegalDocumentModal
            slug={activeLegalSlug}
            onClose={closeLegalDocument}
            onOpenLegal={openLegalDocument}
            canReturnToApp={Boolean(activeApp)}
          />
        </Suspense>
      </div>
    </div>
  )
}

export default App
