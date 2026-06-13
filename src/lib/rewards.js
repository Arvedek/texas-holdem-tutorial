export const BADGES = {
  FIRST_LESSON: "first-lesson",
  FIRST_TRAINING: "first-training",
  TEN_DRILLS: "ten-drills",
  FIRST_REVIEW: "first-review",
  MISTAKE_CLEAR: "mistake-clear",
  ODDS_BEGINNER: "odds-beginner",
  STREAK_THREE: "streak-three"
};

export function getTodayKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

export function getLevel(xp) {
  return Math.floor(Math.max(0, Number(xp) || 0) / 100) + 1;
}

export function awardXp(state, type, amount, label, date = new Date()) {
  const value = Math.max(0, Number(amount) || 0);
  const event = {
    id: `xp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    type,
    amount: value,
    label,
    date: getTodayKey(date)
  };

  return {
    ...state,
    xp: (Number(state.xp) || 0) + value,
    xpEvents: [...(state.xpEvents || []), event]
  };
}

export function awardBadge(state, badgeId) {
  const badges = new Set(state.badges || []);
  badges.add(badgeId);
  return {
    ...state,
    badges: [...badges]
  };
}

export function markDailyActivity(state, key, value, date = new Date()) {
  const today = getTodayKey(date);
  const current = state.dailyActivity?.[today] || {
    lesson: false,
    trainCount: 0,
    review: false,
    bonusAwarded: false
  };

  return {
    ...state,
    dailyActivity: {
      ...(state.dailyActivity || {}),
      [today]: {
        ...current,
        [key]: key === "trainCount" ? Math.max(current.trainCount || 0, value) : value
      }
    }
  };
}

export function getDailyTasks(state, today = new Date()) {
  const key = getTodayKey(today);
  const activity = state.dailyActivity?.[key] || {};
  return {
    key,
    lesson: Boolean(activity.lesson),
    train: (activity.trainCount || 0) >= 5,
    review: Boolean(activity.review),
    trainCount: activity.trainCount || 0,
    bonusAwarded: Boolean(activity.bonusAwarded)
  };
}

export function maybeAwardDailyBonus(state, date = new Date()) {
  const tasks = getDailyTasks(state, date);
  if (!tasks.lesson || !tasks.train || !tasks.review || tasks.bonusAwarded) {
    return state;
  }

  const withBonus = awardXp(state, "daily-complete", 40, "完成今日任务", date);
  return markDailyActivity(withBonus, "bonusAwarded", true, date);
}

export function calculateStreak(dailyActivity, today = new Date()) {
  let streak = 0;
  const cursor = new Date(today);

  while (true) {
    const key = getTodayKey(cursor);
    const activity = dailyActivity?.[key];
    const active = Boolean(activity?.lesson || (activity?.trainCount || 0) > 0 || activity?.review);
    if (!active) {
      break;
    }
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

function drillAccuracy(state, drills, type) {
  const ids = new Set(drills.filter((drill) => drill.type === type).map((drill) => drill.id));
  const attempts = state.drillAttempts.filter((attempt) => ids.has(attempt.questionId));
  if (!attempts.length) return 0;
  return Math.round((attempts.filter((attempt) => attempt.correct).length / attempts.length) * 100);
}

function lessonCompleted(state, lessonId) {
  return state.completedLessons.includes(lessonId) ? 25 : 0;
}

export function calculateMastery(state, lessons, drills) {
  const masteredMistakes = state.savedMistakes.filter((mistake) => mistake.status === "mastered").length;
  return [
    {
      id: "preflop",
      label: "翻前纪律",
      value: Math.min(100, drillAccuracy(state, drills, "preflop") * 0.75 + lessonCompleted(state, "preflop-ranges"))
    },
    {
      id: "odds",
      label: "赔率数学",
      value: Math.min(100, drillAccuracy(state, drills, "odds") * 0.75 + lessonCompleted(state, "odds-spr-bankroll"))
    },
    {
      id: "board",
      label: "牌面阅读",
      value: Math.min(100, drillAccuracy(state, drills, "board") * 0.75 + lessonCompleted(state, "flop-texture-cbet"))
    },
    {
      id: "review",
      label: "复盘习惯",
      value: Math.min(100, state.handReviews.length * 15 + masteredMistakes * 10 + lessonCompleted(state, "gto-exploit-review"))
    }
  ].map((item) => ({ ...item, value: Math.round(item.value) }));
}
