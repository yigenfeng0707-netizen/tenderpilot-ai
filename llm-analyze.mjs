import { callOpenAICompatible, DEFAULT_LLM_BASE, DEFAULT_LLM_MODEL } from "./llm-core.js";

function firstEnv(...names) {
  for (const name of names) {
    const value = process.env[name];
    if (value && String(value).trim()) return { name, value: String(value).trim() };
  }
  return null;
}

/** Cascade: sponsor placeholders first, then interim DashScope / generic LLM_* */
export function resolveLlmConfig(env = process.env) {
  const keyHit = firstEnv(
    "XIRANG_API_KEY",
    "TOKENHUB_API_KEY",
    "SENSENOVA_API_KEY",
    "DASHSCOPE_API_KEY",
    "LLM_API_KEY"
  );
  if (!keyHit) {
    return {
      enabled: false,
      demo_ready: false,
      providers: [],
      message: "尚未配置可用 LLM — 默认使用规则拆解；配置 Key 后可启用增强",
      config: null
    };
  }

  const baseUrl = (env.LLM_BASE_URL || DEFAULT_LLM_BASE).replace(/\/+$/, "");
  const model = env.LLM_MODEL || DEFAULT_LLM_MODEL;
  const label = keyHit.name.replace(/_API_KEY$/i, "").toLowerCase();

  return {
    enabled: true,
    demo_ready: true,
    providers: [{ id: label, source: keyHit.name, model, baseUrl }],
    message: `增强拆解已就绪（${label} / ${model}）`,
    config: {
      apiKey: keyHit.value,
      baseUrl,
      model
    }
  };
}

export function getHealth() {
  const resolved = resolveLlmConfig();
  return {
    ok: true,
    service: "tenderpilot-ai",
    enhanced: {
      enabled: resolved.enabled,
      demo_ready: resolved.demo_ready,
      providers: resolved.providers,
      message: resolved.message
    },
    rules: {
      enabled: true,
      demo_ready: true,
      message: "规则拆解始终可用（零 Key）"
    }
  };
}

export async function analyzeEnhanced(text, overrides = {}) {
  const resolved = resolveLlmConfig();
  const config = {
    ...(resolved.config || {}),
    ...overrides
  };
  if (!config.apiKey) {
    const error = new Error(resolved.message);
    error.code = "NO_LLM_KEY";
    throw error;
  }
  return callOpenAICompatible({
    baseUrl: config.baseUrl || DEFAULT_LLM_BASE,
    apiKey: config.apiKey,
    model: config.model || DEFAULT_LLM_MODEL,
    text
  });
}
