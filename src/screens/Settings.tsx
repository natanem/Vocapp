import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSettings } from '../lib/hooks'
import { resetAll, saveSettings } from '../lib/store'
import { BANDS } from '../lib/words'
import { Button, Card } from '../components/ui'

const GOALS = [5, 10, 15, 20]

export default function SettingsScreen() {
  const settings = useSettings()
  const navigate = useNavigate()
  const [confirming, setConfirming] = useState(false)
  if (!settings) return null

  async function reset() {
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
        {confirming ? (
          <div className="mt-3 space-y-3">
            <p className="text-sm font-semibold text-rose-600 dark:text-rose-400">Erase all your progress? This cannot be undone.</p>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="secondary" className="py-2.5" onClick={() => setConfirming(false)}>
                Cancel
              </Button>
              <Button className="bg-rose-600 py-2.5 hover:bg-rose-500" onClick={reset}>
                Erase
              </Button>
            </div>
          </div>
        ) : (
          <Button variant="ghost" className="mt-3 w-full py-2.5 text-rose-600 dark:text-rose-400" onClick={() => setConfirming(true)}>
            Reset all progress
          </Button>
        )}
      </Card>

      <p className="pt-2 text-center text-xs text-slate-400">Vocapp v0.1</p>
    </div>
  )
}
