import { useNavigate } from 'react-router-dom'
import { useSettings } from '../lib/hooks'
import { resetAll, saveSettings } from '../lib/store'
import { BANDS } from '../lib/words'
import { Button, Card } from '../components/ui'

const GOALS = [5, 10, 15, 20]

export default function SettingsScreen() {
  const settings = useSettings()
  const navigate = useNavigate()
  if (!settings) return null

  async function reset() {
    if (!confirm('Erase all your progress? This cannot be undone.')) return
    await resetAll()
    navigate('/', { replace: true })
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold tracking-tight">Settings</h1>

      <Card>
        <h2 className="font-bold">Daily goal</h2>
        <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">New words to add each day</p>
        <div className="mt-3 grid grid-cols-4 gap-2">
          {GOALS.map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => saveSettings({ dailyGoal: g })}
              className={`rounded-xl py-2.5 font-semibold ring-2 ${
                settings.dailyGoal === g ? 'bg-indigo-50 ring-indigo-500 dark:bg-indigo-950' : 'ring-slate-200 dark:ring-slate-700'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </Card>

      <Card>
        <h2 className="font-bold">Placement quiz</h2>
        <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
          {settings.placementLevel === undefined
            ? 'You haven’t taken it yet.'
            : `Last result: passed ${settings.placementLevel} of ${BANDS.length} levels.`}{' '}
          Retaking it only adds known words; it never removes your progress.
        </p>
        <Button variant="secondary" className="mt-3 w-full py-2.5" onClick={() => navigate('/placement')}>
          {settings.placementLevel === undefined ? 'Take the quiz' : 'Retake the quiz'}
        </Button>
      </Card>

      <Card>
        <h2 className="font-bold">Your data</h2>
        <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">Your progress is saved only on this device.</p>
        <Button variant="ghost" className="mt-3 w-full py-2.5 text-rose-600 dark:text-rose-400" onClick={reset}>
          Reset all progress
        </Button>
      </Card>

      <p className="pt-2 text-center text-xs text-slate-400">Vocapp v0.1</p>
    </div>
  )
}
