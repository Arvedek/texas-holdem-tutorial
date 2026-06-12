const RANK_ALIASES = {
  A: "A",
  K: "K",
  Q: "Q",
  J: "J",
  T: "T",
  "10": "T",
  9: "9",
  8: "8",
  7: "7",
  6: "6",
  5: "5",
  4: "4",
  3: "3",
  2: "2"
};

const SUIT_ALIASES = {
  s: "s",
  h: "h",
  d: "d",
  c: "c",
  "♠": "s",
  "♥": "h",
  "♦": "d",
  "♣": "c"
};

export const RANK_VALUES = {
  A: 14,
  K: 13,
  Q: 12,
  J: 11,
  T: 10,
  9: 9,
  8: 8,
  7: 7,
  6: 6,
  5: 5,
  4: 4,
  3: 3,
  2: 2
};

const SUIT_SYMBOLS = {
  s: "♠",
  h: "♥",
  d: "♦",
  c: "♣"
};

export function parseCard(input) {
  const raw = String(input || "").trim();
  const match = raw.match(/^(10|[AKQJT2-9])([shdc♠♥♦♣])$/i);

  if (!match) {
    return { ok: false, error: `无效牌面：${raw || "空值"}` };
  }

  const rank = RANK_ALIASES[match[1].toUpperCase()];
  const suit = SUIT_ALIASES[match[2].toLowerCase()] || SUIT_ALIASES[match[2]];

  if (!rank || !suit) {
    return { ok: false, error: `无效牌面：${raw}` };
  }

  return {
    ok: true,
    card: {
      rank,
      suit,
      value: RANK_VALUES[rank],
      code: `${rank}${suit}`
    }
  };
}

export function parseCards(input) {
  const raw = String(input || "").trim();
  if (!raw) {
    return { ok: true, cards: [] };
  }

  const tokens = raw.split(/[\s,，]+/).filter(Boolean);
  const cards = [];

  for (const token of tokens) {
    const parsed = parseCard(token);
    if (!parsed.ok) {
      return parsed;
    }
    cards.push(parsed.card);
  }

  return { ok: true, cards };
}

export function hasDuplicateCards(cards) {
  const seen = new Set();
  for (const card of cards) {
    if (seen.has(card.code)) {
      return true;
    }
    seen.add(card.code);
  }
  return false;
}

export function formatCard(card) {
  if (!card) {
    return "";
  }
  return `${card.rank}${SUIT_SYMBOLS[card.suit] || card.suit}`;
}
