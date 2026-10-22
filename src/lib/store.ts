// All writes to the local database go through here.

import { db, DEFAULT_SETTINGS, type DayLog, type Settings } from './db'
import { applyReview, markKnown, startLearning, type Progress } from './srs'
import { dayKey } from './date'

async function bumpDay(change: Partial<Omit<DayLog, 'date'>>, now = Date.now()) {
  const date = dayKey(now)
  const day = (await db.days.get(date)) ?? { date, learned: 0, known: 0, reviewed: 0, correct: 0 }
  await db.days.put({
    ...day,
    learned: day.learned + (change.learned ?? 0),
    known: day.known + (change.known ?? 0),
    reviewed: day.reviewed + (change.reviewed ?? 0),
    correct: day.correct + (change.correct ?? 0),
  })
}

export async function getSettings(): Promise<Settings> {
  return (await db.settings.get('settings')) ?? DEFAULT_SETTINGS
}

export async function saveSettings(change: Partial<Omit<Settings, 'id'>>) {
  const current = await getSettings()
  await db.settings.put({ ...current, createdAt: current.createdAt || Date.now(), ...change, id: 'settings' })
}

/** Learner triaged a new word: they already know it, or want to learn it. */
export async function triage(wordId: string, choice: 'known' | 'learn', now = Date.now()) {
  await db.transaction('rw', db.progress, db.days, async () => {
    const prev = await db.progress.get(wordId)
    const next = choice === 'known' ? markKnown(wordId, now, prev) : startLearning(wordId, now, prev)
    await db.progress.put(next)
    await bumpDay(choice === 'known' ? { known: 1 } : { learned: 1 }, now)
  })
}

export async function recordReview(wordId: string, isCorrect: boolean, now = Date.now()): Promise<Progress | undefined> {
  return db.transaction('rw', db.progress, db.days, async () => {
    const prev = await db.progress.get(wordId)
    if (!prev) return undefined
    const next = applyReview(prev, isCorrect, now)
    await db.progress.put(next)
    await bumpDay({ reviewed: 1, correct: isCorrect ? 1 : 0 }, now)
    return next
  })
}

/** Change a word's status by hand from the word list. */
export async function setStatus(wordId: string, status: 'new' | 'known' | 'learning', now = Date.now()) {
  if (status === 'new') return db.progress.delete(wordId)
  const prev = await db.progress.get(wordId)
  await db.progress.put(status === 'known' ? markKnown(wordId, now, prev) : startLearning(wordId, now, prev))
}

export async function applyPlacement(level: number, knownIds: string[], now = Date.now()) {
  await db.transaction('rw', db.progress, db.settings, async () => {
    const existing = new Set((await db.progress.toCollection().primaryKeys()) as string[])
    await db.progress.bulkPut(knownIds.filter((id) => !existing.has(id)).map((id) => markKnown(id, now)))
    await saveSettings({ placementLevel: level })
  })
}

export async function resetAll() {
  await db.transaction('rw', db.progress, db.days, db.settings, async () => {
    await Promise.all([db.progress.clear(), db.days.clear(), db.settings.clear()])
  })
}
