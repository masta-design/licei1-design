/* --- Главная: лента «Новости» — 9 последних из NEWS (news-data.js), первая крупная.
       Сколько из них видно, решает CSS по ширине (5 / 7 / 9 — ряды всегда заполнены). Слайдер с новостями не связан:
       лента всегда начинается с самой свежей новости --- */
document.getElementById('news-latest').innerHTML = NEWS.slice(0, 9).map((n, i) => newsCard(n, { featured: i === 0 })).join('');

/* --- Главная: «Объявления» — 5 последних из ANNOUNCEMENTS (ann-data.js) шаблоном annCard(), как на странице «Объявления».
       Видны три, лишние скрывает CSS --- */
document.getElementById('ann-list').innerHTML = ANNOUNCEMENTS.slice(0, 5).map(a => `<li>${annCard(a)}</li>`).join('');

/* --- Главная: «Фото / Видео» — те же карточки, что на страницах «Фотогалерея» и «Видео» (albumCard(), videoCard() из components.js):
       6 последних альбомов и 8 последних видео. Сколько видно, решает CSS по ширине. Видео открываются в плеере Fancybox (fancybox-setup.js) --- */
document.getElementById('panel-photo').innerHTML = ALBUMS.slice(0, 6).map(a => albumCard(a)).join('');
document.getElementById('panel-video').innerHTML = VIDEOS.slice(0, 8).map(v => videoCard(v)).join('');
