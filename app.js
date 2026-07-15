import { analyzeRequirements, buildDraft, buildTasks, sampleRequirement } from "./analysis.mjs";

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

function priorityClass(priority) {
  return `priority priority-${priority === "高" ? "high" : priority === "中" ? "medium" : "low"}`;
}

function render(requirements) {
  const tasks = buildTasks(requirements);
  const draft = buildDraft(requirements);

  emptyState.hidden = true;
  resultContent.hidden = false;
  requirementCount.textContent = `${requirements.length} 项待跟进`;
  requirementList.replaceChildren(...requirements.map((item) => {
    const card = document.createElement("article");
    card.className = "requirement-card";
    card.innerHTML = `<div><p class="requirement-id">${item.id} · ${item.type}</p><h3>${item.requirement}</h3><p class="source">${item.source}</p></div><span class="${priorityClass(item.priority)}">${item.priority}优先级</span>`;
    return card;
  }));

  evidenceBody.replaceChildren(...requirements.map((item) => {
    const row = document.createElement("tr");
    row.innerHTML = `<td><strong>${item.id}</strong><span>${item.type}</span></td><td>${item.evidence}</td><td>${item.owner}</td><td><select aria-label="${item.id} 状态"><option>待补充</option><option>核验中</option><option>已就绪</option></select></td>`;
    return row;
  }));

  taskList.replaceChildren(...tasks.map((task) => {
    const item = document.createElement("label");
    item.className = "task";
    item.innerHTML = `<input type="checkbox" /><span><strong>${task.title}</strong><small>${task.detail}</small><em>${task.owner} · ${task.priority}优先级</em></span>`;
    return item;
  }));

  draftText.textContent = draft.text;
  draftSources.replaceChildren(...draft.sources.map((item) => {
    const source = document.createElement("p");
    source.textContent = `${item.id}：${item.source}`;
    return source;
  }));
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
  const requirements = analyzeRequirements(text);
  render(requirements);
  inputStatus.textContent = `已从输入中整理 ${requirements.length} 项待跟进要求`;
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
