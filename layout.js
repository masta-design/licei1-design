/* ============================================================
   ОБЩИЕ ЧАСТИ СТРАНИЦ: сайдбар, шапка, подвал. Разметка — здесь, данные — в school-data.js, поведение — в site.js.
   На странице они стоят тегами-заглушками, которые при разборе страницы сразу заменяются готовой разметкой
   (до первой отрисовки — без мигания и сдвигов):

     <body data-nav="Наша жизнь/Новости">        ← путь к текущей странице в меню: разделы на пути раскрыты, пункт подсвечен
     <div class="app">
       <site-sidebar></site-sidebar>
       <div class="main">
         <site-header></site-header>
         <main class="content"> … контент страницы … </main>
         <site-footer></site-footer>
       </div>
     </div>

   Подключается в <head> после school-data.js и components.js. В CMS это станут общие шаблоны (include) с той же разметкой
   ============================================================ */

/* заглушка <tag> заменяется разметкой html() в момент, когда парсер вставляет её в документ */
const definePart = (tag, html) => customElements.define(tag, class extends HTMLElement {
  connectedCallback() { this.outerHTML = html(); }
});

const a11ySwitch = `<button class="btn btn-lg btn-a11y" type="button" role="switch" aria-checked="false" data-a11y><span class="switch" aria-hidden="true"></span><span>Версия для<br>слабовидящих</span></button>`;
const loginIcon = `<i class="i i-login" aria-hidden="true"></i>`;

/* --- Меню сайдбара из NAV. path — путь к текущей странице внутри этого уровня, например ['Наша жизнь', 'Новости']:
       раздел на пути раскрыт, сама страница — aria-current. Раздел с подпунктами — кнопка, раскрывающая список;
       первая ссылка в списке — страница самого раздела (как на текущем сайте) --- */
function navItem(it, id, top, path) {
  const hasSub = it.c && it.c.length;
  const open = hasSub && path.length > 1 && path[0] === it.t;
  const current = path.length === 1 && path[0] === it.t;
  const label = `<span>${esc(it.t)}${it.hint ? ` <span class="hint">· ${esc(it.hint)}</span>` : ''}</span>`;
  if (!hasSub && !top) return `<li><a href="${it.href || '#'}"${current ? ' aria-current="page"' : ''}>${esc(it.t)}</a></li>`;
  const sub = [`<li><a href="#" class="nav-self">${esc(it.t)}</a></li>`]
    .concat((it.c || []).map((s, si) => navItem(typeof s === 'string' ? { t: s } : s, `${id}-${si}`, false, open ? path.slice(1) : [])));
  return `<li class="nav-item${open ? ' is-open' : ''}${current && !hasSub ? ' is-active' : ''}">
    <div class="nav-row">
      ${hasSub
        ? `<button type="button" aria-expanded="${open}" aria-controls="${id}">${label}<i class="i chev i-down" aria-hidden="true"></i></button>`
        : `<a href="${it.href || '#'}"${current ? ' aria-current="page"' : ''}>${label}</a>`}
    </div>
    ${hasSub ? `<div class="nav-sub-wrap"><ul class="nav-sub" id="${id}">${sub.join('')}</ul></div>` : ''}
  </li>`;
}
const navHTML = path => NAV.map((g, gi) => `
  ${g.group ? `<div class="nav-group-label">${esc(g.group)}</div>` : ''}
  <ul>${g.items.map((it, ii) => navItem(it, `sub-${gi}-${ii}`, true, path)).join('')}</ul>`).join('');

/* --- Контакты — этаж шапки под поиском. Слева адрес и телефоны (на больших экранах телефоны переходят направо — это делает CSS), справа почта и соцсети; у каждого пункта есть подпись.
       Подпись телефона и почты берётся из x.t, а если её нет — «Телефон» и «E-mail».
       Пустые поля не выводятся, нет данных совсем — нет и этажа; длинные списки обрезаются ссылкой «Все контакты».
       Как пункты переносятся и где стоит подпись — в site.css, раздел «Контакты» --- */
function contactsBarHTML(c) {
  const item = (label, value, cls = '') => `<div class="tbc-item${cls ? ' ' + cls : ''}"><span class="tbc-label">${esc(label)}</span><div class="tbc-value">${value}</div></div>`;
  const phones = c.phones || [], emails = c.emails || [];
  const left = [
    c.address && item('Адрес', c.address.href ? `<a href="${c.address.href}" target="_blank" rel="noopener">${esc(c.address.v)}</a>` : esc(c.address.v), 'tbc-address'),
    phones.length && `<div class="tbc-group">${phones.slice(0, CONTACTS_LIMIT.phones).map(x => item(x.t || 'Телефон', `<a class="tbc-phone" href="${telHref(x.v)}">${esc(x.v)}</a>`)).join('')}</div>`,
    (phones.length > CONTACTS_LIMIT.phones || emails.length > CONTACTS_LIMIT.emails) && `<a class="more" href="#">Все контакты <i class="i i-right" aria-hidden="true"></i></a>`,
  ].filter(Boolean).join('');
  const right = [
    ...emails.slice(0, CONTACTS_LIMIT.emails).map(x => item(x.t || 'E-mail', `<a href="mailto:${x.v}">${esc(x.v)}</a>`)),
    (c.socials || []).length && item('Мы в соцсетях', `<div class="socials socials--mono">${socialsHTML(c.socials, { mono: true })}</div>`, 'tbc-socials'),
  ].filter(Boolean).join('');
  if (!left && !right) return '';
  return `<address class="tb-contacts">${left ? `<div class="tbc-group tbc-left">${left}</div>` : ''}${right ? `<div class="tbc-group tbc-right">${right}</div>` : ''}</address>`;
}

/* ================= Сайдбар (+ затемнение и крестик мобильного меню) =================
   Первая ссылка страницы — «Перейти к содержимому»: видна только при фокусе с клавиатуры, позволяет пропустить меню.
   Ведёт на <main id="main"> — он должен быть на каждой странице */
definePart('site-sidebar', () => `
  <a class="btn btn-primary skip-link" href="#main">Перейти к содержимому</a>
  <aside class="sidebar" id="sidebar" aria-label="Основная навигация">
    <div class="brand-wrap">
      <a class="brand" href="./" title="На главную">
        <img src="${SCHOOL.logo}" alt="${esc(SCHOOL.logoAlt)}">
        <span><span class="brand-name">${esc(SCHOOL.name)}</span></span>
      </a>
    </div>
    <nav class="nav" id="nav">${navHTML((document.body.dataset.nav || '').split('/').filter(Boolean))}</nav>
    <!-- мобильный сайдбар: кнопки из шапки — внизу, закреплены от прокрутки -->
    <div class="side-tools">
      ${a11ySwitch}
      <a class="btn btn-secondary" href="#">${loginIcon}Войти</a>
    </div>
  </aside>
  <div class="scrim" data-nav-close></div>
  <button class="btn btn-lg btn-icon nav-close" type="button" aria-label="Закрыть меню" data-nav-close><i class="i i-x" aria-hidden="true"></i></button>`);

/* ================= Шапка: кнопка меню и логотип (на узких экранах), поиск, «Версия для слабовидящих», «Войти»; ниже — этаж с контактами ================= */
definePart('site-header', () => `
  <header class="topbar">
    <div class="tb-main">
      <button class="btn btn-lg btn-icon btn-primary burger" type="button" aria-label="Открыть меню" aria-controls="sidebar" aria-expanded="false" data-nav-open><i class="i i-menu" aria-hidden="true"></i></button>
      <a class="mini-brand" href="./" title="На главную">
        <img src="${SCHOOL.logo}" alt="">
        <span class="brand-name">${esc(SCHOOL.name)}</span>
      </a>
      <form class="search" role="search" onsubmit="return false">
        <label class="sr-only" for="q">Поиск по сайту</label>
        <i class="i i-search" aria-hidden="true"></i>
        <input id="q" type="search" placeholder="Поиск по сайту">
      </form>
      <button class="btn btn-lg btn-icon btn-secondary search-toggle" type="button" aria-label="Открыть поиск" aria-controls="q" aria-expanded="false" data-search-toggle>
        <i class="i ico-open i-search" aria-hidden="true"></i><i class="i ico-close i-x" aria-hidden="true"></i>
      </button>
    </div>
    <div class="tb-tools">
      ${a11ySwitch}
      <a class="btn btn-lg btn-secondary btn-login" href="#">${loginIcon}Войти</a>
    </div>
    ${contactsBarHTML(CONTACTS)}
  </header>`);

/* ================= Подвал: копирайт, «Карта сайта» и соцсети ================= */
definePart('site-footer', () => `
  <footer class="footer">
    <div class="footer-bottom">
      <span>${esc(SCHOOL.copyright)}</span>
      <nav aria-label="Служебные ссылки"><a href="#">Карта сайта</a></nav>
      ${(CONTACTS.socials || []).length ? `<div class="socials socials--mono" aria-label="Мы в соцсетях" role="group">${socialsHTML(CONTACTS.socials, { mono: true })}</div>` : ''}
    </div>
  </footer>`);
