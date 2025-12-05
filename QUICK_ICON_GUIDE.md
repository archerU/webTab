# 快速生成图标指南

## 当前状态
图标配置已暂时移除，扩展现在可以正常加载。但为了更好的用户体验，建议添加图标。

## 生成图标的方法

### 方法 1：使用 HTML 工具（最简单）

1. 在浏览器中打开 `generate-icon.html`
2. 点击按钮下载三个尺寸：
   - `icon-16.png`
   - `icon-48.png`
   - `icon-128.png`
3. 将文件保存到项目根目录
4. 重新运行 `npm run build`
5. 重新加载 Chrome 扩展

### 方法 2：使用在线工具

1. 使用在线 SVG 转 PNG 工具（如 https://svgtopng.com/）
2. 上传 `icon.svg` 文件
3. 生成 16x16, 48x48, 128x128 三个尺寸
4. 下载并保存为 `icon-16.png`, `icon-48.png`, `icon-128.png`
5. 将文件放到项目根目录
6. 运行 `npm run build`
7. 更新 `manifest.json` 重新添加图标配置

### 方法 3：临时解决方案

如果您想先测试扩展，可以：
- 使用当前的配置（已移除图标）
- 扩展功能完全正常，只是没有自定义图标
- Chrome 会显示默认图标

## 添加图标后更新 manifest.json

生成图标文件后，需要在 `manifest.json` 中添加：

```json
{
  "icons": {
    "16": "icon-16.png",
    "48": "icon-48.png",
    "128": "icon-128.png"
  },
  "action": {
    "default_icon": {
      "16": "icon-16.png",
    "48": "icon-48.png",
      "128": "icon-128.png"
    },
    "default_title": "Open New Tab"
  }
}
```

## 验证

生成图标后，运行：
```bash
npm run build
```

然后在 Chrome 中重新加载扩展，图标应该会显示。

