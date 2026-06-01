import { useEffect, useRef, useState } from 'react'
import { AppLoader } from '../AppLoader'
import { BackgroundEngine } from './BackgroundEngine'
import { LoaderManager, type LoaderSnapshot } from './LoaderManager'
import './CinematicBackground.css'

interface CinematicBackgroundProps {
  imageSrc?: string
  className?: string
}

const DEFAULT_IMAGE_SRC = `${import.meta.env.BASE_URL}brand/ninja-kenshi-logo.png`

const createFallbackSnapshot = (): LoaderSnapshot => ({
  elapsedMs: 0,
  characterProgress: 0,
  auraProgress: 0,
  cosmosProgress: 0,
  textProgress: 0,
  overloadProgress: 0,
  splitProgress: 0,
  overlayOpacity: 1,
  isTransitioning: false,
  isVisible: true,
})

/*
Purpose: React bridge that mounts the permanent cinematic canvas and keeps the loader overlay in sync.
Key dependencies: BackgroundEngine for rendering and AppLoader for copy/timeline presentation.
Integration: Mounted once at the top of App so the launcher background persists beneath every section and modal.
*/
export function CinematicBackground({ imageSrc = DEFAULT_IMAGE_SRC, className }: CinematicBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const engineRef = useRef<BackgroundEngine | null>(null)
  const loaderManagerRef = useRef<LoaderManager | null>(null)
  const reducedMotionRef = useRef(false)

  if (loaderManagerRef.current === null) {
    loaderManagerRef.current = new LoaderManager()
  }

  const [snapshot, setSnapshot] = useState<LoaderSnapshot>(() => loaderManagerRef.current?.getSnapshot() ?? createFallbackSnapshot())

  useEffect(() => {
    const root = document.documentElement
    root.classList.add('theme-dark')
    root.classList.remove('theme-light')
    document.body.classList.add('cinematic-body')

    return () => {
      document.body.classList.remove('cinematic-body')
    }
  }, [])

  useEffect(() => {
    document.body.classList.toggle('cinematic-intro-active', snapshot.isVisible)
    document.documentElement.classList.toggle('cinematic-intro-active', snapshot.isVisible)

    return () => {
      document.body.classList.remove('cinematic-intro-active')
      document.documentElement.classList.remove('cinematic-intro-active')
    }
  }, [snapshot.isVisible])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    const syncPreference = () => {
      reducedMotionRef.current = mediaQuery.matches
    }

    syncPreference()
    mediaQuery.addEventListener('change', syncPreference)

    return () => {
      mediaQuery.removeEventListener('change', syncPreference)
    }
  }, [])

  useEffect(() => {
    const loaderManager = loaderManagerRef.current

    if (!loaderManager) {
      return undefined
    }

    let frameId = 0

    const updateSnapshot = (now: number) => {
      const nextSnapshot = loaderManager.getSnapshot(now)
      setSnapshot(nextSnapshot)

      if (nextSnapshot.isVisible) {
        frameId = requestAnimationFrame(updateSnapshot)
      }
    }

    frameId = requestAnimationFrame(updateSnapshot)

    return () => {
      cancelAnimationFrame(frameId)
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    const loaderManager = loaderManagerRef.current

    if (!canvas || !loaderManager) {
      return undefined
    }

    let isDisposed = false
    const image = new Image()
    image.decoding = 'async'

    const bootEngine = () => {
      if (isDisposed || !canvas || image.naturalWidth === 0 || image.naturalHeight === 0) {
        return
      }

      engineRef.current?.stop()
      engineRef.current = new BackgroundEngine({
        canvas,
        image,
        loaderManager,
        reducedMotion: reducedMotionRef.current,
      })
      engineRef.current.start()
    }

    image.addEventListener('load', bootEngine)
    image.src = imageSrc

    if (image.complete) {
      bootEngine()
    }

    return () => {
      isDisposed = true
      image.removeEventListener('load', bootEngine)
      engineRef.current?.stop()
      engineRef.current = null
    }
  }, [imageSrc])

  const rootClassName = className ? `cinematic-background ${className}` : 'cinematic-background'

  return (
    <div className={`${rootClassName}${snapshot.isVisible ? ' is-intro-active' : ''}`}>
      <canvas ref={canvasRef} className="cinematic-background__canvas" aria-hidden="true" />
      <div className="cinematic-background__veil" aria-hidden="true" />
      <div className="cinematic-background__content-guard" aria-hidden="true" />
      <AppLoader snapshot={snapshot} />
    </div>
  )
}