// Hamburger menu
const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('nav');

if (toggle && nav) {
  function closeMenu() {
    toggle.classList.remove('is-active');
    nav.classList.remove('is-open');
    document.body.classList.remove('nav-open', 'map-menu');
  }

  toggle.addEventListener('click', () => {
    if (document.body.classList.contains('nav-open')) {
      closeMenu();
      return;
    }
    toggle.classList.add('is-active');
    nav.classList.add('is-open');
    document.body.classList.add('nav-open');
    // マップのあるページでは、開いた直後はテキストメニューを表示する
    if (!document.body.classList.contains('no-map')) {
      document.body.classList.add('map-menu');
    }
  });

  nav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', closeMenu);
  });

  nav.addEventListener('click', (e) => {
    if (e.target === nav) closeMenu();
  });
}

// Site map
(function buildSiteMap() {
  // body.no-map のページではカラー丸とランダム遷移を使わない
  if (document.body.classList.contains('no-map')) return;

  const inSub = /\/(news|archive|space)\//.test(window.location.pathname);
  const root = inSub ? '../' : '';

  // URLは .html なしで扱う（'' はトップページ）
  const pages = [
    '', 'news', 'archive', 'space',
    ...Array.from({ length: 7 }, (_, i) => `news/news${String(i + 1).padStart(2, '0')}`),
    ...[1, 2, 3, 4, 5].map(n => `archive/gnws${String(n).padStart(3, '0')}`),
    ...[1, 2, 3].map(n => `archive/vol${String(n).padStart(3, '0')}`),
    'space/howto', 'space/cue', 'space/crossingletter'
  ];
  const colors = ['#FF0000', '#0000FF', '#00A000', '#FFFFFF', '#FFE600'];
  const STORAGE_KEY = 'gn-map-dots';

  function loadDots() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch (e) {
      return [];
    }
  }

  function saveDots(dots) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dots));
    } catch (e) {}
  }

  function drawDot(box, dot) {
    const el = document.createElement('span');
    el.className = 'sm-dot';
    el.style.left = (dot.x * 100) + '%';
    el.style.top = (dot.y * 100) + '%';
    el.style.background = dot.c;
    box.appendChild(el);
  }

  function isCurrent(page) {
    // /news.html と /news、/index.html と / を同じページとして扱う
    const pathname = window.location.pathname.replace(/\.html$/, '').replace(/\/index$/, '/');
    if (page === '') return pathname.endsWith('/') && !inSub;
    return pathname.endsWith('/' + page);
  }

  const box = document.createElement('div');
  box.id = 'site-map';
  box.innerHTML = '<span class="sm-label">T</span>';
  document.body.appendChild(box);

  // PC: 右下の青丸でぼかしレイヤーを開閉する
  const trigger = document.createElement('button');
  trigger.className = 'sm-trigger';
  trigger.setAttribute('aria-label', 'マップ');
  trigger.addEventListener('click', () => {
    document.body.classList.toggle('map-open');
  });
  document.body.appendChild(trigger);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') document.body.classList.remove('map-open');
  });

  const dots = loadDots();
  dots.forEach(dot => drawDot(box, dot));

  // モバイル: 「T」でカラー丸とテキストメニューを切り替える（メニュー表示中は青丸になる）
  box.querySelector('.sm-label').addEventListener('click', (e) => {
    e.stopPropagation();
    document.body.classList.toggle('map-menu');
  });

  box.addEventListener('click', (e) => {
    if (document.body.classList.contains('map-menu')) return;
    const rect = box.getBoundingClientRect();
    const dot = {
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
      c: colors[Math.floor(Math.random() * colors.length)]
    };
    drawDot(box, dot);
    dots.push(dot);
    saveDots(dots);

    const candidates = pages.filter(p => !isCurrent(p));
    const next = candidates[Math.floor(Math.random() * candidates.length)];
    window.location.href = (root + next) || './';
  });
})();
