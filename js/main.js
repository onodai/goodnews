// Hamburger menu
const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('nav');

if (toggle && nav) {
  toggle.addEventListener('click', () => {
    toggle.classList.toggle('is-active');
    nav.classList.toggle('is-open');
  });

  nav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      toggle.classList.remove('is-active');
      nav.classList.remove('is-open');
    });
  });

  nav.addEventListener('click', (e) => {
    if (e.target === nav) {
      toggle.classList.remove('is-active');
      nav.classList.remove('is-open');
    }
  });
}

// Site map
(function buildSiteMap() {
  const pathname = window.location.pathname;
  const inSub = /\/(news|archive|space)\//.test(pathname);
  const root = inSub ? '../' : '';

  function isCurrent(href) {
    const clean = href.replace(/^\.\.\//, '');
    if (clean === 'index.html' && (pathname.endsWith('/') || pathname.endsWith('/index.html'))) return true;
    return pathname.endsWith(clean);
  }

  function node(href, label, title) {
    const active = isCurrent(href) ? ' sm-active' : '';
    return `<a href="${href}" class="sm-node${active}" title="${title}">${label}</a>`;
  }

  const sections = [
    {
      label: 'AB', href: root + 'index.html', title: 'ABOUT',
      children: []
    },
    {
      label: 'NW', href: root + 'news.html', title: 'NEWS',
      children: Array.from({ length: 7 }, (_, i) => {
        const n = String(i + 1).padStart(2, '0');
        return { label: String(i + 1).padStart(2, '0'), href: root + `news/news${n}.html`, title: `NEWS ${n}` };
      })
    },
    {
      label: 'AR', href: root + 'archive.html', title: 'ARCHIVE',
      children: [
        ...[1, 2, 3, 4, 5].map(n => ({
          label: `G${n}`, href: root + `archive/gnws${String(n).padStart(3, '0')}.html`, title: `GNWS-00${n}`
        })),
        ...[1, 2, 3].map(n => ({
          label: `V${n}`, href: root + `archive/vol${String(n).padStart(3, '0')}.html`, title: `Vol.${n}`
        }))
      ]
    },
    {
      label: 'SP', href: root + 'space.html', title: 'SPACE',
      children: [
        { label: 'HW', href: root + 'space/howto.html', title: 'How to make a human' },
        { label: 'CU', href: root + 'space/cue.html', title: 'cue' },
        { label: 'CL', href: root + 'space/crossingletter.html', title: 'Crossing Letter' }
      ]
    }
  ];

  let html = '<div id="site-map"><div class="sm-top">';

  sections.forEach((section, i) => {
    if (i > 0) html += '<div class="sm-hline"></div>';
    html += '<div class="sm-col">';
    html += node(section.href, section.label, section.title);
    if (section.children.length) {
      html += '<div class="sm-vline"></div><div class="sm-sub">';
      section.children.forEach(child => {
        html += node(child.href, child.label, child.title);
      });
      html += '</div>';
    }
    html += '</div>';
  });

  html += '</div></div>';
  document.body.insertAdjacentHTML('beforeend', html);
})();
