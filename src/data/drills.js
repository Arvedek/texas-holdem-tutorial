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
    tags: ["preflop", "3bet"],
    situation: {
      title: "面对 CO open 的 BTN 决策",
      tableSize: "6-max",
      stack: "100bb",
      hero: "BTN · AQs",
      villain: "CO open 2.5bb",
      actionLine: "前面弃牌，CO 开池到 2.5bb，Hero 在 BTN 行动，盲位待行动。"
    },
    learningLinks: [
      { label: "3-bet", note: "复习 3-bet 的价值、阻断和位置优势。" },
      { label: "position", note: "有位置时可以更好实现权益，但不能无脑跟注。" },
      { label: "range", note: "用范围比较，而不是只看 AQs 这四个字符。" }
    ]
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
  },
  {
    id: "pf-007",
    type: "preflop",
    level: "入门",
    prompt: "4-max，CO 第一行动，手牌 KTs，100bb 深度。默认方向？",
    options: ["开池加注", "自动弃牌", "只 limp", "直接全下"],
    answer: "开池加注",
    explanation: "4-max CO 虽是最早位置，但后面人数少，KTs 有可玩性，适合按短桌纪律开池。",
    tags: ["preflop", "4-max"]
  },
  {
    id: "pf-008",
    type: "preflop",
    level: "入门",
    prompt: "5-max，HJ 第一行动，手牌 KJo。新人默认应怎样？",
    options: ["偏向弃牌", "任意尺度开池", "只 limp", "必然 4-bet"],
    answer: "偏向弃牌",
    explanation: "5-max HJ 是最早位置，KJo 容易被压制，新人先用更稳范围保护自己。",
    tags: ["preflop", "5-max"]
  },
  {
    id: "pf-009",
    type: "preflop",
    level: "初中级",
    prompt: "7-max，UTG 开池，你在 LJ 拿 ATo。默认纪律？",
    options: ["弃牌", "冷跟", "小 3-bet", "全下"],
    answer: "弃牌",
    explanation: "7-max UTG 范围较强，LJ 后面仍有多人未行动，ATo 被压制风险高。",
    tags: ["preflop", "7-max"]
  },
  {
    id: "pf-010",
    type: "preflop",
    level: "初中级",
    prompt: "8-max，UTG+1 第一行动，手牌 AJs。新人默认？",
    options: ["开池加注", "只 limp", "自动弃牌", "不看位置"],
    answer: "开池加注",
    explanation: "8-max UTG+1 仍是早位，但 AJs 属于可开强同花 Broadway，注意后位 3-bet。",
    tags: ["preflop", "8-max"]
  },
  {
    id: "pf-011",
    type: "preflop",
    level: "初中级",
    prompt: "9-max，UTG 第一行动，手牌 KQo。新人默认？",
    options: ["弃牌", "必开", "只 limp", "盲目全下"],
    answer: "弃牌",
    explanation: "满员桌 UTG 后面八个人，KQo 容易被更强 Broadway 和大对子压制。",
    tags: ["preflop", "9-max"]
  },
  {
    id: "dc-007",
    type: "decision",
    level: "初中级",
    prompt: "多人底池，CO open 后 BTN 和 BB 跟注，翻牌 T98 两同花。你拿 AK 无同花，默认？",
    options: ["多半过牌放弃", "机械 c-bet", "直接全下", "最小下注必赚"],
    answer: "多半过牌放弃",
    explanation: "多人湿润牌面命中跟注范围很多，AK 无后门很难让两名对手都弃牌，下注频率应下降。",
    tags: ["decision", "multiway"]
  },
  {
    id: "st-001",
    type: "decision",
    level: "入门",
    prompt: "BTN open，BB call。翻牌 A72 彩虹，Hero 在 BTN 持 KQo。默认下注计划？",
    options: ["小额 c-bet", "超池 all-in", "永远放弃", "只下满池"],
    answer: "小额 c-bet",
    explanation: "A 高干燥面有范围优势，小额 c-bet 能攻击大量未击中组合，同时风险较低。",
    tags: ["decision", "cbet", "range-advantage"],
    situation: {
      title: "范围优势高频小注",
      tableSize: "6-max",
      stack: "100bb",
      hero: "BTN · KQo",
      villain: "BB 防守",
      board: "A72 rainbow",
      pot: "5.5bb",
      actionLine: "BTN open 2.5bb，BB call；翻牌 BB check，Hero 行动。"
    },
    learningLinks: [
      { label: "c-bet", note: "复习哪些牌面适合高频小额持续下注。" },
      { label: "range advantage", note: "先判断整体范围优势，再决定下注频率。" }
    ]
  },
  {
    id: "st-002",
    type: "decision",
    level: "入门",
    prompt: "你在 BB 防守，翻牌 Q84 两同花，持 Q7o 面对 BTN 1/3 pot c-bet。默认？",
    options: ["跟注", "直接弃牌", "必然 check-raise", "超池 donk"],
    answer: "跟注",
    explanation: "顶对弱踢脚面对小注通常有继续价值，但不适合立刻把底池做大。",
    tags: ["decision", "defense", "relative-hand-strength"],
    situation: {
      title: "顶对弱踢脚的底池控制",
      tableSize: "6-max",
      stack: "100bb",
      hero: "BB · Q7o",
      villain: "BTN c-bet 1/3 pot",
      board: "Q84 two-tone",
      pot: "5.5bb",
      facing: "1.8bb",
      actionLine: "BTN open，BB call；翻牌 BB check，BTN 小额下注。"
    },
    learningLinks: [
      { label: "relative hand strength", note: "顶对不是自动三条街价值，要看踢脚和对手范围。" },
      { label: "pot control", note: "中强牌常用跟注控制底池。" }
    ]
  },
  {
    id: "st-003",
    type: "odds",
    level: "初中级",
    prompt: "转牌你有坚果同花听牌 9 outs，底池 100，对手下注 75。默认需要什么？",
    options: ["直接看赔率和隐含赔率", "任何时候秒跟", "永远弃牌", "不算价格全下"],
    answer: "直接看赔率和隐含赔率",
    explanation: "转牌 9 outs 到河牌约 18%，面对 75% pot 需要约 30% 直接胜率，通常要靠隐含赔率或加注弃牌率补足。",
    tags: ["odds", "outs", "flush-draw"],
    situation: {
      title: "转牌听牌价格",
      tableSize: "6-max",
      stack: "100bb",
      hero: "A♠ K♠",
      board: "Q♠ J♠ 2♦ 7♣",
      pot: "100",
      facing: "75",
      actionLine: "翻牌半诈唬被跟，转牌未中，对手领先下注 75。"
    },
    learningLinks: [
      { label: "outs", note: "先数 outs，再估算权益。" },
      { label: "pot odds", note: "价格不够时要看隐含赔率或弃牌率。" }
    ]
  },
  {
    id: "st-004",
    type: "decision",
    level: "初中级",
    prompt: "河牌你只有 bluff-catcher，对手是低频诈唬紧手，突然 1.5 倍池下注。默认？",
    options: ["大多弃牌", "必须 MDF 跟注", "永远加注", "随机点击"],
    answer: "大多弃牌",
    explanation: "MDF 是理论防守参考，不是面对低诈唬玩家的硬规则。对紧手超池下注，新手默认过度抓诈会烧钱。",
    tags: ["decision", "bluff-catch", "exploit"],
    situation: {
      title: "河牌抓诈纪律",
      tableSize: "9-max",
      stack: "120bb",
      hero: "一对",
      villain: "紧手河牌超池",
      board: "K J 8 4 2",
      pot: "80",
      facing: "120",
      actionLine: "你 check，对手河牌突然 1.5 倍池下注。"
    },
    learningLinks: [
      { label: "bluff-catch", note: "抓诈要看对手是否真的有足够诈唬。" },
      { label: "exploit", note: "对低诈唬玩家可以偏离理论多弃。" }
    ]
  },
  {
    id: "st-005",
    type: "preflop",
    level: "入门",
    prompt: "9-max，UTG open 2.5bb，你在 HJ 拿 ATo。新手默认？",
    options: ["弃牌", "冷跟", "小 3-bet", "直接全下"],
    answer: "弃牌",
    explanation: "满员桌 UTG 范围很强，ATo 容易被 AQ、AK、AJ 和大对子压制，后面还有多人未行动。",
    tags: ["preflop", "full-ring", "domination"],
    situation: {
      title: "面对早位强开池",
      tableSize: "9-max",
      stack: "100bb",
      hero: "HJ · ATo",
      villain: "UTG open 2.5bb",
      actionLine: "UTG 第一行动开池，MP 弃牌，Hero 在 HJ 行动，后面仍有 CO/BTN/盲位。"
    },
    learningLinks: [
      { label: "utg", note: "早位开池代表后面要过很多人，范围默认更强。" },
      { label: "domination", note: "ATo 这类牌最怕被更强 Ax 压制。" }
    ]
  },
  {
    id: "st-006",
    type: "preflop",
    level: "初中级",
    prompt: "BTN open，小盲弃牌，你在 BB 拿 72o。虽然有价格，默认？",
    options: ["弃牌", "任何两张都防守", "必然 3-bet", "跟注看运气"],
    answer: "弃牌",
    explanation: "大盲有折扣不等于全防。72o 可实现权益太差，长期会在无位置损失更多。",
    tags: ["preflop", "bb-defense", "equity-realization"],
    situation: {
      title: "大盲不是全蓝",
      tableSize: "6-max",
      stack: "100bb",
      hero: "BB · 72o",
      villain: "BTN open 2.3bb",
      actionLine: "BTN 偷盲开池，小盲弃牌，Hero 在大盲行动。"
    },
    learningLinks: [
      { label: "bb", note: "大盲防守要看价格，也要看手牌能否兑现权益。" },
      { label: "equity realization", note: "弱 offsuit 垃圾牌即使有折扣也很难打到摊牌。" }
    ]
  },
  {
    id: "st-007",
    type: "odds",
    level: "入门",
    prompt: "翻牌你有开放式顺子听牌 8 outs，底池 60，对手下注 20。默认？",
    options: ["多可跟注", "永远弃牌", "不算价格全下", "只看牌面颜色"],
    answer: "多可跟注",
    explanation: "8 outs 两张牌约 32%，面对 1/3 pot 价格较好，尤其有位置或隐含赔率时可以继续。",
    tags: ["odds", "open-ended", "pot-odds"],
    situation: {
      title: "翻牌开放式顺听牌",
      tableSize: "6-max",
      stack: "100bb",
      hero: "9♠ 8♠",
      board: "7♦ 6♣ 2♥",
      pot: "60",
      facing: "20",
      actionLine: "翻牌你 check，对手下注 20 到 60 的底池。"
    },
    learningLinks: [
      { label: "open-ended straight draw", note: "开放式顺子听牌通常约 8 outs。" },
      { label: "pot odds", note: "先看跟注价格，再看隐含赔率。" }
    ]
  },
  {
    id: "st-008",
    type: "decision",
    level: "初中级",
    prompt: "多人底池，翻牌 K72 彩虹，你在 CO 持 KJ，两个玩家都跟到翻牌。默认？",
    options: ["小心价值下注", "自动三条街打光", "纯诈唬", "直接弃牌顶对"],
    answer: "小心价值下注",
    explanation: "多人底池顶对价值下降，但 KJ 仍能从较差 Kx、7x 和口袋对子拿薄价值；尺度要克制。",
    tags: ["decision", "multiway", "thin-value"],
    situation: {
      title: "多人底池顶对降级",
      tableSize: "8-max",
      stack: "100bb",
      hero: "CO · KJ",
      villain: "BTN 与 BB 跟注",
      board: "K72 rainbow",
      pot: "9bb",
      actionLine: "CO open，BTN call，BB call；翻牌 BB check，Hero 行动。"
    },
    learningLinks: [
      { label: "multiway pot", note: "多人底池价值阈值提高，诈唬频率降低。" },
      { label: "thin value", note: "薄价值要想清楚哪些更差牌会跟。" }
    ]
  },
  {
    id: "st-009",
    type: "decision",
    level: "初中级",
    prompt: "河牌你拿顶两对，前面下注两街被跟，河牌完成明显同花。对手 check。默认？",
    options: ["多 check back", "必然超池价值", "任意牌都诈唬", "弃牌不用摊牌"],
    answer: "多 check back",
    explanation: "危险河牌会让更差两对和顶对少跟，反而被同花 check-raise。摊牌价值足够时可以控制。",
    tags: ["decision", "river", "showdown-value"],
    situation: {
      title: "危险河牌的摊牌价值",
      tableSize: "6-max",
      stack: "100bb",
      hero: "BTN · 顶两对",
      villain: "BB check",
      board: "A T 6 3 2 三同花",
      pot: "60bb",
      actionLine: "你翻牌、转牌下注被跟，河牌第三张同花落下，对手 check。"
    },
    learningLinks: [
      { label: "showdown value", note: "有摊牌价值不代表必须下注。" },
      { label: "river discipline", note: "河牌价值下注要确认更差牌会跟。" }
    ]
  },
  {
    id: "st-010",
    type: "decision",
    level: "进阶",
    prompt: "你 3-bet 后，翻牌低牌面 864 两同花，OOP 持 AKo 无后门。默认？",
    options: ["降低 c-bet 频率", "自动大注", "永远全下", "不看牌面继续下注"],
    answer: "降低 c-bet 频率",
    explanation: "低连湿润面更击中跟注方，AKo 无后门权益实现差，机械 c-bet 会被继续范围惩罚。",
    tags: ["decision", "3bet-pot", "board-texture"],
    situation: {
      title: "3-bet 底池低湿牌面",
      tableSize: "6-max",
      stack: "100bb",
      hero: "SB · AKo",
      villain: "BTN call 3-bet",
      board: "8♠ 6♠ 4♦",
      pot: "22bb",
      actionLine: "BTN open，SB 3-bet，BTN call；翻牌 Hero OOP 行动。"
    },
    learningLinks: [
      { label: "board texture", note: "低连湿润面会改变翻前加注者优势。" },
      { label: "3-bet pot", note: "3-bet 底池也不能机械持续下注。" }
    ]
  }
];
