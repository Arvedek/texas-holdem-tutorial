import { lessons } from "./data/lessons.js";
import { drills } from "./data/drills.js?v=coach-links-20260616";
import { resources } from "./data/resources.js";
import { quickReferenceCards } from "./data/quickReference.js";
import { glossaryTerms } from "./data/glossary.js";
import { preflopRanges } from "./data/preflopRanges.js";
import { loadState, resetState, saveState } from "./lib/storage.js";
import { createExportEnvelope, createImportPreview, downloadJson, validateImportEnvelope } from "./lib/importExport.js";
import { escapeHtml } from "./lib/sanitize.js";
import { renderDashboard } from "./features/dashboard.js?v=coach-queue-20260617";
import { renderLearning } from "./features/learning.js";
import { renderTraining } from "./features/training.js?v=coach-links-20260616";
import { renderMistakes } from "./features/mistakes.js?v=leaks-20260617";
import { renderReview } from "./features/review.js?v=coach-20260616";
import { renderResources } from "./features/resources.js";
import { renderGlossary, setGlossarySearch } from "./features/glossary.js";
import { renderRanges } from "./features/ranges.js?v=range-decoder-20260617";

const app = document.querySelector("#app");
const pageTitle = document.querySelector("#page-title");
const navButtons = [...document.querySelectorAll(".nav-button")];
const resetButton = document.querySelector("#reset-progress");
const exportButton = document.querySelector("#export-data");
const importButton = document.querySelector("#import-data");
const importFile = document.querySelector("#import-file");
const importPreview = document.querySelector("#import-preview");

const routeTitles = {
  dashboard: "仪表盘",
  learning: "学习路径",
  ranges: "翻前范围",
  glossary: "术语表",
  training: "训练中心",
  mistakes: "错题本",
  review: "手牌复盘",
  resources: "资源库"
};

let currentRoute = "dashboard";
let state = loadState();
let trainingTargetQuestionId = null;
let pendingImportState = null;

function setState(updater) {
  const nextState = typeof updater === "function" ? updater(state) : updater;
  state = nextState;
  saveState(state);
  setRoute(currentRoute);
}

function renderPlaceholder(route) {
  const completedCount = state.completedLessons.length;
  const attempts = state.drillAttempts.length;
  const reviews = state.handReviews.length;
  app.innerHTML = `
    <div class="panel placeholder">
      <div>
        <p class="eyebrow">MVP Module</p>
        <h2>${escapeHtml(routeTitles[route])}</h2>
        <p class="muted">模块骨架已加载：${lessons.length} 个学习阶段，${drills.length} 道训练题，${resources.length} 个资源。</p>
        <p class="muted">本地状态：${completedCount} 个课程完成，${attempts} 次训练记录，${reviews} 条复盘。</p>
      </div>
    </div>
  `;
}

function getContext() {
  return {
    app,
    state,
    setState,
    trainingTargetQuestionId,
    openTrainingQuestion,
    openGlossarySearch,
    data: {
      lessons,
      drills,
      resources,
      quickReferenceCards,
      glossaryTerms,
      preflopRanges
    },
    navigate: setRoute
  };
}

function openTrainingQuestion(questionId) {
  trainingTargetQuestionId = questionId;
  setRoute("training");
}

function openGlossarySearch(query) {
  setGlossarySearch(query);
  setRoute("glossary");
}

function setRoute(route) {
  currentRoute = route;
  pageTitle.textContent = routeTitles[route];
  navButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.route === route);
  });

  if (route === "dashboard") {
    renderDashboard(getContext());
    return;
  }

  if (route === "learning") {
    renderLearning(getContext());
    return;
  }

  if (route === "ranges") {
    renderRanges(getContext());
    return;
  }

  if (route === "glossary") {
    renderGlossary(getContext());
    return;
  }

  if (route === "training") {
    renderTraining(getContext());
    return;
  }

  if (route === "mistakes") {
    renderMistakes(getContext());
    return;
  }

  if (route === "review") {
    renderReview(getContext());
    return;
  }

  if (route === "resources") {
    renderResources(getContext());
    return;
  }

  renderPlaceholder(route);
}

navButtons.forEach((button) => {
  button.addEventListener("click", () => setRoute(button.dataset.route));
});

resetButton.addEventListener("click", () => {
  state = resetState();
  setRoute(currentRoute);
});

exportButton.addEventListener("click", () => {
  const date = new Date().toISOString().slice(0, 10);
  downloadJson(`poker-learning-dashboard-export-${date}.json`, createExportEnvelope(state));
});

importButton.addEventListener("click", () => importFile.click());

importFile.addEventListener("change", async () => {
  const file = importFile.files?.[0];
  if (!file) {
    return;
  }

  try {
    const payload = JSON.parse(await file.text());
    const result = validateImportEnvelope(payload);
    if (!result.ok) {
      pendingImportState = null;
      importPreview.hidden = false;
      importPreview.innerHTML = `<div class="alert"><strong>导入失败</strong><p>${escapeHtml(result.error)}</p></div>`;
      return;
    }

    pendingImportState = result.state;
    const preview = createImportPreview(result.state);
    importPreview.hidden = false;
    importPreview.innerHTML = `
      <div class="panel import-card">
        <div>
          <p class="eyebrow">Import Preview</p>
          <h3>确认导入这份学习数据？</h3>
          <p class="muted">课程 ${preview.completedLessons} · 训练 ${preview.drillAttempts} · 错题 ${preview.savedMistakes} · 复盘 ${preview.handReviews}</p>
        </div>
        <div class="button-row">
          <button class="primary-button" data-confirm-import>确认替换</button>
          <button class="ghost-button" data-cancel-import>取消</button>
        </div>
      </div>
    `;
  } catch (error) {
    pendingImportState = null;
    importPreview.hidden = false;
    importPreview.innerHTML = `<div class="alert"><strong>导入失败</strong><p>${escapeHtml(error.message)}</p></div>`;
  } finally {
    importFile.value = "";
  }
});

importPreview.addEventListener("click", (event) => {
  if (event.target.matches("[data-confirm-import]") && pendingImportState) {
    state = pendingImportState;
    saveState(state);
    pendingImportState = null;
    importPreview.hidden = true;
    setRoute(currentRoute);
  }

  if (event.target.matches("[data-cancel-import]")) {
    pendingImportState = null;
    importPreview.hidden = true;
  }
});

setRoute(currentRoute);
