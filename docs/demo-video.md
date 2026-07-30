# TenderPilot AI 演示视频流水线

> 清理 `node_modules` 或换机后，需先在 `tools/demo-video` 下执行 `npm install`（再按下方安装 Playwright / ffmpeg）。

基于 Cursor skill `demo-video-factory`：storyboard → Playwright 录屏 → edge-tts → ASS 字幕硬烧 → ffmpeg 电影级合成。

引擎脚本不入库，复用本机：

`C:\Users\52637\.cursor\skills\demo-video-factory\scripts\`

本仓库只维护：

| 文件 | 作用 |
| --- | --- |
| `demo.storyboard.json` | 本项目分镜与旁白（对齐 `docs/demo-script.md` 真实功能） |
| `scripts/render_evidence_matrix_chart.py` | Pillow 证据矩阵表图 → `assets/evidence-matrix-chart.png` |
| `tools/demo-video/` | Playwright 开发依赖隔离目录（不污染零运行时依赖基线） |
| `demo-output/` | 成片与中间产物（已 gitignore） |

## 前置条件

1. Node.js 20+
2. Python 3.10+，已安装 `edge-tts`、`Pillow`
3. `ffmpeg` 在 PATH（或设置环境变量 `FFMPEG`）
4. 本机可启动 Demo：`npm start` → `http://127.0.0.1:3000`

## 一次性安装

```powershell
cd D:\APPs\阿里qoder比赛\tools\demo-video
npm install
npx playwright install chromium
npx playwright install ffmpeg
```

可选：先渲染证据矩阵静帧

```powershell
python scripts/render_evidence_matrix_chart.py
```

## 录制

终端 1：

```powershell
cd D:\APPs\阿里qoder比赛
npm start
```

终端 2：

```powershell
cd D:\APPs\阿里qoder比赛
powershell -File "$env:USERPROFILE\.cursor\skills\demo-video-factory\scripts\run_demo_video.ps1" `
  -Storyboard demo.storyboard.json
```

或使用包装脚本：

```powershell
powershell -File .\scripts\run-demo-video.ps1
```

默认电影级成片：`demo-output/TenderPilot_AI_demo_cinematic_3min.mp4`  
（1920×1080@30、CRF≈17、preset slow、AAC 320k，旁白时长对齐硬烧字幕）

## 模式

- `record`（默认）：真实浏览器操作录屏，适合提交/推广
- `screenshot`：截图幻灯更稳，选择器抖动时可用

```powershell
powershell -File .\scripts\run-demo-video.ps1 -Mode screenshot
```

## 旁白边界（勿夸大）

脚本只展示当前已实现能力：

- 脱敏样例、规则拆解、证据矩阵、风险任务、受约束草稿、人工审核提示
- **双轨诚实表述**：默认规则拆解（无需 Key 可完整演示）；若配置 OpenAI 兼容 Key，可选用增强拆解，失败时回退规则路径
- **不**声称生产级大模型全量接入、文件上传、多人实时协作、线上存储或自动投标提交

## 已知卡点

1. 若 `healthUrl` 不可达：先确认 `npm start` 已监听 3000。
2. 若 Playwright 找不到：确认 `tools/demo-video/node_modules/playwright` 存在，且 storyboard `playwrightDir` 指向该目录。
3. 录制脚本优先使用系统 Chrome（`channel: "chrome"`）。本机若无法从 `cdn.playwright.dev` 下载 Playwright Chromium，仍可用系统 Chrome 跑通。
4. 若 TTS 失败：compose 脚本可回退 Windows SAPI；仍建议修好 `edge-tts`。
5. 证据矩阵原生 `<select>` 不适合用 storyboard 的 `role=option` 点击（会匹配多行）；当前分镜用滚动 + 勾选风险任务代替改状态；另有 Pillow 表图场景 `chart`。
6. 目标时长 180s 时，若成片偏短：compose 已按 `minDuration` 补静音并延长画面；仍可加长旁白后重跑。

## 最近一次成功跑通

- 日期：2026-07-30
- 成片：`demo-output/TenderPilot_AI_demo_cinematic_3min.mp4`
- ffprobe：约 **182s**，**1920×1080@30**，H.264 + AAC（stereo / 48 kHz），约 26.7 MB
- 字幕：ASS 由各段实际 TTS/片段时长生成并硬烧（同目录 `subtitles.ass` / `subtitles.srt`）
- 旁白：双轨诚实表述（规则默认 + 可选 OpenAI 兼容增强；失败回退规则）
- 分镜含 Pillow 证据矩阵表图场景 `chart` → `assets/evidence-matrix-chart.png`
