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

export function loadState() {
  const fallback = cloneDefaultState();
  const raw = window.localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return fallback;
  }

  try {
    const parsed = JSON.parse(raw);
    return {
      ...fallback,
      ...parsed,
      completedLessons: Array.isArray(parsed.completedLessons) ? parsed.completedLessons : fallback.completedLessons,
      drillAttempts: Array.isArray(parsed.drillAttempts) ? parsed.drillAttempts : fallback.drillAttempts,
      handReviews: Array.isArray(parsed.handReviews) ? parsed.handReviews : fallback.handReviews,
      savedMistakes: Array.isArray(parsed.savedMistakes) ? parsed.savedMistakes : fallback.savedMistakes
    };
  } catch {
    return fallback;
  }
}

export function saveState(state) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...cloneDefaultState(), ...state }));
}

export function resetState() {
  window.localStorage.removeItem(STORAGE_KEY);
  return cloneDefaultState();
}
