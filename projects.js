// Public navigation data only. A null href is intentional: the destination is not live yet.
// v2: blog 已上线，转正为 LIVE；统一账号为诚实 SOON 占位，不摆假入口。
export const projects = Object.freeze([
  Object.freeze({
    id: 'network-lab', number: '01', state: 'LIVE',
    title: 'Network Lab', name: '网络实验室 · LAB.LZDSG.TOP',
    description: '工具、游戏与网络实验的浏览器实验台。',
    detail: 'LOCAL-FIRST。网络检测、开发工具、实用工具和轻量小游戏，都在这里。',
    meta: ['18 TOOLS', '4 GAMES', '⌘ PANEL'],
    href: 'https://lab.lzdsg.top', external: true,
  }),
  Object.freeze({
    id: 'blog', number: '02', state: 'LIVE',
    title: '刘子的博客', name: '记录 · 思考 · 折腾 · BLOG.LZDSG.TOP',
    description: '写代码、折腾网络、关注 AI 的地方。',
    detail: '最新文章：',
    posts: Object.freeze([
      Object.freeze({ date: '09/21', title: 'hi 你好' }),
      Object.freeze({ date: '09/17', title: 'AI 时代的个人知识管理' }),
      Object.freeze({ date: '09/17', title: '用 Next.js 16 搭建个人博客的踩坑记录' }),
    ]),
    meta: ['NEXT.JS', '4 POSTS'],
    href: 'https://blog.lzdsg.top', external: true,
  }),
  Object.freeze({
    id: 'api', number: '03', state: 'SOON',
    title: '统一账号', name: 'ONE IDENTITY · API.LZDSG.TOP',
    description: '一套身份，连接 LZDSG 的所有项目。',
    detail: '账号服务就绪后，这里会变成真正的登录入口。现在不摆点不动的假表单。',
    meta: ['SSO', '敬请期待'],
    href: null, external: false,
  }),
]);
