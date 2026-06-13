import { drillTypes } from "../data/drills.js";
import { BADGES, awardBadge, awardXp } from "../lib/rewards.js";
import { escapeHtml, escapeAttribute } from "../lib/sanitize.js";

let filters = {
  type: "all",
  status: "unresolved"
};

function formatDate(value) {
  if (!value) {
    return "未知时间";
  }
  return new Date(value).toLocaleDateString("zh-CN");
}

function getMistakeRows(state, drills) {
  return state.savedMistakes
    .map((mistake) => ({
      mistake,
      question: drills.find((drill) => drill.id === mistake.questionId)
    }))
    .filter((row) => row.question);
}

export function renderMistakes({ app, state, setState, data, openTrainingQuestion }) {
  const rows = getMistakeRows(state, data.drills);
  const unresolvedCount = rows.filter((row) => row.mistake.status !== "mastered").length;
  const masteredCount = rows.filter((row) => row.mistake.status === "mastered").length;
  const filtered = rows.filter(({ mistake, question }) => {
    const statusOk = filters.status === "all"
      || (filters.status === "unresolved" ? mistake.status !== "mastered" : mistake.status === "mastered");
    const typeOk = filters.type === "all" || question.type === filters.type;
    return statusOk && typeOk;
  });

  app.innerHTML = `
    <section class="panel section-intro">
      <div>
        <p class="eyebrow">Mistake Book</p>
        <h2>错题本</h2>
        <p class="muted">答错的题会进入这里。先复习未掌握，再把真正理解的题标记掉。</p>
      </div>
      <div class="grid three">
        <div class="metric"><span class="muted">未掌握</span><strong>${unresolvedCount}</strong></div>
        <div class="metric"><span class="muted">已掌握</span><strong>${masteredCount}</strong></div>
        <div class="metric"><span class="muted">总错题</span><strong>${rows.length}</strong></div>
      </div>
      <div class="mistake-filters">
        <label>题型
          <select data-mistake-filter="type">
            <option value="all" ${filters.type === "all" ? "selected" : ""}>全部</option>
            ${Object.entries(drillTypes).map(([type, label]) => `
              <option value="${type}" ${filters.type === type ? "selected" : ""}>${label}</option>
            `).join("")}
          </select>
        </label>
        <label>状态
          <select data-mistake-filter="status">
            <option value="unresolved" ${filters.status === "unresolved" ? "selected" : ""}>未掌握</option>
            <option value="mastered" ${filters.status === "mastered" ? "selected" : ""}>已掌握</option>
            <option value="all" ${filters.status === "all" ? "selected" : ""}>全部</option>
          </select>
        </label>
      </div>
    </section>

    <section class="mistake-grid">
      ${filtered.length ? filtered.map(({ mistake, question }) => `
        <article class="card mistake-card">
          <div class="question-meta">
            <span class="tag">${escapeHtml(drillTypes[question.type])}</span>
            <span class="tag is-soft">${escapeHtml(question.level)}</span>
            <span class="tag is-soft">${mistake.status === "mastered" ? "已掌握" : "未掌握"}</span>
          </div>
          <h3>${escapeHtml(question.prompt)}</h3>
          <div class="mistake-detail">
            <strong>你的错误答案</strong>
            <p>${mistake.wrongAnswers?.length ? mistake.wrongAnswers.map(escapeHtml).join(" / ") : "旧记录未保存错误答案"}</p>
          </div>
          <div class="mistake-detail">
            <strong>正确答案</strong>
            <p>${escapeHtml(question.answer)}</p>
          </div>
          <p class="muted">${escapeHtml(question.explanation)}</p>
          <p class="muted">最近出错：${formatDate(mistake.lastMistakeAt)}</p>
          <div class="tag-row">
            ${question.tags.map((tag) => `<span class="tag is-soft">${escapeHtml(tag)}</span>`).join("")}
          </div>
          <div class="button-row">
            <button class="primary-button" data-practice-question="${escapeAttribute(question.id)}">重新练习</button>
            ${mistake.status === "mastered"
              ? `<button class="ghost-button" data-restore-mistake="${escapeAttribute(question.id)}">恢复错题</button>`
              : `<button class="ghost-button" data-master-mistake="${escapeAttribute(question.id)}">标记掌握</button>`}
          </div>
        </article>
      `).join("") : `
        <div class="panel placeholder">
          <div>
            <p class="eyebrow">Clear Queue</p>
            <h2>当前筛选下没有错题</h2>
            <p class="muted">去训练中心做几题，答错的题会自动出现在这里。</p>
          </div>
        </div>
      `}
    </section>
  `;

  app.querySelectorAll("[data-mistake-filter]").forEach((select) => {
    select.addEventListener("change", () => {
      filters = {
        ...filters,
        [select.dataset.mistakeFilter]: select.value
      };
      renderMistakes({ app, state, setState, data, openTrainingQuestion });
    });
  });

  app.querySelectorAll("[data-practice-question]").forEach((button) => {
    button.addEventListener("click", () => openTrainingQuestion(button.dataset.practiceQuestion));
  });

  app.querySelectorAll("[data-master-mistake], [data-restore-mistake]").forEach((button) => {
    button.addEventListener("click", () => {
      const questionId = button.dataset.masterMistake || button.dataset.restoreMistake;
      const status = button.dataset.masterMistake ? "mastered" : "unresolved";
      filters = {
        ...filters,
        status
      };
      setState((current) => {
        const wasUnresolved = current.savedMistakes.some((mistake) => (
          mistake.questionId === questionId && mistake.status !== "mastered"
        ));
        const savedMistakes = current.savedMistakes.map((mistake) => (
          mistake.questionId === questionId ? { ...mistake, status } : mistake
        ));
        let next = {
          ...current,
          savedMistakes
        };

        if (status === "mastered" && wasUnresolved) {
          next = awardXp(next, "mistake-mastered", 20, "掌握一道错题");
          if (savedMistakes.length && savedMistakes.every((mistake) => mistake.status === "mastered")) {
            next = awardBadge(next, BADGES.MISTAKE_CLEAR);
          }
        }

        return next;
      });
    });
  });
}
