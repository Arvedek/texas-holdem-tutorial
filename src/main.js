import { lessons } from "./data/lessons.js";
import { drills } from "./data/drills.js";
import { resources } from "./data/resources.js";
import { loadState, resetState, saveState } from "./lib/storage.js";
import { renderDashboard } from "./features/dashboard.js";
import { renderLearning } from "./features/learning.js";
import { renderTraining } from "./features/training.js";

const app = document.querySelector("#app");
const pageTitle = document.querySelector("#page-title");
const navButtons = [...document.querySelectorAll(".nav-button")];
const resetButton = document.querySelector("#reset-progress");

const routeTitles = {
  dashboard: "仪表盘",
  learning: "学习路径",
  training: "训练中心",
  review: "手牌复盘",
  resources: "资源库"
};

let currentRoute = "dashboard";
let state = loadState();

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
        <h2>${routeTitles[route]}</h2>
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
    data: {
      lessons,
      drills,
      resources
    },
    navigate: setRoute
  };
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

  if (route === "training") {
    renderTraining(getContext());
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

setRoute(currentRoute);
