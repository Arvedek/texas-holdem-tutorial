import { escapeAttribute, escapeHtml } from "../lib/sanitize.js";

let selectedTableSize = "6-max";
let selectedPositionByTable = {};
let selectedHandBySpot = {};
let selectedBbScenarioBySpot = {};

const RANKS = ["A", "K", "Q", "J", "T", "9", "8", "7", "6", "5", "4", "3", "2"];
const PREMIUM_HANDS = new Set(["AA", "KK", "QQ", "JJ", "TT", "AKs", "AKo", "AQs"]);
const BB_DEFENSE_SCENARIOS = [
  {
    id: "late-steal",
    label: "面对 BTN/SB 偷盲",
    note: "后位和小盲开池通常更宽，大盲可以防守更多同花牌、对子、Broadway 和连张，但仍要弃掉无法兑现权益的垃圾牌。",
    range: ["22+", "A2s+", "A7o+", "K7s+", "KTo+", "Q9s+", "QTo+", "J9s+", "JTo", "T8s+", "98s-54s", "97s+", "86s+"]
  },
  {
    id: "middle-open",
    label: "面对 CO/HJ 开池",
    note: "中后位开池没有按钮偷盲那么宽，大盲要收紧到更能成牌、被支配风险更低的组合。",
    range: ["44+", "A5s+", "ATo+", "KTs+", "KQo", "QTs+", "JTs", "T9s", "98s"]
  },
  {
    id: "early-open",
    label: "面对早位强开池",
    note: "早位开池代表强范围，大盲即使有折扣也不能乱买票。新人优先保留高对子、强 A 和少量可玩性极好的同花 Broadway。",
    range: ["88+", "AJs+", "AQo+", "KQs", "QJs", "JTs"]
  }
];

function chips(items) {
  return (items || []).map((item) => `<span class="range-chip">${escapeHtml(item)}</span>`).join("");
}

function normalizeHand(first, second, suitedness = "") {
  if (first === second) {
    return `${first}${second}`;
  }

  const firstIndex = RANKS.indexOf(first);
  const secondIndex = RANKS.indexOf(second);
  const high = firstIndex < secondIndex ? first : second;
  const low = firstIndex < secondIndex ? second : first;
  return `${high}${low}${suitedness}`;
}

function addHand(result, hand, source) {
  result.hands.add(hand);
  result.sources.set(hand, source);
}

function expandPlusToken(token, result) {
  const pair = token.match(/^([AKQJT98765432])\1\+$/);
  if (pair) {
    const start = RANKS.indexOf(pair[1]);
    RANKS.slice(0, start + 1).forEach((rank) => addHand(result, `${rank}${rank}`, token));
    return true;
  }

  const broadway = token.match(/^([AKQJT98765432])([AKQJT98765432])([so])\+$/);
  if (!broadway) {
    return false;
  }

  const [, high, kicker, suitedness] = broadway;
  const highIndex = RANKS.indexOf(high);
  const kickerIndex = RANKS.indexOf(kicker);
  RANKS.slice(highIndex + 1, kickerIndex + 1)
    .forEach((rank) => addHand(result, normalizeHand(high, rank, suitedness), token));
  return true;
}

function expandDashToken(token, result) {
  const match = token.match(/^([AKQJT98765432])([AKQJT98765432])([so])-([AKQJT98765432])([AKQJT98765432])\3$/);
  if (!match) {
    return false;
  }

  const [, startHigh, startLow, suitedness, endHigh, endLow] = match;
  const startHighIndex = RANKS.indexOf(startHigh);
  const startLowIndex = RANKS.indexOf(startLow);
  const endHighIndex = RANKS.indexOf(endHigh);
  const endLowIndex = RANKS.indexOf(endLow);

  if (startHigh === endHigh) {
    const from = Math.min(startLowIndex, endLowIndex);
    const to = Math.max(startLowIndex, endLowIndex);
    RANKS.slice(from, to + 1)
      .forEach((rank) => addHand(result, normalizeHand(startHigh, rank, suitedness), token));
    return true;
  }

  const start = Math.min(startHighIndex, endHighIndex);
  const end = Math.max(startHighIndex, endHighIndex);
  for (let index = start; index <= end; index += 1) {
    const low = RANKS[index + 1];
    if (low) {
      addHand(result, `${RANKS[index]}${low}${suitedness}`, token);
    }
  }
  return true;
}

function expandExactToken(token, result) {
  const pair = token.match(/^([AKQJT98765432])\1$/);
  if (pair) {
    addHand(result, token, token);
    return true;
  }

  const hand = token.match(/^([AKQJT98765432])([AKQJT98765432])([so])$/);
  if (hand) {
    addHand(result, normalizeHand(hand[1], hand[2], hand[3]), token);
    return true;
  }

  return false;
}

function expandRangeTokens(tokens = []) {
  const result = {
    hands: new Set(),
    sources: new Map(),
    parsedTokens: []
  };

  tokens.forEach((rawToken) => {
    const token = String(rawToken).trim();
    const parsed = expandPlusToken(token, result)
      || expandDashToken(token, result)
      || expandExactToken(token, result);
    if (parsed) {
      result.parsedTokens.push(token);
    }
  });

  return result;
}

function getMatrixHand(rowRank, colRank) {
  if (rowRank === colRank) {
    return `${rowRank}${colRank}`;
  }

  const rowIndex = RANKS.indexOf(rowRank);
  const colIndex = RANKS.indexOf(colRank);
  return rowIndex < colIndex ? `${rowRank}${colRank}s` : `${colRank}${rowRank}o`;
}

function getHandAction(hand, rangeInfo, hasExactRange) {
  if (!hasExactRange) {
    return "context";
  }

  if (!rangeInfo.hands.has(hand)) {
    return "fold";
  }

  return PREMIUM_HANDS.has(hand) ? "premium" : "open";
}

function actionLabel(action, item) {
  const isDefend = Boolean(item.defend);
  return {
    premium: isDefend ? "强防守 / 3-bet 候选" : "强价值开池",
    open: isDefend ? "可防守" : "默认可以开池",
    fold: "默认弃牌",
    context: "看开池者位置"
  }[action];
}

function getRangeActionCounts(rangeInfo, hasExactRange) {
  const counts = {
    premium: 0,
    open: 0,
    fold: 0,
    context: 0
  };

  RANKS.forEach((rowRank) => {
    RANKS.forEach((colRank) => {
      const hand = getMatrixHand(rowRank, colRank);
      counts[getHandAction(hand, rangeInfo, hasExactRange)] += 1;
    });
  });

  return {
    ...counts,
    playable: counts.premium + counts.open,
    total: RANKS.length * RANKS.length
  };
}

function getBbDefenseScenario(item, spotKey) {
  if (!item.defend) {
    return null;
  }

  const selectedId = selectedBbScenarioBySpot[spotKey] || BB_DEFENSE_SCENARIOS[0].id;
  return BB_DEFENSE_SCENARIOS.find((scenario) => scenario.id === selectedId) || BB_DEFENSE_SCENARIOS[0];
}

function describePlusToken(token) {
  const pair = token.match(/^([AKQJT98765432])\1\+$/);
  if (pair) {
    const start = RANKS.indexOf(pair[1]);
    return `${token} 表示 ${RANKS.slice(0, start + 1).reverse().map((rank) => `${rank}${rank}`).slice(0, 4).join("、")} 等更大对子`;
  }

  const hand = token.match(/^([AKQJT98765432])([AKQJT98765432])([so])\+$/);
  if (!hand) {
    return "";
  }

  const [, high, kicker, suitedness] = hand;
  const highIndex = RANKS.indexOf(high);
  const kickerIndex = RANKS.indexOf(kicker);
  const examples = RANKS.slice(highIndex + 1, kickerIndex + 1)
    .reverse()
    .map((rank) => normalizeHand(high, rank, suitedness))
    .slice(0, 4);
  return `${token} 表示 ${examples.join("、")} 等更强同类牌`;
}

function describeToken(token) {
  if (!token) {
    return "";
  }

  if (token.endsWith("+")) {
    return describePlusToken(token);
  }

  if (token.includes("-")) {
    return `${token} 表示从 ${token.split("-")[0]} 到 ${token.split("-")[1]} 的连续同类牌`;
  }

  return `${token} 是一手具体起手牌`;
}

function renderLegend() {
  return `
    <div class="range-matrix-legend" aria-label="颜色图例">
      <strong>颜色图例</strong>
      <span><i class="legend-dot is-premium"></i>强价值 / 3-bet 候选</span>
      <span><i class="legend-dot is-open"></i>默认开池或防守</span>
      <span><i class="legend-dot is-fold"></i>默认弃牌</span>
      <span><i class="legend-dot is-context"></i>需要看对手位置</span>
    </div>
  `;
}

function renderRangeStats(item, activeScenario, counts) {
  const playableLabel = item.defend ? "默认可防守" : "默认可玩";
  const guidance = activeScenario
    ? `当前是${activeScenario.label}。大盲防守必须先看开池者位置；面对早位强开池要明显收紧，面对 BTN/SB 偷盲才可以更宽。`
    : "这是无人入池时的默认开池参考，不是死表；位置越早越要紧，桌况、抽水、筹码深度和对手 3-bet 频率都会改变边界。";

  return `
    <div class="range-stats" aria-label="范围统计">
      <div class="range-stats-head">
        <div>
          <p class="eyebrow">范围统计</p>
          <h4>${escapeHtml(item.tableSize)} ${escapeHtml(item.position)} ${activeScenario ? escapeHtml(activeScenario.label) : "默认开池"}</h4>
        </div>
        <strong>${counts.playable}/${counts.total}</strong>
      </div>
      <div class="range-stat-grid">
        <div class="range-stat is-premium">
          <span>强价值</span>
          <strong>${counts.premium}</strong>
        </div>
        <div class="range-stat is-open">
          <span>${escapeHtml(playableLabel)}</span>
          <strong data-range-count-playable>${counts.playable}</strong>
        </div>
        <div class="range-stat is-fold">
          <span>默认弃牌</span>
          <strong data-range-count-fold>${counts.fold}</strong>
        </div>
      </div>
      <p class="muted">${escapeHtml(guidance)}</p>
    </div>
  `;
}

function renderHandMatrix(item, rangeInfo, selectedHand, hasExactRange) {
  return `
    <div class="range-matrix" role="grid" aria-label="${escapeAttribute(item.tableSize)} ${escapeAttribute(item.position)} 13x13 起手牌矩阵">
      ${RANKS.map((rowRank) => RANKS.map((colRank) => {
        const hand = getMatrixHand(rowRank, colRank);
        const action = getHandAction(hand, rangeInfo, hasExactRange);
        return `
          <button
            class="hand-cell is-${action} ${hand === selectedHand ? "is-selected" : ""}"
            data-hand-cell="${escapeAttribute(hand)}"
            data-range-action="${escapeAttribute(action)}"
            role="gridcell"
            aria-label="${escapeAttribute(hand)} ${escapeAttribute(actionLabel(action, item))}"
          >
            ${escapeHtml(hand)}
          </button>
        `;
      }).join("")).join("")}
    </div>
  `;
}

function renderHandDetail(item, rangeInfo, selectedHand, activeScenario) {
  const hasExactRange = Boolean(item.openRaise || activeScenario);
  const action = getHandAction(selectedHand, rangeInfo, hasExactRange);
  const source = rangeInfo.sources.get(selectedHand);
  const tokenDescription = describeToken(source);

  if (!hasExactRange) {
    return `
      <aside class="range-hand-detail">
        <p class="eyebrow">Selected Hand</p>
        <h3>${escapeHtml(selectedHand)} 在 ${escapeHtml(item.tableSize)} ${escapeHtml(item.position)}</h3>
        <p>大盲不是固定开池位置，防守要先看谁开池、加注尺度、有效筹码和后面是否还有人。这里先用文字规则帮你判断，不强行给一张误导性的死表。</p>
        <p class="muted">${escapeHtml(item.beginnerNote)}</p>
      </aside>
    `;
  }

  return `
    <aside class="range-hand-detail">
      <p class="eyebrow">Selected Hand</p>
      <h3>${escapeHtml(selectedHand)} 在 ${escapeHtml(item.tableSize)} ${escapeHtml(item.position)}</h3>
      <p><strong>${escapeHtml(actionLabel(action, item))}</strong>：${action === "fold" ? "这手牌不在当前新人默认范围里，先弃牌可以减少翻前大错。" : `这手牌来自 ${escapeHtml(source)}，${activeScenario ? "默认可以防守或加注反击。" : "默认可以开池。"}`}</p>
      ${activeScenario ? `<p class="muted">当前场景：${escapeHtml(activeScenario.label)}。${escapeHtml(activeScenario.note)}</p>` : ""}
      ${tokenDescription ? `<p class="muted">${escapeHtml(tokenDescription)}</p>` : ""}
      <p class="muted">${escapeHtml(item.habit)}</p>
    </aside>
  `;
}

function renderShorthandGuide(tokens) {
  const examples = tokens
    .map(describeToken)
    .filter(Boolean)
    .slice(0, 4);

  return `
    <div class="range-shorthand-guide">
      <h4>范围写法翻译</h4>
      <div class="compact-list">
        ${examples.map((example) => `<div class="compact-item"><span>${escapeHtml(example)}</span></div>`).join("")}
      </div>
    </div>
  `;
}

function renderBbScenarioSwitch(activeScenario) {
  if (!activeScenario) {
    return "";
  }

  return `
    <div class="bb-scenario-switch">
      <div>
        <p class="eyebrow">大盲防守场景</p>
        <h4>先选对手从哪里开池</h4>
      </div>
      <div class="bb-scenario-buttons">
        ${BB_DEFENSE_SCENARIOS.map((scenario) => `
          <button
            class="chip-button ${scenario.id === activeScenario.id ? "is-active" : ""}"
            data-bb-defense-scenario="${escapeAttribute(scenario.id)}"
          >
            ${escapeHtml(scenario.label)}
          </button>
        `).join("")}
      </div>
      <p class="muted">${escapeHtml(activeScenario.note)}</p>
    </div>
  `;
}

export function renderRanges({ app, data }) {
  const ranges = data.preflopRanges || [];
  const tableSizes = [...new Set(ranges.map((item) => item.tableSize))];
  const activeTableSize = tableSizes.includes(selectedTableSize) ? selectedTableSize : tableSizes[0];
  selectedTableSize = activeTableSize;
  const visibleRanges = ranges.filter((item) => item.tableSize === activeTableSize);
  const positionCount = visibleRanges.length;
  const activePosition = visibleRanges.some((item) => item.position === selectedPositionByTable[activeTableSize])
    ? selectedPositionByTable[activeTableSize]
    : visibleRanges[0]?.position;
  selectedPositionByTable = {
    ...selectedPositionByTable,
    [activeTableSize]: activePosition
  };
  const activeRange = visibleRanges.find((item) => item.position === activePosition) || visibleRanges[0];
  const spotKey = `${activeTableSize}-${activeRange.position}`;
  const activeScenario = getBbDefenseScenario(activeRange, spotKey);
  const rangeInfo = expandRangeTokens(activeRange.openRaise || activeScenario?.range || []);
  const hasExactRange = Boolean(activeRange.openRaise || activeScenario);
  const actionCounts = getRangeActionCounts(rangeInfo, hasExactRange);
  const selectedHand = selectedHandBySpot[spotKey] || (rangeInfo.hands.has("AA") ? "AA" : "AKs");
  selectedHandBySpot = {
    ...selectedHandBySpot,
    [spotKey]: selectedHand
  };

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

    <section class="panel range-matrix-panel">
      <div class="range-matrix-top">
        <div>
          <p class="eyebrow">13x13 起手牌矩阵</p>
          <h2>${escapeHtml(activeTableSize)} · ${escapeHtml(activeRange.position)} ${escapeHtml(activeRange.name)}</h2>
          <p class="muted">${escapeHtml(activeRange.beginnerNote)}</p>
        </div>
        <div class="range-position-switch" aria-label="选择位置">
          ${visibleRanges.map((item) => `
            <button
              class="chip-button ${item.position === activeRange.position ? "is-active" : ""}"
              data-range-position="${escapeAttribute(item.position)}"
            >
              ${escapeHtml(item.position)}
            </button>
          `).join("")}
        </div>
      </div>

      ${renderLegend()}
      ${renderBbScenarioSwitch(activeScenario)}
      ${renderRangeStats(activeRange, activeScenario, actionCounts)}

      <div class="range-matrix-layout">
        <div>
          ${renderHandMatrix(activeRange, rangeInfo, selectedHand, hasExactRange)}
        </div>
        <div class="range-side-panel">
          ${renderHandDetail(activeRange, rangeInfo, selectedHand, activeScenario)}
          ${renderShorthandGuide(activeRange.openRaise || activeScenario?.range || [])}
          <div class="range-block">
            <h4>${activeRange.position === "BB" ? "可防守方向" : "原始范围写法"}</h4>
            <div class="range-chip-row">${chips(activeRange.openRaise || activeRange.defend)}</div>
          </div>
          ${activeScenario ? `
            <div class="range-block">
              <h4>当前场景基准</h4>
              <div class="range-chip-row">${chips(activeScenario.range)}</div>
            </div>
          ` : ""}
          <div class="range-block">
            <h4>新人少碰</h4>
            <div class="range-chip-row is-warning">${chips(activeRange.avoid)}</div>
          </div>
        </div>
      </div>
    </section>
  `;

  app.querySelectorAll("[data-range-table-size]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedTableSize = button.dataset.rangeTableSize;
      renderRanges({ app, data });
    });
  });

  app.querySelectorAll("[data-range-position]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedPositionByTable = {
        ...selectedPositionByTable,
        [activeTableSize]: button.dataset.rangePosition
      };
      renderRanges({ app, data });
    });
  });

  app.querySelectorAll("[data-hand-cell]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedHandBySpot = {
        ...selectedHandBySpot,
        [spotKey]: button.dataset.handCell
      };
      renderRanges({ app, data });
    });
  });

  app.querySelectorAll("[data-bb-defense-scenario]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedBbScenarioBySpot = {
        ...selectedBbScenarioBySpot,
        [spotKey]: button.dataset.bbDefenseScenario
      };
      renderRanges({ app, data });
    });
  });
}
