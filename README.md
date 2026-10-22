# Vocapp

Learn the English words Americans actually use, at work and in daily life.
Inspired by WordUp. A mobile-first PWA: progress is stored on the device,
and it works offline.

## Features (v0.1)

- **300 hand-picked words and phrases** in 6 levels: Workday Essentials, Talking at Work,
  Everyday Life, Jobs & Money, Idioms & Casual Talk, Business & Office.
  Beginner words (the, see, cook, drive…) are left out on purpose.
- **Two ways to find your level:** a short placement quiz (4 words per level, stops when it
  gets hard), or swipe through words in order and tap “I know it” to skip ahead.
- **Learn:** swipe right = I know it, swipe left = learn it. New words show a full card with
  definition, example, and pronunciation (browser speech).
- **Review:** spaced repetition (1 → 3 → 7 → 14 → 30 days, then mastered) with three quiz
  types: meaning, word-from-definition, and fill-in-the-blank. Missed words come back once
  at the end of the session.
- **Word Map:** progress for each level; tap any word to see it or change its status.
- **Today:** a daily goal ring, streak, review count, and stats.

## Develop

```sh
npm install
npm run dev        # http://localhost:5173
npm test           # unit tests (vitest)
npm run build      # typecheck + production build into dist/
```

## Project layout

```
src/data/words.ts     the word list (edit here to add words)
src/lib/              logic: srs, quiz, placement, store (IndexedDB via Dexie), selectors
src/screens/          Home, Placement, Learn, Review, WordMap, BandWords, Settings, Welcome
src/components/       shared UI
src/test/             unit tests
```

### Adding words

Add an entry to a band in `src/data/words.ts`:

```ts
['touch base', 'expression', 'to talk briefly to share news or check on something', "Let's [touch base] after lunch."],
```

Wrap the target word in the example, in the form used, in `[brackets]`. Order within the file
is the learning order. If the new word is a near-synonym of another, add both to
`SIMILAR_GROUPS` so quizzes never use one as a wrong answer for the other.
`npm test` checks the data.
