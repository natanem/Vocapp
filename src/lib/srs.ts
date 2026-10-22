// Spaced repetition: a simple step ladder. Each correct review moves a word
// one step up and pushes the next review further out; a miss sends it back
// to the start. After the last interval is passed, the word is mastered.

export type Status = 'new' | 'known' | 'learning' | 'mastered'

export interface Progress {
  wordId: string
  status: Status
  /** Number of correct reviews in a row. */
  step: number
  /** When the next review is due (ms since epoch). */
  dueAt: number
  lastReviewedAt?: number
  correct: number
  wrong: number
  updatedAt: number
}

const DAY = 24 * 60 * 60 * 1000

/** Days until the next review after the Nth correct answer in a row. */
export const INTERVAL_DAYS = [1, 3, 7, 14, 30]

export function startLearning(wordId: string, now: number, prev?: Progress): Progress {
  return {
    wordId,
    status: 'learning',
    step: 0,
    dueAt: now,
    correct: prev?.correct ?? 0,
    wrong: prev?.wrong ?? 0,
    lastReviewedAt: prev?.lastReviewedAt,
    updatedAt: now,
  }
}

export function markKnown(wordId: string, now: number, prev?: Progress): Progress {
  return {
    wordId,
    status: 'known',
    step: 0,
    dueAt: 0,
    correct: prev?.correct ?? 0,
    wrong: prev?.wrong ?? 0,
    lastReviewedAt: prev?.lastReviewedAt,
    updatedAt: now,
  }
}

export function applyReview(p: Progress, isCorrect: boolean, now: number): Progress {
  if (!isCorrect) {
    return { ...p, status: 'learning', step: 0, dueAt: now, wrong: p.wrong + 1, lastReviewedAt: now, updatedAt: now }
  }
  if (p.step >= INTERVAL_DAYS.length) {
    return { ...p, status: 'mastered', step: p.step + 1, dueAt: 0, correct: p.correct + 1, lastReviewedAt: now, updatedAt: now }
  }
  return {
    ...p,
    status: 'learning',
    step: p.step + 1,
    dueAt: now + INTERVAL_DAYS[p.step] * DAY,
    correct: p.correct + 1,
    lastReviewedAt: now,
    updatedAt: now,
  }
}

export function isDue(p: Progress, now: number): boolean {
  return p.status === 'learning' && p.dueAt <= now
}
