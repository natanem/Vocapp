import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { saveSettings } from '../lib/store'
import { BANDS, WORDS } from '../lib/words'
import { Button, Card } from '../components/ui'
import { SparkIcon } from '../components/Icons'

const GOALS = [
  { value: 5, label: 'Casual', note: '5 new words a day' },
  { value: 10, label: 'Regular', note: '10 new words a day' },
  { value: 15, label: 'Serious', note: '15 new words a day' },
  { value: 20, label: 'Intense', note: '20 new words a day' },
]

export default function Welcome() {
  const [step, setStep] = useState(0)
  const [goal, setGoal] = useState(10)
  const navigate = useNavigate()

  async function finish(placement: boolean) {
    await saveSettings({ onboarded: true, dailyGoal: goal })
    navigate(placement ? '/placement' : '/', { replace: true })
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col px-5 py-10">
      {step === 0 && (
        <div className="animate-pop-in flex flex-1 flex-col">
          <div className="flex-1 space-y-6">
            <img src="./icon.svg" alt="" className="h-16 w-16 rounded-2xl" />
            <h1 className="text-4xl font-bold tracking-tight">Speak like you work here.</h1>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              Vocapp teaches the {WORDS.length} words and phrases Americans use every day — in meetings, emails, on the job, and running errands. No beginner words, no rare
              dictionary words. Just the practical stuff.
            </p>
            <ul className="space-y-2 text-slate-600 dark:text-slate-300">
              {BANDS.map((b, i) => (
                <li key={b.name} className="flex gap-3">
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400">{i + 1}</span>
                  {b.name}
                </li>
              ))}
            </ul>
          </div>
          <Button className="mt-8 w-full" onClick={() => setStep(1)}>
            Get started
          </Button>
        </div>
      )}

      {step === 1 && (
        <div className="animate-pop-in flex flex-1 flex-col">
          <div className="flex-1 space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Pick a daily goal</h1>
            <p className="text-slate-600 dark:text-slate-300">How many new words do you want to add each day? You can change this later.</p>
            <div className="grid gap-3">
              {GOALS.map((g) => (
                <button
                  key={g.value}
                  type="button"
                  onClick={() => setGoal(g.value)}
                  className={`flex items-center justify-between rounded-2xl px-5 py-4 text-left ring-2 transition ${
                    goal === g.value ? 'bg-indigo-50 ring-indigo-500 dark:bg-indigo-950' : 'bg-white ring-slate-200 dark:bg-slate-900 dark:ring-slate-800'
                  }`}
                >
                  <span className="font-semibold">{g.label}</span>
                  <span className="text-sm text-slate-500 dark:text-slate-400">{g.note}</span>
                </button>
              ))}
            </div>
          </div>
          <Button className="mt-8 w-full" onClick={() => setStep(2)}>
            Continue
          </Button>
        </div>
      )}

      {step === 2 && (
        <div className="animate-pop-in flex flex-1 flex-col">
          <div className="flex-1 space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Where do you want to start?</h1>
            <Card>
              <div className="flex items-center gap-2 font-bold">
                <SparkIcon className="text-indigo-500" /> Take a placement quiz
              </div>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                About 3 minutes. We test a few words from each level and skip the ones you already know.
              </p>
              <Button className="mt-4 w-full" onClick={() => finish(true)}>
                Take the quiz
              </Button>
            </Card>
            <Card>
              <div className="font-bold">Start from the beginning</div>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                Go through the words in order and tap “I know it” to skip the ones you know. You can take the quiz later from the home screen.
              </p>
              <Button variant="secondary" className="mt-4 w-full" onClick={() => finish(false)}>
                Start learning
              </Button>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
