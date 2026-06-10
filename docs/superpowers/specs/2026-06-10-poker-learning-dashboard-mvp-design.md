# Poker Learning Dashboard MVP Design

## Purpose

Build a local web application that helps a Texas Hold'em learner move from basic concepts to structured practice and hand review. The MVP should feel like a daily study cockpit: it tells the user what to learn, gives them short drills, lets them review hands, and organizes external learning resources.

The first version targets the full learning journey, but its depth is optimized for beginner-to-intermediate and early advanced players. It should not try to replace professional solvers, HUDs, poker trackers, or paid training platforms.

## Product Positioning

The MVP combines four lightweight workflows:

1. Learning path: staged Chinese lessons and milestones.
2. Training center: short quizzes and decision drills.
3. Hand review: manual hand input with structured analysis prompts and basic calculations.
4. Resource library: curated books, tools, courses, articles, and videos with stage guidance.

The product borrows successful shapes from existing poker tools without copying their heavy scope:

- PokerStars Learn style course progression.
- GTO Wizard style Study, Practice, Analyze mental model.
- Run It Once style resource/course categorization.
- PokerTracker style hand review mindset, but without importing real-money platform hand histories in the MVP.

## MVP Scope

### Dashboard

The home screen shows:

- Current learning stage and progress.
- Recommended next lesson.
- Today's suggested drill set.
- Recent hand reviews.
- Saved mistakes or marked concepts.
- Quick links into Learning, Training, Review, and Resources.

The dashboard should make the user feel that there is always a clear next action.

### Learning Path

The MVP includes six stages:

1. Rules and hand rankings.
2. Position, blinds, and action order.
3. Preflop ranges and starting hand discipline.
4. Flop texture, equity, and continuation betting.
5. Pot odds, outs, SPR, and bankroll management.
6. Intro to GTO, exploitative adjustments, and review habits.

Each stage contains:

- A concise Chinese explanation.
- Key concepts.
- Common mistakes.
- A recommended practice task.
- Links to relevant internal drills.
- External resource links when a stage has a useful next-read.
- A completion toggle.

### Training Center

The MVP includes four drill types:

- Starting hand and position drill: choose fold, call, open, or 3-bet for simple preflop spots.
- Pot odds and outs drill: estimate outs, equity, and required call percentage.
- Board texture drill: classify boards as dry/wet, high/low, paired/unpaired, and range-favorable.
- Decision drill: choose fold, call, bet, raise, or check in simplified spots, then read an explanation.

Training content is static seed data in the MVP. The tool records attempts, correctness, and recent mistakes in local storage.

### Hand Review

The MVP supports manual hand entry:

- Game type: cash or tournament.
- Table format: heads-up, 6-max, or full ring.
- Position.
- Effective stack.
- Hero hand.
- Board cards by street.
- Pot size.
- Bet size faced or chosen.
- Action line.
- Notes about opponent tendencies.

The analysis output includes:

- Pot odds estimate.
- SPR estimate when enough information is available.
- Board texture labels.
- Basic street-by-street review checklist.
- Decision quality label: standard, loose, tight, aggressive, passive, or high-risk.
- Study note prompts for what to improve next.

The MVP should be honest about limitations. It gives learning guidance and structured thinking, not solver-perfect advice.

### Resource Library

Resources are curated into:

- Books.
- Training sites.
- Tools.
- Free courses and articles.
- Video channels.
- Mental game and bankroll management.

Each resource includes:

- Name.
- Type.
- Recommended level.
- Short Chinese description.
- Why it is useful.
- Link.
- Suggested use case.

The MVP only stores metadata and links. It must not copy paid course content or full copyrighted material.

## Data Model

All data is local in the browser for the MVP.

Core entities:

- `Lesson`: id, stage, title, summary, concepts, mistakes, task, resources, completed.
- `DrillQuestion`: id, type, prompt, options, answer, explanation, tags, level.
- `DrillAttempt`: questionId, selectedAnswer, correct, timestamp.
- `HandReview`: id, gameType, tableFormat, position, effectiveStack, heroHand, board, potSize, betSize, actionLine, opponentNotes, analysis, notes, tags, createdAt.
- `Resource`: id, name, type, level, description, value, url, suggestedUse.
- `UserProgress`: completedLessons, drillStats, savedMistakes, preferences.

Storage uses `localStorage` with a single versioned app state key. Import and export JSON are explicitly deferred to a later version.

## Architecture

Use a local single-page web application.

Recommended implementation:

- Vite.
- React.
- TypeScript.
- CSS modules or a simple global CSS file.
- Local static data files for lessons, questions, and resources.
- Browser local storage for progress and hand reviews.

The app should be organized into:

- `src/data`: seed lessons, drills, and resources.
- `src/lib`: poker calculations and local storage helpers.
- `src/components`: shared UI elements.
- `src/features/learning`: learning path views.
- `src/features/training`: drill engine and results.
- `src/features/review`: hand entry and review output.
- `src/features/resources`: resource library.

## User Experience

The interface should be a focused tool, not a marketing landing page.

Visual direction:

- Dense but readable dashboard.
- Calm professional style.
- Strong navigation between modules.
- Cards only for repeated content items and review records.
- Clear action buttons with icons where practical.
- Chinese interface copy.

Primary navigation:

- Dashboard.
- 学习路径.
- 训练中心.
- 手牌复盘.
- 资源库.

## Calculations and Heuristics

MVP calculations include:

- Pot odds: call amount divided by final pot after call.
- Approximate draw equity using rule of 2 and 4.
- SPR: effective stack divided by pot.
- Board texture classification from card ranks, suits, pairing, and connectivity.
- Simple position and starting-hand category labels.

MVP hand review should combine calculations with explicit heuristic checklists. It should not claim to produce exact GTO solutions.

## Error Handling

The app should validate:

- Card input format.
- Duplicate cards.
- Missing required hand review fields.
- Numeric fields such as pot size, bet size, and stack size.

When input is incomplete, the app should still show partial analysis where possible and clearly mark what is missing.

## Testing and Verification

Minimum verification:

- Unit tests for pot odds, SPR, outs equity estimates, card parsing, and board texture classification.
- Manual browser test for the four primary flows:
  - Complete a lesson.
  - Answer a drill question.
  - Save a hand review.
  - Filter resources.
- Responsive checks for desktop and mobile widths.

## Out of Scope for MVP

The MVP will not include:

- Real-money poker site integration.
- HUD overlays.
- Automatic hand history import.
- Full solver or GTO tree generation.
- Account login.
- Cloud sync.
- Paid content copying.
- Real-time in-game advice.

These exclusions reduce compliance risk and keep the first version useful and buildable.

## Success Criteria

The MVP is successful when the user can:

1. Open the local web app and immediately see the next recommended study action.
2. Complete at least one lesson and have progress persist after refresh.
3. Complete at least ten drill questions and see explanations.
4. Manually enter and save a hand review.
5. Use the resource library to find what to study next by level or topic.
