# 2026-07-30 工作区清理归档

## 目的
清掉会干扰后续赛期任务的本地探测残留，保持根目录只留 TenderPilot 主交付。

## 处理

| 项 | 处置 |
| --- | --- |
| `.tmp-inspect/` | **迁入本目录** `tmp-inspect/`（创空间/研习社部署与 UI 探测脚本、截图、JSON）。含调试产物，**不入库**，见 `.gitignore`。 |
| `tools/demo-video/node_modules/` | **本地删除**（可再生：`cd tools/demo-video && npm install`） |
| `.env` | **保留**（本地 LLM Key，已在 `.gitignore`，切勿提交） |
| `scripts/_tmp_*` / `tools/demo-video/_tmp_*` | 规范忽略；本次无残留文件 |

## 保留（未动）
`index.html`、`app.js`、`analysis.js`、`llm-*.js/mjs`、`server.mjs`、`docs/`、`test/`、正式流水线脚本与 `package.json` 等。

## 日期
2026-07-30
