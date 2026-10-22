import { describe, expect, it } from 'vitest'
import { BANDS, WORDS, WORDS_BY_ID, slugify, splitExample } from '../lib/words'
import { SIMILAR_GROUPS } from '../data/words'

describe('word data', () => {
  it('has unique ids', () => {
    expect(WORDS_BY_ID.size).toBe(WORDS.length)
  })

  it('has about 50 words per band', () => {
    for (const band of BANDS) expect(band.words.length).toBeGreaterThanOrEqual(45)
  })

  it('marks the target in every example exactly once', () => {
    for (const w of WORDS) {
      expect(w.example.match(/\[[^\]]+\]/g), w.word).toHaveLength(1)
      expect(splitExample(w.example)[1].length, w.word).toBeGreaterThan(0)
    }
  })

  it('has unique definitions', () => {
    expect(new Set(WORDS.map((w) => w.definition)).size).toBe(WORDS.length)
  })

  it('only lists real words in similar groups', () => {
    for (const group of SIMILAR_GROUPS) for (const w of group) expect(WORDS_BY_ID.has(slugify(w)), w).toBe(true)
  })
})
