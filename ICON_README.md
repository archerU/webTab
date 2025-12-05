# webTab 扩展图标生成说明

## 方法 1：使用 HTML 工具生成（推荐）

1. 在浏览器中打开 `generate-icon.html`
2. 点击相应的按钮下载所需尺寸的图标：
   - 16x16 (用于浏览器工具栏)
   - 48x48 (用于扩展管理页面)
   - 128x128 (用于 Chrome Web Store)
3. 将下载的图标文件保存到项目根目录：
   - `icon-16.png`
   - `icon-48.png`
   - `icon-128.png`

## 方法 2：使用 SVG 图标

已经创建了 `icon.svg` 文件，您可以：
1. 使用在线工具将 SVG 转换为 PNG（如 https://svgtopng.com/）
2. 或使用 ImageMagick 命令行工具：
   ```bash
   convert icon.svg -resize 16x16 icon-16.png
   convert icon.svg -resize 48x48 icon-48.png
   convert icon.svg -resize 128x128 icon-128.png
   ```

## 图标说明

图标设计包含：
- 渐变背景（紫色到靛蓝色）
- 毛玻璃效果的标签页窗口
- 网格布局（代表快捷方式）
- "W" 字母（代表 webTab）

## 更新 manifest.json

生成图标后，manifest.json 会自动配置图标路径。

