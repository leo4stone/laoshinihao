# 单词卡片应用

一个基于React和TypeScript的交互式单词学习应用，帮助用户通过卡片形式记忆和学习单词。

## 功能特点

- 从CSV文件加载单词数据
- 卡片式浏览单词
- 点击显示/隐藏单词翻译
- 单词列表快速导航
- 响应式设计，适配各种设备

## 开发环境设置

### 必要条件

- Node.js (推荐 v14+)
- npm 或 yarn

### 安装依赖

```bash
npm install
# 或
yarn
```

### 开发模式运行

```bash
npm run dev
# 或
yarn dev
```

### 打包构建

```bash
npm run build
# 或
yarn build
```

## 数据文件

应用使用`ecdict.csv`文件作为数据源，该文件包含以下字段：

- word: 单词
- phonetic: 音标
- definition: 定义（英文）
- translation: 翻译（中文）
- pos: 词性
- collins/oxford: 词典收录情况
- tag: 标签
- bnc/frq: 使用频率
- exchange: 变换形式
- detail: 详细信息
- audio: 音频

## 技术栈

- React
- TypeScript
- Vite
- PapaParse (CSV解析)
- CSS3

## 后续改进方向

- 添加单词发音功能
- 实现搜索功能
- 添加学习进度追踪
- 支持用户自定义单词列表
- 添加记忆算法优化学习效率 