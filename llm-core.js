import { normalizeRequirements } from "./analysis.js";

export const DEFAULT_LLM_MODEL = "qwen-plus";
export const DEFAULT_LLM_BASE = "https://dashscope.aliyuncs.com/compatible-mode/v1";

export function buildAnalyzeMessages(text) {
  return [
    {
      role: "system",
      content: `你是投标/项目申报材料助理。只根据用户给出的原文拆解候选要求，禁止编造原文没有的事实。
输出严格 JSON 对象，不要 Markdown 围栏，格式：
{"requirements":[{"type":"截止节点|资质与案例|方案交付|预算与报价|评分项|待确认要求","requirement":"原文要点","priority":"高|中|低","source":"引用原文片段"}]}
每条 requirement 必须能在原文中找到对应表述；最多 16 条；按重要性排序。`
    },
    {
      role: "user",
      content: `请拆解以下已脱敏项目要求文本：\n\n${text}`
    }
  ];
}

export function extractJsonObject(raw) {
  const text = String(raw || "").trim();
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced ? fenced[1].trim() : text;
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start < 0 || end <= start) throw new Error("模型未返回 JSON 对象");
  return JSON.parse(candidate.slice(start, end + 1));
}

export function requirementsFromLlmContent(content, sourceText) {
  const parsed = extractJsonObject(content);
  const normalized = normalizeRequirements(parsed.requirements || parsed.items || [], sourceText);
  if (!normalized.length) throw new Error("模型结果为空或无法规范化");
  return normalized;
}

export async function callOpenAICompatible({ baseUrl, apiKey, model, text, fetchImpl }) {
  const fetchFn = fetchImpl || globalThis.fetch;
  if (!fetchFn) throw new Error("当前环境不支持 fetch");
  const root = String(baseUrl || DEFAULT_LLM_BASE).replace(/\/+$/, "");
  const response = await fetchFn(`${root}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: model || DEFAULT_LLM_MODEL,
      temperature: 0.2,
      messages: buildAnalyzeMessages(text)
    })
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = payload.error?.message || payload.message || `HTTP ${response.status}`;
    throw new Error(message);
  }

  const content = payload.choices?.[0]?.message?.content;
  if (!content) throw new Error("模型响应缺少 content");
  return requirementsFromLlmContent(content, text);
}
