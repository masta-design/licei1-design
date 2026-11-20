/* --- Карта сайта (sitemap.html): все разделы меню — из NAV (school-data.js), того же источника, что и меню сайдбара.
       Поэтому при изменении разделов карта обновляется сама. Группы меню — колонками (заголовок h2), разделы — списком,
       подразделы любой глубины — вложенными списками. Группа «Шаблоны» — только для демо, в карту не попадает --- */
(function () {
  const root = document.getElementById('sitemap');
  if (!root || typeof NAV === 'undefined') return;
  const SKIP = ['Шаблоны'];
  const item = it => {
    const x = typeof it === 'string' ? { t: it } : it;
    const sub = (x.c || []).map(item).join('');
    return `<li><a href="${x.href || '#'}">${esc(x.t)}</a>${sub ? `<ul>${sub}</ul>` : ''}</li>`;
  };
  root.innerHTML = NAV.filter(g => !SKIP.includes(g.group)).map((g, i) => `
    <section class="sitemap-group" aria-labelledby="sm-${i}">
      <h2 class="sitemap-title" id="sm-${i}">${esc(g.group || 'Разделы')}</h2>
      <ul class="sitemap-list">${g.items.map(item).join('')}</ul>
    </section>`).join('');
})();
