import { analyzeRequirements, buildDraft, buildTasks, sampleRequirement } from "./analysis.js";

const input = document.querySelector("#requirement-input");
const inputStatus = document.querySelector("#input-status");
const emptyState = document.querySelector("#empty-state");
const resultContent = document.querySelector("#result-content");
const requirementList = document.querySelector("#requirement-list");
const requirementCount = document.querySelector("#requirement-count");
const evidenceBody = document.querySelector("#evidence-body");
const taskList = document.querySelector("#task-list");
const draftText = document.querySelector("#draft-text");
const draftSources = document.querySelector("#draft-sources");

let currentRequirements = [];
let workspaceKey = "";

function priorityClass(priority) {
  return `priority priority-${priority === "高" ? "high" : priority === "中" ? "medium" : "low"}`;
}

function createElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function keyFor(text) {
  let hash = 5381;
  for (const char of text) hash = (hash * 33) ^ char.charCodeAt(0);
  return `tenderpilot-workspace-${hash >>> 0}`;
}

function loadState() {
  try {
    return JSON.parse(localStorage.getItem(workspaceKey)) || {};
  } catch {
    return {};
  }
}

function saveState(state) {
  try {
    localStorage.setItem(workspaceKey, JSON.stringify(state));
  } catch {
    inputStatus.textContent = "当前浏览器无法保存协作状态，结果仍可在本页使用";
  }
}

function updateState(update) {
  const state = loadState();
  update(state);
  saveState(state);
}

function render() {
  const state = loadState();
  const requirements = currentRequirements.filter((item) => state.decisions?.[item.id] !== "ignored");
  const tasks = buildTasks(requirements);
  const draft = buildDraft(requirements);

  emptyState.hidden = true;
  resultContent.hidden = false;
  requirementCount.textContent = `${requirements.length} 项待跟进`;
  requirementList.replaceChildren(...currentRequirements.map((item) => {
    const card = createElement("article", "requirement-card");
    const details = createElement("div");
    details.append(
      createElement("p", "requirement-id", `${item.id} · ${item.type}`),
      createElement("h3", "", item.requirement),
      createElement("p", "source", item.source)
    );
    const actions = createElement("div", "requirement-actions");
    const decision = state.decisions?.[item.id] || "candidate";
    const decisionButton = createElement("button", "secondary compact", decision === "ignored" ? "恢复候选" : decision === "confirmed" ? "忽略候选" : "确认候选");
    decisionButton.type = "button";
    decisionButton.addEventListener("click", () => {
      updateState((next) => {
        next.decisions ||= {};
        next.decisions[item.id] = decision === "ignored" ? "candidate" : decision === "confirmed" ? "ignored" : "confirmed";
      });
      render();
    });
    actions.append(createElement("span", priorityClass(item.priority), `${item.priority}优先级`), decisionButton);
    card.classList.toggle("is-ignored", decision === "ignored");
    card.append(details, actions);
    return card;
  }));

  evidenceBody.replaceChildren(...requirements.map((item) => {
    const row = document.createElement("tr");
    const requirementCell = document.createElement("td");
    requirementCell.append(createElement("strong", "", item.id), createElement("span", "", item.type));
    const evidenceCell = createElement("td", "", item.evidence);
    const ownerCell = createElement("td", "", item.owner);
    const statusCell = document.createElement("td");
    const select = document.createElement("select");
    select.setAttribute("aria-label", `${item.id} 状态`);
    ["待补充", "核验中", "已就绪"].forEach((status) => select.append(createElement("option", "", status)));
    select.value = state.evidence?.[item.id] || item.status;
    select.addEventListener("change", () => updateState((next) => {
      next.evidence ||= {};
      next.evidence[item.id] = select.value;
    }));
    statusCell.append(select);
    row.append(requirementCell, evidenceCell, ownerCell, statusCell);
    return row;
  }));

  taskList.replaceChildren(...tasks.map((task) => {
    const item = createElement("label", "task");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = Boolean(state.tasks?.[task.id]);
    checkbox.addEventListener("change", () => updateState((next) => {
      next.tasks ||= {};
      next.tasks[task.id] = checkbox.checked;
    }));
    const details = createElement("span");
    details.append(
      createElement("strong", "", task.title),
      createElement("small", "", task.detail),
      createElement("em", "", `${task.owner} · ${task.priority}优先级`)
    );
    item.append(checkbox, details);
    return item;
  }));

  draftText.textContent = draft.text;
  draftSources.replaceChildren(...draft.sources.map((item) => createElement("p", "", `${item.id}：${item.source}`)));
}

document.querySelector("#load-sample").addEventListener("click", () => {
  input.value = sampleRequirement;
  inputStatus.textContent = "已加载脱敏样例，可直接拆解";
  input.focus();
});

document.querySelector("#analyze").addEventListener("click", () => {
  const text = input.value.trim();
  if (text.length < 12) {
    inputStatus.textContent = "请至少输入一条完整、已脱敏的项目要求";
    input.focus();
    return;
  }
  workspaceKey = keyFor(text);
  currentRequirements = analyzeRequirements(text);
  render();
  inputStatus.textContent = `已从输入中整理 ${currentRequirements.length} 项候选要求；状态仅保存在当前浏览器`;
});

document.querySelector("#copy-draft").addEventListener("click", async (event) => {
  try {
    await navigator.clipboard.writeText(draftText.textContent);
    event.currentTarget.textContent = "已复制";
    window.setTimeout(() => { event.currentTarget.textContent = "复制草稿"; }, 1600);
  } catch {
    event.currentTarget.textContent = "复制失败";
  }
});
