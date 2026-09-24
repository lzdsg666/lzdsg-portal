import { ApiError, clearToken, getApiBaseUrl, getToken, request, safeErrorMessage, saveToken } from './api.js';

const body = document.body;
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('#site-nav');
const themeToggle = document.querySelector('.theme-toggle');
const clock = document.querySelector('#clock');
const projectGrid = document.querySelector('#project-grid');
const apiStatus = document.querySelector('#api-status');
const accountMessage = document.querySelector('#account-message');
const accountUser = document.querySelector('#account-user');
const authForm = document.querySelector('#auth-form');
const authError = document.querySelector('#auth-error');
const usernameField = document.querySelector('#username-field');
const modeLogin = document.querySelector('#mode-login');
const modeRegister = document.querySelector('#mode-register');
const authSubmit = document.querySelector('#auth-submit');
const logoutButton = document.querySelector('#logout-button');
let authMode = 'login';
let projects = null;

const setApiState = (state) => {
  if (!apiStatus) return;
  apiStatus.textContent = state === 'online' ? 'ONLINE' : state === 'offline' ? 'OFFLINE' : 'CHECKING';
  apiStatus.dataset.state = state;
};

const showAuthError = (error) => {
  if (!authError) return;
  authError.textContent = safeErrorMessage(error);
  authError.hidden = false;
};

const showSignedOut = (message = '登录后可使用统一账号。') => {
  if (accountMessage) {
    accountMessage.textContent = message;
    accountMessage.hidden = false;
  }
  if (accountUser) accountUser.hidden = true;
  if (authForm) authForm.hidden = false;
  if (logoutButton) logoutButton.hidden = true;
};

const showSignedIn = (user) => {
  if (accountMessage) {
    accountMessage.textContent = '已连接 LZDSG 统一账号。';
    accountMessage.hidden = false;
  }
  if (accountUser) {
    accountUser.textContent = user.displayName || user.username;
    accountUser.hidden = false;
  }
  if (authForm) authForm.hidden = true;
  if (logoutButton) logoutButton.hidden = false;
};

const checkApiAndSession = async () => {
  try {
    await request('/health', { token: null });
    setApiState('online');
  } catch {
    setApiState('offline');
    if (getToken()) {
      if (accountMessage) {
        accountMessage.textContent = '账号服务离线，已保存的登录状态暂时无法验证。';
        accountMessage.hidden = false;
      }
      if (accountUser) accountUser.hidden = true;
      if (authForm) authForm.hidden = true;
      if (logoutButton) logoutButton.hidden = false;
    } else {
      showSignedOut('账号服务暂时离线，请稍后重试。');
    }
    return;
  }

  const token = getToken();
  if (!token) {
    showSignedOut();
    return;
  }
  try {
    const result = await request('/api/v1/auth/me', { token });
    showSignedIn(result.user);
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) showSignedOut('登录状态已失效，请重新登录。');
    else showSignedOut('暂时无法验证登录状态，请稍后重试。');
  }
};

const setAuthMode = (mode) => {
  authMode = mode;
  const registering = mode === 'register';
  if (usernameField) usernameField.hidden = !registering;
  const usernameInput = authForm?.elements.namedItem('username');
  if (usernameInput) usernameInput.required = registering;
  const passwordInput = authForm?.elements.namedItem('password');
  if (passwordInput) passwordInput.autocomplete = registering ? 'new-password' : 'current-password';
  modeLogin?.setAttribute('aria-pressed', String(!registering));
  modeRegister?.setAttribute('aria-pressed', String(registering));
  if (authSubmit) authSubmit.textContent = registering ? '创建账号' : '登录';
  if (authError) authError.hidden = true;
};

modeLogin?.addEventListener('click', () => setAuthMode('login'));
modeRegister?.addEventListener('click', () => setAuthMode('register'));
authForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!(authForm instanceof HTMLFormElement)) return;
  const formData = new FormData(authForm);
  const passwordInput = authForm.elements.namedItem('password');
  const email = String(formData.get('email') || '').trim();
  const password = String(formData.get('password') || '');
  const endpoint = authMode === 'register' ? '/api/v1/auth/register' : '/api/v1/auth/login';
  const payload = authMode === 'register'
    ? { username: String(formData.get('username') || '').trim(), email, password }
    : { email, password };
  if (authSubmit) authSubmit.disabled = true;
  if (authError) authError.hidden = true;
  try {
    const result = await request(endpoint, { method: 'POST', body: payload, token: null });
    saveToken(result.token);
    showSignedIn(result.user);
  } catch (error) {
    showAuthError(error);
  } finally {
    if (passwordInput) passwordInput.value = '';
    if (authSubmit) authSubmit.disabled = false;
  }
});

logoutButton?.addEventListener('click', async () => {
  const token = getToken();
  clearToken();
  try {
    if (token) await request('/api/v1/auth/logout', { method: 'POST', token });
    showSignedOut('已退出登录。');
  } catch {
    showSignedOut('本机登录状态已清除；服务端会话暂未确认撤销。');
  }
});

if (getApiBaseUrl()) {
  void checkApiAndSession();
  setInterval(() => { void checkApiAndSession(); }, 60_000);
} else {
  setApiState('offline');
  showSignedOut('账号服务尚未配置。');
}

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
