(function () {
  var root = document.documentElement;
  var lang = root.getAttribute('data-lang') === 'en' ? 'en' : 'es';

  /* Texto que se genera desde el script */
  var T = {
    es: {
      count: function (n, total) { return 'Mostrando ' + n + ' de ' + total + ' regiones'; },
      water: 'Agua (ml)',
      cup: 'Bebida en taza (ml)',
      locale: 'es-ES'
    },
    en: {
      count: function (n, total) { return 'Showing ' + n + ' of ' + total + ' regions'; },
      water: 'Water (ml)',
      cup: 'Liquid in the cup (ml)',
      locale: 'en-US'
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

  function renderCalc() {
    var m = METHODS[method.value];
    var ml = parseFloat(amount.value);
    var fmt = new Intl.NumberFormat(T[lang].locale, { maximumFractionDigits: 1 });
    document.getElementById('outCoffee').textContent = (isFinite(ml) && ml > 0) ? fmt.format(ml / m.ratio) + ' g' : '—';
    document.getElementById('outRatio').textContent = m.ratioText ? pick(m.ratioText) : '1:' + m.ratio;
    document.getElementById('outTemp').textContent = pick(m.temp);
    document.getElementById('outTime').textContent = pick(m.time);
    document.getElementById('outGrind').textContent = pick(m.grind);
    document.getElementById('outTip').textContent = pick(m.tip);
    amountLabel.textContent = m.yieldLabel === 'cup' ? T[lang].cup : T[lang].water;

    /* Datos técnicos adicionales, solo para los métodos que los definen */
    var extra = m.extra;
    document.querySelectorAll('.extra').forEach(function (el) { el.hidden = !extra; });
    if (extra) {
      document.getElementById('outPressure').textContent = pick(extra.pressure);
      document.getElementById('outHeat').textContent = pick(extra.heat);
      document.getElementById('outRoast').textContent = pick(extra.roast);
      document.getElementById('outStart').textContent = pick(extra.start);
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
    renderCalc();
    if (persist) {
      try { localStorage.setItem('lote-lang', lang); } catch (e) { /* sin almacenamiento */ }
    }
  }

  langButtons.forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.getAttribute('data-set-lang'), true); });
  });

  /* Barra inferior (móvil): marca la sección que se está viendo */
  var tabLinks = document.querySelectorAll('.tabbar a');
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
