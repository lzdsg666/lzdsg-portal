# LZDSG Portal

LZDSG 个人网络/项目导航门户的独立静态前端原型。

## 当前范围

- 移动端优先的首页导航布局。
- Network Lab 真实链接到 `https://lab.lzdsg.top`。
- Blog、Tools、Projects、About 导航占位，明确标记未来状态。
- 轻量主题切换、移动端菜单、滚动进入效果和 UTC 时钟。
- 通过 `api-config.js` 连接统一 API，首页显示真实在线状态，提供注册、登录、登出和当前账号状态。
- 仅在浏览器本地保存 bearer session token；请求使用 `no-store` 和 `credentials: omit`，服务端 `/me` 验证登录状态。
- Projects 数据集中在 `projects.js`；只有 Network Lab 有真实地址，其余项目明确显示占位状态。
- 具备项目索引 loading/error 状态和独立 `404.html`。
- 使用现有 LZDSG API，不创建账号相关数据库表或改动数据模型。

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
api-config.js    可公开的 API 地址配置，不含密钥
api.js           API 请求、bearer token 存储和错误状态
app.js           菜单、主题、账号状态、项目渲染和轻量滚动交互
404.html         静态托管下的错误页
scripts/check.mjs 静态结构检查
tests/           API 客户端安全和错误处理测试
```
