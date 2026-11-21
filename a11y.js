/* ============================================================
   ВЕРСИЯ ДЛЯ СЛАБОВИДЯЩИХ: включение, панель настроек, сохранение выбора.
   Подключается в <head>: сохранённые настройки применяются до первой отрисовки, без мигания.
   Тема, шрифт заголовков и скругления сайта в этом режиме не мешают: его значения в tokens.css (раздел 9) сильнее.
   Режим — атрибуты на <html>: data-a11y (включён), data-a11y-scheme (цвета), data-a11y-img (изображения), data-a11y-font (шрифт);
   размер и интервалы — переменные --a11y-k / --a11y-hk, --a11y-ls / --a11y-hls, --a11y-lh / --a11y-hlh (текст / заголовки).
   Как они меняют вид — tokens.css (раздел 9) и site.css (раздел 22).
   Включают режим переключатели [data-a11y] (в сайдбаре), выключает — кнопка «К обычному виду» в панели.
   Всё хранится в localStorage «a11y5»
   ============================================================ */

const A11Y_KEY = 'a11y5';
const A11Y_V = 2;   // версия формата настроек: размеры теперь в процентах — сохранённые раньше значения в px не подходят
const A11Y_DEFAULT = { v: A11Y_V, on: false, size: 115, hsize: 100, scheme: 'bw', img: 'on', ls: 1, hls: 1, lh: 15, hlh: 12, font: 'sans', open: true };
/* Размеры — в процентах от обычного размера на сайте: 100% — как в обычной версии. У заголовков обычный размер ещё и меняется
   с шириной экрана, поэтому пиксели ничего не говорят. size / hsize — текст / заголовки, шаг 5%;
   ls / hls — буквы, шаг 0,02em; lh / hlh — межстрочный текста / заголовков × 10 */
const A11Y_RANGE = { size: [100, 150], hsize: [80, 150], ls: [0, 10], hls: [0, 10], lh: [12, 25], hlh: [10, 20] };
const A11Y_STEP = { size: 5, hsize: 5 };   // остальные — по 1

/* Цветовые схемы: цвета — в tokens.css ([data-a11y-scheme="…"]), здесь — названия (для экранного диктора и всплывающей подсказки) */
const A11Y_SCHEMES = [
  { id: 'bw', name: 'Чёрным по белому' },                // обычная контрастная схема
  { id: 'wb', name: 'Белым по чёрному' },                // светобоязнь, катаракта, глаукома
  { id: 'yb', name: 'Жёлтым по чёрному' },               // очень слабое зрение — самый высокий контраст
  { id: 'blue', name: 'Тёмно-синим по голубому' },       // мягкая схема из ГОСТ — утомляемость глаз
  { id: 'beige', name: 'Коричневым по бежевому' },       // дислексия, быстрая утомляемость
  { id: 'green', name: 'Зелёным по тёмно-коричневому' }, // тёмная схема из ГОСТ
];
const A11Y_IMG = [{ id: 'on', name: 'Показывать' }, { id: 'gray', name: 'Чёрно-белые' }, { id: 'off', name: 'Скрыть' }];
const A11Y_FONTS = [{ id: 'sans', name: 'Без засечек' }, { id: 'serif', name: 'С засечками' }];

function a11yLoad() {
  try {
    const saved = JSON.parse(localStorage.getItem(A11Y_KEY) || '{}');
    const st = saved.v === A11Y_V ? { ...A11Y_DEFAULT, ...saved } : { ...A11Y_DEFAULT, on: !!saved.on };   // старый формат — настройки по умолчанию
    for (const k in A11Y_RANGE) { const v = Number(st[k]); st[k] = Math.min(Math.max(Number.isFinite(v) ? v : A11Y_DEFAULT[k], A11Y_RANGE[k][0]), A11Y_RANGE[k][1]); }   // 0 — тоже значение
    if (!A11Y_SCHEMES.some(s => s.id === st.scheme)) st.scheme = A11Y_DEFAULT.scheme;
    return st;
  } catch (e) { return { ...A11Y_DEFAULT }; }
}
function a11ySave(st) { try { localStorage.setItem(A11Y_KEY, JSON.stringify(st)); } catch (e) { /* приватный режим — без сохранения */ } }

/* Применить настройки к странице; вызывается и до отрисовки, и из панели */
function a11yApply(st) {
  const root = document.documentElement;
  if (st.on) {
    root.dataset.a11y = '';
    root.dataset.a11yScheme = st.scheme;
    root.dataset.a11yImg = st.img;
    root.dataset.a11yFont = st.font;
    root.style.setProperty('--a11y-k', st.size / 100);
    root.style.setProperty('--a11y-hk', st.hsize / 100);
    root.style.setProperty('--a11y-ls', (st.ls * .02).toFixed(2) + 'em');
    root.style.setProperty('--a11y-hls', (st.hls * .02).toFixed(2) + 'em');
    root.style.setProperty('--a11y-lh', st.lh / 10);
    root.style.setProperty('--a11y-hlh', st.hlh / 10);
  } else {
    ['a11y', 'a11yScheme', 'a11yImg', 'a11yFont'].forEach(k => delete root.dataset[k]);
    ['--a11y-k', '--a11y-hk', '--a11y-ls', '--a11y-hls', '--a11y-lh', '--a11y-hlh'].forEach(p => root.style.removeProperty(p));
  }
  document.querySelectorAll('[data-a11y]:not(html)').forEach(b => b.setAttribute('aria-checked', st.on));
}
a11yApply(a11yLoad());   // сохранённый выбор — сразу, до отрисовки

/* ---------- панель настроек (макет в Figma): строка: слева «К обычному виду» и «Сбросить», справа «Свернуть»; три колонки — общие настройки, обычный текст, заголовки ---------- */
/* строка счётчика: подпись слева, значение и кнопки − / + справа */
const a11yStep = (key, label, minus, plus) => `
          <div class="a11y-row" role="group" aria-labelledby="a11y-l-${key}">
            <span class="a11y-label" id="a11y-l-${key}">${label}</span>
            <output class="a11y-value" data-a11y-out="${key}" aria-live="polite"></output>
            <button class="a11y-btn a11y-btn--sq" type="button" data-a11y-step="${key}" data-d="-1" aria-label="${minus}">−</button>
            <button class="a11y-btn a11y-btn--sq" type="button" data-a11y-step="${key}" data-d="1" aria-label="${plus}">+</button>
          </div>`;
/* группа вариантов: заголовок группы, под ним кнопки */
const a11yChoice = (key, label, items) => `
        <div class="a11y-group">
          <h2 class="a11y-h" id="a11y-l-${key}">${label}</h2>
          <div class="a11y-seg" role="group" aria-labelledby="a11y-l-${key}">${items.map(x => `
            <button class="a11y-btn" type="button" data-a11y-set="${key}" data-v="${x.id}" aria-pressed="false">${x.name}</button>`).join('')}
          </div>
        </div>`;
const a11yHTML = () => `
  <section class="a11y-panel" aria-label="Настройки версии для слабовидящих">
    <div class="a11y-head">
      <div class="a11y-head-start"><button class="a11y-btn a11y-btn--strong a11y-exit" type="button" data-a11y-exit aria-label="К обычному виду"><i class="i i-left" aria-hidden="true"></i><span class="a11y-exit-text">К обычному виду</span></button><button class="a11y-btn" type="button" data-a11y-reset aria-label="Сбросить настройки"><span class="a11y-long">Сбросить настройки</span><span class="a11y-short">Сбросить</span></button></div>
      <div class="a11y-head-end">
        <button class="a11y-btn a11y-toggle" type="button" data-a11y-toggle aria-expanded="true" aria-controls="a11y-body"><span data-a11y-toggle-text>Свернуть</span><i class="i i-down" aria-hidden="true"></i></button>
      </div>
    </div>
    <div class="a11y-body" id="a11y-body">
      <div class="a11y-col">${a11yChoice('font', 'Шрифт', A11Y_FONTS)}${a11yChoice('img', 'Изображения', A11Y_IMG)}
        <div class="a11y-group">
          <h2 class="a11y-h" id="a11y-l-scheme">Цвет</h2>
          <div class="a11y-seg" role="group" aria-labelledby="a11y-l-scheme">${A11Y_SCHEMES.map(sc => `
            <button class="a11y-swatch" type="button" data-a11y-set="scheme" data-v="${sc.id}" data-a11y-scheme="${sc.id}" aria-pressed="false" aria-label="${sc.name}" title="${sc.name}">Аа</button>`).join('')}
          </div>
        </div>
      </div>
      <div class="a11y-col">
        <h2 class="a11y-h">Обычный текст</h2>
        <div class="a11y-rows">${a11yStep('size', 'Размер текста', 'Уменьшить текст', 'Увеличить текст')}${a11yStep('lh', 'Интервал строк', 'Уменьшить интервал между строками текста', 'Увеличить интервал между строками текста')}${a11yStep('ls', 'Межбуквенный интервал', 'Уменьшить интервал между буквами текста', 'Увеличить интервал между буквами текста')}
        </div>
      </div>
      <div class="a11y-col">
        <h2 class="a11y-h">Заголовки</h2>
        <div class="a11y-rows">${a11yStep('hsize', 'Размер заголовков', 'Уменьшить заголовки', 'Увеличить заголовки')}${a11yStep('hlh', 'Интервал строк', 'Уменьшить интервал между строками заголовков', 'Увеличить интервал между строками заголовков')}${a11yStep('hls', 'Межбуквенный интервал', 'Уменьшить интервал между буквами заголовков', 'Увеличить интервал между буквами заголовков')}
        </div>
      </div>
    </div>
  </section>`;

/* Подписи вместо картинок (режим «Скрыть»): после каждой картинки с непустым alt — текст этого alt; видны только в этом режиме */
const A11Y_NO_ALT = '.brand, .mini-brand, .gos-banner, .socials';   // логотипы и значки: подпись не нужна — рядом и так есть название
function a11yAlts(scope) {
  scope.querySelectorAll('img[alt]:not([alt=""])').forEach(img => {
    if (img.closest(A11Y_NO_ALT)) return;
    if (img.nextElementSibling && img.nextElementSibling.classList.contains('a11y-alt')) return;
    const s = document.createElement('span');
    s.className = 'a11y-alt'; s.setAttribute('aria-hidden', 'true');   // для диктора alt у картинки уже есть
    s.textContent = img.alt;
    img.after(s);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const main = document.querySelector('.main');
  if (!main) return;
  main.insertAdjacentHTML('afterbegin', a11yHTML());
  const panel = main.querySelector('.a11y-panel');
  let st = a11yLoad();

  const show = () => {
    const lhf = v => (v / 10).toFixed(1).replace('.', ','), pct = v => v + '%', lsf = v => (v ? '+' + v : '0');
    const fmt = { size: pct, hsize: pct, ls: lsf, hls: lsf, lh: lhf, hlh: lhf };
    panel.querySelectorAll('[data-a11y-out]').forEach(o => { const k = o.dataset.a11yOut; o.textContent = fmt[k](st[k]); });
    panel.querySelectorAll('[data-a11y-step]').forEach(b => {
      const k = b.dataset.a11yStep, d = +b.dataset.d;
      b.disabled = d < 0 ? st[k] <= A11Y_RANGE[k][0] : st[k] >= A11Y_RANGE[k][1];
    });
    panel.querySelectorAll('[data-a11y-set]').forEach(b => b.setAttribute('aria-pressed', st[b.dataset.a11ySet] === b.dataset.v));
    const tg = panel.querySelector('[data-a11y-toggle]');
    tg.setAttribute('aria-expanded', st.open);
    tg.querySelector('[data-a11y-toggle-text]').textContent = st.open ? 'Свернуть' : 'Развернуть';
    panel.querySelector('.a11y-body').hidden = !st.open;
  };
  const update = patch => { st = { ...st, ...patch }; a11ySave(st); a11yApply(st); show(); };

  document.addEventListener('click', e => {
    const t = e.target.closest('[data-a11y]:not(html), [data-a11y-exit], [data-a11y-toggle], [data-a11y-step], [data-a11y-set], [data-a11y-reset]');
    if (!t) return;
    if (t.matches('[data-a11y]')) update({ on: !st.on });            // переключатель в сайдбаре
    else if (t.matches('[data-a11y-exit]')) update({ on: false });
    else if (t.matches('[data-a11y-toggle]')) update({ open: !st.open });
    else if (t.matches('[data-a11y-step]')) {
      const k = t.dataset.a11yStep, [lo, hi] = A11Y_RANGE[k];
      update({ [k]: Math.min(Math.max(st[k] + +t.dataset.d * (A11Y_STEP[k] || 1), lo), hi) });
    }
    else if (t.matches('[data-a11y-set]')) update({ [t.dataset.a11ySet]: t.dataset.v });
    else if (t.matches('[data-a11y-reset]')) update({ ...A11Y_DEFAULT, on: true, open: st.open });
  });

  a11yAlts(document);
  new MutationObserver(ms => ms.forEach(m => m.addedNodes.forEach(n => { if (n.nodeType === 1) a11yAlts(n.parentNode || n); })))
    .observe(document.body, { childList: true, subtree: true });   // карточки, которые страница дорисовывает скриптом
  a11yApply(st);
  show();
});
