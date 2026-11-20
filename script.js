// Refacciones El Charro · animaciones, menú activo y conteo de clics.
(function () {
    // Año del pie de página
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // Aparición de secciones al hacer scroll.
  // Se activa en cuanto asoma 1 px (threshold 0) y un poco antes de entrar (rootMargin),
  // y nunca deja contenido escondido arriba de la pantalla aunque se baje rápido.
  var items = document.querySelectorAll('.reveal');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function mostrar(el) { el.classList.add('is-in'); }
  if (reduce || !('IntersectionObserver' in window)) {
    items.forEach(mostrar);
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting || e.boundingClientRect.top < 0) { mostrar(e.target); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px 8% 0px', threshold: 0 });
    items.forEach(function (el) { io.observe(el); });
    // Red de seguridad: al terminar de hacer scroll, todo lo que ya pasó o está en pantalla se muestra.
    var t;
    window.addEventListener('scroll', function () {
      clearTimeout(t);
      t = setTimeout(function () {
        var h = window.innerHeight;
        document.querySelectorAll('.reveal:not(.is-in)').forEach(function (el) {
          if (el.getBoundingClientRect().top < h) { mostrar(el); io.unobserve(el); }
        });
      }, 120);
    }, { passive: true });
  }

  // ---------- Menú ----------
  var root = document.documentElement;
  var top = document.getElementById('top');
  var burger = document.querySelector('.top__burger');
  var menu = document.getElementById('menu');
  function abrirMenu(abrir) {
    if (!burger) return;
    root.classList.toggle('menu-open', abrir);
    burger.setAttribute('aria-expanded', abrir ? 'true' : 'false');
    burger.setAttribute('aria-label', abrir ? 'Cerrar menú' : 'Abrir menú');
    if (abrir) { var f = menu.querySelector('a'); if (f) f.focus({ preventScroll: true }); }
  }
  if (burger && menu) {
    burger.addEventListener('click', function () { abrirMenu(burger.getAttribute('aria-expanded') !== 'true'); });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) abrirMenu(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && root.classList.contains('menu-open')) { abrirMenu(false); burger.focus(); }
    });
    window.matchMedia('(min-width: 960px)').addEventListener('change', function (m) { if (m.matches) abrirMenu(false); });
  }

  // Sombra de la barra al hacer scroll y barra inferior de "Cotiza" (celular)
  var actionbar = document.getElementById('actionbar');
  var cta = document.getElementById('cta-hero');
  var ticking = false;
  function alScroll() {
    ticking = false;
    if (top) top.classList.toggle('is-scrolled', window.scrollY > 8);
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(alScroll); }
  }, { passive: true });
  alScroll();
  if (actionbar && cta && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      var e = entries[0];
      // Se muestra cuando el botón principal ya quedó arriba (no antes de llegar a él)
      actionbar.classList.toggle('is-visible', !e.isIntersecting && e.boundingClientRect.top < 0);
    }).observe(cta);
  }

  // Marca en el menú la sección en la que va el usuario (no mueve la página)
  var links = document.querySelectorAll('.top__links a');
  if ('IntersectionObserver' in window && links.length) {
    var byId = {};
    var activo = null;
    links.forEach(function (a) {
      var href = a.getAttribute('href');
      if (href.charAt(0) === '#') byId[href.slice(1)] = a;
    });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var a = byId[e.target.id] || null;
        if (a === activo) return;
        if (activo) activo.removeAttribute('aria-current');
        if (a) a.setAttribute('aria-current', 'true');
        activo = a;
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    // También se observan secciones sin enlace (inicio, por qué tan barato, pagos) para limpiar la marca
    document.querySelectorAll('main > section[id]').forEach(function (s) { spy.observe(s); });
  }

  // Carrusel de marcas: se pausa cuando no está en pantalla (ahorra batería y CPU)
  var marquee = document.querySelector('.marquee');
  if (marquee && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      marquee.classList.toggle('is-paused', !entries[0].isIntersecting);
    }).observe(marquee);
  }

  // Conteo de clics (solo si se activa la analítica; ver README)
  function contar(nombre) {
    if (window.goatcounter && window.goatcounter.count) {
      window.goatcounter.count({ path: 'clic-' + nombre, title: nombre, event: true });
    }
  }
  document.addEventListener('click', function (ev) {
    var a = ev.target.closest && ev.target.closest('a[data-evento]');
    if (a) contar(a.getAttribute('data-evento'));
  });
})();
