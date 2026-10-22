import { BANDS, WORDS, WORDS_BY_ID, type Word } from './words'
import { isDue, type Progress, type Status } from './srs'

export type ProgressMap = Map<string, Progress>

export function statusOf(progress: ProgressMap, wordId: string): Status {
  return progress.get(wordId)?.status ?? 'new'
}

/** Words not yet triaged, in learning order. */
export function newWords(progress: ProgressMap): Word[] {
  return WORDS.filter((w) => !progress.has(w.id))
}

export function dueWords(progress: ProgressMap, now = Date.now()): Word[] {
  return [...progress.values()]
    .filter((p) => isDue(p, now))
    .sort((a, b) => a.dueAt - b.dueAt)
    .map((p) => WORDS_BY_ID.get(p.wordId))
    .filter((w): w is Word => !!w)
}

export function nextDueAt(progress: ProgressMap): number | undefined {
  let next: number | undefined
  for (const p of progress.values()) if (p.status === 'learning' && (next === undefined || p.dueAt < next)) next = p.dueAt
  return next
}

export function countByStatus(progress: ProgressMap, words: readonly Word[] = WORDS): Record<Status, number> {
  const counts: Record<Status, number> = { new: 0, known: 0, learning: 0, mastered: 0 }
  for (const w of words) counts[statusOf(progress, w.id)]++
  return counts
}

/** The band the learner is working through: the first one with untriaged words. */
export function currentBand(progress: ProgressMap): number {
  const i = BANDS.findIndex((b) => b.words.some((w) => !progress.has(w.id)))
  return i === -1 ? BANDS.length - 1 : i
}

export function formatDue(dueAt: number, now = Date.now()): string {
  const diff = dueAt - now
  if (diff <= 0) return 'now'
  const hours = Math.round(diff / 3_600_000)
  if (hours < 1) return 'in less than an hour'
  if (hours < 24) return `in ${hours} hour${hours === 1 ? '' : 's'}`
  const days = Math.round(hours / 24)
  return `in ${days} day${days === 1 ? '' : 's'}`
}
