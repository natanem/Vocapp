# Vocapp — Plan & Roadmap

A vocabulary-building app for English learners, inspired by WordUp.
Living document: we update it as decisions are made.

## Decisions so far

| Area | Decision |
|---|---|
| Platform | Web app, installable as a PWA (mobile-first layout) |
| Audience | English learners (ESL) |
| Vocabulary | Practical American English for work and daily life; no beginner words |
| Word data | Hand-written list (original definitions and examples, so no licensing issues) |
| Level check | Both: an optional placement quiz, or triage words yourself |
| Data | Local-first: progress in IndexedDB, no backend or accounts in the MVP |
| AI | Not in the MVP; revisit after the core loop works |

## Core idea (what we take from WordUp)

1. **Usefulness-ordered word map.** Words in levels, most useful first.
   The learner sees where they are on the map and what's next.
2. **"Know it / Learn it" triage.** Swipe through new words; known ones are
   skipped, unknown ones go into the learning queue.
3. **Rich word cards.** Definition, part of speech, pronunciation (browser
   speech), example sentence.
4. **Spaced repetition.** Reviews at growing intervals (1d → 3d → 7d → 14d → 30d)
   until a word is mastered.
5. **Varied quizzes.** Pick the meaning, pick the word, fill the gap.
6. **Motivation.** Daily goal, streaks, progress per level.

## MVP (v0.1) — done

- [x] Word list: 300 curated workplace/daily-life words in 6 levels
- [x] Onboarding: pick a daily goal, then choose the placement quiz or start from the beginning
- [x] Placement quiz: 4 words per level, stops at the first level you don't pass
- [x] Learn: swipe/triage new words (Know it / Learn it)
- [x] Word card with pronunciation
- [x] Review session with spaced repetition and 3 quiz types
- [x] Word map: progress per level, word list with status changes
- [x] Stats: streak, words learning / mastered / known, today's progress
- [x] Installable PWA, works offline

## Next up (proposed)

1. Grow the word list toward ~1,000 (phone & email phrases, customer service, healthcare, retail, tech, warehouse/trades)
2. "I know it" spot-check: sometimes quiz a word right after you mark it known
3. Listening quiz (hear the word, pick it) and typing quiz
4. Search the whole list from the Word Map
5. Deploy (GitHub Pages / Netlify) so it can be installed on a phone

## Later

- Add your own words / personal lists
- Native-language translations
- Accounts + cloud sync (e.g. Supabase)
- AI: personalized examples, mini stories using your words, "what's the difference between X and Y"
- Leaderboards / challenges

## Tech stack

Vite + React + TypeScript, Tailwind CSS, Dexie (IndexedDB), vite-plugin-pwa, Vitest.

## Open questions

- Which industries or job types should the next levels focus on?
- Distinct name and visual identity beyond "Vocapp"?
