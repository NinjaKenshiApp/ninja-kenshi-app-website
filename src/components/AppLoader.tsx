import { useEffect, type CSSProperties } from 'react'
import type { LoaderSnapshot } from './cinematic/LoaderManager'

interface AppLoaderProps {
  snapshot: LoaderSnapshot
}

/*
Purpose: Cinematic loader copy layer synchronized with the canvas-based onboarding timeline.
Key dependencies: LoaderSnapshot from the timeline manager.
Integration: Rendered inside CinematicBackground above the fixed canvas stage.
*/

export function AppLoader({ snapshot }: AppLoaderProps) {
  useEffect(() => {
    if (!snapshot.isVisible) {
      return undefined
    }

    const previousBodyOverflow = document.body.style.overflow
    const previousHtmlOverflow = document.documentElement.style.overflow
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousBodyOverflow
      document.documentElement.style.overflow = previousHtmlOverflow
    }
  }, [snapshot.isVisible])

  if (!snapshot.isVisible) {
    return null
  }

  const progress = Math.min(snapshot.elapsedMs / 10000, 1)
  const overlayStyle: CSSProperties = {
    opacity: snapshot.overlayOpacity,
    transform: `translateY(${snapshot.splitProgress * -18}px) scale(${1 - snapshot.splitProgress * 0.03})`,
  }
  const eyebrowStyle: CSSProperties = {
    opacity: 0.3 + snapshot.textProgress * 0.7,
    letterSpacing: `${0.42 - snapshot.textProgress * 0.12}rem`,
  }
  const titleStyle: CSSProperties = {
    opacity: snapshot.textProgress,
    transform: `translateY(${(1 - snapshot.textProgress) * 18}px)`,
  }

  return (
    <div className={`cinematic-loader${snapshot.isTransitioning ? ' is-transitioning' : ''}`} role="status" aria-live="polite">
      <div className="cinematic-loader__copy" style={overlayStyle}>
        <p className="cinematic-loader__eyebrow" style={eyebrowStyle}>
          WELCOME TO
        </p>
        <h2 className="cinematic-loader__title" style={titleStyle}>
          EL NINJA KENSHI APP
        </h2>
        <div className="cinematic-loader__meter" aria-hidden="true">
          <span style={{ transform: `scaleX(${progress})` }} />
        </div>
      </div>
    </div>
  )
}
