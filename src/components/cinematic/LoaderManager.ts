import { clamp, easeInOutCubic, easeOutCubic, invLerp } from './cinematicMath'

export interface LoaderSnapshot {
  elapsedMs: number
  characterProgress: number
  auraProgress: number
  cosmosProgress: number
  textProgress: number
  overloadProgress: number
  splitProgress: number
  overlayOpacity: number
  isTransitioning: boolean
  isVisible: boolean
}

const INTRO_DURATION_MS = 10000
const TRANSITION_DURATION_MS = 1800

/*
Purpose: Deterministic timeline for the cinematic onboarding sequence.
Key milestones: character, aura, cosmos, text, overload and final split over a long intro beat.
Integration: Shared by the canvas engine and the React loader overlay so both stay synchronized.
*/
export class LoaderManager {
  private startedAt = 0

  constructor(startedAt = performance.now()) {
    this.startedAt = startedAt
  }

  reset(startedAt = performance.now()) {
    this.startedAt = startedAt
  }

  getStartTime() {
    return this.startedAt
  }

  getTotalDuration() {
    return INTRO_DURATION_MS + TRANSITION_DURATION_MS
  }

  getSnapshot(now = performance.now()): LoaderSnapshot {
    const elapsedMs = Math.max(0, now - this.startedAt)
    const splitProgress = easeInOutCubic(invLerp(elapsedMs, INTRO_DURATION_MS, INTRO_DURATION_MS + TRANSITION_DURATION_MS))
    const overlayFade = easeOutCubic(invLerp(elapsedMs, INTRO_DURATION_MS, INTRO_DURATION_MS + TRANSITION_DURATION_MS))

    return {
      elapsedMs,
      characterProgress: easeOutCubic(invLerp(elapsedMs, 0, 1200)),
      auraProgress: easeOutCubic(invLerp(elapsedMs, 1200, 3200)),
      cosmosProgress: easeOutCubic(invLerp(elapsedMs, 2500, 5400)),
      textProgress: easeOutCubic(invLerp(elapsedMs, 3600, 6200)),
      overloadProgress: easeOutCubic(invLerp(elapsedMs, 6800, INTRO_DURATION_MS)),
      splitProgress,
      overlayOpacity: 1 - clamp(overlayFade, 0, 1),
      isTransitioning: elapsedMs >= INTRO_DURATION_MS,
      isVisible: elapsedMs < INTRO_DURATION_MS + TRANSITION_DURATION_MS,
    }
  }
}