import test from "node:test";
import assert from "node:assert/strict";
import { analyzeRequirements, buildDraft, buildTasks, normalizeRequirements, sampleRequirement, MAX_REQUIREMENTS } from "../analysis.js";
import { extractJsonObject, requirementsFromLlmContent } from "../llm-core.js";
import { getHealth, resolveLlmConfig } from "../llm-analyze.mjs";
import { readFile } from "node:fs/promises";

test("browser module has no unsupported .mjs dependency", async () => {
  const source = await readFile(new URL("../analysis.js", import.meta.url), "utf8");
  assert.doesNotMatch(source, /\.mjs/);
});

test("UI renders input-derived content with text nodes rather than innerHTML", async () => {
  const source = await readFile(new URL("../app.js", import.meta.url), "utf8");
  assert.doesNotMatch(source, /\.innerHTML\s*=/);
  assert.match(source, /textContent/);
});

test("sample parser retains HTML-like input as plain requirement text", () => {
  const requirements = analyzeRequirements("一、需提交 <img src=x onerror=alert(1)> 证明材料。");
  assert.equal(requirements[0].requirement, "需提交 <img src=x onerror=alert(1)> 证明材料。");
});

test("extracts traceable requirements from the reproducible sample", () => {
  const requirements = analyzeRequirements(sampleRequirement);
  assert.ok(requirements.length >= 5);
  assert.ok(requirements.length <= MAX_REQUIREMENTS);
  assert.equal(requirements[0].id, "R-01");
  assert.ok(requirements.every((item) => item.source.includes(item.requirement)));
  assert.ok(requirements.some((item) => item.priority === "高"));
  assert.equal(requirements.find((item) => item.requirement.includes("同类活动运营案例"))?.type, "资质与案例");
  assert.equal(requirements.find((item) => item.requirement.includes("预算上限"))?.type, "预算与报价");
  assert.equal(requirements.find((item) => item.requirement.includes("完整活动运营方案"))?.type, "方案交付");
  assert.ok(requirements.some((item) => item.requirement.includes("合规复核") || item.requirement.includes("分包")));
});

test("creates a task for every requirement and keeps owner data", () => {
  const requirements = analyzeRequirements(sampleRequirement);
  const tasks = buildTasks(requirements);
  assert.equal(tasks.length, requirements.length);
  assert.ok(tasks.every((task) => task.owner.length > 0));
});

test("draft carries only references from analyzed requirements", () => {
  const requirements = analyzeRequirements(sampleRequirement);
  const draft = buildDraft(requirements);
  assert.ok(draft.text.includes("需人工审核"));
  assert.ok(draft.sources.length > 0);
  assert.ok(draft.sources.every((source) => requirements.some((item) => item.id === source.id)));
});

test("normalizeRequirements rejects thin rows and caps length", () => {
  const normalized = normalizeRequirements([
    { requirement: "短" },
    { type: "截止节点", requirement: "请于 9 月 1 日前提交完整材料包并附目录。", priority: "高" },
    { type: "未知类型", requirement: "需要说明渠道策略与传播节奏安排细节。" }
  ], "请于 9 月 1 日前提交完整材料包并附目录。\n需要说明渠道策略与传播节奏安排细节。");
  assert.equal(normalized.length, 2);
  assert.equal(normalized[0].type, "截止节点");
  assert.equal(normalized[1].type, "方案交付");
});

test("llm json helpers parse fenced payloads", () => {
  const raw = "```json\n{\"requirements\":[{\"type\":\"预算与报价\",\"requirement\":\"预算上限为 100000 元且报价须盖章\",\"priority\":\"高\",\"source\":\"预算上限为 100000 元且报价须盖章\"}]}\n```";
  const obj = extractJsonObject(raw);
  assert.equal(obj.requirements.length, 1);
  const requirements = requirementsFromLlmContent(raw, "预算上限为 100000 元且报价须盖章。");
  assert.equal(requirements[0].type, "预算与报价");
});

test("health reports rules ready and enhanced gated without keys", () => {
  const previous = { ...process.env };
  for (const key of ["XIRANG_API_KEY", "TOKENHUB_API_KEY", "SENSENOVA_API_KEY", "DASHSCOPE_API_KEY", "LLM_API_KEY"]) {
    delete process.env[key];
  }
  try {
    const health = getHealth();
    assert.equal(health.ok, true);
    assert.equal(health.rules.demo_ready, true);
    assert.equal(health.enhanced.demo_ready, false);
    const resolved = resolveLlmConfig({});
    assert.equal(resolved.enabled, false);
  } finally {
    Object.assign(process.env, previous);
  }
});
