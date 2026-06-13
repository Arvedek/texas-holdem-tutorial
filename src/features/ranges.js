import { escapeHtml } from "../lib/sanitize.js";

function chips(items) {
  return (items || []).map((item) => `<span class="range-chip">${escapeHtml(item)}</span>`).join("");
}

export function renderRanges({ app, data }) {
  const ranges = data.preflopRanges || [];

  app.innerHTML = `
    <section class="panel section-intro">
      <div>
        <p class="eyebrow">Preflop Ranges</p>
        <h2>6-max 翻前范围速查</h2>
        <p class="muted">这是新人默认表，不是死规则。先用它减少翻前大错，再根据桌况和对手慢慢调整。</p>
      </div>
    </section>

    <section class="range-grid">
      ${ranges.map((item) => `
        <article class="card range-card">
          <div class="range-head">
            <strong>${escapeHtml(item.position)}</strong>
            <span>${escapeHtml(item.name)}</span>
          </div>
          <p>${escapeHtml(item.beginnerNote)}</p>
          <div class="range-block">
            <h4>${item.position === "BB" ? "可防守方向" : "无人入池可开池"}</h4>
            <div class="range-chip-row">${chips(item.openRaise || item.defend)}</div>
          </div>
          <div class="range-block">
            <h4>新人少碰</h4>
            <div class="range-chip-row is-warning">${chips(item.avoid)}</div>
          </div>
          <p class="encouragement">${escapeHtml(item.habit)}</p>
        </article>
      `).join("")}
    </section>
  `;
}
