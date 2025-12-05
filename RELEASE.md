# GitHub Release 指南

## 创建 Release 的步骤

### 1. 准备发布

确保所有更改已提交并推送到 GitHub：

```bash
git add .
git commit -m "Prepare for release v1.0.0"
git push origin main
```

### 2. 更新版本号

更新 `manifest.json` 和 `package.json` 中的版本号（如果需要）。

### 3. 构建扩展

```bash
npm run build
npm run package
```

这将创建 `webTab-extension.zip` 文件。

### 4. 创建 Git Tag

```bash
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0
```

### 5. 在 GitHub 上创建 Release

#### 方法一：使用 GitHub Web 界面

1. 访问：`https://github.com/archerU/webTab/releases/new`
2. 选择标签：`v1.0.0`
3. 标题：`Release v1.0.0`
4. 描述：复制 `.github/release-template.md` 的内容
5. 上传文件：上传 `webTab-extension.zip`
6. 点击"发布版本"

#### 方法二：使用 GitHub CLI

```bash
gh release create v1.0.0 \
  --title "Release v1.0.0" \
  --notes-file .github/release-template.md \
  webTab-extension.zip
```

### 6. 自动发布（使用 GitHub Actions）

如果设置了 GitHub Actions workflow，推送 tag 后会自动创建 release：

```bash
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0
```

## Release 模板内容

Release 说明应包含：

- ✨ 新功能
- 🐛 修复的问题
- 🔧 技术改进
- 📦 安装说明
- 📝 使用说明

## 版本号规范

遵循 [语义化版本](https://semver.org/)：

- **主版本号**：不兼容的 API 修改
- **次版本号**：向下兼容的功能性新增
- **修订号**：向下兼容的问题修正

示例：
- `v1.0.0` - 首次发布
- `v1.1.0` - 新增功能
- `v1.0.1` - 修复问题
- `v2.0.0` - 重大更新

