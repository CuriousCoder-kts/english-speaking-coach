# SpeakFlow — AI 英语口语陪练

> 一款基于 Web 的 AI 英语口语练习工具，帮助用户在指定场景下进行真实对话训练。

---

## 项目概述

**SpeakFlow**（项目目录：`english-speaking-coach`）是一款面向口语练习的 Web 应用。用户选择真实生活或职场场景后，与 AI 教练进行**语音对话**；系统在对话过程中提供**发音评测**、**语法/表达纠错**与**实时数据反馈**，会话结束后生成**课后总结报告**，帮助用户量化追踪口语能力提升。

本项目为纯前端应用，默认无需后端服务器。语音识别与合成在浏览器本地完成，对话逻辑由内置场景引擎驱动；可选接入 OpenAI API 以获得更自然的 AI 回复。

---

## 需求实现对照

| 需求 | 实现方案 | 状态 |
|------|----------|------|
| 场景选择（面试 / 点餐 / 会议等） | 5 个预设场景，含难度、目标、关键词汇 | ✅ |
| 实时语音对话 | Web Speech API 识别 + 合成，点击麦克风即可对话 | ✅ |
| 发音评测 | 识别置信度 + 难词/长词分析，逐句 0–100 分 | ✅ |
| 语法 / 表达纠错 | 15+ 语法规则 + 表达优化建议，每轮即时反馈 | ✅ |
| 课后总结 | 发音 / 语法 / 流利度评分 + 优势与改进建议 | ✅ |
| 对话自然度 | 场景感知对话引擎；可选 GPT-4o-mini 增强 | ✅ |
| 语音流畅性与低延迟 | 浏览器端 STT/TTS，无服务端中转 | ✅ |
| 纠错精准度与时机 | 用户说完一句后检查，横幅 + 消息内详情 | ✅ |
| 可量化反馈 | 侧边栏实时指标 + 课后环形图报告 | ✅ |

---

## 功能特性

### 1. 场景选择

提供 5 个练习场景，每个场景包含 AI 角色设定、开场白、练习目标与推荐词汇：

| 场景 | 中文 | 难度 | 说明 |
|------|------|------|------|
| Job Interview | 求职面试 | advanced | 自我介绍、经历描述、行为面试题 |
| Ordering Food | 餐厅点餐 | beginner | 点餐、询问菜单、提出特殊要求 |
| Team Meeting | 团队会议 | intermediate | 进度汇报、提建议、职场讨论 |
| Travel & Directions | 旅行问路 | beginner | 问路、订酒店、处理旅行问题 |
| Small Talk | 日常闲聊 | beginner | 天气、爱好、日常寒暄 |

### 2. 实时语音对话

- **语音识别（STT）**：用户点击麦克风说话，浏览器实时转写；说完一句后自动提交
- **语音合成（TTS）**：AI 教练用英语朗读回复，含开场白自动播报
- **对话流程**：选场景 → 听开场 → 麦克风回应 → AI 回复 → 循环，直至结束会话

### 3. 发音评测

- 基于 Web Speech API 返回的**识别置信度**估算发音清晰度
- 对**常见难词**（如 comfortable、schedule）和**长词**额外标记
- 每句用户发言显示 **Pronunciation XX%** 分数
- 会话结束后汇总**平均发音分**

### 4. 语法 / 表达纠错

**语法纠错**（示例）：

- `I am agree` → `I agree`
- `He don't` → `He doesn't`
- `Explain me` → `Explain to me`
- `Discuss about` → `Discuss`

**表达优化**（示例）：

- `Give me` → `Could I have`（更礼貌）
- `I want to order` → `I'd like to order`（餐厅场景）
- `Very very` → `Extremely / Really`（避免重复）

纠错展示方式：

- **即时横幅**：每轮对话结束后，顶部弹出最重要的一条建议
- **消息内详情**：用户气泡下方展示完整纠错列表与解释

### 5. 课后总结

结束会话后生成报告，包含：

- **环形评分图**：发音、语法、流利度（0–100）
- **会话统计**：时长、对话轮次、纠错次数
- **Strengths**：本次表现亮点
- **Areas to Improve**：针对性改进建议
- **Words You Used**：本次使用的词汇标签

### 6. 实时侧边栏指标

练习过程中右侧实时展示：

- Pronunciation（发音）
- Grammar（语法准确率）
- Fluency（流利度）
- Turns（对话轮次）

同时显示当前场景的**练习目标**与**关键词汇**。

---

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | React 19 |
| 语言 | TypeScript |
| 构建 | Vite 6 |
| 语音 | Web Speech API（SpeechRecognition + SpeechSynthesis） |
| AI 对话 | 内置场景规则引擎 + 可选 OpenAI GPT-4o-mini |
| 样式 | 原生 CSS（DM Sans + Instrument Serif 字体） |

---

## 项目结构

```
english-speaking-coach/
├── index.html                 # 入口 HTML
├── package.json
├── vite.config.ts
├── tsconfig.json
├── .env.example               # 环境变量示例（OpenAI API Key）
├── README.md
└── src/
    ├── main.tsx               # 应用入口
    ├── App.tsx                # 主布局与页面路由逻辑
    ├── index.css              # 全局样式
    ├── vite-env.d.ts
    ├── speech.d.ts            # Web Speech API 类型声明
    ├── types/
    │   └── index.ts           # Scene、Message、Correction、SessionMetrics 等类型
    ├── data/
    │   └── scenes.ts          # 5 个场景的配置数据
    ├── services/
    │   ├── aiCoach.ts         # AI 回复生成、课后总结文案
    │   ├── grammarChecker.ts  # 语法与表达规则检查
    │   └── pronunciationAnalyzer.ts  # 发音分析与流利度计算
    ├── hooks/
    │   ├── useSpeechRecognition.ts   # 语音识别 Hook
    │   ├── useSpeechSynthesis.ts     # 语音合成 Hook
    │   └── useSession.ts             # 会话状态、消息、指标管理
    └── components/
        ├── SceneSelector.tsx         # 场景选择页
        ├── ConversationPanel.tsx     # 对话消息列表
        ├── VoiceControls.tsx         # 麦克风控制与纠错横幅
        ├── MetricsPanel.tsx          # 实时指标面板
        └── SessionSummary.tsx        # 课后总结页
```

---

## 核心模块说明

### `useSpeechRecognition`

封装浏览器语音识别：支持连续识别、 interim 实时转写、自动重启监听。识别完成后回调 transcript 与 confidence。

### `useSpeechSynthesis`

封装语音合成：自动选择英文语音，支持语速调节与播放结束回调。

### `useSession`

管理完整练习会话：场景启动、消息列表、用户发言处理、指标累计、结束会话并生成总结。

### `grammarChecker`

基于正则规则库检测常见中式英语语法错误与表达问题，返回结构化 `Correction` 列表。

### `pronunciationAnalyzer`

结合识别置信度、词长、难词库分析发音质量；并根据平均句长与轮次计算流利度分数。

### `aiCoach`

- **本地模式**（默认）：按场景 + 用户关键词匹配预设回复逻辑，无需联网
- **GPT 模式**（可选）：调用 OpenAI Chat Completions API，角色扮演更自然

---

## 快速开始

### 环境要求

- Node.js 18+
- Chrome 或 Edge 浏览器（完整支持 Web Speech API）
- 麦克风权限
- localhost 或 HTTPS 环境

### 安装与运行

```bash
cd english-speaking-coach
npm install
npm run dev
```

浏览器访问：**http://localhost:5173**

### 生产构建

```bash
npm run build    # 输出到 dist/
npm run preview  # 预览生产构建
```

### 可选：启用 GPT 对话

```bash
cp .env.example .env
```

编辑 `.env`：

```
VITE_OPENAI_API_KEY=sk-your-key-here
```

重启 `npm run dev` 后生效。未配置 API Key 时，应用使用内置场景引擎，**可离线练习**。

---

## 使用流程

```
选择场景 → AI 语音开场 → 点击麦克风说话 → 查看即时反馈 → 继续对话 → 结束会话 → 查看总结报告
```

1. **选择场景** — 在首页点击场景卡片
2. **听 AI 开场** — 教练自动用英语朗读开场白
3. **点击麦克风** — 用英语回应；说完后自动识别
4. **查看反馈** — 注意横幅纠错、发音分数、消息内详细说明
5. **结束会话** — 点击「End Session」或「Finish & Review」
6. **复习总结** — 查看评分与改进建议，可「再练一次」或「换场景」

---

## 设计考量

| 维度 | 方案 |
|------|------|
| **对话自然度** | 场景专属 AI 角色 + 关键词驱动的上下文回复；GPT 模式进一步贴近真人 |
| **语音延迟** | STT/TTS 均在浏览器本地执行，无网络往返 |
| **纠错时机** | 用户完成一句后再纠错，不打断说话流程 |
| **纠错粒度** | 横幅突出最重要 1 条；完整列表附在消息气泡内 |
| **量化反馈** | 发音 / 语法 / 流利度 / 轮次四维指标，课后可视化报告 |

---

## 浏览器兼容性

| 浏览器 | 语音识别 | 语音合成 | 推荐 |
|--------|----------|----------|------|
| Chrome | ✅ | ✅ | ⭐ 推荐 |
| Edge | ✅ | ✅ | ⭐ 推荐 |
| Firefox | ⚠️ 部分支持 | ✅ | 不推荐 |
| Safari | ⚠️ 部分支持 | ✅ | 不推荐 |

---

## 后续可扩展方向

- 接入 Azure / Google 等专业发音评测 API，提升发音分析精度
- 增加更多场景（电话沟通、演讲、医疗等）
- 用户登录与历史练习记录持久化
- 对话录音回放与逐词波形分析
- 多语言界面（中/英切换）
- 移动端 PWA 支持

---

## License

MIT
