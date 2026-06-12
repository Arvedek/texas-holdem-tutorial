# Poker Dashboard MVP+ Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add mistake-book workflows, richer hand review organization, JSON import/export, safer rendering, and smarter dashboard guidance to the existing static poker learning app.

**Architecture:** Keep the existing zero-dependency ES module app. Add focused helper modules for sanitization and import/export, migrate persisted state in `storage.js`, and add one new feature view for mistakes while enhancing existing dashboard, training, and review views.

**Tech Stack:** HTML, CSS, vanilla JavaScript ES modules, browser `localStorage`, browser `tests.html`, PowerShell static server.

---

## File Structure

- Create `src/lib/sanitize.js`: escape dynamic text before inserting user content into HTML strings.
- Create `src/lib/importExport.js`: state export envelope, validation, preview summary, and file download helpers.
- Create `src/features/mistakes.js`: mistake book view, filters, mastery actions, and jump-to-training behavior.
- Modify `src/lib/storage.js`: migrate legacy mistake id arrays to records and normalize new state fields.
- Modify `src/features/training.js`: write rich mistake records on wrong answers and support opening a specific question.
- Modify `src/features/review.js`: add error tags, street focus, user note, search, and filters.
- Modify `src/features/dashboard.js`: add unresolved mistakes, recent accuracy, error-type counts, and next-action guidance.
- Modify `src/main.js`: add mistake-book navigation and data import/export UI hooks.
- Modify `index.html`: add navigation item and import file input.
- Modify `styles.css`: add styles for mistake cards, data-management controls, review filters, and mobile behavior.
- Modify `tests.html`: add tests for sanitize, import validation, and storage migration.
- Modify `README.md`: document import/export and mistake book.

## Task 1: State Migration and Safe Rendering Helpers

**Files:**
- Create: `src/lib/sanitize.js`
- Modify: `src/lib/storage.js`
- Modify: `tests.html`

- [ ] **Step 1: Create `src/lib/sanitize.js`**

Add exports:

```js
export function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function escapeAttribute(value) {
  return escapeHtml(value).replaceAll("`", "&#096;");
}
```

- [ ] **Step 2: Add mistake migration in `src/lib/storage.js`**

Add `normalizeMistakes(savedMistakes)` that converts legacy string ids into records:

```js
{
  questionId,
  status: "unresolved",
  firstMistakeAt: "",
  lastMistakeAt: "",
  wrongAnswers: []
}
```

Existing record objects preserve `questionId`, `status`, timestamps, and `wrongAnswers`.

- [ ] **Step 3: Normalize hand review fields**

Add `normalizeHandReviews(handReviews)` so each review has `errorTypes: []`, `userNote: ""`, and `streetFocus: "overall"` when missing.

- [ ] **Step 4: Expand `tests.html`**

Add browser tests:

- `escapeHtml("<script>")` returns `&lt;script&gt;`.
- Legacy `savedMistakes: ["dc-002"]` loads as one unresolved record.
- Existing hand review missing new fields receives defaults.

- [ ] **Step 5: Verify**

Run `tests.html` through the local server. Expected: all tests PASS.

- [ ] **Step 6: Commit**

```bash
git add src/lib/sanitize.js src/lib/storage.js tests.html
git commit -m "feat: migrate state and add safe rendering helpers"
```

## Task 2: Rich Mistake Records in Training

**Files:**
- Modify: `src/features/training.js`
- Modify: `src/main.js`

- [ ] **Step 1: Update wrong-answer recording**

When an answer is wrong, update `savedMistakes` as records:

- If no record exists for `question.id`, create unresolved record with `firstMistakeAt`, `lastMistakeAt`, and selected wrong answer.
- If a record exists, set `status` to unresolved, update `lastMistakeAt`, and append the wrong answer if it is not already stored.

- [ ] **Step 2: Support target question opening**

Allow `renderTraining(context)` to honor `context.trainingTargetQuestionId`. If present, set `selectedType` and index to that question before rendering.

- [ ] **Step 3: Add main-level training target state**

In `src/main.js`, add `trainingTargetQuestionId` and expose `openTrainingQuestion(questionId)` in context. It sets the target id and navigates to training.

- [ ] **Step 4: Verify**

Answer a known question incorrectly. Expected: local state contains one unresolved mistake record with the wrong selected answer.

- [ ] **Step 5: Commit**

```bash
git add src/features/training.js src/main.js
git commit -m "feat: record rich drill mistakes"
```

## Task 3: Mistake Book View

**Files:**
- Create: `src/features/mistakes.js`
- Modify: `src/main.js`
- Modify: `index.html`
- Modify: `styles.css`

- [ ] **Step 1: Add navigation**

Add a `错题本` nav button in `index.html` with `data-route="mistakes"`.

- [ ] **Step 2: Create `renderMistakes(context)`**

Render:

- Summary counts for unresolved and mastered mistakes.
- Filters for drill type and status.
- Cards showing question prompt, wrong answers, correct answer, explanation, tags, and last mistake date.
- Actions: `重新练习`, `标记掌握`, and `恢复错题`.

- [ ] **Step 3: Wire actions**

`重新练习` calls `context.openTrainingQuestion(questionId)`.

`标记掌握` updates matching record status to `mastered`.

`恢复错题` updates matching record status to `unresolved`.

- [ ] **Step 4: Wire route**

Add `mistakes: "错题本"` to `routeTitles` and render `renderMistakes` in `src/main.js`.

- [ ] **Step 5: Style view**

Add grid/card/filter styles in `styles.css`, responsive at 390px.

- [ ] **Step 6: Verify**

Create an incorrect answer, visit mistake book, mark mastered, restore unresolved, and open question in training.

- [ ] **Step 7: Commit**

```bash
git add src/features/mistakes.js src/main.js index.html styles.css
git commit -m "feat: add mistake book"
```

## Task 4: Review Journal Enhancements

**Files:**
- Modify: `src/features/review.js`
- Modify: `styles.css`

- [ ] **Step 1: Add fields to review form**

Add:

- `streetFocus` select with `overall`, `preflop`, `flop`, `turn`, `river`.
- Multi-checkbox error type group using the seven labels from the spec.
- `userNote` textarea.

- [ ] **Step 2: Save enhanced review data**

On save, include `errorTypes`, `streetFocus`, and `userNote` in the saved review.

- [ ] **Step 3: Add search and filters**

Render controls above saved reviews:

- Text search.
- Decision label filter.
- Error type filter.

Filter against hero hand, board, action line, opponent notes, user note, and tags.

- [ ] **Step 4: Escape user text**

Use `escapeHtml` for displayed user-entered fields in review cards and summaries.

- [ ] **Step 5: Verify**

Save a hand with error types and user note. Filter by error type and search a word in user note.

- [ ] **Step 6: Commit**

```bash
git add src/features/review.js styles.css
git commit -m "feat: enhance hand review journal"
```

## Task 5: Import and Export

**Files:**
- Create: `src/lib/importExport.js`
- Modify: `src/main.js`
- Modify: `index.html`
- Modify: `styles.css`
- Modify: `tests.html`
- Modify: `README.md`

- [ ] **Step 1: Create import/export helpers**

Create:

- `createExportEnvelope(state)`
- `validateImportEnvelope(payload)`
- `createImportPreview(state)`
- `downloadJson(filename, data)`

Validation checks `app === "poker-learning-dashboard"`, numeric `version`, and array state keys.

- [ ] **Step 2: Add data controls to topbar**

Add export button, import button, hidden file input, and import preview area.

- [ ] **Step 3: Wire export**

Export downloads `poker-learning-dashboard-export-YYYY-MM-DD.json`.

- [ ] **Step 4: Wire import**

Import parses file JSON, validates, shows preview summary, and applies only after user confirms.

- [ ] **Step 5: Add tests**

Add `tests.html` checks for valid and invalid import envelopes.

- [ ] **Step 6: Update README**

Document export/import behavior.

- [ ] **Step 7: Commit**

```bash
git add src/lib/importExport.js src/main.js index.html styles.css tests.html README.md
git commit -m "feat: add local data import export"
```

## Task 6: Smarter Dashboard Guidance

**Files:**
- Modify: `src/features/dashboard.js`
- Modify: `styles.css`

- [ ] **Step 1: Add derived stats**

Compute:

- Unresolved mistake count.
- Recent accuracy from last 10 drill attempts.
- Error type counts from hand reviews.
- Recommended next action using the priority rules in the spec.

- [ ] **Step 2: Render guidance panel**

Add a dashboard panel with the recommendation, reason, and action button.

- [ ] **Step 3: Add mistake and review summaries**

Display unresolved mistakes and top error types.

- [ ] **Step 4: Verify**

With unresolved mistakes, dashboard recommends mistake book. After marking them mastered, recommendation changes according to drill/review state.

- [ ] **Step 5: Commit**

```bash
git add src/features/dashboard.js styles.css
git commit -m "feat: improve dashboard guidance"
```

## Task 7: Final Verification and Polish

**Files:**
- Modify: `styles.css`
- Modify: `README.md`

- [ ] **Step 1: Final responsive pass**

Check 1440px and 390px widths. Fix any overlap or horizontal scrolling.

- [ ] **Step 2: Full browser verification**

Verify:

- `tests.html` all PASS.
- Wrong drill answer creates mistake record.
- Mistake book master/restore works.
- Hand review tags/search/filter work.
- Export/import preview and confirm work.
- Dashboard recommendation reacts to mistake state.

- [ ] **Step 3: Commit polish**

```bash
git add styles.css README.md
git commit -m "docs: polish MVP plus workflow"
```

## Self-Review Checklist

- Spec coverage: mistake book maps to Tasks 2-3; review enhancements map to Task 4; import/export maps to Task 5; dashboard guidance maps to Task 6; verification maps to Task 7.
- Compatibility: legacy `savedMistakes` id arrays and old hand reviews remain renderable.
- Scope: no solver, account, cloud sync, HUD, hand-history import, or live-game assistance.
- Testability: helper tests live in `tests.html`, and browser flows are explicitly listed.

