import { WORDS, slugify, type Word } from './words'
import { SIMILAR_GROUPS } from '../data/words'
import { sample, shuffle, type Rng } from './random'

export type QuizKind = 'meaning' | 'word' | 'gap'

export interface Question {
  kind: QuizKind
  word: Word
  prompt: string
  /** For gap questions: the example with the target blanked out. */
  sentence?: string
  options: string[]
  answer: string
}

const SIMILAR = new Map<string, Set<string>>()
for (const group of SIMILAR_GROUPS) {
  const ids = group.map(slugify)
  for (const id of ids) {
    const set = SIMILAR.get(id) ?? new Set<string>()
    ids.forEach((other) => other !== id && set.add(other))
    SIMILAR.set(id, set)
  }
}

export function areSimilar(a: Word, b: Word): boolean {
  return SIMILAR.get(a.id)?.has(b.id) ?? false
}

/** Pick distractor words, preferring the same part of speech and skipping near-synonyms. */
export function distractors(word: Word, n: number, rng: Rng = Math.random, pool: readonly Word[] = WORDS): Word[] {
  const others = pool.filter((w) => w.id !== word.id && !areSimilar(word, w))
  const samePos = others.filter((w) => w.pos === word.pos)
  const picked = sample(samePos, n, rng)
  if (picked.length < n) {
    const rest = others.filter((w) => !picked.includes(w))
    picked.push(...sample(rest, n - picked.length, rng))
  }
  return picked
}

export function makeQuestion(word: Word, kind: QuizKind, rng: Rng = Math.random, pool?: readonly Word[]): Question {
  const others = distractors(word, 3, rng, pool)
  if (kind === 'meaning') {
    return {
      kind,
      word,
      prompt: `What does “${word.word}” mean?`,
      options: shuffle([word.definition, ...others.map((w) => w.definition)], rng),
      answer: word.definition,
    }
  }
  if (kind === 'word') {
    return {
      kind,
      word,
      prompt: `Which word means: “${word.definition}”?`,
      options: shuffle([word.word, ...others.map((w) => w.word)], rng),
      answer: word.word,
    }
  }
  return {
    kind,
    word,
    prompt: 'Fill in the blank',
    sentence: word.example.replace(/\[[^\]]+\]/, '_____'),
    options: shuffle([word.word, ...others.map((w) => w.word)], rng),
    answer: word.word,
  }
}

const KINDS: QuizKind[] = ['meaning', 'word', 'gap']

export function randomQuestion(word: Word, rng: Rng = Math.random): Question {
  return makeQuestion(word, KINDS[Math.floor(rng() * KINDS.length)], rng)
}
