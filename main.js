(function () {
  var root = document.documentElement;
  var lang = root.getAttribute('data-lang') === 'en' ? 'en' : 'es';

  /* Texto que se genera desde el script */
  var T = {
    es: {
      count: function (n, total) { return 'Mostrando ' + n + ' de ' + total + ' regiones'; },
      water: 'Agua (ml)',
      cup: 'Bebida en taza (ml)',
      locale: 'es-ES',
      waterName: 'Agua', cupName: 'Bebida en taza', coffeeName: 'Café molido', ratioName: 'Proporción', tempName: 'Temperatura', timeName: 'Tiempo', grindName: 'Molienda', yieldName: 'Rinde', stepsName: 'Paso a paso',
      cups: function (n, ml) { return '≈ ' + n + (n <= 1 ? ' taza' : ' tazas') + ' de ' + ml + ' ml'; },
      copied: '¡Copiado!', copyFail: 'No se pudo copiar',
      status: function (g, c) { return 'Café molido: ' + g + ' gramos. Rinde ' + c + '.'; }
    },
    en: {
      count: function (n, total) { return 'Showing ' + n + ' of ' + total + ' regions'; },
      water: 'Water (ml)',
      cup: 'Liquid in the cup (ml)',
      locale: 'en-US',
      waterName: 'Water', cupName: 'Liquid in the cup', coffeeName: 'Ground coffee', ratioName: 'Ratio', tempName: 'Temperature', timeName: 'Time', grindName: 'Grind', yieldName: 'Yield', stepsName: 'Step by step',
      cups: function (n, ml) { return '≈ ' + n + (n <= 1 ? ' cup' : ' cups') + ' of ' + ml + ' ml'; },
      copied: 'Copied!', copyFail: 'Could not copy',
      status: function (g, c) { return 'Ground coffee: ' + g + ' grams. Yield ' + c + '.'; }
    }
  };

  /* ratio = ml de agua (o de bebida) por gramo de café */
  var METHODS = {
    v60: {
      amount: 300, ratio: 16, temp: '92–96 °C', time: '2:30–3:00', yieldLabel: 'water',
      grind: { es: 'Media-fina', en: 'Medium-fine' },
      tip: {
        es: 'Prueba un Nariño o un Cauca: la acidez cítrica se luce con el filtro de papel.',
        en: 'Try a Nariño or a Cauca: citrus acidity shines through a paper filter.'
      }
    },
    chemex: {
      amount: 500, ratio: 15, temp: '92–96 °C', time: '3:30–4:30', yieldLabel: 'water',
      grind: { es: 'Media-gruesa', en: 'Medium-coarse' },
      tip: {
        es: 'Un Huila o un Tolima da una taza limpia y frutal en jarra.',
        en: 'A Huila or a Tolima gives a clean, fruity cup in a carafe.'
      }
    },
    prensa: {
      amount: 500, ratio: 15, temp: '93–96 °C', time: '4:00', yieldLabel: 'water',
      grind: { es: 'Gruesa', en: 'Coarse' },
      tip: {
        es: 'Santander o Antioquia: el cuerpo y el cacao se mantienen con la prensa.',
        en: 'Santander or Antioquia: body and cocoa hold up in a French press.'
      }
    },
    aeropress: {
      amount: 220, ratio: 15, temp: '88–94 °C', time: '1:30–2:00', yieldLabel: 'water',
      grind: { es: 'Media-fina', en: 'Medium-fine' },
      tip: {
        es: 'Un Huila funciona bien: dulce y fácil de repetir.',
        en: 'A Huila works well: sweet and easy to repeat.'
      }
    },
    moka: {
      amount: 150, ratio: 9, yieldLabel: 'water',
      ratioText: { es: '≈ 1:9 (de 1:8 a 1:10)', en: '≈ 1:9 (1:8 to 1:10)' },
      temp: { es: 'Agua precalentada, ≈ 90 °C', en: 'Preheated water, ≈ 90 °C' },
      time: { es: '3–5 min', en: '3–5 min' },
      grind: { es: 'Media-fina, más gruesa que para espresso', en: 'Medium-fine, coarser than espresso' },
      tip: {
        es: 'Antioquia, Santander o el Eje Cafetero: chocolate y caramelo con cuerpo, que aguantan bien el calor directo.',
        en: 'Antioquia, Santander or Coffee Axis: full-bodied chocolate and caramel that stand up well to direct heat.'
      },
      extra: {
        pressure: { es: '≈ 1–1,5 bar (el espresso usa unos 9)', en: '≈ 1–1.5 bar (espresso uses about 9)' },
        heat: { es: 'Bajo a medio, con la tapa abierta', en: 'Low to medium, with the lid open' },
        roast: { es: 'Medio a medio-oscuro', en: 'Medium to medium-dark' },
        start: { es: 'Agua caliente, unos 90 °C o recién hervida', en: 'Hot water, about 90 °C or freshly boiled' }
      },
      steps: {
        es: [
          'Calienta agua aparte, recién hervida o a unos 90 °C, y llena la base hasta justo debajo de la válvula de seguridad. Nunca tapes ni superes la válvula.',
          'Llena el filtro con café molido medio-fino, al ras y sin prensar. Nivélalo con el dedo.',
          'Limpia el borde del filtro y enrosca la parte superior. Usa un paño, porque la base ya está caliente.',
          'Pon la cafetera a fuego bajo o medio, con la tapa abierta. El café tarda de 3 a 5 minutos en subir.',
          'Cuando el chorro se aclare y empiece a burbujear o sisear, retírala del fuego.',
          'Enfría la base unos segundos con un paño húmedo para cortar la extracción. Remueve el café y sírvelo enseguida.'
        ],
        en: [
          'Heat water separately, freshly boiled or at about 90 °C, and fill the base to just below the safety valve. Never cover or exceed the valve.',
          'Fill the basket with medium-fine ground coffee, level and without tamping. Level it with your finger.',
          'Wipe the basket rim and screw on the top chamber. Use a cloth, because the base is already hot.',
          'Put the pot on low to medium heat, with the lid open. The coffee takes 3 to 5 minutes to rise.',
          'When the stream turns pale and starts to bubble or hiss, take it off the heat.',
          'Cool the base for a few seconds with a damp cloth to stop the extraction. Stir the coffee and serve right away.'
        ]
      },
      note: {
        es: 'Los gramos son una guía. En una moka manda el filtro: llénalo al ras y llena la base hasta la válvula, sin presionar el café.',
        en: 'The grams are a guide. In a moka pot the basket decides: fill it level and fill the base up to the valve, without tamping the coffee.'
      }
    },
    espresso: {
      amount: 36, ratio: 2, temp: '92–94 °C', time: '25–30 s', yieldLabel: 'cup',
      grind: { es: 'Fina', en: 'Fine' },
      tip: {
        es: 'Antioquia o Eje Cafetero: chocolate y caramelo con poco amargor.',
        en: 'Antioquia or Coffee Axis: chocolate and caramel with little bitterness.'
      }
    }
  };

  /* Filtro de regiones por nota de sabor */
  var chips = document.querySelectorAll('.chip');
  var cards = document.querySelectorAll('.region');
  var count = document.getElementById('count');
  var shown = cards.length;

  function renderCount() {
    count.textContent = T[lang].count(shown, cards.length);
  }

  function applyFilter(tag) {
    shown = 0;
    cards.forEach(function (card) {
      var tags = (card.getAttribute('data-notes') || '').split(' ');
      var show = tag === 'todas' || tags.indexOf(tag) > -1;
      card.hidden = !show;
      if (show) { shown += 1; }
    });
    renderCount();
  }

  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      chips.forEach(function (c) { c.setAttribute('aria-pressed', 'false'); });
      chip.setAttribute('aria-pressed', 'true');
      applyFilter(chip.getAttribute('data-tag'));
    });
  });

  /* Calculadora */
  var method = document.getElementById('method');
  var amount = document.getElementById('amount');
  var amountLabel = document.getElementById('amountLabel');

  function pick(v) { return (v && typeof v === 'object') ? v[lang] : v; }

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var CUP = { v60: 220, chemex: 240, prensa: 240, aeropress: 200, moka: 50, espresso: 36 };
  var shown = {};
  var coffeeNow = null;
  var rafId = 0;
  var srTimer = 0;

  function flash(el) {
    if (reduceMotion) { return; }
    el.classList.remove('upd');
    void el.offsetWidth;
    el.classList.add('upd');
  }

  /* Cambia el texto y marca el cambio con una animación breve (no en la primera pintura) */
  function setText(id, text) {
    var el = document.getElementById(id);
    var first = shown[id] === undefined;
    if (shown[id] === text) { return; }
    shown[id] = text;
    el.textContent = text;
    if (!first) { flash(el); }
  }

  /* La cifra de café cuenta hasta el nuevo valor en unos 250 ms */
  function setCoffee(g, fmt) {
    var el = document.getElementById('outCoffee');
    cancelAnimationFrame(rafId);
    if (g === null) { el.textContent = '—'; coffeeNow = null; return; }
    if (reduceMotion || coffeeNow === null || coffeeNow === g) { el.textContent = fmt.format(g) + ' g'; coffeeNow = g; return; }
    var from = coffeeNow, t0 = performance.now();
    flash(el);
    (function step(now) {
      var p = Math.min(1, (now - t0) / 260);
      var e = 1 - Math.pow(1 - p, 3);
      coffeeNow = from + (g - from) * e;
      el.textContent = fmt.format(coffeeNow) + ' g';
      if (p < 1) { rafId = requestAnimationFrame(step); } else { coffeeNow = g; }
    })(t0);
  }

  /* Tazas aproximadas: agua menos lo que absorbe el café (≈ 2 g por g), entre el tamaño de taza */
  function cupsFor(key, ml, g) {
    var m = METHODS[key];
    var liquid = m.yieldLabel === 'cup' ? ml : Math.max(0, ml - 2 * g);
    var n = Math.round((liquid / CUP[key]) * 2) / 2;
    if (n < 0.5) { n = 0.5; }
    return n;
  }

  function renderCalc() {
    var m = METHODS[method.value];
    var ml = parseFloat(amount.value);
    var fmt = new Intl.NumberFormat(T[lang].locale, { maximumFractionDigits: 1 });
    var grams = (isFinite(ml) && ml > 0) ? ml / m.ratio : null;
    setCoffee(grams, fmt);
    var cupsText = '—';
    if (grams !== null) {
      cupsText = T[lang].cups(fmt.format(cupsFor(method.value, ml, grams)), CUP[method.value]);
    }
    setText('outCups', cupsText);
    setText('outRatio', m.ratioText ? pick(m.ratioText) : '1:' + m.ratio);
    setText('outTemp', pick(m.temp));
    setText('outTime', pick(m.time));
    setText('outGrind', pick(m.grind));
    setText('outTip', pick(m.tip));
    clearTimeout(srTimer);
    srTimer = setTimeout(function () {
      document.getElementById('srStatus').textContent = grams === null ? '' : T[lang].status(fmt.format(grams), cupsText);
    }, 700);
    amountLabel.textContent = m.yieldLabel === 'cup' ? T[lang].cup : T[lang].water;

    /* Datos técnicos adicionales, solo para los métodos que los definen */
    var extra = m.extra;
    document.querySelectorAll('.extra').forEach(function (el) { el.hidden = !extra; });
    if (extra) {
      setText('outPressure', pick(extra.pressure));
      setText('outHeat', pick(extra.heat));
      setText('outRoast', pick(extra.roast));
      setText('outStart', pick(extra.start));
    }

    /* Paso a paso, solo para los métodos que lo definen */
    var howto = document.getElementById('howto');
    var list = document.getElementById('outSteps');
    howto.hidden = !m.steps;
    list.textContent = '';
    if (m.steps) {
      m.steps[lang].forEach(function (s) {
        var li = document.createElement('li');
        li.textContent = s;
        list.appendChild(li);
      });
      document.getElementById('outNote').textContent = pick(m.note);
    }
  }

  method.addEventListener('change', function () {
    amount.value = METHODS[method.value].amount;
    renderCalc();
  });
  amount.addEventListener('input', renderCalc);

  /* Copiar la receta */
  var toast = document.getElementById('toast');
  var toastTimer = 0;
  function showToast(text) {
    toast.textContent = text;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove('show'); }, 1800);
  }

  function recipeText() {
    var m = METHODS[method.value];
    var ml = parseFloat(amount.value);
    var fmt = new Intl.NumberFormat(T[lang].locale, { maximumFractionDigits: 1 });
    var t = T[lang];
    var opt = method.options[method.selectedIndex];
    var g = (isFinite(ml) && ml > 0) ? ml / m.ratio : null;
    var lines = ['Lote Col · ' + opt.getAttribute('data-' + lang)];
    lines.push((m.yieldLabel === 'cup' ? t.cupName : t.waterName) + ': ' + (isFinite(ml) ? fmt.format(ml) : '—') + ' ml');
    lines.push(t.coffeeName + ': ' + (g === null ? '—' : fmt.format(g) + ' g'));
    lines.push(t.ratioName + ': ' + (m.ratioText ? pick(m.ratioText) : '1:' + m.ratio));
    lines.push(t.tempName + ': ' + pick(m.temp) + ' · ' + t.timeName + ': ' + pick(m.time));
    lines.push(t.grindName + ': ' + pick(m.grind));
    if (g !== null) { lines.push(t.yieldName + ': ' + T[lang].cups(fmt.format(cupsFor(method.value, ml, g)), CUP[method.value])); }
    if (m.steps) {
      lines.push('', t.stepsName + ':');
      m.steps[lang].forEach(function (st, i) { lines.push((i + 1) + '. ' + st); });
    }
    lines.push('', 'lote-col.com');
    return lines.join('\n');
  }

  function fallbackCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.cssText = 'position:fixed;left:-9999px;top:0;opacity:0';
    document.body.appendChild(ta);
    ta.select();
    var ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    document.body.removeChild(ta);
    return ok;
  }

  document.getElementById('copyBtn').addEventListener('click', function () {
    var text = recipeText();
    function done(ok) { showToast(ok ? T[lang].copied : T[lang].copyFail); }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(fallbackCopy(text)); });
    } else {
      done(fallbackCopy(text));
    }
  });

  /* Idioma */
  var langButtons = document.querySelectorAll('[data-set-lang]');

  function setLang(next, persist) {
    lang = next === 'en' ? 'en' : 'es';
    root.setAttribute('data-lang', lang);
    root.setAttribute('lang', lang);
    langButtons.forEach(function (b) {
      b.setAttribute('aria-pressed', b.getAttribute('data-set-lang') === lang ? 'true' : 'false');
    });
    document.querySelectorAll('[data-label-es]').forEach(function (el) {
      el.setAttribute('aria-label', el.getAttribute('data-label-' + lang));
    });
    document.querySelectorAll('#method option').forEach(function (opt) {
      opt.textContent = opt.getAttribute('data-' + lang);
    });
    renderCount();
    shown = {};
    coffeeNow = null;
    renderCalc();
    if (persist) {
      try { localStorage.setItem('lote-lang', lang); } catch (e) { /* sin almacenamiento */ }
    }
  }

  langButtons.forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.getAttribute('data-set-lang'), true); });
  });

  /* Navegación de la cabecera: marca la sección que se está viendo */
  var tabLinks = document.querySelectorAll('.top nav a');
  if ('IntersectionObserver' in window && tabLinks.length) {
    var ids = ['regiones', 'variedades', 'proceso', 'preparar'];
    var visible = {};
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { visible[e.target.id] = e.isIntersecting; });
      var current = ids.filter(function (id) { return visible[id]; })[0];
      tabLinks.forEach(function (a) {
        if (current && a.getAttribute('href') === '#' + current) { a.setAttribute('aria-current', 'true'); }
        else { a.removeAttribute('aria-current'); }
      });
    }, { rootMargin: '-35% 0px -55% 0px' });
    ids.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) { io.observe(el); }
    });
  }

  setLang(lang, false);
})();
