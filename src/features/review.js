import { parseCards, hasDuplicateCards, formatCard } from "../lib/cards.js";
import { calculatePotOdds, calculateSpr, classifyStartingHand } from "../lib/pokerMath.js";
import { analyzeBoardTexture } from "../lib/boardTexture.js";

let formState = {
  gameType: "现金桌",
  tableFormat: "6-max",
  position: "BTN",
  effectiveStack: "300",
  heroHand: "As Ks",
  board: "Qs Js 2d",
  potSize: "100",
  betSize: "50",
  actionLine: "翻前 BTN 开池，BB 跟注；翻牌 BB check，Hero 面对听牌考虑下注。",
  opponentNotes: "默认未知对手"
};

function percentage(value) {
  return value === null ? "信息不足" : `${Math.round(value * 100)}%`;
}

function numberLabel(value) {
  return value === null ? "信息不足" : value.toFixed(1);
}

function readForm(app) {
  const data = new FormData(app.querySelector("[data-review-form]"));
  formState = Object.fromEntries(data.entries());
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
      <div class="metric"><span class="muted">决策标签</span><strong>${analysis.decisionLabel}</strong></div>
    </div>
    ${analysis.errors.length ? `
      <div class="alert">
        <strong>需要修正</strong>
        <ul>${analysis.errors.map((error) => `<li>${error}</li>`).join("")}</ul>
      </div>
    ` : ""}
    <div class="card">
      <h3>结构分析</h3>
      <p>${analysis.texture.explanation}</p>
      <div class="tag-row">${analysis.texture.labels.map((label) => `<span class="tag is-soft">${label}</span>`).join("")}</div>
    </div>
    <div class="card">
      <h3>复盘清单</h3>
      <ul class="check-list">
        <li>翻前范围是否符合位置和前序行动？${analysis.handClass ? ` 当前手牌：${analysis.handClass.label}` : ""}</li>
        <li>下注是否能被更差牌跟注，或让更好牌弃牌？</li>
        <li>如果面对加注，哪些价值牌和诈唬会这样行动？</li>
        <li>这手牌真正的错误是范围、赔率、尺度，还是情绪？</li>
      </ul>
    </div>
  `;
}

export function renderReview({ app, state, setState }) {
  const analysis = analyze(formState);
  const recentReviews = [...state.handReviews].slice(-5).reverse();

  app.innerHTML = `
    <section class="grid two">
      <form class="form-panel review-form" data-review-form>
        <div>
          <p class="eyebrow">Hand Review</p>
          <h2>手动输入一手牌</h2>
          <p class="muted">支持格式：As Ks、Qs Js 2d。输入不完整时仍会显示可计算的部分。</p>
        </div>

        <div class="form-grid">
          <label>游戏类型<select name="gameType"><option ${formState.gameType === "现金桌" ? "selected" : ""}>现金桌</option><option ${formState.gameType === "锦标赛" ? "selected" : ""}>锦标赛</option></select></label>
          <label>桌型<select name="tableFormat"><option ${formState.tableFormat === "6-max" ? "selected" : ""}>6-max</option><option ${formState.tableFormat === "满员桌" ? "selected" : ""}>满员桌</option><option ${formState.tableFormat === "单挑" ? "selected" : ""}>单挑</option></select></label>
          <label>位置<input name="position" value="${formState.position}"></label>
          <label>有效后手<input name="effectiveStack" value="${formState.effectiveStack}" inputmode="decimal"></label>
          <label>Hero 手牌<input name="heroHand" value="${formState.heroHand}"></label>
          <label>公共牌<input name="board" value="${formState.board}"></label>
          <label>当前底池<input name="potSize" value="${formState.potSize}" inputmode="decimal"></label>
          <label>需跟注/下注<input name="betSize" value="${formState.betSize}" inputmode="decimal"></label>
        </div>

        <label>行动线<textarea name="actionLine" rows="4">${formState.actionLine}</textarea></label>
        <label>对手备注<textarea name="opponentNotes" rows="3">${formState.opponentNotes}</textarea></label>

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
              <p class="eyebrow">Saved Reviews</p>
              <h3>最近复盘</h3>
            </div>
          </div>
          <div class="compact-list">
            ${recentReviews.length ? recentReviews.map((review) => `
              <div class="compact-item">
                <strong>${review.heroHand} · ${review.position}</strong>
                <span>${review.analysis.decisionLabel} · ${review.analysis.textureLabels.join(" / ")}</span>
              </div>
            `).join("") : `<p class="muted">还没有保存复盘。</p>`}
          </div>
        </div>
      </section>
    </section>
  `;

  app.querySelector("[data-refresh-analysis]").addEventListener("click", () => {
    readForm(app);
    renderReview({ app, state, setState });
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
          tags: nextAnalysis.texture.labels,
          createdAt: new Date().toISOString()
        }
      ]
    }));
  });
}
