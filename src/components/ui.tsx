import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeftIcon } from './Icons'

type Variant = 'primary' | 'secondary' | 'ghost' | 'success' | 'warning'

const variants: Record<Variant, string> = {
  primary: 'bg-indigo-600 text-white hover:bg-indigo-500 disabled:bg-indigo-300 dark:disabled:bg-indigo-900',
  secondary: 'bg-white text-slate-800 ring-1 ring-slate-200 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-100 dark:ring-slate-700 dark:hover:bg-slate-700',
  ghost: 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800',
  success: 'bg-emerald-600 text-white hover:bg-emerald-500',
  warning: 'bg-amber-500 text-white hover:bg-amber-400',
}

export function Button({ variant = 'primary', className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-base font-semibold transition active:scale-[0.98] ${variants[variant]} ${className}`}
    />
  )
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70 dark:bg-slate-900 dark:ring-slate-800 ${className}`}>{children}</div>
}

export function ProgressBar({ value, max, className = '' }: { value: number; max: number; className?: string }) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0
  return (
    <div className={`h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800 ${className}`}>
      <div className="h-full rounded-full bg-indigo-500 transition-all" style={{ width: `${pct}%` }} />
    </div>
  )
}

/** Full-screen header for focused flows (learn, review, placement). */
export function FlowHeader({ title, progress, total, back = '/' }: { title: string; progress?: number; total?: number; back?: string }) {
  return (
    <div className="flex items-center gap-3">
      <Link to={back} aria-label="Close" className="-ml-2 rounded-full p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
        <ChevronLeftIcon />
      </Link>
      <div className="flex-1">
        <div className="text-sm font-semibold text-slate-500 dark:text-slate-400">{title}</div>
        {total !== undefined && progress !== undefined && <ProgressBar value={progress} max={total} className="mt-1.5" />}
      </div>
    </div>
  )
}

export function StatusChip({ status }: { status: 'new' | 'known' | 'learning' | 'mastered' }) {
  const styles = {
    new: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
    learning: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
    known: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
    mastered: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300',
  }
  return <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${styles[status]}`}>{status}</span>
}
