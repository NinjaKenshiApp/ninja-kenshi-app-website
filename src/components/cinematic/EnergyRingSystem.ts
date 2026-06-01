/*
Purpose: Draw elliptical energy rings that pulse around each active character.
Key behavior: scales with aura/cosmos intensity without overwhelming the content column.
Integration: Rendered between aura and character layers in BackgroundEngine.
*/
export class EnergyRingSystem {
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

    context.save()
    context.translate(x, y)
    context.globalCompositeOperation = 'screen'

    for (let ringIndex = 0; ringIndex < 3; ringIndex += 1) {
      const phaseOffset = ringIndex * 0.9
      const pulse = (Math.sin(timeSeconds * (1.3 + ringIndex * 0.16) + phaseOffset) + 1) * 0.5
      const ringRadius = radius * (0.56 + ringIndex * 0.16 + pulse * 0.08 + intensity * 0.1)

      context.save()
      context.scale(1, 0.68)
      context.globalAlpha = opacity * (0.08 + intensity * 0.22) * (1 - ringIndex * 0.18)
      context.strokeStyle = ringIndex === 0 ? '#ffe4a6' : ringIndex === 1 ? '#ffbc5e' : '#ff8b30'
      context.lineWidth = 1.1 + intensity * 1.6 - ringIndex * 0.2
      context.setLineDash([16 + ringIndex * 10, 12 + ringIndex * 8])
      context.lineDashOffset = -(timeSeconds * (22 + ringIndex * 10))
      context.beginPath()
      context.ellipse(0, 0, ringRadius, ringRadius, 0, 0, Math.PI * 2)
      context.stroke()
      context.restore()
    }

    context.restore()
  }
}