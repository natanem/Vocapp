import { describe, expect, it } from 'vitest'
import { addDays, streak } from '../lib/date'

describe('dates', () => {
  it('adds days across months', () => {
    expect(addDays('2026-10-31', 1)).toBe('2026-11-01')
  })

  it('counts a streak ending today or yesterday', () => {
    expect(streak(['2026-10-20', '2026-10-21', '2026-10-22'], '2026-10-22')).toBe(3)
    expect(streak(['2026-10-20', '2026-10-21'], '2026-10-22')).toBe(2)
    expect(streak(['2026-10-19'], '2026-10-22')).toBe(0)
  })
})
