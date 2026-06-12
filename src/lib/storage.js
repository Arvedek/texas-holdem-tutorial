export const STORAGE_KEY = "poker-learning-dashboard:v1";

export const DEFAULT_STATE = {
  completedLessons: [],
  drillAttempts: [],
  handReviews: [],
  savedMistakes: []
};

function cloneDefaultState() {
  return typeof structuredClone === "function"
    ? structuredClone(DEFAULT_STATE)
    : JSON.parse(JSON.stringify(DEFAULT_STATE));
}

export function normalizeMistakes(savedMistakes) {
  if (!Array.isArray(savedMistakes)) {
    return [];
  }

  const byQuestion = new Map();

  savedMistakes.forEach((item) => {
    const record = typeof item === "string"
      ? {
          questionId: item,
          status: "unresolved",
          firstMistakeAt: "",
          lastMistakeAt: "",
          wrongAnswers: []
        }
      : {
          questionId: item?.questionId,
          status: item?.status === "mastered" ? "mastered" : "unresolved",
          firstMistakeAt: item?.firstMistakeAt || item?.lastMistakeAt || "",
          lastMistakeAt: item?.lastMistakeAt || item?.firstMistakeAt || "",
          wrongAnswers: Array.isArray(item?.wrongAnswers) ? [...new Set(item.wrongAnswers)] : []
        };

    if (!record.questionId) {
      return;
    }

    const existing = byQuestion.get(record.questionId);
    if (!existing) {
      byQuestion.set(record.questionId, record);
      return;
    }

    byQuestion.set(record.questionId, {
      ...existing,
      status: existing.status === "unresolved" || record.status === "unresolved" ? "unresolved" : "mastered",
      firstMistakeAt: existing.firstMistakeAt || record.firstMistakeAt,
      lastMistakeAt: record.lastMistakeAt || existing.lastMistakeAt,
      wrongAnswers: [...new Set([...existing.wrongAnswers, ...record.wrongAnswers])]
    });
  });

  return [...byQuestion.values()];
}

export function normalizeHandReviews(handReviews) {
  if (!Array.isArray(handReviews)) {
    return [];
  }

  return handReviews.map((review) => ({
    ...review,
    errorTypes: Array.isArray(review?.errorTypes) ? review.errorTypes : [],
    userNote: typeof review?.userNote === "string" ? review.userNote : "",
    streetFocus: typeof review?.streetFocus === "string" ? review.streetFocus : "overall"
  }));
}

export function normalizeState(parsed) {
  const fallback = cloneDefaultState();
  const source = parsed && typeof parsed === "object" ? parsed : {};

  return {
    ...fallback,
    ...source,
    completedLessons: Array.isArray(source.completedLessons) ? source.completedLessons : fallback.completedLessons,
    drillAttempts: Array.isArray(source.drillAttempts) ? source.drillAttempts : fallback.drillAttempts,
    handReviews: normalizeHandReviews(source.handReviews),
    savedMistakes: normalizeMistakes(source.savedMistakes)
  };
}

export function loadState() {
  const fallback = cloneDefaultState();
  const raw = window.localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return fallback;
  }

  try {
    const parsed = JSON.parse(raw);
    return normalizeState(parsed);
  } catch {
    return fallback;
  }
}

export function saveState(state) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizeState(state)));
}

export function resetState() {
  window.localStorage.removeItem(STORAGE_KEY);
  return cloneDefaultState();
}
