import { BADGES, awardBadge, awardXp, markDailyActivity, maybeAwardDailyBonus } from "../lib/rewards.js";
import { escapeHtml } from "../lib/sanitize.js";

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

export function renderLearning({ app, state, setState, data }) {
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
                <button class="${done ? "ghost-button" : "primary-button"}" data-lesson-toggle="${escapeHtml(lesson.id)}">
                  ${done ? "标记未完成" : "标记完成"}
                </button>
              </div>

              ${beginnerPanel(lesson, state.beginnerMode)}

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
}
