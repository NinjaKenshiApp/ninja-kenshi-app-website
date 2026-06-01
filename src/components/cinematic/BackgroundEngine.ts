import { AuraSystem } from './AuraSystem'
import { EnergyRingSystem } from './EnergyRingSystem'
import { FloatingCharacter } from './FloatingCharacter'
import type { LoaderManager } from './LoaderManager'
import { ParticleSystem } from './ParticleSystem'
import { clamp, damp } from './cinematicMath'

interface BackgroundEngineOptions {
  canvas: HTMLCanvasElement
  image: HTMLImageElement
  loaderManager: LoaderManager
  reducedMotion: boolean
}

/*
Purpose: Own the fixed cinematic canvas background used during the loader and the persistent launcher state.
Key layers: stars, dust, embers, aura, energy rings, split guardians and safe-zone masking.
Integration: Created once by CinematicBackground and kept alive for the full SPA session.
*/
export class BackgroundEngine {
  private readonly options: BackgroundEngineOptions
  private readonly context: CanvasRenderingContext2D
  private readonly auraSystem = new AuraSystem()
  private readonly ringSystem = new EnergyRingSystem()
  private readonly leftGuardian = new FloatingCharacter('left')
  private readonly rightGuardian = new FloatingCharacter('right')
  private readonly starField: ParticleSystem
  private readonly dustField: ParticleSystem
  private readonly emberField: ParticleSystem

  private animationFrameId = 0
  private lastFrameTime = 0
  private width = 1
  private height = 1
  private dpr = 1
  private readonly lowPerformance: boolean
  private scrollBoost = 0
  private scrollImpulse = 0
  private lastScrollAt = 0
  private lastScrollY = window.scrollY

  constructor(options: BackgroundEngineOptions) {
    this.options = options
    this.lowPerformance =
      options.reducedMotion ||
      ((navigator.hardwareConcurrency ?? 8) <= 6) ||
      (typeof navigator !== 'undefined' && 'deviceMemory' in navigator && Number((navigator as Navigator & { deviceMemory?: number }).deviceMemory) <= 8)

    const context = options.canvas.getContext('2d')

    if (!context) {
      throw new Error('No se pudo inicializar el canvas cinematografico.')
    }

    this.context = context
    this.starField = new ParticleSystem({
      count: this.lowPerformance ? 156 : 276,
      sizeRange: [0.7, 1.9],
      alphaRange: [0.06, 0.28],
      speed: 1,
      verticalDrift: -0.06,
      color: '#f4f1e6',
      colorAlt: '#ffd27d',
      migrationColors: ['#ffd76c', '#ffffff', '#6fe8ff'],
      blur: 0,
      spawnMode: 'field',
    })
    this.dustField = new ParticleSystem({
      count: this.lowPerformance ? 126 : 216,
      sizeRange: [0.8, 2],
      alphaRange: [0.045, 0.16],
      speed: 1,
      verticalDrift: -0.12,
      color: '#d9c17a',
      colorAlt: '#ffb86a',
      migrationColors: ['#ffcf70', '#f7fbff', '#7cecff'],
      blur: 0,
      spawnMode: 'field',
    })
    this.emberField = new ParticleSystem({
      count: this.lowPerformance ? 144 : 288,
      sizeRange: [0.85, 2.4],
      alphaRange: [0.12, 0.34],
      speed: 1,
      verticalDrift: -0.18,
      color: '#ffd98a',
      colorAlt: '#ff9e3d',
      migrationColors: ['#ffd98a', '#ffffff', '#63e7ff'],
      blur: 0,
      spawnMode: 'focus',
    })

  }

  start() {
    this.handleResize()
    this.lastScrollAt = performance.now()
    window.addEventListener('resize', this.handleResize, { passive: true })
    window.addEventListener('scroll', this.handleScroll, { passive: true })
    document.addEventListener('visibilitychange', this.handleVisibilityChange)
    this.animationFrameId = requestAnimationFrame(this.frame)
  }

  stop() {
    window.removeEventListener('resize', this.handleResize)
    window.removeEventListener('scroll', this.handleScroll)
    document.removeEventListener('visibilitychange', this.handleVisibilityChange)
    cancelAnimationFrame(this.animationFrameId)
    this.animationFrameId = 0
    this.lastFrameTime = 0
  }

  private readonly handleResize = () => {
    this.width = Math.max(1, this.options.canvas.clientWidth)
    this.height = Math.max(1, this.options.canvas.clientHeight)
    this.dpr = Math.min(window.devicePixelRatio || 1, 2)
    this.options.canvas.width = Math.round(this.width * this.dpr)
    this.options.canvas.height = Math.round(this.height * this.dpr)
    this.context.setTransform(this.dpr, 0, 0, this.dpr, 0, 0)
    this.context.imageSmoothingEnabled = true
    this.context.imageSmoothingQuality = 'high'
    this.starField.resize(this.width, this.height)
    this.dustField.resize(this.width, this.height)
    this.emberField.resize(this.width, this.height)
  }

  private readonly handleScroll = () => {
    const nextScrollY = window.scrollY
    const delta = Math.abs(nextScrollY - this.lastScrollY)

    this.scrollImpulse = clamp(delta / 240, 0.12, 1)
    this.lastScrollY = nextScrollY
    this.lastScrollAt = performance.now()
  }

  private readonly handleVisibilityChange = () => {
    if (document.hidden) {
      this.lastFrameTime = 0
      return
    }

    if (!this.animationFrameId) {
      this.animationFrameId = requestAnimationFrame(this.frame)
    }
  }

  private readonly frame = (now: number) => {
    if (document.hidden) {
      this.animationFrameId = requestAnimationFrame(this.frame)
      return
    }

    const deltaSeconds = this.lastFrameTime === 0 ? 1 / 60 : Math.min(0.05, (now - this.lastFrameTime) / 1000)
    this.lastFrameTime = now

    const snapshot = this.options.loaderManager.getSnapshot(now)
    const splitBurst = this.getSplitBurst(snapshot.splitProgress)
    const timeSinceScroll = now - this.lastScrollAt
    const scrollTarget = timeSinceScroll < 800 ? this.scrollImpulse * (1 - timeSinceScroll / 800) : 0
    this.scrollBoost = damp(this.scrollBoost, scrollTarget, 7.5, deltaSeconds)

    const timeSeconds = (now - this.options.loaderManager.getStartTime()) / 1000
    const leftState = this.leftGuardian.getRenderState({
      width: this.width,
      height: this.height,
      imageWidth: this.options.image.naturalWidth,
      imageHeight: this.options.image.naturalHeight,
      timeSeconds,
      snapshot,
      scrollBoost: this.scrollBoost,
      reducedMotion: this.options.reducedMotion,
    })
    const rightState = this.rightGuardian.getRenderState({
      width: this.width,
      height: this.height,
      imageWidth: this.options.image.naturalWidth,
      imageHeight: this.options.image.naturalHeight,
      timeSeconds,
      snapshot,
      scrollBoost: this.scrollBoost,
      reducedMotion: this.options.reducedMotion,
    })

    const emberFocusPoints =
      snapshot.splitProgress < 0.08
        ? [{ x: this.width / 2, y: this.height * 0.44, radius: Math.min(this.width, this.height) * (0.2 + splitBurst * 0.16) }]
        : [
            { x: leftState.x, y: leftState.y, radius: leftState.drawWidth * (0.28 + splitBurst * 0.12) },
            { x: rightState.x, y: rightState.y, radius: rightState.drawWidth * (0.28 + splitBurst * 0.12) },
          ]

    this.starField.update(deltaSeconds, 0.2 + this.scrollBoost * 0.12 + splitBurst * 0.16)
    this.dustField.update(deltaSeconds, 0.58 + snapshot.auraProgress * 0.32 + this.scrollBoost * 0.3 + splitBurst * 0.34)
    this.emberField.update(
      deltaSeconds,
      0.62 + snapshot.cosmosProgress * 0.82 + snapshot.overloadProgress * 0.42 + this.scrollBoost * 0.38 + splitBurst * 1.15,
      emberFocusPoints,
    )

    this.renderScene(snapshot.splitProgress, leftState, rightState, timeSeconds, splitBurst)
    this.animationFrameId = requestAnimationFrame(this.frame)
  }

  private renderScene(
    splitProgress: number,
    leftState: ReturnType<FloatingCharacter['getRenderState']>,
    rightState: ReturnType<FloatingCharacter['getRenderState']>,
    timeSeconds: number,
    splitBurst: number,
  ) {
    const introState = splitProgress < 0.42 ? this.createIntroState(rightState, splitProgress) : null
    const splitReveal = this.getSplitReveal(splitProgress)
    const blendedLeftState = this.blendSplitState(leftState, splitReveal)
    const blendedRightState = this.blendSplitState(rightState, splitReveal)
    const primaryState = introState ?? blendedLeftState
    const secondaryState = introState ? blendedRightState : blendedRightState

    this.context.clearRect(0, 0, this.width, this.height)
    this.renderBackdrop(timeSeconds)
    this.starField.render(this.context)
    this.renderNebula(timeSeconds, primaryState, secondaryState, Boolean(introState))
    this.dustField.render(this.context)
    this.emberField.render(this.context)

    if (introState) {
      const introRadius = Math.max(introState.drawWidth, introState.drawHeight) * 0.46

      this.auraSystem.render(
        this.context,
        introState.x,
        introState.y,
        introRadius,
        introState.auraIntensity,
        introState.opacity,
        timeSeconds,
      )
      this.ringSystem.render(
        this.context,
        introState.x,
        introState.y,
        introRadius,
        introState.ringIntensity,
        introState.opacity,
        timeSeconds,
      )
      this.rightGuardian.render(this.context, this.options.image, introState)

      if (splitReveal > 0.01) {
        this.renderCharacterPair(blendedLeftState, blendedRightState, timeSeconds)
      }
    } else {
      this.renderCharacterPair(blendedLeftState, blendedRightState, timeSeconds)
    }

    this.renderSplitExplosion(splitBurst, timeSeconds)

    this.renderSafeZoneMask(splitProgress)

    if (!this.lowPerformance) {
      this.renderForegroundFilm(timeSeconds)
    }
  }

  private createIntroState(rightState: ReturnType<FloatingCharacter['getRenderState']>, splitProgress: number) {
    const introMaxHeight = this.width < 720 ? 340 : 460
    const introMinHeight = this.width < 720 ? 270 : 360
    const ratio = rightState.drawWidth / rightState.drawHeight
    const drawHeight = Math.min(introMaxHeight, Math.max(introMinHeight, rightState.drawHeight * (0.56 + splitProgress * 0.04)))
    const fadeOut = 1 - clamp(splitProgress / 0.34, 0, 1)

    return {
      ...rightState,
      x: this.width / 2,
      y: this.height * (this.width < 720 ? 0.42 : 0.43),
      drawWidth: drawHeight * ratio,
      drawHeight,
      opacity: Math.min(1, (rightState.opacity + 0.08) * fadeOut),
      auraIntensity: (rightState.auraIntensity + 0.12) * (0.78 + fadeOut * 0.4),
      ringIntensity: (rightState.ringIntensity + 0.08) * (0.72 + fadeOut * 0.44),
      rotation: rightState.rotation * 0.3,
      flipX: false,
      visible: fadeOut > 0.02,
    }
  }

  private getSplitReveal(splitProgress: number) {
    return clamp((splitProgress - 0.04) / 0.24, 0, 1)
  }

  private getSplitBurst(splitProgress: number) {
    const normalized = clamp((splitProgress - 0.06) / 0.34, 0, 1)
    return Math.sin(normalized * Math.PI)
  }

  private blendSplitState(state: ReturnType<FloatingCharacter['getRenderState']>, reveal: number) {
    return {
      ...state,
      opacity: state.opacity * reveal,
      auraIntensity: state.auraIntensity * (0.48 + reveal * 0.52),
      ringIntensity: state.ringIntensity * (0.42 + reveal * 0.58),
      visible: state.visible && reveal > 0.01,
    }
  }

  private renderCharacterPair(
    leftState: ReturnType<FloatingCharacter['getRenderState']>,
    rightState: ReturnType<FloatingCharacter['getRenderState']>,
    timeSeconds: number,
  ) {
    const auraRadiusLeft = Math.max(leftState.drawWidth, leftState.drawHeight) * 0.46
    const auraRadiusRight = Math.max(rightState.drawWidth, rightState.drawHeight) * 0.46

    this.auraSystem.render(this.context, leftState.x, leftState.y, auraRadiusLeft, leftState.auraIntensity, leftState.opacity, timeSeconds)
    this.auraSystem.render(this.context, rightState.x, rightState.y, auraRadiusRight, rightState.auraIntensity, rightState.opacity, timeSeconds)
    this.ringSystem.render(this.context, leftState.x, leftState.y, auraRadiusLeft, leftState.ringIntensity, leftState.opacity, timeSeconds)
    this.ringSystem.render(this.context, rightState.x, rightState.y, auraRadiusRight, rightState.ringIntensity, rightState.opacity, timeSeconds)
    this.leftGuardian.render(this.context, this.options.image, leftState)
    this.rightGuardian.render(this.context, this.options.image, rightState)
  }

  private renderSplitExplosion(splitBurst: number, timeSeconds: number) {
    if (splitBurst <= 0.001) {
      return
    }

    const centerX = this.width / 2
    const centerY = this.height * 0.44
    const radius = Math.min(this.width, this.height) * (0.16 + splitBurst * 0.42)

    this.context.save()
    this.context.globalCompositeOperation = 'screen'

    const flash = this.context.createRadialGradient(centerX, centerY, radius * 0.04, centerX, centerY, radius)
    flash.addColorStop(0, `rgba(255, 255, 255, ${0.62 + splitBurst * 0.28})`)
    flash.addColorStop(0.16, `rgba(221, 247, 255, ${0.46 + splitBurst * 0.24})`)
    flash.addColorStop(0.38, `rgba(255, 222, 149, ${0.28 + splitBurst * 0.22})`)
    flash.addColorStop(1, 'rgba(255, 222, 149, 0)')
    this.context.fillStyle = flash
    this.context.fillRect(0, 0, this.width, this.height)

    this.context.globalAlpha = splitBurst * 0.16
    this.context.fillStyle = '#fefefe'
    this.context.fillRect(0, 0, this.width, this.height)

    this.context.translate(centerX, centerY)

    for (let shockwaveIndex = 0; shockwaveIndex < 2; shockwaveIndex += 1) {
      const growth = 0.64 + shockwaveIndex * 0.26 + splitBurst * (0.86 + shockwaveIndex * 0.18)
      this.context.save()
      this.context.scale(1, 0.74)
      this.context.globalAlpha = splitBurst * (0.28 - shockwaveIndex * 0.08)
      this.context.strokeStyle = shockwaveIndex === 0 ? '#ffffff' : '#8debff'
      this.context.lineWidth = 2.2 + splitBurst * (2 - shockwaveIndex * 0.5)
      this.context.beginPath()
      this.context.ellipse(0, 0, radius * growth, radius * growth, 0, 0, Math.PI * 2)
      this.context.stroke()
      this.context.restore()
    }

    this.context.rotate(timeSeconds * 0.12)
    this.context.globalAlpha = splitBurst * 0.24
    this.context.strokeStyle = 'rgba(255, 255, 255, 0.9)'
    this.context.lineWidth = 1.4

    for (let rayIndex = 0; rayIndex < 10; rayIndex += 1) {
      const angle = (Math.PI * 2 * rayIndex) / 10
      const inner = radius * 0.34
      const outer = radius * (0.9 + Math.sin(timeSeconds * 2 + rayIndex) * 0.06)
      this.context.beginPath()
      this.context.moveTo(Math.cos(angle) * inner, Math.sin(angle) * inner)
      this.context.lineTo(Math.cos(angle) * outer, Math.sin(angle) * outer)
      this.context.stroke()
    }

    this.context.restore()
  }

  private renderBackdrop(timeSeconds: number) {
    const gradient = this.context.createLinearGradient(0, 0, 0, this.height)
    gradient.addColorStop(0, '#020202')
    gradient.addColorStop(0.34, '#050505')
    gradient.addColorStop(0.74, '#080808')
    gradient.addColorStop(1, '#020202')
    this.context.fillStyle = gradient
    this.context.fillRect(0, 0, this.width, this.height)

    const orbitX = this.width * (0.5 + Math.sin(timeSeconds * 0.18) * 0.04)
    const orbitY = this.height * (0.44 + Math.cos(timeSeconds * 0.22) * 0.03)
    const orbitalGlow = this.context.createRadialGradient(orbitX, orbitY, 0, orbitX, orbitY, Math.max(this.width, this.height) * 0.7)
    orbitalGlow.addColorStop(0, `rgba(255, 176, 74, ${0.07 + this.scrollBoost * 0.08})`)
    orbitalGlow.addColorStop(0.38, 'rgba(132, 95, 44, 0.08)')
    orbitalGlow.addColorStop(1, 'rgba(5, 5, 5, 0)')
    this.context.fillStyle = orbitalGlow
    this.context.fillRect(0, 0, this.width, this.height)
  }

  private renderNebula(
    timeSeconds: number,
    leftState: ReturnType<FloatingCharacter['getRenderState']>,
    rightState: ReturnType<FloatingCharacter['getRenderState']>,
    singleCharacter: boolean,
  ) {
    if (leftState.opacity > 0.01) {
      const leftGlow = this.context.createRadialGradient(leftState.x, leftState.y, 0, leftState.x, leftState.y, leftState.drawWidth * 1.8)
      leftGlow.addColorStop(0, `rgba(255, 193, 94, ${0.08 + leftState.auraIntensity * 0.12})`)
      leftGlow.addColorStop(1, 'rgba(255, 193, 94, 0)')
      this.context.fillStyle = leftGlow
      this.context.fillRect(0, 0, this.width, this.height)
    }

    if (!singleCharacter && rightState.opacity > 0.01) {
      const rightGlow = this.context.createRadialGradient(rightState.x, rightState.y, 0, rightState.x, rightState.y, rightState.drawWidth * 1.8)
      rightGlow.addColorStop(0, `rgba(255, 142, 53, ${0.06 + rightState.auraIntensity * 0.1})`)
      rightGlow.addColorStop(1, 'rgba(255, 142, 53, 0)')
      this.context.fillStyle = rightGlow
      this.context.fillRect(0, 0, this.width, this.height)
    }

    if (!this.lowPerformance) {
      this.context.save()
      this.context.globalAlpha = singleCharacter ? 0.12 : 0.08 + this.scrollBoost * 0.05
      this.context.strokeStyle = 'rgba(255, 215, 128, 0.12)'
      this.context.lineWidth = 1

      for (let rayIndex = 0; rayIndex < (singleCharacter ? 4 : 3); rayIndex += 1) {
        const angle = (singleCharacter ? -0.3 : -0.22) + rayIndex * 0.2 + Math.sin(timeSeconds * 0.42 + rayIndex) * 0.03
        const originX = this.width / 2
        const originY = this.height * (singleCharacter ? 0.43 : 0.52)
        const distance = this.width * (singleCharacter ? 0.24 : 0.34)

        this.context.beginPath()
        this.context.moveTo(originX, originY)
        this.context.lineTo(originX + Math.cos(angle) * distance, originY - Math.sin(angle) * this.height * (singleCharacter ? 0.12 : 0.18))
        this.context.stroke()
      }

      this.context.restore()
    }
  }

  private renderSafeZoneMask(splitProgress: number) {
    // Deactivate the mask while running the intro
    if (splitProgress < 0.14) {
      return
    }

    const contentWidth = Math.min(1140, this.width * 0.72)
    const leftEdge = (this.width - contentWidth) / 2
    const guard = this.context.createLinearGradient(leftEdge - 90, 0, leftEdge + contentWidth + 90, 0)
    guard.addColorStop(0, 'rgba(5, 5, 5, 0)')
    guard.addColorStop(0.16, 'rgba(5, 5, 5, 0.14)')
    guard.addColorStop(0.5, `rgba(5, 5, 5, ${0.24 + splitProgress * 0.16})`)
    guard.addColorStop(0.84, 'rgba(5, 5, 5, 0.14)')
    guard.addColorStop(1, 'rgba(5, 5, 5, 0)')

    this.context.fillStyle = guard
    this.context.fillRect(leftEdge - 90, 0, contentWidth + 180, this.height)

    const topVeil = this.context.createLinearGradient(0, 0, 0, 132)
    topVeil.addColorStop(0, 'rgba(5, 5, 5, 0.62)')
    topVeil.addColorStop(1, 'rgba(5, 5, 5, 0)')
    this.context.fillStyle = topVeil
    this.context.fillRect(0, 0, this.width, 132)
  }

  private renderForegroundFilm(timeSeconds: number) {
    this.context.save()
    this.context.globalCompositeOperation = 'soft-light'
    this.context.globalAlpha = 0.05
    this.context.fillStyle = '#ffffff'

    for (let index = 0; index < 8; index += 1) {
      const width = 2 + ((index % 3) + 1) * 1.4
      const x = (index / 8) * this.width + Math.sin(timeSeconds * 0.22 + index) * 10
      this.context.fillRect(x, 0, width, this.height)
    }

    this.context.restore()
  }
}