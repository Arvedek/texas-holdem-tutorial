const RANKS = ["A", "K", "Q", "J", "T", "9", "8", "7", "6", "5", "4", "3", "2"];
const VALID_RANKS = new Set(RANKS);

function rankIndex(rank) {
  return RANKS.indexOf(rank);
}

function normalizeHand(first, second, suitedness = "") {
  if (first === second) {
    return `${first}${second}`;
  }

  const firstIndex = rankIndex(first);
  const secondIndex = rankIndex(second);
  const high = firstIndex < secondIndex ? first : second;
  const low = firstIndex < secondIndex ? second : first;
  return `${high}${low}${suitedness}`;
}

function addHand(result, hand, source) {
  if (!result.handSet.has(hand)) {
    result.hands.push(hand);
  }
  result.handSet.add(hand);
  result.sources[hand] = source;
}

function parsePairPlus(token, result) {
  const match = token.match(/^([AKQJT98765432])\1\+$/);
  if (!match) {
    return false;
  }

  const start = rankIndex(match[1]);
  RANKS.slice(0, start + 1).forEach((rank) => addHand(result, `${rank}${rank}`, token));
  result.explanations.push(`${token} 表示 ${match[1]}${match[1]} 以及所有更大的对子。`);
  return true;
}

function parseKickerPlus(token, result) {
  const match = token.match(/^([AKQJT98765432])([AKQJT98765432])([so])\+$/);
  if (!match) {
    return false;
  }

  const [, high, kicker, suitedness] = match;
  const highIndex = rankIndex(high);
  const kickerIndex = rankIndex(kicker);
  if (highIndex < 0 || kickerIndex <= highIndex) {
    return false;
  }

  RANKS.slice(highIndex + 1, kickerIndex + 1)
    .forEach((rank) => addHand(result, normalizeHand(high, rank, suitedness), token));
  result.explanations.push(`${token} 表示 ${normalizeHand(high, kicker, suitedness)} 到 ${normalizeHand(high, RANKS[highIndex + 1], suitedness)} 的同类更强踢脚牌。`);
  return true;
}

function parseDash(token, result) {
  const match = token.match(/^([AKQJT98765432])([AKQJT98765432])([so])-([AKQJT98765432])([AKQJT98765432])\3$/);
  if (!match) {
    return false;
  }

  const [, startHigh, startLow, suitedness, endHigh, endLow] = match;
  if (![startHigh, startLow, endHigh, endLow].every((rank) => VALID_RANKS.has(rank))) {
    return false;
  }

  if (startHigh === endHigh) {
    const from = Math.min(rankIndex(startLow), rankIndex(endLow));
    const to = Math.max(rankIndex(startLow), rankIndex(endLow));
    RANKS.slice(from, to + 1)
      .forEach((rank) => addHand(result, normalizeHand(startHigh, rank, suitedness), token));
  } else {
    const start = Math.min(rankIndex(startHigh), rankIndex(endHigh));
    const end = Math.max(rankIndex(startHigh), rankIndex(endHigh));
    for (let index = start; index <= end; index += 1) {
      const low = RANKS[index + 1];
      if (low) {
        addHand(result, `${RANKS[index]}${low}${suitedness}`, token);
      }
    }
  }

  result.explanations.push(`${token} 表示从 ${token.split("-")[0]} 到 ${token.split("-")[1]} 的连续同类手牌。`);
  return true;
}

function parseExact(token, result) {
  const pair = token.match(/^([AKQJT98765432])\1$/);
  if (pair) {
    addHand(result, token, token);
    result.explanations.push(`${token} 是一手具体口袋对子。`);
    return true;
  }

  const hand = token.match(/^([AKQJT98765432])([AKQJT98765432])([so])$/);
  if (hand && hand[1] !== hand[2]) {
    addHand(result, normalizeHand(hand[1], hand[2], hand[3]), token);
    result.explanations.push(`${token} 是一手具体${hand[3] === "s" ? "同花" : "非同花"}起手牌。`);
    return true;
  }

  return false;
}

function normalizeToken(rawToken) {
  return String(rawToken || "")
    .trim()
    .replace(/\s+/g, "")
    .replace(/[，、]/g, ",")
    .toUpperCase()
    .replace(/S/g, "s")
    .replace(/O/g, "o");
}

export function decodeRangeNotation(input = "") {
  const tokens = String(input)
    .split(/[,，、\s]+/)
    .map(normalizeToken)
    .filter(Boolean);
  const result = {
    ok: true,
    input,
    tokens,
    hands: [],
    handSet: new Set(),
    sources: {},
    explanations: [],
    unknownTokens: []
  };

  tokens.forEach((token) => {
    const parsed = parsePairPlus(token, result)
      || parseKickerPlus(token, result)
      || parseDash(token, result)
      || parseExact(token, result);
    if (!parsed) {
      result.unknownTokens.push(token);
    }
  });

  result.ok = result.unknownTokens.length === 0 && result.hands.length > 0;
  delete result.handSet;
  return result;
}
