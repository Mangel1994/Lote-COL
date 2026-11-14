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
      steps: {
        es: [
          "Calienta el agua a 92–96 °C y enjuaga el filtro de papel con agua caliente. Tira ese agua.",
          "Pon el cono sobre la taza o la jarra, añade el café molido medio-fino y nivélalo. Pon la balanza a cero.",
          "Preinfusión: vierte el doble del peso del café (unos 50 g por cada 20 g) y espera 30–45 s a que florezca.",
          "Primer vertido: sube hasta el 60 % del agua, en círculos suaves, sin tocar el papel.",
          "Vertido final: llega al total de agua hacia 1:30 y deja que gotee.",
          "El goteo debe terminar hacia 2:30–3:00. Retira el cono, remueve la taza y sírvela."
        ],
        en: [
          "Heat the water to 92–96 °C and rinse the paper filter with hot water. Discard that water.",
          "Set the cone over the cup or server, add the medium-fine ground coffee and level it. Zero the scale.",
          "Bloom: pour twice the weight of the coffee (about 50 g for every 20 g) and wait 30–45 s for it to bloom.",
          "First pour: rise to 60 % of the water, in gentle circles, without touching the paper.",
          "Final pour: reach the total water around 1:30 and let it drain.",
          "The draw-down should finish around 2:30–3:00. Remove the cone, swirl the cup and serve."
        ]
      },
      note: { es: "Los gramos son una guía: si sabe ácido, muele más fino; si sabe amargo, más grueso.", en: "The grams are a guide: if it tastes sour, grind finer; if bitter, grind coarser." },
      tip: {
        es: 'Prueba un Nariño o un Cauca: la acidez cítrica se luce con el filtro de papel.',
        en: 'Try a Nariño or a Cauca: citrus acidity shines through a paper filter.'
      }
    },
    chemex: {
      amount: 500, ratio: 15, temp: '92–96 °C', time: '3:30–4:30', yieldLabel: 'water',
      grind: { es: 'Media-gruesa', en: 'Medium-coarse' },
      steps: {
        es: [
          "Abre el filtro de la Chemex con la parte de tres capas hacia el pico. Enjuágalo con agua caliente y tira esa agua.",
          "Añade el café molido medio-grueso y nivélalo. Pon la balanza a cero.",
          "Preinfusión: vierte el doble del peso del café y espera 30–45 s a que florezca.",
          "Primer vertido: sube hasta el 60 % del agua, en círculos suaves, sin tocar el papel.",
          "Vertido final: llega al total de agua hacia 1:30 y deja que gotee.",
          "El goteo termina hacia 3:30–4:30. Retira el filtro con cuidado, remueve la jarra y sírvela."
        ],
        en: [
          "Open the Chemex filter with the three-layer side toward the spout. Rinse it with hot water and discard that water.",
          "Add the medium-coarse ground coffee and level it. Zero the scale.",
          "Bloom: pour twice the weight of the coffee and wait 30–45 s for it to bloom.",
          "First pour: rise to 60 % of the water, in gentle circles, without touching the paper.",
          "Final pour: reach the total water around 1:30 and let it drain.",
          "The draw-down ends around 3:30–4:30. Lift the filter out carefully, swirl the carafe and serve."
        ]
      },
      note: { es: "El filtro de la Chemex es grueso: aguanta una molienda más gruesa y da una taza muy limpia.", en: "The Chemex filter is thick: it handles a coarser grind and gives a very clean cup." },
      tip: {
        es: 'Un Huila o un Tolima da una taza limpia y frutal en jarra.',
        en: 'A Huila or a Tolima gives a clean, fruity cup in a carafe.'
      }
    },
    prensa: {
      amount: 500, ratio: 15, temp: '93–96 °C', time: '4:00', yieldLabel: 'water',
      grind: { es: 'Gruesa', en: 'Coarse' },
      steps: {
        es: [
          "Calienta el agua a 93–96 °C. Si quieres, enjuaga la jarra para que no se enfríe.",
          "Añade el café molido grueso en la jarra vacía y pon la balanza a cero.",
          "Vierte toda el agua de una vez, mojando todo el café, y pon la tapa sin bajar el émbolo.",
          "A los 30 segundos rompe la costra con una cuchara y retira la espuma de la superficie.",
          "Deja reposar hasta los 4:00 con el émbolo arriba.",
          "Baja el émbolo despacio, sin forzar, y sirve de inmediato para que no se siga extrayendo."
        ],
        en: [
          "Heat the water to 93–96 °C. If you like, rinse the beaker so it does not cool the brew.",
          "Add the coarse ground coffee to the empty beaker and zero the scale.",
          "Pour all the water in one go, wetting all the coffee, and put the lid on without pressing the plunger.",
          "At 30 seconds break the crust with a spoon and skim the foam off the surface.",
          "Let it steep until 4:00 with the plunger up.",
          "Press the plunger down slowly, without forcing it, and serve right away so it does not keep extracting."
        ]
      },
      note: { es: "Sirve todo el café al terminar: si se queda sobre los posos, se sigue extrayendo y amarga.", en: "Serve all the coffee when done: if it sits on the grounds it keeps extracting and turns bitter." },
      tip: {
        es: 'Santander o Antioquia: el cuerpo y el cacao se mantienen con la prensa.',
        en: 'Santander or Antioquia: body and cocoa hold up in a French press.'
      }
    },
    aeropress: {
      amount: 220, ratio: 15, temp: '88–94 °C', time: '1:30–2:00', yieldLabel: 'water',
      grind: { es: 'Media-fina', en: 'Medium-fine' },
      steps: {
        es: [
          "Calienta el agua a 88–94 °C. Enjuaga el filtro de papel en el tapón y enrosca el tapón en la cámara.",
          "Coloca la aeropress sobre una taza resistente, añade el café molido medio-fino y pon la balanza a cero.",
          "Vierte toda el agua y arranca el cronómetro.",
          "A los 10 segundos remueve 3 veces con la paleta.",
          "Coloca el émbolo sin presionar para crear vacío y deja reposar hasta 1:30.",
          "Presiona despacio, unos 30 segundos, hasta oír el siseo. Sirve o diluye con agua caliente al gusto."
        ],
        en: [
          "Heat the water to 88–94 °C. Rinse the paper filter in the cap and screw the cap onto the chamber.",
          "Set the AeroPress over a sturdy cup, add the medium-fine ground coffee and zero the scale.",
          "Pour in all the water and start the timer.",
          "At 10 seconds stir 3 times with the paddle.",
          "Insert the plunger without pressing to create a vacuum and let it steep until 1:30.",
          "Press slowly, about 30 seconds, until you hear the hiss. Serve, or dilute with hot water to taste."
        ]
      },
      note: { es: "La aeropress admite muchas recetas: cambia la molienda y el tiempo de una en una para notar la diferencia.", en: "The AeroPress allows many recipes: change the grind and the time one at a time to notice the difference." },
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
      steps: {
        es: [
          "Enciende la máquina y déjala calentar, con el portafiltro puesto, para que todo esté a temperatura.",
          "Muele fino y llena el portafiltro con la dosis. Nivela el café con el dedo.",
          "Compacta con el tamper, a ras y con presión pareja, y limpia los bordes del portafiltro.",
          "Haz salir un poco de agua para limpiar el grupo, coloca el portafiltro y pon la taza sobre la balanza.",
          "Inicia la extracción y arranca el cronómetro: debe empezar a caer café en unos 5–8 segundos.",
          "Detén la extracción cuando llegues al peso de bebida de la receta, entre los 25 y los 30 segundos. Sirve de inmediato."
        ],
        en: [
          "Turn the machine on and let it warm up with the portafilter attached, so everything is at temperature.",
          "Grind fine and fill the portafilter with the dose. Level the coffee with your finger.",
          "Tamp level with even pressure and wipe the edges of the portafilter.",
          "Flush a little water to clean the group head, lock in the portafilter and put the cup on the scale.",
          "Start the extraction and the timer: coffee should begin to drip within about 5–8 seconds.",
          "Stop when you reach the recipe's liquid weight, between 25 and 30 seconds. Serve right away."
        ]
      },
      note: { es: "Si sale muy rápido y ácido, muele más fino; si tarda y amarga, más grueso.", en: "If it runs too fast and sour, grind finer; if it is slow and bitter, grind coarser." },
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


  /* Mapa, rueda de sabores, barra de altitud y ficha de región */
  (function () {
    var ex = document.getElementById('explorer');
    if (!ex) { return; }
    var cmap = ex.querySelector('.cmap');
    var regsG = ex.querySelector('.regs');
    var groups = ex.querySelectorAll('.rg');
    var marks = ex.querySelectorAll('.mk');
    var segs = ex.querySelectorAll('.sg');
    var wheelEl = ex.querySelector('.wheel');
    var info = document.getElementById('mapInfo');
    var emptyHTML = info.innerHTML;
    var wN = document.getElementById('wN');
    var altFill = document.getElementById('altFill');
    var resetBtn = document.getElementById('exReset');
    var filterChips = {};
    chips.forEach(function (c) { filterChips[c.getAttribute('data-tag')] = c; });
    var sel = -1, hov = -1, shownKey = '', altKey = -2;

    /* Píldora detrás del nombre de la región: el CSS decide si se ve */
    marks.forEach(function (m) {
      var t = m.querySelector('text');
      var r = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      r.setAttribute('class', 'tip');
      m.insertBefore(r, t);
    });
    function sizeTips() {
      marks.forEach(function (m) {
        var t = m.querySelector('text'), r = m.querySelector('.tip'), b;
        try { b = t.getBBox(); } catch (e) { return; }
        var h = b.height + 10;
        r.setAttribute('x', b.x - 9); r.setAttribute('y', b.y - 5);
        r.setAttribute('width', b.width + 18); r.setAttribute('height', h); r.setAttribute('rx', h / 2);
      });
    }
    marks.forEach(function (m) { m.addEventListener('mouseenter', function () { requestAnimationFrame(sizeTips); }); });
    function card(i) { return document.getElementById('reg-' + i); }
    function label(el) {
      var t = el.querySelector('text');
      var l = t.querySelector('tspan[lang="' + lang + '"]');
      return (l || t).textContent;
    }
    function filterOn() { return !!(filterChips.todas && filterChips.todas.getAttribute('aria-pressed') !== 'true'); }
    function renderInfo(c) {
      var key = c + '|' + lang;
      if (key === shownKey) { return; }
      shownKey = key;
      if (c < 0) { info.innerHTML = emptyHTML; return; }
      var cd = card(c);
      info.innerHTML = '<p><b>' + cd.querySelector('h3').innerHTML + '</b><span class="ia">' + cd.querySelector('.alt-head b').innerHTML +
        '</span><span class="id">' + cd.querySelector('.desc').innerHTML + '</span></p>' +
        '<button type="button" class="go" data-i="' + c + '"><span lang="es">Ver ficha</span><span lang="en">View card</span></button>';
    }
    function renderAlt(c) {
      if (c === altKey) { return; }
      altKey = c;
      altFill.classList.remove('run');
      if (c < 0) { return; }
      var tr = card(c).querySelector('.alt-track');
      altFill.style.setProperty('--a', parseFloat(tr.style.getPropertyValue('--a')) || 0);
      altFill.style.setProperty('--b', parseFloat(tr.style.getPropertyValue('--b')) || 0);
      void altFill.offsetWidth;
      altFill.classList.add('run');
    }
    function sync() {
      if (sel > -1 && card(sel).hidden) { sel = -1; }
      var fOn = filterOn(), c = hov > -1 ? hov : sel, shownN = 0;
      groups.forEach(function (g) {
        var i = +g.getAttribute('data-i'), off = card(i).hidden;
        if (!off) { shownN += 1; }
        g.classList.toggle('off', off);
        g.classList.toggle('on', i === sel);
        g.classList.toggle('hov', i === hov && i !== sel);
        g.classList.toggle('match', fOn && !off);
      });
      cmap.setAttribute('data-sel', sel > -1 ? '1' : '0');
      cmap.setAttribute('data-f', fOn ? '1' : '0');
      marks.forEach(function (m) {
        var i = +m.getAttribute('data-i'), off = card(i).hidden;
        m.classList.toggle('off', off);
        m.setAttribute('aria-pressed', String(i === sel));
        m.setAttribute('aria-label', label(m) + ', ' + (card(i).querySelector('.alt-head b span[lang="' + lang + '"]') || {}).textContent);
      });
      var notes = c > -1 ? (card(c).getAttribute('data-notes') || '').split(' ') : [];
      segs.forEach(function (g) {
        var ch = filterChips[g.getAttribute('data-tag')];
        g.setAttribute('aria-pressed', ch ? ch.getAttribute('aria-pressed') : 'false');
        g.setAttribute('aria-label', label(g));
        g.classList.toggle('m', c > -1 && notes.indexOf(g.getAttribute('data-tag')) > -1);
      });
      wheelEl.setAttribute('data-f', fOn ? '1' : '0');
      wheelEl.setAttribute('data-r', c > -1 ? '1' : '0');
      wN.textContent = shownN;
      resetBtn.hidden = !(fOn || sel > -1);
      renderInfo(c);
      renderAlt(c);
      sizeTips();
    }
    function select(i) {
      buzz(8);
      sel = (sel === i) ? -1 : i;
      if (sel > -1) { regsG.appendChild(ex.querySelector('.rg[data-i="' + i + '"]')); }
      sync();
    }
    groups.forEach(function (g) {
      var i = +g.getAttribute('data-i');
      g.addEventListener('mouseenter', function () { hov = i; sync(); });
      g.addEventListener('mouseleave', function () { hov = -1; sync(); });
      g.addEventListener('click', function () { select(i); });
    });
    marks.forEach(function (m) {
      var i = +m.getAttribute('data-i');
      m.addEventListener('mouseenter', function () { hov = i; sync(); });
      m.addEventListener('mouseleave', function () { hov = -1; sync(); });
      m.addEventListener('focus', function () { hov = i; sync(); });
      m.addEventListener('blur', function () { hov = -1; sync(); });
      m.addEventListener('click', function () { select(i); });
      m.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select(i); } });
    });
    info.addEventListener('click', function (e) {
      var go = e.target.closest ? e.target.closest('.go') : null;
      if (!go) { return; }
      var cd = card(+go.getAttribute('data-i'));
      buzz(8);
      if (cd.hidden && filterChips.todas) { filterChips.todas.click(); }
      document.querySelectorAll('.region.hl').forEach(function (r) { r.classList.remove('hl'); });
      cd.classList.add('hl');
      cd.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(function () { cd.classList.remove('hl'); }, 2200);
    });
    function pickTag(g) {
      var ch = filterChips[g.getAttribute('data-tag')];
      if (!ch) { return; }
      if (ch.getAttribute('aria-pressed') === 'true' && filterChips.todas) { filterChips.todas.click(); } else { ch.click(); }
    }
    segs.forEach(function (g) {
      g.addEventListener('click', function () { pickTag(g); });
      g.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pickTag(g); } });
    });
    resetBtn.addEventListener('click', function () {
      buzz(8);
      sel = -1; hov = -1;
      if (filterOn() && filterChips.todas) { filterChips.todas.click(); }
      sync();
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && sel > -1) { sel = -1; sync(); } });
    document.querySelector('.filters').addEventListener('click', function () { sync(); });
    document.querySelectorAll('[data-set-lang]').forEach(function (b) { b.addEventListener('click', function () { setTimeout(sync, 0); }); });
    sync();
    requestAnimationFrame(function () { requestAnimationFrame(function () { ex.classList.add('ready'); }); });
  })();

  /* Guía de molienda: visor de partículas */
  (function () {
    var box = document.getElementById('grind');
    if (!box) { return; }
    var cv = document.getElementById('gCv'), ctx = cv.getContext('2d');
    var rng = document.getElementById('gRange');
    var chipsBox = document.getElementById('gChips');
    var M = [
      { id: 'prensa', name: ['Prensa', 'French press'], v: 8, range: [0, 22],
        kind: ['Método de inmersión', 'Immersion method'],
        tk: ['Ajuste de filtración', 'Filtration setting'],
        tx: ['la molienda gruesa evita que el sedimento atraviese la malla metálica.', 'a coarse grind keeps sediment from passing through the metal mesh.'] },
      { id: 'chemex', name: ['Chemex', 'Chemex'], v: 30, range: [20, 42],
        kind: ['Vertido con filtro grueso', 'Pour-over with a thick filter'],
        tk: ['Ajuste de flujo', 'Flow setting'],
        tx: ['el filtro grueso frena el agua; una molienda algo más abierta evita que el lecho se atasque.', 'the thick filter slows the water; a slightly more open grind keeps the bed from clogging.'] },
      { id: 'v60', name: ['V60', 'V60'], v: 56, range: [46, 66],
        kind: ['Vertido con filtro de papel', 'Pour-over with a paper filter'],
        tk: ['Ajuste de drenaje', 'Drainage setting'],
        tx: ['si el lecho tarda más de 3:30 en vaciarse, abre la molienda un punto.', 'if the bed takes more than 3:30 to drain, open the grind one step.'] },
      { id: 'aeropress', name: ['Aeropress', 'Aeropress'], v: 64, range: [50, 78],
        kind: ['Inmersión con presión', 'Immersion with pressure'],
        tk: ['Ajuste de presión', 'Pressure setting'],
        tx: ['si cuesta mucho bajar el émbolo, la molienda está demasiado fina.', 'if the plunger is hard to press down, the grind is too fine.'] },
      { id: 'moka', name: ['Moka', 'Moka'], v: 74, range: [60, 82],
        kind: ['Presión por vapor', 'Steam pressure'],
        tk: ['Ajuste de carga', 'Load setting'],
        tx: ['llena el filtro a ras sin compactar para que el agua suba sin sobrepresión.', 'fill the basket level without tamping so the water rises without overpressure.'] },
      { id: 'espresso', name: ['Espresso', 'Espresso'], v: 92, range: [84, 100],
        kind: ['Presión de alta resistencia', 'High-resistance pressure'],
        tk: ['Ajuste de tiempo de extracción', 'Extraction-time setting'],
        tx: ['busca 25–30 s; si el café sale antes, muele más fino.', 'aim for 25–30 s; if the coffee runs out sooner, grind finer.'] }
    ];
    var LV = [
      { max: 20, n: ['Gruesa', 'Coarse'], c: ['Como la sal marina gruesa', 'Like coarse sea salt'] },
      { max: 40, n: ['Media-gruesa', 'Medium-coarse'], c: ['Como la sal en escamas', 'Like flaky salt'] },
      { max: 50, n: ['Media', 'Medium'], c: ['Como la arena de playa', 'Like beach sand'] },
      { max: 70, n: ['Media-fina', 'Medium-fine'], c: ['Como la sal de mesa', 'Like table salt'] },
      { max: 86, n: ['Fina', 'Fine'], c: ['Como el azúcar blanco', 'Like white sugar'] },
      { max: 101, n: ['Extrafina', 'Extra-fine'], c: ['Como el azúcar glas', 'Like powdered sugar'] }
    ];
    var toUm = function (v) { return Math.round(1400 * Math.pow(180 / 1400, v / 100) / 10) * 10; };
    var levelOf = function (v) { return LV.filter(function (l) { return v < l.max; })[0]; };
    var cur = M[2], val = cur.v;
    var chipEls = M.map(function (m, i) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'gchip'; b.setAttribute('aria-pressed', 'false');
      b.addEventListener('click', function () { buzz(8); cur = M[i]; val = cur.v; update(); });
      chipsBox.appendChild(b); return b;
    });
    rng.addEventListener('input', function () {
      buzz(8);
      val = +rng.value;
      cur = M.reduce(function (a, b) { return Math.abs(b.v - val) < Math.abs(a.v - val) ? b : a; });
      update();
    });
    function css(name) { return getComputedStyle(root).getPropertyValue(name).trim() || '#14211A'; }
    function seeded(seed) { return function () { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; }; }
    function particle(x, y, r, rand) {
      var n = 5 + Math.floor(rand() * 4), rot = rand() * Math.PI * 2;
      ctx.beginPath();
      for (var k = 0; k < n; k++) {
        var a = rot + k / n * Math.PI * 2 + (rand() - 0.5) * 0.5;
        var rr = r * (0.62 + rand() * 0.42);
        var px = x + Math.cos(a) * rr, py = y + Math.sin(a) * rr;
        if (k) { ctx.lineTo(px, py); } else { ctx.moveTo(px, py); }
      }
      ctx.closePath(); ctx.fill();
    }
    var lastUm = 0, lastName = '';
    function draw(um, name) {
      lastUm = um; lastName = name;
      var dpr = window.devicePixelRatio || 1, W = cv.clientWidth, H = cv.clientHeight;
      if (!W || !H) { return; }
      cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      var fg = css('--fg'), accent = css('--accent'), bg = css('--bg');
      ctx.globalAlpha = 0.07; ctx.strokeStyle = fg; ctx.lineWidth = 1;
      for (var gx = 0; gx < W; gx += 24) { ctx.beginPath(); ctx.moveTo(gx + 0.5, 0); ctx.lineTo(gx + 0.5, H); ctx.stroke(); }
      for (var gy = 0; gy < H; gy += 24) { ctx.beginPath(); ctx.moveTo(0, gy + 0.5); ctx.lineTo(W, gy + 0.5); ctx.stroke(); }
      ctx.globalAlpha = 1;
      var pxPerMm = W / 12, r = um / 1000 * pxPerMm / 2, step = r * 2.25;
      var rand = seeded(7);
      ctx.fillStyle = fg;
      var target = null, best = 1e9, tx = W * 0.34, ty = H * 0.78;
      for (var y = -step / 2; y < H + step; y += step * 0.87) {
        var row = Math.round(y / step);
        for (var x = -step / 2 + (row % 2 ? step / 2 : 0); x < W + step; x += step) {
          var jx = (rand() - 0.5) * step * 0.45, jy = (rand() - 0.5) * step * 0.45;
          var sz = 0.7 + rand() * 0.55, px = x + jx, py = y + jy;
          particle(px, py, r * sz, rand);
          if (rand() < 0.35) { particle(px + step * 0.5, py + step * 0.3, r * 0.28 * (0.6 + rand() * 0.6), rand); }
          var d = (px - tx) * (px - tx) + (py - ty) * (py - ty);
          if (d < best && px > r * 2 && py < H - r * 2) { best = d; target = { x: px, y: py, r: r * sz }; }
        }
      }
      var L = lang === 'en' ? 1 : 0;
      if (target) {
        var ring = Math.max(target.r * 1.35, 7);
        ctx.lineWidth = 2; ctx.strokeStyle = accent;
        ctx.beginPath(); ctx.arc(target.x, target.y, ring, 0, Math.PI * 2); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(target.x, target.y + ring); ctx.lineTo(target.x, H); ctx.stroke();
        var pct = target.x / W * 100;
        document.getElementById('gLine').style.left = pct + '%';
        document.getElementById('gDot').style.left = pct + '%';
        var tt = document.getElementById('gTxt');
        tt.style.left = 'clamp(0px, calc(' + pct + '% - 10px), calc(100% - 15rem))';
        tt.innerHTML = (L ? name.toLowerCase() + ' particle' : 'Partícula ' + name.toLowerCase()) + '<br><b>≈ ' + um + ' µm</b>';
      }
      var bw = pxPerMm, bx = W - bw - 22, by = H - 22;
      ctx.fillStyle = bg; ctx.fillRect(bx - 10, by - 24, bw + 20, 34);
      ctx.strokeStyle = fg; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(bx, by - 4); ctx.lineTo(bx, by + 4); ctx.moveTo(bx, by); ctx.lineTo(bx + bw, by); ctx.moveTo(bx + bw, by - 4); ctx.lineTo(bx + bw, by + 4); ctx.stroke();
      ctx.fillStyle = fg; ctx.font = '400 11px "IBM Plex Mono", monospace'; ctx.textAlign = 'center';
      ctx.fillText('1 mm', bx + bw / 2, by - 9);
    }
    function update() {
      lang = root.getAttribute('data-lang') === 'en' ? 'en' : 'es';
      var L = lang === 'en' ? 1 : 0;
      rng.value = val; rng.style.setProperty('--p', val + '%');
      var um = toUm(val), lv = levelOf(val);
      chipEls.forEach(function (c, i) {
        var m = M[i];
        c.textContent = m.name[L];
        c.setAttribute('aria-pressed', String(m === cur));
        c.classList.toggle('fits', m !== cur && val >= m.range[0] && val <= m.range[1]);
      });
      document.getElementById('gTechK').textContent = (L ? 'Technical setting · ' : 'Ajuste técnico · ') + cur.name[L] + ' (' + cur.kind[L].toLowerCase() + ')';
      document.getElementById('gUm').textContent = '≈ ' + um + ' µm';
      document.getElementById('gName').textContent = lv.n[L];
      document.getElementById('gCmp').textContent = lv.c[L] + ' · ≈ ' + um + ' µm';
      document.getElementById('gTech').innerHTML = '<strong>' + cur.tk[L] + ':</strong> ' + cur.tx[L];
      rng.setAttribute('aria-valuetext', lv.n[L] + ', ≈ ' + um + ' µm');
      draw(um, lv.n[L]);
    }
    var rt;
    window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(function () { draw(lastUm, lastName); }, 100); });
    document.querySelectorAll('[data-set-lang]').forEach(function (b) { b.addEventListener('click', function () { setTimeout(update, 0); }); });
    try {
      var mq = window.matchMedia('(prefers-color-scheme: dark)');
      if (mq.addEventListener) { mq.addEventListener('change', function () { setTimeout(function () { draw(lastUm, lastName); }, 50); }); }
    } catch (e) { /* sin soporte */ }
    new MutationObserver(function () { draw(lastUm, lastName); }).observe(root, { attributes: true, attributeFilter: ['data-theme'] });
    update();
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
  /* Sube o baja un campo numérico: dir = 1 o -1, mult = 1 o 10 */
  function stepInput(inp, dir, mult) {
    var st = parseFloat(inp.step) || 1, v = parseFloat(inp.value) || 0;
    var nv = Math.round((v + dir * st * (mult || 1)) / st) * st;
    inp.value = Math.min(parseFloat(inp.max) || nv, Math.max(parseFloat(inp.min) || 0, Math.round(nv * 10) / 10));
    inp.dispatchEvent(new Event('input', { bubbles: true }));
  }
  /* Botones − y +: un toque cambia un paso; si se mantienen pulsados, repiten */
  document.querySelectorAll('.num .st').forEach(function (b) {
    var inp = document.getElementById(b.getAttribute('data-t'));
    var dir = +b.getAttribute('data-dir');
    var holdT = 0, repT = 0, repeated = false;
    function stop() { clearTimeout(holdT); clearInterval(repT); }
    b.addEventListener('pointerdown', function (e) {
      if (e.button !== 0) { return; }
      repeated = false; stop();
      holdT = setTimeout(function () {
        repeated = true;
        repT = setInterval(function () { stepInput(inp, dir, 1); }, 90);
      }, 450);
    });
    ['pointerup', 'pointerleave', 'pointercancel', 'blur'].forEach(function (ev) { b.addEventListener(ev, stop); });
    b.addEventListener('click', function () {
      if (repeated) { repeated = false; return; }
      buzz(8);
      stepInput(inp, dir, 1);
    });
  });
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
    var barC = document.getElementById('barC'), barW = document.getElementById('barW');
    var rr = ok ? state.water / state.coffee : RATIOS[state.key][state.ri];
    barW.style.flexGrow = rr;
    document.getElementById('legC').textContent = (T[lang].coffeeName || 'Café') + ' ' + (ok ? fmt.format(state.coffee) : '—') + ' g';
    document.getElementById('legW').textContent = (T[lang].waterName || 'Agua') + ' ' + (ok ? fmt.format(state.water) : '—') + ' ml';
    var heroArt = document.getElementById('heroArt');
    if (heroArt.getAttribute('data-k') !== state.key) {
      var ico = document.querySelector('.mbtn[data-m="' + state.key + '"] .ic');
      if (ico) { heroArt.innerHTML = ico.innerHTML; heroArt.setAttribute('data-k', state.key); }
    }
    var realRatio = ok ? state.water / state.coffee : null;
    var cupsText = ok ? T[lang].cups(fmt.format(cupsFor(state.key, state.water, state.coffee)), CUP[state.key]) : '—';
    setText('outWater', ok ? fmt.format(state.water) + ' ml' : '—');
    setText('outCups', cupsText);
    setText('outRatio', realRatio === null ? '—' : '1:' + fmt.format(realRatio));
    setText('cbCoffee', ok ? fmt.format(state.coffee) + ' g' : '—');
    setText('cbWater', ok ? fmt.format(state.water) + ' ml' : '—');
    setText('cbRatio', realRatio === null ? '—' : '1:' + fmt.format(realRatio));
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
  /* Teclado en los campos numéricos:
     ↑/↓ suben o bajan un paso (nativo), Mayús+↑/↓ y RePág/AvPág de 10 en 10,
     Intro confirma y Esc deshace lo escrito desde que se entró en el campo */
  [amount, coffeeNum].forEach(function (inp) {
    var before = null;
    inp.addEventListener('focus', function () { before = { water: state.water, coffee: state.coffee }; });
    inp.addEventListener('keydown', function (e) {
      var k = e.key;
      if ((k === 'ArrowUp' || k === 'ArrowDown') && e.shiftKey) { e.preventDefault(); stepInput(inp, k === 'ArrowUp' ? 1 : -1, 10); }
      else if (k === 'PageUp' || k === 'PageDown') { e.preventDefault(); stepInput(inp, k === 'PageUp' ? 1 : -1, 10); }
      else if (k === 'Enter') { e.preventDefault(); inp.blur(); }
      else if (k === 'Escape' && before) {
        e.preventDefault();
        state.water = before.water; state.coffee = before.coffee;
        inp.value = inp === amount ? state.water : state.coffee;
        afterEdit();
      }
    });
  });

  /* Restablecer: vuelve a la cantidad y el ratio por defecto del método elegido */
  document.getElementById('calcReset').addEventListener('click', function () {
    delete prefs.amounts[state.key];
    delete prefs.ratios[state.key];
    loadMethod(state.key);
    resetTimer(true);
    renderRatios();
    persist();
    buzz(12);
    renderCalc();
    showToast(lang === 'en' ? 'Values reset' : 'Valores restablecidos');
  });

  /* Móvil: barra de resumen fija abajo mientras los controles están a la vista
     y la tarjeta de la receta no */
  (function () {
    var bar = document.getElementById('cbar');
    var ctl = document.querySelector('.calc2 .ctl');
    var top = document.querySelector('.calc2 .card .rhero');
    if (!bar || !ctl || !top || !('IntersectionObserver' in window)) { return; }
    var narrow = window.matchMedia('(max-width: 52rem)');
    var ctlIn = false, topIn = false;
    function upd() {
      var on = narrow.matches && ctlIn && !topIn;
      bar.classList.toggle('show', on);
      document.body.classList.toggle('cbar-on', on);
    }
    new IntersectionObserver(function (es) { es.forEach(function (e) { ctlIn = e.isIntersecting; }); upd(); }, { rootMargin: '0px 0px -30% 0px' }).observe(ctl);
    new IntersectionObserver(function (es) { es.forEach(function (e) { topIn = e.isIntersecting; }); upd(); }).observe(top);
    if (narrow.addEventListener) { narrow.addEventListener('change', upd); }
    bar.querySelector('.cbar-go').addEventListener('click', function (e) {
      e.preventDefault();
      var card = document.getElementById('recipe');
      card.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      card.focus({ preventScroll: true });
    });
  })();

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
