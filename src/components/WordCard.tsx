import type { Word } from '../lib/words'
import { splitExample } from '../lib/words'
import { canSpeak, speak } from '../lib/speech'
import { SpeakerIcon } from './Icons'

export function SpeakButton({ text, className = '' }: { text: string; className?: string }) {
  if (!canSpeak) return null
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation()
        speak(text)
      }}
      aria-label={`Pronounce ${text}`}
      className={`rounded-full bg-indigo-50 p-2.5 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-950 dark:text-indigo-300 dark:hover:bg-indigo-900 ${className}`}
    >
      <SpeakerIcon width={20} height={20} />
    </button>
  )
}

export function Example({ text }: { text: string }) {
  const [before, target, after] = splitExample(text)
  return (
    <p className="text-lg leading-relaxed text-slate-700 dark:text-slate-300">
      “{before}
      <mark className="rounded bg-amber-100 px-1 font-semibold text-slate-900 dark:bg-amber-500/25 dark:text-amber-100">{target}</mark>
      {after}”
    </p>
  )
}

export function WordHeading({ word }: { word: Word }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">{word.word}</h2>
        <div className="mt-1 text-sm font-medium text-slate-500 italic dark:text-slate-400">{word.pos}</div>
      </div>
      <SpeakButton text={word.word} />
    </div>
  )
}

export default function WordCard({ word }: { word: Word }) {
  return (
    <div className="space-y-4">
      <WordHeading word={word} />
      <p className="text-xl leading-snug font-medium">{word.definition}</p>
      <div className="flex items-start gap-2">
        <Example text={word.example} />
        <SpeakButton text={splitExample(word.example).join('')} className="shrink-0 p-2" />
      </div>
    </div>
  )
}
