/*
Purpose: Paint layered aura halos behind each character with a restrained gold palette.
Key behavior: responds to loader phases, scroll bursts and final guardian glow reduction.
Integration: Called by BackgroundEngine before characters are rendered.
*/
export class AuraSystem {
  render(
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    radius: number,
    intensity: number,
    opacity: number,
    timeSeconds: number,
  ) {
    if (opacity <= 0.01 || intensity <= 0.01) {
      return
    }

    const pulse = 1 + Math.sin(timeSeconds * 2.1) * 0.04
    const outerRadius = radius * (1.18 + intensity * 0.42) * pulse
    const innerRadius = radius * (0.28 + intensity * 0.22)

    context.save()
    context.translate(x, y)
    context.scale(1, 1.16)
    context.globalCompositeOperation = 'screen'
    context.globalAlpha = opacity

    const outerGlow = context.createRadialGradient(0, 0, innerRadius, 0, 0, outerRadius)
    outerGlow.addColorStop(0, `rgba(255, 233, 164, ${0.34 + intensity * 0.24})`)
    outerGlow.addColorStop(0.38, `rgba(255, 174, 60, ${0.22 + intensity * 0.18})`)
    outerGlow.addColorStop(0.72, `rgba(255, 111, 0, ${0.1 + intensity * 0.1})`)
    outerGlow.addColorStop(1, 'rgba(255, 111, 0, 0)')

    context.fillStyle = outerGlow
    context.beginPath()
    context.arc(0, 0, outerRadius, 0, Math.PI * 2)
    context.fill()

    const coreGlow = context.createRadialGradient(0, 0, radius * 0.08, 0, 0, radius * 0.72)
    coreGlow.addColorStop(0, `rgba(255, 247, 220, ${0.34 + intensity * 0.24})`)
    coreGlow.addColorStop(0.48, `rgba(255, 207, 122, ${0.22 + intensity * 0.16})`)
    coreGlow.addColorStop(1, 'rgba(255, 207, 122, 0)')

    context.fillStyle = coreGlow
    context.beginPath()
    context.arc(0, -radius * 0.02, radius * 0.72, 0, Math.PI * 2)
    context.fill()

    context.restore()
  }
}