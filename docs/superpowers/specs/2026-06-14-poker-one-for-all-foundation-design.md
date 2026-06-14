# Poker One-for-All Foundation Design

## Goal

Turn the current Texas Hold'em learning dashboard into a one-for-all beginner learning tool: a learner should be able to understand core poker concepts, follow a textbook-style path, look up unfamiliar terms, practice after each chapter, and continue without needing an external book or search engine for foundational learning.

This release is the content and navigation foundation, not the final encyclopedia. It should make the product feel like a serious built-in textbook and dictionary, while keeping the codebase maintainable for later additions.

## User Promise

When a new learner opens the app, they should be able to answer:

- What should I learn next?
- What does this poker term mean?
- How does this concept appear in a real hand?
- What mistakes do beginners usually make here?
- What should I practice after reading this?
- Which related concepts should I learn next?

The tool should reduce the need to search random articles, YouTube comments, forum posts, or scattered glossary pages for beginner-to-intermediate fundamentals.

## Scope

### In Scope

- Replace the current six-course path with a larger textbook-style curriculum of 14 to 16 chapters.
- Add chapter metadata for difficulty, estimated time, prerequisites, learning outcomes, related terms, and related drills.
- Expand each chapter into a repeatable textbook structure:
  - chapter overview
  - learning goals
  - plain-language explanation
  - core lesson sections
  - real table examples
  - decision checklist
  - common beginner mistakes
  - mini quiz
  - practice tasks
  - next chapter guidance
- Expand the glossary from a small beginner list to a broad internal dictionary of roughly 120 to 160 terms.
- Improve glossary entries with structured fields:
  - term
  - English name or abbreviation
  - Chinese aliases
  - category
  - difficulty
  - one-line definition
  - beginner explanation
  - table example
  - common misunderstanding
  - related terms
- Add search that can find both chapters and glossary entries from one query surface.
- Add glossary category filters and difficulty filters.
- Add visible related-term links inside glossary cards.
- Add tests that enforce curriculum size, glossary size, required fields, quiz quality, and search coverage.
- Update README to describe the one-for-all learning foundation.

### Out of Scope

- No real-money platform integration.
- No real-time hand advice during live play.
- No solver engine or full GTO solving.
- No copying paid course or book content.
- No promise that this replaces advanced coaching, population data analysis, or solver study for high-stakes play.
- No network-dependent content fetching in this release.

## Curriculum Design

The curriculum should become a textbook table of contents. The first version should cover these chapters:

1. Rules, hand rankings, showdown logic, and kickers
2. Table positions, blinds, action order, and information advantage
3. Starting hands, preflop discipline, and range thinking
4. Open-raising, limping, isolation, calling, and folding
5. 3-bet, 4-bet, squeeze, and preflop pressure
6. Board texture: dry, wet, paired, monotone, connected, and high-card boards
7. Value betting, bluffing, protection, and bet purpose
8. Continuation betting, delayed c-bet, probe bet, donk bet, and check-raise
9. Equity, outs, pot odds, implied odds, reverse implied odds, and fold equity
10. SPR, stack depth, commitment, and all-in planning
11. Turn and river planning: barreling, pot control, thin value, and bluff-catching
12. Opponent types, population tendencies, and exploitative adjustments
13. GTO basics, balance, blockers, range advantage, nut advantage, and MDF
14. Bankroll management, variance, tilt, and session discipline
15. Hand review method: reconstructing ranges, street-by-street decisions, and mistake tags
16. Study routine: how to combine lessons, drills, glossary, and review into a weekly plan

The first four chapters should remain beginner-safe and should avoid advanced jargon unless the term is immediately explained. Later chapters may introduce more technical language, but the glossary must cover it.

## Chapter Data Model

Each chapter should be represented as data, not hard-coded HTML. Existing lesson fields can be evolved rather than replaced all at once.

Required fields:

- `id`: stable slug
- `stage`: numeric order
- `title`: Chinese title
- `subtitle`: short descriptive title
- `difficulty`: `beginner`, `intermediate`, or `advanced`
- `estimatedMinutes`: reading estimate
- `summary`: short chapter summary
- `plainLanguage`: beginner explanation
- `goals`: at least 3 items
- `prerequisites`: array of chapter ids or terms
- `sections`: at least 4 textbook sections, each with `heading`, `body`, and optional `keyTakeaway`
- `examples`: at least 2 table examples, each with `title`, `scenario`, `analysis`, and `takeaway`
- `decisionFlow`: at least 4 ordered decision steps
- `mistakeDetails`: at least 3 mistake entries, each with `mistake`, `whyItHurts`, and `betterHabit`
- `quiz`: at least 3 answerable questions, each with explanation
- `practiceTasks`: at least 2 concrete tasks
- `relatedTerms`: at least 5 glossary term ids
- `nextSteps`: at least 1 route or chapter suggestion

The existing UI can render old and new fields during migration, but tests should require the new model for all final chapters in this release.

## Glossary Design

The glossary should behave like an internal poker dictionary. It should include common English terms because poker study material often uses English abbreviations even in Chinese discussions.

Initial target categories:

- Basic Rules
- Actions
- Positions
- Preflop
- Postflop
- Board Texture
- Hand Strength
- Draws
- Bet Sizing
- Poker Math
- Range Theory
- GTO
- Exploitative Play
- Player Types
- Review
- Bankroll and Mental Game
- Online Poker
- Tournament Concepts

Example terms that must be included:

- range, combo, blocker, nut, nut advantage, range advantage
- equity, realization, fold equity, showdown value
- pot odds, implied odds, reverse implied odds, outs, clean outs, dirty outs
- SPR, effective stack, stack-to-pot ratio, commitment
- open raise, limp, isolate, cold call, flat call, squeeze
- 3-bet, 4-bet, 5-bet, polarized range, linear range
- c-bet, delayed c-bet, probe bet, donk bet, check-raise, barrel
- value bet, thin value, bluff, semi-bluff, bluff-catch
- dry board, wet board, paired board, monotone board, rainbow board, connected board
- top pair, overpair, second pair, two pair, set, trips, straight, flush, full house
- kicker, counterfeit, chop pot, side pot
- MDF, balance, exploit, population tendency, solver
- VPIP, PFR, AF, WTSD, HUD
- bankroll, buy-in, variance, downswing, tilt, stop loss
- ICM, bubble, ante, rake, rakeback

Glossary search should match term, English name, aliases, definition, explanation, example, and related terms.

## Search Experience

Add a unified search block where users can type terms or natural phrases. Search should return:

- matching glossary terms
- matching chapters
- matching lesson sections when possible

Examples:

- `SPR` should show the SPR term and the SPR chapter.
- `为什么不能 limp` should find limp-related glossary entries and the preflop action chapter.
- `range advantage` should find the glossary entry and GTO/board texture chapters.
- `turn barrel` should find barrel terms and turn-river planning content.

This release can use local in-memory search over loaded data. Ranking can be simple but should prioritize exact term and alias matches before broad text matches.

## Learning Experience

The learning page should feel like a book, not a set of disconnected cards.

Required UI behaviors:

- Show a curriculum overview with chapter count, completed count, and estimated total time.
- Show chapter cards with difficulty, estimated time, and prerequisites.
- Allow each chapter to expand into full textbook content.
- Keep the positive feedback loop from the current app: XP, badges, streaks, and daily tasks.
- Make quiz feedback immediately visible and keep the expanded panel open after a quiz answer.
- Add clear next-step actions after each chapter.
- Let users jump from a chapter to glossary search by clicking related terms, or at minimum show related terms as visible cards.

## Testing Requirements

Automated tests should cover:

- At least 14 chapters exist.
- Every chapter has required textbook fields.
- Every chapter has at least 4 sections, 2 examples, 3 mistakes, 3 quiz questions, and 5 related terms.
- The first four chapters are beginner-safe.
- Glossary has at least 120 terms.
- Every glossary entry has required dictionary fields.
- Glossary includes required key terms such as `c-bet`, `donk bet`, `probe bet`, `range advantage`, `nut advantage`, `equity realization`, `MDF`, `ICM`, and `tilt`.
- Search finds terms by English name, Chinese alias, abbreviation, and explanation text.
- Search returns both chapters and terms for mixed queries such as `SPR` and `limp`.
- Existing reward, lesson completion, quiz feedback, and local data migration tests still pass.

Manual checks:

- Open the app and confirm the curriculum looks like a textbook table of contents.
- Expand chapter 1 and confirm it has enough substance to teach a true beginner.
- Search `SPR`, `c-bet`, `limp`, `MDF`, `ICM`, and `tilt`.
- Check desktop and mobile layouts for horizontal overflow.
- Answer a chapter quiz and confirm feedback remains visible.

## Content Quality Standard

Content should be original, beginner-friendly, and practical. Each chapter should avoid vague advice like "play tighter" unless it explains when, why, and how.

Each explanation should prefer:

- a plain-language definition
- one concrete poker-table scenario
- a beginner mistake
- a better habit
- a next action

The tone should be encouraging but honest. The app should not create overconfidence by pretending poker can be mastered from a single static tool. It should provide a complete foundation and a clear route for continued practice inside the app.

## Migration Strategy

Use the current lesson and glossary arrays as the starting point. Keep routes stable:

- `learning` remains the textbook curriculum route.
- `glossary` becomes the expanded dictionary route.
- Existing saved completion ids may not match all new chapter ids; keep current completed lessons when ids still exist and allow new chapters to start incomplete.
- Current rewards, badges, streaks, and training data should remain compatible.

If needed, add lightweight helper functions for chapter validation and search indexing rather than embedding all logic in render files.

## Success Criteria

- The app contains a credible full beginner-to-intermediate Texas Hold'em textbook foundation.
- A new learner can read chapters and look up terms without needing to search externally for basic concepts.
- The glossary covers the common specialized vocabulary that blocks beginners from understanding poker content.
- Search makes the expanded content discoverable.
- Tests enforce content completeness so future additions do not regress into sparse lesson cards.
- The app remains local, fast, and maintainable.
