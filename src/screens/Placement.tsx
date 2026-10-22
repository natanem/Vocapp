import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BANDS, type Word } from '../lib/words'
import { QUESTIONS_PER_BAND, passed, placementOutcome, placementQuestions, type BandResult, type PlacementOutcome } from '../lib/placement'
import { applyPlacement } from '../lib/store'
import QuizView from '../components/QuizView'
import { Button, Card, FlowHeader } from '../components/ui'

export default function Placement() {
  const navigate = useNavigate()
  const [started, setStarted] = useState(false)
  const [band, setBand] = useState(0)
  const [index, setIndex] = useState(0)
  const [results, setResults] = useState<BandResult[]>([])
  const [current, setCurrent] = useState<BandResult>({ band: 0, correct: [], wrong: [] })
  const [outcome, setOutcome] = useState<PlacementOutcome | null>(null)
  const questions = useMemo(() => placementQuestions(band), [band])

  async function finish(all: BandResult[]) {
    const out = placementOutcome(all)
    await applyPlacement(out.level, out.knownIds)
    setOutcome(out)
  }

  function answer(word: Word, correct: boolean) {
    const next: BandResult = correct ? { ...current, correct: [...current.correct, word] } : { ...current, wrong: [...current.wrong, word] }
    // Short pause so the learner sees their choice register.
    setTimeout(() => {
      if (index + 1 < questions.length) {
        setCurrent(next)
        setIndex(index + 1)
        return
      }
      const all = [...results, next]
      setResults(all)
      if (passed(next) && band + 1 < BANDS.length) {
        setBand(band + 1)
        setIndex(0)
        setCurrent({ band: band + 1, correct: [], wrong: [] })
      } else {
        void finish(all)
      }
    }, 350)
  }

  if (outcome) {
    const levelName = outcome.level === 0 ? null : BANDS[outcome.level - 1].name
    const startBand = Math.min(outcome.level, BANDS.length - 1)
    return (
      <div className="animate-pop-in mx-auto flex min-h-dvh max-w-md flex-col px-5 py-10">
        <div className="flex-1 space-y-5">
          <h1 className="text-3xl font-bold tracking-tight">Your results</h1>
          <Card className="text-center">
            <div className="text-sm font-semibold text-slate-500">You passed</div>
            <div className="my-2 text-6xl font-bold text-indigo-600 dark:text-indigo-400">
              {outcome.level}
              <span className="text-2xl text-slate-400"> / {BANDS.length}</span>
            </div>
            <div className="text-slate-600 dark:text-slate-300">{levelName ? `levels, up to “${levelName}”` : 'levels — a perfect place to start from the top.'}</div>
          </Card>
          <p className="text-slate-600 dark:text-slate-300">
            We marked <b>{outcome.knownIds.length}</b> words as known. You'll start at level {startBand + 1}, <b>{BANDS[startBand].name}</b>. Words you missed will come up first so you
            can learn them.
          </p>
          <p className="text-sm text-slate-500">You can change any word's status in the Word Map.</p>
        </div>
        <Button className="w-full" onClick={() => navigate('/learn', { replace: true })}>
          Start learning
        </Button>
      </div>
    )
  }

  if (!started) {
    return (
      <div className="animate-pop-in mx-auto flex min-h-dvh max-w-md flex-col px-5 py-6">
        <FlowHeader title="Placement quiz" />
        <div className="flex-1 space-y-5 pt-8">
          <h1 className="text-3xl font-bold tracking-tight">Let's find your level</h1>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            You'll see {QUESTIONS_PER_BAND} words from each of the {BANDS.length} levels. Pick the right meaning. If you're not sure, tap “I don't know” — guessing only puts you
            too high.
          </p>
          <p className="text-slate-600 dark:text-slate-300">The quiz stops when a level gets difficult.</p>
        </div>
        <Button className="w-full" onClick={() => setStarted(true)}>
          Begin
        </Button>
      </div>
    )
  }

  const q = questions[index]
  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col gap-6 px-4 py-6">
      <FlowHeader title={`Level ${band + 1} of ${BANDS.length} · ${BANDS[band].name}`} progress={index} total={questions.length} />
      <QuizView key={`${band}-${index}`} question={q} reveal={false} allowSkip onAnswer={(c) => answer(q.word, c)} />
    </div>
  )
}
