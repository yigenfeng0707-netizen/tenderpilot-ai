import test from "node:test";
import assert from "node:assert/strict";
import { analyzeRequirements, buildDraft, buildTasks, sampleRequirement } from "../analysis.js";
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
  assert.equal(requirements[0].id, "R-01");
  assert.ok(requirements.every((item) => item.source.includes(item.requirement)));
  assert.ok(requirements.some((item) => item.priority === "高"));
  assert.equal(requirements.find((item) => item.requirement.includes("同类活动运营案例"))?.type, "资质与案例");
  assert.equal(requirements.find((item) => item.requirement.includes("预算上限"))?.type, "预算与报价");
  assert.equal(requirements.find((item) => item.requirement.includes("完整活动运营方案"))?.type, "方案交付");
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
