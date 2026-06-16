import { drillTypes } from "../data/drills.js";
import { analyzeMistakeLeaks } from "./leakAnalyzer.js";
import { generateStarterPlan } from "./diagnosticPlan.js";

const LESSON_BY_TYPE = {
  preflop: "starting-hands-range-thinking",
  odds: "equity-outs-odds-realization",
  board: "board-texture-reading",
  decision: "bet-purpose-sizing"
};

function nextLessonTask(state, lessons) {
  const completed = new Set(state.completedLessons || []);
  const lesson = lessons.find((item) => !completed.has(item.id)) || lessons[lessons.length - 1];

  return {
    kind: "lesson",
    title: `读一节：${lesson?.title || "学习路径"}`,
    body: "先用教材建立概念，再进训练中心验证直觉。",
    cta: "打开章节",
    route: "learning",
    lessonId: lesson?.id || null,
    minutes: 10
  };
}

function getWeakTrainingType(state, drills) {
  const drillById = new Map(drills.map((drill) => [drill.id, drill]));
  const rows = (state.drillAttempts || []).reduce((acc, attempt) => {
    const type = drillById.get(attempt.questionId)?.type;
    if (!type) {
      return acc;
    }

    acc[type] = acc[type] || { type, total: 0, correct: 0 };
    acc[type].total += 1;
    acc[type].correct += attempt.correct ? 1 : 0;
    return acc;
  }, {});

  return Object.values(rows)
    .map((row) => ({
      ...row,
      accuracy: Math.round((row.correct / row.total) * 100),
      label: drillTypes[row.type] || row.type
    }))
    .filter((row) => row.total >= 2 && row.accuracy < 80)
    .sort((a, b) => a.accuracy - b.accuracy || b.total - a.total || a.label.localeCompare(b.label, "zh-CN"))[0] || null;
}

function firstDrillOfType(drills, type) {
  return drills.find((drill) => drill.type === type) || drills[0] || null;
}

function diagnosticTask(state, lessons, drills) {
  if (!state.diagnosticProfile) {
    return {
      kind: "diagnostic",
      title: "先做 3 分钟诊断",
      body: "回答经验、桌型和当前目标，系统会给你排第一周路线。",
      cta: "生成计划",
      route: "dashboard",
      minutes: 3
    };
  }

  const plan = generateStarterPlan(state.diagnosticProfile, lessons, drills);
  const firstTrainingDay = plan.days.find((day) => day.route === "training");
  return {
    kind: "plan",
    title: `跟进计划：${firstTrainingDay?.title || plan.days[0]?.title || plan.title}`,
    body: plan.summary,
    cta: firstTrainingDay?.cta || "继续计划",
    route: firstTrainingDay?.route || plan.days[0]?.route || "learning",
    drillType: firstTrainingDay?.drillType || null,
    minutes: 8
  };
}

function feedbackTask(state) {
  const unresolved = (state.savedMistakes || []).filter((mistake) => mistake.status !== "mastered").length;
  const attempts = (state.drillAttempts || []).length;
  const reviews = (state.handReviews || []).length;

  if (!attempts) {
    return {
      kind: "feedback",
      title: "正反馈：先完成第一题",
      body: "第一题不要求答对，只要求暴露真实直觉；答错也会进入错题本变成资产。",
      cta: "开始训练",
      route: "training",
      minutes: 5
    };
  }

  return {
    kind: "feedback",
    title: "正反馈：你已经有学习数据了",
    body: `已有 ${attempts} 次训练、${unresolved} 道未掌握错题、${reviews} 条复盘。下一步不是盲刷，而是把最大漏洞打薄。`,
    cta: unresolved ? "看错题" : "继续训练",
    route: unresolved ? "mistakes" : "training",
    minutes: 2
  };
}

function uniqueTasks(tasks) {
  const seen = new Set();
  return tasks.filter((task) => {
    const key = `${task.kind}:${task.route}:${task.questionId || task.lessonId || task.drillType || task.title}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

export function buildCoachQueue(state, lessons = [], drills = []) {
  const leaks = analyzeMistakeLeaks(state, drills);
  const tasks = [];

  if (leaks.length) {
    const topLeak = leaks[0];
    tasks.push({
      kind: "leak",
      title: `先修最大漏洞：${topLeak.title}`,
      body: `${topLeak.count} 道未掌握错题指向这里。先读原因和习惯，再做一题纠正练习。`,
      cta: "打开漏洞库",
      route: "mistakes",
      leakId: topLeak.id,
      minutes: 8
    });

    const corrective = topLeak.correctiveDrills[0];
    if (corrective) {
      tasks.push({
        kind: "practice",
        title: `纠正训练：${drillTypes[corrective.type] || corrective.type}`,
        body: corrective.prompt,
        cta: "直接练这题",
        route: "training",
        drillType: corrective.type,
        questionId: corrective.id,
        minutes: 5
      });
    }
  }

  const weakType = getWeakTrainingType(state, drills);
  if (weakType) {
    const drill = firstDrillOfType(drills, weakType.type);
    tasks.push({
      kind: "weakness",
      title: `补薄弱项：${weakType.label}`,
      body: `最近 ${weakType.total} 题准确率 ${weakType.accuracy}%。先做同类短题，不急着进入更复杂牌局。`,
      cta: "练薄弱项",
      route: "training",
      drillType: weakType.type,
      questionId: drill?.id || null,
      lessonId: LESSON_BY_TYPE[weakType.type] || null,
      minutes: 6
    });
  }

  if (!(state.drillAttempts || []).length) {
    const plan = state.diagnosticProfile ? generateStarterPlan(state.diagnosticProfile, lessons, drills) : null;
    const drillType = plan?.days.find((day) => day.drillType)?.drillType || "preflop";
    const drill = firstDrillOfType(drills, drillType);
    tasks.push({
      kind: "practice",
      title: `完成第一组：${drillTypes[drillType] || "基础训练"}`,
      body: "先做 5 题，系统才能开始判断你真正的薄弱点。",
      cta: "开始训练",
      route: "training",
      drillType,
      questionId: drill?.id || null,
      minutes: 5
    });
  }

  tasks.push(diagnosticTask(state, lessons, drills));
  tasks.push(nextLessonTask(state, lessons));
  tasks.push(feedbackTask(state));

  return uniqueTasks(tasks).slice(0, 4);
}
