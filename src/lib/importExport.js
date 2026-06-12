import { normalizeState } from "./storage.js";

export function createExportEnvelope(state) {
  return {
    app: "poker-learning-dashboard",
    version: 1,
    exportedAt: new Date().toISOString(),
    state: normalizeState(state)
  };
}

export function validateImportEnvelope(payload) {
  if (!payload || typeof payload !== "object") {
    return { ok: false, error: "导入文件不是有效 JSON 对象。" };
  }

  if (payload.app !== "poker-learning-dashboard") {
    return { ok: false, error: "导入文件不是扑克学习驾驶舱数据。" };
  }

  if (typeof payload.version !== "number" || payload.version !== 1) {
    return { ok: false, error: "导入文件版本不兼容。" };
  }

  if (!payload.state || typeof payload.state !== "object") {
    return { ok: false, error: "导入文件缺少 state 数据。" };
  }

  const state = normalizeState(payload.state);
  if (!Array.isArray(state.completedLessons)
    || !Array.isArray(state.drillAttempts)
    || !Array.isArray(state.savedMistakes)
    || !Array.isArray(state.handReviews)) {
    return { ok: false, error: "导入文件的 state 结构不完整。" };
  }

  return { ok: true, state };
}

export function createImportPreview(state) {
  return {
    completedLessons: state.completedLessons.length,
    drillAttempts: state.drillAttempts.length,
    savedMistakes: state.savedMistakes.length,
    handReviews: state.handReviews.length
  };
}

export function downloadJson(filename, data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
