import { clamp } from './cinematicMath'

export interface FocusPoint {
  x: number
  y: number
  radius: number
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  alpha: number
  pulse: number
  focusIndex: number
}

interface ParticleSystemOptions {
  count: number
  sizeRange: readonly [number, number]
  alphaRange: readonly [number, number]
  speed: number
  verticalDrift: number
  color: string
  colorAlt: string
  migrationColors?: readonly [string, string, string]
  blur: number
  spawnMode: 'field' | 'focus'
}

const randomBetween = (min: number, max: number) => min + Math.random() * (max - min)

const hexToRgb = (hex: string) => {
  const normalized = hex.replace('#', '')
  const compact = normalized.length === 3 ? normalized.split('').map((char) => `${char}${char}`).join('') : normalized
  const value = Number.parseInt(compact, 16)

  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  }
}

const mixChannel = (from: number, to: number, amount: number) => Math.round(from + (to - from) * amount)

const mixHex = (from: string, to: string, amount: number) => {
  const fromRgb = hexToRgb(from)
  const toRgb = hexToRgb(to)

  return `rgb(${mixChannel(fromRgb.r, toRgb.r, amount)} ${mixChannel(fromRgb.g, toRgb.g, amount)} ${mixChannel(fromRgb.b, toRgb.b, amount)})`
}

const getMigratingColor = (colors: readonly [string, string, string], phase: number) => {
  const cycle = phase * colors.length
  const fromIndex = Math.floor(cycle) % colors.length
  const toIndex = (fromIndex + 1) % colors.length
  const amount = cycle - Math.floor(cycle)

  return mixHex(colors[fromIndex], colors[toIndex], amount)
}

/*
Purpose: Lightweight particle pool for the permanent background, dust and focus-based embers.
Key modes: field for wide ambience and focus for character-adjacent cosmos bursts.
Integration: Driven by BackgroundEngine on every animation frame.
*/
export class ParticleSystem {
  private readonly particles: Particle[] = []
  private width = 1
  private height = 1
  private readonly options: ParticleSystemOptions

  constructor(options: ParticleSystemOptions) {
    this.options = options
  }

  resize(width: number, height: number) {
    this.width = Math.max(1, width)
    this.height = Math.max(1, height)
    this.particles.length = 0

    for (let index = 0; index < this.options.count; index += 1) {
      this.particles.push(this.createParticle([], true))
    }
  }

  update(deltaSeconds: number, intensity: number, focusPoints: FocusPoint[] = []) {
    const speedMultiplier = 1 + intensity * (this.options.spawnMode === 'focus' ? 0.85 : 0.22)

    for (const particle of this.particles) {
      particle.x += particle.vx * deltaSeconds * speedMultiplier
      particle.y += (particle.vy + this.options.verticalDrift * 10) * deltaSeconds * speedMultiplier
      particle.alpha += Math.sin((particle.pulse + performance.now() * 0.00055) * 2.2) * deltaSeconds * 0.08
      particle.alpha = clamp(particle.alpha, this.options.alphaRange[0], this.options.alphaRange[1])

      const isOutsideHorizontal = particle.x < -80 || particle.x > this.width + 80
      const isOutsideVertical = particle.y < -80 || particle.y > this.height + 80

      if (isOutsideHorizontal || isOutsideVertical) {
        Object.assign(particle, this.createParticle(focusPoints, false))
      }
    }
  }

  render(context: CanvasRenderingContext2D) {
    context.save()
    context.filter = this.options.blur > 0 ? `blur(${this.options.blur}px)` : 'none'
    const now = performance.now() * 0.00012

    for (const particle of this.particles) {
      context.beginPath()
      context.fillStyle = this.options.migrationColors
        ? getMigratingColor(this.options.migrationColors, (now + particle.pulse * 0.42 + particle.focusIndex * 0.18) % 1)
        : particle.focusIndex % 2 === 0
          ? this.options.color
          : this.options.colorAlt
      context.globalAlpha = particle.alpha
      context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
      context.fill()
    }

    context.restore()
  }

  private createParticle(focusPoints: FocusPoint[], wideSpawn: boolean): Particle {
    const useFocus = this.options.spawnMode === 'focus' && focusPoints.length > 0

    if (useFocus) {
      const focusIndex = Math.floor(Math.random() * focusPoints.length)
      const focusPoint = focusPoints[focusIndex]
      const angle = randomBetween(-Math.PI * 0.8, Math.PI * 0.8)
      const radius = randomBetween(18, focusPoint.radius)
      const speed = randomBetween(30, 70) * this.options.speed

      return {
        x: focusPoint.x + Math.cos(angle) * radius,
        y: focusPoint.y + Math.sin(angle) * radius,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - this.options.verticalDrift * 30,
        size: randomBetween(this.options.sizeRange[0], this.options.sizeRange[1]),
        alpha: randomBetween(this.options.alphaRange[0], this.options.alphaRange[1]),
        pulse: Math.random() * Math.PI * 2,
        focusIndex,
      }
    }

    const fromTop = Math.random() > 0.45
    const x = wideSpawn ? randomBetween(0, this.width) : randomBetween(-30, this.width + 30)
    const y = fromTop ? randomBetween(-20, this.height * 0.85) : this.height + randomBetween(20, 140)
    const vx = randomBetween(-18, 18) * this.options.speed
    const vy = fromTop ? randomBetween(8, 28) * this.options.speed : randomBetween(-28, -10) * this.options.speed

    return {
      x,
      y,
      vx,
      vy,
      size: randomBetween(this.options.sizeRange[0], this.options.sizeRange[1]),
      alpha: randomBetween(this.options.alphaRange[0], this.options.alphaRange[1]),
      pulse: Math.random() * Math.PI * 2,
      focusIndex: Math.floor(Math.random() * 2),
    }
  }
}