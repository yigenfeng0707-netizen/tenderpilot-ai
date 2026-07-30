import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";
import { analyzeEnhanced, getHealth } from "./llm-analyze.mjs";

const root = process.cwd();
const port = Number(process.env.PORT || 3000);
const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml"
};

function sendJson(response, status, body) {
  const payload = JSON.stringify(body);
  response.writeHead(status, {
    "Cache-Control": "no-store",
    "Content-Type": "application/json; charset=utf-8",
    "X-Content-Type-Options": "nosniff"
  });
  response.end(payload);
}

function readBody(request) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    request.on("data", (chunk) => {
      chunks.push(chunk);
      if (Buffer.concat(chunks).length > 1_000_000) {
        reject(new Error("请求体过大"));
        request.destroy();
      }
    });
    request.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    request.on("error", reject);
  });
}

async function handleApi(request, response, requestPath) {
  if (requestPath === "/api/health" && request.method === "GET") {
    sendJson(response, 200, getHealth());
    return true;
  }

  if (requestPath === "/api/analyze-enhanced" && request.method === "POST") {
    try {
      const raw = await readBody(request);
      const body = raw ? JSON.parse(raw) : {};
      const text = String(body.text || "").trim();
      if (text.length < 12) {
        sendJson(response, 400, { ok: false, error: "请至少输入一条完整、已脱敏的项目要求" });
        return true;
      }
      const requirements = await analyzeEnhanced(text);
      sendJson(response, 200, { ok: true, mode: "enhanced", requirements });
    } catch (error) {
      const status = error.code === "NO_LLM_KEY" ? 503 : 502;
      sendJson(response, status, {
        ok: false,
        error: error.message || "增强拆解失败",
        fallback: "rules"
      });
    }
    return true;
  }

  return false;
}

createServer(async (request, response) => {
  const requestPath = request.url?.split("?")[0] || "/";

  try {
    if (await handleApi(request, response, requestPath)) return;
  } catch (error) {
    sendJson(response, 500, { ok: false, error: error.message || "服务器错误" });
    return;
  }

  const relativePath = requestPath === "/" ? "index.html" : requestPath.replace(/^\/+/, "");
  const filePath = normalize(join(root, relativePath));

  if (!filePath.startsWith(root) || !existsSync(filePath) || !statSync(filePath).isFile()) {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not found");
    return;
  }

  response.writeHead(200, {
    "Cache-Control": "no-store",
    "Content-Type": contentTypes[extname(filePath)] || "application/octet-stream",
    "X-Content-Type-Options": "nosniff"
  });
  createReadStream(filePath).pipe(response);
}).listen(port, "0.0.0.0", () => {
  console.log(`TenderPilot AI is running at http://0.0.0.0:${port}`);
});
