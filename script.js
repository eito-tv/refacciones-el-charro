// Refacciones El Charro · animaciones, cotizador de WhatsApp y menú activo.
(function () {
  var WA = '523335044838'; // número principal (sin +, con 52)

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

  // Menú: marca la sección en la que va el usuario.
  // Ojo: no usar scrollIntoView aquí; en celular mueve toda la página y la deja atorada.
  // Solo se desplaza la barra del menú, de lado.
  var nav = document.querySelector('.top__nav');
  var links = document.querySelectorAll('.top__nav a');
  var pendiente = null, quieto;
  function centrarEnMenu(a) { pendiente = a; }
  // Solo se mueve el menú cuando la persona deja de hacer scroll, para no competir con su dedo.
  window.addEventListener('scroll', function () {
    clearTimeout(quieto);
    quieto = setTimeout(function () {
      if (!pendiente || !nav || nav.scrollWidth <= nav.clientWidth) return;
      var n = nav.getBoundingClientRect();
      var r = pendiente.getBoundingClientRect();
      nav.scrollLeft = Math.max(0, nav.scrollLeft + (r.left - n.left) - (n.width - r.width) / 2);
      pendiente = null;
    }, 180);
  }, { passive: true });
  if ('IntersectionObserver' in window && links.length) {
    var byId = {};
    var activo = null;
    links.forEach(function (a) { byId[a.getAttribute('href').slice(1)] = a; });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var a = byId[e.target.id];
        if (!a || a === activo) return;
        if (activo) activo.removeAttribute('aria-current');
        a.setAttribute('aria-current', 'true');
        activo = a;
        centrarEnMenu(a);
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(byId).forEach(function (id) {
      var s = document.getElementById(id);
      if (s) spy.observe(s);
    });
  }

  // Carrusel de marcas: se pausa cuando no está en pantalla (ahorra batería y CPU)
  var marquee = document.querySelector('.marquee');
  if (marquee && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      marquee.classList.toggle('is-paused', !entries[0].isIntersecting);
    }).observe(marquee);
  }

  // Cotizador: arma el mensaje y abre WhatsApp
  var form = document.getElementById('cotizador');
  if (form) {
    var err = form.querySelector('.quote__err');
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var f = form.elements;
      var pieza = f.pieza.value.trim();
      var modelo = f.modelo.value.trim();
      var lado = f.lado.value.trim();
      var anio = f.anio.value.trim();
      var ciudad = f.ciudad.value.trim();

      f.pieza.setAttribute('aria-invalid', pieza ? 'false' : 'true');
      f.modelo.setAttribute('aria-invalid', modelo ? 'false' : 'true');
      if (!pieza || !modelo) {
        err.hidden = false;
        (pieza ? f.modelo : f.pieza).focus();
        return;
      }
      err.hidden = true;

      var lineas = ['Hola, vengo de la página web. Quiero cotizar:'];
      lineas.push('• Pieza: ' + pieza + (lado ? ', ' + lado : ''));
      lineas.push('• Carro: ' + modelo + (anio ? ' ' + anio : ''));
      lineas.push(ciudad ? '• Envío a: ' + ciudad : '• Paso al local');
      var url = 'https://wa.me/' + WA + '?text=' + encodeURIComponent(lineas.join('\n'));
      contar('wa-cotizador');
      var w = window.open(url, '_blank');
      if (w) { w.opener = null; } else { window.location.href = url; }
    });
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
