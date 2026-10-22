import { Link, useNavigate } from 'react-router-dom'
import { useDays, useProgress, useSettings, useToday } from '../lib/hooks'
import { countByStatus, currentBand, dueWords, formatDue, nextDueAt } from '../lib/selectors'
import { BANDS, WORDS } from '../lib/words'
import { streak } from '../lib/date'
import { Button, Card, ProgressBar } from '../components/ui'
import { FlameIcon, SparkIcon } from '../components/Icons'

function greeting() {
  const h = new Date().getHours()
  return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening'
}

function GoalRing({ value, goal }: { value: number; goal: number }) {
  const r = 34
  const c = 2 * Math.PI * r
  const pct = Math.min(1, value / goal)
  return (
    <svg viewBox="0 0 80 80" className="h-24 w-24 -rotate-90">
      <circle cx="40" cy="40" r={r} strokeWidth="8" className="fill-none stroke-slate-200 dark:stroke-slate-800" />
      <circle
        cx="40"
        cy="40"
        r={r}
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - pct)}
        className={`fill-none transition-all ${pct >= 1 ? 'stroke-emerald-500' : 'stroke-indigo-500'}`}
      />
    </svg>
  )
}

export default function Home() {
  const settings = useSettings()
  const progress = useProgress()
  const today = useToday()
  const days = useDays()
  const navigate = useNavigate()
  if (!settings || !progress || !today || !days) return null

  const goal = settings.dailyGoal
  const due = dueWords(progress)
  const next = nextDueAt(progress)
  const counts = countByStatus(progress)
  const band = currentBand(progress)
  const bandCounts = countByStatus(progress, BANDS[band].words)
  const currentStreak = streak(days.filter((d) => d.learned + d.known + d.reviewed > 0).map((d) => d.date))
  const goalMet = today.learned >= goal
  const finished = counts.new === 0

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">{greeting()}</p>
          <h1 className="text-2xl font-bold tracking-tight">Ready to learn?</h1>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-orange-50 px-3 py-1.5 font-bold text-orange-600 dark:bg-orange-950 dark:text-orange-400" title="Day streak">
          <FlameIcon width={20} height={20} />
          {currentStreak}
        </div>
      </header>

      <Card className="flex items-center gap-5">
        <div className="relative shrink-0">
          <GoalRing value={today.learned} goal={goal} />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-bold">{today.learned}</span>
            <span className="text-xs text-slate-500">of {goal}</span>
          </div>
        </div>
        <div className="flex-1">
          <h2 className="font-bold">{goalMet ? 'Daily goal reached!' : 'New words today'}</h2>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
            {goalMet ? 'Great work. Keep going if you like.' : `Add ${goal - today.learned} more word${goal - today.learned === 1 ? '' : 's'} to your learning list.`}
          </p>
          <Button className="mt-3 w-full py-2.5" onClick={() => navigate('/learn')} disabled={finished}>
            {finished ? 'All words seen' : 'Learn new words'}
          </Button>
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-bold">Review</h2>
            <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
              {due.length > 0
                ? `${due.length} word${due.length === 1 ? ' is' : 's are'} ready to practice`
                : next !== undefined
                  ? `Next review ${formatDue(next)}`
                  : 'Words you learn will show up here'}
            </p>
          </div>
          <div className={`text-3xl font-bold ${due.length ? 'text-amber-500' : 'text-slate-300 dark:text-slate-700'}`}>{due.length}</div>
        </div>
        <Button variant={due.length ? 'warning' : 'secondary'} className="mt-4 w-full py-2.5" disabled={!due.length} onClick={() => navigate('/review')}>
          Start review
        </Button>
      </Card>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Learning', value: counts.learning, color: 'text-amber-500' },
          { label: 'Mastered', value: counts.mastered, color: 'text-indigo-500' },
          { label: 'Known', value: counts.known, color: 'text-emerald-500' },
        ].map((s) => (
          <Card key={s.label} className="p-4 text-center">
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400">{s.label}</div>
          </Card>
        ))}
      </div>

      <Link to={`/words/${band}`} className="block">
        <Card className="hover:ring-indigo-300">
          <div className="flex items-baseline justify-between">
            <span className="text-xs font-semibold tracking-wide text-indigo-600 uppercase dark:text-indigo-400">
              Level {band + 1} of {BANDS.length}
            </span>
            <span className="text-xs text-slate-500">
              {WORDS.length - counts.new} / {WORDS.length} words seen
            </span>
          </div>
          <h2 className="mt-1 font-bold">{BANDS[band].name}</h2>
          <ProgressBar value={BANDS[band].words.length - bandCounts.new} max={BANDS[band].words.length} className="mt-3" />
        </Card>
      </Link>

      {settings.placementLevel === undefined && (
        <Card className="flex items-center gap-4 bg-indigo-50 ring-indigo-100 dark:bg-indigo-950/50 dark:ring-indigo-900">
          <SparkIcon className="shrink-0 text-indigo-500" />
          <div className="flex-1 text-sm">
            <div className="font-semibold">Already know a lot?</div>
            <div className="text-slate-600 dark:text-slate-400">Take the 3-minute placement quiz to skip ahead.</div>
          </div>
          <Link to="/placement" className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
            Start
          </Link>
        </Card>
      )}
    </div>
  )
}
