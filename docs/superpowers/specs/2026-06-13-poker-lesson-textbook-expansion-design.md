# Poker Lesson Textbook Expansion Design

## Goal

Turn the current learning path from a concise roadmap into beginner-friendly mini textbook lessons. A new player should be able to open one lesson, read for 10-15 minutes, understand the concept through examples, complete a short self-check, and know exactly which module to use next.

## Current Gap

The app already has six learning stages, beginner mode, glossary, preflop ranges, training, mistake book, hand review, and positive feedback. The learning path cards currently provide useful orientation, but each lesson is still too short to feel like a real course. New users can see what to learn, but not enough of the actual teaching content is inside the page.

## Recommended Approach

Use a textbook-style expansion inside the existing learning page.

Each lesson card keeps its current summary and completion button, then adds an expandable "展开学习" section with:

- Lesson goals: what the learner should be able to do after the lesson.
- Core textbook sections: 3-5 short, concrete teaching paragraphs.
- Worked examples: specific hand/position/board examples with explanation.
- Decision flow: a beginner-safe step-by-step thinking process.
- Mistake explanations: why common beginner mistakes are expensive.
- Mini quiz: 3 self-check questions with answers and explanations.
- Next steps: buttons or links to relevant training, glossary, ranges, review, or resources.

The content remains local static data. No solver, real-money advice, account system, or AI coach is added.

## User Experience

The lesson list should not become visually overwhelming. Each card shows the concise version first, then a clear expandable textbook area. Beginner mode keeps this area open by default for unfinished lessons, while completed lessons may remain collapsible.

The learner flow should be:

1. Read the lesson summary.
2. Open "展开学习".
3. Read goals and core sections.
4. Walk through examples and decision flow.
5. Answer the mini quiz.
6. Click the suggested next action.
7. Mark the lesson complete when comfortable.

Mini quiz feedback should be immediate and low-stakes. It should feel like a confidence check, not an exam. Correct answers can award a small XP bonus once per lesson quiz, but the first implementation may track only local quiz state if reward wiring would make the scope too large.

## Data Model

Extend each lesson in `src/data/lessons.js` with:

- `goals`: array of 2-4 strings.
- `textbook`: array of sections with `heading` and `body`.
- `examples`: array of examples with `title`, `scenario`, and `takeaway`.
- `decisionFlow`: ordered array of beginner decision steps.
- `mistakeDetails`: array with `mistake` and `whyItHurts`.
- `quiz`: array of 3 questions with `question`, `options`, `answer`, and `explanation`.
- `nextSteps`: array of actions with `label`, `route`, and optional `filter` or `note`.

Storage should add `lessonQuizAnswers` or `lessonQuizResults` only if the quiz interaction needs persistence. If quiz answers do not need to survive reloads, keep them in module memory and avoid expanding storage.

## UI Design

Modify `src/features/learning.js` to render:

- Current intro and progress bar.
- Current lesson card header, tags, concepts, mistakes, and practice task.
- Existing beginner panel.
- New textbook panel below beginner panel.
- Mini quiz controls inside each lesson's panel.
- Next step buttons using existing route navigation where possible.

The learning page currently receives `setState` and `data` but not `navigate`. Add `navigate` to the render context if next step buttons need to route to other modules.

Use existing styles: panels, cards, tags, progress bars, button rows, and muted text. Add focused classes for textbook sections, examples, decision-flow steps, mistake explanations, and quiz feedback.

## Rewards and Progress

Lesson completion reward remains unchanged: first completion awards lesson XP, first lesson badge, and daily lesson activity.

Optional quiz reward:

- Award +10 XP once per lesson when all quiz answers are correct.
- Store awarded lesson quiz IDs in `quizRewards` if implemented.
- Do not block lesson completion on quiz completion.

For this MVP, the key requirement is richer education content. Quiz reward is useful but secondary.

## Testing

Update `tests.html` to assert:

- Every lesson has at least 2 goals.
- Every lesson has at least 3 textbook sections.
- Every lesson has at least 1 worked example.
- Every lesson has at least 3 decision flow steps.
- Every lesson has exactly 3 quiz questions.
- Each quiz answer exists in its options.

Browser verification should cover:

- Learning path renders without errors.
- A lesson shows the expanded textbook content.
- Quiz answer click displays feedback.
- Next step button routes to the expected module.
- Completing a lesson still awards XP and daily lesson progress.
- Mobile width 390px has no horizontal overflow.

## Scope Guard

This update does not add:

- Solver output.
- Live-game advice.
- Paid course reproduction.
- Cloud sync.
- User accounts.
- Real-money platform integration.

The work is purely educational and local.

