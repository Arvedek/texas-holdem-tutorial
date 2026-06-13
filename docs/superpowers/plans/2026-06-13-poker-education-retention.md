# Poker Education and Retention Pack Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the poker dashboard more beginner-friendly and motivating by adding beginner lesson expansions, glossary, preflop range reference, XP/level/streak/badges, daily tasks, training summaries, and skill mastery.

**Architecture:** Keep the current zero-dependency static ES module app. Add small data modules for glossary and preflop ranges, a focused rewards helper for XP/daily/mastery logic, and new feature views while enhancing dashboard, learning, training, mistakes, and review to award progress.

**Tech Stack:** HTML, CSS, vanilla JavaScript ES modules, browser `localStorage`, browser `tests.html`, PowerShell static server.

---

## File Structure

- Create `src/data/glossary.js`: glossary terms, simple explanations, and examples.
- Create `src/data/preflopRanges.js`: beginner 6-max range reference.
- Create `src/features/glossary.js`: glossary view with search/filter.
- Create `src/features/ranges.js`: preflop range reference view.
- Create `src/lib/rewards.js`: XP events, levels, badges, daily tasks, streak, mastery calculations.
- Modify `src/data/lessons.js`: add beginner expansion fields to each lesson.
- Modify `src/lib/storage.js`: migrate reward state defaults.
- Modify `src/main.js`: add beginner mode, routes, reward helpers in context, and nav titles.
- Modify `index.html`: add `翻前范围` and `术语表` navigation.
- Modify `src/features/dashboard.js`: render XP, level, streak, daily tasks, mastery bars, and latest badges.
- Modify `src/features/learning.js`: render beginner expansion, beginner-safe markers, and award lesson XP.
- Modify `src/features/training.js`: award drill XP, update daily training count, show session summary after five answers.
- Modify `src/features/mistakes.js`: award XP and badges when mastering mistakes.
- Modify `src/features/review.js`: award review XP and update daily review task.
- Modify `tests.html`: add reward, storage migration, glossary, and range data tests.
- Modify `styles.css`: add reward, daily task, badge, glossary, and range styles.
- Modify `README.md`: document the education and retention pack.

## Task 1: Reward State Migration and Helper Tests

**Files:**
- Create: `src/lib/rewards.js`
- Modify: `src/lib/storage.js`
- Modify: `tests.html`

- [ ] **Step 1: Add reward defaults to storage**

Extend `DEFAULT_STATE` with:

```js
beginnerMode: true,
xp: 0,
xpEvents: [],
badges: [],
dailyActivity: {}
```

Normalize these fields in `normalizeState`.

- [ ] **Step 2: Create `src/lib/rewards.js`**

Export:

- `getTodayKey(date = new Date())`
- `getLevel(xp)`
- `awardXp(state, type, amount, label, date = new Date())`
- `markDailyActivity(state, key, value, date = new Date())`
- `awardBadge(state, badgeId)`
- `calculateStreak(dailyActivity, today = new Date())`
- `getDailyTasks(state, today = new Date())`
- `calculateMastery(state, lessons, drills)`

- [ ] **Step 3: Add tests**

Add tests to `tests.html`:

- migration defaults beginner mode on.
- `getLevel(0)` returns level 1.
- awarding XP increases `xp` and appends one event.
- awarding the same badge twice stores it once.
- daily task completion returns expected state.

- [ ] **Step 4: Verify**

Run `tests.html`; expected all PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/rewards.js src/lib/storage.js tests.html
git commit -m "feat: add reward state helpers"
```

## Task 2: Beginner Lesson Expansion

**Files:**
- Modify: `src/data/lessons.js`
- Modify: `src/features/learning.js`
- Modify: `styles.css`

- [ ] **Step 1: Add beginner fields to lessons**

Each lesson receives:

- `plainLanguage`
- `tableExample`
- `whyItMatters`
- `miniChecklist`
- `encouragement`
- `beginnerSafe`

- [ ] **Step 2: Render beginner expansion**

In `learning.js`, render an expandable beginner panel per lesson. Show beginner-safe marker for the first four milestones.

- [ ] **Step 3: Award lesson XP**

When a lesson is marked complete for the first time, award +30 XP, mark daily `lesson`, and award `first-lesson` badge when applicable.

- [ ] **Step 4: Verify**

Complete one lesson; expected XP increases, daily lesson task completes, and beginner explanation is visible.

- [ ] **Step 5: Commit**

```bash
git add src/data/lessons.js src/features/learning.js styles.css
git commit -m "feat: add beginner lesson guidance"
```

## Task 3: Glossary and Preflop Range Views

**Files:**
- Create: `src/data/glossary.js`
- Create: `src/data/preflopRanges.js`
- Create: `src/features/glossary.js`
- Create: `src/features/ranges.js`
- Modify: `src/main.js`
- Modify: `index.html`
- Modify: `styles.css`
- Modify: `tests.html`

- [ ] **Step 1: Add glossary data**

Create at least 16 terms from the spec. Each term includes `term`, `category`, `simple`, and `example`.

- [ ] **Step 2: Add preflop range data**

Create positions UTG, HJ, CO, BTN, SB, and BB with beginner guidance and hand groups.

- [ ] **Step 3: Render glossary view**

Add search and category filters, using safe escaping for rendered text.

- [ ] **Step 4: Render range view**

Show position cards, hand groups, and beginner notes.

- [ ] **Step 5: Wire navigation**

Add nav buttons and route titles for `ranges` and `glossary`.

- [ ] **Step 6: Add tests**

Assert glossary has at least 16 terms and ranges contain all planned positions.

- [ ] **Step 7: Commit**

```bash
git add src/data/glossary.js src/data/preflopRanges.js src/features/glossary.js src/features/ranges.js src/main.js index.html styles.css tests.html
git commit -m "feat: add glossary and preflop ranges"
```

## Task 4: Dashboard Retention UI

**Files:**
- Modify: `src/features/dashboard.js`
- Modify: `src/main.js`
- Modify: `styles.css`

- [ ] **Step 1: Add beginner mode toggle**

Expose beginner mode in dashboard and persist it in state.

- [ ] **Step 2: Render reward summary**

Dashboard shows XP, level, streak, and latest badges.

- [ ] **Step 3: Render daily tasks**

Show Learn, Train, Review tasks with completion state and daily bonus status.

- [ ] **Step 4: Render mastery bars**

Show four skills: 翻前纪律, 赔率数学, 牌面阅读, 复盘习惯.

- [ ] **Step 5: Verify**

Fresh state shows beginner mode on, level 1, zero streak, three daily tasks, and mastery bars.

- [ ] **Step 6: Commit**

```bash
git add src/features/dashboard.js src/main.js styles.css
git commit -m "feat: add dashboard retention signals"
```

## Task 5: Training Rewards and Session Summary

**Files:**
- Modify: `src/features/training.js`
- Modify: `styles.css`

- [ ] **Step 1: Track session attempts**

Store current session attempts in module memory.

- [ ] **Step 2: Award drill XP**

Each drill answer awards +5 XP; correct answers award +5 bonus XP. Update daily train count.

- [ ] **Step 3: Award drill badges**

Award `first-training` after first drill answer and `ten-drills` after ten total attempts.

- [ ] **Step 4: Render session summary**

After at least five session answers, show questions answered, accuracy, strongest type, weakest type, and next suggestion.

- [ ] **Step 5: Verify**

Answer five questions; expected XP increases, daily train count updates, session summary appears.

- [ ] **Step 6: Commit**

```bash
git add src/features/training.js styles.css
git commit -m "feat: add training rewards and summary"
```

## Task 6: Mistake and Review Rewards

**Files:**
- Modify: `src/features/mistakes.js`
- Modify: `src/features/review.js`

- [ ] **Step 1: Award mistake mastery XP**

Marking a mistake mastered awards +20 XP once per action and can unlock `mistake-clear` when no unresolved mistakes remain.

- [ ] **Step 2: Award review XP**

Saving a hand review awards +25 XP, marks daily review task, and awards `first-review` once.

- [ ] **Step 3: Award daily bonus**

After lesson, train, or review state changes, if all three daily tasks are complete and bonus not awarded, grant +40 XP.

- [ ] **Step 4: Verify**

Master one mistake and save one review; expected XP events and badges update.

- [ ] **Step 5: Commit**

```bash
git add src/features/mistakes.js src/features/review.js
git commit -m "feat: reward review and mistake progress"
```

## Task 7: Final Verification and Polish

**Files:**
- Modify: `README.md`
- Modify: `styles.css`

- [ ] **Step 1: Update README**

Document beginner mode, XP, daily tasks, glossary, and preflop range reference.

- [ ] **Step 2: Full verification**

Run:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\test-serve.ps1 -Port 5180
```

Open `tests.html`; expected all PASS.

Browser flow checks:

- Complete lesson and see XP.
- Answer five drills and see summary.
- Open glossary and search term.
- Open preflop range and see all positions.
- Master mistake and save review.
- Dashboard shows daily tasks, mastery bars, level, and badges.
- Import/export still works.
- 390px mobile has no horizontal overflow.

- [ ] **Step 3: Commit**

```bash
git add README.md styles.css
git commit -m "docs: polish education retention pack"
```

## Self-Review Checklist

- Beginner suitability: covered by beginner mode, lesson expansions, glossary, and range reference.
- Retention: covered by XP, level, streak, badges, daily tasks, session summary, and mastery bars.
- Existing workflows: training, mistake book, review, import/export remain in verification scope.
- Scope guard: no solver, AI coaching, account system, cloud sync, HUD, or live-game help.

