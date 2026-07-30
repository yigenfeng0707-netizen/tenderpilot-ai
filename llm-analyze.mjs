import { callOpenAICompatible, DEFAULT_LLM_BASE, DEFAULT_LLM_MODEL } from "./llm-core.js";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

function loadDotEnv(filePath = join(process.cwd(), ".env")) {
  if (!existsSync(filePath)) return;
  const text = readFileSync(filePath, "utf8");
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const idx = line.indexOf("=");
    if (idx <= 0) continue;
    const key = line.slice(0, idx).trim();
    let value = line.slice(idx + 1).trim();
    if ((value.startsWith("\"") && value.endsWith("\"")) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env) || process.env[key] === "") {
      process.env[key] = value;
    }
  }
}

loadDotEnv();

function envValue(...names) {
  for (const name of names) {
    const value = process.env[name];
    if (value && String(value).trim()) return String(value).trim();
  }
  return "";
}

/** Ordered providers: Token Plan / hub first, then SenseNova, then generic. */
export function listLlmProviders(env = process.env) {
  const providers = [];

  const tokenHubKey = envValue("TOKENHUB_API_KEY", "XIRANG_API_KEY");
  if (tokenHubKey) {
    providers.push({
      id: "tokenhub",
      source: env.TOKENHUB_API_KEY ? "TOKENHUB_API_KEY" : "XIRANG_API_KEY",
      apiKey: tokenHubKey,
      baseUrl: (envValue("TOKENHUB_BASE_URL", "LLM_BASE_URL") || "https://token-plan.cn-beijing.maas.aliyuncs.com/compatible-mode/v1").replace(/\/+$/, ""),
      model: envValue("TOKENHUB_MODEL", "LLM_MODEL") || "qwen3.8-max-preview"
    });
  }

  const senseKey = envValue("SENSENOVA_API_KEY");
  if (senseKey) {
    providers.push({
      id: "sensenova",
      source: "SENSENOVA_API_KEY",
      apiKey: senseKey,
      baseUrl: (envValue("SENSENOVA_BASE_URL") || "https://token.sensenova.cn/v1").replace(/\/+$/, ""),
      model: envValue("SENSENOVA_MODEL") || "sensenova-6.7-flash-lite"
    });
  }

  const dashKey = envValue("DASHSCOPE_API_KEY");
  if (dashKey) {
    providers.push({
      id: "dashscope",
      source: "DASHSCOPE_API_KEY",
      apiKey: dashKey,
      baseUrl: (envValue("DASHSCOPE_BASE_URL", "LLM_BASE_URL") || DEFAULT_LLM_BASE).replace(/\/+$/, ""),
      model: envValue("DASHSCOPE_MODEL", "LLM_MODEL") || DEFAULT_LLM_MODEL
    });
  }

  const genericKey = envValue("LLM_API_KEY");
  if (genericKey && !providers.some((p) => p.apiKey === genericKey)) {
    providers.push({
      id: "llm",
      source: "LLM_API_KEY",
      apiKey: genericKey,
      baseUrl: (envValue("LLM_BASE_URL") || DEFAULT_LLM_BASE).replace(/\/+$/, ""),
      model: envValue("LLM_MODEL") || DEFAULT_LLM_MODEL
    });
  }

  return providers;
}

export function resolveLlmConfig(env = process.env) {
  const providers = listLlmProviders(env);
  if (!providers.length) {
    return {
      enabled: false,
      demo_ready: false,
      providers: [],
      message: "尚未配置可用 LLM — 默认使用规则拆解；配置 Key 后可启用增强",
      config: null
    };
  }

  const primary = providers[0];
  return {
    enabled: true,
    demo_ready: true,
    providers: providers.map(({ id, source, model, baseUrl }) => ({ id, source, model, baseUrl })),
    message: `增强拆解已就绪（${providers.map((p) => p.id).join(" → ")}）`,
    config: {
      apiKey: primary.apiKey,
      baseUrl: primary.baseUrl,
      model: primary.model
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
  if (overrides.apiKey) {
    return callOpenAICompatible({
      baseUrl: overrides.baseUrl || DEFAULT_LLM_BASE,
      apiKey: overrides.apiKey,
      model: overrides.model || DEFAULT_LLM_MODEL,
      text
    });
  }

  const providers = listLlmProviders();
  if (!providers.length) {
    const error = new Error("尚未配置可用 LLM — 默认使用规则拆解；配置 Key 后可启用增强");
    error.code = "NO_LLM_KEY";
    throw error;
  }

  const errors = [];
  for (const provider of providers) {
    try {
      return await callOpenAICompatible({
        baseUrl: provider.baseUrl,
        apiKey: provider.apiKey,
        model: provider.model,
        text
      });
    } catch (error) {
      errors.push(`${provider.id}: ${error.message}`);
    }
  }

  const error = new Error(`全部增强通道失败：${errors.join(" | ")}`);
  error.code = "LLM_ALL_FAILED";
  throw error;
}
