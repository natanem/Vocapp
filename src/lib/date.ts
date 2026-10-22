/** Local calendar date as YYYY-MM-DD. */
export function dayKey(time: number | Date = Date.now()): string {
  const d = new Date(time)
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${m}-${day}`
}

export function addDays(key: string, days: number): string {
  const [y, m, d] = key.split('-').map(Number)
  return dayKey(new Date(y, m - 1, d + days))
}

/** Consecutive active days ending today (or yesterday, if today has no activity yet). */
export function streak(activeDays: Iterable<string>, today: string = dayKey()): number {
  const days = new Set(activeDays)
  let cursor = days.has(today) ? today : addDays(today, -1)
  let count = 0
  while (days.has(cursor)) {
    count++
    cursor = addDays(cursor, -1)
  }
  return count
}
