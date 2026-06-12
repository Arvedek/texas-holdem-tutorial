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
    <label>${label}
      <select name="${name}" data-resource-filter>
        ${options.map((option) => `<option value="${option}" ${option === value ? "selected" : ""}>${option}</option>`).join("")}
      </select>
    </label>
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
              <span class="tag">${resource.type}</span>
              <span class="tag is-soft">${resource.level}</span>
            </div>
          </div>
          <h3>${resource.name}</h3>
          <p>${resource.description}</p>
          <div class="resource-note">
            <strong>为什么有用</strong>
            <p>${resource.value}</p>
          </div>
          <div class="resource-note">
            <strong>建议用法</strong>
            <p>${resource.suggestedUse}</p>
          </div>
          <div class="tag-row">${resource.tags.map((tag) => `<span class="tag is-soft">${tag}</span>`).join("")}</div>
          <a class="external-link" href="${resource.url}" target="_blank" rel="noreferrer">打开资源</a>
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
