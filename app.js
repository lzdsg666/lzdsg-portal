const body = document.body;
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('#site-nav');
const themeToggle = document.querySelector('.theme-toggle');
const clock = document.querySelector('#clock');
const projectGrid = document.querySelector('#project-grid');
let projects = null;

const createProjectCard = (project) => {
  const card = document.createElement(project.href ? 'a' : 'article');
  card.className = `project-card reveal${project.href ? ' project-card-live' : ' project-card-placeholder'}`;
  if (project.id === 'tools') card.id = 'tools';
  if (project.href) {
    card.href = project.href;
    if (project.external) {
      card.target = '_blank';
      card.rel = 'noreferrer';
    }
    card.setAttribute('aria-label', `${project.title}，打开项目`);
  } else {
    card.setAttribute('aria-disabled', 'true');
  }
  const number = document.createElement('span');
  number.className = 'project-number';
  number.textContent = project.number;
  const state = document.createElement('span');
  state.className = 'project-state';
  state.textContent = project.state;
  const title = document.createElement('h3');
  title.textContent = project.title;
  const description = document.createElement('p');
  description.textContent = project.description;
  const detail = document.createElement('small');
  detail.className = 'project-detail';
  detail.textContent = project.detail;
  const arrow = document.createElement('span');
  arrow.className = 'project-arrow';
  arrow.textContent = project.href ? '↗' : '—';
  card.append(number, state, title, description, detail, arrow);
  return card;
};

const renderProjects = () => {
  if (!projectGrid) return;
  projectGrid.replaceChildren(...projects.map(createProjectCard));
  projectGrid.setAttribute('aria-busy', 'false');
  projectGrid.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
};

const renderProjectError = () => {
  if (!projectGrid) return;
  projectGrid.replaceChildren();
  const error = document.createElement('p');
  error.className = 'project-state-message project-state-error';
  error.setAttribute('role', 'alert');
  error.textContent = '项目索引暂时无法加载，请稍后重试。';
  projectGrid.append(error);
  projectGrid.setAttribute('aria-busy', 'false');
};

menuToggle?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
});

nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuToggle?.setAttribute('aria-expanded', 'false');
}));

const savedTheme = localStorage.getItem('lzdsg-theme');
if (savedTheme === 'light') body.classList.add('light');
themeToggle?.addEventListener('click', () => {
  const light = body.classList.toggle('light');
  localStorage.setItem('lzdsg-theme', light ? 'light' : 'dark');
  themeToggle.setAttribute('aria-pressed', String(light));
});

const updateClock = () => {
  if (clock) clock.textContent = `${new Date().toISOString().slice(11, 19)} UTC`;
};
updateClock();
setInterval(updateClock, 1000);

const observer = 'IntersectionObserver' in window
  ? new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .12 })
  : { observe: (element) => element.classList.add('is-visible'), unobserve: () => {} };
document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

import('./projects.js')
  .then((module) => {
    projects = module.projects;
    renderProjects();
  })
  .catch((error) => {
    console.error('project index failed to load', error);
    renderProjectError();
  });
