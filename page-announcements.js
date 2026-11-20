/* --- Страница «Объявления»: лента одной колонкой, по 20 объявлений на страницу, номер страницы — в ?page=N (в CMS это делает сервер).
       Объявления страницы разбиты по месяцам: заголовок месяца (h2) и под ним карточки annCard() — те же, что на главной --- */
(function () {
  const PER_PAGE = 20;
  const MONTHS_NOM = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
  const pages = Math.max(1, Math.ceil(ANNOUNCEMENTS.length / PER_PAGE));
  const page = Math.min(Math.max(parseInt(new URLSearchParams(location.search).get('page'), 10) || 1, 1), pages);
  const href = p => p === 1 ? 'announcements.html' : `announcements.html?page=${p}`;

  // группы по месяцам: объявления уже идут от новых к старым
  const groups = [];
  ANNOUNCEMENTS.slice((page - 1) * PER_PAGE, page * PER_PAGE).forEach(a => {
    const key = a.date.slice(0, 7);
    if (!groups.length || groups[groups.length - 1].key !== key) groups.push({ key, items: [] });
    groups[groups.length - 1].items.push(a);
  });
  document.getElementById('ann-feed').innerHTML = groups.length
    ? groups.map(g => {
        const [y, m] = g.key.split('-').map(Number);
        return `<section class="ann-group" aria-labelledby="m-${g.key}">
          <h2 class="ann-month" id="m-${g.key}">${MONTHS_NOM[m - 1]} ${y}</h2>
          <ul class="ann-list">${g.items.map(a => `<li>${annCard(a)}</li>`).join('')}</ul>
        </section>`;
      }).join('')
    : '<p>Объявлений пока нет.</p>';
  if (page > 1) document.title = `Объявления — страница ${page} — Лицей №1 им. М.В. Карамаева`;
  pager(document.getElementById('pager'), { page, pages, href });
})();
