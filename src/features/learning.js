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
      <p><strong>分析：</strong>${escapeHtml(example.analysis)}</p>
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
      <p><strong>改进习惯：</strong>${escapeHtml(item.betterHabit)}</p>
    </div>
  `).join("");
}

function renderPracticeTasks(lesson) {
  return (lesson.practiceTasks || []).map((task) => `
    <div>
      <h5>${escapeHtml(task.title)}</h5>
      <p>${escapeHtml(task.body)}</p>
    </div>
  `).join("");
}

function renderReferenceTables(lesson) {
  return (lesson.referenceTables || []).map((table) => `
    <div class="reference-table-wrap">
      <h5>${escapeHtml(table.title)}</h5>
      <table class="reference-table">
        <thead>
          <tr>${(table.columns || []).map((column) => `<th>${escapeHtml(column)}</th>`).join("")}</tr>
        </thead>
        <tbody>
          ${(table.rows || []).map((row) => `
            <tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `).join("");
}

function renderRelatedTerms(lesson, glossaryTerms) {
  const termsById = new Map((glossaryTerms || []).map((term) => [term.id, term]));
  return (lesson.relatedTerms || []).map((termId) => {
    const term = termsById.get(termId);
    const label = term ? term.term : termId;
    return `
      <button class="tag is-soft tag-button" data-lesson-term-search="${escapeAttribute(label)}">
        ${escapeHtml(label)}
      </button>
    `;
  }).join("");
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
      <button
        class="primary-button"
        data-next-route="${escapeAttribute(step.route)}"
        ${step.chapterId ? `data-next-chapter="${escapeAttribute(step.chapterId)}"` : ""}
      >
        ${escapeHtml(step.label)}
      </button>
    </div>
  `).join("");
}

function hasQuizSelection(lesson) {
  return (lesson.quiz || []).some((_, questionIndex) => {
    const key = `${lesson.id}:${questionIndex}`;
    return Object.prototype.hasOwnProperty.call(quizSelections, key);
  });
}

function renderRoadmap() {
  const sevenDayPlan = [
    ["第 1 天", "读第 1-2 章：记号、BB 单位、规则和牌型，只要求能准确读牌。"],
    ["第 2 天", "读第 3-4 章：桌型、位置、起手牌分类，完成位置表和手牌缩写练习。"],
    ["第 3 天", "读第 5-7 章：open、limp、3-bet、盲位防守，先减少翻前大错。"],
    ["第 4 天", "读第 8-10 章：牌面结构、相对牌力、下注目的，学会说出每次下注理由。"],
    ["第 5 天", "读第 11-13 章：c-bet、多人底池、权益赔率，把单挑和多人底池区分开。"],
    ["第 6 天", "读第 14-16 章：SPR、转河计划、对手类型，开始写一手完整复盘。"],
    ["第 7 天", "读第 17-19 章：GTO 基础、资金心态、学习流程，建立下一周训练清单。"]
  ];
  const thirtyDayPlan = [
    ["第 1 周", "每天一到三章，目标是看懂牌桌语言和默认翻前纪律。"],
    ["第 2 周", "每天做训练题并复习错题，重点是牌面结构、下注目的和赔率。"],
    ["第 3 周", "每两天复盘一手牌，重点看 SPR、转河计划、对手类型和多人底池。"],
    ["第 4 周", "用 GTO 概念校准基准，用 exploit、资金管理和学习例行流程稳定执行。"]
  ];

  const renderItems = (items) => items.map(([label, body]) => `
    <li>
      <strong>${escapeHtml(label)}</strong>
      <span>${escapeHtml(body)}</span>
    </li>
  `).join("");

  return `
    <section class="panel learning-roadmap">
      <div class="section-heading">
        <div>
          <p class="eyebrow">Study Routes</p>
          <h3>7 天新手路线 / 30 天进阶路线</h3>
          <p class="muted">先按路线拿到稳定正反馈，再回到章节目录查漏补缺。每天只追一个小目标：读懂、做题、复盘或修正一个错误。</p>
        </div>
        <span class="tag is-soft">从会看牌到会复盘</span>
      </div>
      <div class="lesson-columns">
        <div>
          <h4>7 天新手路线</h4>
          <ul class="check-list">${renderItems(sevenDayPlan)}</ul>
        </div>
        <div>
          <h4>30 天进阶路线</h4>
          <ul class="check-list">${renderItems(thirtyDayPlan)}</ul>
        </div>
        <div>
          <h4>每章通关条件</h4>
          <ul class="check-list">
            <li><strong>读懂</strong><span>能用自己的话解释本章 3 个学习目标。</span></li>
            <li><strong>答题</strong><span>完成迷你测验，并把错题放进错题本复习。</span></li>
            <li><strong>应用</strong><span>至少做 1 个练习任务或保存 1 条相关复盘。</span></li>
          </ul>
        </div>
      </div>
    </section>
  `;
}

function renderChapterDirectory(lessons, completed) {
  const currentLesson = lessons.find((lesson) => !completed.has(lesson.id)) || lessons[lessons.length - 1];
  const completedCount = lessons.filter((lesson) => completed.has(lesson.id)).length;

  return `
    <section class="panel chapter-directory">
      <div class="section-heading">
        <div>
          <p class="eyebrow">Chapter Map</p>
          <h3>章节目录</h3>
          <p class="muted">已完成 ${completedCount}/${lessons.length} · 当前建议：第 ${escapeHtml(currentLesson.stage)} 章 ${escapeHtml(currentLesson.title)}</p>
        </div>
        <span class="tag ${completedCount === lessons.length ? "" : "is-soft"}">${completedCount === lessons.length ? "全部完成" : "当前建议"}</span>
      </div>
      <div class="chapter-directory-grid">
        ${lessons.map((lesson) => {
          const isComplete = completed.has(lesson.id);
          const isCurrent = lesson.id === currentLesson.id;
          return `
            <button
              class="chapter-jump ${isComplete ? "is-complete" : ""} ${isCurrent ? "is-current" : ""}"
              data-lesson-jump="${escapeAttribute(lesson.id)}"
            >
              <span>第 ${escapeHtml(lesson.stage)} 章</span>
              <strong>${escapeHtml(lesson.title)}</strong>
              <small>${isComplete ? "已完成" : isCurrent ? "当前建议" : lesson.difficulty}</small>
            </button>
          `;
        }).join("")}
      </div>
    </section>
  `;
}

function textbookPanel(lesson, completed, glossaryTerms) {
  const panelOpen = !completed || hasQuizSelection(lesson);

  return `
    <details class="textbook-panel" ${panelOpen ? "open" : ""}>
      <summary>
        <span>展开第 ${escapeHtml(lesson.stage)} 章教材</span>
        <strong>${escapeHtml(lesson.estimatedMinutes)} 分钟 · ${escapeHtml((lesson.textbook || []).length)} 个核心段落</strong>
      </summary>
      <div class="chapter-meta">
        <span>${escapeHtml(lesson.subtitle)}</span>
        <span>${escapeHtml(lesson.difficulty)}</span>
        <span>${lesson.beginnerSafe ? "新手安全" : "进阶章节"}</span>
      </div>
      <div class="beginner-checklist">
        <h4>学习目标</h4>
        <ul>${list(lesson.goals || [])}</ul>
      </div>
      <div class="lesson-columns">
        ${(lesson.textbook || []).map((section) => `
          <div>
            <h4>${escapeHtml(section.heading)}</h4>
            <p>${escapeHtml(section.body)}</p>
            <p class="key-takeaway"><strong>记住：</strong>${escapeHtml(section.keyTakeaway)}</p>
          </div>
        `).join("")}
      </div>
      ${(lesson.referenceTables || []).length ? `
        <div class="beginner-checklist">
          <h4>速查表</h4>
          ${renderReferenceTables(lesson)}
        </div>
      ` : ""}
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
        <h4>练习任务</h4>
        ${renderPracticeTasks(lesson)}
      </div>
      <div class="beginner-checklist">
        <h4>相关术语</h4>
        <div class="tag-row">${renderRelatedTerms(lesson, glossaryTerms)}</div>
      </div>
      <div class="beginner-checklist">
        <h4>下一步</h4>
        ${renderNextSteps(lesson)}
      </div>
    </details>
  `;
}

export function renderLearning({ app, state, setState, data, navigate, openGlossarySearch }) {
  const completed = new Set(state.completedLessons);
  const completionRate = Math.round((completed.size / data.lessons.length) * 100);

  app.innerHTML = `
    <section class="panel section-intro">
      <div>
        <p class="eyebrow">Learning Path</p>
        <h2>从零开始的完整 ${data.lessons.length} 章学习路径</h2>
        <p class="muted">按章节学习术语、规则、翻前、翻后、数学、GTO 基础、资金管理和复盘流程；每章都有目标、例子、测验和下一步。</p>
      </div>
      <div class="progress-bar" aria-label="学习完成度">
        <span style="width:${completionRate}%"></span>
      </div>
    </section>

    ${renderRoadmap()}

    ${renderChapterDirectory(data.lessons, completed)}

    <section class="lesson-list">
      ${data.lessons.map((lesson) => {
        const done = completed.has(lesson.id);
        return `
          <article class="lesson-card ${done ? "is-complete" : ""}" data-lesson-id="${escapeAttribute(lesson.id)}">
            <div class="lesson-stage">第 ${lesson.stage} 章</div>
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
              ${textbookPanel(lesson, done, data.glossaryTerms)}

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
      renderLearning({ app, state, setState, data, navigate, openGlossarySearch });
    });
  });

  app.querySelectorAll("[data-lesson-jump]").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelector(`[data-lesson-id="${CSS.escape(button.dataset.lessonJump)}"]`)?.scrollIntoView({ block: "start", behavior: "smooth" });
    });
  });

  app.querySelectorAll("[data-lesson-term-search]").forEach((button) => {
    button.addEventListener("click", () => {
      if (openGlossarySearch) {
        openGlossarySearch(button.dataset.lessonTermSearch);
        return;
      }

      if (navigate) {
        navigate("glossary");
      }
    });
  });

  app.querySelectorAll("[data-next-route]").forEach((button) => {
    button.addEventListener("click", () => {
      if (navigate) {
        navigate(button.dataset.nextRoute);
        const chapterId = button.dataset.nextChapter;
        if (chapterId) {
          window.setTimeout(() => {
            document.querySelector(`[data-lesson-id="${CSS.escape(chapterId)}"]`)?.scrollIntoView({ block: "start", behavior: "smooth" });
          }, 0);
        }
      }
    });
  });
}
