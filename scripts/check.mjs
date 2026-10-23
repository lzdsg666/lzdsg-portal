import { readFile, stat } from 'node:fs/promises';

/* v2 contract: portal is a network overview. Structure is asserted here;
   update these markers deliberately when the design changes. */
const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const css = await readFile(new URL('../styles.css', import.meta.url), 'utf8');
const app = await readFile(new URL('../app.js', import.meta.url), 'utf8');
const api = await readFile(new URL('../api.js', import.meta.url), 'utf8');
const apiConfig = await readFile(new URL('../api-config.js', import.meta.url), 'utf8');
const data = await readFile(new URL('../projects.js', import.meta.url), 'utf8');

const required = [
  'main-content', 'project-grid', 'projects', 'account', 'auth-form', 'api-soon',
  'api-status', 'aria-live', 'aria-busy', 'styles.css', 'app.js', 'api-config.js',
  'https://lab.lzdsg.top', 'https://blog.lzdsg.top', 'id="clock"', 'aria-expanded',
  '18 tools', 'principle', 'about',
];
const missing = required.filter((value) => !html.includes(value));
if (missing.length) {
  console.error(`missing required portal markers: ${missing.join(', ')}`);
  process.exit(1);
}
const localLinks = [...html.matchAll(/href="(#[^"]+)"/g)].map((match) => match[1].slice(1));
const knownIds = new Set(['main-content', 'projects', 'blog', 'principle', 'about', 'account']);
const brokenLinks = localLinks.filter((id) => !knownIds.has(id));
if (brokenLinks.length) {
  console.error(`broken local navigation targets: ${brokenLinks.join(', ')}`);
  process.exit(1);
}
if (!html.includes('aria-expanded') || !html.includes('aria-label="菜单"')) {
  console.error('missing keyboard-accessible controls');
  process.exit(1);
}
const errorPage = await readFile(new URL('../404.html', import.meta.url), 'utf8');
if (!errorPage.includes('id="error-title"') || !errorPage.includes('href="./"')) {
  console.error('missing usable 404 page');
  process.exit(1);
}
const nojekyll = await stat(new URL('../.nojekyll', import.meta.url));
if (nojekyll.size !== 0) throw new Error('.nojekyll must remain empty');

/* Node data: live nodes must carry real addresses; not-live nodes keep null href. */
const dataRequired = ['network-lab', 'blog', 'LIVE', 'SOON', 'href: null',
  'https://lab.lzdsg.top', 'https://blog.lzdsg.top'];
const missingData = dataRequired.filter((value) => !data.includes(value));
if (missingData.length) {
  console.error(`missing node data markers: ${missingData.join(', ')}`);
  process.exit(1);
}
const cssRequired = ['@media (max-width:760px)', 'prefers-reduced-motion', 'focus-visible', 'overflow-x:hidden'];
const missingCss = cssRequired.filter((value) => !css.includes(value));
if (missingCss.length) {
  console.error(`missing responsive/accessibility markers: ${missingCss.join(', ')}`);
  process.exit(1);
}
if (!/\[hidden\]\s*\{\s*display:\s*none\s*!important;\s*\}/.test(css)) {
  console.error('hidden UI states must remain hidden despite component display rules');
  process.exit(1);
}
if (!app.includes('renderProjectError') || !app.includes('aria-busy') || !app.includes("import('./projects.js')")) {
  console.error('missing node loading/error handling');
  process.exit(1);
}
const authRequired = ['credentials: \'include\'', "cache: 'no-store'", 'authorization', 'clearToken'];
const missingAuth = authRequired.filter((value) => !api.includes(value));
if (missingAuth.length || !apiConfig.includes('https://api.lzdsg.top') || !app.includes('/api/v1/auth/me') || !app.includes("window.addEventListener('focus'") || app.includes('saveToken(')) {
  console.error(`missing API/auth safety wiring or SSO focus refresh: ${missingAuth.join(', ')}`);
  process.exit(1);
}
/* Offline honesty: when the API is unreachable the login form must yield to the soon panel. */
if (!app.includes('showApiSoon') || !html.includes('id="api-soon"')) {
  console.error('missing honest offline account state');
  process.exit(1);
}
for (const file of ['index.html', 'styles.css', 'app.js', 'api.js', 'api-config.js', 'projects.js']) {
  const info = await stat(new URL(`../${file}`, import.meta.url));
  if (info.size > 120_000) throw new Error(`${file} is unexpectedly large`);
}
if (/<(?:link|script)[^>]+(?:https?:|\/\/)/i.test(html) || /url\(https?:/i.test(css)) {
  console.error('unexpected external runtime asset detected');
  process.exit(1);
}
console.log(process.argv.includes('--build') ? 'portal build check passed' : 'portal check passed');
