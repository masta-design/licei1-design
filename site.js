/* ============================================================
   ПОВЕДЕНИЕ КОМПОНЕНТОВ. Подключается последним, в конце <body>: вся разметка (в том числе от layout.js и скриптов страниц) уже есть.
   Каждый блок ищет свои элементы и молча выходит, если их на странице нет.
   Правило: поведение, которое должно работать и у дорисованных позже элементов (карточки, плитки), —
   через делегирование на document, а не обработчиками на каждом элементе
   ============================================================ */

/* --- Сайдбар: аккордеон — на каждом уровне открыт один раздел, соседние сворачиваются вместе с вложенными --- */
document.getElementById('nav').addEventListener('click', e => {
  const btn = e.target.closest('.nav-row > button');
  if (!btn) return;
  const item = btn.closest('.nav-item');
  const open = !item.classList.contains('is-open');
  const siblings = item.closest('.nav-sub')
    ? item.parentElement.querySelectorAll(':scope > .nav-item')
    : document.querySelectorAll('#nav > ul > .nav-item');
  siblings.forEach(sib => [sib, ...sib.querySelectorAll('.nav-item')].forEach(el => {
    if (!el.classList.contains('is-open')) return;
    el.classList.remove('is-open');
    el.querySelector(':scope > .nav-row > button').setAttribute('aria-expanded', 'false');
  }));
  item.classList.toggle('is-open', open);
  btn.setAttribute('aria-expanded', open);
  if (open) setTimeout(() => item.scrollIntoView({ block: 'nearest', behavior: 'smooth' }), 260);
});

/* --- Контакты (шапка и мобильный сайдбар): нажатие открывает/закрывает панель (на тач-экранах), клик вне панели и Esc — закрывают --- */
document.querySelectorAll('[data-contacts]').forEach(box => {
  const btn = box.querySelector('.contacts-btn');
  const set = open => { box.classList.toggle('is-open', open); btn.setAttribute('aria-expanded', open); };
  btn.addEventListener('click', () => set(!box.classList.contains('is-open')));
  document.addEventListener('click', e => { if (!box.contains(e.target)) set(false); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') set(false); });
});

/* --- Поиск на мобильных: кнопка-лупа раскрывает поле под верхним блоком --- */
(function () {
  const btn = document.querySelector('[data-search-toggle]');
  const bar = btn.closest('.tb-main');
  btn.addEventListener('click', () => {
    const open = bar.classList.toggle('search-open');
    btn.setAttribute('aria-expanded', open);
    btn.setAttribute('aria-label', open ? 'Закрыть поиск' : 'Открыть поиск');
    if (open) document.getElementById('q').focus();
  });
})();

/* --- Версия для слабовидящих: переключатели в шапке и в мобильном сайдбаре синхронны (в демо режим только запоминает состояние) --- */
(function () {
  const sw = document.querySelectorAll('[data-a11y]');
  sw.forEach(b => b.addEventListener('click', () => {
    const on = b.getAttribute('aria-checked') !== 'true';
    sw.forEach(x => x.setAttribute('aria-checked', on));
  }));
})();

/* --- Мобильное меню --- */
const body = document.body;
const burger = document.querySelector('[data-nav-open]');
const setNav = open => { body.classList.toggle('nav-open', open); burger.setAttribute('aria-expanded', open); };
burger.addEventListener('click', () => setNav(true));
document.querySelectorAll('[data-nav-close]').forEach(el => el.addEventListener('click', () => setNav(false)));
document.addEventListener('keydown', e => { if (e.key === 'Escape') setNav(false); });

/* --- Слайдер (только на главной): листается только вручную — стрелки, точки, свайп; автопрокрутки нет --- */
(function () {
  const root = document.querySelector('[data-slider]');
  if (!root) return;   // слайдер только на главной
  const slides = [...root.querySelectorAll('.slide')];
  const dotsWrap = root.querySelector('.slider-dots');
  let idx = 0;   // листается только вручную: стрелки, точки, свайп

  slides.forEach((_, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('aria-label', `Слайд ${i + 1}`);
    b.addEventListener('click', () => go(i));
    dotsWrap.appendChild(b);
  });
  const dots = [...dotsWrap.children];

  function go(i) {
    idx = (i + slides.length) % slides.length;
    slides.forEach((s, n) => { s.classList.toggle('is-active', n === idx); s.tabIndex = n === idx ? 0 : -1; });
    dots.forEach((d, n) => d.setAttribute('aria-current', n === idx));
  }

  root.querySelector('.prev').addEventListener('click', () => go(idx - 1));
  root.querySelector('.next').addEventListener('click', () => go(idx + 1));

  let x0 = null;
  root.addEventListener('pointerdown', e => { x0 = e.clientX; });
  root.addEventListener('pointerup', e => {
    if (x0 === null) return;
    const dx = e.clientX - x0; x0 = null;
    if (Math.abs(dx) > 50) {
      go(idx + (dx < 0 ? 1 : -1));
      root.dataset.swiped = '1';                     // свайп не должен открывать новость
      setTimeout(() => delete root.dataset.swiped, 0);
    }
  });
  root.addEventListener('click', e => { if (e.target.closest('.slide') && root.dataset.swiped) e.preventDefault(); });

  // Затемнение в тон картинке: средний цвет, приглушённый до тёмного — белый текст на нём всегда читается
  const rgbToHsl = (r, g, b) => {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b), l = (max + min) / 2, d = max - min;
    if (!d) return [0, 0, l];
    const s = d / (1 - Math.abs(2 * l - 1));
    const h = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
    return [(h * 60 + 360) % 360, s, l];
  };
  const hslToRgb = (h, s, l) => {
    const c = (1 - Math.abs(2 * l - 1)) * s, x = c * (1 - Math.abs((h / 60) % 2 - 1)), m = l - c / 2;
    const [r, g, b] = h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x] : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x];
    return [r, g, b].map(v => Math.round((v + m) * 255));
  };
  const shade = img => {
    try {
      const c = document.createElement('canvas');
      c.width = c.height = 16;
      const ctx = c.getContext('2d', { willReadFrequently: true });
      ctx.drawImage(img, 0, 0, 16, 16);
      const d = ctx.getImageData(0, 0, 16, 16).data;
      let r = 0, g = 0, b = 0;
      for (let i = 0; i < d.length; i += 4) { r += d[i]; g += d[i + 1]; b += d[i + 2]; }
      const n = d.length / 4;
      // в HSL: оттенок сохраняем, насыщенность ограничиваем, светлоту ставим низкой
      let [h, s] = rgbToHsl(r / n, g / n, b / n);
      img.closest('.slide').style.setProperty('--shade', hslToRgb(h, Math.min(s, .55), .14).join(' '));
    } catch (e) { /* картинка с чужого домена без CORS — остаётся цвет по умолчанию */ }
  };
  // Картинка шире слайда — прижимаем к боковым краям (класс is-wide); пересчёт при смене размера окна
  const fit = () => slides.forEach(s => {
    const img = s.querySelector('.fg');
    if (img.naturalWidth) s.classList.toggle('is-wide', img.naturalWidth / img.naturalHeight > s.clientWidth / s.clientHeight);
  });
  new ResizeObserver(fit).observe(root);

  slides.forEach(s => {
    const img = s.querySelector('.fg');
    const ready = () => { shade(img); fit(); };
    if (img.complete && img.naturalWidth) ready(); else img.addEventListener('load', ready, { once: true });
  });

  go(0);
})();

/* --- Вкладки фото / видео --- */
(function () {
  const tabs = [...document.querySelectorAll('[role="tab"]')];
  const more = document.getElementById('media-more');
  if (!more) return;
  tabs.forEach(tab => tab.addEventListener('click', () => {
    tabs.forEach(t => {
      const on = t === tab;
      t.setAttribute('aria-selected', on);
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
    });
    more.firstChild.textContent = tab.dataset.more + ' ';
  }));
})();

/* --- Список новостей: крупные карточки для разнообразия. Блок — крупная 2×2 и маленькие, заполняющие две строки рядом с ней;
       крупная чередуется: слева, справа, слева… На 1–2 колонках — крупная во всю ширину, после неё 4 маленькие.
       Число колонок задают контейнерные запросы CSS, поэтому раскладка пересчитывается при смене ширины --- */
(function () {
  const grid = document.querySelector('.news-list .news-grid');
  if (!grid) return;
  const cards = [...grid.querySelectorAll(':scope > .news-card')];
  let cols0 = 0;
  new ResizeObserver(() => {
    const cols = getComputedStyle(grid).gridTemplateColumns.split(' ').length;
    if (cols === cols0) return;
    cols0 = cols;
    const small = cols >= 4 ? 2 * (cols - 2) : 4;   // маленьких в блоке
    cards.forEach((c, i) => {
      // крупная — только если за ней хватает маленьких, чтобы закрыть блок; иначе в конце страницы остались бы дыры
      const big = i % (small + 1) === 0 && cards.length - i > small;
      c.classList.toggle('news-card--featured', big);
      c.classList.toggle('is-right', big && cols >= 4 && i / (small + 1) % 2 === 1);
    });
  }).observe(grid);
})();

/* --- «Лёгкий объём»: плитки быстрого доступа, новости и обложки фото/видео за курсором: координаты курсора → CSS-переменные --mx/--my/--px/--py/--glow.
   У новостей и обложек координаты считаются по картинке — наклоняется и бликует только она.
   Слушаем на документе, а не на каждой карточке: так эффект есть и у карточек, которые страница дорисовывает скриптом
   (список новостей, «Читайте также» — он пересобирается при смене ширины) --- */
(function () {
  const TILT = '.quick a, .news-card, .media-card';
  const reset = a => ['--px', '--py', '--glow'].forEach(v => a.style.removeProperty(v));
  let cur = null;
  document.addEventListener('pointermove', e => {
    if (e.pointerType !== 'mouse') return;
    const a = e.target.closest(TILT);
    if (cur && cur !== a) reset(cur);
    cur = a;
    if (!a) return;
    const box = a.querySelector('.thumb') || a;
    const r = box.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
    const clamp = v => Math.max(-1, Math.min(1, v)).toFixed(3);   // курсор над текстом новости — за пределами картинки
    a.style.setProperty('--mx', x + 'px'); a.style.setProperty('--my', y + 'px');
    a.style.setProperty('--px', clamp(x / r.width * 2 - 1)); a.style.setProperty('--py', clamp(y / r.height * 2 - 1));
    a.style.setProperty('--glow', 1);
  });
  // курсор ушёл с карточки (в том числе за окно) — возвращаем её на место
  document.addEventListener('pointerout', e => { if (cur && !cur.contains(e.relatedTarget)) { reset(cur); cur = null; } });
})();

/* --- Баннеры: увеличение ×1.5 при наведении — точка роста так, чтобы картинка оставалась в пределах сетки (не наезжала на заголовок и края) --- */
document.querySelectorAll('.banner').forEach(b => {
  b.addEventListener('pointerenter', () => {
    const grid = b.closest('.banners').getBoundingClientRect(), r = b.getBoundingClientRect(), w = r.width, h = r.height;
    const k = 1 / (1.5 - 1);   // запас до края сетки, умноженный на k, — сколько точка роста может отойти от края
    const ox = Math.min(Math.max(w / 2, w - (grid.right - r.right) * k), (r.left - grid.left) * k);
    const oy = Math.min(Math.max(h / 2, h - (grid.bottom - r.bottom) * k), (r.top - grid.top) * k);
    b.querySelector('img').style.transformOrigin = `${ox}px ${oy}px`;
  });
});
