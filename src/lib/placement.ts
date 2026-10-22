// Placement quiz: test a few words from each band, easiest band first.
// Stop at the first band the learner doesn't pass. Bands they pass are
// marked as known, except for any word they missed.

import { BANDS, type Word } from './words'
import { makeQuestion, type Question } from './quiz'
import { sample, type Rng } from './random'

export const QUESTIONS_PER_BAND = 4
export const PASS_MARK = 3

export function placementQuestions(band: number, rng: Rng = Math.random): Question[] {
  return sample(BANDS[band].words, QUESTIONS_PER_BAND, rng).map((w) => makeQuestion(w, 'meaning', rng))
}

export interface BandResult {
  band: number
  correct: Word[]
  wrong: Word[]
}

export function passed(result: BandResult): boolean {
  return result.correct.length >= PASS_MARK
}

export interface PlacementOutcome {
  /** Number of bands passed in a row from the start. */
  level: number
  knownIds: string[]
}

export function placementOutcome(results: BandResult[]): PlacementOutcome {
  let level = 0
  for (const r of results) {
    if (!passed(r)) break
    level++
  }
  const missed = new Set(results.flatMap((r) => r.wrong.map((w) => w.id)))
  const known = new Set<string>()
  for (const band of BANDS.slice(0, level)) {
    for (const w of band.words) if (!missed.has(w.id)) known.add(w.id)
  }
  for (const r of results) for (const w of r.correct) known.add(w.id)
  return { level, knownIds: [...known] }
}
