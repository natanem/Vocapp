import { useLiveQuery } from 'dexie-react-hooks'
import { db, DEFAULT_SETTINGS, type DayLog, type Settings } from './db'
import type { Progress } from './srs'
import { dayKey } from './date'

export function useSettings(): Settings | undefined {
  return useLiveQuery(async () => (await db.settings.get('settings')) ?? DEFAULT_SETTINGS)
}

export function useProgress(): Map<string, Progress> | undefined {
  return useLiveQuery(async () => new Map((await db.progress.toArray()).map((p) => [p.wordId, p])))
}

export function useDays(): DayLog[] | undefined {
  return useLiveQuery(() => db.days.toArray())
}

export function useToday(): DayLog | undefined {
  return useLiveQuery(async () => (await db.days.get(dayKey())) ?? { date: dayKey(), learned: 0, known: 0, reviewed: 0, correct: 0 })
}
