/* ============================================================
   Структура навигации. Все разделы текущего сайта сохранены и
   сгруппированы по смыслу; «Главной» в меню нет — на главную ведёт логотип.
   Сайдбар и подвал строятся из этих данных, поэтому всегда совпадают.
   ============================================================ */
const NAV = [
  { group: 'Участникам', items: [
    { t: 'Родителям', c: [{ t: 'Приём в 1 класс', c: ['Приказы о зачислении'] }, 'Кружки, секции', 'Объявления', 'Новости', { t: 'Статьи', c: ['Буллинг'] }, 'Цены на платные образовательные услуги', 'Профилактика правонарушений', 'Обращения граждан', 'Разное', 'Психологическая служба', 'Социальный педагог', 'ПМПК', 'Охрана здоровья учащихся', 'Родной язык'] },
    { t: 'Ученикам', c: ['Новости', 'Объявления', 'Профориентация', 'Олимпиады и конкурсы', 'Кружки, секции', 'Расписание уроков', { t: 'Библиотека', c: ['Наша библиотека', 'Новости', 'Изучаем родной язык, историю и культуру Горного Алтая', 'Информационная культура', 'Нашим читателям (информация для учащихся)', 'Наши достижения', 'Полезные ссылки', 'Родителям', 'Педагогам', 'Противодействие экстремизму', 'Фотоальбом «Читай, играй и познавай»'] }, { t: 'Цифровая образовательная среда', c: ['Полезные ссылки', 'Сайты для создания интерактивных заданий, опроса, анкетирования', 'Сайты и порталы педагогической направленности', 'Школьный медиацентр', 'Применение геймификации в образовательном процессе', 'Облачные сервисы и технологии'] }, 'Интересно с интересом', 'Противодействие идеологии терроризма и экстремизма'] },
    { t: 'Учителям', c: ['Аттестации', 'Новости', 'Объявления', 'Правила внутреннего распорядка', 'Методические материалы', { t: 'Вакансии', c: ['Заполнить анкету'] }, 'Стажировочные площадки', 'Школа Минпросвещения России', 'Наставничество', 'Охрана труда', 'Система оплаты труда', 'Стажерские площадки'] },
  ]},
  { group: 'Жизнь лицея', items: [
    { t: 'Наша жизнь', c: ['Воспитательная работа', { t: 'Новости', href: 'news.html' }, 'Объявления', 'Фотогалерея', 'Видео', 'Поздравления и благодарности', { t: 'Вопрос-ответ', c: ['Задать вопрос'] }, 'Помещения', 'Школьный спортивный клуб (ШСК)', 'Самбо в школе', { t: 'Наши учителя', c: ['Учителя естественно-научных дисциплин', 'Учителя начальных классов', 'Учителя общественных наук', 'Учителя иностранных языков', 'Учителя гуманитарных наук', 'Учителя физико-математических дисциплин'] }, { t: 'Сведения об организации отдыха детей и их оздоровления', c: ['Об организации отдыха детей и их оздоровления', 'Материально-техническое обеспечение и оснащённость организации отдыха детей и их оздоровления', 'Услуги, в том числе платные, предоставляемые организацией отдыха детей и их оздоровления', 'Доступная среда'] }, { t: 'Страничка психолога', c: ['Рекомендации учителям', 'Рекомендации ученикам', 'Рекомендации родителям'] }, 'Служба примирения лицея', 'Проект «Функциональная грамотность»', 'Театральная студия', 'Музей', 'Вклад в будущее', 'ПДД, безопасность', 'Управляющий совет'] },
    { t: 'Воспитательная работа', c: ['Оценка за поведение 2026–2027 уч. год'] },
    { t: 'Меню питания' },
    { t: 'Школьный музей', c: ['Документы', 'Мероприятия', 'Фотогалерея'] },
  ]},
  { group: 'Обучение', items: [
    { t: 'ГИА', c: ['ЕГЭ', 'ОГЭ', 'Итоговое сочинение в рамках ГИА', 'Информационные плакаты для выпускников', 'Информационные порталы', 'Советы психолога', 'Горячая линия', 'Расписание ГИА-11', 'Расписание ГИА-9'] },
    { t: 'Предпрофильное обучение', c: ['Документы', 'Профильный естественно-научный (медицинский) 10 класс'] },
    { t: 'Профориентация', c: ['Документы', 'Педагогам', 'Информация педагога-психолога', 'Родителям', 'Учащимся', 'Приглашаем к участию', 'Конкурс педагогов-навигаторов «Мои горизонты»'] },
    { t: 'Цифровизация', c: ['ФГИС «Моя школа»', 'Цифровая (электронная) библиотека и электронные образовательные ресурсы'] },
    { t: 'Приём иностранных граждан' },
  ]},
  { group: 'О лицее', items: [
    { t: 'Сведения об образовательной организации', c: ['Основные сведения', 'Структура и органы управления', { t: 'Документы', c: ['Документы (устав, лицензия и т.д.)', 'Правоустанавливающие документы', 'График оценочных процедур'] }, 'Образование', 'Руководство', 'Педагогический состав', 'Материально-техническое обеспечение. Доступная среда', 'Стипендии и меры поддержки обучающихся', 'Международное сотрудничество', 'Организация питания', 'Образовательные стандарты и требования', 'Платные образовательные услуги', { t: 'Финансово-хозяйственная деятельность', c: ['Поступление и расходование финансовых и материальных средств по итогам финансового года'] }, 'Вакантные места для приёма (перевода)', 'Законодательная карта', { t: 'Центр «Точка роста»', c: ['Новости', 'Общая информация о центре «Точка роста»', 'Документы', 'Программы', 'Педагоги', 'Материально-техническая база', 'Режим занятий', 'Мероприятия', 'Дополнительная информация', 'Обратная связь (контакты)', 'Галерея', 'Центр образования цифрового и гуманитарного профилей'] }, 'Прокуратура информирует', 'Доступная среда', { t: 'Информационная безопасность', c: ['Локальные акты', 'Нормативное регулирование', 'Педагогам', 'Ученикам', 'Родителям', 'Детские безопасные сайты'] }, 'Приём в образовательную организацию', 'Федеральный закон № 44', 'Антикоррупционная политика'] },
    { t: 'Национальный проект «Образование»' },
    { t: 'Региональная инновационная площадка', c: ['Нормативно-правовые документы', 'Мероприятия'] },
    { t: 'Стажировочные площадки' },
    { t: 'Контакты', c: ['Контакты контролирующих организаций'] },
  ]},
  { group: 'Безопасность и контроль', items: [
    { t: 'Информационная безопасность', c: ['Детские безопасные сайты', 'Нормативное регулирование', 'Обучающимся', 'Педагогическим работникам', 'Родителям', 'Мероприятия по информационной грамотности педагогов'] },
    { t: 'ТВОЯ Безопасность', c: ['ПДД', 'Противодействие экстремизму и терроризму', 'Профилактика мошенничества', 'Пожарная безопасность'] },
    { t: 'Противодействие коррупции', c: ['Нормативно-правовые и иные акты', 'Антикоррупционная экспертиза', 'Методические материалы', 'Формы документов для заполнения', 'Сведения о доходах, расходах, об имуществе', 'Комиссия по урегулированию конфликта интересов', 'Обратная связь для сообщений о фактах коррупции'] },
    { t: 'НОКО. Независимая оценка качества образования', c: ['Независимая оценка качества условий образовательной деятельности'] },
  ]},
];

/* --- Сайдбар --- */
// Пункт: строка-ссылка или { t, hint?, c: [...] }; в c снова строки или объекты — так задаётся третий уровень
const navItem = (it, id, top) => {
  const hasSub = it.c && it.c.length;
  const label = `<span>${it.t}${it.hint ? ` <span class="hint">· ${it.hint}</span>` : ''}</span>`;
  if (!hasSub && !top) return `<li><a href="${it.href || '#'}">${it.t}</a></li>`;
  // Раздел раскрывает список, первая ссылка в нём — страница самого раздела (как на текущем сайте)
  const sub = [`<li><a href="#" class="nav-self">${it.t}</a></li>`]
    .concat((it.c || []).map((s, si) => navItem(typeof s === 'string' ? { t: s } : s, `${id}-${si}`, false)));
  return `<li class="nav-item">
    <div class="nav-row">
      ${hasSub
        ? `<button type="button" aria-expanded="false" aria-controls="${id}">${label}<i class="i chev i-down" aria-hidden="true"></i></button>`
        : `<a href="#">${label}</a>`}
    </div>
    ${hasSub ? `<div class="nav-sub-wrap"><ul class="nav-sub" id="${id}">${sub.join('')}</ul></div>` : ''}
  </li>`;
};
document.getElementById('nav').innerHTML = NAV.map((g, gi) => `
  ${g.group ? `<div class="nav-group-label">${g.group}</div>` : ''}
  <ul>${g.items.map((it, ii) => navItem(it, `sub-${gi}-${ii}`, true)).join('')}</ul>`).join('');

// Текущая страница: путь в меню — в <body data-nav="Раздел/Подраздел/Страница">. Разделы на пути раскрыты, сама страница подсвечена
(function () {
  const path = (document.body.dataset.nav || '').split('/').filter(Boolean);
  let scope = document.getElementById('nav');
  path.forEach((name, i) => {
    const last = i === path.length - 1;
    const item = [...scope.querySelectorAll(':scope > ul > .nav-item, :scope > .nav-item')]
      .find(li => li.querySelector(':scope > .nav-row > button > span')?.textContent === name);
    if (item && !last) {
      item.classList.add('is-open');
      item.querySelector(':scope > .nav-row > button').setAttribute('aria-expanded', 'true');
      scope = item.querySelector('.nav-sub');
      return;
    }
    const link = [...scope.querySelectorAll(':scope > li > a:not(.nav-self)')].find(a => a.textContent === name);
    if (link) link.setAttribute('aria-current', 'page');
  });
})();

// Аккордеон: на каждом уровне открыт один раздел, соседние сворачиваются вместе с вложенными
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

/* --- Подвал: те же группы и разделы --- */
document.getElementById('footer-nav').innerHTML = '<div class="fn-grid">' + NAV.filter(g => g.group && g.group !== 'Безопасность и контроль').map(g => `
  <div><h3>${g.group}</h3><ul>${g.items.map(it => `<li><a href="#">${it.t}</a></li>`).join('')}</ul></div>`).join('') + '</div>';

/* --- Соцсети (уникальные id для градиентов в каждой копии) --- */
const tpl = document.getElementById('tpl-socials').innerHTML;
document.querySelectorAll('[data-socials]').forEach(el => { el.innerHTML = tpl; });


/* --- Контакты школы. Это поля, которые школа заполняет в системе управления; любое может быть пустым.
       main — основной номер для кнопки в шапке (необязателен); phones/emails — списки любой длины;
       socials — названия соцсетей из шаблона tpl-socials --- */
const CONTACTS = {
  main: '8 (38822) 2-43-81',
  phones: [{ t: 'Секретарь', v: '8 (38822) 2-43-81' }, { t: 'Директор', v: '8 (38822) 2-45-65' }],
  emails: [{ v: 'licei1K@yandex.ru' }],
  address: { v: '649000, Республика Алтай, г.\u00a0Горно-Алтайск, ул.\u00a0Чорос-Гуркина, д.\u00a014', href: 'https://yandex.ru/maps/-/CXb2AT3K' },
  socials: ['ВКонтакте', 'Rutube', 'Одноклассники', 'Макс']
};
const CP_LIMIT = { phones: 4, emails: 3 };   /* сверх лимита — ссылка «Все контакты» */
const esc = t => String(t).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const telHref = v => { let d = v.replace(/\D/g, ''); if (d[0] === '8') d = '7' + d.slice(1); return 'tel:+' + d; };

function renderContacts(c) {
  const btn = document.querySelector('[data-contacts] .contacts-btn');
  btn.querySelector('.cb-main').textContent = c.main || '';
  btn.classList.toggle('no-main', !c.main);

  const item = (x, href, cls = '') =>
    `<div class="cp-item ${cls}">${x.t ? `<span>${esc(x.t)}</span>` : ''}<a href="${href}">${esc(x.v)}</a></div>`;
  const phones = c.phones || [], emails = c.emails || [];
  let html = '';
  html += phones.slice(0, CP_LIMIT.phones).map(x => item(x, telHref(x.v), 'cp-phone')).join('');
  html += emails.slice(0, CP_LIMIT.emails).map(x => item({ t: x.t || 'E-mail', v: x.v }, 'mailto:' + x.v)).join('');
  if (c.address) html += `<div class="cp-item"><span>Адрес</span>${c.address.href
    ? `<a href="${c.address.href}" target="_blank" rel="noopener">${esc(c.address.v)}</a>` : esc(c.address.v)}</div>`;
  if ((c.socials || []).length) {
    const box = document.createElement('div');
    box.innerHTML = tpl.replace(/(rt|mx)-(CLIP|GRAD)/g, '$1-$2-cp');
    [...box.children].forEach(a => { if (!c.socials.includes(a.getAttribute('aria-label'))) a.remove(); });
    html += `<div class="cp-item"><span>Мы в соцсетях</span><div class="socials">${box.innerHTML}</div></div>`;
  }
  if (phones.length > CP_LIMIT.phones || emails.length > CP_LIMIT.emails)
    html += `<a class="cp-all" href="#">Все контакты<i class="i i-right" aria-hidden="true"></i></a>`;
  document.getElementById('contacts-panel').innerHTML = html;
}
renderContacts(CONTACTS);

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

/* --- Слайдер: автопрокрутка останавливается после первого
       ручного переключения (стрелки, точки, свайп) до перезагрузки --- */
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
// плитки быстрого доступа, новости и обложки фото/видео за курсором (эксперимент «объём»): координаты курсора → CSS-переменные.
// У новостей и обложек координаты считаются по картинке — наклоняется и бликует только она.
// Слушаем на документе, а не на каждой карточке: так эффект есть и у карточек, которые страница дорисовывает скриптом
// (список новостей, «Читай также» — он пересобирается при смене ширины)
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
// Баннеры: увеличение ×1.5 при наведении — точка роста так, чтобы картинка оставалась в пределах сетки (не наезжала на заголовок и края)
document.querySelectorAll('.banner').forEach(b => {
  b.addEventListener('pointerenter', () => {
    const grid = b.closest('.banners').getBoundingClientRect(), r = b.getBoundingClientRect(), w = r.width, h = r.height;
    const k = 1 / (1.5 - 1);   // запас до края сетки, умноженный на k, — сколько точка роста может отойти от края
    const ox = Math.min(Math.max(w / 2, w - (grid.right - r.right) * k), (r.left - grid.left) * k);
    const oy = Math.min(Math.max(h / 2, h - (grid.bottom - r.bottom) * k), (r.top - grid.top) * k);
    b.querySelector('img').style.transformOrigin = `${ox}px ${oy}px`;
  });
});
// Настройки внешнего вида: цвета → переменные на <html>, скругления → data-radius; всё — в localStorage «look2».
// Цвет — либо по умолчанию, либо свой оттенок (hue): светлота и насыщенность фиксированы, поэтому любой оттенок остаётся читаемым
(() => {
  const fab = document.querySelector('.look-fab'), panel = document.getElementById('look'), form = panel.querySelector('.look-form');
  const root = document.documentElement;
  const DEF = { accent: '#1d4f91', text: null, nh: 257, nc: .04, radius: 'md' };
  const NEU_C = .03;   // насыщенность нейтральных при своём оттенке

  // --- OKLCH → hex с подгонкой в sRGB, контраст с белым ---
  const lin = c => (c /= 255) <= .04045 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4;
  const enc = x => { x = Math.min(Math.max(x, 0), 1); return Math.round(255 * (x <= .0031308 ? 12.92 * x : 1.055 * x ** (1 / 2.4) - .055)); };
  const fromLch = (L, C, H) => {   // уменьшаем насыщенность, пока цвет не влезет в sRGB
    for (let c = C; ; c -= .005) {
      const a = Math.max(c, 0) * Math.cos(H * Math.PI / 180), b = Math.max(c, 0) * Math.sin(H * Math.PI / 180);
      const l = (L + .3963377774 * a + .2158037573 * b) ** 3, m = (L - .1055613458 * a - .0638541728 * b) ** 3, s = (L - .0894841775 * a - 1.2914855480 * b) ** 3;
      const v = [4.0767416621 * l - 3.3077115913 * m + .2309699292 * s, -1.2684380046 * l + 2.6097574011 * m - .3413193965 * s, -.0041960863 * l - .7034186147 * m + 1.7076147010 * s];
      if (c <= 0 || v.every(x => x >= -.001 && x <= 1.001)) return '#' + v.map(x => enc(x).toString(16).padStart(2, '0')).join('');
    }
  };
  const contrast = h => { const [r, g, b] = [1, 3, 5].map(i => lin(parseInt(h.slice(i, i + 2), 16))); return 1.05 / (.2126 * r + .7152 * g + .0722 * b + .05); };
  // цвет темы/текста из оттенка: L .5, C .15, затемняем до контраста с белым ≥ 4.5 (WCAG AA)
  const hueColor = h => { let l = .5, out = fromLch(l, .15, h); while (contrast(out) < 4.5) out = fromLch(l -= .01, .15, h); return out; };
  const neuPreview = h => `oklch(.55 ${NEU_C * 2} ${h})`;   // для образца и дорожки — заметнее, чем сами серые
  const grad = f => `linear-gradient(90deg, ${Array.from({ length: 13 }, (_, i) => f(i * 30)).join(', ')})`;

  // --- состояние ---
  let st = { ...DEF };
  try { st = { ...DEF, ...JSON.parse(localStorage.getItem('look2') || '{}') }; } catch (e) {}
  const sliders = {}; panel.querySelectorAll('[data-hue]').forEach(r => sliders[r.dataset.hue] = r);
  sliders.accent.style.setProperty('--g', grad(hueColor));
  sliders.text.style.setProperty('--g', grad(hueColor));
  sliders.neutral.style.setProperty('--g', grad(neuPreview));
  panel.querySelector('[data-swatch="accent-default"]').style.setProperty('--c', DEF.accent);
  panel.querySelector('[data-swatch="neutral-default"]').style.setProperty('--c', `oklch(.55 ${DEF.nc * 1.5} ${DEF.nh})`);

  const apply = () => {
    const set = (k, v, d) => v != null && v !== d ? root.style.setProperty(k, v) : root.style.removeProperty(k);
    set('--brand', st.accent, DEF.accent);
    set('--text-accent', st.text, null);
    if (st.nh !== DEF.nh || st.nc !== DEF.nc) { root.style.setProperty('--nh', st.nh); root.style.setProperty('--nc', st.nc); }
    else { root.style.removeProperty('--nh'); root.style.removeProperty('--nc'); }
    if (st.radius !== DEF.radius) root.dataset.radius = st.radius; else delete root.dataset.radius;
    const save = {};
    for (const k of ['accent', 'text', 'radius', 'ah', 'th']) if (st[k] != null && st[k] !== DEF[k]) save[k] = st[k];
    if (st.nh !== DEF.nh || st.nc !== DEF.nc) { save.nh = st.nh; save.nc = st.nc; }
    try { localStorage.setItem('look2', JSON.stringify(save)); } catch (e) {}
  };
  // панель по состоянию: какой режим выбран, где ползунки, цвет образцов
  const sync = () => {
    const mode = { accent: st.accent !== DEF.accent, text: st.text != null, neutral: st.nh !== DEF.nh || st.nc !== DEF.nc };
    const hue = { accent: st.ah ?? DEF.nh, text: st.th ?? DEF.nh, neutral: mode.neutral ? st.nh : DEF.nh };
    for (const k in mode) {
      form.querySelector(`input[name="${k}"][value="${mode[k] ? 'hue' : 'default'}"]`).checked = true;
      sliders[k].value = hue[k];
      sliders[k].classList.toggle('is-off', !mode[k]);
      const c = k === 'neutral' ? neuPreview(hue[k]) : hueColor(hue[k]);
      sliders[k].style.setProperty('--c', c);
      panel.querySelector(`[data-swatch="${k}-hue"]`).style.setProperty('--c', c);
    }
    panel.querySelector('[data-swatch="text-default"]').style.setProperty('--c', st.accent);
    form.querySelector(`input[name="radius"][value="${st.radius}"]`).checked = true;
  };
  // свой оттенок группы → значения в состояние
  const setHue = (k, h) => {
    if (k === 'accent') { st.ah = h; st.accent = hueColor(h); }
    if (k === 'text') { st.th = h; st.text = hueColor(h); }
    if (k === 'neutral') { st.nh = h; st.nc = NEU_C; }
  };
  const setDefault = k => {
    if (k === 'accent') { st.accent = DEF.accent; delete st.ah; }
    if (k === 'text') { st.text = null; delete st.th; }
    if (k === 'neutral') { st.nh = DEF.nh; st.nc = DEF.nc; }
  };

  form.addEventListener('change', e => {
    const t = e.target;
    if (t.type !== 'radio') return;
    if (t.name === 'radius') st.radius = t.value;
    else if (t.value === 'hue') setHue(t.name, +sliders[t.name].value);
    else setDefault(t.name);
    apply(); sync();
  });
  form.addEventListener('input', e => {   // ползунок — сразу, пока его двигают; трогать его — значит выбрать «Свой оттенок»
    const k = e.target.dataset.hue; if (!k) return;
    setHue(k, +e.target.value);
    apply(); sync();
  });
  form.addEventListener('reset', e => { e.preventDefault(); st = { ...DEF }; apply(); sync(); });
  sync();

  const toggle = open => { panel.hidden = !open; fab.setAttribute('aria-expanded', open); if (open) panel.querySelector('input:checked').focus({ preventScroll: true }); };
  fab.addEventListener('click', () => toggle(panel.hidden));
  panel.querySelector('.look-close').addEventListener('click', () => { toggle(false); fab.focus(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !panel.hidden) { toggle(false); fab.focus(); } });
  document.addEventListener('pointerdown', e => { if (!panel.hidden && !panel.contains(e.target) && !fab.contains(e.target)) toggle(false); });
})();
