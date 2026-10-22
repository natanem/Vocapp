import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { useProgress } from '../lib/hooks'
import { countByStatus, statusOf } from '../lib/selectors'
import { setStatus } from '../lib/store'
import { BANDS, type Word } from '../lib/words'
import type { Status } from '../lib/srs'
import WordCard from '../components/WordCard'
import { Button, StatusChip } from '../components/ui'
import { ChevronLeftIcon } from '../components/Icons'

const FILTERS: (Status | 'all')[] = ['all', 'new', 'learning', 'known', 'mastered']

function WordSheet({ word, status, onClose }: { word: Word; status: Status; onClose: () => void }) {
  async function change(next: 'new' | 'known' | 'learning') {
    await setStatus(word.id, next)
    onClose()
  }
  return (
    <div className="fixed inset-0 z-20 flex items-end justify-center bg-slate-950/40 sm:items-center" onClick={onClose}>
      <div
        role="dialog"
        aria-label={word.word}
        className="animate-pop-in w-full max-w-md rounded-t-3xl bg-white p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] dark:bg-slate-900 sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <StatusChip status={status} />
          <button type="button" onClick={onClose} className="text-sm font-semibold text-slate-500">
            Close
          </button>
        </div>
        <WordCard word={word} />
        <div className="mt-6 grid grid-cols-2 gap-3">
          {status !== 'learning' && (
            <Button variant="warning" className="py-2.5" onClick={() => change('learning')}>
              {status === 'new' ? 'Learn it' : 'Learn again'}
            </Button>
          )}
          {status !== 'known' && status !== 'mastered' && (
            <Button variant="success" className="py-2.5" onClick={() => change('known')}>
              I know it
            </Button>
          )}
          {status !== 'new' && (
            <Button variant="ghost" className="py-2.5" onClick={() => change('new')}>
              Reset
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default function BandWords() {
  const { band: param } = useParams()
  const progress = useProgress()
  const [filter, setFilter] = useState<Status | 'all'>('all')
  const [open, setOpen] = useState<Word | null>(null)
  const band = BANDS[Number(param)]
  if (!band) return <Navigate to="/words" replace />
  if (!progress) return null

  const counts = countByStatus(progress, band.words)
  const words = band.words.filter((w) => filter === 'all' || statusOf(progress, w.id) === filter)

  return (
    <div className="space-y-4">
      <header className="flex items-start gap-2">
        <Link to="/words" aria-label="Back" className="-ml-2 rounded-full p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
          <ChevronLeftIcon />
        </Link>
        <div>
          <div className="text-xs font-semibold tracking-wide text-indigo-600 uppercase dark:text-indigo-400">Level {band.index + 1}</div>
          <h1 className="text-2xl font-bold tracking-tight">{band.name}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">{band.description}</p>
        </div>
      </header>

      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm font-semibold capitalize ${
              filter === f ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' : 'bg-white text-slate-600 ring-1 ring-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-800'
            }`}
          >
            {f} {f === 'all' ? band.words.length : counts[f]}
          </button>
        ))}
      </div>

      <ul className="divide-y divide-slate-100 overflow-hidden rounded-3xl bg-white ring-1 ring-slate-200/70 dark:divide-slate-800 dark:bg-slate-900 dark:ring-slate-800">
        {words.map((w) => (
          <li key={w.id}>
            <button type="button" onClick={() => setOpen(w)} className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800/60">
              <div className="min-w-0 flex-1">
                <div className="font-semibold">{w.word}</div>
                <div className="truncate text-sm text-slate-500 dark:text-slate-400">{w.definition}</div>
              </div>
              <StatusChip status={statusOf(progress, w.id)} />
            </button>
          </li>
        ))}
        {words.length === 0 && <li className="px-4 py-8 text-center text-sm text-slate-500">No words here yet.</li>}
      </ul>

      {open && <WordSheet word={open} status={statusOf(progress, open.id)} onClose={() => setOpen(null)} />}
    </div>
  )
}
