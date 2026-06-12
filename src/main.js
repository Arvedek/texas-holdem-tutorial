import { lessons } from "./data/lessons.js";
import { drills } from "./data/drills.js";
import { resources } from "./data/resources.js";

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

function renderPlaceholder(route) {
  app.innerHTML = `
    <div class="panel placeholder">
      <div>
        <p class="eyebrow">MVP Module</p>
        <h2>${routeTitles[route]}</h2>
        <p class="muted">模块骨架已加载：${lessons.length} 个学习阶段，${drills.length} 道训练题，${resources.length} 个资源。</p>
      </div>
    </div>
  `;
}

function setRoute(route) {
  currentRoute = route;
  pageTitle.textContent = routeTitles[route];
  navButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.route === route);
  });
  renderPlaceholder(route);
}

navButtons.forEach((button) => {
  button.addEventListener("click", () => setRoute(button.dataset.route));
});

resetButton.addEventListener("click", () => {
  window.localStorage.clear();
  setRoute(currentRoute);
});

setRoute(currentRoute);
