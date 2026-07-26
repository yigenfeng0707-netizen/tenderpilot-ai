# TenderPilot AI 交付与赛期巡检记录

巡检日期：2026-07-26（北京时间记录；官方页面未标明时区）  
核验方式：赛事门户作品 API + 未登录浏览器 / HTTPS 探测（curl / Invoke-WebRequest）；小红书另由用户确认带 xsec 的 creator 管理链  
说明：以下仅记录可核验事实；找不到的公开 URL 标注「待补」，不臆造链接。  
外链补齐：同日从门户 `GET /api/works/54b7abc5-...` 取回已提交的研习社 / 小红书 URL 并复核。

## 作品门户摘要

| 字段 | 值 | 来源 |
| --- | --- | --- |
| 作品名称 | TenderPilot AI | `docs/portal-requirements.md` |
| 作品 ID | `54b7abc5-c35c-43e6-acd9-877b7c972555` | 同上（2026-07-15 提交核验） |
| 提交时间 | 2026/7/15 22:41:59 | 同上 |
| 刷新后投稿数 | 1 | 同上 |
| 可见性 | `is_public: 1` | 同上 |

## 公开资产 URL

| 资产 | URL | 2026-07-26 状态 | 备注 |
| --- | --- | --- | --- |
| 公开 Demo（创空间独立域名） | https://gsym236998-tenderpilot-ai.ms.show/ | 可访问（HTTP 200） | 未登录可打开首页；已点「加载脱敏样例」「拆解要求」，可见候选要求、证据矩阵、风险任务、受约束草稿 |
| ModelScope Studio | https://www.modelscope.cn/studios/gsym236998/tenderpilot-ai | 可访问（HTTP 200） | Studio 元数据含 `NeedLogin:false`、`Status:Running`、`IndependentUrl` 与 Demo 一致 |
| GitHub | https://github.com/yigenfeng0707-netizen/tenderpilot-ai | 可访问（HTTP 200） | README 中的公开仓库 |
| 研习社创作手记 | https://www.modelscope.cn/learn/434949 | 可访问（HTTP 200，未登录可读） | 标题《从一份申报通知到一张协作图：TenderPilot AI》；作者 `gsym236998`；更新 2026-07-15；门户字段 `blog_url` 一致 |
| 小红书参赛心得 | https://www.xiaohongshu.com/explore/6a579b080000000022014c3c?xsec_token=YAfpZNHX3MR06ldBOodeWLSqMpEaCMjc-PF2pTqaCwpk%3D&xsec_source=pc_creatormng | 已确认 / 用户提供 | 用户确认的公开链（含 xsec，便于可访问）。稳定笔记 ID：`6a579b080000000022014c3c`。备用干净路径：`https://www.xiaohongshu.com/explore/6a579b080000000022014c3c`（门户字段 `xiaohongshu_note_url` 原值）。`extra_content_incentive=1`。自动化未登录 Web / Cursor browser 打开仍返回 error `300031`，未能读取标题或正文；**用户已提供带 token 的 creator 管理链，按已确认归档**。说明：`xsec_token` 可能过期，过期后需用 App / 创作中心重新复制可访问链 |
| 赛事门户首页 | https://mseo-ai-inf.ms.show/ | 可访问（HTTP 200） | 未登录可浏览赛题与日程 |
| 赛事作品提交页 | https://mseo-ai-inf.ms.show/submit/new | HTTP 可达 | 表单操作需登录；本次未重新提交 |
| 公示公告 | https://mseo-ai-inf.ms.show/announcements | 页面可达 | 2026-07-26 未登录浏览未见新增公告正文列表（页面主体无明显公告条目） |

## 赛程与截止（官方页面 2026-07-26）

来源：赛事门户「比赛日程」区块（`https://mseo-ai-inf.ms.show/`）。

| 阶段 | 页面显示日期 | 说明 |
| --- | --- | --- |
| 报名 | 07.15–08.10 | 阶段 1 |
| 打榜创作（核心创作期） | 07.15–08.10 | 阶段 2；与文档原先记录的 `08.10` 打榜截止一致 |
| 评审 | 08.11–08.14 | 阶段 3 |
| 获奖公示 | 08.15 | 阶段 4；文案亦写「获奖公示：8.15」 |

补充观察：

1. 首页 Banner 可见总区间文案 `07.15-08.15`，与分阶段日期并存；**打榜提交仍以阶段 2 的 08.10 为准**。
2. 官方页面**未标明时区**；仓库计划仍按北京时间（UTC+8）理解，但需在截止前再次人工确认。
3. 本次未见对主题、部署要求、文章要求或评审规则的新公告覆盖上述日程。

## 一致性快照（与 README / Demo 对齐部分）

已对齐并可核验：

- 项目名称：TenderPilot AI
- 定位：面向投标与项目申报运营的材料协作台
- 核心功能：要求拆解、证据矩阵、风险任务、带来源草稿
- 数据边界：内置脱敏样例；浏览器本地处理；演示模式提示可见
- Demo / Studio / GitHub 链接互相一致

已闭环（用户确认）：

- 小红书：用户已提供带 `xsec_token` / `xsec_source=pc_creatormng` 的公开可访问链并确认归档；自动化侧仍无法在未登录 Web 读取标题/正文，故不臆造笔记标题或与 TenderPilot 的正文相关性描述。

## 下一步（非自动执行）

1. 若 `xsec_token` 失效或笔记删改，用创作中心「已发布」重新复制可访问 URL，回写本文件与 README（稳定 ID 仍为 `6a579b080000000022014c3c`）。
2. 打榜截止前（约 08.10）再跑一轮未登录冒烟：Demo 主流程、Studio、研习社文章页。
3. 演示视频流水线见 `demo.storyboard.json` 与 `docs/demo-video.md`；最近成片路径：`demo-output/TenderPilot_AI_demo_3min.mp4`。
