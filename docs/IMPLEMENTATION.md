# LZDSG 主站实施方案

## 定位

`lzdsg.top` 是 LZDSG 个人网络/项目导航门户，首页优先展示“正在连接的项目”，不是传统博客首页。Network Lab 是当前唯一真实可用节点；Blog、Tools、Projects 和 About 先提供明确的导航位置，不伪造内容。

## 技术边界

- 第一阶段使用无构建依赖的 HTML/CSS/JavaScript 静态项目，便于 GitHub Pages 或 Cloudflare Pages 部署。
- 前端只持有公开链接和本地 UI 偏好，不保存密钥，不依赖 API。
- 未来统一登录通过独立 API 集成；本项目不修改后端数据库模型。
- 上线前必须另行确认 GitHub Pages/Cloudflare Pages 项目、域名和 DNS 变更；本阶段不部署。

## 信息架构

```text
LZDSG 首页
├── Network Lab → lab.lzdsg.top
├── Blog → 未来博客入口
├── Tools → 未来工具集合
├── Projects → LZDSG 项目索引
└── About → 网络原则与说明
```

## 后续阶段

1. 结合真实项目清单，补齐 Projects 卡片和链接。
2. 确认 Blog/Tools 的独立仓库或目录边界，不把占位入口误认为已上线功能。
3. 在独立预览环境做移动端、键盘导航、颜色对比度和性能检查。
4. 明确静态托管平台后，再准备独立部署配置和回滚方案。
5. 最后才评估是否接入统一登录；公开导航和阅读不应被登录阻断。

## 当前原型验收

- `npm run check` 和 `npm run build` 检查 Projects 数据、导航目标、viewport、键盘语义、focus-visible、reduced-motion、loading/error 状态、404 页面和静态资源大小。
- 本地 `python3 -m http.server` 已验证首页、`projects.js` 和 `404.html` 可访问。
- 页面使用 viewport meta、`@media (max-width:760px)` 和无外部字体/图片/运行时依赖，适合 Android 移动端起步。
- 当前服务器没有 Chromium/Firefox/Playwright，因此未生成真实截图；上线前应在真实 Android Chrome 和桌面浏览器做视觉回归。
