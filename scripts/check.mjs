import { readFile, stat } from 'node:fs/promises';

const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const css = await readFile(new URL('../styles.css', import.meta.url), 'utf8');
const app = await readFile(new URL('../app.js', import.meta.url), 'utf8');
const data = await readFile(new URL('../projects.js', import.meta.url), 'utf8');
const required = ['main-content', 'network-lab', 'projects', 'tools', 'blog', 'about', 'project-grid', 'https://lab.lzdsg.top', 'styles.css', 'app.js', 'aria-live', 'aria-busy'];
const missing = required.filter((value) => !html.includes(value));
if (missing.length) {
  console.error(`missing required portal markers: ${missing.join(', ')}`);
  process.exit(1);
}
const localLinks = [...html.matchAll(/href="(#[^"]+)"/g)].map((match) => match[1].slice(1));
const knownIds = new Set(['main-content', 'network-lab', 'projects', 'tools', 'blog', 'about']);
const brokenLinks = localLinks.filter((id) => !knownIds.has(id));
if (brokenLinks.length) {
  console.error(`broken local navigation targets: ${brokenLinks.join(', ')}`);
  process.exit(1);
}
if (!html.includes('aria-expanded') || !html.includes('aria-label="切换色彩主题"')) {
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
const dataRequired = ['network-lab', 'Blog', 'Tools', 'Projects', 'About', 'href: null'];
const missingData = dataRequired.filter((value) => !data.includes(value));
if (missingData.length) {
  console.error(`missing project data markers: ${missingData.join(', ')}`);
  process.exit(1);
}
const cssRequired = ['@media (max-width:760px)', 'prefers-reduced-motion', 'focus-visible', 'overflow-x:hidden'];
const missingCss = cssRequired.filter((value) => !css.includes(value));
if (missingCss.length) {
  console.error(`missing responsive/accessibility markers: ${missingCss.join(', ')}`);
  process.exit(1);
}
if (!app.includes('renderProjectError') || !app.includes('aria-busy') || !app.includes("import('./projects.js')")) {
  console.error('missing project loading/error handling');
  process.exit(1);
}
for (const file of ['index.html', 'styles.css', 'app.js', 'projects.js']) {
  const info = await stat(new URL(`../${file}`, import.meta.url));
  if (info.size > 120_000) throw new Error(`${file} is unexpectedly large`);
}
if (/<(?:link|script)[^>]+(?:https?:|\/\/)/i.test(html) || /url\(https?:/i.test(css)) {
  console.error('unexpected external runtime asset detected');
  process.exit(1);
}
console.log(process.argv.includes('--build') ? 'portal build check passed' : 'portal check passed');
