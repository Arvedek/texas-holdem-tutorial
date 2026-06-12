import { parseCards, hasDuplicateCards, formatCard } from "../lib/cards.js";
import { calculatePotOdds, calculateSpr, classifyStartingHand } from "../lib/pokerMath.js";
import { analyzeBoardTexture } from "../lib/boardTexture.js";
import { escapeHtml, escapeAttribute } from "../lib/sanitize.js";

const ERROR_TYPES = ["范围错误", "赔率错误", "下注尺度", "情绪问题", "价值下注", "诈唬选择", "防守频率"];

const STREET_LABELS = {
  overall: "整手牌",
  preflop: "翻前",
  flop: "翻牌",
  turn: "转牌",
  river: "河牌"
};

let formState = {
  gameType: "现金桌",
  tableFormat: "6-max",
  position: "BTN",
  effectiveStack: "300",
  heroHand: "As Ks",
  board: "Qs Js 2d",
  potSize: "100",
  betSize: "50",
  streetFocus: "flop",
  actionLine: "翻前 BTN 开池，BB 跟注；翻牌 BB check，Hero 面对听牌考虑下注。",
  opponentNotes: "默认未知对手",
  userNote: "检查下注尺度和听牌半诈唬频率。",
  errorTypes: ["下注尺度"]
};

let reviewFilters = {
  search: "",
  decisionLabel: "all",
  errorType: "all"
};

function percentage(value) {
  return value === null ? "信息不足" : `${Math.round(value * 100)}%`;
}

function numberLabel(value) {
  return value === null ? "信息不足" : value.toFixed(1);
}

function option(value, label, selectedValue) {
  return `<option value="${escapeAttribute(value)}" ${value === selectedValue ? "selected" : ""}>${escapeHtml(label)}</option>`;
}

function readForm(app) {
  const data = new FormData(app.querySelector("[data-review-form]"));
  formState = {
    ...Object.fromEntries(data.entries()),
    errorTypes: data.getAll("errorTypes")
  };
  return formState;
}

function analyze(form) {
  const errors = [];
  const heroParsed = parseCards(form.heroHand);
  const boardParsed = parseCards(form.board);
  const allCards = [...(heroParsed.cards || []), ...(boardParsed.cards || [])];

  if (!heroParsed.ok) errors.push(heroParsed.error);
  if (heroParsed.ok && heroParsed.cards.length !== 2) errors.push("手牌需要正好输入两张，例如 As Ks。");
  if (!boardParsed.ok) errors.push(boardParsed.error);
  if (allCards.length && hasDuplicateCards(allCards)) errors.push("检测到重复牌，请检查手牌和公共牌。");

  const potSize = Number(form.potSize);
  const betSize = Number(form.betSize);
  const stack = Number(form.effectiveStack);

  if (form.potSize && (!Number.isFinite(potSize) || potSize < 0)) errors.push("底池大小需要是非负数字。");
  if (form.betSize && (!Number.isFinite(betSize) || betSize < 0)) errors.push("下注/跟注金额需要是非负数字。");
  if (form.effectiveStack && (!Number.isFinite(stack) || stack < 0)) errors.push("有效后手需要是非负数字。");

  const potOdds = calculatePotOdds(betSize, potSize);
  const spr = calculateSpr(stack, potSize);
  const texture = boardParsed.ok ? analyzeBoardTexture(boardParsed.cards) : analyzeBoardTexture([]);
  const handClass = heroParsed.ok && heroParsed.cards.length === 2 ? classifyStartingHand(heroParsed.cards[0], heroParsed.cards[1]) : null;
  const decisionLabel = errors.length ? "输入待修正" : spr !== null && spr <= 3 ? "高承诺度" : texture.wetness === "wet" ? "风险高" : "标准";

  return {
    errors,
    heroCards: heroParsed.cards || [],
    boardCards: boardParsed.cards || [],
    potOdds,
    spr,
    texture,
    handClass,
    decisionLabel
  };
}

function renderAnalysis(analysis) {
  return `
    <div class="analysis-grid">
      <div class="metric"><span class="muted">底池赔率</span><strong>${percentage(analysis.potOdds)}</strong></div>
      <div class="metric"><span class="muted">SPR</span><strong>${numberLabel(analysis.spr)}</strong></div>
      <div class="metric"><span class="muted">决策标签</span><strong>${escapeHtml(analysis.decisionLabel)}</strong></div>
    </div>
    ${analysis.errors.length ? `
      <div class="alert">
        <strong>需要修正</strong>
        <ul>${analysis.errors.map((error) => `<li>${escapeHtml(error)}</li>`).join("")}</ul>
      </div>
    ` : ""}
    <div class="card">
      <h3>结构分析</h3>
      <p>${escapeHtml(analysis.texture.explanation)}</p>
      <div class="tag-row">${analysis.texture.labels.map((label) => `<span class="tag is-soft">${escapeHtml(label)}</span>`).join("")}</div>
    </div>
    <div class="card">
      <h3>复盘清单</h3>
      <ul class="check-list">
        <li>翻前范围是否符合位置和前序行动？${analysis.handClass ? ` 当前手牌：${escapeHtml(analysis.handClass.label)}` : ""}</li>
        <li>下注是否能被更差牌跟注，或让更好牌弃牌？</li>
        <li>如果面对加注，哪些价值牌和诈唬会这样行动？</li>
        <li>这手牌真正的错误是范围、赔率、尺度，还是情绪？</li>
      </ul>
    </div>
  `;
}

function reviewMatches(review) {
  const search = reviewFilters.search.trim().toLowerCase();
  const decisionOk = reviewFilters.decisionLabel === "all" || review.analysis?.decisionLabel === reviewFilters.decisionLabel;
  const errorOk = reviewFilters.errorType === "all" || (review.errorTypes || []).includes(reviewFilters.errorType);
  const haystack = [
    review.heroHand,
    review.board,
    review.actionLine,
    review.opponentNotes,
    review.userNote,
    ...(review.tags || []),
    ...(review.errorTypes || [])
  ].join(" ").toLowerCase();
  const searchOk = !search || haystack.includes(search);
  return decisionOk && errorOk && searchOk;
}

function renderSavedReviews(reviews) {
  const decisionLabels = ["all", ...new Set(reviews.map((review) => review.analysis?.decisionLabel).filter(Boolean))];
  const filtered = reviews.filter(reviewMatches).slice(-12).reverse();

  return `
    <div class="review-tools">
      <label>搜索
        <input data-review-filter="search" value="${escapeAttribute(reviewFilters.search)}" placeholder="手牌、牌面、笔记、标签">
      </label>
      <label>决策标签
        <select data-review-filter="decisionLabel">
          ${decisionLabels.map((label) => option(label, label === "all" ? "全部" : label, reviewFilters.decisionLabel)).join("")}
        </select>
      </label>
      <label>错误类型
        <select data-review-filter="errorType">
          ${["all", ...ERROR_TYPES].map((label) => option(label, label === "all" ? "全部" : label, reviewFilters.errorType)).join("")}
        </select>
      </label>
    </div>
    <div class="compact-list">
      ${filtered.length ? filtered.map((review) => `
        <article class="compact-item review-item">
          <strong>${escapeHtml(review.heroHand || "未知手牌")} · ${escapeHtml(review.position || "未知位置")}</strong>
          <span>${escapeHtml(review.analysis?.decisionLabel || "待观察")} · ${escapeHtml(STREET_LABELS[review.streetFocus] || review.streetFocus || "整手牌")}</span>
          <p>${escapeHtml(review.userNote || review.notes || "没有用户笔记。")}</p>
          <div class="tag-row">
            ${(review.errorTypes || []).map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}
            ${(review.analysis?.textureLabels || []).slice(0, 3).map((tag) => `<span class="tag is-soft">${escapeHtml(tag)}</span>`).join("")}
          </div>
        </article>
      `).join("") : `<p class="muted">当前筛选下没有复盘记录。</p>`}
    </div>
  `;
}

export function renderReview({ app, state, setState }) {
  const analysis = analyze(formState);
  const reviews = state.handReviews || [];

  app.innerHTML = `
    <section class="grid two">
      <form class="form-panel review-form" data-review-form>
        <div>
          <p class="eyebrow">Hand Review</p>
          <h2>手动输入一手牌</h2>
          <p class="muted">支持格式：As Ks、Qs Js 2d。输入不完整时仍会显示可计算的部分。</p>
        </div>

        <div class="form-grid">
          <label>游戏类型<select name="gameType">${option("现金桌", "现金桌", formState.gameType)}${option("锦标赛", "锦标赛", formState.gameType)}</select></label>
          <label>桌型<select name="tableFormat">${option("6-max", "6-max", formState.tableFormat)}${option("满员桌", "满员桌", formState.tableFormat)}${option("单挑", "单挑", formState.tableFormat)}</select></label>
          <label>位置<input name="position" value="${escapeAttribute(formState.position)}"></label>
          <label>有效后手<input name="effectiveStack" value="${escapeAttribute(formState.effectiveStack)}" inputmode="decimal"></label>
          <label>Hero 手牌<input name="heroHand" value="${escapeAttribute(formState.heroHand)}"></label>
          <label>公共牌<input name="board" value="${escapeAttribute(formState.board)}"></label>
          <label>当前底池<input name="potSize" value="${escapeAttribute(formState.potSize)}" inputmode="decimal"></label>
          <label>需跟注/下注<input name="betSize" value="${escapeAttribute(formState.betSize)}" inputmode="decimal"></label>
          <label>街道焦点<select name="streetFocus">${Object.entries(STREET_LABELS).map(([value, label]) => option(value, label, formState.streetFocus)).join("")}</select></label>
        </div>

        <fieldset class="checkbox-panel">
          <legend>错误类型</legend>
          <div class="checkbox-grid">
            ${ERROR_TYPES.map((type) => `
              <label class="checkbox-label">
                <input type="checkbox" name="errorTypes" value="${escapeAttribute(type)}" ${(formState.errorTypes || []).includes(type) ? "checked" : ""}>
                <span>${escapeHtml(type)}</span>
              </label>
            `).join("")}
          </div>
        </fieldset>

        <label>行动线<textarea name="actionLine" rows="4">${escapeHtml(formState.actionLine)}</textarea></label>
        <label>对手备注<textarea name="opponentNotes" rows="3">${escapeHtml(formState.opponentNotes)}</textarea></label>
        <label>我的复盘笔记<textarea name="userNote" rows="3">${escapeHtml(formState.userNote)}</textarea></label>

        <div class="button-row">
          <button class="primary-button" type="button" data-save-review>保存复盘</button>
          <button class="ghost-button" type="button" data-refresh-analysis>更新分析</button>
        </div>
      </form>

      <section class="content">
        <div class="panel">
          <p class="eyebrow">Analysis</p>
          <h2>即时分析</h2>
          ${renderAnalysis(analysis)}
        </div>

        <div class="panel">
          <div class="section-heading">
            <div>
              <p class="eyebrow">Review Journal</p>
              <h3>复盘日志</h3>
            </div>
          </div>
          ${renderSavedReviews(reviews)}
        </div>
      </section>
    </section>
  `;

  app.querySelector("[data-refresh-analysis]").addEventListener("click", () => {
    readForm(app);
    renderReview({ app, state, setState });
  });

  app.querySelectorAll("[data-review-filter]").forEach((control) => {
    control.addEventListener("input", () => {
      reviewFilters = {
        ...reviewFilters,
        [control.dataset.reviewFilter]: control.value
      };
      renderReview({ app, state, setState });
    });
  });

  app.querySelector("[data-save-review]").addEventListener("click", () => {
    const form = readForm(app);
    const nextAnalysis = analyze(form);
    if (nextAnalysis.errors.length) {
      renderReview({ app, state, setState });
      return;
    }

    setState((current) => ({
      ...current,
      handReviews: [
        ...current.handReviews,
        {
          id: `review-${Date.now()}`,
          ...form,
          heroHand: nextAnalysis.heroCards.map(formatCard).join(" "),
          board: nextAnalysis.boardCards.map(formatCard).join(" "),
          analysis: {
            potOdds: nextAnalysis.potOdds,
            spr: nextAnalysis.spr,
            decisionLabel: nextAnalysis.decisionLabel,
            textureLabels: nextAnalysis.texture.labels
          },
          notes: form.opponentNotes,
          tags: [...nextAnalysis.texture.labels, ...(form.errorTypes || [])],
          createdAt: new Date().toISOString()
        }
      ]
    }));
  });
}
