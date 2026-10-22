import { describe, expect, it } from 'vitest'
import { INTERVAL_DAYS, applyReview, isDue, startLearning } from '../lib/srs'

const DAY = 86_400_000

describe('spaced repetition', () => {
  it('a new learning word is due right away', () => {
    const p = startLearning('deadline', 1000)
    expect(isDue(p, 1000)).toBe(true)
  })

  it('climbs the interval ladder and then masters', () => {
    let now = 0
    let p = startLearning('deadline', now)
    for (const days of INTERVAL_DAYS) {
      p = applyReview(p, true, now)
      expect(p.status).toBe('learning')
      expect(p.dueAt - now).toBe(days * DAY)
      now = p.dueAt
    }
    p = applyReview(p, true, now)
    expect(p.status).toBe('mastered')
    expect(isDue(p, now + 1000 * DAY)).toBe(false)
  })

  it('a miss resets the word to the start', () => {
    let p = startLearning('deadline', 0)
    p = applyReview(p, true, 0)
    p = applyReview(p, true, DAY)
    p = applyReview(p, false, 4 * DAY)
    expect(p).toMatchObject({ step: 0, status: 'learning', dueAt: 4 * DAY, correct: 2, wrong: 1 })
  })
})
