# Poker Dashboard MVP+ Refinement Design

## Purpose

Improve the existing local Texas Hold'em learning dashboard from a usable MVP into a tool that supports repeated weekly study. The second iteration should deepen the learning loop without introducing heavyweight solver, account, cloud, or real-money platform features.

The refinement focuses on four outcomes:

1. The user can revisit and resolve mistakes through a dedicated mistake book.
2. Hand reviews become easier to organize and learn from.
3. Local progress can be exported and imported safely.
4. The dashboard gives better guidance based on recent activity.

## Current Baseline

The current MVP already includes:

- Static local web app served by `scripts/serve.ps1`.
- Dashboard, learning path, training center, hand review, and resource library.
- Seed data for six learning stages, 24 drills, and 18 resources.
- Browser local storage for completed lessons, drill attempts, hand reviews, and saved mistakes.
- Poker helper libraries for card parsing, pot odds, SPR, draw equity, starting-hand categories, and board texture.
- Browser test page with eight calculation tests.

## Refinement Scope

### Mistake Book

Add a first-class mistake book view inside the app. Training questions answered incorrectly already add their question id into `savedMistakes`; this iteration turns that raw state into a useful workflow.

The mistake book includes:

- A navigation entry named `错题本`.
- Filter by drill type.
- Filter by mastery state: unresolved or mastered.
- Cards showing the original question, the selected wrong answer when available, the correct answer, explanation, tags, and last mistake date.
- Actions:
  - `重新练习`: jumps to or opens that question in the training flow.
  - `标记掌握`: moves the question out of the unresolved list without deleting attempt history.
  - `恢复错题`: available for mastered mistakes.

The data model should evolve from storing only raw question ids to storing mistake records. Existing `savedMistakes` arrays of ids must be migrated in memory when loading state.

### Hand Review Enhancements

Improve the review workflow from “save one hand” to “build a searchable review journal.”

Each saved hand review should support:

- Error type tags:
  - `范围错误`
  - `赔率错误`
  - `下注尺度`
  - `情绪问题`
  - `价值下注`
  - `诈唬选择`
  - `防守频率`
- A user note field separate from opponent notes.
- A street focus field: preflop, flop, turn, river, or overall.
- Search across hero hand, board, action line, notes, opponent notes, and tags.
- Filter by decision label and error type.

Existing saved reviews should still render even if they do not have the new fields.

### Data Import and Export

Add JSON import and export to reduce the risk of losing local progress.

Export behavior:

- Exports the complete app state as a `.json` file.
- Includes schema version and exported timestamp.
- Does not include secrets or external credentials because the app has none.

Import behavior:

- Accepts only JSON.
- Validates that the file contains a compatible app state shape.
- Shows a preview summary before applying:
  - completed lesson count
  - drill attempt count
  - mistake count
  - hand review count
- Replaces current local state only after explicit confirmation.
- Shows clear errors for invalid JSON or incompatible data.

### Dashboard Guidance

Improve the dashboard so it gives useful next actions based on actual state.

Add:

- Unresolved mistake count.
- Recent accuracy based on the last 10 drill attempts.
- Review journal count by primary error type.
- A recommended next action:
  - If unresolved mistakes exist: review mistake book.
  - Else if no drill attempts: do training.
  - Else if no hand reviews: save a hand review.
  - Else continue next lesson.

### Quality and Safety

Add display escaping helpers for user-provided text. The current UI inserts some values into HTML strings. This iteration should route dynamic user text through safe escaping before rendering.

Improve browser test coverage:

- Existing eight helper tests must still pass.
- Add tests for storage migration from legacy `savedMistakes` id arrays.
- Add tests for import payload validation.
- Add tests for HTML escaping helper.

## Data Model Changes

Current state keys remain:

- `completedLessons`
- `drillAttempts`
- `handReviews`
- `savedMistakes`

`savedMistakes` changes from a mixed legacy list of question ids into records:

```js
{
  questionId: "dc-002",
  status: "unresolved",
  firstMistakeAt: "2026-06-12T00:00:00.000Z",
  lastMistakeAt: "2026-06-12T00:00:00.000Z",
  wrongAnswers: ["必定跟到底"]
}
```

Allowed mistake statuses:

- `unresolved`
- `mastered`

`HandReview` adds fields that may be absent on legacy records:

- `errorTypes`
- `userNote`
- `streetFocus`

Export envelope:

```js
{
  app: "poker-learning-dashboard",
  version: 1,
  exportedAt: "2026-06-12T00:00:00.000Z",
  state: { ... }
}
```

## Architecture

Keep the zero-dependency static architecture:

- HTML, CSS, vanilla JavaScript ES modules.
- Local state in `localStorage`.
- Browser-based verification via `tests.html`.
- No build step.

New or changed files:

- `src/features/mistakes.js`: mistake book view and actions.
- `src/lib/sanitize.js`: HTML escaping helpers.
- `src/lib/importExport.js`: export envelope creation, validation, and import preview.
- `src/lib/storage.js`: state migration for legacy mistakes and newly added review fields.
- `src/features/review.js`: review tags, filters, search, and user notes.
- `src/features/dashboard.js`: refined guidance and recent statistics.
- `src/features/training.js`: richer mistake record updates.
- `src/main.js`: navigation route for mistake book and data-management actions.
- `tests.html`: expanded browser tests.
- `README.md`: update usage notes for import/export.

## User Experience

Navigation becomes:

- 仪表盘
- 学习路径
- 训练中心
- 错题本
- 手牌复盘
- 资源库

The visual style should remain the same: calm, dense, tool-like, Chinese interface copy, no marketing landing page.

The mistake book should feel like a study queue. The review journal should feel like a searchable notebook.

## Error Handling

The app should:

- Preserve old local state by migrating legacy structures rather than deleting them.
- Reject invalid import files without changing current state.
- Escape user-rendered text in review cards, mistake cards, and dashboard summaries.
- Continue rendering hand reviews that lack newly added fields.
- Keep existing local state if export download fails.

## Testing and Verification

Minimum verification:

- `tests.html` shows all tests as PASS.
- Browser flow: answer a drill incorrectly, see it in mistake book, mark it mastered, restore it.
- Browser flow: save a hand review with error tags and user note, then filter/search it.
- Browser flow: export state, import the same state, preview counts, confirm replacement.
- Browser flow: verify dashboard recommendation changes when unresolved mistakes exist.
- Responsive check at desktop width and 390px mobile width.

## Out of Scope

This iteration will not include:

- Solver integration.
- Automatic hand history import.
- Cloud sync or accounts.
- Real-money platform integration.
- HUD or live-game assistance.
- AI-generated poker advice.
- Paid content copying.

## Success Criteria

The refinement is successful when:

1. Wrong drill answers create actionable mistake records.
2. The user can manage unresolved and mastered mistakes.
3. Hand reviews can be tagged, searched, filtered, and saved with user notes.
4. The user can export and import local state with validation.
5. Dashboard recommendations react to mistakes, training history, and reviews.
6. Existing MVP flows continue to work.
