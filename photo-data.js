/* Фотоальбомы для демо. На сайте их отдаёт CMS; здесь страницы «Фотогалерея» и альбома собираются из этого массива.
   Альбом — папка images/photo/album/<dir>/: <папка>-cover.webp — обложка, если её загрузили; <папка>-NN.webp — фотографии в порядке добавления.
   Название папки в имени файла — имена уникальны на весь сайт (удобно при скачивании, учитывается поиском по картинкам).
   Нет обложки (cover: null) — обложкой служит первое фото альбома (albumCover() в components.js).
   photos — [файл, ширина, высота]: размеры нужны, чтобы раскладка не прыгала, пока фото грузятся (в CMS их пишут при загрузке).
   ТОЛЬКО ДЕМО: count — сколько фото «в альбоме»: в папке 14 одинаковых фото, страница альбома повторяет их до count — для пагинации.
   После 8 настоящих альбомов — 40 типовых: те же папки под другими названиями, тоже для пагинации */
const PHOTO_DIR = 'images/photo/album/';
const ALBUMS = [
  { id: "turslet-2026", dir: "turslet-2026", title: "Турслет-2026", date: "2026-09-01", cover: "turslet-2026-cover.webp", count: 34,
    photos: [["turslet-2026-01.webp",1067,1600],["turslet-2026-02.webp",1280,1600],["turslet-2026-03.webp",1067,1600],["turslet-2026-04.webp",1067,1600],["turslet-2026-05.webp",1067,1600],["turslet-2026-06.webp",1600,1067],["turslet-2026-07.webp",1067,1600],["turslet-2026-08.webp",1600,1000],["turslet-2026-09.webp",1600,1061],["turslet-2026-10.webp",1600,1576],["turslet-2026-11.webp",1067,1600],["turslet-2026-12.webp",1067,1600],["turslet-2026-13.webp",1600,1061],["turslet-2026-14.webp",1600,1067]] },
  { id: "licey", dir: "licey", title: "Лицей", date: "2026-09-24", cover: "licey-cover.webp", count: 66,
    photos: [["licey-01.webp",1067,1600],["licey-02.webp",1067,1600],["licey-03.webp",1067,1600],["licey-04.webp",1600,1067],["licey-05.webp",1067,1600],["licey-06.webp",1600,1000],["licey-07.webp",1600,1061],["licey-08.webp",1600,1576],["licey-09.webp",1067,1600],["licey-10.webp",1067,1600],["licey-11.webp",1600,1061],["licey-12.webp",1600,1067],["licey-13.webp",1067,1600],["licey-14.webp",1280,1600]] },
  { id: "raznoe-2", dir: "raznoe-2", title: "Разное 2", date: "2026-09-20", cover: "raznoe-2-cover.webp", count: 1359,
    photos: [["raznoe-2-01.webp",1067,1600],["raznoe-2-02.webp",1600,1067],["raznoe-2-03.webp",1067,1600],["raznoe-2-04.webp",1600,1000],["raznoe-2-05.webp",1600,1061],["raznoe-2-06.webp",1600,1576],["raznoe-2-07.webp",1067,1600],["raznoe-2-08.webp",1067,1600],["raznoe-2-09.webp",1600,1061],["raznoe-2-10.webp",1600,1067],["raznoe-2-11.webp",1067,1600],["raznoe-2-12.webp",1280,1600],["raznoe-2-13.webp",1067,1600],["raznoe-2-14.webp",1067,1600]] },
  { id: "raznoe", dir: "raznoe", title: "Разное", date: "2026-10-05", cover: "raznoe-cover.webp", count: 792,
    photos: [["raznoe-01.webp",1067,1600],["raznoe-02.webp",1600,1000],["raznoe-03.webp",1600,1061],["raznoe-04.webp",1600,1576],["raznoe-05.webp",1067,1600],["raznoe-06.webp",1067,1600],["raznoe-07.webp",1600,1061],["raznoe-08.webp",1600,1067],["raznoe-09.webp",1067,1600],["raznoe-10.webp",1280,1600],["raznoe-11.webp",1067,1600],["raznoe-12.webp",1067,1600],["raznoe-13.webp",1067,1600],["raznoe-14.webp",1600,1067]] },
  { id: "nou-2026", dir: "nou-2026", title: "НОУ — 2026", date: "2026-09-28", cover: "nou-2026-cover.webp", count: 58,
    photos: [["nou-2026-01.webp",1600,1061],["nou-2026-02.webp",1600,1576],["nou-2026-03.webp",1067,1600],["nou-2026-04.webp",1067,1600],["nou-2026-05.webp",1600,1061],["nou-2026-06.webp",1600,1067],["nou-2026-07.webp",1067,1600],["nou-2026-08.webp",1280,1600],["nou-2026-09.webp",1067,1600],["nou-2026-10.webp",1067,1600],["nou-2026-11.webp",1067,1600],["nou-2026-12.webp",1600,1067],["nou-2026-13.webp",1067,1600],["nou-2026-14.webp",1600,1000]] },
  { id: "otkrytie-liceya", dir: "otkrytie-liceya", title: "Открытие лицея", date: "2026-06-15", cover: "otkrytie-liceya-cover.webp", count: 166,
    photos: [["otkrytie-liceya-01.webp",1067,1600],["otkrytie-liceya-02.webp",1067,1600],["otkrytie-liceya-03.webp",1600,1061],["otkrytie-liceya-04.webp",1600,1067],["otkrytie-liceya-05.webp",1067,1600],["otkrytie-liceya-06.webp",1280,1600],["otkrytie-liceya-07.webp",1067,1600],["otkrytie-liceya-08.webp",1067,1600],["otkrytie-liceya-09.webp",1067,1600],["otkrytie-liceya-10.webp",1600,1067],["otkrytie-liceya-11.webp",1067,1600],["otkrytie-liceya-12.webp",1600,1000],["otkrytie-liceya-13.webp",1600,1061],["otkrytie-liceya-14.webp",1600,1576]] },
  { id: "den-uchitelya", dir: "den-uchitelya", title: "День учителя", date: "2026-10-05", cover: null, count: 27,
    photos: [["den-uchitelya-01.webp",1067,1600],["den-uchitelya-02.webp",1067,1600],["den-uchitelya-03.webp",1600,1067],["den-uchitelya-04.webp",1067,1600],["den-uchitelya-05.webp",1600,1000],["den-uchitelya-06.webp",1600,1061],["den-uchitelya-07.webp",1600,1576],["den-uchitelya-08.webp",1067,1600],["den-uchitelya-09.webp",1067,1600],["den-uchitelya-10.webp",1600,1061],["den-uchitelya-11.webp",1600,1067],["den-uchitelya-12.webp",1067,1600],["den-uchitelya-13.webp",1280,1600],["den-uchitelya-14.webp",1067,1600]] },
  { id: "osennij-bal", dir: "osennij-bal", title: "Осенний бал", date: "2026-10-24", cover: null, count: 14,
    photos: [["osennij-bal-01.webp",1600,1000],["osennij-bal-02.webp",1600,1061],["osennij-bal-03.webp",1600,1576],["osennij-bal-04.webp",1067,1600],["osennij-bal-05.webp",1067,1600],["osennij-bal-06.webp",1600,1061],["osennij-bal-07.webp",1600,1067],["osennij-bal-08.webp",1067,1600],["osennij-bal-09.webp",1280,1600],["osennij-bal-10.webp",1067,1600],["osennij-bal-11.webp",1067,1600],["osennij-bal-12.webp",1067,1600],["osennij-bal-13.webp",1600,1067],["osennij-bal-14.webp",1067,1600]] },
];
/* типовые альбомы: даты — раз в неделю назад от 1 июня 2026 */
(function () {
  const titles = ["Последний звонок", "Выпускной вечер", "День знаний", "Новогодний праздник", "Масленица", "Смотр строя и песни", "День защитника Отечества", "8 Марта", "Лыжня России", "Неделя математики", "Неделя русского языка", "Шахматный турнир", "Экскурсия в музей", "Литературная гостиная", "Посвящение в лицеисты", "Спартакиада", "День здоровья", "Конкурс чтецов", "Школьная ярмарка", "Субботник", "Бессмертный полк", "Олимпиада по физике", "Театральная студия", "Встреча выпускников", "Акция «Покормите птиц»", "День матери", "Научная конференция", "Фестиваль ГТО", "Профориентационная экскурсия", "Кубок по волейболу", "Вахта памяти", "Рождественские чтения", "Мисс Осень", "День самоуправления", "Классный час «Разговоры о важном»", "Ученик года — 2025", "Турслет-2025", "Открытие лицея — 2025", "НОУ — 2025", "Выпускной 2025"];
  const real = ALBUMS.slice();
  titles.forEach((title, i) => {
    const src = real[i % real.length];
    const d = new Date(Date.UTC(2026, 5, 1 - i * 7)).toISOString().slice(0, 10);
    ALBUMS.push({ ...src, id: 'album-' + (i + 1), title, date: d, count: 12 + (i * 37) % 180 });
  });
})();
