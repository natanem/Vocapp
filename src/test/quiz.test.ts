import { describe, expect, it } from 'vitest'
import { makeQuestion, distractors, areSimilar } from '../lib/quiz'
import { WORDS, WORDS_BY_ID } from '../lib/words'
import { seeded } from '../lib/random'

describe('quiz', () => {
  it('builds every kind of question with 4 unique options including the answer', () => {
    const rng = seeded(1)
    for (const w of WORDS) {
      for (const kind of ['meaning', 'word', 'gap'] as const) {
        const q = makeQuestion(w, kind, rng)
        expect(q.options).toHaveLength(4)
        expect(new Set(q.options).size).toBe(4)
        expect(q.options).toContain(q.answer)
      }
    }
  })

  it('blanks the target in gap questions', () => {
    const q = makeQuestion(WORDS_BY_ID.get('deadline')!, 'gap', seeded(2))
    expect(q.sentence).toBe('The _____ for the report is Friday at noon.')
  })

  it('never uses a near-synonym as a wrong answer', () => {
    const w = WORDS_BY_ID.get('postpone')!
    for (let seed = 0; seed < 200; seed++) {
      for (const d of distractors(w, 3, seeded(seed))) expect(areSimilar(w, d)).toBe(false)
    }
  })

  it('prefers distractors with the same part of speech', () => {
    const w = WORDS_BY_ID.get('reimburse')!
    expect(distractors(w, 3, seeded(3)).every((d) => d.pos === 'verb')).toBe(true)
  })
})
