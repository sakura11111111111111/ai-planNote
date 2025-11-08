# 智能艾宾浩斯复习笔记

一个基于艾宾浩斯遗忘曲线的智能复习笔记应用，帮助您更高效地学习和记忆。

## 功能特点

- 📝 **富文本编辑**: 使用 TipTap 编辑器，支持格式化、图片、链接等
- 🤖 **AI 摘要**: 集成 OpenAI API，自动生成笔记摘要
- 📅 **智能复习**: 基于 SuperMemo SM-2 算法的艾宾浩斯复习系统
- ⏱️ **强制阅读**: 15秒阅读时间确保充分理解内容
- 💾 **本地存储**: 使用 IndexedDB 存储数据，无需服务器
- 🎨 **现代界面**: 基于 Tailwind CSS 的简洁美观界面

## 技术栈

- **前端框架**: Vue 3 (Composition API)
- **构建工具**: Vite
- **状态管理**: Pinia
- **样式框架**: Tailwind CSS
- **富文本编辑器**: TipTap
- **数据库**: Dexie.js (IndexedDB 封装)
- **HTTP 请求**: Axios
- **路由**: Vue Router

## 安装和运行

### 1. 安装依赖

```bash
npm install
```

### 2. 配置 OpenAI API Key

首次使用时，请在应用的"设置"中配置您的 OpenAI API Key。API Key 将安全地存储在浏览器的 localStorage 中。

### 3. 运行开发服务器

```bash
npm run dev
```

应用将在 `http://localhost:5173` 启动。

### 4. 构建生产版本

```bash
npm run build
```

构建产物将输出到 `dist` 目录。

### 5. 预览生产版本

```bash
npm run preview
```

## 使用指南

### 创建笔记

1. 点击"新建笔记"按钮
2. 输入标题和内容（支持富文本格式）
3. 点击"保存"
4. AI 将自动生成摘要（需要配置 OpenAI API Key）

### 复习笔记

1. 在仪表盘查看今日待复习数量
2. 点击"开始复习"
3. 阅读笔记内容（强制15秒阅读时间）
4. 评价记忆程度：
   - **忘记了**: 重新开始复习周期
   - **模糊**: 略微延长复习间隔
   - **记住了**: 按标准周期延长复习间隔

### 复习算法说明

应用采用简化版的 SuperMemo SM-2 算法：

- **忘记了**: 重置进度，明天复习
- **模糊**: 间隔略微增加，难度因子降低
- **记住了**: 按照 1→2→4→7→15→30... 天的周期复习

## 项目结构

```
src/
├── assets/           # 静态资源和样式
│   └── main.css
├── components/       # UI 组件
│   ├── Dashboard.vue      # 仪表盘
│   ├── NoteEditor.vue     # 笔记编辑器
│   ├── NoteList.vue       # 笔记列表
│   └── ReviewReader.vue   # 复习阅读器
├── data/             # 数据访问层
│   ├── indexedDbAdapter.js    # IndexedDB 操作
│   └── aiApiAdapter.js        # OpenAI API 调用
├── router/           # 路由配置
│   └── index.js
├── services/         # 业务逻辑层
│   ├── aiService.js           # AI 摘要服务
│   └── reviewService.js       # 复习算法服务
├── stores/           # Pinia 状态管理
│   └── noteStore.js
├── App.vue           # 根组件
└── main.js           # 应用入口
```

## 数据模型

```javascript
{
  id: string,              // 唯一标识符
  title: string,           // 笔记标题
  content: string,         // 富文本 HTML 内容
  aiSummary: string | null, // AI 生成的摘要
  nextReviewDate: string,  // 下次复习日期 (YYYY-MM-DD)
  interval: number,        // 当前复习间隔（天）
  repetitions: number,     // 复习次数
  easeFactor: number,      // 难度因子（初始值 2.5）
}
```

## 注意事项

1. **API Key 安全**: OpenAI API Key 存储在浏览器的 localStorage 中，请勿在不可信的设备上使用
2. **数据备份**: 数据存储在浏览器的 IndexedDB 中，建议定期导出备份
3. **浏览器兼容性**: 需要支持 IndexedDB 的现代浏览器
4. **API 费用**: 使用 OpenAI API 会产生费用，请注意使用量

## 开发

### 添加新功能

1. 在相应的目录中添加新文件
2. 更新路由配置（如需要）
3. 在 store 中添加新的 state 和 actions（如需要）

### 调试

使用 Vue DevTools 进行调试，可以查看组件状态、Pinia store 等。

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request！
