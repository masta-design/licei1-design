/* --- Страница «Фотогалерея»: по 12 альбомов на страницу, номер страницы — в ?page=N (в CMS это делает сервер).
       12 — ряды заполнены целиком на 2, 3, 4 и 6 колонках. Карточки — albumCard() из components.js, как в блоке «Фото» на главной --- */
(function () {
  const PER_PAGE = 12;
  const pages = Math.max(1, Math.ceil(ALBUMS.length / PER_PAGE));
  const page = Math.min(Math.max(parseInt(new URLSearchParams(location.search).get('page'), 10) || 1, 1), pages);
  const href = p => p === 1 ? 'photos.html' : `photos.html?page=${p}`;

  const list = ALBUMS.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  // заголовки карточек — h2: карточки идут сразу под h1 «Фотогалерея»; первые обложки грузятся сразу
  document.getElementById('album-grid').innerHTML = list.length
    ? list.map((a, i) => albumCard(a, { lazy: i > 3, level: 2 })).join('')
    : '<p>Альбомов пока нет.</p>';
  if (page > 1) document.title = `Фотогалерея — страница ${page} — Лицей №1 им. М.В. Карамаева`;
  pager(document.getElementById('pager'), { page, pages, href });
})();
