export const drillTypes = {
  preflop: "翻前范围",
  odds: "赔率与 outs",
  board: "牌面结构",
  decision: "决策题"
};

export const drills = [
  {
    id: "pf-001",
    type: "preflop",
    level: "入门",
    prompt: "6-max，UTG 第一行动，手牌 AJo，常规 100bb 深度。默认策略？",
    options: ["弃牌", "跟注", "开池加注", "全下"],
    answer: "弃牌",
    explanation: "AJo 在 UTG 容易被后位更强 Ax 和口袋对子压制，新手阶段应偏紧。",
    tags: ["preflop", "position"]
  },
  {
    id: "pf-002",
    type: "preflop",
    level: "入门",
    prompt: "6-max，BTN 无人入池，手牌 K9s。默认策略？",
    options: ["弃牌", "跟注", "开池加注", "只看翻牌不加注"],
    answer: "开池加注",
    explanation: "按钮位有位置优势，K9s 可玩性好，适合偷盲开池。",
    tags: ["preflop", "button"]
  },
  {
    id: "pf-003",
    type: "preflop",
    level: "入门",
    prompt: "CO 开池，BTN 手持 AQs。默认策略？",
    options: ["弃牌", "冷跟", "3-bet", "最小跟注"],
    answer: "3-bet",
    explanation: "AQs 对 CO 开池范围有明显价值和阻断效果，BTN 位置也利于施压。",
    tags: ["preflop", "3bet"]
  },
  {
    id: "pf-004",
    type: "preflop",
    level: "初中级",
    prompt: "UTG 开池，HJ 手持 76s，后面玩家正常。默认策略？",
    options: ["弃牌", "跟注", "3-bet", "全下"],
    answer: "弃牌",
    explanation: "同花连张有隐含赔率，但面对前位强范围且后面多人未行动，直接弃牌更稳。",
    tags: ["preflop", "range"]
  },
  {
    id: "pf-005",
    type: "preflop",
    level: "初中级",
    prompt: "SB 面对 BTN 开池，手牌 A5s。常见主动策略？",
    options: ["弃牌", "只跟注", "3-bet", "明牌弃牌"],
    answer: "3-bet",
    explanation: "A5s 有 A 阻断和顺同花潜力，小盲无位置，常用 3-bet 减少被动防守。",
    tags: ["preflop", "blind"]
  },
  {
    id: "pf-006",
    type: "preflop",
    level: "初中级",
    prompt: "多人 limp 到你在 CO，手持 QQ。最佳方向？",
    options: ["跟着 limp", "隔离加注", "弃牌", "只加到 2bb"],
    answer: "隔离加注",
    explanation: "QQ 是强价值牌，应通过较大隔离加注减少多人底池并扩大价值。",
    tags: ["preflop", "isolation"]
  },
  {
    id: "od-001",
    type: "odds",
    level: "入门",
    prompt: "底池 100，对手下注 50。你跟注 50 需要约多少胜率？",
    options: ["20%", "25%", "33%", "50%"],
    answer: "25%",
    explanation: "跟注后最终底池为 200，50/200 = 25%。",
    tags: ["odds", "math"]
  },
  {
    id: "od-002",
    type: "odds",
    level: "入门",
    prompt: "翻牌你有同花听牌，通常有 9 个 outs。到河牌约多少胜率？",
    options: ["18%", "27%", "36%", "54%"],
    answer: "36%",
    explanation: "两张牌未发时用 4 法则估算：9 x 4 = 36%。",
    tags: ["odds", "outs"]
  },
  {
    id: "od-003",
    type: "odds",
    level: "入门",
    prompt: "转牌你有开放式顺子听牌 8 outs，到河牌约多少胜率？",
    options: ["8%", "16%", "24%", "32%"],
    answer: "16%",
    explanation: "一张牌未发时用 2 法则估算：8 x 2 = 16%。",
    tags: ["odds", "outs"]
  },
  {
    id: "od-004",
    type: "odds",
    level: "初中级",
    prompt: "底池 80，对手下注 80。你跟注需要约多少胜率？",
    options: ["25%", "33%", "40%", "50%"],
    answer: "33%",
    explanation: "跟注后最终底池为 240，80/240 约等于 33%。",
    tags: ["odds", "math"]
  },
  {
    id: "od-005",
    type: "odds",
    level: "初中级",
    prompt: "底池 120，你剩余 360。当前 SPR 是多少？",
    options: ["1", "2", "3", "6"],
    answer: "3",
    explanation: "SPR = 有效后手 / 当前底池 = 360 / 120 = 3。",
    tags: ["spr", "math"]
  },
  {
    id: "od-006",
    type: "odds",
    level: "初中级",
    prompt: "你只有 4 outs，转牌面对 75% pot 下注。默认倾向？",
    options: ["轻松跟注", "多数弃牌", "必定加注", "只看心情"],
    answer: "多数弃牌",
    explanation: "4 outs 到河牌约 8%，通常不够支付 75% pot 的价格，除非隐含赔率很高。",
    tags: ["odds", "discipline"]
  },
  {
    id: "bd-001",
    type: "board",
    level: "入门",
    prompt: "翻牌 A♠ 7♦ 2♣ 的结构？",
    options: ["干燥高牌面", "湿润连张面", "同花听牌面", "双对子面"],
    answer: "干燥高牌面",
    explanation: "A72 彩虹不连，听牌少，翻前加注者通常有范围优势。",
    tags: ["board", "dry"]
  },
  {
    id: "bd-002",
    type: "board",
    level: "入门",
    prompt: "翻牌 J♠ T♠ 9♦ 的结构？",
    options: ["极干燥", "湿润连张面", "无听牌", "低牌面"],
    answer: "湿润连张面",
    explanation: "J-T-9 高度连通且有同花听牌，双方都有大量听牌和强成牌。",
    tags: ["board", "wet"]
  },
  {
    id: "bd-003",
    type: "board",
    level: "入门",
    prompt: "翻牌 8♥ 8♣ 2♦ 的结构？",
    options: ["配对干燥面", "单调同花面", "四连张", "高牌湿润面"],
    answer: "配对干燥面",
    explanation: "配对且不连不成同花，听牌少，下注尺度通常可偏小。",
    tags: ["board", "paired"]
  },
  {
    id: "bd-004",
    type: "board",
    level: "初中级",
    prompt: "翻牌 K♣ Q♣ 4♣ 的结构？",
    options: ["彩虹干燥", "单调同花面", "低牌面", "无范围优势"],
    answer: "单调同花面",
    explanation: "三张同花会显著改变价值和诈唬范围，需要考虑 A♣、强同花和阻断牌。",
    tags: ["board", "monotone"]
  },
  {
    id: "bd-005",
    type: "board",
    level: "初中级",
    prompt: "UTG 开池，BB 防守。翻牌 A K 3 彩虹，谁通常有范围优势？",
    options: ["UTG", "BB", "完全一样", "按钮位"],
    answer: "UTG",
    explanation: "UTG 强 Ax、Kx 和高对子比例更高，BB 有更多弱杂牌。",
    tags: ["board", "range"]
  },
  {
    id: "bd-006",
    type: "board",
    level: "初中级",
    prompt: "BTN 开池，BB 防守。翻牌 6 5 4 双花，谁的坚果组合更多？",
    options: ["BTN 总是更多", "BB 往往更多", "两者都没有", "小盲更多"],
    answer: "BB 往往更多",
    explanation: "BB 防守范围包含更多低连张和两对组合，BTN 有范围优势但坚果优势未必明显。",
    tags: ["board", "range"]
  },
  {
    id: "dc-001",
    type: "decision",
    level: "入门",
    prompt: "你翻前加注，BTN 跟注。翻牌 A72 彩虹，你在 CO 持 KQ。默认方向？",
    options: ["小额 c-bet", "直接全下", "超池诈唬", "永远 check-fold"],
    answer: "小额 c-bet",
    explanation: "A 高干燥面有范围优势，小额持续下注能攻击大量未击中牌。",
    tags: ["decision", "cbet"]
  },
  {
    id: "dc-002",
    type: "decision",
    level: "入门",
    prompt: "你持顶对弱踢脚，湿润牌面被紧手转牌大加注。默认纪律？",
    options: ["冷静弃牌", "必定跟到底", "再反加", "不看牌全下"],
    answer: "冷静弃牌",
    explanation: "紧手大加注通常价值偏多，顶对弱踢脚不适合打大底池。",
    tags: ["decision", "discipline"]
  },
  {
    id: "dc-003",
    type: "decision",
    level: "入门",
    prompt: "你有坚果同花，河牌面对对手下注。默认目标？",
    options: ["价值加注", "只跟注永不加", "弃牌", "最小诈唬"],
    answer: "价值加注",
    explanation: "坚果牌应主动从更差同花、顺子、两对和强顶对处拿价值。",
    tags: ["decision", "value"]
  },
  {
    id: "dc-004",
    type: "decision",
    level: "初中级",
    prompt: "你河牌错过听牌，但手里有阻断坚果的 A♠，对手范围中有很多一对。可考虑？",
    options: ["合适频率诈唬", "永远摊牌", "明牌弃牌", "只用最小下注"],
    answer: "合适频率诈唬",
    explanation: "阻断坚果同花时，部分错过听牌可以作为河牌诈唬候选。",
    tags: ["decision", "blocker"]
  },
  {
    id: "dc-005",
    type: "decision",
    level: "初中级",
    prompt: "低级别对手跟注过宽、很少弃顶对。你的调整？",
    options: ["少诈唬多价值", "更多空枪三条街", "只玩 GTO 频率", "任何牌都全下"],
    answer: "少诈唬多价值",
    explanation: "面对跟注站，价值下注变薄，纯诈唬频率应下降。",
    tags: ["decision", "exploit"]
  },
  {
    id: "dc-006",
    type: "decision",
    level: "初中级",
    prompt: "你在大盲防守，翻牌中等对子，面对 1/3 pot c-bet。默认？",
    options: ["多数继续", "永远弃牌", "必定全下", "只用最小加注"],
    answer: "多数继续",
    explanation: "小尺度给了较好价格，中等对子通常有摊牌价值，可跟注进入转牌。",
    tags: ["decision", "defense"]
  }
];
