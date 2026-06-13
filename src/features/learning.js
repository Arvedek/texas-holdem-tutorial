import { BADGES, awardBadge, awardXp, markDailyActivity, maybeAwardDailyBonus } from "../lib/rewards.js";
import { escapeAttribute, escapeHtml } from "../lib/sanitize.js";

let quizSelections = {};

function list(items) {
  return items.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
}

function beginnerPanel(lesson, enabled) {
  if (!enabled) {
    return "";
  }

  return `
    <details class="beginner-panel" open>
      <summary>
        <span>新手拆解</span>
        ${lesson.beginnerSafe ? `<strong>新手安全路径</strong>` : ""}
      </summary>
      <div class="beginner-grid">
        <div>
          <h4>白话版</h4>
          <p>${escapeHtml(lesson.plainLanguage)}</p>
        </div>
        <div>
          <h4>牌桌例子</h4>
          <p>${escapeHtml(lesson.tableExample)}</p>
        </div>
        <div>
          <h4>为什么重要</h4>
          <p>${escapeHtml(lesson.whyItMatters)}</p>
        </div>
      </div>
      <div class="beginner-checklist">
        <h4>这一课先做到</h4>
        <ul>${list(lesson.miniChecklist)}</ul>
      </div>
      <p class="encouragement">${escapeHtml(lesson.encouragement)}</p>
    </details>
  `;
}

function renderExamples(lesson) {
  return (lesson.examples || []).map((example) => `
    <div>
      <h5>${escapeHtml(example.title)}</h5>
      <p>${escapeHtml(example.scenario)}</p>
      <p><strong>要点：</strong>${escapeHtml(example.takeaway)}</p>
    </div>
  `).join("");
}

function renderDecisionFlow(lesson) {
  return `<ol>${(lesson.decisionFlow || []).map((step) => `<li>${escapeHtml(step)}</li>`).join("")}</ol>`;
}

function renderMistakeDetails(lesson) {
  return (lesson.mistakeDetails || []).map((item) => `
    <div>
      <h5>${escapeHtml(item.mistake)}</h5>
      <p>${escapeHtml(item.whyItHurts)}</p>
    </div>
  `).join("");
}

function renderQuiz(lesson) {
  return (lesson.quiz || []).map((item, questionIndex) => {
    const key = `${lesson.id}:${questionIndex}`;
    const selected = quizSelections[key];
    const isCorrect = selected === item.answer;

    return `
      <div class="question-panel">
        <h5>${escapeHtml(item.question)}</h5>
        <div class="choice-grid">
          ${item.options.map((option) => `
            <button
              class="choice-button ${selected === option ? "is-selected" : ""}"
              data-quiz-lesson="${escapeAttribute(lesson.id)}"
              data-quiz-index="${escapeAttribute(questionIndex)}"
              data-quiz-answer="${escapeAttribute(option)}"
            >
              ${escapeHtml(option)}
            </button>
          `).join("")}
        </div>
        ${selected ? `
          <div class="answer-panel ${isCorrect ? "" : "is-wrong"}">
            <strong>${isCorrect ? "回答正确" : "需要复盘"}：${escapeHtml(item.answer)}</strong>
            <p>${escapeHtml(item.explanation)}</p>
          </div>
        ` : ""}
      </div>
    `;
  }).join("");
}

function renderNextSteps(lesson) {
  return (lesson.nextSteps || []).map((step) => `
    <div>
      <h5>${escapeHtml(step.label)}</h5>
      <p>${escapeHtml(step.note)}</p>
      <button class="primary-button" data-next-route="${escapeAttribute(step.route)}">${escapeHtml(step.label)}</button>
    </div>
  `).join("");
}

function hasQuizSelection(lesson) {
  return (lesson.quiz || []).some((_, questionIndex) => {
    const key = `${lesson.id}:${questionIndex}`;
    return Object.prototype.hasOwnProperty.call(quizSelections, key);
  });
}

function textbookPanel(lesson, completed) {
  const panelOpen = !completed || hasQuizSelection(lesson);

  return `
    <details class="textbook-panel" ${panelOpen ? "open" : ""}>
      <summary>
        <span>展开学习</span>
        <strong>${escapeHtml((lesson.textbook || []).length)} 个核心段落</strong>
      </summary>
      <div class="beginner-checklist">
        <h4>学习目标</h4>
        <ul>${list(lesson.goals || [])}</ul>
      </div>
      <div class="lesson-columns">
        ${(lesson.textbook || []).map((section) => `
          <div>
            <h4>${escapeHtml(section.heading)}</h4>
            <p>${escapeHtml(section.body)}</p>
          </div>
        `).join("")}
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
        <h4>迷你测验</h4>
        ${renderQuiz(lesson)}
      </div>
      <div class="beginner-checklist">
        <h4>下一步</h4>
        ${renderNextSteps(lesson)}
      </div>
    </details>
  `;
}

export function renderLearning({ app, state, setState, data, navigate }) {
  const completed = new Set(state.completedLessons);
  const completionRate = Math.round((completed.size / data.lessons.length) * 100);

  app.innerHTML = `
    <section class="panel section-intro">
      <div>
        <p class="eyebrow">Learning Path</p>
        <h2>从规则到复盘的六阶段路线</h2>
        <p class="muted">每个阶段都先建立一个明确能力，再用训练题和复盘去巩固。</p>
      </div>
      <div class="progress-bar" aria-label="学习完成度">
        <span style="width:${completionRate}%"></span>
      </div>
    </section>

    <section class="lesson-list">
      ${data.lessons.map((lesson) => {
        const done = completed.has(lesson.id);
        return `
          <article class="lesson-card ${done ? "is-complete" : ""}">
            <div class="lesson-stage">阶段 ${lesson.stage}</div>
            <div class="lesson-body">
              <div class="section-heading">
                <div>
                  <h3>${escapeHtml(lesson.title)}</h3>
                  <p>${escapeHtml(lesson.summary)}</p>
                </div>
                <button class="${done ? "ghost-button" : "primary-button"}" data-lesson-toggle="${escapeAttribute(lesson.id)}">
                  ${done ? "标记未完成" : "标记完成"}
                </button>
              </div>

              ${beginnerPanel(lesson, state.beginnerMode)}
              ${textbookPanel(lesson, done)}

              <div class="lesson-columns">
                <div>
                  <h4>关键概念</h4>
                  <ul>${list(lesson.concepts)}</ul>
                </div>
                <div>
                  <h4>常见错误</h4>
                  <ul>${list(lesson.mistakes)}</ul>
                </div>
                <div>
                  <h4>练习任务</h4>
                  <p>${escapeHtml(lesson.task)}</p>
                </div>
              </div>

              <div class="tag-row">
                ${lesson.drillTags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}
                ${lesson.resourceTags.map((tag) => `<span class="tag is-soft">${escapeHtml(tag)}</span>`).join("")}
              </div>
            </div>
          </article>
        `;
      }).join("")}
    </section>
  `;

  app.querySelectorAll("[data-lesson-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      const lessonId = button.dataset.lessonToggle;
      setState((current) => {
        const currentCompleted = new Set(current.completedLessons);
        if (currentCompleted.has(lessonId)) {
          currentCompleted.delete(lessonId);
          return {
            ...current,
            completedLessons: [...currentCompleted]
          };
        }

        currentCompleted.add(lessonId);
        const lesson = data.lessons.find((item) => item.id === lessonId);
        const lessonRewardType = `lesson:${lessonId}`;
        const alreadyRewarded = current.xpEvents?.some((event) => event.type === lessonRewardType);
        let next = {
          ...current,
          completedLessons: [...currentCompleted]
        };

        if (!alreadyRewarded && lesson) {
          next = awardXp(next, lessonRewardType, 30, `完成课程：${lesson.title}`);
          next = awardBadge(next, BADGES.FIRST_LESSON);
        }

        next = markDailyActivity(next, "lesson", true);
        return maybeAwardDailyBonus(next);
      });
    });
  });

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
}
