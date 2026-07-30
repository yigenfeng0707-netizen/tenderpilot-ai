export const sampleRequirement = `2026 城市文化季运营服务项目申报要求

一、请于 8 月 8 日 18:00 前提交申报材料。
二、需提供近两年不少于 3 个同类活动运营案例，并附合同关键页或验收证明。
三、提交完整活动运营方案，至少说明目标人群、传播节奏、渠道策略、预算分配与风险预案。
四、项目负责人须具备 3 年以上大型活动运营经验，并提供简历与证明材料。
五、预算上限为 300,000 元，报价文件须加盖公章。
六、方案评审重点：场景理解 30 分、执行可行性 30 分、内容创意 20 分、成本控制 20 分。
七、所有对外宣传物料须在发布前完成品牌与合规复核，留存审核记录。
八、若采用分包，须说明分包范围、占比及对最终交付质量的责任划分。`;

export const REQUIREMENT_TYPES = ["截止节点", "资质与案例", "方案交付", "预算与报价", "评分项", "待确认要求"];
export const PRIORITIES = ["高", "中", "低"];
export const MAX_REQUIREMENTS = 16;

function cleanLine(line) {
  return line.replace(/^\s*[一二三四五六七八九十\d]+[、.．]\s*/, "").trim();
}

function classify(line) {
  if (/(?:截止|前提交|\d{1,2}\s*月\s*\d{1,2}\s*日)/.test(line)) return "截止节点";
  if (/(?:预算上限|报价文件|报价|金额|加盖公章)/.test(line)) return "预算与报价";
  if (/(?:案例|经验|资质|负责人|证明|简历)/.test(line)) return "资质与案例";
  if (/(?:评审|评分).*(?:重点|分)/.test(line) || /(?:\d+\s*分)/.test(line) && /(?:场景|可行性|创意|成本)/.test(line)) return "评分项";
  if (/(?:方案|策略|预案|目标人群|渠道|预算分配|物料|合规复核|分包)/.test(line)) return "方案交付";
  return "待确认要求";
}

function priorityFor(type, line) {
  if (type === "截止节点" || /截止|前提交/.test(line)) return "高";
  if (type === "资质与案例" || type === "预算与报价") return "高";
  if (/合规|分包|责任/.test(line)) return "高";
  if (type === "方案交付" || type === "评分项") return "中";
  return "低";
}

function defaultEvidence(type) {
  if (type === "方案交付") return "现有方案目录待映射";
  if (type === "截止节点") return "日程台账待建立";
  return "尚未提供证据";
}

function defaultOwner(type) {
  if (type === "资质与案例") return "运营负责人";
  if (type === "预算与报价") return "商务/财务协作人";
  if (type === "截止节点") return "项目经理";
  return "项目协作人";
}

export function enrichRequirement(partial, index, sourceLines = []) {
  const requirement = String(partial.requirement || partial.text || "").trim();
  const type = REQUIREMENT_TYPES.includes(partial.type) ? partial.type : classify(requirement);
  const priority = PRIORITIES.includes(partial.priority) ? partial.priority : priorityFor(type, requirement);
  const lineIndex = sourceLines.findIndex((line) => line && requirement && line.includes(requirement.slice(0, Math.min(24, requirement.length))));
  const source = partial.source && String(partial.source).includes(requirement.slice(0, 12))
    ? String(partial.source)
    : `原文第 ${lineIndex >= 0 ? lineIndex + 1 : index + 1} 条：${requirement}`;

  return {
    id: partial.id && /^R-\d{2}$/.test(partial.id) ? partial.id : `R-${String(index + 1).padStart(2, "0")}`,
    type,
    requirement,
    priority,
    source,
    evidence: partial.evidence || defaultEvidence(type),
    owner: partial.owner || defaultOwner(type),
    status: partial.status || "待补充"
  };
}

export function normalizeRequirements(items, sourceText = "") {
  const sourceLines = String(sourceText).split(/\n+/).map(cleanLine).filter(Boolean);
  const list = Array.isArray(items) ? items : [];
  return list
    .map((item, index) => enrichRequirement(item, index, sourceLines))
    .filter((item) => item.requirement.length > 8)
    .slice(0, MAX_REQUIREMENTS);
}

export function analyzeRequirements(text) {
  const sourceLines = text.split(/\n+/).map(cleanLine).filter((line) => line.length > 8);
  const lines = sourceLines.filter((line) => /(?:需|须|提供|提交|说明|预算|评审|截止|不少于|具备|加盖|复核|分包|留存)/.test(line));
  const selected = (lines.length ? lines : sourceLines).slice(0, MAX_REQUIREMENTS);

  return normalizeRequirements(
    selected.map((line) => ({ requirement: line })),
    text
  );
}

export function buildTasks(requirements) {
  return requirements.map((requirement, index) => ({
    id: `T-${String(index + 1).padStart(2, "0")}`,
    title: `核验并补齐：${requirement.type}`,
    detail: requirement.requirement,
    priority: requirement.priority,
    owner: requirement.owner,
    status: "待开始"
  }));
}

export function buildDraft(requirements) {
  const relevant = requirements.slice(0, 4);
  const sourceList = relevant.map((item) => `${item.id} ${item.requirement}`).join("；");
  return {
    text: `【需人工审核的方案草稿】\n\n我们将围绕项目目标建立“需求拆解、证据校验、任务协同、交付复核”的运营机制。执行前，项目团队会逐项确认材料完整性、负责人和完成状态，并对高优先级缺口建立风险台账。\n\n在方案设计中，将根据评审关注点制定可执行的运营节奏与资源配置，所有承诺均以已核验材料和项目实际情况为准。对于尚未提供证明的内容，不作事实性承诺，而是标记为待补充项。\n\n【引用依据】${sourceList}\n\n限制说明：本草稿仅基于输入文本生成，不能替代专业招投标、法律或财务意见，提交前必须由项目负责人核验事实、预算和合规要求。`,
    sources: relevant.map(({ id, source }) => ({ id, source }))
  };
}
