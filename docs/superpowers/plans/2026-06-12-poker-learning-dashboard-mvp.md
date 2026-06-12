# Poker Learning Dashboard MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a zero-dependency local web MVP for Chinese Texas Hold'em learning, drills, hand review, and resource discovery.

**Architecture:** This repository currently has no app scaffold and no local Node/npm/Python runtime is available, so the MVP will be a static browser app that opens directly from `index.html`. State is stored in browser `localStorage`; data is split into focused ES modules; UI is rendered by plain JavaScript into a single shell.

**Tech Stack:** HTML, CSS, vanilla JavaScript ES modules, browser `localStorage`, manual `tests.html` runner for calculation tests.

---

## File Structure

- Create `index.html`: app shell and module entry point.
- Create `styles.css`: complete responsive visual system and layout styling.
- Create `src/main.js`: app state orchestration, routing, render coordination, event delegation.
- Create `src/data/lessons.js`: six learning stages and internal links to drills/resources.
- Create `src/data/drills.js`: static seed drill questions for four drill types.
- Create `src/data/resources.js`: curated resource metadata and external links.
- Create `src/lib/cards.js`: card parsing, validation, duplicate-card detection, and board helpers.
- Create `src/lib/pokerMath.js`: pot odds, SPR, rule-of-2-and-4 equity, hand category helpers.
- Create `src/lib/boardTexture.js`: dry/wet, paired/unpaired, suitedness, connectivity, and range-favorability labels.
- Create `src/lib/storage.js`: versioned `localStorage` load/save/reset helpers.
- Create `src/features/dashboard.js`: dashboard view renderer.
- Create `src/features/learning.js`: learning path renderer and completion handling.
- Create `src/features/training.js`: drill engine, answer handling, explanations, attempt stats.
- Create `src/features/review.js`: hand review form, validation, analysis output, saved review list.
- Create `src/features/resources.js`: resource library filters and cards.
- Create `tests.html`: in-browser unit test page for calculation and parsing helpers.

## Task 1: Static App Shell

**Files:**
- Create: `index.html`
- Create: `styles.css`
- Create: `src/main.js`

- [ ] **Step 1: Create the HTML shell**

Create `index.html` with:

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>德州扑克学习驾驶舱</title>
    <link rel="stylesheet" href="./styles.css">
  </head>
  <body>
    <div class="app-shell">
      <aside class="sidebar" aria-label="主导航">
        <div class="brand">
          <span class="brand-mark">♠</span>
          <div>
            <strong>扑克驾驶舱</strong>
            <span>学习 / 训练 / 复盘</span>
          </div>
        </div>
        <nav class="nav">
          <button class="nav-button is-active" data-route="dashboard">仪表盘</button>
          <button class="nav-button" data-route="learning">学习路径</button>
          <button class="nav-button" data-route="training">训练中心</button>
          <button class="nav-button" data-route="review">手牌复盘</button>
          <button class="nav-button" data-route="resources">资源库</button>
        </nav>
      </aside>
      <main class="main-panel">
        <header class="topbar">
          <div>
            <p class="eyebrow">Texas Hold'em MVP</p>
            <h1 id="page-title">仪表盘</h1>
          </div>
          <button class="ghost-button" id="reset-progress" type="button">重置本地进度</button>
        </header>
        <section id="app" class="content" aria-live="polite"></section>
      </main>
    </div>
    <script type="module" src="./src/main.js"></script>
  </body>
</html>
```

- [ ] **Step 2: Create initial styling**

Create `styles.css` with layout, typography, cards, buttons, forms, responsive behavior, and poker table accents. Use a restrained palette with green, off-white, red accent, and dark neutral text.

- [ ] **Step 3: Create minimal router**

Create `src/main.js` with a route map, nav click handling, title updates, reset button handling, and a temporary placeholder render for each route.

- [ ] **Step 4: Manual verify shell**

Open `index.html` in a browser. Expected: sidebar navigation switches between five views, page title updates, and no console errors.

- [ ] **Step 5: Commit**

Run:

```bash
git add index.html styles.css src/main.js
git commit -m "feat: scaffold static poker learning app"
```

## Task 2: Core Types by Convention and Seed Data

**Files:**
- Create: `src/data/lessons.js`
- Create: `src/data/drills.js`
- Create: `src/data/resources.js`
- Modify: `src/main.js`

- [ ] **Step 1: Add lessons**

Create `src/data/lessons.js` exporting `lessons`, an array with six objects. Each object must include `id`, `stage`, `title`, `summary`, `concepts`, `mistakes`, `task`, `drillTags`, and `resourceTags`.

- [ ] **Step 2: Add drill questions**

Create `src/data/drills.js` exporting at least 24 questions: six each for `preflop`, `odds`, `board`, and `decision`. Each question must include `id`, `type`, `level`, `prompt`, `options`, `answer`, `explanation`, and `tags`.

- [ ] **Step 3: Add resource metadata**

Create `src/data/resources.js` exporting at least 18 resources across books, training sites, tools, free articles, videos, mental game, and bankroll management. Each resource must include `id`, `name`, `type`, `level`, `description`, `value`, `url`, `suggestedUse`, and `tags`.

- [ ] **Step 4: Import seed data in main**

Modify `src/main.js` to import the three data modules and expose counts in the dashboard placeholder so bad import paths fail visibly.

- [ ] **Step 5: Manual verify data imports**

Open `index.html`. Expected: dashboard placeholder shows lesson, drill, and resource counts.

- [ ] **Step 6: Commit**

Run:

```bash
git add src/data/lessons.js src/data/drills.js src/data/resources.js src/main.js
git commit -m "feat: add poker learning seed data"
```

## Task 3: Poker Calculation Libraries and Test Runner

**Files:**
- Create: `src/lib/cards.js`
- Create: `src/lib/pokerMath.js`
- Create: `src/lib/boardTexture.js`
- Create: `tests.html`

- [ ] **Step 1: Create card helpers**

Create `src/lib/cards.js` with exported functions:

```js
export function parseCard(input) {}
export function parseCards(input) {}
export function hasDuplicateCards(cards) {}
export function formatCard(card) {}
```

Accepted card input examples: `As`, `Ah`, `Td`, `10d`, `7c`. Invalid values return `{ ok: false, error: "..." }`.

- [ ] **Step 2: Create math helpers**

Create `src/lib/pokerMath.js` with exported functions:

```js
export function calculatePotOdds(callAmount, potBeforeCall) {}
export function calculateSpr(effectiveStack, potSize) {}
export function estimateDrawEquity(outs, cardsToCome) {}
export function classifyStartingHand(cardA, cardB) {}
```

`calculatePotOdds(50, 100)` should return `0.25` because the final pot after calling is 200.

- [ ] **Step 3: Create board texture helpers**

Create `src/lib/boardTexture.js` with:

```js
export function analyzeBoardTexture(cards) {}
```

It returns labels for paired state, suit state, connectivity, height, wetness, and a short Chinese explanation.

- [ ] **Step 4: Create browser test runner**

Create `tests.html` that imports the helper modules and prints pass/fail rows into the page. Include tests for:

- `parseCard("As")` succeeds.
- `parseCard("1x")` fails.
- Duplicate detection catches `As As`.
- Pot odds for call 50 into 100 equals 0.25.
- SPR for stack 300 and pot 100 equals 3.
- Equity for 9 outs with two cards to come equals 0.36.
- Paired board `As Ah 7d` is labeled paired.
- Monotone board `As Ts 7s` is labeled monotone.

- [ ] **Step 5: Manual verify tests**

Open `tests.html`. Expected: all rows show PASS and no console errors.

- [ ] **Step 6: Commit**

Run:

```bash
git add src/lib/cards.js src/lib/pokerMath.js src/lib/boardTexture.js tests.html
git commit -m "feat: add poker calculation helpers"
```

## Task 4: Versioned Local Storage

**Files:**
- Create: `src/lib/storage.js`
- Modify: `src/main.js`

- [ ] **Step 1: Create storage helpers**

Create `src/lib/storage.js` with:

```js
export const STORAGE_KEY = "poker-learning-dashboard:v1";
export const DEFAULT_STATE = {
  completedLessons: [],
  drillAttempts: [],
  handReviews: [],
  savedMistakes: []
};
export function loadState() {}
export function saveState(state) {}
export function resetState() {}
```

`loadState` should merge missing keys from `DEFAULT_STATE` to support future schema changes.

- [ ] **Step 2: Wire storage into main**

Modify `src/main.js` so every renderer receives `{ state, setState }`. Implement reset progress by calling `resetState`, updating in-memory state, and re-rendering.

- [ ] **Step 3: Manual verify persistence**

Temporarily save a value through `setState`, refresh, and confirm it remains. Then click reset and confirm it clears.

- [ ] **Step 4: Commit**

Run:

```bash
git add src/lib/storage.js src/main.js
git commit -m "feat: add local progress storage"
```

## Task 5: Dashboard View

**Files:**
- Create: `src/features/dashboard.js`
- Modify: `src/main.js`
- Modify: `styles.css`

- [ ] **Step 1: Render dashboard metrics**

Create `src/features/dashboard.js` exporting `renderDashboard(context)`. It should show:

- Lesson completion progress.
- Total drill attempts and accuracy.
- Recent hand review count.
- Saved mistake count.
- Recommended next lesson.
- Suggested drill group.

- [ ] **Step 2: Wire route**

Modify `src/main.js` to render the real dashboard for route `dashboard`.

- [ ] **Step 3: Add dashboard styling**

Modify `styles.css` for metric tiles, progress bars, and quick-action panels.

- [ ] **Step 4: Manual verify dashboard**

Open `index.html`. Expected: dashboard uses real seed data, progress is 0 on a fresh browser, and the next lesson is the first incomplete lesson.

- [ ] **Step 5: Commit**

Run:

```bash
git add src/features/dashboard.js src/main.js styles.css
git commit -m "feat: build learning dashboard"
```

## Task 6: Learning Path View

**Files:**
- Create: `src/features/learning.js`
- Modify: `src/main.js`
- Modify: `styles.css`

- [ ] **Step 1: Render lesson cards**

Create `src/features/learning.js` exporting `renderLearning(context)`. It should render six stages with summary, concepts, common mistakes, practice task, and completion button.

- [ ] **Step 2: Handle completion**

Completion button toggles the lesson id in `state.completedLessons`, saves state, and re-renders the route.

- [ ] **Step 3: Wire route**

Modify `src/main.js` to render `renderLearning` for route `learning`.

- [ ] **Step 4: Manual verify learning persistence**

Open `index.html`, complete one lesson, refresh, and confirm the lesson remains completed and dashboard progress updates.

- [ ] **Step 5: Commit**

Run:

```bash
git add src/features/learning.js src/main.js styles.css
git commit -m "feat: add learning path"
```

## Task 7: Training Center View

**Files:**
- Create: `src/features/training.js`
- Modify: `src/main.js`
- Modify: `styles.css`

- [ ] **Step 1: Render drill filters and question list**

Create `src/features/training.js` exporting `renderTraining(context)`. It should show type filters, a current question, answer buttons, explanation panel, and recent attempt stats.

- [ ] **Step 2: Record attempts**

When the user selects an answer, append a `DrillAttempt` object with `questionId`, `selectedAnswer`, `correct`, and `timestamp`.

- [ ] **Step 3: Navigate questions**

Add a "下一题" button that advances within the selected type. Keep the current question index in module-local memory.

- [ ] **Step 4: Wire route**

Modify `src/main.js` to render `renderTraining` for route `training`.

- [ ] **Step 5: Manual verify training flow**

Answer ten questions across multiple categories. Expected: explanations appear, accuracy updates, dashboard attempt count updates after returning.

- [ ] **Step 6: Commit**

Run:

```bash
git add src/features/training.js src/main.js styles.css
git commit -m "feat: add drill training center"
```

## Task 8: Hand Review View

**Files:**
- Create: `src/features/review.js`
- Modify: `src/main.js`
- Modify: `styles.css`

- [ ] **Step 1: Render hand review form**

Create `src/features/review.js` exporting `renderReview(context)`. Include fields for game type, table format, position, effective stack, hero hand, board, pot size, bet size, action line, and opponent notes.

- [ ] **Step 2: Validate and analyze input**

Use `parseCards`, `hasDuplicateCards`, `calculatePotOdds`, `calculateSpr`, and `analyzeBoardTexture`. Show partial analysis when only some values are available. Show validation messages for invalid cards, duplicates, and invalid numeric inputs.

- [ ] **Step 3: Save hand review**

On save, append a `HandReview` object with form values, analysis summary, notes, tags, and `createdAt`.

- [ ] **Step 4: Render recent reviews**

Show saved reviews below the form with compact summaries and decision labels.

- [ ] **Step 5: Wire route**

Modify `src/main.js` to render `renderReview` for route `review`.

- [ ] **Step 6: Manual verify review flow**

Enter `As Ks`, board `Qs Js 2d`, pot 100, bet 50, stack 300. Expected: no duplicate error, pot odds 25%, SPR 3, board labels visible, review saves and persists after refresh.

- [ ] **Step 7: Commit**

Run:

```bash
git add src/features/review.js src/main.js styles.css
git commit -m "feat: add manual hand review"
```

## Task 9: Resource Library View

**Files:**
- Create: `src/features/resources.js`
- Modify: `src/main.js`
- Modify: `styles.css`

- [ ] **Step 1: Render resource filters**

Create `src/features/resources.js` exporting `renderResources(context)`. Add filters for type, level, and topic tag.

- [ ] **Step 2: Render resource cards**

Each card shows name, type, level, Chinese description, why it is useful, suggested use, and an external link.

- [ ] **Step 3: Wire route**

Modify `src/main.js` to render `renderResources` for route `resources`.

- [ ] **Step 4: Manual verify resource flow**

Filter by `工具`, then by `进阶`. Expected: only matching cards are visible, links open in a new tab, and no paid content is copied into the app.

- [ ] **Step 5: Commit**

Run:

```bash
git add src/features/resources.js src/main.js styles.css
git commit -m "feat: add curated poker resources"
```

## Task 10: Final Polish and Verification

**Files:**
- Modify: `styles.css`
- Modify: `README.md`

- [ ] **Step 1: Add README**

Create `README.md` with:

```markdown
# 德州扑克学习驾驶舱

一个本地运行的德州扑克学习 MVP，包含学习路径、训练中心、手牌复盘和资源库。

## 使用方法

直接用浏览器打开 `index.html`。

## 测试

直接用浏览器打开 `tests.html`，确认所有测试显示 PASS。

## 范围说明

本工具用于学习和复盘，不接入真钱平台，不提供实时对局建议，不复制付费课程内容。
```

- [ ] **Step 2: Responsive pass**

Manually check desktop width around 1440px and narrow width around 390px. Expected: sidebar becomes top navigation or stacks cleanly, no text overlaps, cards remain readable.

- [ ] **Step 3: Full acceptance pass**

Verify the five success criteria from the spec:

- Open app and see next study action.
- Complete one lesson and refresh.
- Complete ten drill questions.
- Save one hand review.
- Filter resources by level or topic.

- [ ] **Step 4: Final test pass**

Open `tests.html`. Expected: all tests show PASS.

- [ ] **Step 5: Commit**

Run:

```bash
git add README.md styles.css
git commit -m "docs: add usage guide and polish"
```

## Self-Review Checklist

- Spec coverage: every MVP module maps to Tasks 5-9; data model maps to Tasks 2 and 4; calculations map to Task 3; verification maps to Task 10.
- Runtime adjustment: the approved spec recommended Vite/React, but local runtime checks showed no Node/npm/Python. This plan uses a zero-dependency static browser app so the MVP remains runnable in the current environment.
- Compliance boundary: no real-money integration, no HUD, no hand-history import, no solver, no paid content copying, no real-time in-game advice.
- Testability: calculation helpers have a dedicated browser test runner; user flows have explicit manual verification steps.

