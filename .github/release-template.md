# Release v1.0.0

## 🎉 首次发布 (Initial Release)

### ✨ 主要功能

#### 🌍 国际化支持
- 完整的中英文双语支持
- 自动检测浏览器语言
- 顶部快速语言切换按钮
- 所有界面文本均已本地化

#### 🎨 自定义图标功能
- **自动获取**：从网站自动获取 favicon
- **上传图标**：支持上传自定义图片（最大 2MB）
- **颜色选择**：选择纯色背景显示首字母
- 实时图标预览

#### 📁 分类管理
- 创建和管理多个分类
- 拖拽排序快捷方式
- 跨分类移动快捷方式
- 删除分类和快捷方式

#### 🎯 快捷方式管理
- 添加、编辑、删除快捷方式
- 自定义名称和 URL
- 自动 URL 格式化
- 在新标签页打开链接

### 🐛 修复
- 修复了页面黑屏问题
- 修复了图标显示错误
- 改进了错误处理
- 优化了数据加载逻辑

### 🔧 技术改进
- 使用 React Context API 实现语言管理
- 添加了 ErrorBoundary 错误边界
- 改进了 localStorage 错误处理
- 符合 Chrome Extension Manifest V3 规范

### 📦 安装

#### 从源码构建
```bash
git clone https://github.com/archerU/webTab.git
cd webTab
npm install
npm run build
```

然后在 Chrome 中加载 `dist` 文件夹。

#### 使用打包文件
下载 `webTab-extension.zip`，解压后在 Chrome 中加载。

### 📝 使用说明

1. **添加快捷方式**：点击分类中的 "+" 按钮
2. **管理分类**：点击右上角设置按钮
3. **切换语言**：点击顶部右侧的地球图标按钮
4. **打开新标签页**：点击扩展图标

### 🎨 特性

- 🎨 美观的界面：毛玻璃效果、流畅动画
- 🚀 快速访问：一键打开常用网站
- 📱 响应式设计：适配各种屏幕尺寸
- 🔒 隐私保护：所有数据存储在本地
- ⚡ 性能优化：快速加载，流畅体验

### 📋 系统要求

- Chrome 浏览器 88+ 或基于 Chromium 的浏览器
- 支持 Manifest V3

---

**完整更新日志**：[查看详情](https://github.com/archerU/webTab/blob/main/RELEASE_NOTES.md)

