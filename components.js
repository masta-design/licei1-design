/* ============================================================
   ШАБЛОНЫ КОМПОНЕНТОВ: функции, которые возвращают разметку. Подключается в <head> до layout.js.
   Правило: у компонента одна разметка — она живёт здесь, и все страницы берут её отсюда.
   Тогда новый экземпляр (на другой странице, дорисованный скриптом) сразу выглядит и ведёт себя как оригинал:
   стили — в site.css, поведение (ховеры, наклон, блик) — в site.js через делегирование на document.
   В CMS эти шаблоны станут серверными (шаблонизатор), разметка — та же
   ============================================================ */

const MONTHS = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];

/* экранирование текста для вставки в HTML */
const esc = t => String(t).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
/* '2026-10-13' → '13 октября 2026' */
const fmtDate = iso => { const [y, m, d] = iso.split('-').map(Number); return `${d} ${MONTHS[m - 1]} ${y}`; };
/* '8 (38822) 2-43-81' → 'tel:+73882224381' */
const telHref = v => { let d = v.replace(/\D/g, ''); if (d[0] === '8') d = '7' + d.slice(1); return 'tel:+' + d; };

/* --- Соцсети: ссылки-иконки. mono — для подвала: там иконка одноцветная, силуэт задаётся маской --m --- */
const socialsHTML = (list, { mono = false } = {}) => list.map(s =>
  `<a href="${s.href}" aria-label="${esc(s.t)}"${mono ? ` style="--m: url(${s.mono})"` : ''}><img src="${s.icon}" alt=""></a>`).join('');

/* --- Карточка новости (site.css → «11. Новости»).
       n — запись из NEWS (news-data.js): { id, date, title, text?, img? }.
       featured — крупная (на главной первая; в списке — какие решает site.js); lazy — ленивая загрузка картинки;
       level — уровень заголовка по структуре страницы: 3 под заголовком секции (по умолчанию), 2 в списке под h1 страницы.
       Вид от уровня не зависит — его задаёт класс .card-title.
       Анонс выводится всегда: у маленьких карточек его скрывает CSS, а в списке новостей карточка может стать крупной --- */
const newsHref = n => typeof ARTICLES !== 'undefined' && ARTICLES[n.id] ? `news-item.html?id=${n.id}` : '#';   // страницы есть пока у первых 10 новостей
const newsCard = (n, { featured = false, lazy = false, level = 3 } = {}) => `<a class="news-card${featured ? ' news-card--featured' : ''} card" href="${newsHref(n)}">
    <div class="thumb">${n.img ? `<img src="${n.img}" alt=""${lazy ? ' loading="lazy"' : ''}>` : ''}</div>
    <div class="body"><h${level} class="card-title">${esc(n.title)}</h${level}>${n.text ? `<p>${esc(n.text)}</p>` : ''}<time datetime="${n.date}">${fmtDate(n.date)}</time></div>
  </a>`;

/* --- Пагинация (site.css → «14. Пагинация») по Контур.Гайдам (guides.kontur.ru/components/navigation/paging/):
       — одна страница — пейджинг не показываем;
       — до 7 страниц — все номера; больше — первая и последняя плюс по две соседние с текущей, пропуски — «…»;
       — многоточие никогда не прячет одну страницу (поэтому на 5-й с начала/конца — 1–7 … 30, а при 8 страницах на 4-й — все 8);
       — «Назад» нет, «Дальше» — в конце, на последней странице неактивна;
       — под текущей — подсказка о горячих клавишах Ctrl ← / Ctrl → (на Mac — ⌥).
       Клавиатура: Tab попадает на текущую страницу, ← → двигают фокус по номерам, Ctrl+← / Ctrl+→ листают страницы.
       el — пустой <nav class="pager">; href(p) — адрес страницы p --- */
function pager(el, { page, pages, href }) {
  if (pages < 2) { el.remove(); return; }
  const left = Math.max(Math.min(page - 2, pages - 4), 1);
  const right = Math.min(Math.max(5, page + 2), pages);
  const from = left > 3 ? left : 1, to = right < pages - 2 ? right : pages;   // «…» — только если за ним хотя бы 2 страницы
  const nums = [];   // 0 — многоточие
  if (from > 1) nums.push(1, 0);
  for (let p = from; p <= to; p++) nums.push(p);
  if (to < pages) nums.push(0, pages);

  const mac = /Mac|iPhone|iPad/.test(navigator.platform);
  const key = mac ? '⌥' : 'Ctrl';
  const hint = (page > 1 ? '← ' : '') + key + (page < pages ? ' →' : '');
  const next = `<span class="pager-next-label">Дальше</span><i class="i i-right" aria-hidden="true"></i>`;
  el.innerHTML = '<ol>'
    + nums.map(p => !p ? '<li class="pager-gap" aria-hidden="true">…</li>'
      : p === page ? `<li class="pager-current"><a class="pager-item" href="${href(p)}" aria-current="page" aria-label="Страница ${p}, текущая">${p}</a><span class="pager-hint" aria-hidden="true">${hint}</span></li>`
      : `<li><a class="pager-item" href="${href(p)}" aria-label="Страница ${p}">${p}</a></li>`).join('')
    + (page < pages
      ? `<li><a class="btn btn-secondary pager-next" href="${href(page + 1)}" rel="next">${next}</a></li>`
      : `<li><a class="btn btn-secondary pager-next" role="link" aria-disabled="true">${next}</a></li>`)
    + '</ol>';

  const items = [...el.querySelectorAll('a[href]')];
  items.forEach(a => { a.tabIndex = a.getAttribute('aria-current') ? 0 : -1; });
  el.addEventListener('keydown', e => {
    if (e.ctrlKey || e.altKey || e.metaKey || (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight')) return;
    const i = items.indexOf(document.activeElement);
    if (i < 0) return;
    e.preventDefault();
    items[Math.min(Math.max(i + (e.key === 'ArrowRight' ? 1 : -1), 0), items.length - 1)].focus();
  });
  // горячие клавиши — на всей странице (пейджинг на ней один), кроме полей ввода
  document.addEventListener('keydown', e => {
    if (!(mac ? e.altKey : e.ctrlKey) || e.shiftKey || e.metaKey || (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight')) return;
    if (e.target.closest('input, textarea, select, [contenteditable]')) return;
    const p = page + (e.key === 'ArrowRight' ? 1 : -1);
    if (p < 1 || p > pages) return;
    e.preventDefault();
    location.href = href(p);
  });
}
