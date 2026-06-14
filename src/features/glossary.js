import { searchContent } from "../lib/contentSearch.js";
import { escapeAttribute, escapeHtml } from "../lib/sanitize.js";

let search = "";
let category = "全部";
let difficulty = "全部";

function categories(terms) {
  return ["全部", ...Array.from(new Set(terms.map((term) => term.category))).sort((a, b) => a.localeCompare(b, "zh-CN"))];
}

function difficultyOptions() {
  return ["全部", "beginner", "intermediate", "advanced"];
}

function termLabel(termId, termsById) {
  return termsById.get(termId)?.term || termId;
}

export function setGlossarySearch(value) {
  search = String(value || "");
  category = "全部";
  difficulty = "全部";
}

export function renderGlossary({ app, data }) {
  const lessons = data.lessons || [];
  const terms = data.glossaryTerms || [];
  const termsById = new Map(terms.map((term) => [term.id, term]));
  const query = search.trim();
  const searchResults = searchContent(query, lessons, terms);
  const termCandidates = query ? searchResults.terms : terms;
  const filtered = termCandidates.filter((item) => {
    const categoryOk = category === "全部" || item.category === category;
    const difficultyOk = difficulty === "全部" || item.difficulty === difficulty;
    return categoryOk && difficultyOk;
  });
  const matchingChapters = query ? searchResults.chapters.slice(0, 8) : [];

  app.innerHTML = `
    <section class="panel section-intro">
      <div>
        <p class="eyebrow">Glossary</p>
        <h2>完整术语表与课程搜索</h2>
        <p class="muted">搜索中文、英文、缩写或黑话；结果会同时返回术语解释和相关教材章节。</p>
      </div>
      <div class="tool-filters">
        <label>搜索
          <input data-glossary-search type="search" value="${escapeAttribute(search)}" placeholder="SPR / limp / range advantage / MDF">
        </label>
        <label>分类
          <select data-glossary-category>
            ${categories(terms).map((item) => `<option value="${escapeAttribute(item)}" ${item === category ? "selected" : ""}>${escapeHtml(item)}</option>`).join("")}
          </select>
        </label>
        <label>难度
          <select data-glossary-difficulty>
            ${difficultyOptions().map((item) => `<option value="${escapeAttribute(item)}" ${item === difficulty ? "selected" : ""}>${escapeHtml(item)}</option>`).join("")}
          </select>
        </label>
      </div>
    </section>

    ${matchingChapters.length ? `
      <section class="panel">
        <div class="section-heading">
          <div>
            <p class="eyebrow">Curriculum Matches</p>
            <h3>相关章节</h3>
          </div>
        </div>
        <div class="chapter-result-list">
          ${matchingChapters.map((chapter) => `
            <article class="resource-note">
              <strong>第 ${escapeHtml(chapter.stage)} 章 · ${escapeHtml(chapter.title)}</strong>
              <p>${escapeHtml(chapter.summary)}</p>
              <div class="tag-row">
                ${(chapter.relatedTerms || []).slice(0, 8).map((termId) => `<span class="tag is-soft">${escapeHtml(termLabel(termId, termsById))}</span>`).join("")}
              </div>
            </article>
          `).join("")}
        </div>
      </section>
    ` : ""}

    <section class="glossary-grid">
      ${filtered.map((item) => `
        <article class="card term-card">
          <div class="term-card-header">
            <span class="tag">${escapeHtml(item.category)}</span>
            <span class="tag is-soft">${escapeHtml(item.difficulty)}</span>
          </div>
          <h3>${escapeHtml(item.term)}</h3>
          <p class="muted">${escapeHtml(item.english)}${item.abbreviation ? ` · ${escapeHtml(item.abbreviation)}` : ""}</p>
          ${(item.aliases || []).length ? `<div class="tag-row">${item.aliases.slice(0, 6).map((alias) => `<span class="tag is-soft">${escapeHtml(alias)}</span>`).join("")}</div>` : ""}
          <p>${escapeHtml(item.definition || item.simple)}</p>
          <div class="resource-note">
            <strong>白话解释</strong>
            <p>${escapeHtml(item.simple)}</p>
          </div>
          <div class="resource-note">
            <strong>牌桌例子</strong>
            <p>${escapeHtml(item.example)}</p>
          </div>
          <div class="resource-note">
            <strong>常见误解</strong>
            <p>${escapeHtml(item.misunderstanding)}</p>
          </div>
          ${(item.relatedTerms || []).length ? `
            <div class="related-term-row">
              ${(item.relatedTerms || []).slice(0, 8).map((termId) => `
                <button class="tag is-soft tag-button" data-term-search="${escapeAttribute(termLabel(termId, termsById))}">
                  ${escapeHtml(termLabel(termId, termsById))}
                </button>
              `).join("")}
            </div>
          ` : ""}
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

  app.querySelector("[data-glossary-difficulty]").addEventListener("change", (event) => {
    difficulty = event.target.value;
    renderGlossary({ app, data });
  });

  app.querySelectorAll("[data-term-search]").forEach((button) => {
    button.addEventListener("click", () => {
      search = button.dataset.termSearch;
      renderGlossary({ app, data });
    });
  });
}
