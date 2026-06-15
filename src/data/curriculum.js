const chapterIds = [
  "table-language-notation",
  "rules-hand-rankings-showdown",
  "positions-blinds-action-order",
  "starting-hands-range-thinking",
  "open-limp-isolate-call-fold",
  "three-bet-four-bet-squeeze",
  "blind-defense-steals-rake",
  "board-texture-reading",
  "relative-hand-strength",
  "bet-purpose-sizing",
  "cbet-probe-donk-checkraise",
  "multiway-pots",
  "equity-outs-odds-realization",
  "spr-stack-depth-commitment",
  "turn-river-planning",
  "opponent-types-exploit",
  "gto-basics-range-advantage",
  "formats-bankroll-mental-game",
  "hand-review-study-routine"
];

function sec(heading, body, keyTakeaway) {
  return { heading, body, keyTakeaway };
}

function ex(title, scenario, analysis, takeaway) {
  return { title, scenario, analysis, takeaway };
}

function miss(mistake, whyItHurts, betterHabit) {
  return { mistake, whyItHurts, betterHabit };
}

function q(question, options, answer, explanation) {
  return { question, options, answer, explanation };
}

function task(title, body) {
  return { title, body };
}

function refTable(title, columns, rows) {
  return { title, columns, rows };
}

function nextChapter(label, chapterIndex, note) {
  return { label, route: "learning", chapterId: chapterIds[chapterIndex], note };
}

function nextRoute(label, route, note) {
  return { label, route, note };
}

function chapter(data) {
  const sections = data.sections;
  return {
    ...data,
    textbook: sections.map((section) => ({ ...section })),
    concepts: data.concepts || data.relatedTerms.slice(0, 6),
    mistakes: data.mistakeDetails.map((item) => item.mistake),
    task: data.task || data.practiceTasks[0].body,
    drillTags: data.drillTags || data.relatedTerms.slice(0, 3),
    resourceTags: data.resourceTags || [data.difficulty, data.id]
  };
}

export const curriculumChapters = [
  chapter({
    id: chapterIds[0],
    stage: 1,
    title: "牌桌语言与记号系统",
    subtitle: "先把牌桌上的字母、单位和行动词读懂",
    difficulty: "beginner",
    estimatedMinutes: 12,
    beginnerSafe: true,
    summary: "本章建立德州扑克的共同语言：花色、点数、手牌写法、BB 单位和常见行动词。",
    plainLanguage: "如果你看不懂 As、AKs、2.5BB、call、fold，就像还没学会路标就上路。本章只解决一件事：让牌桌信息不再像暗号。",
    tableExample: "记录牌局时写 BTN open 2.5BB, BB call, flop As 7d 2c，意思是按钮位加注到 2.5 个大盲，大盲跟注，翻牌是黑桃 A、方块 7、梅花 2。",
    whyItMatters: "统一记号能让你复盘、查范围、听讲解时不迷路，也能减少把同花、非同花和位置看错的低级失误。",
    miniChecklist: ["先确认花色和点数", "把筹码换算成 BB", "记录每一轮谁做了什么行动"],
    encouragement: "这一章像给牌桌装字幕。字幕清楚了，后面的策略才听得进去。",
    goals: [
      "能读懂 As、Kh、AKs、AQo、77 这类常见写法",
      "能用 BB 描述下注、加注和有效筹码",
      "能区分 bet、raise、call、check、fold 的牌桌含义"
    ],
    prerequisites: [],
    sections: [
      sec("花色与点数", "德州使用四种花色：黑桃、红桃、方块、梅花；点数从 2 到 A。记录时常用 s、h、d、c 表示花色，例如 As 是黑桃 A，Td 是方块 T。", "先把每张牌准确读出来，才谈得上读牌。"),
      sec("手牌缩写", "AKs 代表 AK 同花，AQo 代表 AQ 非同花，77 代表一对 7。s 和 o 描述两张手牌是否同花，不描述公共牌。", "同花和非同花会显著改变起手牌价值。"),
      sec("BB 单位", "BB 是 big blind，大盲。用 BB 记录筹码可以跨级别比较，例如 100BB 深筹码和 20BB 短筹码的计划完全不同。", "用 BB 思考，比用具体金额更稳定。"),
      sec("行动词", "check 是过牌，bet 是无人下注时下注，raise 是面对下注再加注，call 是跟注，fold 是弃牌。记录行动顺序时要保留位置。", "行动词告诉你范围怎样变化。")
    ],
    examples: [
      ex("AQs 与 AQo", "你看到资料写 CO open AQs+, AQo+。", "AQs 是 AQ 同花，AQo 是 AQ 非同花；加号表示包含更强的同类牌。读错一个字母，范围理解就会偏很多。", "范围表先读记号，再看位置。"),
      ex("2.5BB 开池", "盲注 1/2 的现金桌，BTN 加注到 5。", "大盲是 2，所以加注到 5 等于 2.5BB。换成 BB 后，你可以和其他级别的标准开池尺度比较。", "筹码金额要翻译成 BB 才有策略意义。")
    ],
    decisionFlow: [
      "第一步：读出自己的两张手牌和花色。",
      "第二步：把下注金额换算成 BB。",
      "第三步：记录位置和行动词。",
      "第四步：再判断这次行动代表强、弱还是不确定。"
    ],
    mistakeDetails: [
      miss("把 AKs 看成任意 AK", "同花组合比非同花少但可玩性更强，混在一起会让范围判断失真。", "看到 s、o、对子时先停一下，确认缩写含义。"),
      miss("只记金额不记 BB", "不同级别金额不同，但 BB 才代表相对筹码压力。", "每次记录下注时同时写成 BB。"),
      miss("漏记位置", "同一个 call 在 BTN 和 SB 的含义完全不同。", "手牌记录第一行先写位置。")
    ],
    checkpoint: ["读懂常见手牌缩写", "把金额换算成 BB", "用行动词复述一手牌"],
    quiz: [
      q("AKs 中的 s 代表什么？", ["两张手牌同花", "公共牌同花", "小盲位置"], "两张手牌同花", "s 是 suited，表示两张手牌同花。"),
      q("盲注 1/2 时加注到 6 是多少 BB？", ["3BB", "6BB", "2BB"], "3BB", "大盲是 2，6 除以 2 等于 3BB。"),
      q("面对下注投入同样筹码继续游戏叫什么？", ["call", "fold", "check"], "call", "call 是跟注，表示匹配当前下注额。")
    ],
    practiceTasks: [
      task("记号翻译", "写出 As Kh、QJs、A9o、55 的中文含义。"),
      task("BB 记录", "把最近看到的 5 个下注金额换算成 BB。")
    ],
    relatedTerms: ["aks", "aqo", "suited", "offsuit", "pocket-pair", "bb", "call", "fold"],
    nextSteps: [nextChapter("学习规则与摊牌", 1, "继续第 2 章，先把摊牌和牌型比较打牢。")]
  }),
  chapter({
    id: chapterIds[1],
    stage: 2,
    title: "规则、牌型与摊牌",
    subtitle: "知道最后到底比什么",
    difficulty: "beginner",
    estimatedMinutes: 14,
    beginnerSafe: true,
    summary: "本章讲两张手牌、五张公共牌、牌型顺序、踢脚、平分池、边池和 counterfeit。",
    plainLanguage: "德州最后不是比谁手里两张牌大，而是从七张可用牌里选最好的五张。你要学会先找自己的五张，再看对手有没有更好的五张。",
    tableExample: "你拿 Ah Kd，公共牌 A♣ 7♦ 7♠ 2♥ 9♣，最终是 AA77K 两对；如果对手是 AQ，你赢在 K 踢脚。",
    whyItMatters: "很多新手输在看错牌型、忽略踢脚，或不知道公共牌对子会让自己的两对被 counterfeit。",
    miniChecklist: ["找出最佳五张牌", "比较同牌型时看踢脚", "多人全下时分清主池和边池"],
    encouragement: "读牌慢一点没关系。准确读牌，是所有高级判断的地基。",
    goals: [
      "能按顺序说出常见牌型强弱",
      "能解释踢脚、平分池和边池",
      "能识别公共牌导致的 counterfeit 场景"
    ],
    prerequisites: [chapterIds[0]],
    sections: [
      sec("七选五规则", "每名玩家用两张手牌和五张公共牌中的任意五张组成最大牌型。手牌可以用两张、一张，甚至一张不用。", "比的是最佳五张，不是手牌本身。"),
      sec("牌型强弱顺序", "从强到弱依次是：皇家同花顺、同花顺、四条、葫芦、同花、顺子、三条、两对、一对、高牌。同牌型先比主要组成，再比剩余高牌，也就是 kicker。A 对 K 踢脚能赢 A 对 Q 踢脚。", "先背大类顺序，再学同牌型内部比较。"),
      sec("平分池与边池", "当双方最佳五张完全相同就是 chop pot。多人全下且筹码量不同，会形成 side pot，短筹码只能争夺自己覆盖到的部分。", "先分清谁有资格争夺哪个底池。"),
      sec("Counterfeit", "counterfeit 指公共牌让你原本的优势被抹平。例如你用小对子组成两对，转河又发出更大的公共对子，自己的小对子可能不再参与最佳五张。", "公共牌会改写双方的最佳五张。")
    ],
    referenceTables: [
      refTable("牌型速查表", ["强度", "牌型", "意思", "例子"], [
        ["第 1 强", "皇家同花顺", "同花色 A K Q J T", "As Ks Qs Js Ts"],
        ["第 2 强", "同花顺", "同花色连续五张", "9h 8h 7h 6h 5h"],
        ["第 3 强", "四条", "四张同点数牌", "Ah Ad Ac As 7d"],
        ["第 4 强", "葫芦", "三条加一对", "Kh Kd Ks 9c 9d"],
        ["第 5 强", "同花", "五张同花色不连续", "As Js 8s 5s 2s"],
        ["第 6 强", "顺子", "五张连续点数不同花也可以", "9s 8h 7d 6c 5s"],
        ["第 7 强", "三条", "三张同点数牌", "Qc Qd Qs 8h 2c"],
        ["第 8 强", "两对", "两个不同对子", "Ah Ad 7s 7c Kd"],
        ["第 9 强", "一对", "一组对子", "Jh Jd Ac 8s 3h"],
        ["第 10 强", "高牌", "没有组成以上牌型时比最高牌", "As Qd 9c 6h 2s"]
      ])
    ],
    examples: [
      ex("踢脚决定输赢", "你拿 AK，对手拿 AQ，公共牌 A 9 4 2 7。", "双方都是一对 A，但你的五张是 AAK97，对手是 AAQ97，你用 K 踢脚获胜。", "同样顶对也要比较踢脚。"),
      ex("两对被反制", "你拿 65，公共牌 6 5 K K A。", "翻牌两对看似强，但河牌后你的最佳五张是 KK66A：公共牌的一对 K、你的 6，以及 A 踢脚。对手只要有任意 A，就能组成 KKAA6，用 K 和 A 的两对压过你；原先 6 和 5 的小两对被公共牌覆盖。", "公共牌大对子会 counterfeit 小两对。")
    ],
    decisionFlow: [
      "第一步：列出自己的最佳五张。",
      "第二步：列出公共牌已经形成的共享牌型。",
      "第三步：比较同牌型时检查踢脚。",
      "第四步：多人全下时先分主池和边池。"
    ],
    mistakeDetails: [
      miss("只盯两张手牌", "公共牌属于所有人，只看手牌会高估自己的实际牌力。", "每到一条街都重新写出最佳五张。"),
      miss("忘记踢脚", "同样顶对时，踢脚常常决定大底池归属。", "读牌时把五张完整说出来。"),
      miss("不理解边池", "多人全下时误判自己能赢的筹码量，会导致错误风险评估。", "先按有效筹码拆分底池。")
    ],
    checkpoint: ["读出最佳五张", "解释踢脚比较", "识别主池和边池"],
    quiz: [
      q("摊牌时最终比较几张牌？", ["最佳五张", "两张手牌", "全部七张相加"], "最佳五张", "德州扑克比较七张可用牌中最好的五张。"),
      q("两人最佳五张完全相同时会怎样？", ["平分池", "手牌点数大者全赢", "位置靠后者赢"], "平分池", "最佳五张完全相同就是 chop pot。"),
      q("counterfeit 通常指什么？", ["公共牌抹平原有优势", "故意慢打强牌", "翻前再加注"], "公共牌抹平原有优势", "公共牌变化可能让你的手牌不再进入最佳五张。")
    ],
    practiceTasks: [
      task("五张牌练习", "随机写 8 个公共牌面，给自己两张手牌并标出最佳五张。"),
      task("边池口算", "设计三名玩家不同筹码全下的场景，拆出主池和边池。")
    ],
    relatedTerms: ["showdown", "kicker", "chop-pot", "side-pot", "counterfeit", "flop", "turn", "river"],
    nextSteps: [nextChapter("学习位置与行动顺序", 2, "继续第 3 章，把位置、盲注和行动顺序连成一张桌面地图。")]
  }),
  chapter({
    id: chapterIds[2],
    stage: 3,
    title: "位置、盲注与行动顺序",
    subtitle: "信息越晚出现，决策越便宜",
    difficulty: "beginner",
    estimatedMinutes: 13,
    beginnerSafe: true,
    summary: "本章建立 4-max 到 9-max 的桌型人数、UTG/HJ/CO/BTN/SB/BB 等位置缩写、盲注和行动顺序。",
    plainLanguage: "位置就是你什么时候说话。不同桌型会删掉一些早位，但 BTN、SB、BB 永远存在；人数越多，越早的位置越需要谨慎。",
    tableExample: "同样 KTs，在 9-max UTG 后面还有八个人未行动，很紧张；在 4-max BTN 前面只剩 CO 已弃牌时，它可以自然开池偷盲。",
    whyItMatters: "位置会改变同一手牌的盈利能力。新手如果前位太松、小盲太爱补齐，会长期在信息少的位置打大底池。",
    miniChecklist: ["先确认自己位置", "数清后面还有几人未行动", "小盲位默认更谨慎"],
    encouragement: "学会按位置选牌，你就已经从看牌玩，进入看局面玩。",
    goals: [
      "能解释 4-max、5-max、6-max、7-max、8-max、9-max 的位置数量差异",
      "能说出 UTG、HJ、CO、BTN、SB、BB 的中文含义",
      "能解释按钮位为什么有信息优势",
      "能根据未行动人数调整前位范围松紧"
    ],
    prerequisites: [chapterIds[1]],
    sections: [
      sec("桌型人数", "常见桌型可以是 4-max、5-max、6-max、7-max、8-max、9-max。4-max 只剩 CO、BTN、SB、BB；5-max 多一个 HJ；6-max 常见为 UTG、HJ、CO、BTN、SB、BB；7-max 加 LJ；8-max 加 UTG+1；9-max 再加入 MP。", "先确认人数，再套用位置和范围。"),
      sec("位置缩写词典", "UTG 是 Under the Gun，中文常叫枪口位，通常是最早行动的位置；HJ 是 Hijack，劫位；CO 是 Cutoff，关煞位；BTN/Button 是按钮位；SB 是 Small Blind，小盲；BB 是 Big Blind，大盲。", "缩写不是黑话装饰，而是行动顺序。"),
      sec("盲注机制", "SB 和 BB 被迫投入筹码，所以他们会得到一定防守价格，但翻后位置差。盲注不是免费筹码，而是长期成本。", "盲位要防守，但不能无条件防守。"),
      sec("行动顺序", "翻前从 UTG 开始，盲位最后行动；翻后从按钮左侧仍在牌局中的玩家开始，按钮位最晚。", "翻前和翻后的先后顺序不完全一样。"),
      sec("桌型差异", "人数越多，早位后面有更多未行动玩家，所以前位范围越紧。人数越少，盲注来得越快，CO、BTN、SB、BB 的争夺更频繁。短桌可以更主动，但不是任何两张都玩。", "人数改变的是未行动人数和盲注压力。")
    ],
    referenceTables: [
      refTable("桌型位置表", ["桌型", "位置顺序", "新人重点"], [
        ["4-max", "CO -> BTN -> SB -> BB", "短桌最激进，CO 是最早位置但压力小于满员桌早位。"],
        ["5-max", "HJ -> CO -> BTN -> SB -> BB", "比 4-max 多一个 HJ，仍属于短桌。"],
        ["6-max", "UTG -> HJ -> CO -> BTN -> SB -> BB", "最常见线上短桌结构。"],
        ["7-max", "UTG -> LJ -> HJ -> CO -> BTN -> SB -> BB", "多出 LJ，早位要比 6-max 更谨慎。"],
        ["8-max", "UTG -> UTG+1 -> LJ -> HJ -> CO -> BTN -> SB -> BB", "早位压力进一步增加。"],
        ["9-max", "UTG -> UTG+1 -> MP -> LJ -> HJ -> CO -> BTN -> SB -> BB", "满员桌早位最紧，不能照搬短桌范围。"]
      ])
    ],
    examples: [
      ex("按钮位的信息优势", "CO 弃牌，BTN 看到 SB 和 BB 是两个偏紧玩家。", "BTN 可以用更宽范围开池，因为后面只剩两个盲位，并且翻后常有位置优势。", "位置好时边缘牌更容易实现价值。"),
      ex("小盲补齐的陷阱", "前面 limp，你在 SB 拿 Q8o，只需补半个盲。", "价格看似便宜，但你翻后经常先行动，且手牌踢脚差，容易中弱顶对付出更多。", "便宜不等于盈利。")
    ],
    decisionFlow: [
      "第一步：确认当前桌型和人数。",
      "第二步：标出自己的位置。",
      "第三步：看前面是否有人入池。",
      "第四步：根据后面未行动人数调整松紧。"
    ],
    mistakeDetails: [
      miss("前位打太多边缘牌", "后面多人未行动，容易撞上强范围并在翻后无位置。", "前位只保留清楚盈利的起手牌。"),
      miss("小盲自动补齐", "小盲翻后位置差，边缘牌很难实现权益。", "补齐前问自己翻后击中什么才舒服。"),
      miss("忽略桌型人数", "9-max 前位比短桌前位压力更大，照搬短桌范围会过松；4-max 又不能照搬满员桌的紧度。", "先确认桌型，再看自己位置和后面未行动人数。")
    ],
    checkpoint: ["解释 4-max 到 9-max 的人数差异", "说出 UTG/HJ/CO/BTN/SB/BB 含义", "指出小盲位漏洞"],
    quiz: [
      q("通常信息优势最大的位置是？", ["BTN", "UTG", "SB"], "BTN", "BTN 翻后通常最后行动。"),
      q("小盲位为什么不能随便补齐？", ["翻后位置差", "已经投入半盲所以必玩", "小盲永远最大"], "翻后位置差", "小盲翻后经常先行动，信息少。"),
      q("9-max 早位通常比 4-max 早位怎样？", ["更紧", "更松", "完全一样"], "更紧", "人数更多，后面醒来强牌的人更多。")
    ],
    practiceTasks: [
      task("位置标注", "分别写出 4-max、5-max、6-max、8-max、9-max 的位置顺序。"),
      task("桌型比较", "写出同一手 KJo 在 4-max CO、6-max UTG、9-max UTG 的差异。")
    ],
    relatedTerms: ["position", "table-size", "short-handed", "full-ring", "utg", "utg-plus-one", "mp", "lj", "hj", "co", "btn", "sb", "button", "small-blind", "big-blind"],
    nextSteps: [nextChapter("学习起手牌与范围", 3, "继续第 4 章，从单手牌好坏过渡到范围思维。")]
  }),
  chapter({
    id: chapterIds[3],
    stage: 4,
    title: "起手牌与范围思维",
    subtitle: "从单手牌好坏走向一组牌",
    difficulty: "beginner",
    estimatedMinutes: 15,
    beginnerSafe: true,
    summary: "本章讲 AKs、AQo、对子、Broadway、connector，以及为什么要用 range 而不是孤立牌判断。",
    plainLanguage: "范围就是一篮子可能手牌。你不只问我这手牌能玩吗，还要问在这个位置、这个行动前，它属于哪一篮子。",
    tableExample: "A9o 在 BTN 前面都弃牌时可以开池；面对 UTG 开池时跟注却经常被更好 A 压制。",
    whyItMatters: "翻前选牌决定后面问题难度。差起手牌会让你反复拿到弱顶对、弱听牌和尴尬踢脚。",
    miniChecklist: ["先看位置", "再看前面行动", "避免被更好同类牌支配"],
    encouragement: "范围不是束缚，而是帮你把精力留给真正值得思考的牌局。",
    goals: [
      "能区分同花、非同花、对子和连接牌",
      "能解释 dominated hand 的风险",
      "能用范围思维描述自己和对手可能手牌"
    ],
    prerequisites: [chapterIds[2]],
    sections: [
      sec("起手牌类型", "高对子和大同花 Broadway 通常更稳定；小对子依赖成 set；同花连接牌有潜力但需要位置和深筹码。", "不同类型手牌赚不同的钱。"),
      sec("AKs 与 AQo", "AKs 同花、连通且高牌强；AQo 虽强但更容易被 AK、AQs 或大对子压制。位置越差，非同花大牌越要谨慎。", "同样大牌，结构差异很重要。"),
      sec("范围而不是单牌", "对手 UTG 开池不是只有一手牌，而是一组偏强范围。你的决策要和整组范围比较，而不是猜他刚好是什么。", "范围让判断更稳定。"),
      sec("组合数量", "一手非对子有 16 个组合，同花 4 个、非同花 12 个；对子有 6 个组合。组合帮助你理解某些牌出现频率。", "combo 是范围重量的单位。")
    ],
    examples: [
      ex("AQo 面对前位", "UTG 开池，你在 HJ 拿 AQo。", "AQo 看起来漂亮，但 UTG 强范围里有 AK、QQ+ 和 AQs。跟注后即使中 A，也可能被更好踢脚压制。", "面对强范围，漂亮牌也要收紧。"),
      ex("小对子找 set", "CO 开池，你在 BTN 拿 55，双方 120BB 深。", "深筹码且有位置时，小对子跟注寻找 set 更合理；短筹码时隐含赔率不足。", "对子价值受筹码深度影响。")
    ],
    decisionFlow: [
      "第一步：给手牌分类。",
      "第二步：检查位置和前面行动。",
      "第三步：判断是否容易被支配。",
      "第四步：把手牌放进开池、跟注或弃牌范围。"
    ],
    mistakeDetails: [
      miss("只看牌面漂亮", "KJo、A9o 这类牌容易被更好同类牌压制。", "问自己中顶对后能赢哪些更差牌。"),
      miss("任何对子都想看翻牌", "筹码浅或加注大时，小对子找 set 的价格不够。", "看有效筹码和需要支付的 BB。"),
      miss("把对手放在一手牌上", "猜单手牌会忽略大量可能组合。", "用一组合理手牌描述对手。")
    ],
    checkpoint: ["分类起手牌", "解释 range 和 combo", "识别被支配风险"],
    quiz: [
      q("AQo 中的 o 表示什么？", ["非同花", "同花", "对子"], "非同花", "offsuit 表示两张手牌不同花色。"),
      q("对子有多少个组合？", ["6", "12", "16"], "6", "四张同点数牌中选两张，共 6 个组合。"),
      q("范围思维的核心是？", ["考虑一组可能手牌", "猜对手唯一手牌", "只看自己手牌"], "考虑一组可能手牌", "范围是一组可能组合，而不是单一答案。")
    ],
    practiceTasks: [
      task("分类练习", "把 AKs、AQo、77、KJs、76s、A5s 分成高牌、对子、Broadway、connector。"),
      task("范围描述", "写出 BTN 开池可能包含的 10 类手牌。")
    ],
    relatedTerms: ["aks", "aqo", "pocket-pair", "range", "combo", "broadway", "connector", "suited", "offsuit"],
    nextSteps: [nextChapter("学习开池与跟弃", 4, "继续第 5 章，建立翻前 open、call、fold 的第一套纪律。")]
  }),
  chapter({
    id: chapterIds[4],
    stage: 5,
    title: "开池、limp、隔离、跟注与弃牌",
    subtitle: "翻前第一套行动纪律",
    difficulty: "beginner",
    estimatedMinutes: 15,
    beginnerSafe: true,
    summary: "本章讲 open raise、limp、isolate、call、fold 和新手可执行的翻前 sizing。",
    plainLanguage: "没人入池时，你要么主动加注开池，要么弃牌。有人 limp 时，强牌通常加注隔离；面对加注时，不要为了看翻牌而随便跟。",
    tableExample: "前面两人 limp，你在 CO 拿 AQo，可以加注到 5BB 左右隔离；拿 J7o 则直接弃牌。",
    whyItMatters: "翻前被动 limp 和松散跟注会让你用弱范围进入多人底池，后面每个决定都变难。",
    miniChecklist: ["没人入池优先 open raise", "有人 limp 用强牌 isolate", "面对加注先问是否该弃牌"],
    encouragement: "会弃牌不是胆小，是把筹码留给更清楚的机会。",
    goals: [
      "能区分 open raise、limp 和 isolate",
      "能选择基础翻前加注尺度",
      "能解释跟注和弃牌的长期成本"
    ],
    prerequisites: [chapterIds[3]],
    sections: [
      sec("Open raise", "前面没人入池时第一次主动加注叫 open raise。常见现金桌尺度可从 2.2BB 到 3BB 起步，后位可略小，低级别多人松跟时可略大。", "主动开池比 limp 更能控制人数和范围。"),
      sec("Limp 的问题", "limp 看似便宜，但会邀请多人入池，也让你难以代表强范围。除非有明确桌况计划，新手应少 limp。", "便宜入池常把小问题变成大问题。"),
      sec("Isolate", "面对一个或多个 limp，用较强范围加注叫 isolate，目标是获得主动权、减少对手人数并惩罚弱入池。", "隔离加注是对 limp 的主动回应。"),
      sec("Call 与 fold", "面对加注，call 需要位置、价格和可实现权益；fold 是默认保护动作。不是每手看起来能玩的牌都值得付钱。", "跟注不是中间选项，而是有条件的投资。")
    ],
    examples: [
      ex("隔离 limper", "两个玩家 limp 到你 CO，你拿 KQs。", "KQs 领先许多 limp 范围，加注到约 5BB 可以减少多人底池并拿主动权。", "强可玩牌面对 limp 更适合 isolate。"),
      ex("拒绝便宜跟注", "UTG 开池 3BB，你在 MP 拿 A8o。", "A8o 容易被强 A 压制，位置也不好。即使只需 3BB，也不代表长期盈利。", "价格不高也可能是坏跟注。")
    ],
    decisionFlow: [
      "第一步：确认前面是否有人入池。",
      "第二步：没人入池时按位置决定 open 或 fold。",
      "第三步：有人 limp 时用强范围考虑 isolate。",
      "第四步：面对加注时只保留能清楚盈利的 call 或再加注。"
    ],
    mistakeDetails: [
      miss("习惯性 limp", "你放弃主动权，还让多人用便宜价格看翻牌。", "没人入池时用开池范围行动。"),
      miss("隔离尺度太小", "给后面玩家和 limper 太好价格，无法减少人数。", "根据 limper 数量增加加注尺度。"),
      miss("怕错过翻牌而跟注", "弱跟注会在翻后制造高频尴尬牌力。", "不清楚盈利理由时直接 fold。")
    ],
    checkpoint: ["选择 open 尺度", "识别 limp 陷阱", "说明 isolate 目标"],
    quiz: [
      q("前面没人入池时第一次主动加注叫什么？", ["open-raise", "cold-call", "donk-bet"], "open-raise", "open raise 是无人入池时的第一次加注。"),
      q("新手为什么要少 limp？", ["容易失去主动权并进入多人底池", "因为 limp 永远违规", "因为 limp 一定是强牌"], "容易失去主动权并进入多人底池", "limp 让底池更被动、更拥挤。"),
      q("面对多个 limp 拿强牌加注常叫什么？", ["isolate", "check", "probe"], "isolate", "isolate 是隔离弱入池者的加注。")
    ],
    practiceTasks: [
      task("行动分类", "写 10 个翻前场景，标出 open、limp、isolate、call、fold。"),
      task("尺度练习", "给 1、2、3 个 limper 设计你的隔离加注尺度。")
    ],
    relatedTerms: ["open-raise", "limp", "isolate", "call", "fold", "bet-sizing", "range", "bb"],
    nextSteps: [nextChapter("学习 3-bet 与 squeeze", 5, "继续第 6 章，理解翻前压力升级后的范围变化。")]
  }),
  chapter({
    id: chapterIds[5],
    stage: 6,
    title: "3-bet、4-bet 与 squeeze",
    subtitle: "翻前压力如何升级",
    difficulty: "intermediate",
    estimatedMinutes: 16,
    beginnerSafe: false,
    summary: "本章讲 3-bet、4-bet、squeeze、cold call、flat call，以及翻前再加注如何改变范围压力。",
    plainLanguage: "开池后再加注，就是把问题变贵。你要知道自己是在拿价值，还是利用弃牌率施压，而不是看到好牌就随手加大。",
    tableExample: "CO open，BTN call，你在 BB 拿 AQs 加注到 12BB，这叫 squeeze，因为你同时挤压开池者和跟注者。",
    whyItMatters: "翻前再加注决定底池大小和后续 SPR。没有计划的 3-bet 会让你用边缘牌进入巨大底池。",
    miniChecklist: ["确认原始开池位置", "区分价值和诈唬 3-bet", "加注前想好面对 4-bet 怎么办"],
    encouragement: "翻前压力不是吓人用的，是让你的强范围和好阻断牌有清楚计划。",
    goals: [
      "能区分 3-bet、4-bet 和 squeeze",
      "能解释 cold call 与 flat call 的差别",
      "能在 3-bet 前规划面对继续加压的反应"
    ],
    prerequisites: [chapterIds[4], chapterIds[3]],
    sections: [
      sec("3-bet 与 4-bet", "面对 open raise 的再加注是 3-bet，面对 3-bet 的再加注是 4-bet。每次加压都会显著收窄双方范围。", "再加注次数越多，范围越强。"),
      sec("价值与诈唬", "AA、KK 这类牌是价值 3-bet；A5s 这类有阻断和可玩性的牌有时可作诈唬 3-bet。新手先少量、清楚地使用。", "3-bet 要有目的。"),
      sec("Squeeze", "有人 open 且至少一人 call 后，你再加注叫 squeeze。跟注者的范围常被夹在中间，弃牌压力更大。", "squeeze 利用死钱和夹击压力。"),
      sec("Cold call 与 flat call", "cold call 通常指面对加注直接跟注且此前未投入；flat call 强调只跟不加。二者都需要位置、价格和翻后计划。", "跟注强加注不是默认安全。")
    ],
    examples: [
      ex("按钮位 3-bet", "CO open 2.5BB，你在 BTN 拿 AQs。", "AQs 领先 CO 宽开池范围，又有位置。3-bet 可拿价值并减少盲位便宜入池。", "位置好时强同花大牌适合施压。"),
      ex("盲位 squeeze", "HJ open，CO call，你在 BB 拿 JJ。", "JJ 面对开池和跟注者通常有价值，加注能避免多人底池，也能让较弱对子和 Broadway 付费。", "squeeze 前要想好被 4-bet 时的计划。")
    ],
    decisionFlow: [
      "第一步：识别当前是 open、3-bet 还是 4-bet 场景。",
      "第二步：评估原始开池位置的范围强弱。",
      "第三步：说明自己加注是价值还是诈唬。",
      "第四步：提前写下面对再加注的继续或弃牌计划。"
    ],
    mistakeDetails: [
      miss("看见好牌就 3-bet", "没有考虑位置和对手范围，会把 AQo、KQo 这类牌推入不舒服底池。", "每次 3-bet 前说出目标。"),
      miss("面对 4-bet 临时慌张", "底池已经变大，临时猜测容易过度跟注或过度全下。", "加注前先定义继续范围。"),
      miss("squeeze 尺度太小", "给两个范围都好价格，反而制造大多人底池。", "多人已入池时使用更大尺度。")
    ],
    checkpoint: ["识别 3-bet/4-bet/squeeze", "说明加注目的", "规划面对 4-bet 的反应"],
    quiz: [
      q("open 后的再加注通常叫？", ["three-bet", "limp", "probe"], "three-bet", "面对第一次加注的再加注叫 3-bet。"),
      q("open 加 call 后第三人再加注叫什么？", ["squeeze", "flat-call", "donk"], "squeeze", "squeeze 同时挤压开池者和跟注者。"),
      q("3-bet 前最应该先想什么？", ["被 4-bet 时怎么办", "河牌会不会发 A", "一定要赢下这手"], "被 4-bet 时怎么办", "预案能避免底池变大后情绪决策。")
    ],
    practiceTasks: [
      task("压力标注", "找 6 个翻前记录，标出每个行动是 3-bet、4-bet、cold call 还是 flat call。"),
      task("预案表", "为 BTN vs CO 的 3-bet 写出价值、诈唬和面对 4-bet 的处理。")
    ],
    relatedTerms: ["three-bet", "four-bet", "squeeze", "cold-call", "flat-call", "range", "combo", "bet-sizing"],
    nextSteps: [nextChapter("学习盲位防守", 6, "继续第 7 章，把偷盲、防守价格和抽水影响放在一起看。")]
  }),
  chapter({
    id: chapterIds[6],
    stage: 7,
    title: "盲位防守、偷盲与抽水意识",
    subtitle: "被迫投入的筹码也要有纪律地夺回",
    difficulty: "intermediate",
    estimatedMinutes: 15,
    beginnerSafe: false,
    summary: "本章讲 blind defense、steal、小盲漏洞、大盲 pot odds，以及 rake 如何改变边缘防守。",
    plainLanguage: "盲位已经投了钱，所以能用更好价格防守；但这不代表任何两张都该玩。抽水越高，边缘跟注越不值钱。",
    tableExample: "BTN open 2.2BB，你在 BB 只需补 1.2BB 争夺约 4.9BB，价格很好；但拿 94o 仍然很难实现权益。",
    whyItMatters: "盲注是长期成本。防守太紧会被偷盲，防守太松又会在无位置底池慢性失血。",
    miniChecklist: ["看开池位置是否在偷盲", "计算大盲跟注价格", "高抽水时少玩边缘牌"],
    encouragement: "盲位不是受害者位置。你只需要用价格和可玩性筛掉坏防守。",
    goals: [
      "能解释 steal 和 blind defense",
      "能用 pot odds 理解大盲防守价格",
      "能说明 rake 对小底池边缘牌的影响"
    ],
    prerequisites: [chapterIds[5], chapterIds[2]],
    sections: [
      sec("偷盲", "后位在前面都弃牌时用较宽范围开池争夺 SB 和 BB，叫 steal。偷盲依赖位置、弃牌率和盲位防守倾向。", "后位开池常不只是强牌。"),
      sec("大盲防守价格", "BB 已经投入 1BB，所以面对小开池通常得到不错 pot odds。但价格好不代表权益一定能实现。", "价格和可玩性要同时看。"),
      sec("小盲漏洞", "SB 已投入半盲，但翻后位置最差，且后面还有 BB。小盲跟注太宽是常见漏点。", "小盲不是便宜座位，是困难座位。"),
      sec("Rake 意识", "抽水会从小底池盈利中拿走一部分。低级别高 rake 环境下，许多理论上接近持平的跟注会变成亏损。", "rake 越高，边缘防守越要收紧。")
    ],
    examples: [
      ex("BB 面对 BTN 小开", "BTN open 2.2BB，你 BB 拿 J8s。", "价格好、同花且有连接性，防守通常可考虑；但翻后仍要承认位置劣势。", "大盲可防守更宽，但要会放弃。"),
      ex("SB 的陷阱补齐", "CO open，BTN call，你在 SB 拿 K9o。", "你位置差、后面 BB 还可能 squeeze，K9o 又容易被支配。跟注看似便宜，实际困难。", "小盲边缘非同花牌少碰。")
    ],
    decisionFlow: [
      "第一步：判断开池者是否来自偷盲位置。",
      "第二步：计算自己需要补多少 BB。",
      "第三步：评估手牌能否在无位置实现权益。",
      "第四步：结合 rake 和对手倾向选择防守、3-bet 或弃牌。"
    ],
    mistakeDetails: [
      miss("大盲防守过紧", "后位会用宽范围持续偷走你的盲注。", "面对后位小开保留足够可玩牌。"),
      miss("大盲防守过松", "垃圾牌即使价格好也很难摊牌获胜或诈唬成功。", "用同花、连接和高牌质量筛选。"),
      miss("忽略 rake", "边缘小盈利会被抽水吃掉，长期变负。", "高 rake 场少做薄跟注。")
    ],
    checkpoint: ["计算盲位价格", "识别 steal 场景", "说明 rake 影响"],
    quiz: [
      q("BTN 前面都弃牌后开池常被称为什么？", ["steal", "side-pot", "counterfeit"], "steal", "后位争夺盲注的开池常叫偷盲。"),
      q("大盲为什么能比其他位置跟得宽一些？", ["已经投入 1BB 有价格", "翻后一定最后行动", "永远不会被抽水"], "已经投入 1BB 有价格", "已投入盲注让跟注成本相对更低。"),
      q("高 rake 环境下边缘跟注应怎样？", ["更谨慎", "无限放宽", "完全不看位置"], "更谨慎", "抽水会削弱薄盈利。")
    ],
    practiceTasks: [
      task("盲位价格", "计算面对 2BB、2.5BB、3BB open 时 BB 需要补多少。"),
      task("防守筛选", "列出 10 手你愿意 BB 防守 BTN 小开的手牌，并写理由。")
    ],
    relatedTerms: ["steal", "blind-defense", "big-blind", "small-blind", "pot-odds", "rake", "equity-realization"],
    nextSteps: [nextChapter("学习牌面结构", 7, "继续第 8 章，学习用干湿、成对和连接性读翻牌。")]
  }),
  chapter({
    id: chapterIds[7],
    stage: 8,
    title: "牌面结构阅读",
    subtitle: "干燥、湿润、成对、同花与动态变化",
    difficulty: "intermediate",
    estimatedMinutes: 16,
    beginnerSafe: false,
    summary: "本章讲 dry、wet、paired、monotone、rainbow、connected、dynamic board 如何影响范围和下注。",
    plainLanguage: "牌面不是背景板。A72 彩虹和 987 两同花完全不同：一个变化慢，一个让很多听牌和两对顺子都活跃。",
    tableExample: "BTN open，BB call。A72 rainbow 更有利于 BTN 的高牌范围；987 two-tone 则更容易击中 BB 的连接牌防守范围。",
    whyItMatters: "读不懂牌面结构，就会在危险牌面乱持续下注，或在安全牌面错过简单价值。",
    miniChecklist: ["先判断干湿", "看是否成对或同花", "问下一张牌会改变多少"],
    encouragement: "牌面结构会告诉你这手牌该快一点、慢一点，还是先别把底池做大。",
    goals: [
      "能识别 dry、wet、paired、monotone、rainbow、connected board",
      "能解释 dynamic board 为什么需要提前规划",
      "能把牌面结构和双方范围连接起来"
    ],
    prerequisites: [chapterIds[6], chapterIds[3]],
    sections: [
      sec("干燥与湿润", "干燥牌面听牌少、变化慢，例如 A72 rainbow。湿润牌面连接和同花听牌多，例如 T98 two-tone。", "干湿决定底池变化速度。"),
      sec("成对与单花", "paired board 会提高 trips、full house 和 counterfeit 的可能；monotone board 让所有无该花色牌承压。", "特殊结构会压缩价值下注范围。"),
      sec("彩虹与连接", "rainbow board 暂时没有同花听牌；connected board 让顺子和强听牌更多。两者结合决定下注频率和尺度。", "连接性越高，对手继续范围越强。"),
      sec("动态牌面", "dynamic board 指很多转牌会改变领先者，例如 9s 8s 7d。你需要提前想哪些 turn barrel 好，哪些牌要控池。", "动态牌面要提前看下一街。")
    ],
    examples: [
      ex("A72 彩虹", "BTN open，BB call，翻牌 A72 rainbow。", "BTN 有更多强 A 和高对子，BB 虽有一些 7x、2x，但整体承压。小尺度 c-bet 常有效。", "干燥高牌面常适合范围小注。"),
      ex("987 两同花", "CO open，BB call，翻牌 9s 8s 7d。", "BB 防守范围有大量连接牌、两对和听牌。开池者不能机械 c-bet，需要更谨慎选择。", "湿润连接面会削弱翻前主动者优势。")
    ],
    decisionFlow: [
      "第一步：标记是否成对、同花或彩虹。",
      "第二步：判断连接性和听牌数量。",
      "第三步：比较谁的范围更常击中强牌。",
      "第四步：根据动态程度选择下注、过牌或计划 turn barrel。"
    ],
    mistakeDetails: [
      miss("所有翻牌都自动 c-bet", "湿润牌面对手继续范围强，机械下注会被跟注或加注惩罚。", "先读牌面再决定频率。"),
      miss("忽略成对牌面", "成对牌面改变 trips 和葫芦分布，顶对价值可能不同。", "看到 paired board 先数强牌组合。"),
      miss("不规划转牌", "动态牌面很多 turn 会改变领先，临时决策容易乱开第二枪。", "翻牌就列出好转牌和坏转牌。")
    ],
    checkpoint: ["分类牌面结构", "说明动态牌面", "把牌面连接到范围"],
    quiz: [
      q("A72 rainbow 通常属于什么牌面？", ["dry-board", "wet-board", "monotone-board"], "dry-board", "听牌少、连接弱，通常较干燥。"),
      q("三张同花翻牌叫什么？", ["monotone-board", "rainbow-board", "paired-board"], "monotone-board", "monotone 表示三张公共牌同一花色。"),
      q("987 两同花为什么危险？", ["连接和听牌很多", "没有任何听牌", "只能击中高牌"], "连接和听牌很多", "顺子、同花、两对和强听牌都很多。")
    ],
    practiceTasks: [
      task("牌面分类", "给 12 个翻牌标 dry/wet/paired/monotone/rainbow/connected。"),
      task("转牌计划", "选择 3 个动态翻牌，写出好转牌和坏转牌。")
    ],
    relatedTerms: ["board-texture", "dry-board", "wet-board", "paired-board", "monotone-board", "rainbow-board", "connected-board", "dynamic-board"],
    nextSteps: [nextChapter("学习相对牌力", 8, "继续第 9 章，把牌名放回具体牌面和行动线里判断。")]
  }),
  chapter({
    id: chapterIds[8],
    stage: 9,
    title: "相对牌力",
    subtitle: "同一手牌在不同局面强弱不同",
    difficulty: "intermediate",
    estimatedMinutes: 15,
    beginnerSafe: false,
    summary: "本章讲 top pair、overpair、two pair、set、trips、draw 和 showdown value 的相对强度。",
    plainLanguage: "顶对不是固定强牌。它在干燥小底池很舒服，在湿润大底池面对加注就可能只是抓诈牌。",
    tableExample: "AA 在 7♣ 4♦ 2♠ 是超对强牌；在 9♠ 8♠ 7♦ 面对大加注，就要担心顺子、两对、set 和强听牌。",
    whyItMatters: "新手常把绝对牌名当答案。真正的问题是：在这个牌面、这个行动、这个底池里，它还能赢哪些更差牌？",
    miniChecklist: ["先说牌名", "再看牌面和行动", "问能否摊牌赢更差牌"],
    encouragement: "相对牌力会让你少为一对牌付三条街的学费。",
    goals: [
      "能区分 top pair、overpair、set、trips",
      "能解释 showdown value 和 draw",
      "能根据行动强度调整牌力评价"
    ],
    prerequisites: [chapterIds[7], chapterIds[1]],
    sections: [
      sec("绝对牌名", "top pair 是击中牌面最高点数的一对，overpair 是手牌对子高于公共牌，set 是手牌对子中三条，trips 是公共牌成对时用一张手牌组成三条。", "先把牌名说准确。"),
      sec("相对强度", "同样顶对，在单挑小底池可能价值下注；在多人湿润牌面面对大加注，可能只是一手边缘牌。", "牌力由局面决定。"),
      sec("听牌与半成牌", "draw 还没完成但有 outs。强听牌可以半诈唬，弱听牌则需要价格。", "未成牌也有权益，但不是免费通行证。"),
      sec("摊牌价值", "showdown value 指你过牌到摊牌仍可能赢的能力。中对、小对子和 A 高有时不需要变成诈唬。", "有摊牌价值的牌不必总下注。")
    ],
    examples: [
      ex("超对遇到湿润面", "你拿 AA，翻牌 9s 8s 7d，对手 check-raise。", "AA 仍有价值，但对手范围包含 set、两对、顺子和强听牌。不能把它当无敌牌。", "超对在动态牌面要控制风险。"),
      ex("A 高摊牌价值", "你 BTN open AQs，BB call，翻牌 K72 rainbow 双方过牌，转牌 3。", "AQ 高没有成牌，但对手也有许多未击中组合。面对小底池可考虑过牌保留摊牌价值。", "不是所有未成牌都要诈唬。")
    ],
    decisionFlow: [
      "第一步：命名当前牌力。",
      "第二步：用牌面结构调整强弱。",
      "第三步：根据对手行动强度收窄范围。",
      "第四步：决定是价值下注、控池、抓诈还是弃牌。"
    ],
    mistakeDetails: [
      miss("顶对不肯弃", "对手多街大注通常代表更强范围，顶对会被价值范围压制。", "每条街问能赢哪些更差跟注。"),
      miss("把 trips 和 set 混淆", "set 更隐蔽，trips 在成对牌面上对手也更容易拥有。", "说明三条来自手牌对子还是公共牌对子。"),
      miss("有听牌就任意跟", "outs 不干净或价格太贵时，听牌长期亏损。", "先算价格再追牌。")
    ],
    checkpoint: ["命名相对牌力", "识别摊牌价值", "判断听牌质量"],
    quiz: [
      q("手牌 88，翻牌 A82，通常叫什么？", ["set", "trips", "top-pair"], "set", "手牌对子击中第三张同点数牌是 set。"),
      q("showdown value 指什么？", ["过牌到摊牌仍可能赢", "一定要下注三条街", "没有任何胜率"], "过牌到摊牌仍可能赢", "有摊牌价值的牌可以通过过牌实现。"),
      q("顶对面对多街大注应怎样？", ["重新评估相对牌力", "永远全下", "只看自己踢脚"], "重新评估相对牌力", "行动强度会改变顶对价值。")
    ],
    practiceTasks: [
      task("牌力命名", "写 10 个手牌加翻牌，标 top pair、overpair、set、trips 或 draw。"),
      task("相对调整", "选 3 个顶对场景，说明在哪些行动后会降级。")
    ],
    relatedTerms: ["top-pair", "overpair", "two-pair", "set", "trips", "draw", "showdown-value", "board-texture"],
    nextSteps: [nextChapter("学习下注目的", 9, "继续第 10 章，给每一次下注写清楚价值、诈唬或保护目标。")]
  }),
  chapter({
    id: chapterIds[9],
    stage: 10,
    title: "下注目的与基础尺度",
    subtitle: "每一次投入都要回答为什么",
    difficulty: "intermediate",
    estimatedMinutes: 16,
    beginnerSafe: false,
    summary: "本章讲 value、bluff、protection、bet purpose 和适合新手的基础 sizing。",
    plainLanguage: "下注不是因为轮到你了，而是为了让更差牌跟、让更好牌弃，或让对手的高权益牌付费。",
    tableExample: "你有顶对好踢脚，在 A72 干燥面下注 1/3 pot，主要是让弱 A、口袋对子和 7x 继续付钱。",
    whyItMatters: "没有目的的下注会把有摊牌价值的牌变成诈唬，或用强牌给对手太便宜的追牌价格。",
    miniChecklist: ["先说价值、诈唬或保护", "选择与牌面匹配的尺度", "确认被加注后的计划"],
    encouragement: "只要你能说出下注目的，已经比机械点按钮进步很多。",
    goals: [
      "能区分 value bet、bluff 和 protection bet",
      "能选择 1/3、1/2、2/3、pot 等基础尺度",
      "能解释下注尺度如何影响对手继续范围"
    ],
    prerequisites: [chapterIds[8], chapterIds[7]],
    sections: [
      sec("价值下注", "value bet 的目标是让更差牌跟注。下注前要列出对手会付钱的更差组合，而不是只说我有好牌。", "价值来自更差牌支付。"),
      sec("诈唬下注", "bluff 的目标是让更好牌弃牌。好诈唬通常有阻断、后门权益或能代表强范围。", "诈唬需要弃牌率和故事。"),
      sec("保护下注", "protection bet 让高权益未成牌付费，减少免费实现权益。保护不是害怕，而是给对手错误价格。", "保护下注针对对手的权益。"),
      sec("基础尺度", "干燥范围优势面可用小注；湿润动态面常需更大尺度。新手先掌握 1/3、1/2、2/3 pot 的含义。", "尺度要服务目的和牌面。")
    ],
    examples: [
      ex("小注价值", "BTN open，BB call，翻牌 A72 rainbow，你拿 AQ。", "你领先许多 BB 继续牌，小注能让弱 A、7x、口袋对子继续，同时保持范围压力。", "干燥高牌面小注常足够。"),
      ex("保护中对", "你拿 JJ，翻牌 T84 两同花，对手过牌。", "JJ 领先许多 Tx、8x 和同花听牌，下注可拿价值也防止免费转牌。", "价值和保护常同时存在。")
    ],
    decisionFlow: [
      "第一步：说出下注主要目的。",
      "第二步：列出目标跟注牌或目标弃牌。",
      "第三步：根据牌面干湿选择尺度。",
      "第四步：提前规划被加注后的反应。"
    ],
    mistakeDetails: [
      miss("为了害怕而下注", "恐惧下注常让更差牌弃、只留下更强牌。", "把恐惧改写成具体保护目标。"),
      miss("用摊牌价值牌乱诈唬", "你可能让更差牌弃掉，却被更好牌跟住。", "有摊牌价值时优先考虑过牌。"),
      miss("尺度和目的不匹配", "湿润面小注给听牌好价格，干燥面大注又赶走弱牌。", "先读牌面再选尺寸。")
    ],
    checkpoint: ["说明下注目的", "匹配下注尺度", "列目标范围"],
    quiz: [
      q("价值下注的目标是？", ["让更差牌跟注", "让所有牌弃牌", "只为了看下一张"], "让更差牌跟注", "value bet 通过更差牌支付赚钱。"),
      q("诈唬下注最需要什么？", ["足够弃牌率", "自己一定是坚果", "对手永远跟注"], "足够弃牌率", "没有弃牌率的诈唬长期亏损。"),
      q("湿润动态牌面通常需要怎样的保护？", ["更重视给听牌价格", "永远过牌", "永远最小注"], "更重视给听牌价格", "听牌多时尺度要让对手付费。")
    ],
    practiceTasks: [
      task("目的标注", "给 8 个下注场景标 value、bluff、protection 或混合目的。"),
      task("尺度选择", "为 5 个不同牌面选择 1/3、1/2 或 2/3 pot，并写理由。")
    ],
    relatedTerms: ["value-bet", "bluff", "semi-bluff", "protection-bet", "bet-sizing", "showdown-value", "board-texture"],
    nextSteps: [nextChapter("学习 c-bet 等翻后线", 10, "继续第 11 章，理解主动权、持续下注和反主动线路。")]
  }),
  chapter({
    id: chapterIds[10],
    stage: 11,
    title: "C-bet、probe、donk 与 check-raise",
    subtitle: "翻后主动权和反主动权",
    difficulty: "intermediate",
    estimatedMinutes: 17,
    beginnerSafe: false,
    summary: "本章讲 c-bet、delayed c-bet、probe、donk、check-raise 和 initiative。",
    plainLanguage: "翻前主动者不代表每个翻牌都必须下注；防守者也不是只能过牌跟注。不同线路代表不同范围故事。",
    tableExample: "BTN open，BB call，翻牌双方过牌，转牌 BB 下注，这常叫 probe bet，因为翻前主动者放弃了翻牌持续下注。",
    whyItMatters: "翻后线路会改变双方范围。机械 c-bet、乱 donk 或过度 check-raise 都会暴露可被利用的习惯。",
    miniChecklist: ["确认谁有 initiative", "读牌面是否适合 c-bet", "面对过牌后考虑 probe"],
    encouragement: "线路名不是术语炫耀，而是帮你看懂谁在讲什么故事。",
    goals: [
      "能定义 c-bet、delayed c-bet、probe、donk、check-raise",
      "能解释 initiative 对下注频率的影响",
      "能根据牌面选择是否延迟持续下注"
    ],
    prerequisites: [chapterIds[9], chapterIds[7]],
    sections: [
      sec("Initiative", "翻前最后主动加注者拥有 initiative，翻后常有代表强范围的权利。但主动权不是义务。", "主动权给你先讲故事的资格。"),
      sec("C-bet 与 delayed c-bet", "c-bet 是翻前主动者在翻牌继续下注；翻牌过牌后转牌再下注叫 delayed c-bet。延迟可用于中等牌力或不适合高频下注的牌面。", "持续下注可以立即或延迟。"),
      sec("Probe 与 donk", "probe 通常发生在主动者上一街过牌后，防守者下一街下注；donk 是防守者在主动者行动前直接下注。", "防守者下注也有具体语境。"),
      sec("Check-raise", "check-raise 先过牌再面对下注加注，可用于强价值和强听牌。滥用会让范围过弱。", "过牌加注是高压力动作。")
    ],
    examples: [
      ex("延迟持续下注", "BTN open，BB call，翻牌 987 两同花双方过牌，转牌 A。", "翻牌不适合高频 c-bet；转牌 A 改善 BTN 范围故事，可用部分牌 delayed c-bet。", "延迟下注能等待更有利街道。"),
      ex("转牌 probe", "CO open，BB call，翻牌 K72 BB check，CO check back，转牌 4，BB 下注。", "CO 放弃翻牌下注后，BB 可用 Kx、7x、听牌和诈唬 probe 争夺底池。", "probe 利用主动者示弱。")
    ],
    decisionFlow: [
      "第一步：确认翻前最后主动者。",
      "第二步：判断牌面是否支持高频 c-bet。",
      "第三步：若上一街过牌，考虑 probe 或 delayed c-bet。",
      "第四步：面对下注时用价值和强听牌选择 check-raise。"
    ],
    mistakeDetails: [
      miss("翻前加注后必 c-bet", "不利牌面会让你用弱范围向强继续范围下注。", "先比较牌面命中谁。"),
      miss("donk 没有理由", "随意领先下注会暴露牌力或破坏强牌收益。", "donk 前说明你代表哪些强牌。"),
      miss("check-raise 只拿强牌", "范围太透明，对手可轻松弃掉弱牌。", "加入合适强听牌作半诈唬。")
    ],
    checkpoint: ["识别翻后线路", "解释 initiative", "选择 c-bet 或延迟"],
    quiz: [
      q("翻前主动者翻牌继续下注叫什么？", ["c-bet", "donk-bet", "squeeze"], "c-bet", "c-bet 是持续下注。"),
      q("主动者翻牌过牌后，防守者转牌下注常叫什么？", ["probe-bet", "four-bet", "cold-call"], "probe-bet", "probe 利用上一街主动者过牌。"),
      q("check-raise 是什么？", ["先过牌再加注", "直接弃牌", "翻前跟注"], "先过牌再加注", "check-raise 是过牌后面对下注加注。")
    ],
    practiceTasks: [
      task("线路命名", "写 8 个翻后行动序列，标出 c-bet、probe、donk 或 check-raise。"),
      task("延迟计划", "找 3 个不适合翻牌 c-bet 的牌面，写转牌 delayed c-bet 条件。")
    ],
    relatedTerms: ["c-bet", "delayed-c-bet", "probe-bet", "donk-bet", "check-raise", "initiative", "semi-bluff"],
    nextSteps: [nextChapter("学习多人底池", 11, "继续第 12 章，把单挑底池的下注习惯改造成多人底池纪律。")]
  }),
  chapter({
    id: chapterIds[11],
    stage: 12,
    title: "多人底池策略",
    subtitle: "人越多，价值阈值越高，诈唬越要克制",
    difficulty: "intermediate",
    estimatedMinutes: 18,
    beginnerSafe: false,
    summary: "本章讲多人底池、下注频率下降、价值阈值提高、顶对降级、坚果听牌、位置和相对牌力变化。",
    plainLanguage: "单挑底池里，一个小 c-bet 可以攻击大量空气牌；多人底池里，至少有一个人击中牌面的概率大幅上升。你不需要赢过一个范围，而是要同时穿过多个范围。",
    tableExample: "你在 CO 用 AQ 开池，BTN 和 BB 跟注，翻牌 A 9 7 两同花。单挑时 AQ 顶对强踢脚可以常下注；三人底池里，BTN 和 BB 都可能有两对、set、同花听牌，你的顶对要更重视尺度和控池。",
    whyItMatters: "很多新手把 BTN vs BB 的单挑 c-bet 习惯照搬到三人底池，结果用一对牌做大底池、用空气牌对多人开火、用弱听牌付太贵价格。",
    miniChecklist: ["先数清还在底池的人数", "把顶对和弱听牌降级", "只用清楚价值牌和高质量听牌做大底池"],
    encouragement: "多人底池不是要你害怕，而是提醒你：信息变少、强牌密度变高，耐心本身就是盈利动作。",
    goals: [
      "能解释为什么多人底池下注频率下降",
      "能说明多人底池价值阈值提高和顶对降级",
      "能区分坚果听牌、弱听牌和被支配听牌"
    ],
    prerequisites: [chapterIds[8], chapterIds[9], chapterIds[10]],
    sections: [
      sec("多人底池的核心变化", "multiway pot 指三名或更多玩家进入翻后。人数越多，至少一名对手击中强牌或强听牌的概率越高，因此原本单挑可以高频下注的牌面，在多人底池里通常要降低下注频率。", "多人底池默认更诚实，空气下注更少。"),
      sec("下注频率下降", "单挑底池中 c-bet 可以用范围优势攻击对手的弃牌；多人底池中，你的下注要同时让多个范围弃牌，成功率下降。没有明显范围优势、坚果优势或高质量后门权益时，过牌常常更好。", "多人底池诈唬需要更强理由。"),
      sec("价值阈值提高", "value threshold 是能舒服下注拿价值的最低牌力。多人底池里，更差牌愿意支付的范围变窄，更强牌出现概率变高，所以顶对、弱两对和低同花都要降级看待。", "能赢单挑不代表能在多人底池打大。"),
      sec("听牌质量", "坚果听牌比低听牌重要得多。多人底池里，低同花听牌完成后仍可能输给更高同花，弱顺子也可能被更大顺子压制。优先继续坚果同花听牌、开放顺听牌加额外权益，少为被支配听牌付大价格。", "多人底池更奖励能做成坚果的牌。")
    ],
    examples: [
      ex("顶对降级", "CO open，BTN call，BB call。翻牌 A97 两同花，你拿 AQ。", "AQ 是强顶对，但三人底池里对手范围有 99、77、A9s、A7s、同花听牌和组合听牌。下注可以拿价值和保护，但不应自动三条街做大。", "多人底池顶对要先问能被哪些更差牌支付。"),
      ex("空气牌少开火", "HJ open，CO call，BTN call，翻牌 T98 两同花，你拿 AK 无同花。", "这个牌面对跟注范围命中很好，多人底池里下注很难让两名对手都弃掉足够牌。过牌放弃或延后行动通常优于机械 c-bet。", "多人湿润牌面少用空气牌下注。")
    ],
    decisionFlow: [
      "第一步：确认是单挑底池还是多人底池。",
      "第二步：评估牌面是否同时命中多个跟注范围。",
      "第三步：把下注范围收紧到明确价值牌、强听牌和少量高质量半诈唬。",
      "第四步：面对大下注时提高继续门槛，尤其警惕弱听牌和单对牌。"
    ],
    mistakeDetails: [
      miss("多人底池机械 c-bet", "多人同时弃牌的概率较低，空气下注很容易被至少一人继续。", "多人底池先问下注能让哪些更好牌弃牌，或被哪些更差牌跟注。"),
      miss("顶对打成坚果", "对手数量越多，两对、set 和强听牌密度越高，顶对承受大底池能力下降。", "顶对好踢脚可以拿价值，但要按人数、牌面和行动控制底池。"),
      miss("低听牌付大价格", "完成低同花或低顺子后仍可能输给更高版本，反向隐含赔率更严重。", "优先继续坚果听牌；弱听牌需要更好价格和位置。")
    ],
    checkpoint: ["识别多人底池", "说明下注频率下降", "判断价值阈值和听牌质量"],
    quiz: [
      q("多人底池中默认下注频率通常怎样？", ["下降", "无限上升", "完全不变"], "下降", "人数越多，至少一名对手继续的概率越高，空气下注更难盈利。"),
      q("多人底池里顶对通常应该怎样看待？", ["相对降级", "永远是坚果", "必须每次全下"], "相对降级", "对手数量增加会提高两对、set 和强听牌出现概率。"),
      q("多人底池更偏好哪类听牌继续？", ["坚果听牌", "任何低同花听牌", "没有 outs 的空气"], "坚果听牌", "坚果听牌完成后不容易被更高版本反超。")
    ],
    practiceTasks: [
      task("多人底池降级练习", "写 5 个三人底池顶对场景，分别标注哪些适合价值下注、哪些适合控池。"),
      task("听牌质量排序", "把低同花听牌、坚果同花听牌、开放顺听牌、卡顺听牌按多人底池可继续性排序，并写理由。")
    ],
    relatedTerms: ["multiway-pot", "value-threshold", "bluff-frequency", "top-pair", "nut-flush-draw", "reverse-implied-odds", "c-bet", "showdown-value"],
    nextSteps: [nextChapter("学习权益与赔率", 12, "继续第 13 章，用 outs、赔率和权益实现给跟注决策定价。")]
  }),
  chapter({
    id: chapterIds[12],
    stage: 13,
    title: "权益、outs、赔率与实现",
    subtitle: "用数字给跟注和诈唬刹车",
    difficulty: "intermediate",
    estimatedMinutes: 18,
    beginnerSafe: false,
    summary: "本章讲 equity、outs、pot odds、implied odds、reverse implied odds、fold equity 和 equity realization。",
    plainLanguage: "权益是如果现在摊牌或跑完牌，你大概能赢多少。赔率告诉你跟注要赢多少才不亏；实现率告诉你这些权益能不能真的拿到。",
    tableExample: "底池 100，对手下注 50，你跟 50 去争 200，需要 25% 胜率。若只有 18% 且没有额外隐含赔率，跟注就贵。",
    whyItMatters: "数学不是为了炫技，而是防止你用想看一张的冲动支付负价格。",
    miniChecklist: ["先算 pot odds", "再数干净 outs", "评估隐含和反向隐含赔率"],
    encouragement: "你不需要变成计算器。会算 25%、33% 这些常见价格已经很有用。",
    goals: [
      "能用跟注额和最终底池计算 pot odds",
      "能估算 outs 与 equity",
      "能解释 fold equity 和 equity realization"
    ],
    prerequisites: [chapterIds[10], chapterIds[8]],
    sections: [
      sec("Equity 与 outs", "equity 是你对抗对手范围的胜率份额。outs 是能改善成领先牌的张数，但要排除会让对手更强的脏 outs。", "outs 要先判断是否干净。"),
      sec("Pot odds", "pot odds = 跟注额 / 跟注后最终底池。跟 50 争 200 需要 25% 胜率。", "跟注价格必须和胜率比较。"),
      sec("隐含与反向隐含", "implied odds 是成牌后还能赢更多；reverse implied odds 是成牌后仍可能输更大。小同花和弱顺子常有反向隐患。", "未来收益和未来损失都要算。"),
      sec("弃牌率与实现率", "fold equity 是下注让对手弃牌带来的收益；equity realization 是你把理论胜率真正带到摊牌或收益中的能力。位置差时实现率下降。", "有权益不等于能实现权益。")
    ],
    examples: [
      ex("同花听牌价格", "翻牌你有 9 个同花 outs，对手 pot size bet。", "面对底池下注，你跟注需要约 33% 立即胜率；若只看一张转牌，同花完成率约 18%，需要隐含赔率支持。", "听牌跟注要看能看几张和未来收益。"),
      ex("半诈唬的 fold equity", "你有坚果同花听牌和两个高张，在转牌下注。", "即使被跟仍有权益；若对手弃掉部分更好现成牌，你还获得 fold equity。", "半诈唬结合弃牌率和成牌率。")
    ],
    decisionFlow: [
      "第一步：计算跟注后最终底池。",
      "第二步：得出最低所需胜率。",
      "第三步：数 outs 并剔除脏 outs。",
      "第四步：加入隐含赔率、反向隐含赔率和实现率判断。"
    ],
    mistakeDetails: [
      miss("有听牌就跟", "价格不够时，长期每次都在负期望支付。", "先算 pot odds 再决定。"),
      miss("outs 全当干净", "补成牌也可能让对手更大同花或更大顺子。", "标出可能反向隐含的 outs。"),
      miss("忽略位置实现率", "无位置时你更难免费看牌、拿价值或控制底池。", "位置差时提高跟注门槛。")
    ],
    checkpoint: ["计算 pot odds", "估算 outs", "解释 fold equity"],
    quiz: [
      q("跟 50 去争最终 200 需要多少胜率？", ["25%", "50%", "75%"], "25%", "50/200 等于 25%。"),
      q("fold equity 来自哪里？", ["对手弃牌", "自己已经成坚果", "抽水降低"], "对手弃牌", "下注让对手弃牌会立即赢下底池。"),
      q("reverse implied odds 指什么？", ["成牌后仍可能输更多", "成牌后一定赢更多", "翻前位置优势"], "成牌后仍可能输更多", "弱同花、弱顺子常有反向隐含风险。")
    ],
    practiceTasks: [
      task("赔率口算", "计算 10 个下注场景的最低所需胜率。"),
      task("outs 清洗", "给 5 个听牌场景标出干净 outs 和脏 outs。")
    ],
    relatedTerms: ["equity", "outs", "pot-odds", "implied-odds", "reverse-implied-odds", "fold-equity", "equity-realization", "draw"],
    nextSteps: [nextChapter("学习 SPR 与承诺", 13, "继续第 14 章，用有效筹码和 SPR 规划底池能走多远。")]
  }),
  chapter({
    id: chapterIds[13],
    stage: 14,
    title: "SPR、有效筹码与承诺计划",
    subtitle: "底池和剩余筹码决定一手牌能走多远",
    difficulty: "intermediate",
    estimatedMinutes: 17,
    beginnerSafe: false,
    summary: "本章讲 SPR、effective stack、stack depth、commitment 和 all-in planning。",
    plainLanguage: "SPR 是剩余有效筹码和底池的比例。SPR 低，顶对更容易打光；SPR 高，一对牌就要更谨慎。",
    tableExample: "翻牌底池 20BB，有效筹码 60BB，SPR=3。顶对好踢脚可以规划多街价值；若 SPR=12，同一手牌不该轻易打光。",
    whyItMatters: "很多大错不是河牌才发生，而是翻前和翻牌已经把 SPR 做成了不适合自己牌力的形状。",
    miniChecklist: ["先看有效筹码", "翻牌计算 SPR", "决定是否愿意打到全下"],
    encouragement: "SPR 像牌局的限速牌。看懂它，你会少在错误速度下转弯。",
    goals: [
      "能计算 SPR 和 effective stack",
      "能按筹码深度调整顶对、超对和听牌计划",
      "能解释 commitment 不是情绪上的舍不得"
    ],
    prerequisites: [chapterIds[11], chapterIds[5]],
    sections: [
      sec("有效筹码", "effective stack 是参与玩家中较短的筹码量，因为你最多只能从对手那里赢到他覆盖的部分。", "决策看有效筹码，不看最大筹码。"),
      sec("SPR", "SPR = 翻牌时有效剩余筹码 / 底池。3-bet 底池通常 SPR 更低，单加注底池 SPR 更高。", "SPR 衡量后续下注空间。"),
      sec("承诺与全下", "commitment 指根据底池、范围和牌力已经计划继续投入，而不是因为已经投了钱舍不得。", "承诺来自计划，不来自沉没成本。"),
      sec("筹码深度", "短筹码重视高牌和对子价值，深筹码更重视坚果潜力、位置和反向隐含赔率。", "筹码越深，单对越要谨慎。")
    ],
    examples: [
      ex("低 SPR 顶对", "3-bet 底池，SPR=2.5，你拿 AK 在 A72 翻牌。", "顶对顶踢脚在低 SPR 下足够强，通常可以规划两街打入。", "低 SPR 强顶对更接近承诺。"),
      ex("高 SPR 超对", "单加注底池，SPR=12，你拿 AA 在 987 两同花面对 check-raise。", "深筹码湿润面，对手强牌和强听牌多。AA 不能自动打光。", "高 SPR 下超对也要保留刹车。")
    ],
    decisionFlow: [
      "第一步：确认参与玩家有效筹码。",
      "第二步：翻牌计算 SPR。",
      "第三步：把当前牌力放进低、中、高 SPR 语境。",
      "第四步：决定是否有清楚 all-in planning。"
    ],
    mistakeDetails: [
      miss("用总筹码替代有效筹码", "对手短筹码时，你无法赢到自己更深的部分。", "每手牌先写 effective stack。"),
      miss("已经投入就不肯弃", "沉没成本会让你在负期望位置继续烧钱。", "只看继续投入是否盈利。"),
      miss("深筹码单对打光", "深筹码大底池更偏强范围，单对价值下降。", "SPR 高时控制底池和尊重加注。")
    ],
    checkpoint: ["计算 effective stack", "计算 SPR", "制定 all-in 计划"],
    quiz: [
      q("SPR 等于什么？", ["有效剩余筹码除以底池", "手牌点数相加", "抽水比例"], "有效剩余筹码除以底池", "SPR 衡量筹码和底池比例。"),
      q("有效筹码由谁决定？", ["参与玩家中较短筹码", "桌上最大筹码", "按钮位筹码"], "参与玩家中较短筹码", "双方最多争夺较短玩家覆盖的筹码。"),
      q("高 SPR 时单对通常应怎样？", ["更谨慎", "自动全下", "忽略位置"], "更谨慎", "深筹码下单对承受大底池能力有限。")
    ],
    practiceTasks: [
      task("SPR 计算", "给 8 个底池和筹码场景计算 SPR。"),
      task("承诺判断", "为 5 个顶对场景写出是否愿意打到全下。")
    ],
    relatedTerms: ["spr", "effective-stack", "commitment", "all-in", "top-pair", "overpair", "bet-sizing"],
    nextSteps: [nextChapter("学习转河计划", 14, "继续第 15 章，把翻牌决定延伸到转牌和河牌计划。")]
  }),
  chapter({
    id: chapterIds[14],
    stage: 15,
    title: "转牌与河牌计划",
    subtitle: "第二枪、控池、薄价值和河牌纪律",
    difficulty: "advanced",
    estimatedMinutes: 18,
    beginnerSafe: false,
    summary: "本章讲 turn/river planning、barrel、pot control、thin value、bluff-catching、blockers 和 river discipline。",
    plainLanguage: "翻牌下注前就要想转牌和河牌。否则你会在底池变大后才发现自己不知道该继续、控池还是弃牌。",
    tableExample: "你翻牌半诈唬同花听牌，转牌拿到额外顺子听牌，这是适合继续 turn barrel 的牌；河牌没中且对手范围不弃，就要有纪律停手。",
    whyItMatters: "转河是昂贵街道。没有计划的第二枪和英雄跟注，会把小错误放大成大底池损失。",
    miniChecklist: ["翻牌先列好转牌", "河牌问价值目标或诈唬目标", "没有目标就控池或放弃"],
    encouragement: "纪律不是保守，是知道哪条街该把故事讲完，哪条街该闭嘴。",
    goals: [
      "能规划 turn barrel 和 river barrel",
      "能区分 pot control、thin value 与 bluff-catch",
      "能用 blocker 辅助河牌决策"
    ],
    prerequisites: [chapterIds[12], chapterIds[10]],
    sections: [
      sec("转牌计划", "翻牌下注时就列出哪些转牌继续 barrel，哪些转牌控池。改善你范围或你权益的牌更适合继续。", "第二枪应由计划触发。"),
      sec("控池", "pot control 不是软弱，而是在中等牌力、位置好或不想面对大加注时控制底池大小。", "中等牌力需要保护摊牌价值。"),
      sec("薄价值与抓诈", "thin value 是向更差但会跟的边缘牌收费；bluff-catching 是不主动价值，只用来接住对手诈唬。", "河牌要分清自己是收费还是抓诈。"),
      sec("阻断牌与纪律", "blocker 能减少对手某些强牌组合，但不能单独证明对手在诈唬。river discipline 是在故事不成立时停止付钱。", "阻断牌是辅助，不是借口。")
    ],
    examples: [
      ex("好转牌继续 barrel", "你 c-bet Qs Js 在 Ks 7d 3s，转牌 Td。", "转牌给你开放顺听牌并保持同花听牌，权益提升且能代表强 K、两对、顺子。适合 turn barrel。", "权益提升的转牌适合继续施压。"),
      ex("河牌薄价值", "你拿 AQ，牌面 A 8 4 2 2，对手两街 check-call 后河牌 check。", "对手有许多弱 A 和口袋对子。小到中等尺度可向更差 A 薄价值，但面对加注要谨慎。", "薄价值要提前定义会被哪些更差牌跟。")
    ],
    decisionFlow: [
      "第一步：翻牌下注前列出好转牌和坏转牌。",
      "第二步：转牌确认自己是价值、半诈唬还是控池。",
      "第三步：河牌列出目标跟注牌或目标弃牌。",
      "第四步：没有清楚目标时执行 river discipline。"
    ],
    mistakeDetails: [
      miss("无脑第二枪", "对手转牌继续范围变强，盲目 barrel 会烧钱。", "只在范围、权益或弃牌率改善时继续。"),
      miss("薄价值变送价值", "下注太大或目标不清，会只被更强牌跟注。", "先写出三类更差跟注牌。"),
      miss("阻断牌万能化", "有 blocker 不代表对手一定不能有强牌。", "把 blocker 和行动线、人数、牌面一起看。")
    ],
    checkpoint: ["规划 turn barrel", "执行 pot control", "做河牌目标清单"],
    quiz: [
      q("turn barrel 最好基于什么？", ["计划和转牌变化", "因为翻牌已经下注", "因为不想示弱"], "计划和转牌变化", "继续下注要服务范围、权益或弃牌率。"),
      q("thin value 是什么？", ["向更差边缘牌收费", "没有权益乱诈唬", "永远过牌"], "向更差边缘牌收费", "薄价值目标是更差但会跟的牌。"),
      q("blocker 应怎样使用？", ["作为辅助信息", "单独证明对手诈唬", "完全忽略行动线"], "作为辅助信息", "阻断牌必须结合范围和行动。")
    ],
    practiceTasks: [
      task("转牌清单", "为 5 个翻牌下注场景列出继续 barrel 的转牌。"),
      task("河牌纪律", "写 3 个你过去想 hero call 的场景，并列出实际能击败的诈唬。")
    ],
    relatedTerms: ["barrel", "pot-control", "thin-value", "bluff-catch", "blocker", "river", "turn", "showdown-value"],
    nextSteps: [nextChapter("学习对手类型", 15, "继续第 16 章，学习根据对手类型和群体倾向做剥削调整。")]
  }),
  chapter({
    id: chapterIds[15],
    stage: 16,
    title: "对手类型与剥削调整",
    subtitle: "先观察偏差，再偏离基准",
    difficulty: "advanced",
    estimatedMinutes: 17,
    beginnerSafe: false,
    summary: "本章讲 opponent types、player stats、population tendencies、table selection 和 exploit。",
    plainLanguage: "剥削不是乱针对，而是发现对手长期偏差后做更赚钱的调整。跟注站少诈唬，过紧玩家多偷盲。",
    tableExample: "一个 calling station 河牌很爱跟，你拿强顶对可以多价值下注；用空气三枪诈唬他则很贵。",
    whyItMatters: "低级别收益常来自清楚剥削。你不需要赢每个高手，只要选择好桌、打清楚错误。",
    miniChecklist: ["先分类对手", "用样本验证倾向", "调整必须有可观察证据"],
    encouragement: "观察力就是你的第二副手牌。它让同一套基础策略更贴近真实桌况。",
    goals: [
      "能识别 calling station、nit、maniac、regular",
      "能解释 VPIP、PFR 等基础数据含义",
      "能根据 population tendency 做简单 exploit"
    ],
    prerequisites: [chapterIds[13], chapterIds[6]],
    sections: [
      sec("常见对手类型", "calling station 跟注多，nit 太紧，maniac 攻击过度，regular 更接近稳定策略。分类只是起点，不是永久标签。", "类型帮助你形成初始假设。"),
      sec("基础数据", "VPIP 表示自愿入池率，PFR 表示翻前加注率。两者差距大可能代表被动跟注多。", "数据要结合样本和位置。"),
      sec("群体倾向", "population tendency 是某级别多数玩家的共同偏差。例如低级别河牌诈唬不足，价值下注可更薄，抓诈要更谨慎。", "群体偏差提供默认调整。"),
      sec("选桌与剥削", "table selection 是选择更有盈利机会的桌。exploit 是根据偏差偏离基准，例如对跟注站减少诈唬、增加价值。", "先选好环境，再执行调整。")
    ],
    examples: [
      ex("对跟注站加价值", "对手多次用第三对跟到河牌，你拿顶对好踢脚。", "他的继续范围包含很多更差牌，你可以减少复杂诈唬，增加中大尺度价值下注。", "跟注多的人用价值惩罚。"),
      ex("对 nit 偷盲", "SB 和 BB 都非常紧，BTN 前面弃到你。", "你可以扩大偷盲范围，因为盲位过度弃牌。若被 3-bet，则尊重其强范围。", "紧玩家弃太多时多偷，反击时尊重。")
    ],
    decisionFlow: [
      "第一步：观察对手入池、加注和摊牌。",
      "第二步：形成暂时类型假设。",
      "第三步：寻找足够样本或群体倾向支持。",
      "第四步：选择一个简单剥削调整并记录结果。"
    ],
    mistakeDetails: [
      miss("一手牌就贴标签", "短样本噪音很大，错误标签会导致错误剥削。", "用多次行动验证倾向。"),
      miss("对跟注站过度诈唬", "弃牌率不足时，诈唬失去利润来源。", "把空气诈唬换成薄价值。"),
      miss("只盯高手桌", "桌选差会让你的边际优势下降。", "优先坐有明显娱乐玩家的桌。")
    ],
    checkpoint: ["分类对手类型", "解释 VPIP/PFR", "写一个 exploit 调整"],
    quiz: [
      q("calling station 的典型特征是？", ["跟注过多", "永远不入池", "只打 GTO"], "跟注过多", "跟注站常用过宽范围付钱。"),
      q("VPIP 大幅高于 PFR 可能说明什么？", ["被动跟注多", "完全不看牌", "永远全下"], "被动跟注多", "自愿入池多但加注少，通常较被动。"),
      q("剥削调整应基于什么？", ["可观察偏差", "单纯情绪", "固定迷信"], "可观察偏差", "exploit 来自对手或群体的偏差证据。")
    ],
    practiceTasks: [
      task("对手标签", "观察一桌 20 分钟，为 3 名玩家写暂时类型和证据。"),
      task("剥削计划", "为 calling station、nit、maniac 各写一个调整。")
    ],
    relatedTerms: ["opponent-type", "calling-station", "nit", "maniac", "regular", "population-tendency", "exploit", "vpip", "pfr"],
    nextSteps: [nextChapter("学习 GTO 基础", 16, "继续第 17 章，把范围优势、坚果优势和平衡作为理论基准。")]
  }),
  chapter({
    id: chapterIds[16],
    stage: 17,
    title: "GTO 基础、范围优势与坚果优势",
    subtitle: "理论是地图，不是方向盘",
    difficulty: "advanced",
    estimatedMinutes: 19,
    beginnerSafe: false,
    summary: "本章讲 GTO、balance、range advantage、nut advantage、MDF、solver output，以及何时不要过度使用理论。",
    plainLanguage: "GTO 是不容易被针对的基准。它帮你理解 range advantage 和 nut advantage，但真实桌上仍要根据对手偏差赚钱。",
    tableExample: "BTN open，BB call，A72 rainbow 上 BTN 有更多强 A，拥有 range advantage；但某些低连牌面 BB 可能有更多坚果组合。",
    whyItMatters: "理论能防止你策略太透明；但低级别盲目照抄 solver，会忽略对手跟太多、诈太少这些现实。",
    miniChecklist: ["先找范围优势", "再找坚果优势", "最后决定是否需要平衡"],
    encouragement: "你不必一口吃下 solver。先理解它为什么这么做，比背频率更重要。",
    goals: [
      "能解释 GTO、balance、range advantage 和 nut advantage",
      "能理解 MDF 是防守频率概念",
      "能说出 solver output 的使用边界"
    ],
    prerequisites: [chapterIds[14], chapterIds[12]],
    sections: [
      sec("GTO 与平衡", "GTO 追求在理论上不易被剥削。balance 意味着价值和诈唬比例不让对手轻松反制。", "平衡是防守性基准。"),
      sec("范围优势", "range advantage 指一方整体范围在某牌面平均更强。A 高干燥面常更利于翻前加注者。英文 range advantage 常用于搜索资料。", "整体范围优势影响下注频率。"),
      sec("坚果优势", "nut advantage 指一方拥有更多最强组合。低连接牌面可能让大盲有更多两对、顺子和 set。", "坚果优势影响大尺度压力。"),
      sec("MDF 与 solver", "MDF 是面对下注时理论上最低防守频率。solver output 依赖输入范围、尺度和假设，不能脱离现实照抄。", "理论输出要先检查假设。")
    ],
    examples: [
      ex("A72 的范围优势", "BTN open，BB call，翻牌 A72 rainbow。", "BTN 拥有更多强 A 和高对子，整体 range advantage 明显，因此可用较高频小注。", "范围优势支持高频压力。"),
      ex("987 的坚果优势", "BTN open，BB call，翻牌 987 两同花。", "BB 防守范围有更多 76、T6s、两对和 set。BTN 虽有高牌优势，但 nut advantage 不稳。", "坚果优势不足时少盲目大注。")
    ],
    decisionFlow: [
      "第一步：写出双方翻前范围。",
      "第二步：判断谁有 range advantage。",
      "第三步：判断谁有 nut advantage。",
      "第四步：只在对手足够强或未知时更重视 balance 和 MDF。"
    ],
    mistakeDetails: [
      miss("把 solver 当答案书", "输入假设不同，输出就会变；现实对手也未必按理论反击。", "先理解原则，再抽取可执行策略。"),
      miss("低级别过度平衡", "对手明显跟太多或弃太多时，平衡会少赚。", "对明显偏差优先 exploit。"),
      miss("混淆范围优势和坚果优势", "整体范围强不代表拥有最多最强组合。", "分别判断平均强度和最强组合分布。")
    ],
    checkpoint: ["解释 range advantage", "解释 nut advantage", "说明 MDF 使用边界"],
    quiz: [
      q("range advantage 指什么？", ["整体范围平均更强", "一定有当前坚果", "筹码最多"], "整体范围平均更强", "范围优势是整体分布概念。"),
      q("MDF 是关于什么的概念？", ["最低防守频率", "最大买入数", "翻前手牌缩写"], "最低防守频率", "MDF 用来理解面对下注时理论防守比例。"),
      q("solver output 使用前要先检查什么？", ["输入假设", "牌桌颜色", "玩家昵称"], "输入假设", "范围、尺度和抽水等输入都会影响结果。")
    ],
    practiceTasks: [
      task("优势判断", "为 A72、987、KK4 三个翻牌判断 range advantage 和 nut advantage。"),
      task("理论转执行", "选一个 solver 建议，把它翻译成一句牌桌可执行规则。")
    ],
    relatedTerms: ["gto", "balance", "range-advantage", "nut-advantage", "mdf", "solver", "exploit"],
    nextSteps: [nextChapter("学习赛制与资金管理", 17, "继续第 18 章，把赛制、资金管理和心态纪律纳入长期框架。")]
  }),
  chapter({
    id: chapterIds[17],
    stage: 18,
    title: "赛制、资金管理与心态",
    subtitle: "先活下来，才有长期优势",
    difficulty: "advanced",
    estimatedMinutes: 18,
    beginnerSafe: false,
    summary: "本章讲 cash、tournament、ICM、rake、bankroll、variance、downswing、tilt 和 session discipline。",
    plainLanguage: "技术好也会经历波动。资金管理和止损不是附属品，而是保证你能持续学习的安全带。",
    tableExample: "现金桌亏 3 个 buy-in 后仍想追回来，容易进入 tilt；更好的做法是按 stop-loss 结束，复盘后再打。",
    whyItMatters: "破产通常不是因为一手牌，而是级别、买入、情绪和下风期一起失控。",
    miniChecklist: ["区分现金和锦标赛目标", "按 bankroll 选择级别", "设置 stop-loss 和休息规则"],
    encouragement: "能离桌也是技术。你保护的不只是钱，还有下次做正确决定的能力。",
    goals: [
      "能区分 cash game、tournament 和 ICM 压力",
      "能建立 bankroll 与 buy-in 规则",
      "能识别 variance、downswing 和 tilt"
    ],
    prerequisites: [chapterIds[15], chapterIds[11]],
    sections: [
      sec("现金与锦标赛", "cash game 每个筹码通常等于现金价值；tournament 筹码价值受名次和 ICM 影响，不能简单等价。", "不同赛制的筹码意义不同。"),
      sec("ICM 与 ante", "ICM 让锦标赛后期保命价值上升；ante 会增加底池死钱，推动更积极争夺。", "锦标赛要同时看筹码和奖金压力。"),
      sec("资金管理", "bankroll 是专门用于扑克的资金。根据级别波动设置足够 buy-in，并在下风期主动降级。", "级别选择要服务长期存活。"),
      sec("波动与心态", "variance 会让正确打法短期输钱；downswing 是连续下行；tilt 是情绪影响决策。session discipline 包括时长、止损和休息。", "心态管理是执行力管理。")
    ],
    examples: [
      ex("现金桌止损", "你在 NL10 连输 3 个 buy-in，开始想用更松的 3-bet 追回。", "这已经接近 tilt 信号。按 stop-loss 离桌，保留手牌复盘，比继续扩大波动更好。", "止损保护决策质量。"),
      ex("锦标赛泡沫期", "你中等筹码，短筹码还很多，奖金圈临近。", "ICM 压力让你不能像现金桌一样只看 chip EV。面对覆盖你的大筹码，要减少边缘全下。", "锦标赛筹码价值非线性。")
    ],
    decisionFlow: [
      "第一步：确认当前是 cash game 还是 tournament。",
      "第二步：检查 bankroll 和当前 buy-in 是否匹配。",
      "第三步：识别 variance 与 tilt 信号。",
      "第四步：按 session discipline 决定继续、降级或停止。"
    ],
    mistakeDetails: [
      miss("资金不足硬打高级别", "正常波动也可能让账户破产，技术优势无法体现。", "按 buy-in 数量选择级别。"),
      miss("把下风期当成必须追回", "追损会扩大 tilt 和策略偏离。", "设置 stop-loss，离桌后复盘。"),
      miss("锦标赛忽略 ICM", "泡沫期和决赛桌筹码风险不等于现金桌。", "关键阶段减少边缘对抗。")
    ],
    checkpoint: ["区分现金和锦标赛", "制定 bankroll 规则", "识别 tilt 信号"],
    quiz: [
      q("ICM 主要影响哪类场景？", ["tournament", "普通现金桌", "发牌洗牌"], "tournament", "ICM 用于锦标赛筹码和奖金价值转换。"),
      q("downswing 指什么？", ["连续下行期", "固定盈利技巧", "翻前开池尺度"], "连续下行期", "下风期可能由波动和错误共同造成。"),
      q("tilt 时最好的第一步常是？", ["停止或休息", "立刻升盲追回", "扩大所有诈唬"], "停止或休息", "先恢复决策质量，再谈策略。")
    ],
    practiceTasks: [
      task("资金规则", "为现金桌写一套升级、降级和 stop-loss 规则。"),
      task("心态日志", "记录三次情绪波动前的触发点和当时错误冲动。")
    ],
    relatedTerms: ["cash-game", "tournament", "icm", "ante", "bankroll", "buy-in", "variance", "downswing", "tilt", "stop-loss"],
    nextSteps: [nextChapter("建立复盘习惯", 18, "继续第 19 章，把手牌记录、错误标签和每周学习计划串起来。")]
  }),
  chapter({
    id: chapterIds[18],
    stage: 19,
    title: "手牌复盘与学习流程",
    subtitle: "把错误变成下一周的训练计划",
    difficulty: "advanced",
    estimatedMinutes: 20,
    beginnerSafe: false,
    summary: "本章讲 hand review、study routine、ranges、street-by-street、mistake tags 和 weekly plan。",
    plainLanguage: "复盘不是骂自己，也不是证明自己倒霉。复盘是把一手牌拆成位置、范围、牌面、下注目的和情绪，找出下次能改的一件事。",
    tableExample: "记录一手河牌抓诈失败，不只写输了；要写翻前范围、翻牌 c-bet 目的、转牌是否该 barrel、河牌有哪些真实诈唬。",
    whyItMatters: "没有复盘，错误会伪装成运气。系统复盘让你看到反复出现的漏洞，并把它们变成训练任务。",
    miniChecklist: ["保存完整 hand history", "逐街写范围和目的", "给错误贴 mistake tag"],
    encouragement: "每一次诚实复盘，都是给未来的自己留一张更清楚的地图。",
    goals: [
      "能按 street-by-street 复盘一手牌",
      "能用 mistake tag 归类重复错误",
      "能制定一周 study routine"
    ],
    prerequisites: [chapterIds[16], chapterIds[15]],
    sections: [
      sec("完整记录", "hand history 要包含位置、有效筹码、前面行动、每街牌面、下注尺度和摊牌结果。缺信息的复盘会变成猜谜。", "复盘质量从记录质量开始。"),
      sec("逐街分析", "street-by-street 从翻前范围开始，逐街问：我的范围是什么，对手范围是什么，这个行动目的是什么。", "逐街复盘能找到错误发生点。"),
      sec("错误标签", "mistake tag 把错误归类，例如翻前过松、无目的 c-bet、赔率不足跟注、tilt call。标签帮助发现模式。", "重复标签就是训练优先级。"),
      sec("每周计划", "study routine 可以包括两次手牌复盘、一次范围练习、一次赔率训练和一次理论阅读。计划要小到能完成。", "学习流程要可重复。")
    ],
    examples: [
      ex("河牌抓诈复盘", "你用第二对接下河牌 pot size bet 后输给价值牌。", "复盘不只看河牌。要检查翻前范围、转牌对手继续后有哪些诈唬、河牌下注尺度是否在低级别偏价值。", "抓诈失败要回到范围和群体倾向。"),
      ex("每周标签统计", "一周 20 手牌复盘里有 7 手标记为无目的 c-bet。", "这说明下周训练重点不是背更多翻前范围，而是牌面结构和下注目的。", "标签把学习从感觉变成证据。")
    ],
    decisionFlow: [
      "第一步：保存完整手牌记录。",
      "第二步：从翻前开始逐街写双方范围。",
      "第三步：给关键决策标下注目的和替代线。",
      "第四步：贴 mistake tag，并把最高频标签放进下周计划。"
    ],
    mistakeDetails: [
      miss("只复盘输掉的大底池", "赢的牌也可能有错误，输的小底池也可能反复漏钱。", "按困惑程度和决策质量选牌。"),
      miss("结果导向", "赢了不代表打得好，输了不代表打错。", "评价决策过程，不评价单次结果。"),
      miss("计划太大", "一次想改十个漏洞会导致无法执行。", "每周只选一到两个高频标签训练。")
    ],
    checkpoint: ["完成逐街复盘", "使用 mistake tag", "写一周 study routine"],
    quiz: [
      q("hand review 首先需要什么？", ["完整手牌记录", "只记输赢金额", "只看河牌结果"], "完整手牌记录", "没有位置、筹码和行动就难以复盘。"),
      q("mistake tag 的作用是？", ["发现重复错误模式", "证明自己倒霉", "替代所有学习"], "发现重复错误模式", "标签让重复漏洞可见。"),
      q("好的 study routine 应该怎样？", ["小而可重复", "每天换十个主题", "只看结果截图"], "小而可重复", "能坚持的计划才会产生复利。")
    ],
    practiceTasks: [
      task("完整复盘", "选择一手牌，按翻前、翻牌、转牌、河牌写双方范围和行动目的。"),
      task("周计划", "根据最近 10 个 mistake tag 写出下周三项训练任务。")
    ],
    relatedTerms: ["hand-history", "mistake-tag", "study-routine", "range", "barrel", "bluff-catch", "solver", "tilt"],
    nextSteps: [
      nextRoute("打开复盘工具", "review", "进入复盘页，按逐街问题记录并标记最近的一手牌。"),
      nextRoute("回到学习路径", "learning", "回到学习列表，按章节顺序查漏补缺并安排下一轮复习。")
    ]
  })
];
