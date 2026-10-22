import { useEffect, useRef, useState, type PointerEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProgress, useSettings, useToday } from '../lib/hooks'
import { dueWords, newWords } from '../lib/selectors'
import { triage } from '../lib/store'
import { BANDS, type Word } from '../lib/words'
import { speak } from '../lib/speech'
import WordCard, { WordHeading } from '../components/WordCard'
import { Button, Card, FlowHeader } from '../components/ui'
import { CheckIcon } from '../components/Icons'

const SWIPE_DISTANCE = 110

function SwipeCard({ word, onKnow, onLearn }: { word: Word; onKnow: () => void; onLearn: () => void }) {
  const [revealed, setRevealed] = useState(false)
  const [dx, setDx] = useState(0)
  const start = useRef<number | null>(null)

  function down(e: PointerEvent) {
    if ((e.target as HTMLElement).closest('button')) return
    start.current = e.clientX
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }
  function move(e: PointerEvent) {
    if (start.current !== null) setDx(e.clientX - start.current)
  }
  function up() {
    if (start.current === null) return
    start.current = null
    if (dx > SWIPE_DISTANCE) onKnow()
    else if (dx < -SWIPE_DISTANCE) onLearn()
    else if (Math.abs(dx) < 5) setRevealed(true)
    setDx(0)
  }

  const hint = Math.min(1, Math.abs(dx) / SWIPE_DISTANCE)
  return (
    <div className="animate-pop-in space-y-5">
      <div
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={() => {
          start.current = null
          setDx(0)
        }}
        style={{ transform: `translateX(${dx}px) rotate(${dx / 25}deg)`, transition: start.current === null ? 'transform 0.2s' : 'none' }}
        className="relative touch-pan-y select-none"
      >
        <Card className="min-h-80 p-6">
          <div className="text-xs font-semibold tracking-wide text-slate-400 uppercase">{BANDS[word.band].name}</div>
          <div className="mt-3">
            <WordHeading word={word} />
          </div>
          {revealed ? (
            <div className="animate-pop-in mt-5 space-y-3">
              <p className="text-xl leading-snug font-medium">{word.definition}</p>
            </div>
          ) : (
            <button type="button" onClick={() => setRevealed(true)} className="mt-8 w-full rounded-2xl border-2 border-dashed border-slate-200 py-6 text-slate-500 hover:border-indigo-300 dark:border-slate-700">
              Tap to see the meaning
            </button>
          )}
        </Card>
        <div style={{ opacity: dx > 0 ? hint : 0 }} className="pointer-events-none absolute top-6 right-6 rotate-12 rounded-lg border-2 border-emerald-500 px-3 py-1 font-bold text-emerald-500">
          I KNOW IT
        </div>
        <div style={{ opacity: dx < 0 ? hint : 0 }} className="pointer-events-none absolute top-6 left-6 -rotate-12 rounded-lg border-2 border-amber-500 px-3 py-1 font-bold text-amber-500">
          LEARN IT
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Button variant="warning" onClick={onLearn}>
          Learn it
        </Button>
        <Button variant="success" onClick={onKnow}>
          I know it
        </Button>
      </div>
      <p className="text-center text-xs text-slate-400">Swipe right if you know it, left to learn it</p>
    </div>
  )
}

export default function Learn() {
  const progress = useProgress()
  const today = useToday()
  const settings = useSettings()
  const navigate = useNavigate()
  /** Word just added to learning; we show its full card before moving on. */
  const [studying, setStudying] = useState<Word | null>(null)
  const [celebrated, setCelebrated] = useState(false)
  /** Words learned today when this session opened: we only celebrate crossing the goal here. */
  const [learnedAtStart, setLearnedAtStart] = useState<number | null>(null)
  useEffect(() => {
    if (today && learnedAtStart === null) setLearnedAtStart(today.learned)
  }, [today, learnedAtStart])
  if (!progress || !today || !settings || learnedAtStart === null) return null

  const goal = settings.dailyGoal
  const queue = newWords(progress)
  const word = queue[0]
  const goalJustMet = learnedAtStart < goal && today.learned >= goal && !celebrated && !studying

  async function learn(w: Word) {
    await triage(w.id, 'learn')
    setStudying(w)
    speak(w.word)
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col gap-6 px-4 py-6">
      <FlowHeader title={`New words · ${today.learned} of ${goal} today`} progress={today.learned} total={goal} />

      {studying ? (
        <div className="animate-pop-in space-y-5">
          <Card className="p-6">
            <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
              Added to your learning list
            </div>
            <WordCard word={studying} />
          </Card>
          <Button className="w-full" onClick={() => setStudying(null)} autoFocus>
            Got it
          </Button>
        </div>
      ) : goalJustMet ? (
        <div className="animate-pop-in flex flex-1 flex-col items-center justify-center gap-4 text-center">
          <div className="rounded-full bg-emerald-100 p-5 text-emerald-600 dark:bg-emerald-900/40">
            <CheckIcon width={48} height={48} />
          </div>
          <h1 className="text-3xl font-bold">Daily goal reached!</h1>
          <p className="text-slate-600 dark:text-slate-300">You added {today.learned} new words today. Practice them now while they're fresh.</p>
          <div className="mt-4 grid w-full gap-3">
            {dueWords(progress).length > 0 && <Button onClick={() => navigate('/review', { replace: true })}>Practice now</Button>}
            <Button
              variant="secondary"
              onClick={() => setCelebrated(true)}
            >
              Keep adding words
            </Button>
          </div>
        </div>
      ) : word ? (
        <SwipeCard key={word.id} word={word} onKnow={() => triage(word.id, 'known')} onLearn={() => learn(word)} />
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
          <h1 className="text-2xl font-bold">You've seen every word!</h1>
          <p className="text-slate-600 dark:text-slate-300">Keep reviewing to master the ones you're learning. More words are coming.</p>
          <Button onClick={() => navigate('/')}>Back home</Button>
        </div>
      )}
    </div>
  )
}
