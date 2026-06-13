export const preflopRanges = [
  {
    position: "UTG",
    name: "枪口位",
    beginnerNote: "第一个行动，后面还有五个人。新人先打紧，避免被后位压制。",
    openRaise: ["77+", "AJs+", "AQo+", "KQs"],
    avoid: ["A9o-AJo", "小同花 Ax", "低连张"],
    habit: "不确定就弃牌，UTG 的纪律会保护你。"
  },
  {
    position: "HJ",
    name: "劫位",
    beginnerNote: "比 UTG 稍微自由，但仍然要尊重后面 CO、BTN 的位置优势。",
    openRaise: ["66+", "ATs+", "AJo+", "KQs", "KJs+", "QJs", "JTs"],
    avoid: ["弱 Kx", "低 offsuit broadway", "无计划的小对子跟注"],
    habit: "开池前先看按钮位是否激进。"
  },
  {
    position: "CO",
    name: "关煞位",
    beginnerNote: "开始进入偷盲位置，可以扩大范围，但别把所有同花牌都当好牌。",
    openRaise: ["55+", "A8s+", "ATo+", "KTs+", "KQo", "QTs+", "JTs", "T9s", "98s"],
    avoid: ["弱 offsuit Ax", "间隔太大的同花牌", "容易被 3-bet 的边缘牌"],
    habit: "前面弃牌越多，你越可以主动。"
  },
  {
    position: "BTN",
    name: "按钮位",
    beginnerNote: "最有利位置，可以偷盲更多，但要根据盲位防守习惯调整。",
    openRaise: ["22+", "A2s+", "A8o+", "K8s+", "KTo+", "Q9s+", "QJo", "J9s+", "T8s+", "98s-65s"],
    avoid: ["过度迷恋任何两张同花", "被小盲 3-bet 后硬跟", "无计划多街诈唬"],
    habit: "按钮位可以宽，但必须带着翻后计划。"
  },
  {
    position: "SB",
    name: "小盲",
    beginnerNote: "虽然只差半个盲注，但翻后最先行动。少跟注，多用加注或弃牌做简化。",
    openRaise: ["44+", "A2s+", "A9o+", "K9s+", "KJo+", "QTs+", "JTs", "T9s"],
    avoid: ["自动补齐", "用弱牌打无位置底池", "只因为便宜就看翻牌"],
    habit: "小盲的默认问题是位置差，不是价格便宜。"
  },
  {
    position: "BB",
    name: "大盲",
    beginnerNote: "已经投入 1BB，可以防守更多，但要区分对手位置和加注尺度。",
    defend: ["面对 BTN 可防守更多同花牌、连张和宽 Ax", "面对 UTG 要明显收紧", "可用强牌和部分阻断牌 3-bet"],
    avoid: ["面对大尺度仍防太宽", "翻后击中弱对就不肯放手", "用垃圾牌保护盲注"],
    habit: "大盲不是免费牌，是折扣牌。折扣不等于必须买。"
  }
];
