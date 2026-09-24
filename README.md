# LZDSG Portal

LZDSG 个人网络/项目导航门户的独立静态前端原型。

## 当前范围

- 移动端优先的首页导航布局。
- Network Lab 真实链接到 `https://lab.lzdsg.top`。
- Blog、Tools、Projects、About 导航占位，明确标记未来状态。
- 轻量主题切换、移动端菜单、滚动进入效果和 UTC 时钟。
- Projects 数据集中在 `projects.js`；只有 Network Lab 有真实地址，其余项目明确显示占位状态。
- 具备项目索引 loading/error 状态和独立 `404.html`。
- 不依赖 LZDSG API，不包含登录，不修改任何后端数据模型。

## 本地预览

```bash
npm run check
python3 -m http.server 4173
```

打开 `http://127.0.0.1:4173/`。这是未部署原型；不会修改线上 `lzdsg.top`、`lab.lzdsg.top`、Cloudflare 或 DNS。

## 结构

```text
index.html       页面语义结构与导航
styles.css       移动优先视觉系统与响应式布局
projects.js      Projects 公共导航数据
app.js           菜单、主题、时钟、项目渲染和轻量滚动交互
404.html         静态托管下的错误页
scripts/check.mjs 静态结构检查
```
