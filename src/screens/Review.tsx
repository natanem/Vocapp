import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { db } from '../lib/db'
import { dueWords } from '../lib/selectors'
import { randomQuestion, type Question } from '../lib/quiz'
import { recordReview } from '../lib/store'
import { shuffle } from '../lib/random'
import type { Word } from '../lib/words'
import QuizView from '../components/QuizView'
import { Button, Card, FlowHeader } from '../components/ui'

const SESSION_SIZE = 20

export default function Review() {
  const navigate = useNavigate()
  // The session is a snapshot taken when it starts, so answering doesn't reshuffle it.
  const [queue, setQueue] = useState<Question[] | null>(null)
  const [index, setIndex] = useState(0)
  const [total, setTotal] = useState(0)
  const [score, setScore] = useState({ right: 0, wrong: 0 })
  const [retried, setRetried] = useState<Set<string>>(new Set())

  useEffect(() => {
    void db.progress.toArray().then((all) => {
      const due = dueWords(new Map(all.map((p) => [p.wordId, p]))).slice(0, SESSION_SIZE)
      const qs = shuffle(due).map((w) => randomQuestion(w))
      setQueue(qs)
      setTotal(qs.length)
    })
  }, [])

  if (!queue) return null

  function answer(word: Word, correct: boolean) {
    void recordReview(word.id, correct)
    setScore((s) => (correct ? { ...s, right: s.right + 1 } : { ...s, wrong: s.wrong + 1 }))
    // Missed words come back once at the end of the session.
    if (!correct && !retried.has(word.id)) {
      setRetried(new Set(retried).add(word.id))
      setQueue((q) => [...q!, randomQuestion(word)])
    }
  }

  if (queue.length === 0) {
    return (
      <div className="mx-auto flex min-h-dvh max-w-md flex-col gap-6 px-4 py-6">
        <FlowHeader title="Review" />
        <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
          <h1 className="text-2xl font-bold">Nothing to review right now</h1>
          <p className="text-slate-600 dark:text-slate-300">Learn some new words, or come back later.</p>
          <Button onClick={() => navigate('/learn', { replace: true })}>Learn new words</Button>
        </div>
      </div>
    )
  }

  if (index >= queue.length) {
    const pct = Math.round((score.right / Math.max(1, score.right + score.wrong)) * 100)
    return (
      <div className="animate-pop-in mx-auto flex min-h-dvh max-w-md flex-col gap-6 px-4 py-6">
        <FlowHeader title="Review" />
        <div className="flex flex-1 flex-col justify-center gap-5">
          <h1 className="text-center text-3xl font-bold">Session complete!</h1>
          <Card className="text-center">
            <div className="text-6xl font-bold text-indigo-600 dark:text-indigo-400">{pct}%</div>
            <div className="mt-2 text-slate-600 dark:text-slate-300">
              {score.right} right · {score.wrong} missed · {total} words
            </div>
          </Card>
          <p className="text-center text-sm text-slate-500">Words you got right will come back in a few days. Missed words stay in practice.</p>
        </div>
        <div className="grid gap-3">
          <Button onClick={() => navigate('/', { replace: true })}>Done</Button>
          <Button variant="secondary" onClick={() => navigate('/learn', { replace: true })}>
            Learn new words
          </Button>
        </div>
      </div>
    )
  }

  const q = queue[index]
  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col gap-6 px-4 py-6">
      <FlowHeader title={`Review · ${Math.min(index + 1, queue.length)} of ${queue.length}`} progress={index} total={queue.length} />
      <QuizView key={index} question={q} onAnswer={(c) => answer(q.word, c)} onNext={() => setIndex(index + 1)} />
    </div>
  )
}
