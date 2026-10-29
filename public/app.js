const toggle = document.querySelector('.nav-toggle');
const navigation = document.querySelector('#navigation');
if (toggle && navigation) {
  toggle.hidden = false;
  const close = () => { toggle.setAttribute('aria-expanded', 'false'); navigation.classList.remove('open'); };
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open)); navigation.classList.toggle('open', open);
  });
  navigation.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') { close(); toggle.focus(); } });
  window.matchMedia('(min-width: 761px)').addEventListener('change', close);
}
const filters = document.querySelector('.filters');
if (filters) {
  filters.hidden = false;
  filters.addEventListener('click', e => {
    const button = e.target.closest('[data-filter]');
    if (!button) return;
    filters.querySelectorAll('button').forEach(b => { b.classList.toggle('active', b === button); b.setAttribute('aria-pressed', String(b === button)); });
    document.querySelectorAll('[data-category]').forEach(section => { section.hidden = button.dataset.filter !== 'all' && section.dataset.category !== button.dataset.filter; });
  });
}
const print = document.querySelector('#print-card');
if (print) { print.hidden = false; print.addEventListener('click', () => window.print()); }
