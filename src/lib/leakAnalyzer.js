const LEAK_RULES = [
  {
    id: "preflop-discipline",
    title: "翻前纪律不稳",
    matchTypes: ["preflop"],
    matchTags: ["preflop", "domination", "full-ring", "bb-defense", "equity-realization"],
    why: "这类错误通常来自面对强开池太松、盲位过度防守，或只看自己牌面不看位置。",
    habit: "先问三个问题：谁开池、我在哪、后面还有几个人。默认先收紧，再根据对手放宽。",
    drillType: "preflop"
  },
  {
    id: "price-discipline",
    title: "听牌价格没算清",
    matchTypes: ["odds"],
    matchTags: ["odds", "outs", "pot-odds", "flush-draw", "open-ended"],
    why: "这类错误会让你用不够价格的听牌持续付钱，长期看像慢性漏水。",
    habit: "先数 outs，再估权益，最后比较跟注价格；价格不够时必须有隐含赔率或弃牌率补足。",
    drillType: "odds"
  },
  {
    id: "postflop-autopilot",
    title: "翻后自动驾驶",
    matchTypes: ["board", "decision"],
    matchTags: ["cbet", "board-texture", "multiway", "range-advantage", "3bet-pot"],
    why: "常见表现是看到自己是翻前进攻者就机械 c-bet，忽略牌面结构和多人底池。",
    habit: "每次下注前先说出目的：拿价值、诈唬、保护，还是实现权益。说不出来就先慢下来。",
    drillType: "decision"
  },
  {
    id: "river-discipline",
    title: "河牌纪律不足",
    matchTypes: ["decision"],
    matchTags: ["river", "bluff-catch", "showdown-value", "exploit"],
    why: "河牌错误通常很贵：过度抓诈、薄价值过头，或没有根据对手类型调整。",
    habit: "河牌先判断更差牌会不会跟、更好牌会不会弃；面对低诈唬玩家，少用理论借口硬跟。",
    drillType: "decision"
  }
];

function rowForMistake(mistake, drills) {
  const question = drills.find((drill) => drill.id === mistake.questionId);
  return question ? { mistake, question } : null;
}

function scoreRule(row, rule) {
  const tags = row.question.tags || [];
  let score = 0;

  if (rule.matchTypes.includes(row.question.type)) {
    score += 2;
  }

  tags.forEach((tag) => {
    if (rule.matchTags.includes(tag)) {
      score += 1;
    }
  });

  return score;
}

function correctiveDrills(rule, drills, mistakeIds) {
  return drills
    .filter((drill) => drill.type === rule.drillType && !mistakeIds.has(drill.id))
    .slice(0, 3);
}

export function analyzeMistakeLeaks(state, drills) {
  const unresolved = (state.savedMistakes || [])
    .filter((mistake) => mistake.status !== "mastered")
    .map((mistake) => rowForMistake(mistake, drills))
    .filter(Boolean);
  const mistakeIds = new Set(unresolved.map((row) => row.question.id));

  return LEAK_RULES.map((rule) => {
    const matches = unresolved
      .map((row) => ({ row, score: scoreRule(row, rule) }))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score);

    return {
      id: rule.id,
      title: rule.title,
      why: rule.why,
      habit: rule.habit,
      count: matches.length,
      examples: matches.slice(0, 3).map((item) => item.row.question),
      correctiveDrills: correctiveDrills(rule, drills, mistakeIds)
    };
  })
    .filter((leak) => leak.count > 0)
    .sort((a, b) => b.count - a.count || a.title.localeCompare(b.title, "zh-CN"));
}
