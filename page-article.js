/* --- Страница новости: news-item.html?id=… (в CMS — отдельный адрес у каждой новости).
       Текст и фото — из ARTICLES (news-articles.js), заголовок и дата — из NEWS (news-data.js) --- */
(function () {
  const id = new URLSearchParams(location.search).get('id') || Object.keys(ARTICLES)[0];
  const n = NEWS.find(x => x.id === id), a = ARTICLES[id];

  if (!n || !a) {
    document.getElementById('article-title').textContent = 'Новость не найдена';
    document.getElementById('article-body').innerHTML = '<p>Возможно, она была удалена. <a href="news.html">Все новости</a></p>';
    document.getElementById('related').remove();
    return;
  }
  document.title = `${n.title} — Лицей №1 им. М.В. Карамаева`;
  document.getElementById('article-title').textContent = n.title;
  const date = document.getElementById('article-date');
  date.dateTime = n.date; date.textContent = fmtDate(n.date);
  if (a.views != null) {   // счётчик просмотров — как на текущем сайте
    const v = document.getElementById('article-views');
    v.querySelector('[data-views]').textContent = a.views.toLocaleString('ru-RU');
    v.title = 'Просмотров: ' + a.views;
    v.hidden = false;
  }
  document.getElementById('article-photos').innerHTML = a.photos.map(src => `<img src="${src}" alt="">`).join('');
  // абзацы приходят из CMS готовым HTML (ссылки, переносы строк)
  document.getElementById('article-body').innerHTML = (a.lead ? `<p class="article-lead">${esc(a.lead)}</p>` : '') + a.body.map(p => `<p>${p}</p>`).join('');

  // «Читайте также»: строкой под новостью — столько новостей, сколько колонок (2/4/5/6; на телефоне лента из 6);
  // колонкой справа (большие экраны, сетка в одну колонку) — 3.
  // Берём самые близкие по дате (и раньше, и позже), показываем от новых к старым; при смене ширины пересобираем
  const t = Date.parse(n.date);
  const nearest = NEWS.filter(x => x.id !== id && !x.id.startsWith('demo-'))
    .sort((x, y) => Math.abs(Date.parse(x.date) - t) - Math.abs(Date.parse(y.date) - t));
  const grid = document.getElementById('related-grid');
  let k0 = 0;
  new ResizeObserver(() => {
    const cols = getComputedStyle(grid).gridTemplateColumns.split(' ').length;
    const k = getComputedStyle(grid).display === 'flex' ? 6 : cols === 1 ? 3 : cols;   // flex — лента на телефоне, 1 колонка — справа
    if (k === k0) return;
    k0 = k;
    grid.innerHTML = nearest.slice(0, k).sort((x, y) => y.date.localeCompare(x.date)).map(r => newsCard(r, { lazy: true })).join('');
  }).observe(grid);
})();
