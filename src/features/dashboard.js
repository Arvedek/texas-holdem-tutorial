import { escapeHtml } from "../lib/sanitize.js";

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

function getRecommendation({ unresolvedMistakes, attempts, reviews, nextLesson }) {
  if (unresolvedMistakes.length) {
    return {
      title: "先清理错题本",
      body: `你还有 ${unresolvedMistakes.length} 道未掌握错题。先复盘错误，比继续刷题更划算。`,
      action: "go-mistakes",
      cta: "打开错题本"
    };
  }

  if (!attempts.length) {
    return {
      title: "先做一组训练",
      body: "你还没有训练记录。先做几题，系统才能知道你的薄弱点。",
      action: "go-training",
      cta: "开始训练"
    };
  }

  if (!reviews.length) {
    return {
      title: "保存第一条复盘",
      body: "训练能校准直觉，复盘才能找到真实牌局里的漏洞。",
      action: "go-review",
      cta: "写复盘"
    };
  }

  return {
    title: "继续下一课",
    body: `下一节建议学习：${nextLesson.title}。学完后做对应训练题巩固。`,
    action: "go-learning",
    cta: "继续学习"
  };
}

export function renderDashboard({ app, state, data, navigate }) {
  const { lessons, drills } = data;
  const completed = new Set(state.completedLessons);
  const nextLesson = lessons.find((lesson) => !completed.has(lesson.id)) || lessons[lessons.length - 1];
  const attempts = state.drillAttempts;
  const accuracy = getAccuracy(attempts);
  const recentAccuracy = getAccuracy(attempts.slice(-10));
  const unresolvedMistakes = state.savedMistakes.filter((mistake) => mistake.status !== "mastered");
  const recentReviews = [...state.handReviews].slice(-3).reverse();
  const suggestedDrills = drills.filter((drill) => nextLesson.drillTags.some((tag) => drill.tags.includes(tag))).slice(0, 4);
  const completionRate = Math.round((completed.size / lessons.length) * 100);
  const topErrorTypes = getTopErrorTypes(state.handReviews);
  const recommendation = getRecommendation({
    unresolvedMistakes,
    attempts,
    reviews: state.handReviews,
    nextLesson
  });

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
}
