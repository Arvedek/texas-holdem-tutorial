const RANKS = ["A", "K", "Q", "J", "T", "9", "8", "7", "6", "5", "4", "3", "2"];

export const preflopResponseSpots = [
  {
    id: "co-open-btn",
    tableSize: "6-max",
    opener: "CO",
    hero: "BTN",
    title: "BTN 面对 CO 开池",
    context: "你有位置，既可以用强牌 3-bet，也可以冷跟一部分可玩牌。",
    value3Bet: ["QQ+", "AKs", "AKo", "AQs"],
    bluff3Bet: ["A5s-A2s", "KTs", "QTs"],
    call: ["JJ-22", "AJs-ATs", "KQs", "KJs", "QJs", "JTs", "T9s", "98s"],
    foldNote: "被支配的 offsuit Broadway 和弱同花 Kx 不要因为有位置就自动入池。"
  },
  {
    id: "utg-open-hj",
    tableSize: "9-max",
    opener: "UTG",
    hero: "HJ",
    title: "HJ 面对 UTG 开池",
    context: "满员桌早位开池很强，后面仍有多人未行动，默认非常谨慎。",
    value3Bet: ["QQ+", "AKs", "AKo"],
    bluff3Bet: ["A5s"],
    call: ["JJ-99", "AQs", "KQs"],
    foldNote: "ATo、KQo、低同花连张面对 UTG 默认弃牌，避免被强范围压制。"
  },
  {
    id: "btn-open-sb",
    tableSize: "6-max",
    opener: "BTN",
    hero: "SB",
    title: "SB 面对 BTN 开池",
    context: "小盲无位置，少冷跟，多用 3-bet 或弃牌降低被动局面。",
    value3Bet: ["TT+", "AQs+", "AQo+", "KQs"],
    bluff3Bet: ["A5s-A2s", "KTs-K9s", "QTs", "JTs"],
    call: ["99-66", "AJs-ATs", "KJs", "QJs", "T9s"],
    foldNote: "小盲冷跟弱牌会长期无位置实现权益困难。"
  },
  {
    id: "btn-open-bb",
    tableSize: "6-max",
    opener: "BTN",
    hero: "BB",
    title: "BB 面对 BTN 开池",
    context: "大盲有价格优势，可以防守更多，但仍要按可实现权益筛选。",
    value3Bet: ["JJ+", "AKs", "AKo", "AQs"],
    bluff3Bet: ["A5s-A2s", "K9s+", "QTs", "JTs"],
    call: ["TT-22", "A9s-A2s", "ATo-A7o", "KTs-K7s", "KQo-KTo", "Q9s+", "QTo+", "J9s+", "T8s+", "98s-65s"],
    foldNote: "72o、83o、弱 offsuit 垃圾牌即使在大盲也不能全防。"
  }
];

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

function add(result, hand) {
  result.add(hand);
}

function expandPlus(token, result) {
  const pair = token.match(/^([AKQJT98765432])\1\+$/);
  if (pair) {
    const start = RANKS.indexOf(pair[1]);
    RANKS.slice(0, start + 1).forEach((rank) => add(result, `${rank}${rank}`));
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
    .forEach((rank) => add(result, normalizeHand(high, rank, suitedness)));
  return true;
}

function expandDash(token, result) {
  const pair = token.match(/^([AKQJT98765432])\1-([AKQJT98765432])\2$/);
  if (pair) {
    const from = Math.min(RANKS.indexOf(pair[1]), RANKS.indexOf(pair[2]));
    const to = Math.max(RANKS.indexOf(pair[1]), RANKS.indexOf(pair[2]));
    RANKS.slice(from, to + 1).forEach((rank) => add(result, `${rank}${rank}`));
    return true;
  }

  const sameHigh = token.match(/^([AKQJT98765432])([AKQJT98765432])([so])-([AKQJT98765432])([AKQJT98765432])\3$/);
  if (!sameHigh) {
    return false;
  }

  const [, startHigh, startLow, suitedness, endHigh, endLow] = sameHigh;
  if (startHigh === endHigh) {
    const from = Math.min(RANKS.indexOf(startLow), RANKS.indexOf(endLow));
    const to = Math.max(RANKS.indexOf(startLow), RANKS.indexOf(endLow));
    RANKS.slice(from, to + 1).forEach((rank) => add(result, normalizeHand(startHigh, rank, suitedness)));
    return true;
  }

  const start = Math.min(RANKS.indexOf(startHigh), RANKS.indexOf(endHigh));
  const end = Math.max(RANKS.indexOf(startHigh), RANKS.indexOf(endHigh));
  for (let index = start; index <= end; index += 1) {
    const low = RANKS[index + 1];
    if (low) {
      add(result, `${RANKS[index]}${low}${suitedness}`);
    }
  }
  return true;
}

function expandExact(token, result) {
  if (/^([AKQJT98765432])\1$/.test(token) || /^([AKQJT98765432])([AKQJT98765432])([so])$/.test(token)) {
    const match = token.match(/^([AKQJT98765432])([AKQJT98765432])([so])?$/);
    add(result, normalizeHand(match[1], match[2], match[3] || ""));
    return true;
  }
  return false;
}

function expand(tokens = []) {
  const result = new Set();
  tokens.forEach((token) => {
    expandPlus(token, result) || expandDash(token, result) || expandExact(token, result);
  });
  return result;
}

function findSpot(tableSize, opener, hero) {
  return preflopResponseSpots.find((spot) => spot.tableSize === tableSize && spot.opener === opener && spot.hero === hero)
    || preflopResponseSpots.find((spot) => spot.opener === opener && spot.hero === hero)
    || preflopResponseSpots[0];
}

export function choosePreflopResponse(tableSize, opener, hero, hand) {
  const spot = findSpot(tableSize, opener, hero);
  const normalized = String(hand || "").trim();
  const value = expand(spot.value3Bet);
  const bluff = expand(spot.bluff3Bet);
  const calls = expand(spot.call);

  if (value.has(normalized)) {
    return {
      spot,
      hand: normalized,
      action: "3-bet",
      confidence: "standard",
      reason: `${normalized} 在 ${spot.title} 属于强价值 3-bet。你有范围或位置优势时，优先主动加注拿价值。`
    };
  }

  if (bluff.has(normalized)) {
    return {
      spot,
      hand: normalized,
      action: "3-bet / 混合",
      confidence: "thin",
      reason: `${normalized} 有阻断或可玩性，可低频 3-bet。新人默认先看对手是否弃牌够多。`
    };
  }

  if (calls.has(normalized)) {
    return {
      spot,
      hand: normalized,
      action: "跟注",
      confidence: "standard",
      reason: `${normalized} 在 ${spot.title} 有足够可玩性，尤其有位置或大盲价格时可以跟注实现权益。`
    };
  }

  return {
    spot,
    hand: normalized,
    action: "弃牌",
    confidence: "standard",
    reason: `${normalized || "这手牌"} 不在当前新手默认继续范围里。${spot.foldNote}`
  };
}
