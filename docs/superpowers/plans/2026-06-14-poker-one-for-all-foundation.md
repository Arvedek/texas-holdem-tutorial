# Poker One-for-All Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a one-for-all Texas Hold'em learning foundation with an 18-chapter textbook curriculum, 120+ term glossary, unified local search, and stronger progression checks.

**Architecture:** Keep the public imports stable (`src/data/lessons.js` and `src/data/glossary.js`) while moving the large curriculum and dictionary data into focused modules. Add a small local search helper in `src/lib/contentSearch.js`, then update the learning and glossary renderers to consume the richer content without breaking existing rewards, completion, quiz, or review state.

**Tech Stack:** Static HTML/CSS/JavaScript ES modules, browser-run tests in `tests.html`, PowerShell static server scripts.

---

## Source Spec

Use `docs/superpowers/specs/2026-06-14-poker-one-for-all-foundation-design.md` as the source of truth.

The implementation must satisfy these non-negotiable content requirements:

- 18 curriculum chapters.
- First 5 chapters marked beginner safe.
- Every chapter has `subtitle`, `difficulty`, `estimatedMinutes`, `prerequisites`, `sections`, `examples`, `decisionFlow`, `mistakeDetails`, `checkpoint`, `quiz`, `practiceTasks`, `relatedTerms`, and `nextSteps`.
- Every chapter has at least 4 sections, 2 examples, 4 decision steps, 3 mistake details, 2 checkpoint items, exactly 3 quiz questions, 2 practice tasks, 5 related terms, and 1 next step.
- Glossary has at least 120 terms.
- Glossary covers notation, rules, preflop, postflop, math, GTO, exploitative play, review, bankroll, online poker, and tournament concepts.
- Search finds both chapters and terms for queries such as `SPR`, `limp`, `range advantage`, `turn barrel`, `MDF`, `ICM`, and `tilt`.

## File Structure

- Create `src/data/curriculum.js`: owns the 18 textbook chapters.
- Modify `src/data/lessons.js`: re-export `curriculumChapters` as `lessons` so existing imports keep working.
- Create `src/data/glossaryExpanded.js`: owns the expanded dictionary.
- Modify `src/data/glossary.js`: re-export `expandedGlossaryTerms` as `glossaryTerms` so existing imports keep working.
- Create `src/lib/contentSearch.js`: pure search/index helpers for local chapter and glossary search.
- Modify `src/features/learning.js`: render textbook curriculum fields, checkpoints, practice tasks, related terms, and new metadata.
- Modify `src/features/glossary.js`: render richer glossary fields, filters, related terms, and unified results for chapters plus terms.
- Modify `styles.css`: add compact textbook, glossary, search, metadata, and related-term styles.
- Modify `tests.html`: add schema, coverage, and search tests.
- Modify `README.md`: describe the one-for-all foundation and how to use the new search/glossary.

## Chapter IDs

Use these exact ids and order in `src/data/curriculum.js`:

```js
[
  "table-language-notation",
  "rules-hand-rankings-showdown",
  "positions-blinds-action-order",
  "starting-hands-range-thinking",
  "open-limp-isolate-call-fold",
  "three-bet-four-bet-squeeze",
  "blind-defense-steals-rake",
  "board-texture-reading",
  "relative-hand-strength",
  "bet-purpose-sizing",
  "cbet-probe-donk-checkraise",
  "equity-outs-odds-realization",
  "spr-stack-depth-commitment",
  "turn-river-planning",
  "opponent-types-exploit",
  "gto-basics-range-advantage",
  "formats-bankroll-mental-game",
  "hand-review-study-routine"
]
```

## Required Search API

Create `src/lib/contentSearch.js` with these exports:

```js
export function normalizeQuery(value) {
  return String(value || "").trim().toLowerCase();
}

export function searchableText(parts) {
  return parts.flatMap((part) => Array.isArray(part) ? part : [part])
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

export function glossaryText(term) {
  return searchableText([
    term.id,
    term.term,
    term.english,
    term.abbreviation,
    term.aliases,
    term.category,
    term.difficulty,
    term.definition,
    term.simple,
    term.example,
    term.misunderstanding,
    term.relatedTerms
  ]);
}

export function chapterText(chapter) {
  return searchableText([
    chapter.id,
    chapter.title,
    chapter.subtitle,
    chapter.difficulty,
    chapter.summary,
    chapter.plainLanguage,
    chapter.goals,
    chapter.prerequisites,
    chapter.sections?.flatMap((section) => [section.heading, section.body, section.keyTakeaway]),
    chapter.examples?.flatMap((example) => [example.title, example.scenario, example.analysis, example.takeaway]),
    chapter.decisionFlow,
    chapter.mistakeDetails?.flatMap((mistake) => [mistake.mistake, mistake.whyItHurts, mistake.betterHabit]),
    chapter.checkpoint,
    chapter.practiceTasks?.flatMap((task) => [task.title, task.body]),
    chapter.relatedTerms
  ]);
}

export function searchContent(query, chapters, terms) {
  const normalized = normalizeQuery(query);
  if (!normalized) {
    return { chapters: [], terms: [] };
  }

  const scoreTerm = (term) => {
    const exactParts = [term.id, term.term, term.english, term.abbreviation, ...(term.aliases || [])]
      .filter(Boolean)
      .map((item) => String(item).toLowerCase());
    if (exactParts.includes(normalized)) return 100;
    if (exactParts.some((item) => item.includes(normalized))) return 80;
    return glossaryText(term).includes(normalized) ? 40 : 0;
  };

  const scoreChapter = (chapter) => {
    const exactParts = [chapter.id, chapter.title, chapter.subtitle]
      .filter(Boolean)
      .map((item) => String(item).toLowerCase());
    if (exactParts.includes(normalized)) return 90;
    if ((chapter.relatedTerms || []).some((termId) => termId.toLowerCase().includes(normalized))) return 70;
    return chapterText(chapter).includes(normalized) ? 30 : 0;
  };

  return {
    terms: terms.map((term) => ({ item: term, score: scoreTerm(term) }))
      .filter((result) => result.score > 0)
      .sort((a, b) => b.score - a.score || a.item.term.localeCompare(b.item.term, "zh-CN"))
      .map((result) => result.item),
    chapters: chapters.map((chapter) => ({ item: chapter, score: scoreChapter(chapter) }))
      .filter((result) => result.score > 0)
      .sort((a, b) => b.score - a.score || a.item.stage - b.item.stage)
      .map((result) => result.item)
  };
}
```

---

### Task 1: Add Failing Content and Search Tests

**Files:**
- Modify: `tests.html`

- [ ] **Step 1: Add imports for search helpers**

In `tests.html`, add this import after the existing reward import:

```js
import { searchContent } from "./src/lib/contentSearch.js";
```

- [ ] **Step 2: Replace sparse lesson/glossary tests with one-for-all tests**

In `tests.html`, replace the old tests named:

- `all lessons include beginner expansion fields`
- `first four lessons are beginner safe`
- `all lessons include textbook goals`
- `all lessons include at least three textbook sections`
- `all lessons include worked examples and decision flow`
- `all lessons include mistake details`
- `all lesson quizzes have three answerable questions`
- `all lessons include next step actions`
- `glossary includes at least 16 beginner terms`

with these tests:

```js
["curriculum has 18 textbook chapters", () => lessons.length === 18],
["curriculum stages are sequential", () => lessons.every((lesson, index) => lesson.stage === index + 1)],
["first five chapters are beginner safe", () => {
  return lessons.slice(0, 5).every((lesson) => lesson.beginnerSafe === true);
}],
["all chapters include one-for-all textbook fields", () => {
  return lessons.every((lesson) => lesson.id
    && lesson.title
    && lesson.subtitle
    && ["beginner", "intermediate", "advanced"].includes(lesson.difficulty)
    && Number.isFinite(lesson.estimatedMinutes)
    && lesson.estimatedMinutes >= 8
    && lesson.summary
    && lesson.plainLanguage
    && Array.isArray(lesson.goals)
    && lesson.goals.length >= 3
    && Array.isArray(lesson.prerequisites)
    && Array.isArray(lesson.sections)
    && lesson.sections.length >= 4
    && lesson.sections.every((section) => section.heading && section.body && section.keyTakeaway)
    && Array.isArray(lesson.examples)
    && lesson.examples.length >= 2
    && lesson.examples.every((example) => example.title && example.scenario && example.analysis && example.takeaway)
    && Array.isArray(lesson.decisionFlow)
    && lesson.decisionFlow.length >= 4
    && Array.isArray(lesson.mistakeDetails)
    && lesson.mistakeDetails.length >= 3
    && lesson.mistakeDetails.every((item) => item.mistake && item.whyItHurts && item.betterHabit)
    && Array.isArray(lesson.checkpoint)
    && lesson.checkpoint.length >= 2
    && lesson.checkpoint.length <= 4
    && Array.isArray(lesson.practiceTasks)
    && lesson.practiceTasks.length >= 2
    && lesson.practiceTasks.every((task) => task.title && task.body)
    && Array.isArray(lesson.relatedTerms)
    && lesson.relatedTerms.length >= 5);
}],
["chapter prerequisites only point backward or to glossary terms", () => {
  const chapterIndex = new Map(lessons.map((lesson, index) => [lesson.id, index]));
  const termIds = new Set(glossaryTerms.map((term) => term.id));
  return lessons.every((lesson, index) => {
    return lesson.prerequisites.every((item) => {
      if (termIds.has(item)) return true;
      return chapterIndex.has(item) && chapterIndex.get(item) < index;
    });
  });
}],
["all related chapter terms exist in glossary", () => {
  const termIds = new Set(glossaryTerms.map((term) => term.id));
  return lessons.every((lesson) => lesson.relatedTerms.every((termId) => termIds.has(termId)));
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
["all lessons include valid next step actions", () => {
  const validRoutes = new Set(["learning", "ranges", "glossary", "training", "mistakes", "review", "resources"]);
  const lessonIds = new Set(lessons.map((lesson) => lesson.id));
  return lessons.every((lesson) => Array.isArray(lesson.nextSteps)
    && lesson.nextSteps.length >= 1
    && lesson.nextSteps.every((step) => {
      const routeOk = !step.route || validRoutes.has(step.route);
      const chapterOk = !step.chapterId || lessonIds.has(step.chapterId);
      return step.label && routeOk && chapterOk && (step.route || step.chapterId);
    }));
}],
["glossary includes at least 120 structured terms", () => {
  return glossaryTerms.length >= 120
    && glossaryTerms.every((item) => item.id
      && item.term
      && item.english
      && Array.isArray(item.aliases)
      && item.category
      && ["beginner", "intermediate", "advanced"].includes(item.difficulty)
      && item.definition
      && item.simple
      && item.example
      && item.misunderstanding
      && Array.isArray(item.relatedTerms));
}],
["glossary includes essential specialized vocabulary", () => {
  const searchable = glossaryTerms.map((term) => [
    term.id,
    term.term,
    term.english,
    term.abbreviation,
    ...(term.aliases || [])
  ].join(" ").toLowerCase()).join(" ");
  return ["c-bet", "donk bet", "probe bet", "range advantage", "nut advantage", "equity realization", "mdf", "icm", "tilt", "aks", "aqo", "pocket pair", "bb", "effective stack", "board texture"]
    .every((needle) => searchable.includes(needle));
}],
["search finds both chapters and terms for core queries", () => {
  return ["SPR", "limp", "range advantage", "turn barrel", "MDF", "ICM", "tilt"].every((query) => {
    const result = searchContent(query, lessons, glossaryTerms);
    return result.terms.length >= 1 && result.chapters.length >= 1;
  });
}]
```

- [ ] **Step 3: Run tests and confirm RED**

Run:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\scripts\test-serve.ps1 -Port 5180
```

Expected: the smoke test may pass because it only checks serving. Then open `http://localhost:5180/tests.html` in the browser or use the Browser plugin. Expected browser test state: failures caused by missing `src/lib/contentSearch.js`, fewer than 18 lessons, and fewer than 120 glossary terms.

- [ ] **Step 4: Commit failing tests**

```bash
git add tests.html
git commit -m "test: require one-for-all poker curriculum"
```

---

### Task 2: Add Content Search Helper

**Files:**
- Create: `src/lib/contentSearch.js`
- Test: `tests.html`

- [ ] **Step 1: Create `src/lib/contentSearch.js`**

Use the exact `contentSearch.js` implementation from the Required Search API section above.

- [ ] **Step 2: Run tests and confirm partial RED**

Run:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\scripts\test-serve.ps1 -Port 5180
```

Open `http://localhost:5180/tests.html`.

Expected: import error is gone. Content tests still fail because data is not expanded yet.

- [ ] **Step 3: Commit search helper**

```bash
git add src/lib/contentSearch.js tests.html
git commit -m "feat: add local content search helper"
```

---

### Task 3: Split Curriculum Data and Expand to 18 Chapters

**Files:**
- Create: `src/data/curriculum.js`
- Modify: `src/data/lessons.js`
- Test: `tests.html`

- [ ] **Step 1: Create `src/data/curriculum.js` with the new export**

Start the file with:

```js
export const curriculumChapters = [
  {
    id: "table-language-notation",
    stage: 1,
    title: "牌桌语言、记号与基本单位",
    subtitle: "先学会读懂扑克资料里的语言",
    difficulty: "beginner",
    estimatedMinutes: 14,
    beginnerSafe: true,
    summary: "学习花色、点数、位置缩写、BB 单位、底池、筹码、行动词和 AKs/AQo 这类手牌记号。",
    plainLanguage: "德州扑克资料经常混用中文、英文缩写和牌面记号。第一章先把语言障碍拆掉，让你看到 AKs、BTN、3BB、pot、check、raise 时知道它们在牌桌上具体代表什么。",
    tableExample: "你看到记录写着 BTN open 2.5BB, BB call, flop Ah 7d 2c。它的意思是按钮位加注到 2.5 个大盲，大盲跟注，翻牌是 A 红桃、7 方块、2 梅花。",
    whyItMatters: "如果看不懂记号，后面的范围、下注、复盘都会变成猜。先统一语言，才能把每一手牌拆清楚。",
    miniChecklist: ["能读懂 AKs 和 AQo 的区别", "能用 BB 表示下注大小", "能说出 BTN、SB、BB 的含义"],
    encouragement: "把语言学会以后，德州扑克资料会突然清晰很多。这一步很基础，但非常值。",
    goals: [
      "能读懂常见手牌记号、牌面记号和位置缩写",
      "能把下注大小换算成 BB 或底池比例",
      "能复述一条简单手牌记录的行动顺序"
    ],
    prerequisites: [],
    sections: [
      {
        heading: "手牌记号怎么读",
        body: "AKs 表示 A 和 K 同花，AQo 表示 A 和 Q 不同花，TT 表示一对 T。字母代表点数，s 是 suited，同花；o 是 offsuit，不同花。资料里常用这些记号描述一组起手牌，而不是具体花色。",
        keyTakeaway: "先分清对子、同花非对子、不同花非对子。"
      },
      {
        heading: "公共牌和花色记号",
        body: "Ah 7d 2c 表示 A 红桃、7 方块、2 梅花。常见英文花色是 s 黑桃、h 红桃、d 方块、c 梅花。读牌面时要同时看点数和花色，因为同花听牌和顺子听牌都依赖这些信息。",
        keyTakeaway: "牌面不是只看大小，还要看花色和连接性。"
      },
      {
        heading: "BB、底池和筹码",
        body: "BB 是 big blind，大盲单位。用 BB 表达下注能避免被不同级别的金额干扰。2.5BB 开池、半池下注、底池下注这些说法，都是在描述下注相对大小。",
        keyTakeaway: "先用 BB 和底池比例思考，不要只看金额。"
      },
      {
        heading: "行动词的顺序",
        body: "fold 是弃牌，call 是跟注，bet 是下注，raise 是加注，check 是过牌。手牌记录通常按街道写：preflop、flop、turn、river。读记录时先看位置，再看每条行动。",
        keyTakeaway: "位置加行动顺序，是复盘每手牌的骨架。"
      }
    ],
    examples: [
      {
        title: "读懂一条手牌记录",
        scenario: "HJ open 2.5BB, BTN call, BB call. Flop Ks 9s 4d, HJ c-bet 50% pot.",
        analysis: "HJ 开池到 2.5BB，BTN 和 BB 跟注。翻牌 K 黑桃、9 黑桃、4 方块。HJ 作为翻前加注者，在翻牌下注半池。",
        takeaway: "先翻译位置、行动和牌面，再讨论策略。"
      },
      {
        title: "AKs 和 AKo 不是同一类牌",
        scenario: "你在 CO 拿 AKs，另一手在 CO 拿 AKo。",
        analysis: "两手都是强牌，但 AKs 可以形成更多同花听牌和同花成牌，翻后可玩性更高。",
        takeaway: "s 和 o 会改变一手牌的权益实现能力。"
      }
    ],
    decisionFlow: [
      "第一步：把位置缩写翻成座位名称。",
      "第二步：把手牌和公共牌记号翻成点数与花色。",
      "第三步：把下注金额换算成 BB 或底池比例。",
      "第四步：按 preflop、flop、turn、river 复述行动顺序。"
    ],
    mistakeDetails: [
      {
        mistake: "把 AKs 和 AKo 当成完全一样",
        whyItHurts: "同花属性会影响听牌、成牌和翻后可玩性，忽略它会让范围理解变粗糙。",
        betterHabit: "看到非对子手牌时先读点数，再读 s 或 o。"
      },
      {
        mistake: "只看下注金额不看 BB",
        whyItHurts: "不同级别金额不同，但 3BB 和半池下注的战略含义更稳定。",
        betterHabit: "记录下注时优先写成 BB 或底池比例。"
      },
      {
        mistake: "读手牌记录时跳过位置",
        whyItHurts: "同样行动在不同位置含义不同，不看位置会误判范围。",
        betterHabit: "每条行动前先说出玩家位置。"
      }
    ],
    checkpoint: [
      "能解释 AKs、AQo、TT、Ah 7d 2c 的含义",
      "能把一次 2.5BB 开池和半池下注说清楚",
      "能按街道复述一条简单手牌记录"
    ],
    quiz: [
      {
        question: "AKs 中的 s 代表什么？",
        options: ["同花", "不同花"],
        answer: "同花",
        explanation: "s 是 suited，表示两张手牌同花色。"
      },
      {
        question: "2.5BB open 的意思是什么？",
        options: ["加注到 2.5 个大盲", "下注到底池的 2.5%"],
        answer: "加注到 2.5 个大盲",
        explanation: "BB 是大盲单位，2.5BB 表示开池尺寸是 2.5 个大盲。"
      },
      {
        question: "读手牌记录时为什么要先看位置？",
        options: ["位置会影响范围和行动含义", "位置只影响座位好看不好看"],
        answer: "位置会影响范围和行动含义",
        explanation: "同样的加注在 UTG 和 BTN 代表的范围宽度不同。"
      }
    ],
    practiceTasks: [
      {
        title: "翻译 10 个手牌记号",
        body: "写出 AKs、AQo、TT、76s、KJo、A5s、QTs、99、JTo、K9s 的中文含义。"
      },
      {
        title: "复述一条行动线",
        body: "把 BTN open 2.5BB, BB call, flop As 8s 3d, BB check, BTN bet 33% pot 翻译成自然中文。"
      }
    ],
    relatedTerms: ["aks", "aqo", "bb", "button", "flop", "turn", "river"],
    concepts: ["AKs", "AQo", "BB", "BTN", "行动线"],
    mistakes: ["忽略同花标记", "只看金额不看 BB", "读记录时跳过位置"],
    task: "翻译 10 个手牌记号和 3 条简单行动线。",
    drillTags: ["notation", "beginner"],
    resourceTags: ["beginner", "rules"],
    nextSteps: [
      { label: "学习规则与摊牌", chapterId: "rules-hand-rankings-showdown" }
    ]
  }
];
```

- [ ] **Step 2: Add the remaining 17 chapters**

Append the 17 remaining chapter objects using the ids listed in the Chapter IDs section. Each chapter must follow the same complete shape as chapter 1. Use original Chinese teaching content, and make each chapter include at least:

- 4 `sections`
- 2 `examples`
- 4 `decisionFlow` items
- 3 `mistakeDetails`
- 2 `practiceTasks`
- 3 `quiz` questions
- 5 `relatedTerms`

Use the spec's 18-chapter curriculum as the exact content map. Do not use external copyrighted course text.

- [ ] **Step 3: Replace `src/data/lessons.js` with a compatibility export**

Replace the entire file with:

```js
export { curriculumChapters as lessons } from "./curriculum.js";
```

- [ ] **Step 4: Run tests and confirm curriculum tests improve**

Run:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\scripts\test-serve.ps1 -Port 5180
```

Open `http://localhost:5180/tests.html`.

Expected: curriculum-count and chapter-shape tests pass. Glossary and search tests may still fail.

- [ ] **Step 5: Commit curriculum data split**

```bash
git add src/data/curriculum.js src/data/lessons.js tests.html
git commit -m "feat: expand curriculum into textbook chapters"
```

---

### Task 4: Split and Expand Glossary to 120+ Terms

**Files:**
- Create: `src/data/glossaryExpanded.js`
- Modify: `src/data/glossary.js`
- Test: `tests.html`

- [ ] **Step 1: Create `src/data/glossaryExpanded.js`**

Start the file with:

```js
export const expandedGlossaryTerms = [
  {
    id: "aks",
    term: "AKs",
    english: "Ace-King suited",
    abbreviation: "AKs",
    aliases: ["同花 AK", "A K 同花"],
    category: "Notation",
    difficulty: "beginner",
    definition: "A 和 K 两张手牌同花色。",
    simple: "AKs 是一手强起手牌，因为它有两张高牌，也能形成坚果同花听牌和同花成牌。",
    example: "你拿 As Ks，记作 AKs。翻牌有两张黑桃时，你有强同花听牌。",
    misunderstanding: "不要把 AKs 和 AKo 完全等同；同花属性会提高翻后可玩性。",
    relatedTerms: ["aqo", "suited", "broadway", "equity-realization"]
  },
  {
    id: "aqo",
    term: "AQo",
    english: "Ace-Queen offsuit",
    abbreviation: "AQo",
    aliases: ["不同花 AQ", "A Q 不同花"],
    category: "Notation",
    difficulty: "beginner",
    definition: "A 和 Q 两张手牌不同花色。",
    simple: "AQo 是强牌，但面对早位强范围或 3-bet 时可能被 AK、QQ+、AQs 压制。",
    example: "你拿 Ah Qd，记作 AQo。",
    misunderstanding: "有 A 和 Q 不代表任何位置都能无脑跟注大加注。",
    relatedTerms: ["aks", "offsuit", "dominated-hand", "three-bet"]
  },
  {
    id: "bb",
    term: "BB",
    english: "Big Blind",
    abbreviation: "BB",
    aliases: ["大盲", "大盲位", "大盲单位"],
    category: "Positions",
    difficulty: "beginner",
    definition: "可以指大盲位玩家，也可以指一个大盲的筹码单位。",
    simple: "2.5BB 开池表示加注到 2.5 个大盲；你在 BB 则表示你坐在大盲位。",
    example: "盲注 1/2 时，1BB 等于 2；开到 2.5BB 就是开到 5。",
    misunderstanding: "BB 有时是位置，有时是单位，要根据上下文判断。",
    relatedTerms: ["small-blind", "button", "effective-stack", "open-raise"]
  }
];
```

- [ ] **Step 2: Add the remaining glossary terms**

Expand `expandedGlossaryTerms` to at least 120 entries. Include every term required by the spec and tests:

```js
[
  "c-bet",
  "donk bet",
  "probe bet",
  "range advantage",
  "nut advantage",
  "equity realization",
  "MDF",
  "ICM",
  "tilt",
  "AKs",
  "AQo",
  "pocket pair",
  "BB",
  "effective stack",
  "board texture"
]
```

Every entry must use the same fields as the first three entries. Related terms should reference ids that exist in the file when possible. If a related term is a common phrase that is not an id yet, create a glossary entry for it.

Minimum category coverage:

- At least 20 terms across `Basic Rules`, `Actions`, `Positions`, and `Notation`.
- At least 30 terms across `Preflop`, `Ranges`, and `Hand Categories`.
- At least 35 terms across `Postflop`, `Board Texture`, `Hand Strength`, and `Bet Lines`.
- At least 20 terms across `Poker Math`, `Stack Depth`, and `Bet Sizing`.
- At least 20 terms across `GTO`, `Exploitative Play`, `Player Types`, and `Review`.
- At least 15 terms across `Bankroll`, `Mental Game`, `Online Poker`, and `Tournament Concepts`.

- [ ] **Step 3: Replace `src/data/glossary.js` with a compatibility export**

Replace the entire file with:

```js
export { expandedGlossaryTerms as glossaryTerms } from "./glossaryExpanded.js";
```

- [ ] **Step 4: Run tests and confirm glossary tests pass**

Run:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\scripts\test-serve.ps1 -Port 5180
```

Open `http://localhost:5180/tests.html`.

Expected: glossary size and required-term tests pass. Search tests pass if chapter related terms and glossary aliases are complete.

- [ ] **Step 5: Commit glossary expansion**

```bash
git add src/data/glossaryExpanded.js src/data/glossary.js tests.html
git commit -m "feat: expand poker glossary dictionary"
```

---

### Task 5: Render the Rich Textbook Curriculum

**Files:**
- Modify: `src/features/learning.js`
- Modify: `styles.css`
- Test: `tests.html`

- [ ] **Step 1: Update helper renderers in `src/features/learning.js`**

Keep `list(items)`, `renderQuiz(lesson)`, `hasQuizSelection(lesson)`, and quiz event handling. Add or replace helpers with:

```js
function renderMeta(lesson) {
  return `
    <div class="lesson-meta">
      <span>${escapeHtml(lesson.difficulty)}</span>
      <span>${escapeHtml(String(lesson.estimatedMinutes))} min</span>
      <span>${escapeHtml((lesson.relatedTerms || []).length)} terms</span>
    </div>
  `;
}

function renderSections(lesson) {
  return (lesson.sections || lesson.textbook || []).map((section) => `
    <section class="textbook-section">
      <h4>${escapeHtml(section.heading)}</h4>
      <p>${escapeHtml(section.body)}</p>
      ${section.keyTakeaway ? `<p class="key-takeaway"><strong>Takeaway</strong> ${escapeHtml(section.keyTakeaway)}</p>` : ""}
    </section>
  `).join("");
}

function renderExamples(lesson) {
  return (lesson.examples || []).map((example) => `
    <div class="example-panel">
      <h5>${escapeHtml(example.title)}</h5>
      <p>${escapeHtml(example.scenario)}</p>
      ${example.analysis ? `<p>${escapeHtml(example.analysis)}</p>` : ""}
      <p><strong>要点：</strong>${escapeHtml(example.takeaway)}</p>
    </div>
  `).join("");
}

function renderMistakeDetails(lesson) {
  return (lesson.mistakeDetails || []).map((item) => `
    <div class="mistake-panel">
      <h5>${escapeHtml(item.mistake)}</h5>
      <p>${escapeHtml(item.whyItHurts)}</p>
      ${item.betterHabit ? `<p><strong>更好的习惯：</strong>${escapeHtml(item.betterHabit)}</p>` : ""}
    </div>
  `).join("");
}

function renderPracticeTasks(lesson) {
  return (lesson.practiceTasks || []).map((task) => `
    <div class="practice-task">
      <h5>${escapeHtml(task.title)}</h5>
      <p>${escapeHtml(task.body)}</p>
    </div>
  `).join("");
}

function renderRelatedTerms(lesson) {
  return `
    <div class="related-term-row">
      ${(lesson.relatedTerms || []).map((termId) => `
        <button class="tag is-clickable" data-related-term="${escapeAttribute(termId)}">${escapeHtml(termId)}</button>
      `).join("")}
    </div>
  `;
}
```

- [ ] **Step 2: Update `textbookPanel(lesson, completed)`**

Replace the inside of the panel with sections in this order:

```js
<div class="beginner-checklist">
  <h4>学习目标</h4>
  <ul>${list(lesson.goals || [])}</ul>
</div>
<div class="beginner-checklist">
  <h4>继续前检查</h4>
  <ul>${list(lesson.checkpoint || [])}</ul>
</div>
<div class="lesson-columns">
  ${renderSections(lesson)}
</div>
<div class="beginner-checklist">
  <h4>牌桌例子</h4>
  ${renderExamples(lesson)}
</div>
<div class="beginner-checklist">
  <h4>决策流程</h4>
  ${renderDecisionFlow(lesson)}
</div>
<div class="beginner-checklist">
  <h4>错误拆解</h4>
  ${renderMistakeDetails(lesson)}
</div>
<div class="beginner-checklist">
  <h4>练习任务</h4>
  ${renderPracticeTasks(lesson)}
</div>
<div class="beginner-checklist">
  <h4>迷你测验</h4>
  ${renderQuiz(lesson)}
</div>
<div class="beginner-checklist">
  <h4>相关术语</h4>
  ${renderRelatedTerms(lesson)}
</div>
<div class="beginner-checklist">
  <h4>下一步</h4>
  ${renderNextSteps(lesson)}
</div>
```

- [ ] **Step 3: Update lesson card header**

In each lesson card, render metadata under the title:

```js
<h3>${escapeHtml(lesson.title)}</h3>
<p>${escapeHtml(lesson.subtitle || lesson.summary)}</p>
${renderMeta(lesson)}
```

- [ ] **Step 4: Add related-term click behavior**

At the end of `renderLearning`, add:

```js
app.querySelectorAll("[data-related-term]").forEach((button) => {
  button.addEventListener("click", () => {
    if (navigate) {
      navigate("glossary");
    }
  });
});
```

This keeps navigation simple for this release. Task 6 will make glossary search powerful enough for users to find the term immediately.

- [ ] **Step 5: Add styles**

Append to `styles.css`:

```css
.lesson-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
  color: var(--muted);
  font-size: 0.86rem;
}

.lesson-meta span,
.key-takeaway {
  border: 1px solid var(--border);
  border-radius: 999px;
  padding: 6px 10px;
  background: rgba(255, 255, 255, 0.72);
}

.textbook-section,
.example-panel,
.mistake-panel,
.practice-task {
  min-width: 0;
}

.key-takeaway {
  border-radius: 6px;
  margin-top: 10px;
}

.related-term-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag.is-clickable {
  cursor: pointer;
}
```

- [ ] **Step 6: Run tests and manual learning-page check**

Run:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\scripts\test-serve.ps1 -Port 5180
```

Open `http://localhost:5180/`, go to Learning Path, expand chapters 1, 8, 12, and 18.

Expected:

- Curriculum overview still renders.
- Chapter metadata is visible.
- Full chapter content appears.
- Quiz feedback remains visible after answering.
- No horizontal overflow at desktop width.

- [ ] **Step 7: Commit learning UI**

```bash
git add src/features/learning.js styles.css
git commit -m "feat: render one-for-all textbook curriculum"
```

---

### Task 6: Upgrade Glossary UI and Unified Search

**Files:**
- Modify: `src/features/glossary.js`
- Modify: `styles.css`
- Test: `tests.html`

- [ ] **Step 1: Import search helper**

At the top of `src/features/glossary.js`, add:

```js
import { searchContent } from "../lib/contentSearch.js";
```

- [ ] **Step 2: Update filtering logic**

Inside `renderGlossary({ app, data })`, define:

```js
const lessons = data.lessons || [];
const terms = data.glossaryTerms || [];
const query = search.trim();
const searchResults = searchContent(query, lessons, terms);
const filteredTerms = query ? searchResults.terms : terms.filter((item) => {
  const categoryOk = category === "全部" || item.category === category;
  return categoryOk;
});
const matchingChapters = query ? searchResults.chapters.slice(0, 8) : [];
```

- [ ] **Step 3: Replace card markup for glossary entries**

Use:

```js
${filteredTerms.map((item) => `
  <article class="card term-card">
    <div class="term-card-header">
      <span class="tag">${escapeHtml(item.category)}</span>
      <span class="tag is-soft">${escapeHtml(item.difficulty)}</span>
    </div>
    <h3>${escapeHtml(item.term)}</h3>
    <p class="muted">${escapeHtml(item.english)}${item.abbreviation ? ` · ${escapeHtml(item.abbreviation)}` : ""}</p>
    <p>${escapeHtml(item.definition || item.simple)}</p>
    <div class="resource-note">
      <strong>白话解释</strong>
      <p>${escapeHtml(item.simple)}</p>
    </div>
    <div class="resource-note">
      <strong>牌桌例子</strong>
      <p>${escapeHtml(item.example)}</p>
    </div>
    <div class="resource-note">
      <strong>常见误解</strong>
      <p>${escapeHtml(item.misunderstanding)}</p>
    </div>
    <div class="related-term-row">
      ${(item.relatedTerms || []).slice(0, 6).map((termId) => `<span class="tag is-soft">${escapeHtml(termId)}</span>`).join("")}
    </div>
  </article>
`).join("")}
```

- [ ] **Step 4: Add matching chapter results above term grid**

After the intro section and before the glossary grid, render:

```js
${matchingChapters.length ? `
  <section class="panel">
    <div class="section-heading">
      <div>
        <p class="eyebrow">Curriculum Matches</p>
        <h3>相关章节</h3>
      </div>
    </div>
    <div class="chapter-result-list">
      ${matchingChapters.map((chapter) => `
        <article class="resource-note">
          <strong>阶段 ${chapter.stage} · ${escapeHtml(chapter.title)}</strong>
          <p>${escapeHtml(chapter.summary)}</p>
        </article>
      `).join("")}
    </div>
  </section>
` : ""}
```

- [ ] **Step 5: Add difficulty filter**

Add module variable:

```js
let difficulty = "全部";
```

Add a select in `.tool-filters`:

```js
<label>难度
  <select data-glossary-difficulty>
    ${["全部", "beginner", "intermediate", "advanced"].map((item) => `<option value="${escapeHtml(item)}" ${item === difficulty ? "selected" : ""}>${escapeHtml(item)}</option>`).join("")}
  </select>
</label>
```

When not searching, include:

```js
const difficultyOk = difficulty === "全部" || item.difficulty === difficulty;
```

When searching, filter `searchResults.terms` by category and difficulty too.

Add event listener:

```js
app.querySelector("[data-glossary-difficulty]").addEventListener("change", (event) => {
  difficulty = event.target.value;
  renderGlossary({ app, data });
});
```

- [ ] **Step 6: Add styles**

Append to `styles.css`:

```css
.term-card-header {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.chapter-result-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 12px;
}
```

- [ ] **Step 7: Run tests and manual search check**

Run:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\scripts\test-serve.ps1 -Port 5180
```

Open `http://localhost:5180/`, go to Glossary, search:

- `SPR`
- `limp`
- `range advantage`
- `turn barrel`
- `MDF`
- `ICM`
- `tilt`

Expected: each query shows at least one glossary term and one related chapter.

- [ ] **Step 8: Commit glossary UI**

```bash
git add src/features/glossary.js styles.css
git commit -m "feat: add unified glossary search"
```

---

### Task 7: README and Final Verification

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Update README feature list**

Add bullets under the current version section:

```markdown
- One-for-all 教材底座：18 章循序渐进课程，从牌桌语言、规则、翻前、翻后、数学、GTO 入门、资金管理到复盘习惯。
- 大术语词典：120+ 个德州扑克术语，包含英文、缩写、中文别名、白话解释、牌桌例子、常见误解和相关词。
- 统一搜索：在术语表中搜索 `SPR`、`limp`、`range advantage`、`MDF`、`ICM` 等关键词，可以同时看到术语和相关章节。
```

- [ ] **Step 2: Update usage section**

Add:

```markdown
建议新手使用顺序：

1. 先从「学习路径」第 1 章开始，按章节完成 checkpoint 和小测验。
2. 遇到不懂的缩写或英文术语，去「术语表」搜索。
3. 每章读完后做对应训练或练习任务。
4. 打完真实或模拟手牌后，用「手牌复盘」记录位置、行动线、范围判断和下次改进动作。
```

- [ ] **Step 3: Run full verification**

Run:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\scripts\test-serve.ps1 -Port 5180
```

Open `http://localhost:5180/tests.html`.

Expected:

- All browser test cards show `PASS`.
- `curriculum has 18 textbook chapters` passes.
- `glossary includes at least 120 structured terms` passes.
- `search finds both chapters and terms for core queries` passes.

- [ ] **Step 4: Manual responsive verification**

Open `http://localhost:5180/`.

Check desktop:

- Dashboard renders.
- Learning Path shows 18 chapters.
- Chapter 1 expands and has full textbook content.
- Glossary search works for `SPR`, `limp`, `MDF`, and `tilt`.

Check mobile viewport around 390px:

- No horizontal overflow.
- Glossary cards do not clip text.
- Quiz buttons remain at least 44px tall.

- [ ] **Step 5: Commit docs**

```bash
git add README.md
git commit -m "docs: describe one-for-all poker foundation"
```

---

## Final Review Checklist

Before presenting merge options:

- Run `git status --short` and confirm only intended files are changed or the tree is clean.
- Run `powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\scripts\test-serve.ps1 -Port 5180`.
- Open `http://localhost:5180/tests.html` and confirm all tests show `PASS`.
- Inspect Learning Path on desktop and mobile.
- Inspect Glossary search on desktop and mobile.
- Confirm no chapter uses an advanced term without that term appearing in `relatedTerms` and `glossaryTerms`.
- Confirm all content is original instructional writing.

## Suggested Commit Order

1. `test: require one-for-all poker curriculum`
2. `feat: add local content search helper`
3. `feat: expand curriculum into textbook chapters`
4. `feat: expand poker glossary dictionary`
5. `feat: render one-for-all textbook curriculum`
6. `feat: add unified glossary search`
7. `docs: describe one-for-all poker foundation`

## Implementation Notes

- Do implementation in a feature branch or worktree, not directly on `master`.
- Preserve existing routes and local storage keys.
- Keep `src/data/lessons.js` and `src/data/glossary.js` as compatibility exports because existing tests and app imports use them.
- Keep content local and static.
- Do not import external packages.
- Do not use web-fetched course material.
- Use short helper functions rather than embedding search ranking or complex rendering logic directly inside large template strings.
