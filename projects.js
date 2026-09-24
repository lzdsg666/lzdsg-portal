// Public navigation data only. A null href is intentional: the destination is not live yet.
export const projects = Object.freeze([
  Object.freeze({ id: 'network-lab', number: '01', state: 'LIVE', title: 'Network Lab', description: '网络工具与实验场', detail: '网络检测、开发工具、实用工具和轻量小游戏。', href: 'https://lab.lzdsg.top', external: true }),
  Object.freeze({ id: 'blog', number: '02', state: 'SOON', title: 'Blog', description: '记录思考与构建过程', detail: '博客入口尚未上线，暂不提供虚构地址。', href: null, external: false }),
  Object.freeze({ id: 'tools', number: '03', state: 'SOON', title: 'Tools', description: '可复用的小工具集合', detail: '工具集合正在规划中，当前请访问 Network Lab。', href: null, external: false }),
  Object.freeze({ id: 'projects', number: '04', state: 'INDEX', title: 'Projects', description: 'LZDSG 项目索引', detail: '更多项目将在有真实地址后加入。', href: null, external: false }),
  Object.freeze({ id: 'about', number: '05', state: 'INFO', title: 'About', description: '关于这个网络', detail: '了解 LZDSG 的原则和连接方式。', href: null, external: false })
]);
