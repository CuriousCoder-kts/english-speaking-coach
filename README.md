# SpeakFlow — AI 英语口语陪练

> 一款基于 Web 的 AI 英语口语练习工具，帮助用户在指定场景下进行真实对话训练。

---

## 项目简介

**SpeakFlow**（项目目录名：`english-speaking-coach`）是一款面向口语学习者的浏览器端应用。用户可选择面试、点餐、会议等真实生活场景，与 AI 教练进行**实时语音对话**，并在对话过程中获得**发音评测**、**语法/表达纠错**与**课后量化总结**。

项目侧重以下体验目标：

- **对话自然度**：场景化角色扮演，AI 按上下文推进对话
- **语音流畅性**：语音识别与合成均在浏览器本地完成，延迟低
- **纠错精准与时机**：用户每说完一句后立即反馈，不打断整体对话流
- **能力可量化**：实时侧边栏指标 + 课后环形评分与文字建议

---

## 功能特性

| 功能 | 说明 |
|------|------|
| **场景选择** | 5 大场景：求职面试、餐厅点餐、团队会议、旅行问路、日常闲聊 |
| **实时语音对话** | Web Speech API 实现语音识别（STT）与语音合成（TTS） |
| **发音评测** | 基于识别置信度与难词分析，逐句给出 0–100 分发音评分 |
| **语法纠错** | 15+ 常见语法规则检测（如 *I am agree* → *I agree*） |
| **表达优化** | 地道表达建议（如 *give me* → *Could I have*） |
| **即时反馈** | 每轮对话后显示纠错横幅与消息内详细说明 |
| **实时指标** | 侧边栏展示发音、语法、流利度、对话轮次 |
| **课后总结** | 会话结束后生成环形评分、优势列表与改进建议 |
| **可选 AI 增强** | 配置 OpenAI API Key 后启用 GPT-4o-mini 更自然对话 |

---

## 支持场景

| 场景 | 难度 | 角色设定 |
|------|------|----------|
| 💼 求职面试 | Advanced | HR 经理，模拟软件工程师岗位面试 |
| 🍽️ 餐厅点餐 | Beginner | 美式餐厅服务员，练习点餐与特殊需求 |
| 📊 团队会议 | Intermediate | 项目负责人，练习工作汇报与讨论 |
| ✈️ 旅行问路 | Beginner | 旅游咨询处工作人员，练习问路与订房 |
| 💬 日常闲聊 | Beginner | 社区活动上的邻居，练习破冰与闲聊 |

每个场景包含：开场白、练习目标、推荐词汇表，以及内置对话推进逻辑。

---

## 快速开始

### 环境要求

- Node.js 18+
- 现代浏览器（推荐 **Chrome** 或 **Edge**）
- 麦克风权限
- HTTPS 或 `localhost` 环境（Web Speech API 要求）

### 安装与运行

```bash
cd english-speaking-coach
npm install
npm run dev
```

浏览器访问：**http://localhost:5173**

### 生产构建

```bash
npm run build    # 输出至 dist/
npm run preview  # 本地预览生产版本
```

---

## 使用流程

1. **选择场景** — 在首页点击场景卡片进入练习
2. **听 AI 开场** — 教练自动用语音朗读场景开场白
3. **点击麦克风说话** — 点击「Hold to Speak」，说完后自动识别
4. **查看即时反馈** — 观察语法横幅、发音分数、消息内纠错详情
5. **继续对话** — 多轮练习，侧边栏实时更新指标
6. **结束会话** — 点击「End Session」或「Finish & Review」查看课后报告

---

## 可选配置：启用 GPT 对话

默认使用**内置场景感知对话引擎**，无需联网即可练习。如需更自然的 AI 回复，可配置 OpenAI：

```bash
cp .env.example .env
```

编辑 `.env`：

```env
VITE_OPENAI_API_KEY=sk-your-key-here
```

重启开发服务器后生效。未配置 Key 时自动回退到本地对话引擎。

---

## 技术架构

### 技术栈

| 层级 | 技术 |
|------|------|
| 前端框架 | React 19 + TypeScript |
| 构建工具 | Vite 6 |
| 样式 | 原生 CSS（DM Sans + Instrument Serif 字体） |
| 语音识别 | Web Speech API — `SpeechRecognition` |
| 语音合成 | Web Speech API — `SpeechSynthesis` |
| AI 对话 | 内置规则引擎 + 可选 OpenAI GPT-4o-mini |
| 语法检测 | 客户端正则规则匹配 |
| 发音分析 | 识别置信度 + 难词库启发式评分 |

### 目录结构

```
english-speaking-coach/
├── index.html                 # 入口 HTML
├── package.json
├── vite.config.ts
├── tsconfig.json
├── .env.example               # 环境变量示例
├── README.md
└── src/
    ├── main.tsx               # 应用入口
    ├── App.tsx                # 根组件，编排会话流程
    ├── index.css              # 全局样式
    ├── vite-env.d.ts
    ├── speech.d.ts            # Web Speech API 类型声明
    ├── types/
    │   └── index.ts           # Scene、Message、Metrics 等类型
    ├── data/
    │   └── scenes.ts          # 5 个场景的配置数据
    ├── hooks/
    │   ├── useSpeechRecognition.ts  # 语音识别 Hook
    │   ├── useSpeechSynthesis.ts    # 语音合成 Hook
    │   └── useSession.ts            # 会话状态与指标管理
    ├── services/
    │   ├── aiCoach.ts               # AI 回复生成 + 课后总结
    │   ├── grammarChecker.ts        # 语法与表达规则检测
    │   └── pronunciationAnalyzer.ts # 发音评分与流利度计算
    └── components/
        ├── SceneSelector.tsx        # 场景选择页
        ├── ConversationPanel.tsx    # 对话消息面板
        ├── VoiceControls.tsx        # 麦克风控制与纠错横幅
        ├── MetricsPanel.tsx         # 实时指标侧边栏
        └── SessionSummary.tsx       # 课后总结页
```

### 核心模块说明

#### 1. 语音识别（`useSpeechRecognition`）

- 封装浏览器 `SpeechRecognition` / `webkitSpeechRecognition`
- 支持连续识别与 interim 实时字幕
- 识别完成后回调 transcript 与 confidence

#### 2. 语音合成（`useSpeechSynthesis`）

- 封装 `SpeechSynthesisUtterance`
- 自动选择英文语音，控制语速与播放状态

#### 3. 会话管理（`useSession`）

- 管理场景、消息列表、会话状态（选择 / 进行中 / 总结）
- 每轮用户发言后触发：语法检测 → 发音分析 → AI 回复
- 会话结束时汇总指标并生成优劣势分析

#### 4. 语法检测（`grammarChecker`）

- 规则库覆盖常见中式英语错误（主谓一致、介词、冗余表达等）
- 区分 `grammar` 与 `expression` 两类纠错

#### 5. 发音分析（`pronunciationAnalyzer`）

- 综合 Web Speech API 置信度与难词库（如 *comfortable*、*schedule*）
- 输出逐词评分与会话级流利度分数

#### 6. AI 教练（`aiCoach`）

- **本地模式**：按场景 + 关键词匹配推进对话
- **GPT 模式**：调用 OpenAI Chat Completions，保持角色人设

---

## 设计说明

### 纠错时机

- 用户**说完一句后**立即检测，以横幅 + 消息气泡形式展示
- 不在用户说话过程中打断，保证对话连贯性

### 量化指标

| 指标 | 计算方式 |
|------|----------|
| 发音分 | 各轮识别置信度与难词分析的均值 |
| 语法准确率 | 基于每轮纠错数量的反向估算 |
| 流利度 | 综合平均句长、停顿比例、对话轮次 |
| 对话轮次 | 用户有效发言次数 |

### 离线能力

不配置 OpenAI Key 时，应用完全在浏览器端运行，适合本地演示与基础练习。

---

## 浏览器兼容性

| 浏览器 | 语音识别 | 语音合成 | 推荐 |
|--------|----------|----------|------|
| Chrome | ✅ | ✅ | ⭐ 推荐 |
| Edge | ✅ | ✅ | ⭐ 推荐 |
| Firefox | ⚠️ 有限 | ✅ | 不推荐 |
| Safari | ⚠️ 有限 | ✅ | 不推荐 |

---

## 后续可扩展方向

- 接入 Azure Speech / Google Cloud 等专业发音评测 API
- 增加更多场景（电话客服、学术答辩、医疗咨询等）
- 用户登录与会话历史持久化
- 录音回放与逐词波形对比
- 多语言界面（中/英切换）
- 移动端 PWA 支持

---

## License

MIT
