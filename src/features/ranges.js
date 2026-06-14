import { escapeAttribute, escapeHtml } from "../lib/sanitize.js";

let selectedTableSize = "6-max";

function chips(items) {
  return (items || []).map((item) => `<span class="range-chip">${escapeHtml(item)}</span>`).join("");
}

export function renderRanges({ app, data }) {
  const ranges = data.preflopRanges || [];
  const tableSizes = [...new Set(ranges.map((item) => item.tableSize))];
  const activeTableSize = tableSizes.includes(selectedTableSize) ? selectedTableSize : tableSizes[0];
  selectedTableSize = activeTableSize;
  const visibleRanges = ranges.filter((item) => item.tableSize === activeTableSize);
  const positionCount = visibleRanges.length;

  app.innerHTML = `
    <section class="panel section-intro">
      <div>
        <p class="eyebrow">Preflop Ranges</p>
        <h2>常见桌型翻前范围速查</h2>
        <p class="muted">支持 4-max、5-max、6-max、7-max、8-max 和 9-max。人数越多，早位后面等待行动的人越多，默认范围越要收紧；人数越少，盲注压力越高，后位争夺越频繁。</p>
      </div>
      <div class="range-table-switch" role="tablist" aria-label="选择桌型">
        ${tableSizes.map((tableSize) => `
          <button
            class="chip-button ${tableSize === activeTableSize ? "is-active" : ""}"
            data-range-table-size="${escapeAttribute(tableSize)}"
            role="tab"
            aria-selected="${tableSize === activeTableSize ? "true" : "false"}"
          >
            ${escapeHtml(tableSize)}
          </button>
        `).join("")}
      </div>
      <p class="muted">当前显示 ${escapeHtml(activeTableSize)}，共 ${positionCount} 个位置。这里是新人默认参考，不是死表；先减少翻前大错，再根据桌况、抽水和对手调整。</p>
    </section>

    <section class="range-grid">
      ${visibleRanges.map((item) => `
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

  app.querySelectorAll("[data-range-table-size]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedTableSize = button.dataset.rangeTableSize;
      renderRanges({ app, data });
    });
  });
}
