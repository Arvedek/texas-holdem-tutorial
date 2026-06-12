export function renderDashboard({ app, state, data, navigate }) {
  const { lessons, drills } = data;
  const completed = new Set(state.completedLessons);
  const nextLesson = lessons.find((lesson) => !completed.has(lesson.id)) || lessons[lessons.length - 1];
  const attempts = state.drillAttempts;
  const correct = attempts.filter((attempt) => attempt.correct).length;
  const accuracy = attempts.length ? Math.round((correct / attempts.length) * 100) : 0;
  const recentReviews = [...state.handReviews].slice(-3).reverse();
  const suggestedDrills = drills.filter((drill) => nextLesson.drillTags.some((tag) => drill.tags.includes(tag))).slice(0, 4);
  const completionRate = Math.round((completed.size / lessons.length) * 100);

  app.innerHTML = `
    <div class="dashboard-grid">
      <section class="panel hero-panel">
        <div>
          <p class="eyebrow">下一步</p>
          <h2>${nextLesson.title}</h2>
          <p>${nextLesson.summary}</p>
          <div class="button-row">
            <button class="primary-button" data-action="go-learning">继续学习</button>
            <button class="ghost-button" data-action="go-training">做相关训练</button>
          </div>
        </div>
        <div class="progress-ring" style="--progress:${completionRate}%" aria-label="学习进度">
          <strong>${completionRate}%</strong>
          <span>学习进度</span>
        </div>
      </section>

      <section class="grid three">
        <div class="metric">
          <span class="muted">已完成课程</span>
          <strong>${completed.size}/${lessons.length}</strong>
        </div>
        <div class="metric">
          <span class="muted">训练准确率</span>
          <strong>${accuracy}%</strong>
        </div>
        <div class="metric">
          <span class="muted">已保存复盘</span>
          <strong>${state.handReviews.length}</strong>
        </div>
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
                <strong>${drill.prompt}</strong>
                <span>${drill.level} · ${drill.type}</span>
              </div>
            `).join("")}
          </div>
        </div>

        <div class="panel">
          <div class="section-heading">
            <div>
              <p class="eyebrow">最近复盘</p>
              <h3>把疑惑变成错题本</h3>
            </div>
            <button class="ghost-button" data-action="go-review">写复盘</button>
          </div>
          <div class="compact-list">
            ${recentReviews.length ? recentReviews.map((review) => `
              <div class="compact-item">
                <strong>${review.heroHand || "未命名手牌"} · ${review.position || "未知位置"}</strong>
                <span>${review.analysis?.decisionLabel || "待观察"} · ${new Date(review.createdAt).toLocaleDateString("zh-CN")}</span>
              </div>
            `).join("") : `<p class="muted">还没有保存复盘。下一次犹豫的牌，别只记输赢，记决策。</p>`}
          </div>
        </div>
      </section>

      <section class="panel quick-actions">
        <button class="quick-action" data-action="go-learning">
          <strong>学习路径</strong>
          <span>按阶段补短板</span>
        </button>
        <button class="quick-action" data-action="go-training">
          <strong>训练中心</strong>
          <span>用题目校准直觉</span>
        </button>
        <button class="quick-action" data-action="go-review">
          <strong>手牌复盘</strong>
          <span>记录关键决策</span>
        </button>
        <button class="quick-action" data-action="go-resources">
          <strong>资源库</strong>
          <span>找下一份教材</span>
        </button>
      </section>
    </div>
  `;

  app.querySelectorAll("[data-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const route = button.dataset.action.replace("go-", "");
      navigate(route);
    });
  });
}
