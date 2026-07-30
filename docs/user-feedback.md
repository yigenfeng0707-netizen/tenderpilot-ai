# 真实用户反馈收集（合规、可核验）

目标：服务评分中的「用户认可度」——让真实用户可体验，并留下可核验反馈；**不购买、不伪造、不刷赞/刷评**。

机制状态（2026-07-30）：**已回收 ≥1 条可核验记录**（见下表）。持续欢迎补充；不购买、不伪造、不刷赞。

## 一键复制：邀请包

```text
【TenderPilot AI 试用邀请｜约 3 分钟】
Demo：https://gsym236998-tenderpilot-ai.ms.show/
步骤：打开链接 →「加载脱敏样例」→「拆解要求」→ 看证据矩阵 / 风险任务 / 草稿
反馈（2–3 句即可）：https://github.com/yigenfeng0707-netizen/tenderpilot-ai/issues/new?template=user-feedback.md
若愿意：在创空间或研习社文章下留一句真实评价 / 点个赞（不要用水军）
说明：数据在浏览器本地；无 Key 也能完整走通。
```

## 入口（择一即可）

| 入口 | URL / 位置 | 说明 |
| --- | --- | --- |
| GitHub Issue（主入口） | https://github.com/yigenfeng0707-netizen/tenderpilot-ai/issues/new?template=user-feedback.md | 需登录 GitHub；模板见仓库 `.github/ISSUE_TEMPLATE/user-feedback.md` |
| 快捷新建（无模板时） | https://github.com/yigenfeng0707-netizen/tenderpilot-ai/issues/new?title=%E7%94%A8%E6%88%B7%E5%8F%8D%E9%A6%88%EF%BC%9A | 标题预填「用户反馈：」 |
| Demo 页页脚 | 公开 Demo / 本地 `index.html` 页脚「反馈」链接 | 指向上述 Issue |
| 本仓库说明 | `README.md`「真实用户反馈」小节 | 邀请话术与流程 |

无后端、无第三方表单依赖；与项目零运行时依赖风格一致。

## 如何邀请真实用户试用（话术模板）

可复制给同事 / 朋友 / 运营同行（每人 1 次真实试用即可，勿群发刷量）：

> 我在做赛事 Demo **TenderPilot AI**（投标/申报材料协作台）。  
> 打开链接：https://gsym236998-tenderpilot-ai.ms.show/  
> 点「加载脱敏样例」→「拆解要求」，看证据矩阵和风险任务是否对你有用。  
> 试用后如果愿意，用 2–3 句话写反馈（好用/不好用都行）：  
> https://github.com/yigenfeng0707-netizen/tenderpilot-ai/issues/new?template=user-feedback.md  
> 也可私下发我，我会征得同意后再公开摘要。

建议邀请渠道（自然、可核验）：同事私聊、研习社文章评论区、小红书评论区自然回复、GitHub Issue。**不要**用脚本、水军或批量账号。

## 反馈记录表（收到后填写）

| 日期 | 用户类型（如投标运营/同事/路人） | 原话摘要 | 是否可公开 | 证据链接（Issue/截图路径） |
| --- | --- | --- | --- | --- |
| 2026-07-30 | 仓库作者账号提交的反馈 Issue（已勾选公开 Demo + 本地试用；模板正文三问未填细答） | 评论原话：「在魔搭社区反馈相当好」 | 是 | https://github.com/yigenfeng0707-netizen/tenderpilot-ai/issues/1 |

说明：当前可核验公开材料以 Issue #1 及其评论为准。创空间作品 API（同日）仍为 `likes=0` / `stars=0` / `comment_count=0`，`visits≈14423`。若有第三人私聊原话或魔搭评论截图，可继续追加本表。

公开对外材料时：只引用已勾选「可公开」且保留原文出处的条目；不编造人数或评分。

## Agent 归档流程

1. `gh issue list -R yigenfeng0707-netizen/tenderpilot-ai --state all --limit 20`
2. 将可公开原话脱敏写入上表；勾选 `TODO.md`「回收真实用户反馈」仅当 ≥1 条可核验。
3. **不**代发小红书/创空间评论；有材料后再提醒作者是否更新研习社。

## 评审可核验材料建议

1. 至少 1–3 条真实 Issue 或带日期的私聊摘要（脱敏后写入上表）。
2. 公开 Demo / 研习社 / 小红书链接仍可未登录打开（见 `docs/delivery-notes.md`）。
3. 对外文案不写「用户数 / 好评率」除非有上表事实支撑。
