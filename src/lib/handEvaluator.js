import { RANK_VALUES } from "./cards.js";

const STRAIGHT_WINDOWS = [
  [14, 13, 12, 11, 10],
  [13, 12, 11, 10, 9],
  [12, 11, 10, 9, 8],
  [11, 10, 9, 8, 7],
  [10, 9, 8, 7, 6],
  [9, 8, 7, 6, 5],
  [8, 7, 6, 5, 4],
  [7, 6, 5, 4, 3],
  [6, 5, 4, 3, 2],
  [14, 5, 4, 3, 2]
];

const MADE_HANDS = {
  straightFlush: { rank: "straight-flush", label: "同花顺" },
  quads: { rank: "quads", label: "四条" },
  fullHouse: { rank: "full-house", label: "葫芦" },
  flush: { rank: "flush", label: "同花" },
  straight: { rank: "straight", label: "顺子" },
  trips: { rank: "trips", label: "三条" },
  twoPair: { rank: "two-pair", label: "两对" },
  pair: { rank: "pair", label: "一对" },
  highCard: { rank: "high-card", label: "高牌" }
};

function rankName(value) {
  return Object.entries(RANK_VALUES).find(([, rankValue]) => rankValue === value)?.[0] || String(value);
}

function uniqueValues(cards) {
  return [...new Set(cards.map((card) => card.value))];
}

function hasStraight(values) {
  const set = new Set(values);
  return STRAIGHT_WINDOWS.find((window) => window.every((value) => set.has(value))) || null;
}

function countBy(items, keyFn) {
  return items.reduce((acc, item) => {
    const key = keyFn(item);
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
}

function madeHand(cards) {
  if (cards.length < 2) {
    return { ...MADE_HANDS.highCard, detail: "输入手牌后显示当前牌力。" };
  }

  const byRank = countBy(cards, (card) => card.rank);
  const bySuit = countBy(cards, (card) => card.suit);
  const counts = Object.entries(byRank)
    .map(([rank, count]) => ({ rank, value: RANK_VALUES[rank], count }))
    .sort((a, b) => b.count - a.count || b.value - a.value);
  const flushSuit = Object.entries(bySuit).find(([, count]) => count >= 5)?.[0];
  const straight = hasStraight(uniqueValues(cards));

  if (flushSuit) {
    const straightFlush = hasStraight(uniqueValues(cards.filter((card) => card.suit === flushSuit)));
    if (straightFlush) {
      return { ...MADE_HANDS.straightFlush, detail: `${rankName(straightFlush[0])} 高同花顺。` };
    }
  }

  if (counts[0]?.count === 4) {
    return { ...MADE_HANDS.quads, detail: `${counts[0].rank} 四条。` };
  }

  if (counts[0]?.count === 3 && counts.some((item, index) => index > 0 && item.count >= 2)) {
    return { ...MADE_HANDS.fullHouse, detail: `${counts[0].rank} 葫芦。` };
  }

  if (flushSuit) {
    const flushCards = cards.filter((card) => card.suit === flushSuit).sort((a, b) => b.value - a.value);
    return { ...MADE_HANDS.flush, detail: `${flushCards[0].rank} 高同花。` };
  }

  if (straight) {
    return { ...MADE_HANDS.straight, detail: `${rankName(straight[0])} 高顺子。` };
  }

  if (counts[0]?.count === 3) {
    return { ...MADE_HANDS.trips, detail: `${counts[0].rank} 三条。` };
  }

  const pairs = counts.filter((item) => item.count === 2);
  if (pairs.length >= 2) {
    return { ...MADE_HANDS.twoPair, detail: `${pairs[0].rank}${pairs[1].rank} 两对。` };
  }

  if (pairs.length === 1) {
    return { ...MADE_HANDS.pair, detail: `${pairs[0].rank} 一对。` };
  }

  const high = cards.reduce((best, card) => (card.value > best.value ? card : best), cards[0]);
  return { ...MADE_HANDS.highCard, detail: `${high.rank} 高牌。` };
}

function detectFlushDraw(cards, boardCards) {
  if (boardCards.length >= 5) {
    return [];
  }

  const bySuit = countBy(cards, (card) => card.suit);
  return Object.entries(bySuit)
    .filter(([, count]) => count === 4)
    .map(([suit]) => ({
      type: "flush-draw",
      label: "同花听牌",
      outs: 9,
      detail: `${suit.toUpperCase()} 花色已有 4 张，通常约 9 个同花 outs。`
    }));
}

function detectStraightDraw(cards, boardCards) {
  if (boardCards.length >= 5) {
    return [];
  }

  const values = uniqueValues(cards);
  if (hasStraight(values)) {
    return [];
  }

  const current = new Set(values);
  const missingRanks = [...new Set(STRAIGHT_WINDOWS.flat())]
    .filter((value) => !current.has(value));
  const completingRanks = missingRanks
    .filter((value) => hasStraight([...values, value]));

  if (completingRanks.length >= 2) {
    return [{
      type: "open-ended",
      label: "开放式顺子听牌",
      outs: 8,
      detail: `任一 ${completingRanks.map(rankName).join(" 或 ")} 可成顺，通常约 8 outs。`
    }];
  }

  if (completingRanks.length === 1) {
    return [{
      type: "gutshot",
      label: "卡顺听牌",
      outs: 4,
      detail: `需要 ${rankName(completingRanks[0])} 成顺，通常约 4 outs。`
    }];
  }

  return [];
}

function recommendation(made, draws) {
  if (["straight-flush", "quads", "full-house", "flush", "straight"].includes(made.rank)) {
    return "当前是强成牌，优先思考如何从更差牌拿价值，同时警惕公共牌变化。";
  }

  if (["trips", "two-pair"].includes(made.rank)) {
    return "当前牌力较强，但仍要结合牌面湿润度和对手加注强度控制底池。";
  }

  if (draws.length) {
    return "当前有听牌，先比较 outs、底池赔率和隐含赔率，再决定跟注、半诈唬或弃牌。";
  }

  if (made.rank === "pair") {
    return "一对需要看踢脚、位置和下注尺度；别自动把顶对打成三条街大底池。";
  }

  return "当前主要是高牌或弱摊牌价值，默认减少大额投入，寻找便宜实现权益的机会。";
}

export function evaluateHoldemHand(heroCards = [], boardCards = []) {
  const cards = [...heroCards, ...boardCards];
  const currentMadeHand = madeHand(cards);
  const draws = [
    ...detectFlushDraw(cards, boardCards),
    ...detectStraightDraw(cards, boardCards)
  ];
  const outs = draws.reduce((total, draw) => total + draw.outs, 0);

  return {
    madeHand: currentMadeHand,
    draws,
    outs,
    recommendation: recommendation(currentMadeHand, draws)
  };
}
