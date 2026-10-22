import { BAND_SOURCES, type PartOfSpeech } from '../data/words'

export type { PartOfSpeech }

export interface Word {
  id: string
  word: string
  pos: PartOfSpeech
  definition: string
  /** Example sentence with the target wrapped in [brackets]. */
  example: string
  /** 1-based position in the learning order. */
  rank: number
  /** 0-based index into BANDS. */
  band: number
}

export interface Band {
  index: number
  name: string
  description: string
  words: Word[]
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

let rank = 0
export const BANDS: Band[] = BAND_SOURCES.map((source, index) => ({
  index,
  name: source.name,
  description: source.description,
  words: source.entries.map(([word, pos, definition, example]) => ({
    id: slugify(word),
    word,
    pos,
    definition,
    example,
    rank: ++rank,
    band: index,
  })),
}))

export const WORDS: Word[] = BANDS.flatMap((b) => b.words)

export const WORDS_BY_ID: Map<string, Word> = new Map(WORDS.map((w) => [w.id, w]))

/** Split an example into the text before, the target, and the text after. */
export function splitExample(example: string): [before: string, target: string, after: string] {
  const match = /\[([^\]]+)\]/.exec(example)
  if (!match) return [example, '', '']
  return [example.slice(0, match.index), match[1], example.slice(match.index + match[0].length)]
}

/** The example sentence as plain text. */
export function plainExample(example: string): string {
  return splitExample(example).join('')
}
