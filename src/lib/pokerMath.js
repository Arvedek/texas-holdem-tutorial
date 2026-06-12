export function calculatePotOdds(callAmount, potBeforeCall) {
  const call = Number(callAmount);
  const pot = Number(potBeforeCall);
  if (!Number.isFinite(call) || !Number.isFinite(pot) || call <= 0 || pot < 0) {
    return null;
  }
  return call / (pot + call + call);
}

export function calculateSpr(effectiveStack, potSize) {
  const stack = Number(effectiveStack);
  const pot = Number(potSize);
  if (!Number.isFinite(stack) || !Number.isFinite(pot) || stack < 0 || pot <= 0) {
    return null;
  }
  return stack / pot;
}

export function estimateDrawEquity(outs, cardsToCome) {
  const outCount = Number(outs);
  const streets = Number(cardsToCome);
  if (!Number.isFinite(outCount) || !Number.isFinite(streets) || outCount < 0) {
    return null;
  }
  if (streets >= 2) {
    return Math.min(outCount * 4, 100) / 100;
  }
  if (streets === 1) {
    return Math.min(outCount * 2, 100) / 100;
  }
  return 0;
}

export function classifyStartingHand(cardA, cardB) {
  if (!cardA || !cardB) {
    return { label: "未知", strength: "unknown" };
  }

  const high = cardA.value >= cardB.value ? cardA : cardB;
  const low = cardA.value >= cardB.value ? cardB : cardA;
  const suited = cardA.suit === cardB.suit;
  const gap = Math.abs(cardA.value - cardB.value);

  if (cardA.rank === cardB.rank) {
    if (cardA.value >= 12) return { label: "高口袋对子", strength: "premium" };
    if (cardA.value >= 8) return { label: "中口袋对子", strength: "medium" };
    return { label: "小口袋对子", strength: "speculative" };
  }

  if (high.rank === "A" && low.value >= 12) {
    return { label: suited ? "强同花 Broadway" : "强 Broadway", strength: "premium" };
  }

  if (high.value >= 10 && low.value >= 10) {
    return { label: suited ? "同花 Broadway" : "非同花 Broadway", strength: "strong" };
  }

  if (suited && gap <= 1 && high.value <= 11) {
    return { label: "同花连张", strength: "speculative" };
  }

  if (suited && high.rank === "A") {
    return { label: "同花 A 高牌", strength: "playable" };
  }

  return { label: suited ? "同花边缘牌" : "边缘杂牌", strength: suited ? "playable" : "weak" };
}
