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
