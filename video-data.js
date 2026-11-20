/* Видео для демо. На сайте их отдаёт CMS; здесь страница «Видео» собирается из этого массива.
   { id, title, date, duration — длительность «м:сс», cover — обложка (кадр из видео) в images/video/, src — файл видео }.
   ТОЛЬКО ДЕМО: у всех видео один тестовый файл priroda.mp4.
   Первые 8 — те же, что в блоке «Видео» на главной. ТОЛЬКО ДЕМО: после них — 40 типовых с теми же обложками, для пагинации */
const VIDEO_DIR = 'images/video/';
const VIDEOS = [
  { id: 'dobro-pozhalovat', title: 'Добро пожаловать в лицей', date: '2026-09-02', duration: '3:24', cover: 'video1.jpeg', src: 'priroda.mp4' },
  { id: 'bezopasnost-v-internete', title: 'Безопасность в интернете', date: '2026-09-18', duration: '5:10', cover: 'video2.jpeg', src: 'priroda.mp4' },
  { id: 'otkrytyj-urok', title: 'Открытый урок', date: '2026-09-25', duration: '12:47', cover: 'video3.jpeg', src: 'priroda.mp4' },
  { id: 'nastavnichestvo', title: 'Наставничество', date: '2026-09-30', duration: '4:02', cover: 'video4.jpeg', src: 'priroda.mp4' },
  { id: 'tvorcheskaya-masterskaya', title: 'Творческая мастерская', date: '2026-10-03', duration: '2:58', cover: 'video5.jpeg', src: 'priroda.mp4' },
  { id: 'robototehnika', title: 'Робототехника в «Точке роста»', date: '2026-10-08', duration: '6:31', cover: 'video6.jpeg', src: 'priroda.mp4' },
  { id: 'turnir-shsk', title: 'Турнир школьного спортклуба', date: '2026-10-14', duration: '3:45', cover: 'video7.jpeg', src: 'priroda.mp4' },
  { id: 'klassnyj-chas', title: 'Классный час', date: '2026-10-20', duration: '8:20', cover: 'video8.jpeg', src: 'priroda.mp4' },
];
/* типовые видео: даты — раз в неделю назад от 1 сентября 2026, длительность — от 1:05 до 14:55 */
(function () {
  const titles = ['Последний звонок', 'Выпускной вечер', 'Линейка 1 сентября', 'Новогодний концерт', 'Масленица во дворе лицея', 'Смотр строя и песни',
    'Поздравление с 23 Февраля', 'Концерт к 8 Марта', 'Лыжня России', 'Неделя математики', 'Урок русского языка', 'Шахматный турнир',
    'Экскурсия в краеведческий музей', 'Литературная гостиная', 'Посвящение в лицеисты', 'Спартакиада', 'День здоровья', 'Конкурс чтецов',
    'Школьная ярмарка', 'Субботник', 'Бессмертный полк', 'Опыты по физике', 'Спектакль театральной студии', 'Встреча выпускников',
    'Как покормить птиц зимой', 'Концерт ко Дню матери', 'Научная конференция', 'Сдаём ГТО', 'Профориентация: день на заводе', 'Кубок по волейболу',
    'Вахта памяти', 'Рождественские чтения', 'Мисс Осень', 'День самоуправления', 'Разговоры о важном', 'Ученик года — 2025',
    'Турслет-2025', 'Открытие лицея — 2025', 'НОУ — 2025', 'Выпускной 2025'];
  const real = VIDEOS.slice();
  titles.forEach((title, i) => {
    const src = real[i % real.length];
    const date = new Date(Date.UTC(2026, 8, 1 - i * 7)).toISOString().slice(0, 10);
    const sec = 65 + (i * 97) % 830;
    VIDEOS.push({ ...src, id: 'video-' + (i + 1), title, date, duration: `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}` });
  });
})();
