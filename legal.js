/* Idioma en las páginas legales: misma lógica que main.js, sin la parte de la calculadora */
(function () {
  var root = document.documentElement;
  var buttons = document.querySelectorAll('[data-set-lang]');
  function setLang(next, persist) {
    var lang = next === 'en' ? 'en' : 'es';
    root.setAttribute('data-lang', lang);
    root.setAttribute('lang', lang);
    document.title = document.body.getAttribute('data-title-' + lang) || document.title;
    buttons.forEach(function (b) {
      b.setAttribute('aria-pressed', b.getAttribute('data-set-lang') === lang ? 'true' : 'false');
    });
    document.querySelectorAll('[data-label-es]').forEach(function (el) {
      el.setAttribute('aria-label', el.getAttribute('data-label-' + lang));
    });
    if (persist) {
      try { localStorage.setItem('lote-lang', lang); } catch (e) { /* sin almacenamiento */ }
    }
  }
  buttons.forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.getAttribute('data-set-lang'), true); });
  });
  setLang(root.getAttribute('data-lang'), false);
})();
