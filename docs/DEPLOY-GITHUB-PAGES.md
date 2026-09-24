# GitHub Pages 临时预览

本项目是纯静态站点，不需要构建工具或运行时服务。

## 推荐创建方式

在 GitHub 账号 `lzdsg666` 下新建一个全新的公开仓库，例如 `lzdsg-portal`；不要复用或覆盖 `lzdsg-network-lab`。

创建后，在本地执行：

```bash
git remote add origin https://github.com/lzdsg666/lzdsg-portal.git
git push -u origin main
```

然后在 GitHub 仓库设置中选择：

- Settings → Pages
- Source: GitHub Actions
- Workflow: `.github/workflows/pages.yml`
- Custom domain: `lzdsg.top`（仓库根目录 `CNAME`）

预览地址通常为：

```text
https://lzdsg666.github.io/lzdsg-portal/
```

## 部署前检查

```bash
npm run check
npm run build
```

Pages 根目录必须包含 `index.html`、`404.html`、`styles.css`、`app.js`、`api.js`、`api-config.js` 和 `projects.js`。`.nojekyll` 确保静态资源不被 Jekyll 规则意外处理。`api-config.js` 是浏览器可见的公开配置，当前 API 地址为 `https://api.lzdsg.top`；严禁在此文件放入密码、Token 或其他 Secret。认证使用现有 API 的 bearer session，浏览器只持久化 session token，所有请求设置 `cache: no-store` 并禁用 cookie credentials。
