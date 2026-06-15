import { BADGES, calculateMastery, calculateStreak, getDailyTasks, getLevel } from "../lib/rewards.js";
import { escapeHtml } from "../lib/sanitize.js";
import { drillTypes } from "../data/drills.js";

const TYPE_LESSON_IDS = {
  preflop: ["starting-hands-range-thinking", "open-limp-isolate-call-fold", "three-bet-four-bet-squeeze"],
  odds: ["equity-outs-odds-realization", "spr-stack-depth-commitment"],
  board: ["board-texture-reading", "relative-hand-strength", "multiway-pots"],
  decision: ["bet-purpose-sizing", "cbet-probe-donk-checkraise", "hand-review-study-routine"]
};

const BADGE_LABELS = {
  [BADGES.FIRST_LESSON]: "第一课完成",
  [BADGES.FIRST_TRAINING]: "第一次训练",
  [BADGES.TEN_DRILLS]: "十题热身",
  [BADGES.FIRST_REVIEW]: "第一条复盘",
  [BADGES.MISTAKE_CLEAR]: "清空错题",
  [BADGES.ODDS_BEGINNER]: "赔率入门",
  [BADGES.STREAK_THREE]: "三日连续"
};

function getAccuracy(attempts) {
  const correct = attempts.filter((attempt) => attempt.correct).length;
  return attempts.length ? Math.round((correct / attempts.length) * 100) : 0;
}

function getTopErrorTypes(reviews) {
  const counts = reviews.reduce((acc, review) => {
    (review.errorTypes || []).forEach((type) => {
      acc[type] = (acc[type] || 0) + 1;
    });
    return acc;
  }, {});

  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);
}

function getDrillById(drills) {
  return new Map(drills.map((drill) => [drill.id, drill]));
}

function getDominantMistakeType(unresolvedMistakes, drills) {
  const drillById = getDrillById(drills);
  const counts = unresolvedMistakes.reduce((acc, mistake) => {
    const type = drillById.get(mistake.questionId)?.type;
    if (type) {
      acc[type] = (acc[type] || 0) + 1;
    }
    return acc;
  }, {});

  const [type, count] = Object.entries(counts)
    .sort((a, b) => b[1] - a[1] || (drillTypes[a[0]] || a[0]).localeCompare(drillTypes[b[0]] || b[0], "zh-CN"))
    [0] || [];

  return type ? { type, count, label: drillTypes[type] || type } : null;
}

function getWeakestTrainingType(attempts, drills) {
  const drillById = getDrillById(drills);
  const rows = Object.entries(attempts.reduce((acc, attempt) => {
    const type = drillById.get(attempt.questionId)?.type;
    if (!type) {
      return acc;
    }
    acc[type] = acc[type] || { type, total: 0, correct: 0 };
    acc[type].total += 1;
    acc[type].correct += attempt.correct ? 1 : 0;
    return acc;
  }, {})).map(([, row]) => ({
    ...row,
    accuracy: Math.round((row.correct / row.total) * 100),
    label: drillTypes[row.type] || row.type
  }));

  return rows
    .filter((row) => row.total >= 2 && row.accuracy < 80)
    .sort((a, b) => a.accuracy - b.accuracy || b.total - a.total || a.label.localeCompare(b.label, "zh-CN"))
    [0] || null;
}

function getTypeLesson(type, lessons, completed) {
  const candidates = TYPE_LESSON_IDS[type] || [];
  return candidates
    .map((id) => lessons.find((lesson) => lesson.id === id))
    .find((lesson) => lesson && !completed.has(lesson.id))
    || candidates.map((id) => lessons.find((lesson) => lesson.id === id)).find(Boolean)
    || null;
}

function getRecommendation({ unresolvedMistakes, attempts, reviews, nextLesson, lessons, drills, completed }) {
  const mistakeFocus = getDominantMistakeType(unresolvedMistakes, drills);
  if (unresolvedMistakes.length) {
    const focusLesson = mistakeFocus ? getTypeLesson(mistakeFocus.type, lessons, completed) : null;
    return {
      title: mistakeFocus ? `先补${mistakeFocus.label}错题` : "先清理错题本",
      body: mistakeFocus
        ? `错题集中在 ${mistakeFocus.label}：${mistakeFocus.count}/${unresolvedMistakes.length} 道未掌握。先打开错题本复盘，再回到${focusLesson?.title || "对应章节"}巩固。`
        : `你还有 ${unresolvedMistakes.length} 道未掌握错题。先复盘错误，比继续刷题更划算。`,
      action: "go-mistakes",
      cta: "打开错题本",
      drillType: mistakeFocus?.type || null,
      lessonId: focusLesson?.id || null
    };
  }

  if (!attempts.length) {
    return {
      title: "先做一组训练",
      body: "你还没有训练记录。先做几题，系统才能知道你的薄弱点。",
      action: "go-training",
      cta: "开始训练",
      drillType: null,
      lessonId: null
    };
  }

  if (!reviews.length) {
    return {
      title: "保存第一条复盘",
      body: "训练能校准直觉，复盘才能找到真实牌局里的漏洞。",
      action: "go-review",
      cta: "写复盘",
      drillType: null,
      lessonId: null
    };
  }

  const weakType = getWeakestTrainingType(attempts, drills);
  if (weakType) {
    const focusLesson = getTypeLesson(weakType.type, lessons, completed);
    return {
      title: `薄弱训练：${weakType.label}`,
      body: `${weakType.label} 最近 ${weakType.total} 题准确率 ${weakType.accuracy}%。今天先练这一类，再读${focusLesson?.title || "对应章节"}，比平均刷题更有效。`,
      action: "go-training",
      cta: `练 ${weakType.label}`,
      drillType: weakType.type,
      lessonId: focusLesson?.id || null
    };
  }

  return {
    title: "继续下一课",
    body: `下一节建议学习：${nextLesson.title}。学完后做对应训练题巩固。`,
    action: "go-learning",
    cta: "继续学习",
    drillType: null,
    lessonId: nextLesson.id
  };
}

function renderDailyTasks(tasks) {
  const items = [
    { done: tasks.lesson, label: "学一节", detail: "完成任意课程" },
    { done: tasks.train, label: "练五题", detail: `${Math.min(tasks.trainCount, 5)}/5 题` },
    { done: tasks.review, label: "写复盘", detail: "保存一条手牌" }
  ];

  return items.map((item) => `
    <div class="daily-task ${item.done ? "is-done" : ""}">
      <strong>${item.done ? "✓" : "·"}</strong>
      <span>${escapeHtml(item.label)}</span>
      <small>${escapeHtml(item.detail)}</small>
    </div>
  `).join("");
}

function renderBadges(badges) {
  if (!badges.length) {
    return `<p class="muted">还没有徽章。完成第一课或第一组训练后，这里会亮起来。</p>`;
  }

  return badges.slice(-4).reverse().map((badge) => `
    <span class="badge-pill">${escapeHtml(BADGE_LABELS[badge] || badge)}</span>
  `).join("");
}

function renderMasteryBars(mastery) {
  return mastery.map((item) => `
    <div class="mastery-row">
      <div>
        <strong>${escapeHtml(item.label)}</strong>
        <span>${item.value}%</span>
      </div>
      <div class="mastery-bar" aria-label="${escapeHtml(item.label)} ${item.value}%">
        <span style="width:${item.value}%"></span>
      </div>
    </div>
  `).join("");
}

export function renderDashboard({ app, state, setState, data, navigate }) {
  const { lessons, drills } = data;
  const completed = new Set(state.completedLessons);
  const nextLesson = lessons.find((lesson) => !completed.has(lesson.id)) || lessons[lessons.length - 1];
  const attempts = state.drillAttempts;
  const recentAccuracy = getAccuracy(attempts.slice(-10));
  const unresolvedMistakes = state.savedMistakes.filter((mistake) => mistake.status !== "mastered");
  const recentReviews = [...state.handReviews].slice(-3).reverse();
  const completionRate = Math.round((completed.size / lessons.length) * 100);
  const topErrorTypes = getTopErrorTypes(state.handReviews);
  const level = getLevel(state.xp);
  const xpIntoLevel = (state.xp || 0) % 100;
  const streak = calculateStreak(state.dailyActivity);
  const dailyTasks = getDailyTasks(state);
  const mastery = calculateMastery(state, lessons, drills);
  const recommendation = getRecommendation({
    unresolvedMistakes,
    attempts,
    reviews: state.handReviews,
    nextLesson,
    lessons,
    drills,
    completed
  });
  const recommendationLesson = lessons.find((lesson) => lesson.id === recommendation.lessonId) || nextLesson;
  const suggestedDrills = (recommendation.drillType
    ? drills.filter((drill) => drill.type === recommendation.drillType)
    : drills.filter((drill) => recommendationLesson.drillTags.some((tag) => drill.tags.includes(tag)))
  ).slice(0, 4);

  app.innerHTML = `
    <div class="dashboard-grid">
      <section class="panel hero-panel">
        <div>
          <p class="eyebrow">下一步</p>
          <h2>${escapeHtml(recommendation.title)}</h2>
          <p>${escapeHtml(recommendation.body)}</p>
          <div class="button-row">
            <button class="primary-button" data-action="${recommendation.action}">${escapeHtml(recommendation.cta)}</button>
            <button class="ghost-button" data-action="go-training">做训练</button>
          </div>
        </div>
        <div class="progress-ring" style="--progress:${completionRate}%" aria-label="学习进度">
          <strong>${completionRate}%</strong>
          <span>学习进度</span>
        </div>
      </section>

      <section class="retention-grid">
        <article class="panel level-panel">
          <div class="section-heading">
            <div>
              <p class="eyebrow">Progress</p>
              <h3>Level ${level}</h3>
            </div>
            <strong>${state.xp || 0} XP</strong>
          </div>
          <div class="progress-bar" aria-label="等级经验">
            <span style="width:${xpIntoLevel}%"></span>
          </div>
          <p class="muted">距离下一级还差 ${100 - xpIntoLevel} XP。</p>
        </article>

        <article class="panel">
          <div class="section-heading">
            <div>
              <p class="eyebrow">Daily</p>
              <h3>${streak} 天连续学习</h3>
            </div>
            <span class="tag ${dailyTasks.bonusAwarded ? "" : "is-soft"}">${dailyTasks.bonusAwarded ? "今日奖励已领" : "完成三项 +40 XP"}</span>
          </div>
          <div class="daily-task-grid">${renderDailyTasks(dailyTasks)}</div>
        </article>

        <article class="panel">
          <div class="section-heading">
            <div>
              <p class="eyebrow">Mode</p>
              <h3>新手模式</h3>
            </div>
            <label class="toggle-label">
              <input type="checkbox" data-beginner-toggle ${state.beginnerMode ? "checked" : ""}>
              <span>${state.beginnerMode ? "开启" : "关闭"}</span>
            </label>
          </div>
          <p class="muted">开启后课程会显示白话解释、牌桌例子和微清单。熟悉后可以关闭，让界面更紧凑。</p>
        </article>
      </section>

      <section class="grid two">
        <article class="panel">
          <div class="section-heading">
            <div>
              <p class="eyebrow">Skill Map</p>
              <h3>能力掌握度</h3>
            </div>
          </div>
          <div class="mastery-list">${renderMasteryBars(mastery)}</div>
        </article>

        <article class="panel">
          <div class="section-heading">
            <div>
              <p class="eyebrow">Badges</p>
              <h3>最近徽章</h3>
            </div>
          </div>
          <div class="badge-row">${renderBadges(state.badges || [])}</div>
        </article>
      </section>

      <section class="grid three">
        <div class="metric"><span class="muted">已完成课程</span><strong>${completed.size}/${lessons.length}</strong></div>
        <div class="metric"><span class="muted">最近10题准确率</span><strong>${recentAccuracy}%</strong></div>
        <div class="metric"><span class="muted">未掌握错题</span><strong>${unresolvedMistakes.length}</strong></div>
      </section>

      <section class="grid two">
        <div class="panel">
          <div class="section-heading">
            <div>
              <p class="eyebrow">今日训练</p>
              <h3>围绕当前阶段的题目</h3>
            </div>
            <button class="ghost-button" data-action="go-training">进入训练</button>
          </div>
          <div class="compact-list">
            ${suggestedDrills.map((drill) => `
              <div class="compact-item">
                <strong>${escapeHtml(drill.prompt)}</strong>
                <span>${escapeHtml(drill.level)} · ${escapeHtml(drill.type)}</span>
              </div>
            `).join("")}
          </div>
        </div>

        <div class="panel">
          <div class="section-heading">
            <div>
              <p class="eyebrow">复盘漏洞</p>
              <h3>最常见错误类型</h3>
            </div>
            <button class="ghost-button" data-action="go-review">写复盘</button>
          </div>
          <div class="compact-list">
            ${topErrorTypes.length ? topErrorTypes.map(([type, count]) => `
              <div class="compact-item">
                <strong>${escapeHtml(type)}</strong>
                <span>${count} 条复盘记录</span>
              </div>
            `).join("") : `<p class="muted">还没有错误类型统计。保存复盘时勾选错误类型，这里会自动汇总。</p>`}
          </div>
        </div>
      </section>

      <section class="grid two">
        <div class="panel">
          <div class="section-heading">
            <div>
              <p class="eyebrow">最近复盘</p>
              <h3>把疑惑变成笔记</h3>
            </div>
            <button class="ghost-button" data-action="go-review">写复盘</button>
          </div>
          <div class="compact-list">
            ${recentReviews.length ? recentReviews.map((review) => `
              <div class="compact-item">
                <strong>${escapeHtml(review.heroHand || "未命名手牌")} · ${escapeHtml(review.position || "未知位置")}</strong>
                <span>${escapeHtml(review.analysis?.decisionLabel || "待观察")} · ${new Date(review.createdAt).toLocaleDateString("zh-CN")}</span>
              </div>
            `).join("") : `<p class="muted">还没有保存复盘。下一次犹豫的牌，别只记输赢，记决策。</p>`}
          </div>
        </div>

        <div class="panel">
          <div class="section-heading">
            <div>
              <p class="eyebrow">错题队列</p>
              <h3>优先复习未掌握题</h3>
            </div>
            <button class="ghost-button" data-action="go-mistakes">打开错题本</button>
          </div>
          <div class="compact-list">
            ${unresolvedMistakes.slice(0, 3).map((mistake) => {
              const drill = drills.find((item) => item.id === mistake.questionId);
              return `
                <div class="compact-item">
                  <strong>${escapeHtml(drill?.prompt || mistake.questionId)}</strong>
                  <span>${escapeHtml((mistake.wrongAnswers || []).join(" / ") || "旧错题记录")}</span>
                </div>
              `;
            }).join("") || `<p class="muted">当前没有未掌握错题。</p>`}
          </div>
        </div>
      </section>

      <section class="panel quick-actions">
        <button class="quick-action" data-action="go-learning"><strong>学习路径</strong><span>按阶段补短板</span></button>
        <button class="quick-action" data-action="go-ranges"><strong>翻前范围</strong><span>先照着稳住</span></button>
        <button class="quick-action" data-action="go-glossary"><strong>术语表</strong><span>看懂黑话</span></button>
        <button class="quick-action" data-action="go-training"><strong>训练中心</strong><span>用题目校准直觉</span></button>
        <button class="quick-action" data-action="go-mistakes"><strong>错题本</strong><span>复习未掌握题</span></button>
        <button class="quick-action" data-action="go-review"><strong>手牌复盘</strong><span>记录关键决策</span></button>
        <button class="quick-action" data-action="go-resources"><strong>资源库</strong><span>找下一份教材</span></button>
      </section>
    </div>
  `;

  app.querySelectorAll("[data-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const route = button.dataset.action.replace("go-", "");
      navigate(route);
    });
  });

  app.querySelector("[data-beginner-toggle]").addEventListener("change", (event) => {
    setState((current) => ({
      ...current,
      beginnerMode: event.target.checked
    }));
  });
}
