/* ============================================================
   ТОЛЬКО ДЛЯ ДЕМО: панель «Внешний вид» — подбор цвета темы, нейтральных цветов, цвета текста и скруглений на согласовании.
   На настоящий сайт не переносится (вместе с demo-look.css и тегом <demo-look> на страницах).
   Подключается в <head>: сохранённый выбор применяется до первой отрисовки, без мигания.
   Цвета — переменные на <html> (--brand, --text-brand, --nh, --nc), скругления — атрибут data-radius; всё — в localStorage «look2».
   Цвет — либо по умолчанию, либо свой оттенок (hue): светлота и насыщенность фиксированы, поэтому любой оттенок остаётся читаемым
   ============================================================ */

const LOOK_KEY = 'look2';
const LOOK_DEFAULT = { accent: '#1d4f91', text: null, nh: 257, nc: .04, radius: 'md' };   // = значения в tokens.css

/* сохранённый выбор — сразу, до отрисовки */
try {
  const a = JSON.parse(localStorage.getItem(LOOK_KEY) || '{}'), st = document.documentElement.style;
  if (a.accent) st.setProperty('--brand', a.accent);
  if (a.text) st.setProperty('--text-brand', a.text);
  if (a.nh != null) { st.setProperty('--nh', a.nh); st.setProperty('--nc', a.nc); }
  if (a.radius) document.documentElement.dataset.radius = a.radius;
} catch (e) {}

/* разметка панели: группа цвета — «По умолчанию» / «Свой оттенок» + слайдер оттенка */
const lookColorGroup = (name, legend, defLabel, aria) => `
    <fieldset>
      <legend>${legend}</legend>
      <div class="mode">
        <label><input type="radio" name="${name}" value="default" checked><span data-swatch="${name}-default">${defLabel}</span></label>
        <label><input type="radio" name="${name}" value="hue"><span data-swatch="${name}-hue">Свой оттенок</span></label>
      </div>
      <input class="hue is-off" type="range" min="0" max="359" step="1" value="257" data-hue="${name}" aria-label="${aria}">
    </fieldset>`;
const lookHTML = () => `
<button class="look-fab" type="button" aria-expanded="false" aria-controls="look" aria-label="Настройки внешнего вида"><i class="i i-sliders" aria-hidden="true"></i></button>
<div class="look" id="look" role="dialog" aria-labelledby="look-title" hidden>
  <div class="look-head">
    <h2 id="look-title">Внешний вид</h2>
    <button class="look-close" type="button" aria-label="Закрыть"><i class="i i-x" aria-hidden="true"></i></button>
  </div>
  <form class="look-form">
    ${lookColorGroup('accent', 'Цвет темы', 'По умолчанию', 'Оттенок цвета темы')}
    ${lookColorGroup('neutral', 'Нейтральные цвета', 'По умолчанию', 'Оттенок нейтральных цветов')}
    ${lookColorGroup('text', 'Цвет текста', 'Как тема', 'Оттенок цвета текста')}
    <fieldset>
      <legend>Скругления</legend>
      <div class="segs">
        <label class="seg"><input type="radio" name="radius" value="lg"><span class="seg-box" style="--r: 16px">Большие</span></label>
        <label class="seg"><input type="radio" name="radius" value="md" checked><span class="seg-box" style="--r: 8px">Средние</span></label>
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
  const root = document.documentElement;
  const DEF = LOOK_DEFAULT;
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
  try { st = { ...DEF, ...JSON.parse(localStorage.getItem(LOOK_KEY) || '{}') }; } catch (e) {}
  const sliders = {}; panel.querySelectorAll('[data-hue]').forEach(r => sliders[r.dataset.hue] = r);
  sliders.accent.style.setProperty('--g', grad(hueColor));
  sliders.text.style.setProperty('--g', grad(hueColor));
  sliders.neutral.style.setProperty('--g', grad(neuPreview));
  panel.querySelector('[data-swatch="accent-default"]').style.setProperty('--c', DEF.accent);
  panel.querySelector('[data-swatch="neutral-default"]').style.setProperty('--c', `oklch(.55 ${DEF.nc * 1.5} ${DEF.nh})`);

  const apply = () => {
    const set = (k, v, d) => v != null && v !== d ? root.style.setProperty(k, v) : root.style.removeProperty(k);
    set('--brand', st.accent, DEF.accent);
    set('--text-brand', st.text, null);
    if (st.nh !== DEF.nh || st.nc !== DEF.nc) { root.style.setProperty('--nh', st.nh); root.style.setProperty('--nc', st.nc); }
    else { root.style.removeProperty('--nh'); root.style.removeProperty('--nc'); }
    if (st.radius !== DEF.radius) root.dataset.radius = st.radius; else delete root.dataset.radius;
    const save = {};
    for (const k of ['accent', 'text', 'radius', 'ah', 'th']) if (st[k] != null && st[k] !== DEF[k]) save[k] = st[k];
    if (st.nh !== DEF.nh || st.nc !== DEF.nc) { save.nh = st.nh; save.nc = st.nc; }
    try { localStorage.setItem(LOOK_KEY, JSON.stringify(save)); } catch (e) {}
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
}
