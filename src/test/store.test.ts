import 'fake-indexeddb/auto'
import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '../lib/db'
import { applyPlacement, recordReview, resetAll, triage } from '../lib/store'
import { dayKey } from '../lib/date'

describe('store', () => {
  beforeEach(resetAll)

  it('triage and review update progress and the day log', async () => {
    const now = Date.now()
    await triage('deadline', 'learn', now)
    await triage('agenda', 'known', now)
    await recordReview('deadline', true, now)
    expect(await db.progress.get('deadline')).toMatchObject({ status: 'learning', step: 1 })
    expect(await db.progress.get('agenda')).toMatchObject({ status: 'known' })
    expect(await db.days.get(dayKey(now))).toMatchObject({ learned: 1, known: 1, reviewed: 1, correct: 1 })
  })

  it('placement does not overwrite existing progress', async () => {
    await triage('deadline', 'learn')
    await applyPlacement(1, ['deadline', 'agenda'])
    expect((await db.progress.get('deadline'))?.status).toBe('learning')
    expect((await db.progress.get('agenda'))?.status).toBe('known')
    expect((await db.settings.get('settings'))?.placementLevel).toBe(1)
  })
})
