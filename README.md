# webTab - 自定义网站导航新标签页

<div align="center">

![webTab](https://img.shields.io/badge/webTab-v1.0.0-blue)
![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-green)
![License](https://img.shields.io/badge/license-MIT-orange)

**一款功能强大的 Chrome 新标签页扩展，让您完全自定义网站导航体验**

[功能特性](#-核心功能) • [快速开始](#-快速开始) • [使用指南](#-使用指南) • [隐私政策](./PRIVACY_POLICY.md)

</div>

---

## 📖 简介

webTab 是一款专为 Chrome 浏览器设计的新标签页扩展，主要功能是**自定义网站导航**。告别默认的空白标签页，创建一个高效、美观、个性化的导航中心，让您快速访问常用网站。

### 为什么选择 webTab？

- 🎯 **专注导航** - 专为网站导航设计，简单高效
- 🎨 **完全自定义** - 按您的需求组织网站，打造专属导航
- 🔒 **隐私安全** - 所有数据本地存储，不上传服务器
- 🌍 **双语支持** - 完整支持中文和英文
- ⚡ **轻量快速** - 占用资源少，启动速度快

## ✨ 核心功能

### 🎯 自定义网站导航

- **快速添加网站**：将常用网站添加到新标签页，一键直达
- **智能分类管理**：创建多个分类（如"工作"、"娱乐"、"学习"）来组织网站
- **拖拽排序**：通过拖拽自由调整分类和快捷方式的顺序
- **跨分类移动**：轻松将快捷方式在不同分类间移动

### 🎨 个性化定制

- **自定义图标**：
  - 自动获取网站 favicon
  - 上传自定义图片（最大 2MB）
  - 选择纯色背景显示首字母
- **背景图片**：设置个性化背景
- **毛玻璃效果**：现代化界面设计

### 💾 数据管理

- **本地存储**：数据安全存储在设备本地
- **Google 同步**：登录 Google 账号后自动同步到云端
- **导入/导出**：支持配置备份和恢复

### 🌍 国际化

- 完整支持中文和英文
- 自动语言检测
- 一键切换语言

## 🚀 快速开始

### 安装

1. 从 [Chrome Web Store](https://chrome.google.com/webstore) 安装（即将上架）
2. 或从源码构建：
   ```bash
   git clone https://github.com/archerU/webTab.git
   cd webTab
   npm install
   npm run build
   ```
3. 在 Chrome 中加载 `dist` 文件夹

### 使用

1. 打开新标签页
2. 点击分类中的 "+" 按钮添加快捷方式
3. 在设置中管理分类和配置

## 📖 使用指南

### 添加快捷方式

1. 点击任意分类中的 "+" 按钮
2. 输入网站名称和 URL
3. 选择图标模式（自动获取/上传/颜色）
4. 点击"添加快捷方式"

### 管理分类

1. 点击右上角设置按钮
2. 在"分类"部分：
   - 点击编辑按钮修改分类名称
   - 点击删除按钮删除分类
   - 使用表单添加新分类

### 导入/导出配置

1. 打开设置页面
2. 点击"导出配置"备份数据
3. 点击"导入配置"恢复之前的备份

### 切换语言

- 点击顶部右侧的地球图标按钮
- 或在设置中选择语言

## 🛠️ 开发

### 技术栈

- **React 19** - UI 框架
- **TypeScript** - 类型安全
- **Vite** - 构建工具
- **Tailwind CSS** - 样式框架
- **Chrome Extension API** - 扩展功能

### 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 打包扩展
npm run package
```

### 项目结构

```
webTab/
├── components/          # React 组件
├── services/           # 业务逻辑（存储服务等）
├── contexts/           # React Context
├── types.ts            # TypeScript 类型定义
├── constants.ts        # 常量配置
├── i18n.ts             # 国际化配置
├── manifest.json       # Chrome 扩展配置
└── vite.config.ts      # Vite 配置
```

## 📝 功能列表

- ✅ 自定义网站导航
- ✅ 分类管理
- ✅ 拖拽排序
- ✅ 自定义图标
- ✅ 背景图片设置
- ✅ 中英文双语支持
- ✅ Google 账号同步
- ✅ 配置导入/导出
- ✅ 数据本地存储
- ✅ 隐私保护

## 🔒 隐私保护

- ✅ 不收集任何个人信息
- ✅ 不追踪用户行为
- ✅ 不使用第三方分析服务
- ✅ 所有数据仅存储在您的设备或 Google 账号中

详细隐私政策请查看 [PRIVACY_POLICY.md](./PRIVACY_POLICY.md)

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📧 联系方式

- GitHub: [https://github.com/archerU/webTab](https://github.com/archerU/webTab)
- Issues: [https://github.com/archerU/webTab/issues](https://github.com/archerU/webTab/issues)

---

<div align="center">

**让您的浏览器导航更高效、更个性化！**

Made with ❤️ by [archerU](https://github.com/archerU)

</div>
