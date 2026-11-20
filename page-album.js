/* --- Страница альбома: album.html?id=<альбом>&page=N (в CMS это делает сервер). По 30 фото на страницу.
       Фото — в своих пропорциях, колонками, как на unsplash.com: каждое следующее кладётся в самую короткую колонку,
       поэтому колонки заканчиваются почти вровень. Высоты считаются по размерам из данных — раскладка не ждёт загрузки картинок.
       Число колонок задаёт CSS (--cols у .photo-masonry, контейнерные запросы); при смене ширины фото раскладываются заново.
       Клик по фото открывает лайтбокс Fancybox (fancyapps.com/fancybox, подключён с CDN в album.html, настройки — в fancybox-setup.js).
       В лайтбоксе — фото текущей страницы альбома в их порядке. Без скрипта ссылка просто откроет файл --- */
(function () {
  const PER_PAGE = 30;
  const params = new URLSearchParams(location.search);
  const album = ALBUMS.find(a => a.id === params.get('id')) || ALBUMS[0];   // демо: без id или с неизвестным — первый альбом
  const title = document.getElementById('album-title');
  title.textContent = album.title;
  document.title = `${album.title} — Фотогалерея — Лицей №1 им. М.В. Карамаева`;
  const date = document.getElementById('album-date');
  date.dateTime = album.date;
  date.textContent = fmtDate(album.date);
  document.getElementById('album-count').textContent = `${album.count} фото`;

  // ТОЛЬКО ДЕМО: в папке 14 фото — повторяем их до album.count
  const all = Array.from({ length: album.count }, (_, k) => album.photos[k % album.photos.length]);
  const pages = Math.max(1, Math.ceil(all.length / PER_PAGE));
  const page = Math.min(Math.max(parseInt(params.get('page'), 10) || 1, 1), pages);
  const href = p => albumHref(album) + (p === 1 ? '' : `&page=${p}`);
  if (page > 1) document.title = `${album.title} — страница ${page} — Фотогалерея — Лицей №1 им. М.В. Карамаева`;

  const first = (page - 1) * PER_PAGE;
  const items = all.slice(first, first + PER_PAGE).map(([file, w, h], i) => {
    const n = first + i + 1, src = PHOTO_DIR + album.dir + '/' + file;
    return { src, n, ratio: h / w, html: `<a class="photo-item" href="${src}" data-n="${n}"><img src="${src}" width="${w}" height="${h}" alt="${esc(album.title)}, фото ${n} из ${album.count}"${i > 5 ? ' loading="lazy"' : ''}></a>` };
  });

  const box = document.getElementById('photo-masonry');
  let cols = 0;
  const layout = () => {
    const c = Math.max(1, parseInt(getComputedStyle(box).getPropertyValue('--cols'), 10) || 1);
    if (c === cols) return;
    cols = c;
    const h = new Array(c).fill(0), out = Array.from({ length: c }, () => []);
    items.forEach(it => { const k = h.indexOf(Math.min(...h)); out[k].push(it.html); h[k] += it.ratio + .05; });   // +.05 — примерно промежуток между фото
    box.innerHTML = out.map(col => `<div class="photo-col">${col.join('')}</div>`).join('');
  };
  layout();
  new ResizeObserver(layout).observe(box);
  pager(document.getElementById('pager'), { page, pages, href });

  /* --- Лайтбокс. Fancybox.bind собрал бы галерею в порядке разметки, а он здесь по колонкам (1-я колонка сверху вниз, потом 2-я…).
         Поэтому галерею открываем сами — в порядке альбома, с того фото, по которому кликнули; thumbEl — картинка, из которой фото «вырастает» --- */
  if (typeof Fancybox === 'undefined') return;   // CDN недоступен — ссылки открывают файл
  box.addEventListener('click', e => {
    const a = e.target.closest('.photo-item');
    if (!a || e.ctrlKey || e.metaKey || e.shiftKey || e.button) return;   // Ctrl+клик и т.п. — открыть файл в новой вкладке, как обычную ссылку
    e.preventDefault();
    const start = items.findIndex(it => it.n === +a.dataset.n);
    Fancybox.show(items.map(it => {
      const img = box.querySelector(`.photo-item[data-n="${it.n}"] img`);
      return { src: it.src, type: 'image', thumbEl: img, thumbSrc: it.src, alt: img.alt };
    }), { ...FANCYBOX_OPTIONS, startIndex: start });   // настройки — в fancybox-setup.js
  });
})();
