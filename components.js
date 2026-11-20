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

/* --- Соцсети: ссылки-иконки. mono — одноцветный вариант (.socials--mono): силуэт задаётся маской --m --- */
const socialsHTML = (list, { mono = false } = {}) => list.map(s =>
  `<a href="${s.href}" aria-label="${esc(s.t)}"${mono ? ` style="--m: url(${s.mono})"` : ''}><img src="${s.icon}" alt=""></a>`).join('');

/* --- Карточка новости (site.css → «11. Новости»).
       n — запись из NEWS (news-data.js): { id, date, title, text?, img?, typical? }. Нет обложки (img) — на её месте заглушка .ph.
       featured — крупная (на главной первая; в списке — какие решает site.js); lazy — ленивая загрузка картинки;
       level — уровень заголовка по структуре страницы: 3 под заголовком секции (по умолчанию), 2 в списке под h1 страницы.
       Вид от уровня не зависит — его задаёт класс .card-title.
       Анонс выводится всегда: у маленьких карточек его скрывает CSS, а в списке новостей карточка может стать крупной --- */
const newsHref = n => (typeof ARTICLES !== 'undefined' && ARTICLES[n.id]) || n.typical ? `news-item.html?id=${n.id}` : '#';   // страница есть у новостей с текстом в ARTICLES и у типовых
const newsCard = (n, { featured = false, lazy = false, level = 3 } = {}) => `<a class="news-card${featured ? ' news-card--featured' : ''} card" href="${newsHref(n)}">
    <div class="thumb">${n.img ? `<img src="${n.img}" alt=""${lazy ? ' loading="lazy"' : ''}>` : '<span class="ph" aria-hidden="true"><i class="i i-image"></i></span>'}</div>
    <div class="body"><h${level} class="card-title">${esc(n.title)}</h${level}>${n.text ? `<p>${esc(n.text)}</p>` : ''}<time datetime="${n.date}">${fmtDate(n.date)}</time></div>
  </a>`;

/* --- Карточка фотоальбома (site.css → «17. Фото и видео»): та же разметка, что у карточек «Фото» на главной.
       a — запись из ALBUMS (photo-data.js). Обложка — <папка>-cover.webp альбома, а если её не загрузили — первое фото.
       level — уровень заголовка: 3 под заголовком секции (по умолчанию), 2 в списке под h1 страницы --- */
const albumHref = a => `album.html?id=${encodeURIComponent(a.id)}`;
const albumCover = a => PHOTO_DIR + a.dir + '/' + (a.cover || a.photos[0][0]);
const albumCard = (a, { lazy = true, level = 3 } = {}) => `<a class="media-card card" href="${albumHref(a)}">
    <div class="thumb"><img src="${albumCover(a)}" alt=""${lazy ? ' loading="lazy"' : ''}><span class="badge"><i class="i i-camera" aria-hidden="true"></i>${a.count}</span></div>
    <div class="body"><h${level} class="card-title">${esc(a.title)}</h${level}><div class="meta"><time datetime="${a.date}">${fmtDate(a.date)}</time></div></div>
  </a>`;

/* --- Карточка видео (site.css → «17. Фото и видео»): та же разметка, что у карточек «Видео» на главной.
       v — запись из VIDEOS (video-data.js): обложка, кнопка «play», длительность. Ссылка ведёт на файл видео:
       по data-fancybox его открывает плеер Fancybox (fancybox-setup.js), без скрипта — браузер --- */
const videoCard = (v, { lazy = true, level = 3 } = {}) => `<a class="media-card video card" href="${v.src ? VIDEO_DIR + v.src : '#'}" data-fancybox="video" data-caption="${esc(v.title)}">
    <div class="thumb"><img src="${VIDEO_DIR + v.cover}" alt=""${lazy ? ' loading="lazy"' : ''}><span class="play"><i class="i i-play" aria-hidden="true"></i></span><span class="badge duration"><span class="sr-only">Длительность </span>${v.duration}</span></div>
    <div class="body"><h${level} class="card-title">${esc(v.title)}</h${level}><div class="meta"><time datetime="${v.date}">${fmtDate(v.date)}</time></div></div>
  </a>`;

/* --- Объявление (site.css → «10. Объявления»): одна разметка на главной и на странице «Объявления».
       a — запись из ANNOUNCEMENTS (ann-data.js). Дата и время одной строкой, заголовок целиком, текст — начало (CSS обрезает до 3 строк),
       вложения — имена файлов (переносятся по «_»). Ссылка — вся карточка, ведёт на страницу объявления.
       level — уровень заголовка: 3 на главной под «Объявлениями» и в ленте под заголовком месяца --- */
const annHref = a => `announcement.html?id=${a.id}`;
const annText = a => (a.body || []).join(' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();   // начало текста без разметки
const annFile = name => `<span class="ann-file"><i class="i i-file" aria-hidden="true"></i>${esc(name).replace(/_/g, '_<wbr>')}</span>`;
const annCard = (a, { level = 3 } = {}) => `<a class="ann-card" href="${annHref(a)}">
    <time class="ann-date" datetime="${a.date}">${fmtDate(a.date.slice(0, 10))} <span class="t">в ${a.date.slice(11, 16)}</span></time>
    <h${level} class="ann-title">${esc(a.title)}</h${level}>${annText(a) ? `<p class="ann-text">${esc(annText(a))}</p>` : ''}${(a.files || []).map(annFile).join('')}
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
