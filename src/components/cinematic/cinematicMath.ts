export const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

export const lerp = (from: number, to: number, amount: number) => from + (to - from) * amount

export const invLerp = (value: number, start: number, end: number) => {
  if (end === start) {
    return 1
  }

  return clamp((value - start) / (end - start), 0, 1)
}

export const easeOutCubic = (value: number) => 1 - (1 - clamp(value, 0, 1)) ** 3

export const easeInOutCubic = (value: number) => {
  const normalized = clamp(value, 0, 1)

  if (normalized < 0.5) {
    return 4 * normalized ** 3
  }

  return 1 - (-2 * normalized + 2) ** 3 / 2
}

export const damp = (current: number, target: number, smoothing: number, deltaSeconds: number) => {
  if (deltaSeconds <= 0) {
    return current
  }

  return lerp(current, target, 1 - Math.exp(-smoothing * deltaSeconds))
}