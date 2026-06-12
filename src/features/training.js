import { drillTypes } from "../data/drills.js";

let selectedType = "preflop";
let questionIndexByType = {};
let lastAnswer = null;

function getStats(attempts) {
  const correct = attempts.filter((attempt) => attempt.correct).length;
  return {
    total: attempts.length,
    correct,
    accuracy: attempts.length ? Math.round((correct / attempts.length) * 100) : 0
  };
}

export function renderTraining({ app, state, setState, data }) {
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

    <section class="training-layout">
      <aside class="panel filter-panel">
        <h3>训练类型</h3>
        <div class="chip-list">
          ${Object.entries(drillTypes).map(([type, label]) => `
            <button class="chip-button ${type === selectedType ? "is-active" : ""}" data-drill-type="${type}">
              ${label}
            </button>
          `).join("")}
        </div>
      </aside>

      <article class="panel question-panel">
        <div class="question-meta">
          <span class="tag">${question.level}</span>
          <span class="tag is-soft">${drillTypes[question.type]}</span>
        </div>
        <h2>${question.prompt}</h2>
        <div class="choice-grid">
          ${question.options.map((option) => `
            <button class="choice-button ${lastAnswer?.selected === option ? "is-selected" : ""}" data-answer="${option}">
              ${option}
            </button>
          `).join("")}
        </div>
        ${lastAnswer?.questionId === question.id ? `
          <div class="answer-panel ${lastAnswer.correct ? "is-correct" : "is-wrong"}">
            <strong>${lastAnswer.correct ? "正确" : "需要复盘"}：${question.answer}</strong>
            <p>${question.explanation}</p>
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
      setState((current) => ({
        ...current,
        drillAttempts: [
          ...current.drillAttempts,
          {
            questionId: question.id,
            selectedAnswer: selected,
            correct,
            timestamp: new Date().toISOString()
          }
        ],
        savedMistakes: correct ? current.savedMistakes : [...current.savedMistakes, question.id]
      }));
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
