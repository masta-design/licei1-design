/* --- Страница объявления: announcement.html?id=… (в CMS — отдельный адрес у каждого объявления).
       Заголовок, дата и время, текст (может не быть) и файлы (может не быть) — из ANNOUNCEMENTS (ann-data.js).
       Файлы — тем же списком документов, что на типовой странице (.docs): название и тип файла; скачивание в демо — заглушка --- */
(function () {
  const id = new URLSearchParams(location.search).get('id') || ANNOUNCEMENTS[0].id;
  const a = ANNOUNCEMENTS.find(x => x.id === id);
  const body = document.getElementById('article-body');
  if (!a) {
    document.getElementById('article-title').textContent = 'Объявление не найдено';
    body.innerHTML = '<p>Возможно, оно было удалено. <a href="announcements.html">Все объявления</a></p>';
    return;
  }
  document.title = `${a.title} — Объявления — Лицей №1 им. М.В. Карамаева`;
  document.getElementById('article-title').textContent = a.title;
  const date = document.getElementById('article-date');
  date.dateTime = a.date;
  date.textContent = `${fmtDate(a.date.slice(0, 10))} в ${a.date.slice(11, 16)}`;

  // абзацы приходят из CMS готовым HTML: строка с тегом блока — как есть, иначе — абзац
  const block = /^<(h[2-4]|p|ul|ol|figure|blockquote|table|div)[\s>]/;
  if (a.body && a.body.length) body.innerHTML = a.body.map(p => block.test(p) ? p : `<p>${p}</p>`).join('');
  else body.remove();

  if (a.files && a.files.length) {
    document.getElementById('ann-files-list').innerHTML = a.files.map(f => {
      const ext = (f.match(/\.([a-z0-9]+)$/i) || [, ''])[1].toUpperCase();
      const name = f.replace(/\.[a-z0-9]+$/i, '').replace(/_/g, ' ');
      return `<li><a class="doc" href="#"><i class="i i-file" aria-hidden="true"></i><span><span class="doc-name">${esc(name)}</span><span class="doc-meta">${ext}</span></span></a></li>`;
    }).join('');
    document.getElementById('ann-files').hidden = false;
  }
})();
