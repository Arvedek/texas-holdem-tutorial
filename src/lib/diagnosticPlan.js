export const diagnosticOptions = {
  experience: [
    { value: "new", label: "完全新手" },
    { value: "home-game", label: "朋友局玩家" },
    { value: "online-cash", label: "线上现金局" },
    { value: "tournament", label: "锦标赛玩家" }
  ],
  tableSize: ["4-max", "5-max", "6-max", "7-max", "8-max", "9-max"],
  focus: [
    { value: "preflop", label: "翻前范围" },
    { value: "postflop", label: "翻后决策" },
    { value: "odds", label: "赔率与 outs" },
    { value: "review", label: "复盘习惯" }
  ]
};

const FOCUS_CONFIG = {
  preflop: {
    title: "翻前纪律第一周",
    label: "翻前",
    lessonIds: ["positions-blinds-action-order", "starting-hands-range-thinking", "open-limp-isolate-call-fold"],
    drillType: "preflop",
    route: "ranges",
    summary: "先把位置、开池和面对 open 的默认纪律稳住。"
  },
  postflop: {
    title: "翻后决策第一周",
    label: "翻后",
    lessonIds: ["board-texture-reading", "relative-hand-strength", "bet-purpose-sizing"],
    drillType: "decision",
    route: "training",
    summary: "先练牌面结构、相对牌力和下注目的。"
  },
  odds: {
    title: "赔率数学第一周",
    label: "赔率",
    lessonIds: ["equity-outs-odds-realization", "spr-stack-depth-commitment", "turn-river-planning"],
    drillType: "odds",
    route: "training",
    summary: "先把 outs、底池赔率和 SPR 变成自动反应。"
  },
  review: {
    title: "复盘习惯第一周",
    label: "复盘",
    lessonIds: ["hand-review-study-routine", "formats-bankroll-mental-game", "opponent-types-exploit"],
    drillType: "decision",
    route: "review",
    summary: "先建立记录、标错和复盘闭环。"
  }
};

function findLesson(lessons, id, fallbackIndex) {
  return lessons.find((lesson) => lesson.id === id) || lessons[fallbackIndex] || lessons[0];
}

function tableAdvice(tableSize) {
  if (["8-max", "9-max"].includes(tableSize)) {
    return `${tableSize} 早位更紧，先减少被强范围压制的大错。`;
  }

  if (["4-max", "5-max"].includes(tableSize)) {
    return `${tableSize} 盲注压力更高，后位和盲位争夺会更频繁。`;
  }

  return `${tableSize} 是常见基准，适合先建立默认策略。`;
}

export function normalizeDiagnosticProfile(profile) {
  if (!profile || typeof profile !== "object") {
    return null;
  }

  const experience = diagnosticOptions.experience.some((item) => item.value === profile.experience)
    ? profile.experience
    : "new";
  const tableSize = diagnosticOptions.tableSize.includes(profile.tableSize) ? profile.tableSize : "6-max";
  const focus = diagnosticOptions.focus.some((item) => item.value === profile.focus) ? profile.focus : "preflop";

  return { experience, tableSize, focus };
}

export function generateStarterPlan(profile, lessons = [], drills = []) {
  const normalized = normalizeDiagnosticProfile(profile) || { experience: "new", tableSize: "6-max", focus: "preflop" };
  const config = FOCUS_CONFIG[normalized.focus] || FOCUS_CONFIG.preflop;
  const lessonOne = findLesson(lessons, config.lessonIds[0], 0);
  const lessonTwo = findLesson(lessons, config.lessonIds[1], 1);
  const lessonThree = findLesson(lessons, config.lessonIds[2], 2);
  const drillCount = drills.filter((drill) => drill.type === config.drillType).length;

  return {
    title: config.title,
    summary: `${config.summary} ${tableAdvice(normalized.tableSize)}`,
    profile: normalized,
    days: [
      { day: 1, title: `读：${lessonOne.title}`, route: "learning", lessonId: lessonOne.id, cta: "打开学习路径" },
      { day: 2, title: `练：${config.label}基础 5 题`, route: "training", drillType: config.drillType, cta: `练 ${config.label}` },
      { day: 3, title: normalized.focus === "preflop" ? `查：${normalized.tableSize} 翻前范围` : `读：${lessonTwo.title}`, route: normalized.focus === "preflop" ? "ranges" : "learning", lessonId: lessonTwo.id, cta: normalized.focus === "preflop" ? "打开范围" : "继续学习" },
      { day: 4, title: `练：情境题 ${Math.min(drillCount, 10)} 道`, route: "training", drillType: config.drillType, cta: "进入训练" },
      { day: 5, title: `读：${lessonThree.title}`, route: "learning", lessonId: lessonThree.id, cta: "补章节" },
      { day: 6, title: "写：保存一条真实手牌复盘", route: "review", cta: "写复盘" },
      { day: 7, title: "回看：错题本和薄弱点", route: "mistakes", cta: "打开错题本" }
    ]
  };
}
