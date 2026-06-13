# Poker Lesson Textbook Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand the learning path into beginner-friendly textbook lessons with goals, teaching sections, examples, decision flows, mistake explanations, mini quizzes, and next-step actions.

**Architecture:** Keep the app as a zero-dependency static ES module project. Extend `src/data/lessons.js` with richer local lesson content, render it inside `src/features/learning.js`, and add small module-memory quiz state for immediate feedback without expanding storage. Preserve existing lesson completion XP and daily task behavior.

**Tech Stack:** HTML, CSS, vanilla JavaScript ES modules, browser `localStorage`, `tests.html`, PowerShell static server.

---

## File Structure

- Modify `src/data/lessons.js`: add textbook-style fields to every lesson.
- Modify `src/features/learning.js`: render textbook panels, quiz feedback, and next-step buttons.
- Modify `src/main.js`: pass `navigate` into the learning feature via the existing context.
- Modify `styles.css`: add textbook, example, decision-flow, mistake detail, quiz, and next-step styles.
- Modify `tests.html`: assert every lesson has complete textbook data and valid quiz answers.
- Modify `README.md`: mention that learning path lessons now contain mini textbook content.

## Task 1: Lesson Textbook Data Tests

**Files:**
- Modify: `tests.html`
- Test: `tests.html`

- [ ] **Step 1: Add failing data-shape tests**

Add these tests after the existing lesson beginner tests:

```js
["all lessons include textbook goals", () => {
  return lessons.every((lesson) => Array.isArray(lesson.goals) && lesson.goals.length >= 2);
}],
["all lessons include at least three textbook sections", () => {
  return lessons.every((lesson) => Array.isArray(lesson.textbook)
    && lesson.textbook.length >= 3
    && lesson.textbook.every((section) => section.heading && section.body));
}],
["all lessons include worked examples and decision flow", () => {
  return lessons.every((lesson) => Array.isArray(lesson.examples)
    && lesson.examples.length >= 1
    && lesson.examples.every((example) => example.title && example.scenario && example.takeaway)
    && Array.isArray(lesson.decisionFlow)
    && lesson.decisionFlow.length >= 3);
}],
["all lessons include mistake details", () => {
  return lessons.every((lesson) => Array.isArray(lesson.mistakeDetails)
    && lesson.mistakeDetails.length >= 2
    && lesson.mistakeDetails.every((item) => item.mistake && item.whyItHurts));
}],
["all lesson quizzes have three answerable questions", () => {
  return lessons.every((lesson) => Array.isArray(lesson.quiz)
    && lesson.quiz.length === 3
    && lesson.quiz.every((item) => item.question
      && Array.isArray(item.options)
      && item.options.length >= 2
      && item.options.includes(item.answer)
      && item.explanation));
}],
["all lessons include next step actions", () => {
  const validRoutes = new Set(["learning", "ranges", "glossary", "training", "mistakes", "review", "resources"]);
  return lessons.every((lesson) => Array.isArray(lesson.nextSteps)
    && lesson.nextSteps.length >= 1
    && lesson.nextSteps.every((step) => step.label && validRoutes.has(step.route)));
}]
```

- [ ] **Step 2: Run browser tests and confirm RED**

Run `tests.html` through a local server.

Expected: the six new lesson textbook tests fail because `src/data/lessons.js` does not yet include the new fields.

- [ ] **Step 3: Commit the failing tests**

```bash
git add tests.html
git commit -m "test: cover lesson textbook data"
```

## Task 2: Expand Lesson Data Into Mini Textbooks

**Files:**
- Modify: `src/data/lessons.js`
- Test: `tests.html`

- [ ] **Step 1: Add the new fields to each lesson**

For each of the six lessons, add:

```js
goals: [
  "用一句话描述本课最重要的判断",
  "在牌桌例子里识别正确行动",
  "知道本课最常见的新手错误"
],
textbook: [
  { heading: "先建立判断对象", body: "用 2-4 句具体中文解释新人应该先看什么。" },
  { heading: "把概念放回牌桌", body: "用 2-4 句具体中文说明这个概念在真实牌局中如何出现。" },
  { heading: "用简单规则保护自己", body: "用 2-4 句具体中文给出新人可执行的保守策略。" }
],
examples: [
  {
    title: "一个具体牌桌例子",
    scenario: "写清位置、手牌、公共牌或前序行动。",
    takeaway: "解释这个例子教会新人什么。"
  }
],
decisionFlow: [
  "第一步：确认位置、行动顺序或牌面。",
  "第二步：判断自己是在价值、保护、听牌还是放弃。",
  "第三步：不确定时选择成本更低的行动。"
],
mistakeDetails: [
  { mistake: "一个原有常见错误", whyItHurts: "解释这个错误为什么长期亏钱。" },
  { mistake: "另一个原有常见错误", whyItHurts: "解释它如何让后续决策变难。" }
],
quiz: [
  {
    question: "一个本课低门槛检查题？",
    options: ["正确选项", "干扰选项"],
    answer: "正确选项",
    explanation: "解释为什么这个选项正确。"
  },
  {
    question: "第二个检查题？",
    options: ["干扰选项", "正确选项"],
    answer: "正确选项",
    explanation: "解释为什么这个选项正确。"
  },
  {
    question: "第三个检查题？",
    options: ["正确选项", "干扰选项"],
    answer: "正确选项",
    explanation: "解释为什么这个选项正确。"
  }
],
nextSteps: [
  { label: "做对应训练", route: "training", note: "用短题巩固这一课。" }
]
```

Use each lesson's actual topic:

- `rules-hand-rankings`: goals and examples about reading five-card hand strength, board threats, and showdown logic.
- `position-blinds-action`: goals and examples about UTG/HJ/CO/BTN/SB/BB information advantage.
- `preflop-ranges`: goals and examples about opening ranges, dominated hands, 3-bet discipline, and using the range page.
- `flop-texture-cbet`: goals and examples about dry/wet boards, range advantage, and not auto-c-betting.
- `odds-spr-bankroll`: goals and examples about pot odds, outs, SPR, and not chasing overpriced draws.
- `gto-exploit-review`: goals and examples about baseline strategy, exploit adjustment, and review habits.

- [ ] **Step 2: Run browser tests and confirm GREEN**

Run `tests.html`.

Expected: all existing and new data-shape tests pass.

- [ ] **Step 3: Commit lesson data expansion**

```bash
git add src/data/lessons.js tests.html
git commit -m "feat: expand lessons into mini textbooks"
```

## Task 3: Render Textbook Panels and Mini Quiz

**Files:**
- Modify: `src/features/learning.js`
- Modify: `src/main.js`
- Test: browser flow

- [ ] **Step 1: Add module-memory quiz state**

At the top of `src/features/learning.js`, add:

```js
let quizSelections = {};
```

This object maps `${lessonId}:${questionIndex}` to the selected answer. It does not persist across reloads.

- [ ] **Step 2: Add rendering helpers**

Add helper functions:

```js
function textbookPanel(lesson, completed) {
  const open = completed ? "" : "open";
  return `
    <details class="textbook-panel" ${open}>
      <summary><span>展开学习</span><strong>${lesson.textbook.length} 个核心段落</strong></summary>
      <div class="goal-list">${lesson.goals.map((goal) => `<span>${escapeHtml(goal)}</span>`).join("")}</div>
      <div class="textbook-section-list">
        ${lesson.textbook.map((section) => `
          <section class="textbook-section">
            <h4>${escapeHtml(section.heading)}</h4>
            <p>${escapeHtml(section.body)}</p>
          </section>
        `).join("")}
      </div>
      ${renderExamples(lesson)}
      ${renderDecisionFlow(lesson)}
      ${renderMistakeDetails(lesson)}
      ${renderQuiz(lesson)}
      ${renderNextSteps(lesson)}
    </details>
  `;
}

function renderExamples(lesson) {
  return `
    <div class="textbook-subpanel">
      <h4>牌桌例子</h4>
      ${lesson.examples.map((example) => `
        <article class="worked-example">
          <strong>${escapeHtml(example.title)}</strong>
          <p>${escapeHtml(example.scenario)}</p>
          <span>${escapeHtml(example.takeaway)}</span>
        </article>
      `).join("")}
    </div>
  `;
}

function renderDecisionFlow(lesson) {
  return `
    <div class="textbook-subpanel">
      <h4>新人判断流程</h4>
      <ol class="decision-flow">${lesson.decisionFlow.map((step) => `<li>${escapeHtml(step)}</li>`).join("")}</ol>
    </div>
  `;
}

function renderMistakeDetails(lesson) {
  return `
    <div class="textbook-subpanel">
      <h4>误区为什么贵</h4>
      <div class="mistake-detail-list">
        ${lesson.mistakeDetails.map((item) => `
          <div class="mistake-explain">
            <strong>${escapeHtml(item.mistake)}</strong>
            <p>${escapeHtml(item.whyItHurts)}</p>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

function renderQuiz(lesson) {
  return `
    <div class="textbook-subpanel quiz-panel">
      <h4>小测验</h4>
      ${lesson.quiz.map((item, index) => {
        const key = `${lesson.id}:${index}`;
        const selected = quizSelections[key];
        const answered = Boolean(selected);
        const correct = selected === item.answer;
        return `
          <div class="quiz-item">
            <strong>${escapeHtml(index + 1)}. ${escapeHtml(item.question)}</strong>
            <div class="quiz-options">
              ${item.options.map((option) => `
                <button class="quiz-option ${selected === option ? "is-selected" : ""}" data-quiz-lesson="${escapeHtml(lesson.id)}" data-quiz-index="${index}" data-quiz-answer="${escapeHtml(option)}">
                  ${escapeHtml(option)}
                </button>
              `).join("")}
            </div>
            ${answered ? `<p class="quiz-feedback ${correct ? "is-correct" : "is-wrong"}">${correct ? "答对了。" : "再想一下。"} ${escapeHtml(item.explanation)}</p>` : ""}
          </div>
        `;
      }).join("")}
    </div>
  `;
}

function renderNextSteps(lesson) {
  return `
    <div class="textbook-subpanel">
      <h4>下一步</h4>
      <div class="button-row">
        ${lesson.nextSteps.map((step) => `
          <button class="ghost-button" data-next-route="${escapeHtml(step.route)}" title="${escapeHtml(step.note || "")}">
            ${escapeHtml(step.label)}
          </button>
        `).join("")}
      </div>
    </div>
  `;
}
```

- [ ] **Step 3: Pass `navigate` into learning**

`src/main.js` already returns `navigate: setRoute` in `getContext()`. Confirm `renderLearning(getContext())` receives it.

Change the function signature in `src/features/learning.js`:

```js
export function renderLearning({ app, state, setState, data, navigate }) {
```

- [ ] **Step 4: Insert textbook panel into each lesson card**

Render it below the beginner panel:

```js
${beginnerPanel(lesson, state.beginnerMode)}
${textbookPanel(lesson, done)}
```

- [ ] **Step 5: Add quiz and next-step event handlers**

After existing lesson completion event handlers, add:

```js
app.querySelectorAll("[data-quiz-lesson]").forEach((button) => {
  button.addEventListener("click", () => {
    const key = `${button.dataset.quizLesson}:${button.dataset.quizIndex}`;
    quizSelections = {
      ...quizSelections,
      [key]: button.dataset.quizAnswer
    };
    renderLearning({ app, state, setState, data, navigate });
  });
});

app.querySelectorAll("[data-next-route]").forEach((button) => {
  button.addEventListener("click", () => {
    if (navigate) {
      navigate(button.dataset.nextRoute);
    }
  });
});
```

- [ ] **Step 6: Browser verify**

Open `http://127.0.0.1:5173/`, navigate to Learning Path.

Expected:

- A lesson contains "展开学习".
- Clicking a quiz option shows feedback.
- Clicking a next-step button routes to another module.
- Marking a lesson complete still awards XP.

- [ ] **Step 7: Commit UI rendering**

```bash
git add src/features/learning.js src/main.js
git commit -m "feat: render textbook lessons and quizzes"
```

## Task 4: Add Textbook Styles

**Files:**
- Modify: `styles.css`
- Test: browser and mobile viewport

- [ ] **Step 1: Add desktop styles**

Add styles near the existing `.beginner-panel` section:

```css
.textbook-panel {
  margin: 16px 0;
  padding: 16px;
  border: 1px solid rgba(124, 115, 96, 0.22);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.62);
}

.textbook-panel summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  cursor: pointer;
  color: var(--ink);
  font-weight: 800;
}

.textbook-panel summary strong {
  color: var(--muted);
  font-size: 13px;
}

.goal-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 14px;
}

.goal-list span {
  padding: 7px 10px;
  border-radius: 999px;
  background: rgba(15, 90, 67, 0.08);
  color: var(--felt);
  font-weight: 800;
  font-size: 13px;
}

.textbook-section-list {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin-top: 14px;
}

.textbook-section,
.textbook-subpanel,
.worked-example,
.mistake-explain,
.quiz-item {
  padding: 12px;
  border-radius: 8px;
  background: rgba(15, 90, 67, 0.055);
}

.textbook-section h4,
.textbook-subpanel h4 {
  margin: 0 0 8px;
}

.textbook-section p,
.worked-example p,
.worked-example span,
.mistake-explain p,
.quiz-feedback {
  color: var(--muted);
  line-height: 1.65;
}

.textbook-subpanel {
  margin-top: 12px;
}

.decision-flow {
  margin: 0;
  padding-left: 20px;
  color: var(--muted);
  line-height: 1.7;
}

.mistake-detail-list,
.quiz-panel {
  display: grid;
  gap: 10px;
}

.quiz-options {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
}

.quiz-option {
  padding: 8px 10px;
  border: 1px solid rgba(124, 115, 96, 0.26);
  border-radius: 8px;
  background: #fff;
  color: var(--ink);
  cursor: pointer;
}

.quiz-option.is-selected {
  border-color: var(--felt);
  background: rgba(15, 90, 67, 0.08);
}

.quiz-feedback {
  margin: 10px 0 0;
}

.quiz-feedback.is-correct {
  color: var(--felt);
  font-weight: 800;
}

.quiz-feedback.is-wrong {
  color: #8f2f21;
  font-weight: 800;
}
```

- [ ] **Step 2: Add mobile styles**

In the existing mobile media query where `.beginner-grid` is set to one column, add `.textbook-section-list`:

```css
.textbook-section-list {
  grid-template-columns: 1fr;
}
```

- [ ] **Step 3: Browser verify desktop and mobile**

Check:

- Text does not overlap.
- Quiz options wrap.
- 390px viewport has no horizontal overflow.

- [ ] **Step 4: Commit styles**

```bash
git add styles.css
git commit -m "style: polish textbook lesson panels"
```

## Task 5: README and Final Verification

**Files:**
- Modify: `README.md`
- Test: `scripts/test-serve.ps1`, `tests.html`, browser flow

- [ ] **Step 1: Update README**

Add this bullet under Education & Retention Pack:

```markdown
- 教材式学习路径：每节课包含目标、正文讲解、牌桌例子、判断流程、误区详解、小测验和下一步动作。
```

- [ ] **Step 2: Run server smoke test**

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\test-serve.ps1 -Port 5180
```

Expected:

```text
serve.ps1 smoke test passed on port 5180
```

- [ ] **Step 3: Run browser tests**

Open `http://127.0.0.1:5173/tests.html`.

Expected: every row shows `PASS`.

- [ ] **Step 4: Run browser flow checks**

Use the app at `http://127.0.0.1:5173/`.

Expected:

- Learning path renders.
- First lesson textbook panel is visible.
- A quiz option click displays feedback.
- A next-step button navigates to another route.
- Completing a lesson awards XP and daily lesson activity.
- Mobile 390px has no horizontal overflow.

- [ ] **Step 5: Commit docs**

```bash
git add README.md
git commit -m "docs: describe textbook learning path"
```

## Self-Review Checklist

- Spec coverage: all data fields, UI rendering, quiz feedback, next-step routing, tests, README, and browser verification are covered.
- Scope guard: no solver, live-game advice, account system, cloud sync, or paid course copying.
- Data consistency: plan uses `goals`, `textbook`, `examples`, `decisionFlow`, `mistakeDetails`, `quiz`, and `nextSteps` consistently.
- Storage choice: quiz selections are module-memory only; no migration required for this MVP.
