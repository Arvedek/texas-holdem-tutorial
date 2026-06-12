import { RANK_VALUES } from "./cards.js";

function unique(values) {
  return [...new Set(values)];
}

export function analyzeBoardTexture(cards) {
  if (!Array.isArray(cards) || cards.length === 0) {
    return {
      labels: ["无公共牌"],
      paired: "none",
      suitState: "none",
      connectivity: "unknown",
      height: "unknown",
      wetness: "unknown",
      explanation: "还没有输入公共牌，暂时无法判断牌面结构。"
    };
  }

  const ranks = cards.map((card) => card.rank);
  const values = cards.map((card) => card.value || RANK_VALUES[card.rank]);
  const suits = cards.map((card) => card.suit);
  const uniqueRanks = unique(ranks);
  const uniqueSuits = unique(suits);
  const sorted = unique(values).sort((a, b) => a - b);
  const maxGap = sorted.length > 1 ? Math.max(...sorted.slice(1).map((value, index) => value - sorted[index])) : 0;
  const span = sorted.length > 1 ? sorted[sorted.length - 1] - sorted[0] : 0;

  const paired = uniqueRanks.length <= ranks.length - 2 ? "trips-or-two-pair" : uniqueRanks.length < ranks.length ? "paired" : "unpaired";
  const suitCounts = suits.reduce((counts, suit) => {
    counts[suit] = (counts[suit] || 0) + 1;
    return counts;
  }, {});
  const maxSuitCount = Math.max(...Object.values(suitCounts));
  const suitState = maxSuitCount >= 3 && cards.length >= 3 ? "monotone" : maxSuitCount === 2 ? "two-tone" : "rainbow";
  const connectivity = span <= 4 && maxGap <= 2 && sorted.length >= 3 ? "connected" : span <= 6 && maxGap <= 3 ? "semi-connected" : "disconnected";
  const average = values.reduce((sum, value) => sum + value, 0) / values.length;
  const height = average >= 11 ? "high" : average >= 8 ? "middle" : "low";
  const wetSignals = [suitState !== "rainbow", connectivity !== "disconnected", paired !== "unpaired"].filter(Boolean).length;
  const wetness = wetSignals >= 2 ? "wet" : wetSignals === 1 ? "semi-wet" : "dry";
  const labels = [];

  labels.push(paired === "unpaired" ? "未配对" : paired === "paired" ? "配对面" : "三条/双配对面");
  labels.push(suitState === "monotone" ? "单调同花面" : suitState === "two-tone" ? "双花面" : "彩虹面");
  labels.push(connectivity === "connected" ? "连通面" : connectivity === "semi-connected" ? "半连通面" : "断裂面");
  labels.push(height === "high" ? "高牌面" : height === "middle" ? "中张面" : "低牌面");
  labels.push(wetness === "wet" ? "湿润" : wetness === "semi-wet" ? "半湿润" : "干燥");

  const explanation = `${labels.join("，")}。${wetness === "dry" ? "听牌较少，翻前主动方更容易用小尺度施压。" : "听牌和强牌组合较多，需要更谨慎地规划下注尺度和后续街。"} `;

  return {
    labels,
    paired,
    suitState,
    connectivity,
    height,
    wetness,
    explanation: explanation.trim()
  };
}
