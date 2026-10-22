# Vocapp — Plan & Roadmap

A vocabulary-building app for English learners, inspired by WordUp.
Living document: we update it as decisions are made.

## Decisions so far

| Area | Decision |
|---|---|
| Platform | Web app, installable as a PWA (mobile-first layout) |
| Audience | English learners (ESL) |
| Data | Local-first: progress in IndexedDB, no backend or accounts in the MVP |
| AI | Not in the MVP; revisit after the core loop works |

## Core idea (what we take from WordUp)

1. **Frequency-ordered word map.** Words ranked by how useful they are
   (most common first). The learner sees where they are on the map and what's next.
2. **"Know it / Learn it" triage.** Swipe through new words; known ones are
   skipped, unknown ones go into the learning queue. This quickly finds the
   learner's level without a long test.
3. **Rich word cards.** Definition, part of speech, pronunciation (audio via
   the browser's speech synthesis), example sentences, and later images or clips.
4. **Spaced repetition.** Reviews scheduled at growing intervals
   (e.g. 1d → 3d → 7d → 14d → 30d) until a word is "mastered".
5. **Varied quizzes.** Pick the definition, pick the word, fill the gap in a
   sentence, listen and choose.
6. **Motivation.** Daily goal, streaks, progress per word level.

## MVP scope (v0.1)

- [ ] Word dataset: ~2,000–3,000 most frequent English words with definitions
      and examples, bundled as static JSON (source: open data such as
      WordNet / Wiktionary-derived lists, frequency from a public corpus list)
- [ ] Onboarding: pick a daily goal; optional quick level check
- [ ] Discover: swipe/triage new words (Know it / Learn it)
- [ ] Word card with TTS pronunciation
- [ ] Review session with spaced repetition and 2–3 quiz types
- [ ] Word map: progress by frequency band (e.g. 1–500, 501–1000 …)
- [ ] Stats: streak, words learning / mastered, today's progress
- [ ] Installable PWA, works offline

## Later (v0.2+)

- Search the dictionary and add any word to the queue
- Personal word lists / import a word you met in the wild
- Native-language translations (choose your language)
- Images and short video/quote examples per word
- Accounts + cloud sync (e.g. Supabase)
- AI: personalized example sentences, mini stories with your learning words,
  explain-the-difference-between-two-words
- Leaderboards / social challenges

## Proposed tech stack

- **Vite + React + TypeScript** — fast dev loop, simple static build
- **Tailwind CSS** — quick, consistent mobile UI
- **Dexie (IndexedDB)** — local progress storage
- **vite-plugin-pwa** — offline + installable
- **Vitest** — unit tests for the scheduler and quiz logic
- Hosting: any static host (Vercel / Netlify / GitHub Pages)

## Data model (draft)

```ts
Word      { id, lemma, rank, pos, definition, examples[], level }
Progress  { wordId, status: 'new'|'known'|'learning'|'mastered',
            step, dueAt, lastReviewedAt, correct, wrong }
DayLog    { date, discovered, reviewed, goalMet }
Settings  { dailyGoal, voice }
```

## Build order

1. Scaffold project, tooling, CI-free tests (this repo)
2. Word dataset pipeline + bundled JSON
3. Storage layer + spaced-repetition scheduler (with tests)
4. Discover (triage) screen + word card
5. Review/quiz screen
6. Word map + stats screen
7. PWA polish, offline, deploy

## Open questions

- Which open word dataset do we trust for definitions/examples (licensing)?
- Level check at onboarding, or just let triage find the level?
- Do we want a distinct visual identity / name beyond "Vocapp"?
