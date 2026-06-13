# Poker Education and Retention Pack Design

## Purpose

Make the poker learning dashboard more suitable for complete beginners and more motivating for repeated study. The current app has a strong tool foundation, but the educational content is closer to an outline than a guided beginner course. This iteration turns it into a warmer learning product with clearer onboarding, stronger positive feedback, and more concrete study guidance.

The pack should help a new learner answer:

1. What should I learn today?
2. Why does this concept matter at the table?
3. How do I know I am improving?
4. What should I practice next?

## Product Diagnosis

### Current Strengths

- The app already has a useful study structure: learning path, training center, mistake book, hand review, resources, import/export, and dashboard guidance.
- Core poker topics are present: rules, position, preflop ranges, board texture, odds, SPR, bankroll, GTO/exploit, and review habits.
- The mistake book and dashboard recommendation system create the beginning of a feedback loop.

### Gaps for Beginners

- The first learning stage moves too quickly from rules into strategy terms.
- New players need more examples, not just concept names.
- Terms such as `3-bet`, `SPR`, `blocker`, `range`, and `GTO` need inline explanations.
- Preflop training lacks a visible reference chart, so beginners may feel they are guessing.
- Current drills explain the correct answer but do not explain why the wrong options are wrong.
- Progress feedback is mostly numeric, not emotional or motivational.

### Retention Gaps

- There are no daily tasks.
- There is no streak or habit loop.
- There are no badges, levels, or small celebrations.
- The app does not summarize a completed training session.
- The learner cannot see separate skill growth across preflop, odds, board reading, and review.

## Refinement Scope

### Beginner Mode

Add a beginner-friendly layer that can be used without removing advanced content.

Beginner mode includes:

- A visible `新手模式` toggle stored in local state.
- Dashboard copy becomes warmer and simpler when beginner mode is on.
- Learning path highlights the first four beginner-safe milestones:
  - 认识牌局流程.
  - 认识位置.
  - 只玩更好的起手牌.
  - 学会用赔率决定是否跟注.
- Advanced labels such as GTO and blocker remain available but are visually marked as later-stage concepts.

The default for a fresh user is beginner mode on.

### Expanded Beginner Lessons

Add short beginner lesson details to each learning stage. Each lesson should have:

- `plainLanguage`: one-sentence explanation in very simple Chinese.
- `tableExample`: a concrete table example.
- `whyItMatters`: why this prevents losing money.
- `miniChecklist`: 3 quick checks before making a decision.
- `encouragement`: a positive learning message after completion.

Existing lesson summaries remain. The learning path renders these beginner details in an expandable section.

### Glossary

Add a glossary for poker terms used in the app.

Initial terms:

- 位置
- 盲注
- 翻前
- 翻牌
- 转牌
- 河牌
- 范围
- 3-bet
- c-bet
- outs
- 底池赔率
- SPR
- blocker
- GTO
- 剥削
- bankroll

The glossary should be accessible from navigation or the learning path. It uses concise beginner explanations and one example per term.

### Preflop Range Reference

Add a simple 6-max preflop reference, not a full solver chart.

The MVP range reference includes:

- Open-raise guidance for UTG, HJ, CO, BTN, SB.
- BB defend guidance at a high level.
- Simple hand groups:
  - Premium pairs.
  - Medium pairs.
  - Broadway.
  - Suited aces.
  - Suited connectors.
  - Weak offsuit hands.
- Beginner notes that emphasize discipline over memorizing every combo.

The reference should be rendered as readable cards or a compact matrix, not a dense professional chart.

### Positive Feedback System

Add a lightweight reward system:

- XP total.
- Level derived from XP.
- Streak based on study days.
- Today completion status.
- Badges.

XP events:

- Complete lesson: +30 XP.
- Answer drill: +5 XP.
- Correct drill answer: +5 bonus XP.
- Mark mistake mastered: +20 XP.
- Save hand review: +25 XP.
- Complete all daily tasks: +40 XP.

Badges:

- 第一课完成.
- 首次训练.
- 10题训练.
- 第一次复盘.
- 清空错题.
- 赔率入门.
- 连续3天.

Rewards should be encouraging but not casino-like. No gambling imagery beyond the app's existing restrained poker theme.

### Daily Tasks

Add three daily tasks:

- Learn: complete or review one lesson.
- Train: answer five drill questions.
- Review: save one hand review or master one mistake.

The dashboard shows today's tasks and completion state. Completing all three grants the daily XP bonus.

### Training Session Summary

After a user answers at least five questions in a session, show a session summary:

- Questions answered.
- Accuracy.
- Strongest drill type.
- Weakest drill type.
- Suggested next action.

This should appear inside the training center without requiring a modal.

### Skill Mastery

Add a simple mastery model for four skills:

- 翻前纪律
- 赔率数学
- 牌面阅读
- 复盘习惯

Mastery is derived from existing activity:

- Preflop drill accuracy and preflop lesson completion.
- Odds drill accuracy and odds lesson completion.
- Board drill accuracy and board lesson completion.
- Hand review count and mastered mistakes.

The dashboard shows these as progress bars. This gives learners positive evidence that specific skills are improving.

## Data Model Changes

Extend local state with:

```js
{
  beginnerMode: true,
  xp: 0,
  xpEvents: [],
  badges: [],
  dailyActivity: {
    "2026-06-13": {
      lesson: false,
      trainCount: 0,
      review: false,
      bonusAwarded: false
    }
  }
}
```

Storage migration should preserve existing users and add defaults.

`xpEvents` record:

```js
{
  id: "xp-...",
  type: "lesson-complete",
  amount: 30,
  label: "完成课程",
  date: "2026-06-13"
}
```

Seed data additions:

- `src/data/glossary.js`
- `src/data/preflopRanges.js`
- Expanded fields in `src/data/lessons.js`

Helper additions:

- `src/lib/rewards.js`: XP, level, badges, daily tasks, mastery calculations.

## User Experience

The app should feel more like a coach:

- Praise effort, not gambling outcomes.
- Celebrate small learning actions.
- Use simple language for beginner mode.
- Keep advanced content available without making beginners feel behind.
- Avoid noisy animations or flashy casino visuals.

Dashboard additions:

- Level and XP.
- Streak.
- Daily task checklist.
- Skill mastery bars.
- Latest unlocked badges.

Learning path additions:

- Beginner expansion for each lesson.
- Completion feedback using lesson encouragement.
- Link to glossary terms.

Training center additions:

- Session summary after five answers.
- More explicit encouragement after mistakes.

New views:

- `术语表`
- `翻前范围`

Navigation becomes:

- 仪表盘
- 学习路径
- 训练中心
- 错题本
- 手牌复盘
- 翻前范围
- 术语表
- 资源库

## Error Handling

The app should:

- Migrate old local state without deleting user progress.
- Avoid awarding duplicate daily completion bonuses.
- Avoid awarding duplicate one-time badges.
- Handle missing lesson expansion fields gracefully.
- Keep working if the user resets local state.

## Testing and Verification

Minimum verification:

- Storage migration adds reward defaults.
- XP awards once for a lesson completion action.
- Drill answers update daily train count and XP.
- Mastering a mistake awards XP and can unlock badges.
- Daily tasks show completed after qualifying actions.
- Skill mastery bars render without console errors.
- Glossary renders all initial terms.
- Preflop range reference renders all planned positions.
- Existing flows still pass:
  - lesson completion
  - drill answer
  - mistake book master/restore
  - hand review save
  - import/export
- Responsive check at desktop width and 390px mobile width.

## Out of Scope

This iteration will not add:

- Solver-accurate range charts.
- AI-generated coaching.
- Cloud accounts or sync.
- Real-money platform integrations.
- HUD or live-game help.
- Paid content copying.

## Success Criteria

This iteration succeeds when:

1. A complete beginner can understand the first four learning milestones without outside context.
2. The app gives positive feedback after lessons, drills, mistakes, and reviews.
3. The learner can see daily tasks, XP, level, streak, badges, and skill mastery.
4. The learner has a simple preflop reference and glossary.
5. Existing MVP+ workflows continue to work.

