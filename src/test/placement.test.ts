import { describe, expect, it } from 'vitest'
import { placementOutcome, placementQuestions, type BandResult } from '../lib/placement'
import { BANDS } from '../lib/words'
import { seeded } from '../lib/random'

function result(band: number, correct: number): BandResult {
  const words = BANDS[band].words.slice(0, 4)
  return { band, correct: words.slice(0, correct), wrong: words.slice(correct) }
}

describe('placement', () => {
  it('asks 4 meaning questions from the band', () => {
    const qs = placementQuestions(2, seeded(5))
    expect(qs).toHaveLength(4)
    for (const q of qs) expect(q.word.band).toBe(2)
  })

  it('stops counting levels at the first failed band', () => {
    const out = placementOutcome([result(0, 4), result(1, 3), result(2, 1), result(3, 4)])
    expect(out.level).toBe(2)
  })

  it('marks passed bands as known except missed words', () => {
    const out = placementOutcome([result(0, 4), result(1, 3), result(2, 1)])
    const known = new Set(out.knownIds)
    expect(BANDS[0].words.every((w) => known.has(w.id))).toBe(true)
    expect(known.has(BANDS[1].words[3].id)).toBe(false) // missed in a passed band
    expect(known.has(BANDS[1].words[10].id)).toBe(true)
    expect(known.has(BANDS[2].words[0].id)).toBe(true) // answered right in a failed band
    expect(known.has(BANDS[2].words[10].id)).toBe(false)
  })

  it('level 0 when the first band fails', () => {
    expect(placementOutcome([result(0, 2)]).level).toBe(0)
  })
})
