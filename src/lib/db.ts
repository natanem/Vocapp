import Dexie, { type EntityTable } from 'dexie'
import type { Progress } from './srs'

export interface DayLog {
  date: string
  /** New words added to learning. */
  learned: number
  /** New words marked as already known. */
  known: number
  reviewed: number
  correct: number
}

export interface Settings {
  id: 'settings'
  onboarded: boolean
  dailyGoal: number
  placementLevel?: number
  createdAt: number
}

export const DEFAULT_SETTINGS: Settings = { id: 'settings', onboarded: false, dailyGoal: 10, createdAt: 0 }

export class VocappDB extends Dexie {
  progress!: EntityTable<Progress, 'wordId'>
  days!: EntityTable<DayLog, 'date'>
  settings!: EntityTable<Settings, 'id'>

  constructor(name = 'vocapp') {
    super(name)
    this.version(1).stores({
      progress: 'wordId, status, dueAt',
      days: 'date',
      settings: 'id',
    })
  }
}

export const db = new VocappDB()
