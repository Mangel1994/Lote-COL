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
  /* Vibración breve en móviles compatibles (no en iOS Safari) */
  var lastBuzz = 0;
  function buzz(ms) {
    if (!navigator.vibrate || (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)) { return; }
    var now = Date.now();
    if (now - lastBuzz < 60) { return; }
    lastBuzz = now;
    try { navigator.vibrate(ms || 8); } catch (e) { /* no disponible */ }
  }

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
      buzz(8);
      chips.forEach(function (c) { c.setAttribute('aria-pressed', 'false'); });
      chip.setAttribute('aria-pressed', 'true');
      applyFilter(chip.getAttribute('data-tag'));
    });
  });


  /* Mapa, rueda de sabores y ficha de región */
  (function () {
    var ex = document.getElementById('explorer');
    if (!ex) { return; }
    var marks = ex.querySelectorAll('.mk');
    var segs = ex.querySelectorAll('.sg');
    var info = document.getElementById('mapInfo');
    var wN = document.getElementById('wN');
    var filterChips = {};
    chips.forEach(function (c) { filterChips[c.getAttribute('data-tag')] = c; });
    var activeIdx = -1;

    function maxAlt(card) {
      var b = card.querySelector('.alt-head b span[lang="en"]');
      var nums = (b ? b.textContent : '').replace(/,/g, '').match(/\d+/g) || [];
      return nums.length ? +nums[nums.length - 1] : 0;
    }
    marks.forEach(function (m) {
      var card = document.getElementById('reg-' + m.getAttribute('data-i'));
      var a = maxAlt(card);
      m.classList.add(a >= 2100 ? 't3' : (a >= 2000 ? 't2' : 't1'));
    });
    function label(el) { /* nombre accesible en el idioma activo */
      var t = el.querySelector('text');
      var l = t.querySelector('tspan[lang="' + lang + '"]');
      return (l || t).textContent;
    }
    function sync() {
      var shownN = 0;
      marks.forEach(function (m) {
        var card = document.getElementById('reg-' + m.getAttribute('data-i'));
        var off = card.hidden;
        if (!off) { shownN += 1; }
        m.classList.toggle('off', off);
        m.setAttribute('aria-pressed', String(+m.getAttribute('data-i') === activeIdx));
        m.setAttribute('aria-label', label(m) + ', ' + (card.querySelector('.alt-head b span[lang="' + lang + '"]') || {}).textContent);
      });
      segs.forEach(function (g) {
        var c = filterChips[g.getAttribute('data-tag')];
        g.setAttribute('aria-pressed', c ? c.getAttribute('aria-pressed') : 'false');
        g.setAttribute('aria-label', label(g));
      });
      wN.textContent = shownN;
    }
    function showInfo(i, scroll) {
      var card = document.getElementById('reg-' + i);
      activeIdx = i;
      var name = card.querySelector('h3').innerHTML;
      var alt = card.querySelector('.alt-head b').innerHTML;
      var desc = card.querySelector('.desc').innerHTML;
      info.innerHTML = '<p><b>' + name + '</b><span class="ia">' + alt + '</span><span class="id">' + desc + '</span></p>' +
        '<button type="button" class="go"><span lang="es">Ver ficha</span><span lang="en">View card</span></button>';
      info.querySelector('.go').addEventListener('click', function () {
        buzz(8);
        if (card.hidden && filterChips.todas) { filterChips.todas.click(); }
        document.querySelectorAll('.region.hl').forEach(function (r) { r.classList.remove('hl'); });
        card.classList.add('hl');
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(function () { card.classList.remove('hl'); }, 2200);
      });
      sync();
    }
    marks.forEach(function (m) {
      var i = +m.getAttribute('data-i');
      m.addEventListener('click', function () { buzz(8); showInfo(i); });
      m.addEventListener('mouseenter', function () { showInfo(i); });
      m.addEventListener('focus', function () { showInfo(i); });
      m.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); buzz(8); showInfo(i); } });
    });
    function pickTag(g) {
      var tag = g.getAttribute('data-tag');
      var c = filterChips[tag];
      if (!c) { return; }
      if (c.getAttribute('aria-pressed') === 'true' && filterChips.todas) { filterChips.todas.click(); } else { c.click(); }
    }
    segs.forEach(function (g) {
      g.addEventListener('click', function () { pickTag(g); });
      g.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pickTag(g); } });
    });
    document.querySelector('.filters').addEventListener('click', function () { sync(); });
    document.querySelectorAll('[data-set-lang]').forEach(function (b) { b.addEventListener('click', function () { setTimeout(sync, 0); }); });
    sync();
  })();

  /* Guía de molienda */
  (function () {
    var box = document.getElementById('grind');
    if (!box) { return; }
    var range = document.getElementById('gRange');
    var gName = document.getElementById('gName');
    var gCmp = document.getElementById('gCmp');
    var svg = document.getElementById('grains');
    var btns = box.querySelectorAll('.gbtn');
    var LV = {
      1: { r: 9, n: ['Gruesa', 'Coarse'], c: ['Como la sal marina gruesa · ≈ 1.100 µm', 'Like coarse sea salt · ≈ 1,100 µm'] },
      2: { r: 7, n: ['Media-gruesa', 'Medium-coarse'], c: ['Como la sal gruesa de cocina · ≈ 850 µm', 'Like coarse kosher salt · ≈ 850 µm'] },
      3: { r: 5.5, n: ['Media', 'Medium'], c: ['Como la arena de playa · ≈ 650 µm', 'Like beach sand · ≈ 650 µm'] },
      4: { r: 4, n: ['Media-fina', 'Medium-fine'], c: ['Como la sal de mesa · ≈ 450 µm', 'Like table salt · ≈ 450 µm'] },
      5: { r: 2.6, n: ['Fina', 'Fine'], c: ['Como el azúcar extrafino · ≈ 250 µm', 'Like superfine sugar · ≈ 250 µm'] }
    };
    var idx = lang === 'en' ? 1 : 0;
    function draw(lv) {
      var r = LV[lv].r, step = r * 2.5, out = '', seed = lv * 97, w = 300, h = 150;
      function rnd() { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }
      for (var y = step / 2; y < h; y += step) {
        for (var x = step / 2; x < w; x += step) {
          var rr = r * (0.75 + rnd() * 0.5);
          out += '<circle cx="' + (x + (rnd() - 0.5) * step * 0.35).toFixed(1) + '" cy="' + (y + (rnd() - 0.5) * step * 0.35).toFixed(1) + '" r="' + rr.toFixed(1) + '"/>';
        }
      }
      svg.innerHTML = out;
    }
    function render(fromUser) {
      lang = root.getAttribute('data-lang') === 'en' ? 'en' : 'es';
      idx = lang === 'en' ? 1 : 0;
      var lv = +range.value;
      range.style.setProperty('--p', ((lv - 1) / 4 * 100) + '%');
      draw(lv);
      gName.textContent = LV[lv].n[idx];
      gCmp.textContent = LV[lv].c[idx];
      range.setAttribute('aria-valuetext', LV[lv].n[idx] + '. ' + LV[lv].c[idx]);
      btns.forEach(function (b) { b.setAttribute('aria-pressed', String(+b.getAttribute('data-lv') === lv)); });
    }
    range.addEventListener('input', function () { buzz(8); render(); });
    btns.forEach(function (b) {
      b.addEventListener('click', function () { buzz(8); range.value = b.getAttribute('data-lv'); render(); });
    });
    document.querySelectorAll('[data-set-lang]').forEach(function (b) { b.addEventListener('click', function () { setTimeout(render, 0); }); });
    render();
  })();

  /* Calculadora */
  var KEYS = ['v60', 'chemex', 'prensa', 'aeropress', 'moka', 'espresso'];
  /* Tres ratios por método: [agua por gramo de café, etiqueta es, etiqueta en] */
  var RATIOS = {
    v60: [15, 16, 17], chemex: [14, 15, 16], prensa: [14, 15, 16],
    aeropress: [14, 15, 16], moka: [8, 9, 10], espresso: [1.8, 2, 2.5]
  };
  var RATIO_NAMES = [['Intenso', 'Strong'], ['Balanceado', 'Balanced'], ['Suave', 'Mild']];
  /* Rango del deslizador de agua: [mín, máx, paso] */
  var RANGE = {
    v60: [100, 600, 10], chemex: [200, 1000, 10], prensa: [200, 1000, 10],
    aeropress: [100, 300, 10], moka: [50, 300, 10], espresso: [18, 80, 1]
  };
  var CUP = { v60: 220, chemex: 240, prensa: 240, aeropress: 200, moka: 50, espresso: 36 };
  /* Cronómetro: tiempo en segundos, fracción acumulada del agua y texto del paso */
  var POURS = {
    v60: [
      { t: 0, f: 0.18, es: 'Preinfusión: vierte {g} g y espera a que el café florezca', en: 'Bloom: pour {g} g and let the coffee bloom' },
      { t: 45, f: 0.6, es: 'Primer vertido: sube hasta {g} g con círculos suaves', en: 'First pour: rise to {g} g in gentle circles' },
      { t: 90, f: 1, es: 'Vertido final: llega a {g} g', en: 'Final pour: reach {g} g' },
      { t: 180, es: 'Fin del goteo: retira el filtro y sirve', en: 'Draw-down done: remove the filter and serve' }
    ],
    chemex: [
      { t: 0, f: 0.15, es: 'Preinfusión: vierte {g} g y espera a que el café florezca', en: 'Bloom: pour {g} g and let the coffee bloom' },
      { t: 45, f: 0.6, es: 'Primer vertido: sube hasta {g} g con círculos suaves', en: 'First pour: rise to {g} g in gentle circles' },
      { t: 90, f: 1, es: 'Vertido final: llega a {g} g', en: 'Final pour: reach {g} g' },
      { t: 240, es: 'Fin del goteo: retira el filtro y sirve', en: 'Draw-down done: remove the filter and serve' }
    ],
    prensa: [
      { t: 0, f: 1, es: 'Vierte {g} g de agua y tapa sin presionar', en: 'Pour {g} g of water and cover without pressing' },
      { t: 30, es: 'Rompe la costra: remueve suavemente', en: 'Break the crust: stir gently' },
      { t: 240, es: 'Baja el émbolo despacio y sirve', en: 'Press the plunger down slowly and serve' }
    ],
    aeropress: [
      { t: 0, f: 1, es: 'Vierte {g} g de agua', en: 'Pour {g} g of water' },
      { t: 10, es: 'Remueve 3 veces', en: 'Stir 3 times' },
      { t: 90, es: 'Coloca el émbolo y presiona despacio, unos 30 s', en: 'Insert the plunger and press slowly, about 30 s' },
      { t: 120, es: 'Listo: sirve, o diluye con agua caliente al gusto', en: 'Done: serve, or dilute with hot water to taste' }
    ],
    moka: [
      { t: 0, es: 'Pon la cafetera a fuego bajo o medio, con la tapa abierta', en: 'Put the pot on low to medium heat, lid open' },
      { t: 180, es: 'El café empieza a subir: vigílalo', en: 'The coffee starts to rise: keep an eye on it' },
      { t: 270, es: 'Cuando el chorro se aclare y burbujee, retírala del fuego', en: 'When the stream turns pale and bubbles, take it off the heat' },
      { t: 300, es: 'Enfría la base con un paño húmedo y sirve', en: 'Cool the base with a damp cloth and serve' }
    ],
    espresso: [
      { t: 0, es: 'Inicia la extracción', en: 'Start the extraction' },
      { t: 25, es: 'Prepárate para detenerla: objetivo {g} g en taza', en: 'Get ready to stop it: target {g} g in the cup' },
      { t: 30, es: 'Detén la extracción y sirve', en: 'Stop the extraction and serve' }
    ]
  };

  var amount = document.getElementById('amount');
  var amountRange = document.getElementById('amountRange');
  var coffeeNum = document.getElementById('coffeeNum');
  var coffeeRange = document.getElementById('coffeeRange');
  var amountLabel = document.getElementById('amountLabel');
  var mbtns = document.querySelectorAll('.mbtn');
  var ratiosBox = document.getElementById('ratios');

  /* Memoria local: método, cantidad y ratio de cada método (solo en este navegador) */
  var STORE = 'lote-calc';
  var prefs = { method: null, amounts: {}, ratios: {} };
  try {
    var raw = localStorage.getItem(STORE);
    var saved = raw ? JSON.parse(raw) : null;
    if (saved && typeof saved === 'object') {
      if (typeof saved.method === 'string' && KEYS.indexOf(saved.method) > -1) { prefs.method = saved.method; }
      if (saved.amounts && typeof saved.amounts === 'object') {
        KEYS.forEach(function (k) {
          var v = Number(saved.amounts[k]);
          if (isFinite(v) && v > 0 && v <= 2000) { prefs.amounts[k] = v; }
        });
      }
      if (saved.ratios && typeof saved.ratios === 'object') {
        KEYS.forEach(function (k) {
          var v = Number(saved.ratios[k]);
          if (v === 0 || v === 1 || v === 2) { prefs.ratios[k] = v; }
        });
      }
    }
  } catch (e) { /* sin almacenamiento o datos no válidos: se usan los valores por defecto */ }

  function savePrefs() {
    try { localStorage.setItem(STORE, JSON.stringify(prefs)); } catch (e) { /* sin almacenamiento */ }
  }

  /* Estado de la calculadora */
  var state = { key: prefs.method || 'v60', ri: 1, water: 300, coffee: 18.8 };
  function r1(x) { return Math.round(x * 10) / 10; }
  function ratioNow() { return RATIOS[state.key][state.ri]; }
  function setWater(w) { state.water = w; state.coffee = r1(w / ratioNow()); }
  function setCoffee(c) { state.coffee = c; state.water = Math.round(c * ratioNow()); }
  function loadMethod(key) {
    state.key = key;
    state.ri = (prefs.ratios[key] === undefined) ? 1 : prefs.ratios[key];
    setWater(prefs.amounts[key] || METHODS[key].amount);
  }
  loadMethod(state.key);

  function pick(v) { return (v && typeof v === 'object') ? v[lang] : v; }

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var lastText = {};
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
    var first = lastText[id] === undefined;
    if (lastText[id] === text) { return; }
    lastText[id] = text;
    el.textContent = text;
    if (!first) { flash(el); }
  }

  /* La cifra de café cuenta hasta el nuevo valor en unos 250 ms */
  function tweenCoffee(g, fmt) {
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
    var liquid = METHODS[key].yieldLabel === 'cup' ? ml : Math.max(0, ml - 2 * g);
    var n = Math.round((liquid / CUP[key]) * 2) / 2;
    return n < 0.5 ? 0.5 : n;
  }

  function mmss(sec) {
    var m = Math.floor(sec / 60), r = Math.floor(sec % 60);
    return m + ':' + (r < 10 ? '0' : '') + r;
  }

  /* Cronómetro de extracción */
  var timer = { running: false, elapsed: 0, last: 0, id: 0, idx: -1, done: false, wake: null };
  var tPanel = document.getElementById('timer');
  var tStart = document.getElementById('tStart');
  var tList = document.getElementById('tList');

  function plan() { return POURS[state.key]; }
  function stepText(st) { return pick(st).replace('{g}', Math.round(state.water * (st.f || 1))); }
  function pickStep(st) { return st[lang].replace('{g}', Math.round(state.water * (st.f || 1))); }
  function tEnd() { var pl = plan(); return pl[pl.length - 1].t; }

  function startLabel() {
    var es, en;
    if (timer.done) { es = 'Reiniciar extracción'; en = 'Restart brewing'; }
    else if (timer.running) { es = 'Pausar'; en = 'Pause'; }
    else if (timer.elapsed > 0) { es = 'Continuar'; en = 'Resume'; }
    else { es = 'Iniciar extracción'; en = 'Start brewing'; }
    tStart.innerHTML = '<span lang="es">' + es + '</span><span lang="en">' + en + '</span>';
  }

  function renderTimer() {
    var pl = plan();
    var idx = -1;
    pl.forEach(function (st, i) { if (timer.elapsed >= st.t) { idx = i; } });
    document.getElementById('tClock').textContent = mmss(timer.elapsed);
    document.getElementById('tBar').style.width = Math.min(100, (timer.elapsed / tEnd()) * 100) + '%';
    tList.textContent = '';
    pl.forEach(function (st, i) {
      var li = document.createElement('li');
      var b = document.createElement('b');
      b.textContent = mmss(st.t);
      var sp = document.createElement('span');
      sp.textContent = pickStep(st);
      li.appendChild(b);
      li.appendChild(sp);
      if (i === idx && !timer.done) { li.setAttribute('aria-current', 'step'); }
      if (i < idx || timer.done) { li.className = 'done'; }
      tList.appendChild(li);
    });
    var now = document.getElementById('tNow');
    var next = document.getElementById('tNext');
    if (idx >= 0) {
      var txt = pickStep(pl[idx]);
      if (now.textContent !== txt) { now.textContent = txt; }
    }
    var nx = pl[idx + 1];
    next.textContent = nx && !timer.done ? ((lang === 'en' ? 'Next ' : 'Siguiente ') + mmss(nx.t) + ' · ' + pickStep(nx)) : '';
    if (idx !== timer.idx) {
      if (timer.idx !== -1 && timer.running) { buzz([40, 40, 40]); }
      timer.idx = idx;
    }
  }

  function releaseWake() {
    if (timer.wake) { try { timer.wake.release(); } catch (e) { /* nada */ } timer.wake = null; }
  }

  function stopTimer() {
    timer.running = false;
    clearInterval(timer.id);
    releaseWake();
  }

  function tick() {
    var now = performance.now();
    timer.elapsed += (now - timer.last) / 1000;
    timer.last = now;
    if (timer.elapsed >= tEnd()) {
      timer.elapsed = tEnd();
      timer.done = true;
      stopTimer();
      buzz([80, 60, 80]);
    }
    renderTimer();
    startLabel();
  }

  function resetTimer(hide) {
    stopTimer();
    timer.elapsed = 0;
    timer.done = false;
    timer.idx = -1;
    document.getElementById('tNow').textContent = '';
    if (hide) { tPanel.hidden = true; }
    renderTimer();
    startLabel();
  }

  tStart.addEventListener('click', function () {
    buzz(8);
    if (timer.done) { resetTimer(false); }
    tPanel.hidden = false;
    if (timer.running) { stopTimer(); renderTimer(); startLabel(); return; }
    timer.running = true;
    timer.last = performance.now();
    timer.id = setInterval(tick, 200);
    if (navigator.wakeLock && navigator.wakeLock.request) {
      navigator.wakeLock.request('screen').then(function (w) { timer.wake = w; }, function () { /* sin bloqueo de pantalla */ });
    }
    renderTimer();
    startLabel();
  });
  document.getElementById('tReset').addEventListener('click', function () { buzz(8); resetTimer(false); });

  function setFill(input) {
    var mn = parseFloat(input.min), mx = parseFloat(input.max), v = parseFloat(input.value);
    var pct = mx > mn ? Math.max(0, Math.min(100, ((v - mn) / (mx - mn)) * 100)) : 0;
    input.style.setProperty('--p', pct + '%');
  }

  function configureRanges() {
    var rg = RANGE[state.key], rs = RATIOS[state.key];
    amountRange.min = rg[0]; amountRange.max = rg[1]; amountRange.step = rg[2];
    coffeeRange.min = Math.floor((rg[0] / rs[2]) * 2) / 2;
    coffeeRange.max = Math.ceil((rg[1] / rs[0]) * 2) / 2;
    coffeeRange.step = 0.5;
    amount.step = rg[2];
  }

  function renderRatios() {
    var rs = RATIOS[state.key];
    var fmt = new Intl.NumberFormat(T[lang].locale, { maximumFractionDigits: 1 });
    ratiosBox.textContent = '';
    rs.forEach(function (r, i) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'rbtn';
      btn.setAttribute('role', 'radio');
      btn.setAttribute('aria-checked', i === state.ri ? 'true' : 'false');
      btn.tabIndex = i === state.ri ? 0 : -1;
      btn.setAttribute('data-r', i);
      btn.innerHTML = '<b>1:' + fmt.format(r) + '</b><span class="rl"><span lang="es">' + RATIO_NAMES[i][0] + '</span><span lang="en">' + RATIO_NAMES[i][1] + '</span></span>';
      ratiosBox.appendChild(btn);
    });
  }

  function renderCalc() {
    var m = METHODS[state.key];
    var fmt = new Intl.NumberFormat(T[lang].locale, { maximumFractionDigits: 1 });
    var ok = isFinite(state.water) && state.water > 0 && isFinite(state.coffee) && state.coffee > 0;
    mbtns.forEach(function (b) {
      var on = b.getAttribute('data-m') === state.key;
      b.setAttribute('aria-checked', on ? 'true' : 'false');
      b.tabIndex = on ? 0 : -1;
    });
    if (document.activeElement !== coffeeNum) { coffeeNum.value = state.coffee; }
    if (document.activeElement !== amount) { amount.value = state.water; }
    amountRange.value = state.water;
    coffeeRange.value = state.coffee;
    setFill(amountRange);
    setFill(coffeeRange);
    amountLabel.textContent = m.yieldLabel === 'cup' ? T[lang].cup : T[lang].water;

    tweenCoffee(ok ? state.coffee : null, fmt);
    var realRatio = ok ? state.water / state.coffee : null;
    var cupsText = ok ? T[lang].cups(fmt.format(cupsFor(state.key, state.water, state.coffee)), CUP[state.key]) : '—';
    setText('outWater', ok ? fmt.format(state.water) + ' ml' : '—');
    setText('outCups', cupsText);
    setText('outRatio', realRatio === null ? '—' : '1:' + fmt.format(realRatio));
    setText('outTemp', pick(m.temp));
    setText('outTime', pick(m.time));
    setText('outGrind', pick(m.grind));
    setText('outTip', pick(m.tip));
    clearTimeout(srTimer);
    srTimer = setTimeout(function () {
      document.getElementById('srStatus').textContent = ok ? T[lang].status(fmt.format(state.coffee), cupsText) : '';
    }, 700);

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
      m.steps[lang].forEach(function (st) {
        var li = document.createElement('li');
        li.textContent = st;
        list.appendChild(li);
      });
      document.getElementById('outNote').textContent = pick(m.note);
    }
    if (!tPanel.hidden || timer.elapsed > 0) { renderTimer(); }
  }

  function persist() {
    prefs.method = state.key;
    if (state.water > 0 && state.water <= 2000) { prefs.amounts[state.key] = state.water; }
    prefs.ratios[state.key] = state.ri;
    savePrefs();
  }

  function selectMethod(key, focus) {
    if (key === state.key) { return; }
    loadMethod(key);
    resetTimer(true);
    configureRanges();
    renderRatios();
    persist();
    buzz(8);
    renderCalc();
    if (focus) {
      mbtns.forEach(function (b) { if (b.getAttribute('data-m') === key) { b.focus(); } });
    }
  }

  function selectRatio(i, focus) {
    if (i === state.ri) { return; }
    state.ri = i;
    setWater(state.water);
    renderRatios();
    persist();
    buzz(8);
    renderCalc();
    if (focus) { var b = ratiosBox.querySelector('[data-r="' + i + '"]'); if (b) { b.focus(); } }
  }

  /* Navegación con flechas dentro de un grupo de botones tipo radio */
  function arrows(group, items, current, go) {
    group.addEventListener('keydown', function (e) {
      var k = e.key, d = 0;
      if (k === 'ArrowRight' || k === 'ArrowDown') { d = 1; }
      else if (k === 'ArrowLeft' || k === 'ArrowUp') { d = -1; }
      else { return; }
      e.preventDefault();
      var list = items();
      var i = (current() + d + list.length) % list.length;
      go(i);
    });
  }

  mbtns.forEach(function (b) {
    b.addEventListener('click', function () { selectMethod(b.getAttribute('data-m'), false); });
  });
  arrows(document.getElementById('mpick'), function () { return KEYS; }, function () { return KEYS.indexOf(state.key); },
    function (i) { selectMethod(KEYS[i], true); });
  ratiosBox.addEventListener('click', function (e) {
    var b = e.target.closest('.rbtn');
    if (b) { selectRatio(parseInt(b.getAttribute('data-r'), 10), false); }
  });
  arrows(ratiosBox, function () { return RATIOS[state.key]; }, function () { return state.ri; },
    function (i) { selectRatio(i, true); });

  function afterEdit() {
    persist();
    buzz(8);
    renderCalc();
  }
  amountRange.addEventListener('input', function () { setWater(parseFloat(amountRange.value)); afterEdit(); });
  coffeeRange.addEventListener('input', function () { setCoffee(parseFloat(coffeeRange.value)); afterEdit(); });
  amount.addEventListener('input', function () {
    var v = parseFloat(amount.value);
    if (isFinite(v) && v > 0) { setWater(v); } else { state.water = NaN; }
    afterEdit();
  });
  coffeeNum.addEventListener('input', function () {
    var v = parseFloat(coffeeNum.value);
    if (isFinite(v) && v > 0) { setCoffee(v); } else { state.coffee = NaN; }
    afterEdit();
  });
  [amount, coffeeNum].forEach(function (inp) {
    inp.addEventListener('blur', function () {
      if (!(state.water > 0) || !(state.coffee > 0)) { loadMethod(state.key); renderCalc(); }
      else { renderCalc(); }
    });
  });

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
    var m = METHODS[state.key];
    var fmt = new Intl.NumberFormat(T[lang].locale, { maximumFractionDigits: 1 });
    var t = T[lang];
    var name = document.querySelector('.mbtn[data-m="' + state.key + '"] .mn');
    var label = state.key === 'prensa' ? (lang === 'en' ? 'French press' : 'Prensa francesa') : name.textContent;
    var lines = ['Lote Col · ' + label];
    lines.push((m.yieldLabel === 'cup' ? t.cupName : t.waterName) + ': ' + fmt.format(state.water) + ' ml · ' + t.tempName + ': ' + pick(m.temp));
    lines.push(t.coffeeName + ': ' + fmt.format(state.coffee) + ' g');
    lines.push(t.ratioName + ': 1:' + fmt.format(state.water / state.coffee));
    lines.push(t.timeName + ': ' + pick(m.time) + ' · ' + t.grindName + ': ' + pick(m.grind));
    lines.push(t.yieldName + ': ' + t.cups(fmt.format(cupsFor(state.key, state.water, state.coffee)), CUP[state.key]));
    lines.push('', (lang === 'en' ? 'Timer' : 'Cronómetro') + ':');
    plan().forEach(function (st) { lines.push(mmss(st.t) + ' · ' + pickStep(st)); });
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
    buzz(12);
    var text = recipeText();
    function done(ok) { showToast(ok ? T[lang].copied : T[lang].copyFail); }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(fallbackCopy(text)); });
    } else {
      done(fallbackCopy(text));
    }
  });

  configureRanges();
  renderRatios();
  startLabel();

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
    renderCount();
    lastText = {};
    coffeeNow = null;
    renderRatios();
    renderCalc();
    renderTimer();
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

  /* Entrada escalonada de las tarjetas de regiones y variedades al entrar en pantalla */
  (function () {
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var items = document.querySelectorAll('.region, .table-wrap tbody tr');
    if (reduce || !('IntersectionObserver' in window) || !items.length) { return; }
    var pending = [];
    function show(el, delay) {
      el.style.setProperty('--d', delay + 'ms');
      el.classList.add('in');
      setTimeout(function () {
        el.classList.remove('reveal', 'in');
        el.style.removeProperty('--d');
      }, 600 + delay + 80);
    }
    var io = new IntersectionObserver(function (entries) {
      var visible = entries.filter(function (e) { return e.isIntersecting; })
        .sort(function (a, b) { return (a.boundingClientRect.top - b.boundingClientRect.top) || (a.boundingClientRect.left - b.boundingClientRect.left); });
      visible.forEach(function (e, i) {
        io.unobserve(e.target);
        show(e.target, Math.min(i, 6) * 70);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    items.forEach(function (el) {
      el.classList.add('reveal', 'noanim');
      pending.push(el);
    });
    /* Primero se fija el estado oculto sin transición; después se activa la animación y se observa */
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        items.forEach(function (el) { el.classList.remove('noanim'); io.observe(el); });
      });
    });
    /* Seguridad: si algo no llegó a mostrarse, se muestra igualmente */
    window.addEventListener('load', function () {
      setTimeout(function () {
        pending.forEach(function (el) {
          if (el.classList.contains('reveal') && !el.classList.contains('in')) { io.unobserve(el); show(el, 0); }
        });
      }, 6000);
    });
  })();

  setLang(lang, false);
})();
