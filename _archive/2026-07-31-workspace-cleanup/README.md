# 2026-07-31 工作区清理归档

## 目的
把已完成赛期规划/一次性检查清单与已发布手记草稿迁出根目录与 `docs/`，降低对后续 Agent 与交付巡检的干扰；主交付与活跃赛期文档不动。

## 归档文件

| 文件 | 原因 |
| --- | --- |
| `PLAN.md` | 赛期交付总计划已执行完毕；进行中状态以 `TODO.md`、`docs/delivery-notes.md` 为准，根目录计划稿易被误读为未完成任务。 |
| `docs/learn-article-draft.md` | 研习社文章已公开发布；后续补丁文案在 `docs/learn-article-patch-dual-track.md`，草稿易与线上文案混淆。 |
| `docs/publish-consistency-checklist.md` | 提交前一次性一致性检查表；后续巡检事实以 `docs/delivery-notes.md` 为准。 |

## 本地另删（未进本归档，可再生成）
- `tools/demo-video/node_modules/`：Playwright 开发依赖（`cd tools/demo-video && npm install` 可恢复）
- `demo-output/`：演示视频中间产物与成片缓存（已在 `.gitignore`，未跟踪）

## 保留（未动）
核心产品代码、`README.md`、活跃赛期文档（`delivery-notes` / `demo-video` / `judge-60s` / `influence-checklist` / `user-feedback` / `learn-article-patch-dual-track` 等）、`demo.storyboard.json`、demo 流水线脚本与 `assets/evidence-matrix-chart.png`、`.env`（本地密钥）、`.gitignore` 与 GitHub Issue 模板。

## 日期
2026-07-31
