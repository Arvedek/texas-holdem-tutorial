import { drillTypes } from "../data/drills.js";
import { BADGES, awardBadge, awardXp, getDailyTasks, markDailyActivity, maybeAwardDailyBonus } from "../lib/rewards.js";
import { escapeHtml } from "../lib/sanitize.js";

let selectedType = "preflop";
let questionIndexByType = {};
let lastAnswer = null;
let consumedTargetQuestionId = null;
let sessionAttempts = [];

function getStats(attempts) {
  const correct = attempts.filter((attempt) => attempt.correct).length;
  return {
    total: attempts.length,
    correct,
    accuracy: attempts.length ? Math.round((correct / attempts.length) * 100) : 0
  };
}

function upsertMistake(savedMistakes, questionId, selectedAnswer) {
  const now = new Date().toISOString();
  const existing = savedMistakes.find((mistake) => mistake.questionId === questionId);

  if (!existing) {
    return [
      ...savedMistakes,
      {
        questionId,
        status: "unresolved",
        firstMistakeAt: now,
        lastMistakeAt: now,
        wrongAnswers: [selectedAnswer]
      }
    ];
  }

  return savedMistakes.map((mistake) => {
    if (mistake.questionId !== questionId) {
      return mistake;
    }

    return {
      ...mistake,
      status: "unresolved",
      firstMistakeAt: mistake.firstMistakeAt || now,
      lastMistakeAt: now,
      wrongAnswers: [...new Set([...(mistake.wrongAnswers || []), selectedAnswer])]
    };
  });
}

function getSessionSummary(attempts, drills) {
  if (attempts.length < 5) {
    return "";
  }

  const byType = attempts.reduce((acc, attempt) => {
    const drill = drills.find((item) => item.id === attempt.questionId);
    const type = drill?.type || "unknown";
    acc[type] = acc[type] || [];
    acc[type].push(attempt);
    return acc;
  }, {});

  const rows = Object.entries(byType).map(([type, typeAttempts]) => ({
    type,
    label: drillTypes[type] || type,
    total: typeAttempts.length,
    accuracy: getStats(typeAttempts).accuracy
  })).sort((a, b) => b.accuracy - a.accuracy || b.total - a.total);

  const strongest = rows[0];
  const weakest = [...rows].sort((a, b) => a.accuracy - b.accuracy || b.total - a.total)[0];
  const stats = getStats(attempts);

  return `
    <aside class="panel session-summary">
      <div class="section-heading">
        <div>
          <p class="eyebrow">Session Summary</p>
          <h3>这一轮已经完成 ${stats.total} 题</h3>
        </div>
        <strong>${stats.accuracy}%</strong>
      </div>
      <div class="grid three">
        <div class="metric"><span class="muted">答对</span><strong>${stats.correct}</strong></div>
        <div class="metric"><span class="muted">最稳</span><strong>${escapeHtml(strongest?.label || "待观察")}</strong></div>
        <div class="metric"><span class="muted">优先补</span><strong>${escapeHtml(weakest?.label || "待观察")}</strong></div>
      </div>
      <p class="muted">下一步建议：继续做 5 题 ${escapeHtml(weakest?.label || "当前类型")}，然后去错题本复盘答错题。</p>
    </aside>
  `;
}

export function renderTraining({ app, state, setState, data, trainingTargetQuestionId }) {
  if (trainingTargetQuestionId && trainingTargetQuestionId !== consumedTargetQuestionId) {
    const target = data.drills.find((drill) => drill.id === trainingTargetQuestionId);
    if (target) {
      const targetQuestions = data.drills.filter((drill) => drill.type === target.type);
      selectedType = target.type;
      questionIndexByType = {
        ...questionIndexByType,
        [target.type]: Math.max(0, targetQuestions.findIndex((drill) => drill.id === trainingTargetQuestionId))
      };
      lastAnswer = null;
    }
    consumedTargetQuestionId = trainingTargetQuestionId;
  }

  const questions = data.drills.filter((drill) => drill.type === selectedType);
  const index = questionIndexByType[selectedType] || 0;
  const question = questions[index % questions.length];
  const stats = getStats(state.drillAttempts);
  const typeStats = getStats(state.drillAttempts.filter((attempt) => {
    const drill = data.drills.find((item) => item.id === attempt.questionId);
    return drill?.type === selectedType;
  }));

  app.innerHTML = `
    <section class="panel section-intro">
      <div>
        <p class="eyebrow">Training Center</p>
        <h2>用短题校准扑克直觉</h2>
        <p class="muted">先选主题，再作答。答错比答对更值钱，因为它暴露了真正需要复盘的地方。</p>
      </div>
      <div class="grid three">
        <div class="metric"><span class="muted">总作答</span><strong>${stats.total}</strong></div>
        <div class="metric"><span class="muted">总准确率</span><strong>${stats.accuracy}%</strong></div>
        <div class="metric"><span class="muted">本类准确率</span><strong>${typeStats.accuracy}%</strong></div>
      </div>
    </section>

    ${getSessionSummary(sessionAttempts, data.drills)}

    <section class="training-layout">
      <aside class="panel filter-panel">
        <h3>训练类型</h3>
        <div class="chip-list">
          ${Object.entries(drillTypes).map(([type, label]) => `
            <button class="chip-button ${type === selectedType ? "is-active" : ""}" data-drill-type="${escapeHtml(type)}">
              ${escapeHtml(label)}
            </button>
          `).join("")}
        </div>
      </aside>

      <article class="panel question-panel">
        <div class="question-meta">
          <span class="tag">${escapeHtml(question.level)}</span>
          <span class="tag is-soft">${escapeHtml(drillTypes[question.type])}</span>
        </div>
        <h2>${escapeHtml(question.prompt)}</h2>
        <div class="choice-grid">
          ${question.options.map((option) => `
            <button class="choice-button ${lastAnswer?.selected === option ? "is-selected" : ""}" data-answer="${escapeHtml(option)}">
              ${escapeHtml(option)}
            </button>
          `).join("")}
        </div>
        ${lastAnswer?.questionId === question.id ? `
          <div class="answer-panel ${lastAnswer.correct ? "is-correct" : "is-wrong"}">
            <strong>${lastAnswer.correct ? "正确" : "需要复盘"}：${escapeHtml(question.answer)}</strong>
            <p>${escapeHtml(question.explanation)}</p>
            <span class="xp-hint">+${lastAnswer.correct ? 10 : 5} XP</span>
          </div>
        ` : ""}
        <div class="button-row">
          <button class="primary-button" data-next-question>下一题</button>
        </div>
      </article>
    </section>
  `;

  app.querySelectorAll("[data-drill-type]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedType = button.dataset.drillType;
      lastAnswer = null;
      renderTraining({ app, state, setState, data });
    });
  });

  app.querySelectorAll("[data-answer]").forEach((button) => {
    button.addEventListener("click", () => {
      const selected = button.dataset.answer;
      const correct = selected === question.answer;
      lastAnswer = {
        questionId: question.id,
        selected,
        correct
      };
      sessionAttempts = [
        ...sessionAttempts,
        {
          questionId: question.id,
          selectedAnswer: selected,
          correct,
          timestamp: new Date().toISOString()
        }
      ];

      setState((current) => {
        const attempt = {
          questionId: question.id,
          selectedAnswer: selected,
          correct,
          timestamp: new Date().toISOString()
        };
        const dailyTasks = getDailyTasks(current);
        let next = {
          ...current,
          drillAttempts: [...current.drillAttempts, attempt],
          savedMistakes: correct ? current.savedMistakes : upsertMistake(current.savedMistakes, question.id, selected)
        };

        next = awardXp(next, "drill-answer", 5, "完成训练题");
        if (correct) {
          next = awardXp(next, "drill-correct", 5, "训练题答对奖励");
        }

        next = markDailyActivity(next, "trainCount", dailyTasks.trainCount + 1);
        next = awardBadge(next, BADGES.FIRST_TRAINING);
        if (next.drillAttempts.length >= 10) {
          next = awardBadge(next, BADGES.TEN_DRILLS);
        }

        return maybeAwardDailyBonus(next);
      });
    });
  });

  app.querySelector("[data-next-question]").addEventListener("click", () => {
    questionIndexByType = {
      ...questionIndexByType,
      [selectedType]: ((questionIndexByType[selectedType] || 0) + 1) % questions.length
    };
    lastAnswer = null;
    renderTraining({ app, state, setState, data });
  });
}
