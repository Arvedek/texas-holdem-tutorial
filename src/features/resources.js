import { escapeHtml } from "../lib/sanitize.js";

let filters = {
  type: "全部",
  level: "全部",
  tag: "全部"
};

function unique(values) {
  return ["全部", ...Array.from(new Set(values)).sort((a, b) => a.localeCompare(b, "zh-CN"))];
}

function selectHtml(name, label, options, value) {
  return `
    <label>${escapeHtml(label)}
      <select name="${name}" data-resource-filter>
        ${options.map((option) => `<option value="${escapeHtml(option)}" ${option === value ? "selected" : ""}>${escapeHtml(option)}</option>`).join("")}
      </select>
    </label>
  `;
}

function renderQuickReference(cards = []) {
  if (!cards.length) {
    return "";
  }

  return `
    <section class="panel quick-reference-panel">
      <div class="section-heading">
        <div>
          <p class="eyebrow">Quick Reference</p>
          <h2>新手速查手册</h2>
          <p class="muted">打牌、做题或复盘卡住时先看这里：只放最容易忘、最常用、最影响决策的牌桌基础。</p>
        </div>
      </div>
      <div class="quick-reference-grid">
        ${cards.map((card) => `
          <article class="quick-reference-card" data-quick-reference-card="${escapeHtml(card.id)}">
            <h3>${escapeHtml(card.title)}</h3>
            <p>${escapeHtml(card.whenToUse)}</p>
            <div class="quick-reference-list">
              ${card.items.map((item) => `
                <div>
                  <strong>${escapeHtml(item.label)}</strong>
                  <span>${escapeHtml(item.detail)}</span>
                </div>
              `).join("")}
            </div>
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

export function renderResources({ app, data }) {
  const types = unique(data.resources.map((resource) => resource.type));
  const levels = unique(data.resources.map((resource) => resource.level));
  const tags = unique(data.resources.flatMap((resource) => resource.tags));
  const filtered = data.resources.filter((resource) => {
    const typeOk = filters.type === "全部" || resource.type === filters.type;
    const levelOk = filters.level === "全部" || resource.level === filters.level;
    const tagOk = filters.tag === "全部" || resource.tags.includes(filters.tag);
    return typeOk && levelOk && tagOk;
  });

  app.innerHTML = `
    ${renderQuickReference(data.quickReferenceCards)}

    <section class="panel section-intro">
      <div>
        <p class="eyebrow">Resource Library</p>
        <h2>教材、工具和课程索引</h2>
        <p class="muted">这里保存的是学习路线图，不复制课程正文。按阶段和主题过滤，找到下一份最该看的材料。</p>
      </div>
      <div class="resource-filters">
        ${selectHtml("type", "资源类型", types, filters.type)}
        ${selectHtml("level", "适用阶段", levels, filters.level)}
        ${selectHtml("tag", "主题标签", tags, filters.tag)}
      </div>
    </section>

    <section class="resource-grid">
      ${filtered.map((resource) => `
        <article class="card resource-card">
          <div class="section-heading">
            <div>
              <span class="tag">${escapeHtml(resource.type)}</span>
              <span class="tag is-soft">${escapeHtml(resource.level)}</span>
            </div>
          </div>
          <h3>${escapeHtml(resource.name)}</h3>
          <p>${escapeHtml(resource.description)}</p>
          <div class="resource-note">
            <strong>为什么有用</strong>
            <p>${escapeHtml(resource.value)}</p>
          </div>
          <div class="resource-note">
            <strong>建议用法</strong>
            <p>${escapeHtml(resource.suggestedUse)}</p>
          </div>
          <div class="tag-row">${resource.tags.map((tag) => `<span class="tag is-soft">${escapeHtml(tag)}</span>`).join("")}</div>
          <a class="external-link" href="${escapeHtml(resource.url)}" target="_blank" rel="noreferrer">打开资源</a>
        </article>
      `).join("")}
      ${filtered.length ? "" : `<div class="panel"><p class="muted">没有匹配资源，试试放宽筛选。</p></div>`}
    </section>
  `;

  app.querySelectorAll("[data-resource-filter]").forEach((select) => {
    select.addEventListener("change", () => {
      filters = {
        ...filters,
        [select.name]: select.value
      };
      renderResources({ app, data });
    });
  });
}
