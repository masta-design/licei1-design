/* --- Страница «Поиск»: search.html?q=<запрос>&type=<тип>&page=N (на сайте это делает поиск CMS, разметка — та же).
       ТОЛЬКО ДЕМО: ищем по данным демо — новостям (с текстами), объявлениям, альбомам, видео и разделам меню.
       Найдено, если в заголовке или тексте есть все слова запроса (регистр и ё/е не важны).
       Сначала — совпадения в заголовке, затем более свежие. Фильтр по типу и номер страницы — в адресе, по 20 результатов --- */
(function () {
  const PER_PAGE = 20;
  const params = new URLSearchParams(location.search);
  const q = (params.get('q') || '').trim();
  const field = document.getElementById('search-q');
  field.value = q;
  const header = document.getElementById('q');   // в шапке — тот же запрос
  if (header) header.value = q;

  const TYPES = { news: 'Новости', ann: 'Объявления', page: 'Страницы', photo: 'Фото', video: 'Видео' };
  const ONE = { news: 'Новость', ann: 'Объявление', page: 'Страница', photo: 'Фотоальбом', video: 'Видео' };
  const norm = t => String(t).toLowerCase().replace(/ё/g, 'е');
  const strip = h => String(h || '').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();

  // всё, по чему ищем: { type, title, text, date?, path?, href, video? }
  const all = [];
  NEWS.filter(n => !String(n.id).startsWith('demo-')).forEach(n => {
    const a = typeof ARTICLES !== 'undefined' && ARTICLES[n.id];
    all.push({ type: 'news', title: n.title, text: strip([n.text, a ? a.body.join(' ') : ''].join(' ')), date: n.date, href: newsHref(n) });
  });
  ANNOUNCEMENTS.forEach(a => all.push({ type: 'ann', title: a.title, text: strip((a.body || []).join(' ') + ' ' + (a.files || []).join(' ')), date: a.date.slice(0, 10), href: annHref(a) }));
  ALBUMS.forEach(a => all.push({ type: 'photo', title: a.title, text: '', date: a.date, href: albumHref(a), extra: `${a.count} фото` }));
  VIDEOS.forEach(v => all.push({ type: 'video', title: v.title, text: '', date: v.date, href: v.src ? VIDEO_DIR + v.src : '#', video: true, extra: v.duration }));
  // разделы меню: путь — названия разделов выше («Сведения об образовательной организации › Документы»)
  const walk = (items, path) => items.forEach(it => {
    const t = typeof it === 'string' ? { t: it } : it;
    all.push({ type: 'page', title: t.t, text: '', path: path.join(' › '), href: t.href || '#' });   // у раздела с подпунктами тоже есть своя страница
    if (t.c) walk(t.c, path.concat(t.t));
  });
  NAV.filter(g => g.group !== 'Шаблоны').forEach(g => walk(g.items, []));

  const words = norm(q).split(/[^\p{L}\p{N}]+/u).filter(w => w.length > 1);
  const found = !words.length ? [] : all
    .map(r => { const t = norm(r.title), x = norm(r.text); return { r, ok: words.every(w => t.includes(w) || x.includes(w)), score: words.filter(w => t.includes(w)).length }; })
    .filter(m => m.ok)
    .sort((a, b) => b.score - a.score || String(b.r.date || '').localeCompare(String(a.r.date || '')))
    .map(m => m.r);

  // подсветка найденных слов: <mark class="hl">; текст сначала экранируется
  const reWords = words.length ? new RegExp('(' + words.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/е/g, '[её]')).join('|') + ')', 'giu') : null;
  const hl = t => reWords ? esc(t).replace(reWords, '<mark class="hl">$1</mark>') : esc(t);
  // отрывок текста вокруг первого найденного слова
  const snippet = text => {
    if (!text) return '';
    const n = norm(text);
    const at = Math.min(...words.map(w => n.indexOf(w)).filter(i => i >= 0).concat(text.length));
    if (at >= text.length) return text.slice(0, 220);
    let from = Math.max(0, at - 80);
    if (from) { const sp = text.indexOf(' ', from); if (sp > 0 && sp < at) from = sp + 1; }   // отрывок — с начала слова
    return (from ? '…' : '') + text.slice(from, from + 240).trim() + (from + 240 < text.length ? '…' : '');
  };

  const counts = {};
  found.forEach(r => { counts[r.type] = (counts[r.type] || 0) + 1; });
  const type = TYPES[params.get('type')] && counts[params.get('type')] ? params.get('type') : '';
  const list = type ? found.filter(r => r.type === type) : found;
  const pages = Math.max(1, Math.ceil(list.length / PER_PAGE));
  const page = Math.min(Math.max(parseInt(params.get('page'), 10) || 1, 1), pages);
  const url = (t, p) => 'search.html?' + new URLSearchParams(Object.entries({ q, type: t, page: p > 1 ? p : '' }).filter(([, v]) => v)).toString();

  const plural = (n, one, few, many) => { const a = n % 10, b = n % 100; return a === 1 && b !== 11 ? one : a >= 2 && a <= 4 && (b < 12 || b > 14) ? few : many; };
  const summary = document.getElementById('search-summary');
  const empty = document.getElementById('search-empty');
  if (q) document.title = `«${q}» — Поиск — Лицей №1 им. М.В. Карамаева`;

  if (!q) {
    summary.textContent = 'Введите, что нужно найти: название раздела, тему новости или объявления.';
  } else if (!found.length) {
    summary.hidden = true;
    empty.hidden = false;
    empty.innerHTML = `<h2 class="search-empty-title">По запросу «${esc(q)}» ничего не нашлось</h2>
      <ul class="search-tips"><li>Проверьте, нет ли опечаток и правильная ли раскладка клавиатуры.</li><li>Попробуйте другие или более общие слова — например, «ГИА» вместо «консультации по ГИА».</li></ul>`;
  } else {
    summary.innerHTML = `${plural(found.length, 'Найден', 'Найдено', 'Найдено')} ${found.length} ${plural(found.length, 'результат', 'результата', 'результатов')} по запросу «<b>${esc(q)}</b>»`;
    // фильтр: «Все» и типы, по которым что-то нашлось; выбранный — основная кнопка
    const pill = (t, label, n) => `<a class="btn ${t === type ? 'btn-primary' : 'btn-secondary'}" href="${url(t, 1)}"${t === type ? ' aria-current="true"' : ''}>${label}<span class="search-count">${n}</span></a>`;
    document.getElementById('search-filters').innerHTML = pill('', 'Все', found.length)
      + Object.keys(TYPES).filter(t => counts[t]).map(t => pill(t, TYPES[t], counts[t])).join('');
    document.getElementById('search-list').innerHTML = list.slice((page - 1) * PER_PAGE, page * PER_PAGE).map(r => {
      const meta = [ONE[r.type], r.date ? fmtDate(r.date) : '', r.extra].filter(Boolean).join(' · ');
      const sn = snippet(r.text);
      return `<li><a class="ann-card" href="${r.href}"${r.video ? ` data-fancybox="video" data-caption="${esc(r.title)}"` : ''}>
        <span class="ann-date">${meta}</span>
        <h2 class="ann-title">${hl(r.title)}</h2>
        ${r.path ? `<span class="search-path">${esc(r.path)}</span>` : ''}${sn ? `<p class="ann-text">${hl(sn)}</p>` : ''}
      </a></li>`;
    }).join('');
  }
  const pg = document.getElementById('pager');
  if (list.length) pager(pg, { page, pages, href: p => url(type, p) }); else pg.remove();
})();
