export const lessons = [
  {
    id: "rules-hand-rankings",
    stage: 1,
    title: "规则、牌力与摊牌逻辑",
    summary: "建立德州扑克的基本地图：两张手牌、五张公共牌、四轮下注，以及最终用五张牌组成最大牌型。",
    concepts: ["行动顺序", "盲注", "公共牌", "摊牌", "牌型大小"],
    mistakes: ["只看自己手牌不看公共牌", "忘记同花和顺子的公共牌威胁", "把两对和三条的相对强度误判"],
    task: "随机发 10 个公共牌面，写下当前最大可能牌型。",
    drillTags: ["rules", "board"],
    resourceTags: ["beginner", "rules"]
  },
  {
    id: "position-blinds-action",
    stage: 2,
    title: "位置、盲注与信息优势",
    summary: "位置决定你获得信息的多少。按钮位和后位可以打更多牌，小盲和大盲则长期承受位置劣势。",
    concepts: ["UTG", "HJ", "CO", "BTN", "SB", "BB", "位置优势"],
    mistakes: ["前位开太松", "小盲跟注太多", "按钮位没有主动偷盲"],
    task: "把 6-max 的六个位置按信息优势从高到低排序。",
    drillTags: ["position", "preflop"],
    resourceTags: ["beginner", "preflop"]
  },
  {
    id: "preflop-ranges",
    stage: 3,
    title: "翻前范围与起手牌纪律",
    summary: "翻前不是凭感觉看牌，而是根据位置、前面行动、筹码深度和对手倾向决定范围。",
    concepts: ["开池范围", "跟注范围", "3-bet", "隔离加注", "阻断牌"],
    mistakes: ["低同花牌过度入池", "被 3-bet 后用劣势牌硬跟", "没有按位置收紧范围"],
    task: "用 20 手牌练习：你在 CO、BTN、SB 分别会怎么行动。",
    drillTags: ["preflop", "range"],
    resourceTags: ["intermediate", "range"]
  },
  {
    id: "flop-texture-cbet",
    stage: 4,
    title: "翻牌面结构与持续下注",
    summary: "翻牌决策要看谁的范围击中了牌面、听牌密度如何、下注能让哪些更差牌继续或更好牌弃掉。",
    concepts: ["干燥牌面", "湿润牌面", "范围优势", "坚果优势", "c-bet"],
    mistakes: ["所有牌面都自动 c-bet", "湿润牌面给免费牌", "拿摊牌价值牌过度诈唬"],
    task: "分类 10 个翻牌面：干/湿、高/低、谁更有范围优势。",
    drillTags: ["board", "decision"],
    resourceTags: ["intermediate", "postflop"]
  },
  {
    id: "odds-spr-bankroll",
    stage: 5,
    title: "赔率、SPR 与资金管理",
    summary: "数学让你少做昂贵的情绪决策。底池赔率、outs、SPR 和资金管理决定长期能否活下来。",
    concepts: ["底池赔率", "outs", "2/4 法则", "SPR", "买入管理"],
    mistakes: ["听牌价格不够仍跟注", "深筹码用顶对打光", "资金不足还升盲"],
    task: "计算 8 个跟注场景的最低所需胜率。",
    drillTags: ["odds", "spr"],
    resourceTags: ["intermediate", "math"]
  },
  {
    id: "gto-exploit-review",
    stage: 6,
    title: "GTO 入门、剥削调整与复盘习惯",
    summary: "GTO 提供基准，剥削策略负责赚钱。复盘的目标不是找一个标准答案，而是找到反复出现的漏洞。",
    concepts: ["平衡", "频率", "blocker", "剥削", "手牌标记"],
    mistakes: ["把 solver 结果当死记答案", "低级别过度诈唬", "只复盘输掉的大底池"],
    task: "复盘 3 手牌，分别标记一个范围判断、一个下注尺度、一个心态问题。",
    drillTags: ["decision", "review"],
    resourceTags: ["advanced", "gto"]
  }
];
