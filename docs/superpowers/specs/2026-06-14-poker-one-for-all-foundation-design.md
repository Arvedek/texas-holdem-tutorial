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

- Replace the current six-course path with a larger textbook-style curriculum of 18 chapters.
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

1. Table language: card notation, suits, ranks, blinds, button, stack, pot, BB units, and common action words
2. Rules, hand rankings, showdown logic, kickers, chops, side pots, and counterfeit hands
3. Table positions, blinds, action order, information advantage, and 6-max versus full-ring differences
4. Starting hands, hand notation, suited versus offsuit, pairs, broadways, connectors, and range thinking
5. Open-raising, limping, isolation, calling, folding, and beginner preflop sizing
6. 3-bet, 4-bet, squeeze, cold call, flat call, and preflop pressure
7. Blind defense, steal attempts, small blind leaks, big blind pot odds, and rake awareness
8. Board texture: dry, wet, paired, monotone, rainbow, connected, low, high-card, and dynamic boards
9. Relative hand strength: top pair, overpair, two pair, set, trips, made hands, draws, and showdown value
10. Value betting, bluffing, protection, bet purpose, and beginner bet sizing
11. Continuation betting, delayed c-bet, probe bet, donk bet, check-raise, and initiative
12. Equity, outs, pot odds, implied odds, reverse implied odds, fold equity, and equity realization
13. SPR, effective stacks, stack depth, commitment, and all-in planning
14. Turn and river planning: barreling, pot control, thin value, bluff-catching, blockers, and river discipline
15. Opponent types, player stats, population tendencies, table selection, and exploitative adjustments
16. GTO basics, balance, range advantage, nut advantage, MDF, solver output, and when not to overuse theory
17. Game formats and risk: cash games, tournaments, ICM basics, rake, bankroll, variance, downswing, tilt, and session discipline
18. Hand review and study routine: reconstructing ranges, street-by-street decisions, mistake tags, weekly plan, and next learning loops

The first five chapters should remain beginner-safe and should avoid advanced jargon unless the term is immediately explained. Later chapters may introduce more technical language, but the glossary must cover it.

## Progression Rules

The curriculum must be deliberately sequential. A learner should not meet a strategic concept before they have the language needed to understand it.

Required progression:

- Chapters 1-2 teach poker language, mechanics, and hand comparison before strategy.
- Chapters 3-7 teach preflop decisions, because bad preflop choices create most beginner postflop problems.
- Chapters 8-11 teach flop thinking: board texture, relative hand strength, bet purpose, and common betting lines.
- Chapters 12-14 teach math, stack planning, and later-street decisions after the learner can already describe hands and boards.
- Chapters 15-16 teach opponent adjustment and GTO only after ranges, board texture, and bet purpose are established.
- Chapters 17-18 teach long-term survival, review, and study systems.

Every chapter must list prerequisites. Prerequisites should only point to earlier chapters or glossary terms. If a chapter introduces an advanced term, that term must appear in `relatedTerms` and be defined in the glossary.

Every chapter should include a "before you continue" checkpoint. This checkpoint should be a short list of 2 to 4 concrete skills the learner should be able to perform before moving on.

## Coverage Audit Requirements

The release should pass a content audit across these domains:

- Game mechanics: actions, streets, blinds, showdown, side pots, all-in, split pots, misread hands.
- Poker notation: `AKs`, `AQo`, pocket pairs, `x`, suited notation, board notation, position abbreviations, BB-based sizing.
- Preflop fundamentals: opening ranges, limping, isolation, calling, folding, 3-bet, 4-bet, squeeze, blind defense, rake impact.
- Postflop fundamentals: board texture, relative hand strength, initiative, position, value, bluff, protection, check, bet, raise, check-raise.
- Math: combos, equity, outs, pot odds, implied odds, reverse implied odds, fold equity, MDF, SPR, effective stack.
- Bet sizing: small bet, half pot, two-thirds pot, pot-sized bet, overbet, all-in, sizing purpose, beginner defaults.
- Later streets: turn barrels, river value, thin value, bluff-catching, blockers, missed draws, pot control.
- Opponent models: tight, loose, passive, aggressive, calling station, nit, maniac, regular, recreational player.
- Theory: range advantage, nut advantage, polarization, linear range, balance, exploit, solver interpretation.
- Formats and environment: cash game, tournament, sit-and-go, ante, ICM, rake, rakeback, HUD stats, multi-tabling basics.
- Risk and mindset: bankroll, buy-in, variance, downswing, tilt, stop loss, session review, study schedule.
- Review workflow: hand history, positions, effective stack, action line, range notes, mistake tags, next action.

If any domain lacks a chapter section and glossary coverage, the content is incomplete.

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
- `checkpoint`: 2 to 4 skills the learner should have before continuing
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

Glossary coverage minimums:

- At least 20 terms for basic rules, actions, positions, and notation.
- At least 30 terms for preflop, ranges, and hand categories.
- At least 35 terms for postflop, board texture, hand strength, and bet lines.
- At least 20 terms for poker math, stack depth, and bet sizing.
- At least 20 terms for GTO, exploitative play, player types, and review.
- At least 15 terms for bankroll, mental game, online poker, and tournament concepts.

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

- At least 18 chapters exist.
- Every chapter has required textbook fields.
- Every chapter has at least 4 sections, 2 examples, 3 mistakes, 1 checkpoint, 3 quiz questions, and 5 related terms.
- Every chapter's prerequisites only reference earlier chapters or glossary terms.
- The first five chapters are beginner-safe.
- Glossary has at least 120 terms.
- Every glossary entry has required dictionary fields.
- Glossary includes required key terms such as `c-bet`, `donk bet`, `probe bet`, `range advantage`, `nut advantage`, `equity realization`, `MDF`, `ICM`, and `tilt`.
- Glossary includes basic notation terms such as `AKs`, `AQo`, `pocket pair`, `BB`, `effective stack`, and `board texture`.
- Search finds terms by English name, Chinese alias, abbreviation, and explanation text.
- Search returns both chapters and terms for mixed queries such as `SPR` and `limp`.
- Coverage audit domains have at least one chapter section and multiple glossary terms.
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
