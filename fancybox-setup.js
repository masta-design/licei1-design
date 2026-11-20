/* Лайтбокс Fancybox (fancyapps.com/fancybox, 6.1 с CDN): общие настройки для фото альбома и видео.
   Подключается после fancybox.umd.js. Подписи — русские: готового перевода у Fancybox нет, ключи — из dist/fancybox/l10n/en_EN.js */
const FANCYBOX_RU = {
  IMAGE_ERROR: 'Не удалось загрузить изображение. <br /> Попробуйте позже.',
  ERROR: 'Что-то пошло не так. <br /> Попробуйте позже.',
  MOVE_UP: 'Сдвинуть вверх', MOVE_DOWN: 'Сдвинуть вниз', MOVE_LEFT: 'Сдвинуть влево', MOVE_RIGHT: 'Сдвинуть вправо',
  ZOOM_IN: 'Увеличить', ZOOM_OUT: 'Уменьшить',
  TOGGLE_FULL: 'Изменить масштаб', TOGGLE_1TO1: 'Изменить масштаб', ITERATE_ZOOM: 'Изменить масштаб',
  ROTATE_CCW: 'Повернуть против часовой стрелки', ROTATE_CW: 'Повернуть по часовой стрелке',
  FLIP_X: 'Отразить по горизонтали', FLIP_Y: 'Отразить по вертикали', RESET: 'Сбросить',
  TOGGLE_FS: 'Во весь экран', TOGGLE_FULLSCREEN: 'Во весь экран', TOGGLE_EXPAND: 'Полный размер',
  TOGGLE_THUMBS: 'Миниатюры', TOGGLE_AUTOPLAY: 'Слайд-шоу', TOGGLE_SIDEBAR: 'Боковая панель',
  NEXT: 'Следующее', PREV: 'Предыдущее', GOTO: 'Перейти к фото %d', DOWNLOAD: 'Скачать', CLOSE: 'Закрыть',
  MODAL: 'Закрыть окно можно клавишей Esc', ELEMENT_NOT_FOUND: 'Элемент не найден', IFRAME_ERROR: 'Не удалось загрузить страницу', NO_CAPTION: 'Без подписи',
};

/* без миниатюр, листание сдвигом, тёмная тема */
const FANCYBOX_OPTIONS = {
  theme: 'dark',
  Carousel: { transition: 'slide', Thumbs: false },
  l10n: FANCYBOX_RU,
};

/* видео: карточки videoCard() с data-fancybox="video" открываются в плеере — на главной и на странице «Видео».
   Fancybox.bind слушает клики на document, поэтому подходит и для карточек, дорисованных скриптом */
if (typeof Fancybox !== 'undefined') Fancybox.bind('[data-fancybox="video"]', FANCYBOX_OPTIONS);
