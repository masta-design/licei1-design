/* --- Страница «Видео»: по 12 видео на страницу, номер страницы — в ?page=N (в CMS это делает сервер).
       12 — ряды заполнены целиком на 2, 3, 4 и 6 колонках. Карточки — videoCard() из components.js, как в блоке «Видео» на главной --- */
(function () {
  const PER_PAGE = 12;
  const pages = Math.max(1, Math.ceil(VIDEOS.length / PER_PAGE));
  const page = Math.min(Math.max(parseInt(new URLSearchParams(location.search).get('page'), 10) || 1, 1), pages);
  const href = p => p === 1 ? 'videos.html' : `videos.html?page=${p}`;

  const list = VIDEOS.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  // заголовки карточек — h2: карточки идут сразу под h1 «Видео»; первые обложки грузятся сразу
  document.getElementById('video-grid').innerHTML = list.length
    ? list.map((v, i) => videoCard(v, { lazy: i > 3, level: 2 })).join('')
    : '<p>Видео пока нет.</p>';
  if (page > 1) document.title = `Видео — страница ${page} — Лицей №1 им. М.В. Карамаева`;
  pager(document.getElementById('pager'), { page, pages, href });
})();
