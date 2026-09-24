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
- Source: Deploy from a branch
- Branch: `main`
- Folder: `/ (root)`
- 不设置 Custom domain

预览地址通常为：

```text
https://lzdsg666.github.io/lzdsg-portal/
```

## 部署前检查

```bash
npm run check
npm run build
```

Pages 根目录必须包含 `index.html`、`404.html`、`styles.css`、`app.js` 和 `projects.js`。`.nojekyll` 确保静态资源不被 Jekyll 规则意外处理。`404.html` 使用 `./` 返回项目根目录，兼容 `/lzdsg-portal/` 这种 project Pages 路径。当前项目没有自定义域名文件，也不会修改 `lzdsg.top` 或 Cloudflare/DNS。
