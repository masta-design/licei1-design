/* --- Страница «Новости»: по 14 карточек на страницу, номер страницы — в ?page=N (в CMS это делает сервер).
       14 — блоки «крупная + маленькие» и хвост заполняют ряды целиком на 1, 2, 4 и 5 колонках (на 6 — последний ряд из 5).
       Какие карточки крупные — решает site.js по числу колонок. В news-data.js к реальным новостям добавлены 100 пустых — для демо пагинации --- */
(function () {
  const PER_PAGE = 14;
  const pages = Math.max(1, Math.ceil(NEWS.length / PER_PAGE));
  const page = Math.min(Math.max(parseInt(new URLSearchParams(location.search).get('page'), 10) || 1, 1), pages);
  const href = p => p === 1 ? 'news.html' : `news.html?page=${p}`;

  const list = NEWS.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  // заголовки карточек — h2: карточки идут сразу под h1 «Новости»
  document.getElementById('news-grid').innerHTML = list.length
    ? list.map((n, i) => newsCard(n, { lazy: i > 0, level: 2 })).join('')
    : '<p>Новостей пока нет.</p>';
  if (page > 1) document.title = `Новости — страница ${page} — Лицей №1 им. М.В. Карамаева`;
  pager(document.getElementById('pager'), { page, pages, href });
})();
