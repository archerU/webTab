# Chrome Web Store 发布指南

## 准备工作

### 1. 打包扩展

首先，确保已经构建了扩展：

```bash
npm run build
```

这会在 `dist` 目录生成所有需要的文件。

### 2. 准备发布包

将 `dist` 目录打包成 `.zip` 文件（不要包含 `dist` 文件夹本身，只包含里面的内容）：

**macOS/Linux:**
```bash
cd dist
zip -r ../webTab-extension.zip .
cd ..
```

**Windows (PowerShell):**
```powershell
Compress-Archive -Path dist\* -DestinationPath webTab-extension.zip
```

或者手动：
1. 进入 `dist` 文件夹
2. 选择所有文件（包括 assets、icon-*.png、index.html、manifest.json、background.js）
3. 右键 → 压缩/创建 ZIP 文件
4. 命名为 `webTab-extension.zip`

## 发布步骤

### 第一步：注册 Chrome Web Store 开发者账号

1. 访问 [Chrome Web Store 开发者控制台](https://chrome.google.com/webstore/devconsole)
2. 使用 Google 账号登录
3. 支付一次性注册费用 **$5 USD**
4. 完成开发者账号注册

### 第二步：上传扩展

1. 登录 [Chrome Web Store 开发者控制台](https://chrome.google.com/webstore/devconsole)
2. 点击左侧的 **"新增项目"** (New Item) 按钮
3. 点击 **"选择文件"** 上传 `webTab-extension.zip`
4. 等待上传完成

### 第三步：填写商店信息

#### 基本信息

- **名称**：`webTab`
- **摘要**（简短描述，最多 132 个字符）：
  ```
  A beautiful, customizable New Tab page with quick links, categories, and modern design.
  ```
- **详细说明**（完整描述，最多 132,000 个字符）：

```
webTab 是一个美观、可自定义的新标签页扩展，让您的浏览器主页更加个性化和高效。

主要功能：
- 🎨 美观的现代化界面设计
- 📁 分类管理快捷方式
- 🔍 快速搜索功能
- 🎯 拖拽排序和移动快捷方式
- 🌟 毛玻璃效果 UI
- 💾 本地存储所有设置

使用方法：
1. 安装扩展后，打开新标签页即可看到 webTab
2. 点击设置图标添加分类和快捷方式
3. 拖拽图标可以重新排序
4. 点击图标可以在新标签页打开网站

让您的新标签页更加美观实用！
```

#### 分类

- 选择：**生产力工具** (Productivity) 或 **工具** (Utilities)

#### 语言

- 选择：**中文（简体）** 和 **English**

#### 隐私权实践

需要填写隐私权实践说明。对于 webTab：

```
隐私权实践：

数据收集：
- webTab 只使用 Chrome 的本地存储 API 保存您的设置和快捷方式
- 所有数据都存储在您的本地浏览器中，不会上传到任何服务器

数据使用：
- 您的快捷方式、分类和设置仅用于在本地显示和管理
- 不会与第三方共享任何数据

外部服务：
- 如果配置了 Gemini API 密钥，会使用 Google Gemini API 生成个性化问候
- API 密钥仅在本地使用，不会上传到我们的服务器

数据安全：
- 所有数据仅存储在您的浏览器本地，您可以随时清除
```

#### 商店详情

- **小图标** (16x16)：使用 `icon-16.png`
- **促销图片** (440x280)：可选，用于商店展示
- **屏幕截图**：
  - 最小：1280x800 或 640x400
  - 推荐：至少 3-5 张截图展示功能
- **单张促销图片** (920x680)：可选

#### 可见性

- **公开发布**：任何人都可以在 Chrome Web Store 中找到
- **不公开**：只能通过链接访问
- **受信任的测试人员**：仅限测试人员使用

建议首次发布选择 **"不公开"**，测试无误后再改为公开。

### 第四步：提交审核

1. 填写完所有信息后，点击 **"提交审核"** (Submit for Review)
2. 审核通常需要 1-3 个工作日
3. 审核通过后，扩展会出现在 Chrome Web Store 中

## 审核注意事项

### 常见被拒绝的原因

1. **隐私权政策缺失**：如果使用任何外部 API，需要提供隐私权政策 URL
2. **权限说明不清**：确保权限使用合理并有说明
3. **功能描述不准确**：确保描述与实际功能一致
4. **截图质量**：确保截图清晰，展示实际功能

### webTab 需要的权限说明

- **storage**：用于本地保存用户的快捷方式和设置
- **host_permissions: <all_urls>**：用于获取网站 favicon（如果需要，可以限制为特定域名）

### 隐私权政策

如果扩展使用外部服务（如 Gemini API），建议创建隐私权政策页面：

1. 在 GitHub Pages 或其他托管服务创建页面
2. 在商店信息中添加隐私权政策链接

## 更新扩展

1. 修改代码后，运行 `npm run build` 重新构建
2. 更新 `manifest.json` 中的版本号（如：1.0.0 → 1.0.1）
3. 重新打包 `dist` 目录为 ZIP
4. 在开发者控制台中选择现有扩展
5. 点击 **"上传新版本"**
6. 上传新的 ZIP 文件并说明更新内容
7. 提交审核

## 版本号管理

每次更新都需要修改 `manifest.json` 中的版本号：

```json
{
  "version": "1.0.1"  // 更新版本号
}
```

遵循语义化版本：
- **主版本号**（1.x.x）：重大更改
- **次版本号**（x.1.x）：新功能
- **修订号**（x.x.1）：bug 修复

## 商店优化建议

1. **截图**：展示实际使用效果
2. **描述**：清晰说明功能和使用方法
3. **关键词**：在描述中包含相关关键词（新标签页、自定义、快捷方式等）
4. **评分**：鼓励用户评分和反馈

## 检查清单

发布前请确认：

- [ ] 扩展已构建（`npm run build`）
- [ ] 版本号已更新
- [ ] 所有图标文件存在（16x16, 48x48, 128x128）
- [ ] manifest.json 配置正确
- [ ] 扩展在本地测试正常
- [ ] 已准备好 ZIP 包
- [ ] 已准备好商店截图
- [ ] 已准备好详细描述
- [ ] 已准备好隐私权政策（如需要）

## 参考链接

- [Chrome Web Store 开发者文档](https://developer.chrome.com/docs/webstore/)
- [开发者控制台](https://chrome.google.com/webstore/devconsole)
- [审核政策](https://developer.chrome.com/docs/webstore/program-policies/)

## 快速命令

```bash
# 1. 构建扩展
npm run build

# 2. 打包发布（macOS/Linux）
cd dist && zip -r ../webTab-extension.zip . && cd ..

# 3. 上传 webTab-extension.zip 到 Chrome Web Store
```

祝发布顺利！🎉

