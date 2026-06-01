import type { LoaderSnapshot } from './LoaderManager'
import { clamp, lerp } from './cinematicMath'

type CharacterSide = 'left' | 'right'

interface CharacterContext {
  width: number
  height: number
  imageWidth: number
  imageHeight: number
  timeSeconds: number
  snapshot: LoaderSnapshot
  scrollBoost: number
  reducedMotion: boolean
}

export interface CharacterRenderState {
  x: number
  y: number
  drawWidth: number
  drawHeight: number
  opacity: number
  auraIntensity: number
  ringIntensity: number
  rotation: number
  flipX: boolean
  visible: boolean
}

/*
Purpose: Compute the cinematic placement for the center intro pose and the final side guardians.
Key behavior: the center figure splits into mirrored edge guardians while preserving a content-safe corridor.
Integration: Instantiated twice by BackgroundEngine, once per side.
*/
export class FloatingCharacter {
  private readonly phaseOffset: number
  private readonly side: CharacterSide

  constructor(side: CharacterSide) {
    this.side = side
    this.phaseOffset = side === 'left' ? 0.72 : 2.08
  }

  getRenderState({
    width,
    height,
    imageWidth,
    imageHeight,
    timeSeconds,
    snapshot,
    scrollBoost,
    reducedMotion,
  }: CharacterContext): CharacterRenderState {
    const introScale = width < 720 ? 0.9 : 1.08
    const finalScale = width < 540 ? 0.34 : width < 900 ? 0.5 : 0.65
    const silhouetteHeight = Math.min(height * (width < 720 ? 0.78 : 0.82), width < 720 ? 420 : 720)
    const soloIntroThreshold = 0.08
    const isSoloIntro = snapshot.splitProgress < soloIntroThreshold
    const centerX = width / 2
    const centerY = height * (width < 720 ? 0.54 : 0.53)

    if (isSoloIntro) {
      const drawHeight = silhouetteHeight * introScale
      const drawWidth = drawHeight * (imageWidth / imageHeight)
      const introDriftX = reducedMotion ? 0 : Math.sin(timeSeconds * 0.74) * 3.5
      const introDriftY = reducedMotion ? 0 : Math.cos(timeSeconds * 0.96) * 5.5

      if (this.side === 'left') {
        return {
          x: centerX + introDriftX,
          y: centerY + introDriftY,
          drawWidth,
          drawHeight,
          opacity: 0,
          auraIntensity: 0,
          ringIntensity: 0,
          rotation: 0,
          flipX: false,
          visible: false,
        }
      }

      return {
        x: centerX + introDriftX,
        y: centerY + introDriftY,
        drawWidth,
        drawHeight,
        opacity: 0.92 * (0.8 + snapshot.characterProgress * 0.2),
        auraIntensity: 0.52 + snapshot.auraProgress * 0.96 + snapshot.overloadProgress * 0.22,
        ringIntensity: 0.28 + snapshot.cosmosProgress * 0.68 + snapshot.overloadProgress * 0.24,
        rotation: reducedMotion ? 0 : Math.sin(timeSeconds * 0.62) * 0.01,
        flipX: false,
        visible: true,
      }
    }

    const scale = lerp(introScale, finalScale, snapshot.splitProgress)
    const drawHeight = silhouetteHeight * scale
    const drawWidth = drawHeight * (imageWidth / imageHeight)
    const edgeInset = width < 720 ? 12 : 40
    const targetX = this.side === 'left' ? edgeInset + drawWidth / 2 : width - edgeInset - drawWidth / 2
    const driftX = reducedMotion ? 0 : Math.cos(timeSeconds * 0.82 + this.phaseOffset) * (6 + snapshot.splitProgress * 10)
    const driftY = reducedMotion ? 0 : Math.sin(timeSeconds * 1.34 + this.phaseOffset) * (8 + snapshot.splitProgress * 12)
    const x = lerp(centerX, targetX, snapshot.splitProgress) + driftX
    const y = centerY + driftY

    const contentInset = clamp(width * (width < 720 ? 0.1 : 0.19), width < 720 ? 28 : 140, width < 720 ? 120 : 270)
    const contentLeft = contentInset
    const contentRight = width - contentInset
    const intrusion =
      this.side === 'left' ? Math.max(0, x + drawWidth / 2 - contentLeft) : Math.max(0, contentRight - (x - drawWidth / 2))
    const safeFade = 1 - clamp(intrusion / 210, 0, 0.42)

    const introPresence = 1 - snapshot.splitProgress
    const opacity = lerp(0.88, 0.88, snapshot.splitProgress) * safeFade * (0.78 + snapshot.characterProgress * 0.32)
    const finalGlowReduction = lerp(1, 0.75, snapshot.splitProgress)
    const auraIntensity =
      (0.42 + snapshot.auraProgress * 0.88 + snapshot.overloadProgress * 0.34 + scrollBoost * 0.18) * safeFade * finalGlowReduction
    const ringIntensity =
      (0.24 + snapshot.cosmosProgress * 0.62 + snapshot.overloadProgress * 0.34 + scrollBoost * 0.14) * safeFade * finalGlowReduction
    const direction = this.side === 'left' ? -1 : 1
    const rotation = direction * lerp(0, 0.08, snapshot.splitProgress) + (reducedMotion ? 0 : Math.sin(timeSeconds * 0.7 + this.phaseOffset) * 0.012)

    return {
      x,
      y,
      drawWidth,
      drawHeight,
      opacity,
      auraIntensity,
      ringIntensity,
      rotation,
      flipX: this.side === 'left' && snapshot.splitProgress > 0.08,
      visible: opacity > 0.06 || introPresence > 0.1,
    }
  }

  render(context: CanvasRenderingContext2D, image: HTMLImageElement, state: CharacterRenderState) {
    if (!state.visible) {
      return
    }

    context.save()
    context.translate(state.x, state.y)
    context.rotate(state.rotation)
    context.scale(state.flipX ? -1 : 1, 1)
    context.globalAlpha = state.opacity
    context.drawImage(image, -state.drawWidth / 2, -state.drawHeight / 2, state.drawWidth, state.drawHeight)
    context.restore()
  }
}