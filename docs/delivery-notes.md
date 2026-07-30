# TenderPilot AI 交付与赛期巡检记录

巡检日期：2026-07-30（北京时间记录；官方页面未标明时区）  
核验方式：赛事门户作品 API + 门户前端 chunk 赛程文案 + 未登录 HTTPS 探测（curl）；小红书未登录 Web 无法读正文  
说明：以下仅记录可核验事实；找不到的公开 URL 标注「待补」，不臆造链接。  
上次基线：2026-07-26。外链仍以门户 `GET /api/works/54b7abc5-...` 与 README 为准。

## 作品门户摘要

| 字段 | 值 | 来源 |
| --- | --- | --- |
| 作品名称 | TenderPilot AI | `GET /api/works/54b7abc5-...`（2026-07-30） |
| 作品 ID | `54b7abc5-c35c-43e6-acd9-877b7c972555` | 同上 |
| 提交时间 | 2026/7/15 22:41:59 | `docs/portal-requirements.md` |
| 可见性 | `is_public: 1` | 作品 API |
| 额外内容激励 | `extra_content_incentive=1` | 作品 API |
| Studio 状态 | `Running`；独立域名与 Demo 一致 | 作品 API `studio_info` |

## 公开资产 URL

| 资产 | URL | 2026-07-30 状态 | 备注 |
| --- | --- | --- | --- |
| 公开 Demo（创空间独立域名） | https://gsym236998-tenderpilot-ai.ms.show/ | 可访问（HTTP 200） | 未登录首页含 `TenderPilot AI`、演示模式、加载脱敏样例、拆解要求、证据矩阵、风险任务、受约束内容等关键文案；本次以 HTTP + 文案核验为主（未再浏览器点验点击流） |
| ModelScope Studio | https://www.modelscope.cn/studios/gsym236998/tenderpilot-ai | 可访问（HTTP 200） | 元数据含 `NeedLogin:false`、`Status:Running`、`IndependentUrl` 指向 `gsym236998-tenderpilot-ai.ms.show` |
| GitHub | https://github.com/yigenfeng0707-netizen/tenderpilot-ai | 可访问（HTTP 200） | README 公开仓库；`has_discussions:false`，反馈走 Issues |
| 研习社创作手记 | https://www.modelscope.cn/learn/434949 | 可访问（HTTP 200，未登录可读） | 标题《从一份申报通知到一张协作图：TenderPilot AI》；作者 `gsym236998`；门户 `blog_url` 一致 |
| 小红书参赛心得 | https://www.xiaohongshu.com/explore/6a579b080000000022014c3c?xsec_token=YAfpZNHX3MR06ldBOodeWLSqMpEaCMjc-PF2pTqaCwpk%3D&xsec_source=pc_creatormng | Web 受限，依赖用户侧 | 稳定笔记 ID：`6a579b080000000022014c3c`。2026-07-30 未登录 Web：干净路径与带 xsec 路径均未能读出 TenderPilot 正文；本次响应未见明确 `300031` 字样，但含 `forbidden` / 无笔记正文，**仍记为 Web 受限，依赖用户侧 App / 创作中心确认**。门户字段 `xiaohongshu_note_url` 仍为干净 explore 路径 |
| 赛事门户首页 | https://mseo-ai-inf.ms.show/ | 可访问（HTTP 200） | 未登录可浏览；赛程文案在前端 chunk 中核验 |
| 赛事作品提交页 | https://mseo-ai-inf.ms.show/submit/new | HTTP 可达 | 表单操作需登录；本次未重新提交 |
| 公示公告 | https://mseo-ai-inf.ms.show/announcements | 页面可达 | `GET /api/announcements` → `{"success":true,"data":[]}`，未见新增公告条目 |

## 赛程与截止（官方页面 2026-07-30）

来源：赛事门户首页前端 bundle（`/_next/static/chunks/app/(frontend)/page-*.js`）中「比赛日程」阶段文案。

| 阶段 | 页面显示日期 | 说明 |
| --- | --- | --- |
| 报名 | 07.15–08.10 | 阶段 1 |
| 打榜创作（核心创作期） | 07.15–08.10 | 阶段 2；打榜提交仍以 08.10 为准 |
| 评审 | 08.11–08.14 | 阶段 3 |
| 获奖公示 | 08.15 | 阶段 4 |

补充观察：

1. 与 2026-07-26 巡检一致：**打榜至 08.10 / 评审 08.11–08.14 / 公示 08.15**，未见改期。
2. 官方页面**未标明时区**；仓库计划仍按北京时间（UTC+8）理解，截止前再人工确认。
3. 公示公告 API 仍为空列表；未见对主题、部署、文章或评审规则的新公告覆盖上述日程。

## 一致性快照（与 README / Demo 对齐部分）

已对齐并可核验：

- 项目名称：TenderPilot AI
- 定位：面向投标与项目申报运营的材料协作台
- 核心功能：要求拆解、证据矩阵、风险任务、带来源草稿
- 数据边界：内置脱敏样例；浏览器本地处理；演示模式提示可见
- Demo / Studio / GitHub / 研习社 / 门户作品字段互相一致

小红书：仍按用户此前提供的带 xsec creator 管理链归档；自动化未登录 Web 无法核验正文 → 不臆造标题或相关性描述。

## 用户反馈机制（2026-07-30 落地）

- 说明文档：`docs/user-feedback.md`（话术、渠道、记录表；**无伪造数据**）
- GitHub Issue 模板：`.github/ISSUE_TEMPLATE/user-feedback.md`
- Demo 页脚「反馈」外链 + README「真实用户反馈」小节
- 状态：**机制已就绪、待回收**；公开 Demo 页脚「反馈」已于 **2026-07-30** 创空间重新部署后线上可见

### 创空间部署记录（2026-07-30）

- GitHub `main`：`ad49a3a`（含页脚反馈入口）
- 操作：登录态 PUT 创空间自有 Git 的 `index.html` / `styles.css`，再 `POST .../openapi/.../deploy`；Status：Creating → **Running**
- 核验：`https://gsym236998-tenderpilot-ai.ms.show/` 页脚含「反馈」及 GitHub Issue 模板链接
- 晚间再部署：GitHub `c56c6b1`（三端响应式）；PUT `index.html` / `styles.css` / `app.js` / `analysis.js` → deploy → **Running**；核验 HTTP 200、页脚「反馈」、CSS 断点 640/1024
- 冠军冲刺双轨：GitHub `da2c5a7`+；PUT `index.html` / `styles.css` / `app.js` / `analysis.js`（`llm-core` 已并入 `analysis.js`，因创空间 PUT 不能新建文件）→ deploy → **Running**；核验 mode-badge / llm-settings / callOpenAICompatible / 640+1024 断点。注意：GitHub push ≠ 创空间自动更新。

## 影响力 / 反馈巡检（2026-07-30 夜）

- GitHub Issues 用户反馈：**0** 条（`gh issue list` 空）
- 反馈记录表：仍为待填；机制就绪，待作者邀人
- 作品 API 字段本次自动化未解析出 visits/likes（留待作者在门户/Studio UI 目视）

1. 邀请 2–3 名真实用户试用 Demo，并回收 Issue / 私聊反馈写入 `docs/user-feedback.md` 记录表。
2. 若小红书 `xsec_token` 失效，用创作中心重新复制可访问 URL 回写本文件与 README。
3. 打榜截止前（约 08.10）再跑一轮未登录冒烟：Demo 主流程、Studio、研习社。
4. 演示视频流水线见 `demo.storyboard.json` 与 `docs/demo-video.md`；提交用本地成片见下方「演示视频提交速记」。

## 演示视频提交速记（可粘贴）

| 项 | 内容 |
| --- | --- |
| 本地成片（上传用） | `demo-output/TenderPilot_AI_demo_cinematic_3min.mp4` |
| 规格 | 约 **182s**，**1920×1080@30**，H.264 + AAC；ASS 字幕已硬烧 |
| 公开 Demo | https://gsym236998-tenderpilot-ai.ms.show/ |
| ModelScope Studio | https://www.modelscope.cn/studios/gsym236998/tenderpilot-ai |
| GitHub | https://github.com/yigenfeng0707-netizen/tenderpilot-ai |
| 双轨一句 | 默认规则拆解、无需 Key 即可完整演示；配置 OpenAI 兼容 Key 后可选用增强拆解，失败时诚实回退规则路径 |
| 仓库说明 | `demo-output/` 已 gitignore，成片仅在本机；参赛上传请用上述本地 MP4，勿依赖仓库内二进制 |

流水线细节与重跑步骤：`docs/demo-video.md`。

