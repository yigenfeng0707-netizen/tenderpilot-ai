# TenderPilot AI

面向投标与项目申报运营的材料协作台。把已脱敏的项目要求转化为可追溯的要求清单、证据矩阵、风险任务与受约束内容草稿。

> 参赛 Demo：AI+∞ 开发者创作大赛，第一期主题“AI + 运营”。

## 解决的问题

运营团队面对申报通知或投标要求时，常需要反复阅读长文本、找材料、催负责人、核对截止节点，再将未经核验的内容写进方案。TenderPilot AI 将这些重复动作压缩为一条可协作工作流：

1. 粘贴已脱敏的要求文本。
2. 提取候选要求，并保留原文引用。
3. 确认或忽略候选要求，再映射已有证据、缺口、负责人和状态。
4. 生成按优先级排序的风险任务。
5. 生成只基于输入内容的草稿，明确提示待核验内容和人工审核责任。

## 本地运行

要求：Node.js 20 或更高版本。

```bash
npm start
```

访问 `http://localhost:3000`。应用不依赖 API key、数据库或外部后端；演示数据仅在浏览器内处理。

## 验证

```bash
npm run check
npm test
```

## 演示流程

1. 点击“加载脱敏样例”。
2. 点击“拆解要求”。
3. 查看候选要求的原文引用和优先级，并确认或忽略候选。
4. 在证据矩阵中更新材料状态。
5. 勾选风险任务，查看受约束草稿及引用依据。

## 边界与限制

- 本版本是可复现的规则驱动 Demo，不调用大模型或外部 API。
- 候选确认、证据状态和任务完成状态仅保存在当前浏览器的 `localStorage` 中；它们不会同步给其他用户或服务器。
- 请勿粘贴未脱敏的投标文件、客户资料、个人信息或商业机密。
- 草稿不是投标、法律、财务或合规意见；任何事实、报价、资格与承诺均须由负责人审核。
- 当前仅解析纯文本候选要求，可能遗漏表格、附件、例外条款和非标准表述；生产使用前应补充分段解析、权限控制、审计和企业数据治理。

## 真实用户反馈

欢迎真实试用后留下 2–3 句反馈（好用或不好用均可）。**不购买、不伪造、不刷取互动。**

1. 打开公开 Demo：https://gsym236998-tenderpilot-ai.ms.show/（「加载脱敏样例」→「拆解要求」）。
2. 提交反馈：https://github.com/yigenfeng0707-netizen/tenderpilot-ai/issues/new?template=user-feedback.md  
3. 邀请话术、记录表与合规说明见 [`docs/user-feedback.md`](docs/user-feedback.md)。

## 原创性与来源

- 项目交互、样例文本和代码均为本次赛事开发。
- 使用浏览器原生能力与 Node.js 内置模块，无第三方运行时依赖。
- 字体通过 Google Fonts 加载；如部署环境无法访问，可替换为系统字体，不影响核心功能。

## 许可证

本项目采用 [Apache License 2.0](LICENSE) 发布。

## 部署

当前项目为无构建步骤的静态 Web 应用，可部署到支持 Node.js 启动命令 `npm start` 的环境。

- 公开代码仓库：https://github.com/yigenfeng0707-netizen/tenderpilot-ai
- 公开 ModelScope Studio：https://www.modelscope.cn/studios/gsym236998/tenderpilot-ai
- 公开 Demo：https://gsym236998-tenderpilot-ai.ms.show/
- 研习社创作手记：https://www.modelscope.cn/learn/434949
- 小红书参赛心得：https://www.xiaohongshu.com/explore/6a579b080000000022014c3c?xsec_token=YAfpZNHX3MR06ldBOodeWLSqMpEaCMjc-PF2pTqaCwpk%3D&xsec_source=pc_creatormng（笔记 ID `6a579b080000000022014c3c`；`xsec_token` 可能过期）

当前 Studio 已部署并验证主流程。发布后应继续以未登录浏览器完成样例、移动端、错误状态和控制台错误的在线冒烟测试。
