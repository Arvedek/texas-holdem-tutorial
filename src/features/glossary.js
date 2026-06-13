import { escapeHtml } from "../lib/sanitize.js";

let search = "";
let category = "全部";

function categories(terms) {
  return ["全部", ...Array.from(new Set(terms.map((term) => term.category))).sort((a, b) => a.localeCompare(b, "zh-CN"))];
}

export function renderGlossary({ app, data }) {
  const terms = data.glossaryTerms || [];
  const query = search.trim().toLowerCase();
  const filtered = terms.filter((item) => {
    const categoryOk = category === "全部" || item.category === category;
    const searchOk = !query
      || item.term.toLowerCase().includes(query)
      || item.simple.toLowerCase().includes(query)
      || item.example.toLowerCase().includes(query);
    return categoryOk && searchOk;
  });

  app.innerHTML = `
    <section class="panel section-intro">
      <div>
        <p class="eyebrow">Glossary</p>
        <h2>新人术语表</h2>
        <p class="muted">把常见黑话翻成牌桌语言。看课、做题、复盘时卡住，就先来这里查一句。</p>
      </div>
      <div class="tool-filters">
        <label>搜索
          <input data-glossary-search type="search" value="${escapeHtml(search)}" placeholder="范围 / SPR / c-bet">
        </label>
        <label>分类
          <select data-glossary-category>
            ${categories(terms).map((item) => `<option value="${escapeHtml(item)}" ${item === category ? "selected" : ""}>${escapeHtml(item)}</option>`).join("")}
          </select>
        </label>
      </div>
    </section>

    <section class="glossary-grid">
      ${filtered.map((item) => `
        <article class="card term-card">
          <span class="tag">${escapeHtml(item.category)}</span>
          <h3>${escapeHtml(item.term)}</h3>
          <p>${escapeHtml(item.simple)}</p>
          <div class="resource-note">
            <strong>例子</strong>
            <p>${escapeHtml(item.example)}</p>
          </div>
        </article>
      `).join("") || `<div class="panel"><p class="muted">没有匹配术语，换个关键词试试。</p></div>`}
    </section>
  `;

  app.querySelector("[data-glossary-search]").addEventListener("input", (event) => {
    search = event.target.value;
    renderGlossary({ app, data });
  });

  app.querySelector("[data-glossary-category]").addEventListener("change", (event) => {
    category = event.target.value;
    renderGlossary({ app, data });
  });
}
