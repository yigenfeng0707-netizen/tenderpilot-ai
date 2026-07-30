import { analyzeRequirements, buildDraft, buildTasks, sampleRequirement } from "./analysis.js";
import { callOpenAICompatible, DEFAULT_LLM_BASE, DEFAULT_LLM_MODEL } from "./llm-core.js";

const LLM_SESSION_KEY = "tenderpilot-llm-session";

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
const modeBadge = document.querySelector("#mode-badge");
const llmSettings = document.querySelector("#llm-settings");
const llmBase = document.querySelector("#llm-base");
const llmModel = document.querySelector("#llm-model");
const llmKey = document.querySelector("#llm-key");
const llmSettingsStatus = document.querySelector("#llm-settings-status");
const toggleLlmSettings = document.querySelector("#toggle-llm-settings");
const analyzeButton = document.querySelector("#analyze");

let currentRequirements = [];
let workspaceKey = "";
let serverEnhancedReady = false;

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

function loadSessionLlm() {
  try {
    return JSON.parse(sessionStorage.getItem(LLM_SESSION_KEY) || "null");
  } catch {
    return null;
  }
}

function saveSessionLlm(config) {
  sessionStorage.setItem(LLM_SESSION_KEY, JSON.stringify(config));
}

function clearSessionLlm() {
  sessionStorage.removeItem(LLM_SESSION_KEY);
}

function setModeBadge(mode, detail) {
  const labels = {
    rules: "模式：规则拆解（零 Key）",
    enhanced_ready: "模式：增强就绪",
    enhanced: "模式：增强拆解",
    fallback: "模式：增强失败 · 已回退规则"
  };
  modeBadge.dataset.mode = mode;
  modeBadge.textContent = detail ? `${labels[mode] || labels.rules} · ${detail}` : labels[mode] || labels.rules;
}

function refreshModeBadge() {
  const session = loadSessionLlm();
  if (session?.apiKey) {
    setModeBadge("enhanced_ready", "会话 Key");
    return;
  }
  if (serverEnhancedReady) {
    setModeBadge("enhanced_ready", "服务端");
    return;
  }
  setModeBadge("rules");
}

async function probeServerHealth() {
  try {
    const response = await fetch("/api/health", { method: "GET", cache: "no-store" });
    if (!response.ok) {
      serverEnhancedReady = false;
      refreshModeBadge();
      return;
    }
    const health = await response.json();
    serverEnhancedReady = Boolean(health?.enhanced?.demo_ready);
    refreshModeBadge();
  } catch {
    serverEnhancedReady = false;
    refreshModeBadge();
  }
}

function fillSettingsForm() {
  const session = loadSessionLlm();
  llmBase.value = session?.baseUrl || DEFAULT_LLM_BASE;
  llmModel.value = session?.model || DEFAULT_LLM_MODEL;
  llmKey.value = session?.apiKey || "";
}

async function tryEnhancedAnalyze(text) {
  const session = loadSessionLlm();
  if (session?.apiKey) {
    return {
      requirements: await callOpenAICompatible({
        baseUrl: session.baseUrl || DEFAULT_LLM_BASE,
        apiKey: session.apiKey,
        model: session.model || DEFAULT_LLM_MODEL,
        text
      }),
      via: "session"
    };
  }

  if (!serverEnhancedReady) {
    return null;
  }

  const response = await fetch("/api/analyze-enhanced", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text })
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || !payload.ok) {
    throw new Error(payload.error || `增强接口失败（HTTP ${response.status}）`);
  }
  return { requirements: payload.requirements, via: "server" };
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
    requirementCell.dataset.label = "要求";
    requirementCell.append(createElement("strong", "", item.id), createElement("span", "", item.type));
    const evidenceCell = createElement("td", "", item.evidence);
    evidenceCell.dataset.label = "当前证据";
    const ownerCell = createElement("td", "", item.owner);
    ownerCell.dataset.label = "负责人";
    const statusCell = document.createElement("td");
    statusCell.dataset.label = "状态";
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

toggleLlmSettings.addEventListener("click", () => {
  const open = llmSettings.hidden;
  llmSettings.hidden = !open;
  toggleLlmSettings.setAttribute("aria-expanded", open ? "true" : "false");
  if (open) fillSettingsForm();
});

document.querySelector("#save-llm-settings").addEventListener("click", () => {
  const apiKey = llmKey.value.trim();
  if (!apiKey) {
    llmSettingsStatus.textContent = "请填写 API Key，或点清除以回到纯规则模式";
    return;
  }
  saveSessionLlm({
    baseUrl: llmBase.value.trim() || DEFAULT_LLM_BASE,
    model: llmModel.value.trim() || DEFAULT_LLM_MODEL,
    apiKey
  });
  llmSettingsStatus.textContent = "已保存到本会话（标签关闭即失效）";
  refreshModeBadge();
});

document.querySelector("#clear-llm-settings").addEventListener("click", () => {
  clearSessionLlm();
  llmKey.value = "";
  llmSettingsStatus.textContent = "已清除会话配置，使用规则拆解";
  refreshModeBadge();
});

analyzeButton.addEventListener("click", async () => {
  const text = input.value.trim();
  if (text.length < 12) {
    inputStatus.textContent = "请至少输入一条完整、已脱敏的项目要求";
    input.focus();
    return;
  }

  workspaceKey = keyFor(text);
  analyzeButton.disabled = true;
  inputStatus.textContent = "正在拆解…";

  try {
    const enhanced = await tryEnhancedAnalyze(text);
    if (enhanced?.requirements?.length) {
      currentRequirements = enhanced.requirements;
      render();
      setModeBadge("enhanced", enhanced.via === "session" ? "会话 Key" : "服务端");
      inputStatus.textContent = `增强拆解完成：${currentRequirements.length} 项候选；状态仅保存在当前浏览器`;
      return;
    }

    currentRequirements = analyzeRequirements(text);
    render();
    setModeBadge("rules");
    inputStatus.textContent = `规则拆解完成：${currentRequirements.length} 项候选；状态仅保存在当前浏览器`;
  } catch (error) {
    currentRequirements = analyzeRequirements(text);
    render();
    setModeBadge("fallback", error.message.slice(0, 42));
    inputStatus.textContent = `增强失败，已回退规则拆解（${currentRequirements.length} 项）：${error.message}`;
  } finally {
    analyzeButton.disabled = false;
  }
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

fillSettingsForm();
refreshModeBadge();
probeServerHealth();
