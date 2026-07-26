# 2026-07-26 工作区清理归档

## 来源
仓库根目录残留，相对当前 TenderPilot AI 主交付无运行依赖。

## 归档文件

| 文件 | 原因 |
| --- | --- |
| `analysis.mjs` | 与根目录 `analysis.js` 字节级相同（SHA256 一致）。浏览器侧与测试均引用 `analysis.js`（见 `app.js`、`package.json`、`test/analysis.test.mjs`）。`a94f469` 起已切到 `.js` 以支持浏览器 module；此文件为并行遗留副本，易误导后续编辑。 |

## 日期
2026-07-26

## 本地另删（未进本归档，可再生成）
- `lib/`：空目录（未跟踪）
- `demo-output/`：演示视频中间产物与成片缓存（已在 `.gitignore`）
- `tools/demo-video/node_modules/`：Playwright 开发依赖（`npm install` 可恢复）
- `.gstack/`：本地浏览审计日志（已在 `.gitignore`）
