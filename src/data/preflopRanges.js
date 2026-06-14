function range(tableSize, position, name, beginnerNote, openRaise, avoid, habit) {
  return {
    tableSize,
    position,
    name,
    beginnerNote,
    openRaise,
    avoid,
    habit
  };
}

function defend(tableSize, position, name, beginnerNote, defendHands, avoid, habit) {
  return {
    tableSize,
    position,
    name,
    beginnerNote,
    defend: defendHands,
    avoid,
    habit
  };
}

const blindAvoid = {
  sb: ["自动补齐", "用弱牌打无位置底池", "只因为便宜就看翻牌"],
  bb: ["面对大尺度仍防太宽", "翻后击中弱对就不肯放手", "用垃圾牌保护盲注"]
};

export const preflopRanges = [
  range("6-max", "UTG", "枪口位", "第一个行动，后面还有五个人。新人先打紧，避免被后位压制。", ["77+", "AJs+", "AQo+", "KQs"], ["A9o-AJo", "小同花 Ax", "低连张"], "不确定就弃牌，UTG 的纪律会保护你。"),
  range("6-max", "HJ", "劫位", "比 UTG 稍微自由，但仍然要尊重后面 CO、BTN 的位置优势。", ["66+", "ATs+", "AJo+", "KQs", "KJs+", "QJs", "JTs"], ["弱 Kx", "低 offsuit broadway", "无计划的小对子跟注"], "开池前先看按钮位是否激进。"),
  range("6-max", "CO", "关煞位", "开始进入偷盲位置，可以扩大范围，但别把所有同花牌都当好牌。", ["55+", "A8s+", "ATo+", "KTs+", "KQo", "QTs+", "JTs", "T9s", "98s"], ["弱 offsuit Ax", "间隔太大的同花牌", "容易被 3-bet 的边缘牌"], "前面弃牌越多，你越可以主动。"),
  range("6-max", "BTN", "按钮位", "最有利位置，可以偷盲更多，但要根据盲位防守习惯调整。", ["22+", "A2s+", "A8o+", "K8s+", "KTo+", "Q9s+", "QJo", "J9s+", "T8s+", "98s-65s"], ["过度迷恋任何两张同花", "被小盲 3-bet 后硬跟", "无计划多街诈唬"], "按钮位可以宽，但必须带着翻后计划。"),
  range("6-max", "SB", "小盲", "虽然只差半个盲注，但翻后最先行动。少跟注，多用加注或弃牌做简化。", ["44+", "A2s+", "A9o+", "K9s+", "KJo+", "QTs+", "JTs", "T9s"], blindAvoid.sb, "小盲的默认问题是位置差，不是价格便宜。"),
  defend("6-max", "BB", "大盲", "已经投入 1BB，可以防守更多，但要区分对手位置和加注尺度。", ["面对 BTN 可防守更多同花牌、连张和宽 Ax", "面对 UTG 要明显收紧", "可用强牌和部分阻断牌 3-bet"], blindAvoid.bb, "大盲不是免费牌，是折扣牌。折扣不等于必须买。"),

  range("7-max", "UTG", "枪口位", "7 人桌前位比 6-max 更紧，后面还有六个位置可能醒来强牌。", ["88+", "AJs+", "AQo+", "KQs"], ["AJo", "KQo", "小同花 Ax", "低连张"], "人数变多时，先收紧最早位置。"),
  range("7-max", "LJ", "低劫位", "LJ 介于早位和 HJ 之间，可以略松于 UTG，但还不是偷盲位置。", ["77+", "ATs+", "AQo+", "KQs", "KJs+", "QJs"], ["KJo", "QTo", "弱 offsuit Ax"], "LJ 先稳住强 Broadway 和对子。"),
  range("7-max", "HJ", "劫位", "到 HJ 后压力下降，可以加入更多同花 Broadway 和中对子。", ["66+", "A9s+", "AJo+", "KTs+", "KQo", "QTs+", "JTs"], ["弱 Kx", "太低的同花间隔牌", "无计划冷跟"], "HJ 仍要尊重 CO 和 BTN 的位置优势。"),
  range("7-max", "CO", "关煞位", "CO 是主要偷盲位置之一，但 7 人桌前面弃牌后的范围仍要比按钮位稳。", ["55+", "A7s+", "ATo+", "KTs+", "KQo", "QTs+", "JTs", "T9s", "98s"], ["垃圾同花", "弱 offsuit Ax", "容易被 3-bet 后尴尬的牌"], "CO 主动，但不要把它当 BTN。"),
  range("7-max", "BTN", "按钮位", "按钮位信息最多，可以打开最宽的新人默认开池范围。", ["22+", "A2s+", "A8o+", "K8s+", "KTo+", "Q9s+", "QJo", "J9s+", "T8s+", "98s-65s"], ["任何两张同花", "面对激进盲位仍开太宽", "被 3-bet 后情绪跟注"], "BTN 宽开池，翻后用位置兑现权益。"),
  range("7-max", "SB", "小盲", "小盲仍然无位置，面对大盲不要只因为没人加注就随便补齐。", ["44+", "A2s+", "A9o+", "K9s+", "KJo+", "QTs+", "JTs", "T9s"], blindAvoid.sb, "小盲用加注或弃牌简化决策。"),
  defend("7-max", "BB", "大盲", "大盲防守要看开池者位置；7 人桌 UTG 比 6-max UTG 更强。", ["面对 BTN/SB 可防守较宽", "面对 UTG/LJ 明显收紧", "强牌和好阻断牌可 3-bet"], blindAvoid.bb, "先识别开池位置，再决定折扣是否值得买。"),

  range("8-max", "UTG", "枪口位", "8 人桌 UTG 属于很早的位置，默认只开强牌，减少被后位压制。", ["99+", "AQs+", "AKo", "KQs"], ["AJo", "KQo", "小对子盲目开", "弱同花 Ax"], "8 人桌 UTG 的关键词是耐心。"),
  range("8-max", "UTG+1", "枪口后一位", "比 UTG 稍宽，但仍然属于早位，不能照搬 6-max HJ。", ["88+", "AJs+", "AQo+", "KQs"], ["ATo", "KJo", "QJo", "低连张"], "UTG+1 只比 UTG 多一点，不是中后位。"),
  range("8-max", "LJ", "低劫位", "LJ 开始进入中位，可以加入部分同花 Broadway 和中对子。", ["77+", "ATs+", "AQo+", "KQs", "KJs+", "QJs", "JTs"], ["弱 offsuit broadway", "低同花 Kx", "无计划小对子"], "LJ 需要兼顾主动和后位压力。"),
  range("8-max", "HJ", "劫位", "HJ 比 LJ 更接近偷盲位置，但后面仍有 CO、BTN 和盲位。", ["66+", "A9s+", "AJo+", "KTs+", "KQo", "QTs+", "JTs", "T9s"], ["弱 Ax offsuit", "太低的同花间隔牌", "怕 3-bet 的边缘牌"], "HJ 可以扩，但仍先选可玩性好的牌。"),
  range("8-max", "CO", "关煞位", "CO 是强偷盲位置，适合用位置和主动权施压。", ["55+", "A7s+", "ATo+", "KTs+", "KQo", "QTs+", "JTs", "T9s", "98s"], ["弱 offsuit Ax", "垃圾同花", "只想看翻牌的跟注心态"], "CO 的盈利来自主动，不是便宜看牌。"),
  range("8-max", "BTN", "按钮位", "按钮位范围最宽，但仍要看盲位是否喜欢 3-bet 或跟注。", ["22+", "A2s+", "A8o+", "K8s+", "KTo+", "Q9s+", "QJo", "J9s+", "T8s+", "98s-65s"], ["任何两张", "被盲位针对后不调整", "无计划多街开火"], "BTN 的宽度要配合观察。"),
  range("8-max", "SB", "小盲", "小盲没有位置优势，8 人桌也不例外。", ["44+", "A2s+", "A9o+", "K9s+", "KJo+", "QTs+", "JTs", "T9s"], blindAvoid.sb, "小盲别把半个盲注当成必须补票。"),
  defend("8-max", "BB", "大盲", "面对早位要更紧，面对 CO/BTN/SB 才能用折扣防守更多。", ["面对后位开池可防守较宽", "面对 UTG/UTG+1 要保守", "用强牌和合适阻断牌 3-bet"], blindAvoid.bb, "大盲防守不是固定表，是对开池范围的回应。"),

  range("9-max", "UTG", "枪口位", "9 人满员桌 UTG 后面还有八个位置，默认应是全工具里最紧开池。", ["TT+", "AQs+", "AKo"], ["99 以下小对子", "AJo", "KQo", "弱同花 Ax"], "满员桌 UTG 宁可少开，不要用 6-max 思维硬套。"),
  range("9-max", "UTG+1", "枪口后一位", "仍然是早位，范围只比 UTG 略宽。", ["99+", "AJs+", "AQo+", "KQs"], ["ATo", "KJo", "QJo", "低 suited connector"], "早位多一个玩家差异很大，别扩太快。"),
  range("9-max", "MP", "中位", "MP 开始进入中间位置，但后面还有 LJ/HJ/CO/BTN。", ["88+", "ATs+", "AQo+", "KQs", "KJs+", "QJs"], ["KTo", "QTo", "弱 Ax offsuit", "低连张"], "MP 是过渡位置，不是偷盲位置。"),
  range("9-max", "LJ", "低劫位", "LJ 可以加入更多可玩性牌，但仍要防后位挤压。", ["77+", "ATs+", "AJo+", "KQs", "KJs+", "QJs", "JTs"], ["弱 Kx", "低 offsuit broadway", "无计划冷跟"], "LJ 开始主动，但不要忘记后面还有四个位置。"),
  range("9-max", "HJ", "劫位", "HJ 已接近后位，可以比 MP 明显宽一些。", ["66+", "A9s+", "AJo+", "KTs+", "KQo", "QTs+", "JTs", "T9s"], ["弱 offsuit Ax", "垃圾同花", "容易被 3-bet 的边缘牌"], "HJ 的宽度建立在前面都弃牌。"),
  range("9-max", "CO", "关煞位", "CO 是满员桌主要进攻位置，适合偷盲和施压。", ["55+", "A7s+", "ATo+", "KTs+", "KQo", "QTs+", "JTs", "T9s", "98s"], ["弱 offsuit Ax", "低同花间隔牌", "被按钮位针对后硬扛"], "CO 要关注按钮位玩家是否激进。"),
  range("9-max", "BTN", "按钮位", "满员桌按钮位仍是最赚钱位置，但前面弃牌到你时才适用宽范围。", ["22+", "A2s+", "A8o+", "K8s+", "KTo+", "Q9s+", "QJo", "J9s+", "T8s+", "98s-65s"], ["任何两张", "无视盲位 3-bet", "弱牌被跟后乱打"], "按钮位宽开池，但别宽跟 3-bet。"),
  range("9-max", "SB", "小盲", "小盲翻后无位置，满员桌也建议新人少补齐、多加注或弃牌。", ["44+", "A2s+", "A9o+", "K9s+", "KJo+", "QTs+", "JTs", "T9s"], blindAvoid.sb, "小盲不要因为已经投半盲就失去纪律。"),
  defend("9-max", "BB", "大盲", "满员桌早位范围更强，所以大盲面对早位要比 6-max 更保守。", ["面对 BTN/SB 可较宽防守", "面对 UTG/UTG+1 很紧", "用 QQ+、AK 和部分阻断牌 3-bet"], blindAvoid.bb, "大盲先问：对手从几人桌哪个位置开池？")
];
