/* ============================================================
   ТОЛЬКО ДЛЯ ДЕМО: панель «Внешний вид» — подбор темы, шрифта заголовков и скруглений на согласовании.
   На настоящий сайт не переносится (вместе с demo-look.css и тегом <demo-look> на страницах).
   Подключается в <head>: сохранённый выбор применяется до первой отрисовки, без мигания.
   Тема — блок значений в tokens.css, панель только ставит атрибут data-theme на <html>; так же тему будет включать админка.
   Шрифт — переменная --font-head, скругления — атрибут data-radius; всё хранится в localStorage «look3»
   ============================================================ */

const LOOK_KEY = 'look3';
const LOOK_DEFAULT = { theme: 'base', font: 'PT Serif', radius: 'md' };   // base — исходная тема: значения из :root в tokens.css, атрибут не нужен

/* Темы для панели: идентификатор совпадает с блоком [data-theme="…"] в tokens.css, цвета живут только там.
   В холодных и тёплых первые 5 — белый фон и бледное меню, следующие 5 — цветной фон и насыщенное меню */
const LOOK_THEMES = [
  { id: 'base', group: 'base', name: 'Исходная' },
  { id: 'gray', group: 'base', name: 'Серая' },
  { id: 'ice', group: 'cold', name: 'Лёд' },
  { id: 'mint', group: 'cold', name: 'Мята' },
  { id: 'lilac', group: 'cold', name: 'Сирень' },
  { id: 'sky', group: 'cold', name: 'Небо' },
  { id: 'mist', group: 'cold', name: 'Туман' },
  { id: 'ocean', group: 'cold', name: 'Океан' },
  { id: 'pine', group: 'cold', name: 'Хвоя' },
  { id: 'indigo', group: 'cold', name: 'Индиго' },
  { id: 'teal', group: 'cold', name: 'Бирюза' },
  { id: 'sapphire', group: 'cold', name: 'Сапфир' },
  { id: 'sand', group: 'warm', name: 'Песок' },
  { id: 'ruby', group: 'warm', name: 'Рубин' },
  { id: 'cedar', group: 'warm', name: 'Кедр' },
  { id: 'peach', group: 'warm', name: 'Персик' },
  { id: 'rose', group: 'warm', name: 'Роза' },
  { id: 'clay', group: 'warm', name: 'Глина' },
  { id: 'wine', group: 'warm', name: 'Бордо' },
  { id: 'bark', group: 'warm', name: 'Кора' },
  { id: 'sunset', group: 'warm', name: 'Закат' },
  { id: 'raspberry', group: 'warm', name: 'Малина' },
];

/* Шрифты заголовков из Google Fonts, все с кириллицей и начертаниями 400 и 700. PT Serif — шрифт по умолчанию, он уже подключён на страницах */
const LOOK_FONTS = [
  { name: 'Onest', family: "'Onest', system-ui, sans-serif" },
  { name: 'Google Sans', family: "'Google Sans', system-ui, sans-serif" },
  { name: 'Arimo', family: "'Arimo', Arial, sans-serif" },
  { name: 'PT Serif', family: "'PT Serif', Georgia, serif" },
  { name: 'M PLUS Rounded 1c', family: "'M PLUS Rounded 1c', system-ui, sans-serif" },
  { name: 'Merriweather', family: "'Merriweather', Georgia, serif" },
];
const lookFontUrl = names => 'https://fonts.googleapis.com/css2?' + names.map(n => `family=${n.replace(/ /g, '+')}:wght@400;700`).join('&') + '&display=swap';
const lookLoadFonts = (names, id) => {
  if (document.getElementById(id)) return;
  const l = document.createElement('link');
  l.id = id; l.rel = 'stylesheet'; l.href = lookFontUrl(names);
  document.head.appendChild(l);
};

/* Применить выбор к странице; вызывается и до отрисовки, и из панели */
function lookApply(st) {
  const root = document.documentElement;
  if (st.theme !== 'base' && LOOK_THEMES.some(x => x.id === st.theme)) root.dataset.theme = st.theme; else delete root.dataset.theme;
  const f = LOOK_FONTS.find(x => x.name === st.font);
  if (f && f.name !== LOOK_DEFAULT.font) { lookLoadFonts([f.name], 'look-font-' + f.name.replace(/ /g, '-')); root.style.setProperty('--font-head', f.family); }
  else root.style.removeProperty('--font-head');
  if (st.radius !== LOOK_DEFAULT.radius) root.dataset.radius = st.radius; else delete root.dataset.radius;
}

function lookLoad() {
  try {
    const st = { ...LOOK_DEFAULT, ...JSON.parse(localStorage.getItem(LOOK_KEY) || '{}') };
    if (!LOOK_FONTS.some(f => f.name === st.font)) st.font = LOOK_DEFAULT.font;   // шрифт могли убрать из списка
    return st;
  } catch (e) { return { ...LOOK_DEFAULT }; }
}
lookApply(lookLoad());   // сохранённый выбор — сразу, до отрисовки

/* разметка панели */
const lookThemeGroup = (group, title) => `
      <p class="look-sub">${title}</p>
      <div class="themes">${LOOK_THEMES.filter(t => t.group === group).map(t => `
        <label class="theme"><input type="radio" name="theme" value="${t.id}"><span class="theme-box${t.id === 'base' ? ' theme-box--base' : ''}"${t.id === 'base' ? '' : ` data-theme="${t.id}"`}></span><span class="theme-name">${t.name}</span></label>`).join('')}
      </div>`;
const lookHTML = () => `
<button class="look-fab" type="button" aria-expanded="false" aria-controls="look" aria-label="Настройки внешнего вида"><i class="i i-sliders" aria-hidden="true"></i></button>
<div class="look" id="look" role="dialog" aria-labelledby="look-title" hidden>
  <div class="look-head">
    <h2 id="look-title">Внешний вид</h2>
    <button class="look-close" type="button" aria-label="Закрыть"><i class="i i-x" aria-hidden="true"></i></button>
  </div>
  <form class="look-form">
    <fieldset>
      <legend>Тема</legend>
      ${lookThemeGroup('base', 'Основные')}
      ${lookThemeGroup('cold', 'Холодные')}
      ${lookThemeGroup('warm', 'Тёплые')}
    </fieldset>
    <fieldset>
      <legend>Шрифт заголовков</legend>
      <div class="fonts">${LOOK_FONTS.map(f => `
        <label class="font"><input type="radio" name="font" value="${f.name}"><span class="font-box"><span class="font-sample" style="font-family:${f.family}">Объявления</span><span class="font-name">${f.name}</span></span></label>`).join('')}
      </div>
    </fieldset>
    <fieldset>
      <legend>Скругления</legend>
      <div class="segs">
        <label class="seg"><input type="radio" name="radius" value="lg"><span class="seg-box" style="--r: 16px">Большие</span></label>
        <label class="seg"><input type="radio" name="radius" value="md"><span class="seg-box" style="--r: 8px">Средние</span></label>
        <label class="seg"><input type="radio" name="radius" value="sm"><span class="seg-box" style="--r: 6px">Малые</span></label>
      </div>
    </fieldset>
    <button class="btn btn-secondary look-reset" type="reset">Сбросить</button>
  </form>
</div>`;

customElements.define('demo-look', class extends HTMLElement {
  connectedCallback() {
    this.outerHTML = lookHTML();
    initLook();
  }
});

function initLook() {
  const fab = document.querySelector('.look-fab'), panel = document.getElementById('look'), form = panel.querySelector('.look-form');
  let st = lookLoad();

  const save = () => {
    const out = {};
    for (const k in LOOK_DEFAULT) if (st[k] !== LOOK_DEFAULT[k]) out[k] = st[k];
    try { localStorage.setItem(LOOK_KEY, JSON.stringify(out)); } catch (e) {}
  };
  // отметить в панели текущий выбор; тема может быть не выбрана — тогда исходная палитра
  const sync = () => {
    form.querySelectorAll('input[name="theme"]').forEach(r => { r.checked = r.value === st.theme; });
    form.querySelector(`input[name="font"][value="${st.font}"]`).checked = true;
    form.querySelector(`input[name="radius"][value="${st.radius}"]`).checked = true;
  };

  form.addEventListener('change', e => {
    if (e.target.type !== 'radio') return;
    st[e.target.name] = e.target.value;
    lookApply(st); save();
  });
  form.addEventListener('reset', e => { e.preventDefault(); st = { ...LOOK_DEFAULT }; lookApply(st); save(); sync(); });
  sync();

  const toggle = open => {
    panel.hidden = !open; fab.setAttribute('aria-expanded', open);
    if (open) {
      lookLoadFonts(LOOK_FONTS.filter(f => f.name !== LOOK_DEFAULT.font).map(f => f.name), 'look-fonts-all');   // образцы всех шрифтов — только когда панель открыли
      panel.querySelector('input:checked').focus({ preventScroll: true });
    }
  };
  fab.addEventListener('click', () => toggle(panel.hidden));
  panel.querySelector('.look-close').addEventListener('click', () => { toggle(false); fab.focus(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !panel.hidden) { toggle(false); fab.focus(); } });
  document.addEventListener('pointerdown', e => { if (!panel.hidden && !panel.contains(e.target) && !fab.contains(e.target)) toggle(false); });
}
