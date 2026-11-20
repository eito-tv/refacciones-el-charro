// Refacciones El Charro · animaciones, cotizador de WhatsApp y menú activo.
(function () {
  var WA = '523335044838'; // número principal (sin +, con 52)

  // Año del pie de página
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // Aparición de secciones al hacer scroll
  var items = document.querySelectorAll('.reveal');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });
  }

  // Menú: marca la sección en la que va el usuario
  var links = document.querySelectorAll('.top__nav a');
  if ('IntersectionObserver' in window && links.length) {
    var byId = {};
    links.forEach(function (a) { byId[a.getAttribute('href').slice(1)] = a; });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (a) { a.removeAttribute('aria-current'); });
        var a = byId[e.target.id];
        if (a) {
          a.setAttribute('aria-current', 'true');
          if (a.scrollIntoView && window.innerWidth < 768) a.scrollIntoView({ block: 'nearest', inline: 'center' });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(byId).forEach(function (id) {
      var s = document.getElementById(id);
      if (s) spy.observe(s);
    });
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
