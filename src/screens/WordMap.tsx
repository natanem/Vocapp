import { Link } from 'react-router-dom'
import { useProgress } from '../lib/hooks'
import { countByStatus, currentBand } from '../lib/selectors'
import { BANDS, WORDS } from '../lib/words'
import { Card } from '../components/ui'
import { ChevronRightIcon } from '../components/Icons'

function StackedBar({ known, mastered, learning, total }: { known: number; mastered: number; learning: number; total: number }) {
  const pct = (n: number) => `${(n / total) * 100}%`
  return (
    <div className="flex h-2.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
      <div className="bg-emerald-500" style={{ width: pct(known) }} />
      <div className="bg-indigo-500" style={{ width: pct(mastered) }} />
      <div className="bg-amber-400" style={{ width: pct(learning) }} />
    </div>
  )
}

export default function WordMap() {
  const progress = useProgress()
  if (!progress) return null
  const here = currentBand(progress)
  const all = countByStatus(progress)

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Word Map</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {WORDS.length - all.new} of {WORDS.length} words seen · ordered from most to least useful
        </p>
      </header>

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
        <span className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-full bg-emerald-500" />Known {all.known}</span>
        <span className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-full bg-indigo-500" />Mastered {all.mastered}</span>
        <span className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-full bg-amber-400" />Learning {all.learning}</span>
        <span className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-full bg-slate-300 dark:bg-slate-700" />New {all.new}</span>
      </div>

      <ol className="relative space-y-3">
        {BANDS.map((band) => {
          const c = countByStatus(progress, band.words)
          const isHere = band.index === here
          return (
            <li key={band.name}>
              <Link to={`/words/${band.index}`}>
                <Card className={`flex items-center gap-4 hover:ring-indigo-300 ${isHere ? 'ring-2 ring-indigo-500 dark:ring-indigo-500' : ''}`}>
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-lg font-bold ${
                      c.new === 0 ? 'bg-emerald-500 text-white' : isHere ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500 dark:bg-slate-800'
                    }`}
                  >
                    {band.index + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h2 className="truncate font-bold">{band.name}</h2>
                      {isHere && <span className="shrink-0 rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-700 uppercase dark:bg-indigo-900 dark:text-indigo-200">You're here</span>}
                    </div>
                    <p className="truncate text-sm text-slate-500 dark:text-slate-400">{band.description}</p>
                    <div className="mt-2.5">
                      <StackedBar known={c.known} mastered={c.mastered} learning={c.learning} total={band.words.length} />
                    </div>
                  </div>
                  <ChevronRightIcon className="shrink-0 text-slate-400" />
                </Card>
              </Link>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
