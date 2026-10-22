import { useState } from 'react'
import type { Question } from '../lib/quiz'
import { Example, SpeakButton } from './WordCard'
import { Button, Card } from './ui'
import { CheckIcon, XIcon } from './Icons'

interface Props {
  question: Question
  /** Show right/wrong and the word after answering (reviews). Off for placement. */
  reveal?: boolean
  /** Offer an "I don't know" option (counts as wrong). */
  allowSkip?: boolean
  onAnswer: (correct: boolean) => void
  /** Called when the learner moves on after seeing the feedback (reveal mode). */
  onNext?: () => void
}

export default function QuizView({ question, reveal = true, allowSkip = false, onAnswer, onNext }: Props) {
  const [picked, setPicked] = useState<string | null>(null)
  const answered = picked !== null

  function choose(option: string) {
    if (answered) return
    setPicked(option)
    onAnswer(option === question.answer)
  }

  const correct = picked === question.answer
  return (
    <div className="animate-pop-in space-y-5">
      <Card>
        <div className="text-sm font-semibold tracking-wide text-indigo-600 uppercase dark:text-indigo-400">{question.prompt}</div>
        {question.kind === 'meaning' && (
          <div className="mt-3 flex items-center justify-between gap-3">
            <div className="text-3xl font-bold tracking-tight">{question.word.word}</div>
            <SpeakButton text={question.word.word} />
          </div>
        )}
        {question.sentence && <p className="mt-3 text-xl leading-relaxed font-medium">{question.sentence}</p>}
      </Card>

      <div className="grid gap-3">
        {question.options.map((option) => {
          let style = 'bg-white ring-slate-200 hover:ring-indigo-400 dark:bg-slate-900 dark:ring-slate-700'
          if (answered && reveal) {
            if (option === question.answer) style = 'bg-emerald-50 ring-emerald-500 dark:bg-emerald-950'
            else if (option === picked) style = 'bg-rose-50 ring-rose-500 dark:bg-rose-950'
            else style = 'bg-white opacity-50 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800'
          } else if (answered && option === picked) {
            style = 'bg-indigo-50 ring-indigo-500 dark:bg-indigo-950'
          }
          return (
            <button
              key={option}
              type="button"
              disabled={answered}
              onClick={() => choose(option)}
              className={`rounded-2xl px-4 py-3.5 text-left text-base font-medium ring-2 transition ${style}`}
            >
              {option}
            </button>
          )
        })}
        {allowSkip && !answered && (
          <button type="button" onClick={() => choose('')} className="py-2 text-sm font-semibold text-slate-500 hover:text-slate-700 dark:text-slate-400">
            I don't know
          </button>
        )}
      </div>

      {answered && reveal && (
        <Card className={`animate-pop-in ${correct ? 'ring-emerald-300 dark:ring-emerald-800' : 'ring-rose-300 dark:ring-rose-800'}`}>
          <div className={`flex items-center gap-2 font-bold ${correct ? 'text-emerald-600' : 'text-rose-600'}`}>
            {correct ? <CheckIcon /> : <XIcon />}
            {correct ? 'Correct!' : 'Not quite'}
          </div>
          <div className="mt-3 flex items-center justify-between gap-3">
            <div>
              <div className="text-xl font-bold">{question.word.word}</div>
              <div className="text-slate-600 dark:text-slate-300">{question.word.definition}</div>
            </div>
            <SpeakButton text={question.word.word} className="shrink-0" />
          </div>
          <div className="mt-3">
            <Example text={question.word.example} />
          </div>
          <Button className="mt-4 w-full" onClick={onNext} autoFocus>
            Continue
          </Button>
        </Card>
      )}
    </div>
  )
}
