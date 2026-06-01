/*
  Animated Hero Background
  - Pure Canvas + JavaScript
  - No external libraries
  - Optimized for desktop/mobile and retina displays
  - Infinite seamless loop style animation
*/

(function () {
  'use strict'

  const GOLD = {
    bright: '#FFD700',
    mid: '#FFB300',
    deep: '#FF8C00',
    soft: '#FFF5CC',
  }

  const BG = {
    dark0: '#050505',
    dark1: '#0A0A0A',
    dark2: '#101010',
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value))
  }

  function rand(min, max) {
    return Math.random() * (max - min) + min
  }

  function isMobileDevice() {
    return /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent)
  }

  function isLowEndDevice() {
    const memory = navigator.deviceMemory || 4
    const cores = navigator.hardwareConcurrency || 4
    const saveData = navigator.connection && navigator.connection.saveData
    return saveData || memory <= 4 || cores <= 4
  }

  class FloatingMotion {
    constructor() {
      this.yOffset = 0
      this.rotation = 0
    }

    update(timeSec) {
      // Gentle levitation and tiny angular sway.
      this.yOffset = Math.sin(timeSec * 1.35) * 10 + Math.sin(timeSec * 0.44) * 5
      this.rotation = Math.sin(timeSec * 0.9) * (2 * Math.PI / 180)
    }
  }

  class EnergyRing {
    constructor(index, total) {
      this.index = index
      this.total = total
      this.phase = (index / total) * Math.PI * 2
      this.radius = 80 + index * 18
      this.speed = 0.6 + index * 0.08
      this.thickness = 1.2 + (index % 2) * 0.8
      this.alpha = 0.22 + (index / total) * 0.12
      this.orbitTilt = rand(0.22, 0.5)
    }

    draw(ctx, cx, cy, timeSec, intensity, scale) {
      const osc = Math.sin(timeSec * this.speed + this.phase)
      const ringRadius = (this.radius + osc * 9) * scale
      const rot = timeSec * (0.45 + this.index * 0.08) + this.phase

      ctx.save()
      ctx.translate(cx, cy)
      ctx.rotate(rot)
      ctx.scale(1, this.orbitTilt)
      ctx.globalAlpha = this.alpha * (0.65 + intensity * 0.75)
      ctx.strokeStyle = this.index % 2 ? GOLD.mid : GOLD.bright
      ctx.lineWidth = this.thickness * scale
      ctx.beginPath()
      ctx.arc(0, 0, ringRadius, 0, Math.PI * 2)
      ctx.stroke()
      ctx.restore()
    }
  }

  class ParticleSystem {
    constructor(kind, count, width, height, mobile, lowEnd) {
      this.kind = kind
      this.count = count
      this.width = width
      this.height = height
      this.mobile = mobile
      this.lowEnd = lowEnd
      this.pool = new Array(count)

      for (let i = 0; i < count; i += 1) {
        this.pool[i] = this.createParticle(true)
      }
    }

    resize(width, height) {
      this.width = width
      this.height = height
      for (let i = 0; i < this.pool.length; i += 1) {
        const p = this.pool[i]
        p.x = rand(0, width)
        p.y = rand(0, height)
      }
    }

    createParticle(initial) {
      const p = {
        x: rand(0, this.width),
        y: initial ? rand(0, this.height) : this.height + rand(10, this.height * 0.35),
        vx: 0,
        vy: 0,
        size: 1,
        alpha: 1,
        life: 1,
        ttl: 1,
        hue: 0,
      }
      this.resetParticle(p, initial)
      return p
    }

    resetParticle(p, initial) {
      p.x = rand(-this.width * 0.05, this.width * 1.05)
      p.y = initial ? rand(0, this.height) : this.height + rand(8, this.height * 0.3)

      if (this.kind === 'tiny') {
        p.vx = rand(-4, 4)
        p.vy = rand(-42, -18)
        p.size = rand(0.6, this.mobile ? 1.8 : 2.2)
        p.alpha = rand(0.25, 0.8)
        p.ttl = rand(2.8, 7.2)
      } else if (this.kind === 'spark') {
        p.vx = rand(-18, 18)
        p.vy = rand(-95, -45)
        p.size = rand(1.1, 2.8)
        p.alpha = rand(0.35, 0.95)
        p.ttl = rand(0.35, 1.15)
      } else {
        p.vx = rand(-16, 16)
        p.vy = rand(-26, 9)
        p.size = rand(1.2, 3.6)
        p.alpha = rand(0.15, 0.42)
        p.ttl = rand(3.8, 8.5)
      }

      p.life = p.ttl
      p.hue = Math.random()
    }

    update(dt, windX, windY, auraIntensity) {
      for (let i = 0; i < this.pool.length; i += 1) {
        const p = this.pool[i]
        p.life -= dt

        if (p.life <= 0) {
          this.resetParticle(p, false)
          continue
        }

        const fade = p.life / p.ttl
        const auraBoost = 0.72 + auraIntensity * 0.7

        if (this.kind === 'spark') {
          p.vy += 42 * dt
          p.vx += Math.sin((1 - fade) * 8 + p.hue * 10) * dt * 16
        } else if (this.kind === 'fragment') {
          p.vx += Math.cos(fade * 10 + p.hue * 6) * dt * 8
          p.vy += Math.sin(fade * 7 + p.hue * 12) * dt * 5
        }

        p.x += (p.vx + windX) * dt * auraBoost
        p.y += (p.vy + windY) * dt * auraBoost

        if (p.x < -40 || p.x > this.width + 40 || p.y < -60 || p.y > this.height + 60) {
          this.resetParticle(p, false)
        }
      }
    }

    draw(ctx) {
      ctx.save()
      ctx.globalCompositeOperation = this.kind === 'fragment' ? 'source-over' : 'lighter'

      for (let i = 0; i < this.pool.length; i += 1) {
        const p = this.pool[i]
        const fade = p.life / p.ttl

        let alpha
        let color

        if (this.kind === 'tiny') {
          alpha = p.alpha * fade
          color = p.hue > 0.5 ? GOLD.soft : GOLD.bright
        } else if (this.kind === 'spark') {
          alpha = p.alpha * fade * fade
          color = p.hue > 0.5 ? GOLD.mid : GOLD.deep
        } else {
          alpha = p.alpha * fade
          color = p.hue > 0.65 ? '#6f572d' : '#8a6a39'
        }

        if (alpha <= 0.01) continue

        ctx.globalAlpha = alpha
        ctx.fillStyle = color
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.restore()
    }
  }

  class AuraSystem {
    constructor(width, height) {
      this.width = width
      this.height = height
      this.intensity = 0.75
      this.rayCount = 16
      this.rayPhase = new Array(this.rayCount)
      for (let i = 0; i < this.rayCount; i += 1) {
        this.rayPhase[i] = rand(0, Math.PI * 2)
      }
    }

    resize(width, height) {
      this.width = width
      this.height = height
    }

    update(timeSec) {
      // Intensity sweeps every few seconds to emulate power-up breathing.
      this.intensity = 0.55 + (Math.sin(timeSec * 0.5) * 0.2 + Math.sin(timeSec * 1.35) * 0.15 + 0.35)
      this.intensity = clamp(this.intensity, 0.35, 1.2)
    }

    drawBack(ctx, cx, cy, size) {
      const glowRadius = size * (0.95 + this.intensity * 0.22)

      // Core soft glow behind character.
      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowRadius)
      glow.addColorStop(0, 'rgba(255,245,204,0.35)')
      glow.addColorStop(0.28, `rgba(255,211,0,${0.18 + this.intensity * 0.12})`)
      glow.addColorStop(0.62, `rgba(255,140,0,${0.09 + this.intensity * 0.08})`)
      glow.addColorStop(1, 'rgba(255,140,0,0)')

      ctx.save()
      ctx.fillStyle = glow
      ctx.beginPath()
      ctx.arc(cx, cy, glowRadius, 0, Math.PI * 2)
      ctx.fill()

      // Cinematic light rays from behind.
      ctx.translate(cx, cy)
      for (let i = 0; i < this.rayCount; i += 1) {
        const phase = this.rayPhase[i]
        const angle = phase + i * ((Math.PI * 2) / this.rayCount)
        const flicker = 0.55 + 0.45 * Math.sin(performance.now() * 0.0018 + phase)
        const rayLength = size * (1.4 + flicker * 0.75)
        const rayWidth = size * (0.04 + (i % 3) * 0.016)

        ctx.save()
        ctx.rotate(angle)
        ctx.globalAlpha = (0.05 + this.intensity * 0.07) * flicker

        const grad = ctx.createLinearGradient(0, 0, rayLength, 0)
        grad.addColorStop(0, 'rgba(255,245,204,0.48)')
        grad.addColorStop(0.5, 'rgba(255,179,0,0.23)')
        grad.addColorStop(1, 'rgba(255,140,0,0)')

        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.moveTo(0, -rayWidth)
        ctx.lineTo(rayLength, 0)
        ctx.lineTo(0, rayWidth)
        ctx.closePath()
        ctx.fill()
        ctx.restore()
      }

      ctx.restore()
    }

    drawFront(ctx, cx, cy, size, timeSec) {
      // Pulsing aura shell around the body.
      const pulse = 1 + Math.sin(timeSec * 3.2) * 0.06
      const auraRadius = size * 0.72 * pulse

      ctx.save()
      ctx.globalCompositeOperation = 'lighter'
      ctx.globalAlpha = 0.32 + this.intensity * 0.18

      const aura = ctx.createRadialGradient(cx, cy, auraRadius * 0.18, cx, cy, auraRadius)
      aura.addColorStop(0, 'rgba(255,245,204,0.22)')
      aura.addColorStop(0.42, 'rgba(255,215,0,0.2)')
      aura.addColorStop(0.8, 'rgba(255,179,0,0.13)')
      aura.addColorStop(1, 'rgba(255,140,0,0)')

      ctx.fillStyle = aura
      ctx.beginPath()
      ctx.arc(cx, cy, auraRadius, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    }
  }

  class HeroAnimation {
    constructor(canvas, imageSrc) {
      this.canvas = canvas
      this.ctx = canvas.getContext('2d', { alpha: true, desynchronized: true })
      this.imageSrc = imageSrc
      this.characterImage = null
      this.characterReady = false

      this.mobile = isMobileDevice()
      this.lowEnd = isLowEndDevice()
      this.dpr = clamp(window.devicePixelRatio || 1, 1, 2)

      this.width = 0
      this.height = 0
      this.centerX = 0
      this.centerY = 0
      this.characterSize = 220

      this.bgLayer = document.createElement('canvas')
      this.bgCtx = this.bgLayer.getContext('2d')

      this.lastTime = 0
      this.rafId = 0
      this.running = false

      this.floatingMotion = new FloatingMotion()
      this.auraSystem = new AuraSystem(1, 1)
      this.rings = []

      this.tinyParticles = null
      this.sparkParticles = null
      this.fragmentParticles = null

      this.visibilityHandler = this.onVisibilityChange.bind(this)
      this.resizeHandler = this.onResize.bind(this)

      this.setup()
    }

    setup() {
      this.createRings()
      this.loadCharacter(this.imageSrc)
      this.onResize()

      document.addEventListener('visibilitychange', this.visibilityHandler, { passive: true })
      window.addEventListener('resize', this.resizeHandler, { passive: true })

      this.start()
    }

    createRings() {
      this.rings.length = 0
      for (let i = 0; i < 6; i += 1) {
        this.rings.push(new EnergyRing(i, 6))
      }
    }

    loadCharacter(src) {
      const image = new Image()
      image.decoding = 'async'
      image.loading = 'eager'
      image.src = src

      image.onload = async () => {
        try {
          if (image.decode) {
            await image.decode()
          }
        } catch (_) {
          // decode may throw in older browsers, onload is enough.
        }

        this.characterImage = image
        this.characterReady = true
      }

      image.onerror = () => {
        this.characterReady = false
      }
    }

    onResize() {
      const rect = this.canvas.getBoundingClientRect()
      this.width = Math.max(1, rect.width)
      this.height = Math.max(1, rect.height)
      this.dpr = clamp(window.devicePixelRatio || 1, 1, 2)

      this.canvas.width = Math.round(this.width * this.dpr)
      this.canvas.height = Math.round(this.height * this.dpr)
      this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0)

      this.centerX = this.width * 0.5
      this.centerY = this.height * (this.mobile ? 0.56 : 0.58)
      this.characterSize = clamp(Math.min(this.width, this.height) * (this.mobile ? 0.3 : 0.34), 136, 320)

      const tinyCount = this.lowEnd ? (this.mobile ? 320 : 560) : this.mobile ? 720 : 1300
      const sparkCount = this.lowEnd ? 36 : this.mobile ? 58 : 86
      const fragmentCount = this.lowEnd ? 80 : this.mobile ? 120 : 180

      this.tinyParticles = new ParticleSystem('tiny', tinyCount, this.width, this.height, this.mobile, this.lowEnd)
      this.sparkParticles = new ParticleSystem('spark', sparkCount, this.width, this.height, this.mobile, this.lowEnd)
      this.fragmentParticles = new ParticleSystem('fragment', fragmentCount, this.width, this.height, this.mobile, this.lowEnd)
      this.auraSystem.resize(this.width, this.height)

      this.renderBackgroundLayer()
    }

    renderBackgroundLayer() {
      this.bgLayer.width = Math.round(this.width)
      this.bgLayer.height = Math.round(this.height)

      const g = this.bgCtx.createLinearGradient(0, 0, 0, this.height)
      g.addColorStop(0, BG.dark2)
      g.addColorStop(0.5, BG.dark1)
      g.addColorStop(1, BG.dark0)

      this.bgCtx.clearRect(0, 0, this.width, this.height)
      this.bgCtx.fillStyle = g
      this.bgCtx.fillRect(0, 0, this.width, this.height)

      const vignette = this.bgCtx.createRadialGradient(
        this.width * 0.5,
        this.height * 0.48,
        this.width * 0.1,
        this.width * 0.5,
        this.height * 0.5,
        this.width * 0.7,
      )
      vignette.addColorStop(0, 'rgba(255,179,0,0.06)')
      vignette.addColorStop(0.5, 'rgba(255,140,0,0.02)')
      vignette.addColorStop(1, 'rgba(0,0,0,0.5)')

      this.bgCtx.fillStyle = vignette
      this.bgCtx.fillRect(0, 0, this.width, this.height)
    }

    onVisibilityChange() {
      if (document.hidden) {
        this.stop()
      } else {
        this.start()
      }
    }

    start() {
      if (this.running) return
      this.running = true
      this.lastTime = performance.now()
      this.rafId = requestAnimationFrame((t) => this.tick(t))
    }

    stop() {
      if (!this.running) return
      this.running = false
      cancelAnimationFrame(this.rafId)
    }

    tick(timestamp) {
      if (!this.running) return

      const dt = clamp((timestamp - this.lastTime) * 0.001, 0, 0.033)
      this.lastTime = timestamp
      const timeSec = timestamp * 0.001

      this.update(dt, timeSec)
      this.draw(timeSec)

      this.rafId = requestAnimationFrame((t) => this.tick(t))
    }

    update(dt, timeSec) {
      this.floatingMotion.update(timeSec)
      this.auraSystem.update(timeSec)

      const windStrength = this.mobile ? 8 : 12
      const windX = Math.sin(timeSec * 0.65) * windStrength
      const windY = Math.cos(timeSec * 0.52) * -4

      const auraIntensity = this.auraSystem.intensity
      this.tinyParticles.update(dt, windX, windY, auraIntensity)
      this.sparkParticles.update(dt, windX * 0.4, windY * 0.3, auraIntensity)
      this.fragmentParticles.update(dt, windX * 0.5, windY * 0.2, auraIntensity)
    }

    drawCharacter(timeSec) {
      const ctx = this.ctx
      const cx = this.centerX
      const cy = this.centerY + this.floatingMotion.yOffset

      ctx.save()
      ctx.translate(cx, cy)
      ctx.rotate(this.floatingMotion.rotation)

      if (this.characterReady && this.characterImage) {
        const w = this.characterSize
        const h = this.characterSize

        // Soft local glow to integrate character with aura.
        ctx.save()
        ctx.globalAlpha = 0.25 + this.auraSystem.intensity * 0.12
        const localGlow = ctx.createRadialGradient(0, 0, 0, 0, 0, w * 0.74)
        localGlow.addColorStop(0, 'rgba(255,245,204,0.24)')
        localGlow.addColorStop(0.58, 'rgba(255,179,0,0.12)')
        localGlow.addColorStop(1, 'rgba(255,140,0,0)')
        ctx.fillStyle = localGlow
        ctx.beginPath()
        ctx.arc(0, 0, w * 0.74, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()

        ctx.drawImage(this.characterImage, -w * 0.5, -h * 0.5, w, h)
      } else {
        // Placeholder if image is not loaded.
        ctx.fillStyle = GOLD.soft
        ctx.globalAlpha = 0.55
        ctx.beginPath()
        ctx.arc(0, 0, this.characterSize * 0.25, 0, Math.PI * 2)
        ctx.fill()
      }

      // Tiny rim pulse around character body.
      const rimPulse = 1 + Math.sin(timeSec * 5.4) * 0.03
      ctx.globalAlpha = 0.35
      ctx.strokeStyle = GOLD.bright
      ctx.lineWidth = 1.25
      ctx.beginPath()
      ctx.arc(0, 0, this.characterSize * 0.36 * rimPulse, 0, Math.PI * 2)
      ctx.stroke()

      ctx.restore()
    }

    draw(timeSec) {
      const ctx = this.ctx

      ctx.clearRect(0, 0, this.width, this.height)
      ctx.drawImage(this.bgLayer, 0, 0)

      this.auraSystem.drawBack(ctx, this.centerX, this.centerY + this.floatingMotion.yOffset, this.characterSize)

      this.fragmentParticles.draw(ctx)
      this.tinyParticles.draw(ctx)

      const ringScale = this.characterSize / 220
      for (let i = 0; i < this.rings.length; i += 1) {
        this.rings[i].draw(
          ctx,
          this.centerX,
          this.centerY + this.floatingMotion.yOffset,
          timeSec,
          this.auraSystem.intensity,
          ringScale,
        )
      }

      this.drawCharacter(timeSec)
      this.sparkParticles.draw(ctx)
      this.auraSystem.drawFront(ctx, this.centerX, this.centerY + this.floatingMotion.yOffset, this.characterSize, timeSec)
    }

    destroy() {
      this.stop()
      document.removeEventListener('visibilitychange', this.visibilityHandler)
      window.removeEventListener('resize', this.resizeHandler)
    }
  }

  const canvas = document.getElementById('hero-canvas')
  const imagePath = '/brand/ninja-kenshi-logo.png'

  if (canvas instanceof HTMLCanvasElement) {
    // eslint-disable-next-line no-new
    new HeroAnimation(canvas, imagePath)
  }
})()
