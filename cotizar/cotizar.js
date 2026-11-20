// Refacciones El Charro · cotizador
// Arma el mensaje con carro, piezas (preguntando solo lo que aplica a cada una) y entrega,
// y abre WhatsApp en el número principal. Guarda el avance solo en el navegador del cliente.
(function () {
  var WA = '523335044838'; // número principal (sin +, con 52)
  var MAX_PIEZAS = 6;
  var LS = 'charro-cotizacion-v1';

  // ---------- Datos ----------
  // lado: izquierdo/derecho · pos: delantera/trasera · dos: no ofrece "las dos" en posición
  // opc: esas preguntas aceptan "No aplica" · top: se muestra sin abrir "Ver más piezas"
  // tip: ejemplo para el campo "Algún detalle"
  var PIEZAS = [
    { n: 'Faro', lado: true, top: true, tip: 'con LED, con lupa, de halógeno…' },
    { n: 'Fascia', pos: true, top: true, tip: 'con hoyos para sensores, con faros de niebla…' },
    { n: 'Calavera', lado: true, top: true, tip: 'de LED, exterior o interior (en cajuela)…' },
    { n: 'Marco de radiador', top: true, tip: 'automático o estándar…' },
    { n: 'Defensa', pos: true, top: true, tip: 'cromada o negra…' },
    { n: 'Cofre', top: true, tip: 'con o sin toma de aire…' },
    { n: 'Espejo', lado: true, top: true, tip: 'eléctrico o manual, con direccional…' },
    { n: 'Parrilla', top: true, tip: 'cromada o negra, con emblema…' },
    { n: 'Faro de niebla', lado: true, tip: 'con o sin bisel…' },
    { n: 'Salpicadera', lado: true, tip: 'con o sin hoyo para cuarto…' },
    { n: 'Puerta', pos: true, lado: true, dos: true, tip: 'eléctrica o manual…' },
    { n: 'Manija', pos: true, lado: true, dos: true, tip: 'exterior o interior, cromada…' },
    { n: 'Moldura', pos: true, lado: true, opc: true, tip: 'de qué parte del carro…' },
    { n: 'Tolva', pos: true, lado: true, opc: true, tip: 'de salpicadera o de motor…' },
    { n: 'Radiador', tip: 'automático o estándar, con o sin A/C…' },
    { n: 'Condensador', tip: 'motor 1.6 o 2.0…' },
    { n: 'Motoventilador', tip: 'sencillo o doble…' },
    { n: 'Otra / no sé el nombre', otra: true, top: true, tip: 'describe la pieza…' }
  ];

  var COMUNES = ['Nissan', 'Chevrolet', 'Volkswagen', 'Toyota', 'Honda', 'Ford', 'Kia', 'Hyundai', 'Mazda', 'Dodge', 'RAM'];
  var MARCAS = ['Acura', 'Audi', 'BAIC', 'BMW', 'Buick', 'BYD', 'Cadillac', 'Changan', 'Chevrolet', 'Chirey', 'Chrysler', 'Cupra',
    'Dodge', 'Fiat', 'Ford', 'Foton', 'GMC', 'Great Wall', 'Honda', 'Hyundai', 'Infiniti', 'International', 'Isuzu', 'JAC',
    'Jeep', 'Jetour', 'Kia', 'Lincoln', 'Mazda', 'Mercedes-Benz', 'MG', 'Mini', 'Mitsubishi', 'Nissan', 'Omoda', 'Peugeot',
    'RAM', 'Renault', 'Seat', 'Subaru', 'Suzuki', 'Toyota', 'Volkswagen', 'Volvo'];

  // Modelos más comunes en México (si no aparece, la persona lo escribe)
  var MODELOS = {
    'Nissan': ['Versa', 'Sentra', 'March', 'Tsuru', 'Tiida', 'Kicks', 'X-Trail', 'NP300', 'Frontier', 'Altima', 'Note', 'Pathfinder', 'Murano', 'Urvan'],
    'Chevrolet': ['Aveo', 'Beat', 'Spark', 'Onix', 'Sonic', 'Cruze', 'Trax', 'Tracker', 'Captiva', 'Equinox', 'Malibu', 'S10', 'Tornado', 'Silverado', 'Cheyenne', 'Tahoe', 'Suburban'],
    'Volkswagen': ['Jetta', 'Vento', 'Polo', 'Gol', 'Virtus', 'Golf', 'Beetle', 'Pointer', 'T-Cross', 'Taos', 'Tiguan', 'Teramont', 'Saveiro', 'Amarok'],
    'Toyota': ['Corolla', 'Yaris', 'Camry', 'Prius', 'Avanza', 'Raize', 'RAV4', 'Highlander', 'Sienna', 'Hilux', 'Tacoma', 'Tundra'],
    'Honda': ['Civic', 'City', 'Fit', 'Accord', 'HR-V', 'BR-V', 'CR-V', 'Pilot', 'Odyssey'],
    'Ford': ['Figo', 'Fiesta', 'Focus', 'Fusion', 'EcoSport', 'Territory', 'Escape', 'Edge', 'Explorer', 'Ranger', 'Maverick', 'Lobo', 'F-150', 'Mustang'],
    'Kia': ['Rio', 'Forte', 'K3', 'Soul', 'Sonet', 'Seltos', 'Sportage', 'Sorento'],
    'Hyundai': ['Grand i10', 'Accent', 'HB20', 'Elantra', 'Creta', 'Tucson', 'Santa Fe'],
    'Mazda': ['Mazda 2', 'Mazda 3', 'Mazda 6', 'CX-3', 'CX-30', 'CX-5', 'CX-50', 'CX-9', 'CX-90', 'BT-50'],
    'Dodge': ['Attitude', 'Neon', 'Dart', 'Avenger', 'Journey', 'Durango', 'Charger', 'Challenger', 'Grand Caravan'],
    'RAM': ['700', '1500', '2500', '4000', 'ProMaster'],
    'Jeep': ['Renegade', 'Compass', 'Patriot', 'Liberty', 'Cherokee', 'Grand Cherokee', 'Wrangler'],
    'Mitsubishi': ['Mirage', 'Lancer', 'Outlander', 'Eclipse Cross', 'Montero', 'L200'],
    'Renault': ['Kwid', 'Logan', 'Sandero', 'Stepway', 'Duster', 'Captur', 'Koleos', 'Oroch'],
    'Suzuki': ['Swift', 'Ignis', 'Baleno', 'Ciaz', 'Ertiga', 'Vitara', 'S-Cross', 'Jimny'],
    'Seat': ['Ibiza', 'León', 'Toledo', 'Arona', 'Ateca'],
    'Peugeot': ['208', '2008', '301', '3008', '5008', 'Partner', 'Expert'],
    'MG': ['MG3', 'MG5', 'ZS', 'HS', 'RX5', 'GT', 'One'],
    'BYD': ['Dolphin Mini', 'Dolphin', 'Yuan', 'Song Plus', 'Seal', 'Han', 'Tang', 'Shark'],
    'Chirey': ['Tiggo 2 Pro', 'Tiggo 4 Pro', 'Tiggo 7 Pro', 'Tiggo 8 Pro', 'Arrizo 8']
  };

  var OTRA_MARCA = '__otra__';
  var OTRO_MODELO = '__otro__';

  // ---------- Elementos ----------
  var form = document.getElementById('qform');
  if (!form) return;
  var $ = function (id) { return document.getElementById(id); };
  var marca = $('marca'), marcaTxt = $('marca-txt'), wrapMarcaTxt = $('wrap-marca-txt');
  var modeloSel = $('modelo-sel'), wrapModeloSel = $('wrap-modelo-sel');
  var modeloTxt = $('modelo-txt'), wrapModeloTxt = $('wrap-modelo-txt');
  var anio = $('anio');
  var list = $('qitems'), tpl = $('tpl-item'), addBtn = $('qadd');
  var wrapEnvio = $('wrap-envio'), ciudad = $('ciudad'), cp = $('cp');
  var nombre = $('nombre'), detalle = $('detalle'), preview = $('preview');
  var done = $('qdone'), doneLink = $('qdone-link');
  var steps = form.querySelectorAll('.qstep');
  var params = new URLSearchParams(location.search);
  var restaurando = false;

  function opt(value, text) { var o = document.createElement('option'); o.value = value; o.textContent = text; return o; }

  // ---------- Marca y año ----------
  marca.appendChild(opt('', 'Elige la marca'));
  var g1 = document.createElement('optgroup'); g1.label = 'Las más comunes';
  COMUNES.forEach(function (m) { g1.appendChild(opt(m, m)); });
  var g2 = document.createElement('optgroup'); g2.label = 'Todas (A–Z)';
  MARCAS.forEach(function (m) { g2.appendChild(opt(m, m)); });
  var g3 = document.createElement('optgroup'); g3.label = '¿No está?';
  g3.appendChild(opt(OTRA_MARCA, 'No encuentro mi marca, la escribo'));
  marca.appendChild(g1); marca.appendChild(g2); marca.appendChild(g3);

  var y = new Date().getFullYear() + 1;
  anio.appendChild(opt('', 'Elige el año'));
  for (var a = y; a >= 1985; a--) anio.appendChild(opt(String(a), String(a)));
  anio.appendChild(opt('antes de 1985', 'Antes de 1985'));
  anio.appendChild(opt('no sé', 'No sé el año'));

  function onMarca(enfocar) {
    var v = marca.value;
    wrapMarcaTxt.hidden = v !== OTRA_MARCA;
    var mods = MODELOS[v];
    modeloSel.innerHTML = '';
    if (mods) {
      modeloSel.appendChild(opt('', 'Elige el modelo'));
      mods.forEach(function (m) { modeloSel.appendChild(opt(m, m)); });
      modeloSel.appendChild(opt(OTRO_MODELO, 'Otro modelo, lo escribo'));
      wrapModeloSel.hidden = false;
      wrapModeloTxt.hidden = true;
    } else {
      wrapModeloSel.hidden = true;
      wrapModeloTxt.hidden = false;
    }
    if (enfocar && v === OTRA_MARCA) marcaTxt.focus();
  }
  function onModelo(enfocar) {
    wrapModeloTxt.hidden = !wrapModeloSel.hidden && modeloSel.value !== OTRO_MODELO;
    if (enfocar && modeloSel.value === OTRO_MODELO) modeloTxt.focus();
  }
  marca.addEventListener('change', function () { onMarca(true); });
  modeloSel.addEventListener('change', function () { onModelo(true); });

  // ---------- Piezas ----------
  var uid = 0;
  function radios(cont, name, opciones) {
    cont.innerHTML = '';
    opciones.forEach(function (o) {
      var l = document.createElement('label');
      var i = document.createElement('input'); i.type = 'radio'; i.name = name; i.value = o[0];
      var s = document.createElement('span'); s.textContent = o[1];
      l.appendChild(i); l.appendChild(s); cont.appendChild(l);
    });
  }
  function piezaDe(li) { var r = li.querySelector('.q-tiles input:checked'); return r ? PIEZAS[r.value] : null; }
  function configurar(li, cambio) {
    var p = piezaDe(li), id = li.dataset.id;
    li.querySelector('.q-wrap-otra').hidden = !(p && p.otra);
    li.querySelector('.q-wrap-pos').hidden = !(p && p.pos);
    li.querySelector('.q-wrap-lado').hidden = !(p && p.lado);
    if (cambio && p && p.pos) {
      var o = [['delantera', 'Delantera'], ['trasera', 'Trasera']];
      if (!p.dos) o.push(['ambas', 'Las dos']);
      if (p.opc) o.push(['na', 'No aplica']);
      radios(li.querySelector('.q-pos'), 'pos-' + id, o);
    }
    if (cambio && p && p.lado) {
      var l = [['izq', 'Izquierdo (piloto)'], ['der', 'Derecho (copiloto)'], ['ambos', 'Los dos']];
      if (p.opc) l.push(['na', 'No aplica']);
      radios(li.querySelector('.q-lado'), 'lado-' + id, l);
    }
    // Mosaicos o pieza elegida
    li.querySelector('.q-pick').hidden = !!p;
    li.querySelector('.q-chosen').hidden = !p;
    if (p) li.querySelector('.q-chosen__name').textContent = p.n;
  }
  function numerar() {
    var items = list.querySelectorAll('.qitem');
    items.forEach(function (li, i) {
      li.querySelector('.qitem__n').textContent = 'Pieza ' + (i + 1);
      li.querySelector('.qitem__head').hidden = items.length === 1;
    });
    addBtn.hidden = items.length >= MAX_PIEZAS;
  }
  function agregar(preset) {
    var li = tpl.content.firstElementChild.cloneNode(true);
    var id = String(++uid);
    li.dataset.id = id;
    var tiles = li.querySelector('.q-tiles');
    PIEZAS.forEach(function (p, i) {
      var l = document.createElement('label');
      if (!p.top) l.className = 'is-extra';
      var r = document.createElement('input'); r.type = 'radio'; r.name = 'pieza-' + id; r.value = String(i);
      var s = document.createElement('span'); s.textContent = p.n;
      l.appendChild(r); l.appendChild(s); tiles.appendChild(l);
    });
    var more = li.querySelector('.q-more');
    more.addEventListener('click', function () {
      var abierto = tiles.classList.toggle('show-all');
      more.setAttribute('aria-expanded', abierto ? 'true' : 'false');
      more.textContent = abierto ? 'Ver menos' : 'Ver más piezas';
    });
    tiles.addEventListener('change', function () {
      configurar(li, true);
      if (!restaurando) {
        var sig = li.querySelector('.q-wrap-otra:not([hidden]) input, .q-wrap-pos:not([hidden]) input, .q-wrap-lado:not([hidden]) input');
        if (sig) sig.focus({ preventScroll: true });
        li.querySelector('.q-chosen').scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
      actualizarTip();
    });
    li.querySelector('.q-change').addEventListener('click', function () {
      li.querySelector('.q-pick').hidden = false;
      li.querySelector('.q-chosen').hidden = true;
      var c = tiles.querySelector('input:checked') || tiles.querySelector('input');
      if (c) c.focus();
    });
    li.querySelector('.qitem__del').addEventListener('click', function () {
      li.remove(); numerar(); actualizar();
      var ult = list.querySelector('.qitem:last-child .q-change, .qitem:last-child .q-tiles input');
      if (ult) ult.focus();
    });
    list.appendChild(li);
    if (preset != null) {
      var idx = typeof preset === 'number' ? preset : PIEZAS.findIndex(function (p) { return p.n.toLowerCase() === String(preset).toLowerCase(); });
      var r = tiles.querySelector('input[value="' + idx + '"]');
      if (r) { r.checked = true; if (!PIEZAS[idx].top) tiles.classList.add('show-all'); }
    }
    configurar(li, true);
    numerar();
    return li;
  }
  addBtn.addEventListener('click', function () {
    var li = agregar();
    var t = li.querySelector('.q-tiles input'); if (t) t.focus({ preventScroll: true });
    li.scrollIntoView({ block: 'start', behavior: 'smooth' });
    actualizar();
  });
  function actualizarTip() {
    var primera = list.querySelector('.qitem');
    var p = primera && piezaDe(primera);
    detalle.placeholder = 'Ej. ' + (p ? p.tip : 'faro con LED, versión, número de parte…');
  }

  // ---------- Entrega ----------
  function entrega() { var r = form.querySelector('input[name="entrega"]:checked'); return r ? r.value : 'local'; }
  form.querySelectorAll('input[name="entrega"]').forEach(function (r) {
    r.addEventListener('change', function () { wrapEnvio.hidden = entrega() !== 'envio'; if (!wrapEnvio.hidden) ciudad.focus(); });
  });
  cp.addEventListener('input', function () { cp.value = cp.value.replace(/\D/g, '').slice(0, 5); });

  // ---------- Leer datos ----------
  function valor(name) { var r = form.querySelector('input[name="' + name + '"]:checked'); return r ? r.value : ''; }
  function datos() {
    var m = marca.value === OTRA_MARCA ? marcaTxt.value.trim() : marca.value;
    var mod = (!wrapModeloSel.hidden && modeloSel.value && modeloSel.value !== OTRO_MODELO) ? modeloSel.value : modeloTxt.value.trim();
    var piezas = [];
    list.querySelectorAll('.qitem').forEach(function (li) {
      var p = piezaDe(li), id = li.dataset.id;
      piezas.push({
        li: li, p: p, i: p ? PIEZAS.indexOf(p) : -1,
        otra: li.querySelector('.q-otra').value.trim(),
        pos: p && p.pos ? valor('pos-' + id) : '',
        lado: p && p.lado ? valor('lado-' + id) : ''
      });
    });
    return { marca: m, modelo: mod, anio: anio.value, piezas: piezas, entrega: entrega(),
      ciudad: ciudad.value.trim(), cp: cp.value.trim(), nombre: nombre.value.trim(), detalle: detalle.value.trim() };
  }
  function piezaCompleta(x) { return !!x.p && (!x.p.otra || !!x.otra) && (!x.p.pos || !!x.pos) && (!x.p.lado || !!x.lado); }

  // ---------- Mensaje ----------
  var POS = { delantera: 'delantera', trasera: 'trasera', ambas: 'delantera y trasera' };
  var LADO = { izq: 'lado izquierdo (piloto)', der: 'lado derecho (copiloto)', ambos: 'ambos lados' };
  function textoPieza(x) {
    if (!x.p) return '';
    var t = x.p.otra ? (x.otra ? x.otra.charAt(0).toUpperCase() + x.otra.slice(1) : 'Otra pieza') : x.p.n;
    if (x.pos && POS[x.pos]) t += ' ' + POS[x.pos];
    if (x.lado && LADO[x.lado]) t += ', ' + LADO[x.lado];
    return t;
  }
  function mensaje(d) {
    var carro = [d.marca, d.modelo, d.anio && d.anio !== 'no sé' ? d.anio : ''].filter(Boolean).join(' ');
    var lineas = ['Hola, vengo de la página web. Quiero cotizar:', ''];
    lineas.push('Carro: ' + (carro || '—') + (d.anio === 'no sé' ? ' (no sé el año)' : ''));
    var ps = d.piezas.map(textoPieza).filter(Boolean);
    if (ps.length === 1) lineas.push('Pieza: ' + ps[0]);
    else if (ps.length > 1) { lineas.push('Piezas:'); ps.forEach(function (t, i) { lineas.push((i + 1) + '. ' + t); }); }
    else lineas.push('Pieza: —');
    if (d.detalle) lineas.push('Detalle: ' + d.detalle);
    lineas.push(d.entrega === 'envio'
      ? 'Entrega: envío a ' + (d.ciudad || '—') + (d.cp ? ' (CP ' + d.cp + ')' : '')
      : 'Entrega: paso al local');
    if (d.nombre) lineas.push('Nombre: ' + d.nombre);
    return lineas.join('\n');
  }

  // ---------- Pasos completos (palomita) ----------
  function marcarPasos(d) {
    var ok = [
      !!(d.marca && d.modelo && d.anio),
      d.piezas.length > 0 && d.piezas.every(piezaCompleta),
      d.entrega === 'local' || !!d.ciudad
    ];
    ok.forEach(function (v, i) { if (steps[i]) steps[i].classList.toggle('is-done', v); });
  }

  // ---------- Guardar avance (solo en este navegador) ----------
  function guardar(d) {
    if (restaurando) return;
    try {
      localStorage.setItem(LS, JSON.stringify({
        marca: marca.value, marcaTxt: marcaTxt.value, modeloSel: modeloSel.value, modeloTxt: modeloTxt.value, anio: anio.value,
        piezas: d.piezas.map(function (x) { return { i: x.i, otra: x.otra, pos: x.pos, lado: x.lado }; }),
        entrega: d.entrega, ciudad: d.ciudad, cp: d.cp, nombre: d.nombre, detalle: d.detalle
      }));
    } catch (e) { /* modo privado o sin espacio: no pasa nada */ }
  }
  function marcarRadio(name, v) { var r = form.querySelector('input[name="' + name + '"][value="' + v + '"]'); if (r) r.checked = true; }
  function restaurar() {
    var s = null;
    try { s = JSON.parse(localStorage.getItem(LS) || 'null'); } catch (e) { s = null; }
    restaurando = true;
    if (s) {
      marca.value = s.marca || ''; onMarca(false);
      marcaTxt.value = s.marcaTxt || '';
      if (!wrapModeloSel.hidden) modeloSel.value = s.modeloSel || '';
      modeloTxt.value = s.modeloTxt || ''; onModelo(false);
      anio.value = s.anio || '';
      if (s.entrega) marcarRadio('entrega', s.entrega);
      ciudad.value = s.ciudad || ''; cp.value = s.cp || ''; nombre.value = s.nombre || ''; detalle.value = s.detalle || '';
    }
    var pre = params.get('pieza');
    if (pre) {
      agregar(pre);
    } else if (s && s.piezas && s.piezas.length) {
      s.piezas.slice(0, MAX_PIEZAS).forEach(function (x) {
        var li = agregar(x.i >= 0 ? x.i : null), id = li.dataset.id;
        li.querySelector('.q-otra').value = x.otra || '';
        if (x.pos) marcarRadio('pos-' + id, x.pos);
        if (x.lado) marcarRadio('lado-' + id, x.lado);
      });
    } else {
      agregar();
    }
    if (params.get('envio') === '1') marcarRadio('entrega', 'envio');
    wrapEnvio.hidden = entrega() !== 'envio';
    restaurando = false;
  }

  function actualizar() {
    var d = datos();
    preview.textContent = mensaje(d);
    marcarPasos(d);
    guardar(d);
    return d;
  }

  // ---------- Validar ----------
  function marcar(el, malo) { if (el) el.setAttribute('aria-invalid', malo ? 'true' : 'false'); }
  function error(id, texto) { var e = $(id); e.textContent = texto || ''; e.hidden = !texto; }
  function validar() {
    var d = datos(), primero = null;
    function falla(el) { if (!primero) primero = el; }

    var faltan = [];
    marcar(marca, !marca.value); if (!marca.value) { faltan.push('la marca'); falla(marca); }
    if (marca.value === OTRA_MARCA) { marcar(marcaTxt, !d.marca); if (!d.marca) { faltan.push('la marca'); falla(marcaTxt); } }
    var modeloCampo = !wrapModeloSel.hidden && modeloSel.value !== OTRO_MODELO ? modeloSel : modeloTxt;
    marcar(modeloCampo, !d.modelo); if (!d.modelo) { faltan.push('el modelo'); falla(modeloCampo); }
    marcar(anio, !d.anio); if (!d.anio) { faltan.push('el año'); falla(anio); }
    var unidos = faltan.length > 1 ? faltan.slice(0, -1).join(', ') + ' y ' + faltan[faltan.length - 1] : faltan[0];
    error('err-carro', faltan.length ? 'Falta ' + unidos + '.' : '');

    var errP = '';
    d.piezas.forEach(function (x, i) {
      var n = d.piezas.length > 1 ? ' (pieza ' + (i + 1) + ')' : '';
      if (!x.p) { errP = errP || 'Elige qué pieza necesitas' + n + '.'; falla(x.li.querySelector('.q-tiles input')); }
      else if (x.p.otra && !x.otra) { errP = errP || 'Describe la pieza' + n + '.'; falla(x.li.querySelector('.q-otra')); }
      else if (x.p.pos && !x.pos) { errP = errP || 'Elige si es delantera o trasera' + n + '.'; falla(x.li.querySelector('.q-pos input')); }
      else if (x.p.lado && !x.lado) { errP = errP || 'Elige de qué lado' + n + '.'; falla(x.li.querySelector('.q-lado input')); }
      x.li.classList.toggle('is-bad', !piezaCompleta(x));
    });
    error('err-piezas', errP);

    var errE = d.entrega === 'envio' && !d.ciudad ? 'Escribe la ciudad a donde te la enviamos.' : '';
    marcar(ciudad, !!errE); if (errE) falla(ciudad);
    error('err-envio', errE);

    return { d: d, primero: primero };
  }

  function alCambiar() {
    actualizar();
    if (form.classList.contains('was-submitted')) validar();
    done.hidden = true;
  }
  form.addEventListener('input', alCambiar);
  form.addEventListener('change', alCambiar);

  // ---------- Mandar ----------
  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    form.classList.add('was-submitted');
    var v = validar();
    if (v.primero) {
      var caja = v.primero.closest('.qitem, .qstep') || v.primero;
      caja.scrollIntoView({ block: 'center', behavior: 'smooth' });
      v.primero.focus({ preventScroll: true });
      return;
    }
    var url = 'https://wa.me/' + WA + '?text=' + encodeURIComponent(mensaje(v.d));
    if (window.goatcounter && window.goatcounter.count) window.goatcounter.count({ path: 'clic-wa-cotizador', title: 'wa-cotizador', event: true });
    doneLink.href = url;
    done.hidden = false;
    done.focus({ preventScroll: true });
    done.scrollIntoView({ block: 'center', behavior: 'smooth' });
    // En celular se abre en la misma pestaña (funciona también dentro de Facebook e Instagram);
    // en computadora, en otra pestaña para no perder la página.
    if (window.matchMedia('(pointer: coarse)').matches) {
      window.location.href = url;
    } else {
      var w = window.open(url, '_blank');
      if (w) { w.opener = null; } else { window.location.href = url; }
    }
  });

  $('qnew').addEventListener('click', function () {
    list.innerHTML = '';
    agregar();
    detalle.value = '';
    form.classList.remove('was-submitted');
    ['err-carro', 'err-piezas', 'err-envio'].forEach(function (id) { error(id, ''); });
    done.hidden = true;
    actualizar();
    actualizarTip();
    list.closest('.qstep').scrollIntoView({ block: 'start', behavior: 'smooth' });
  });

  $('qclear').addEventListener('click', function () {
    try { localStorage.removeItem(LS); } catch (e) { /* nada */ }
    form.reset();
    list.innerHTML = '';
    onMarca(false); onModelo(false);
    wrapEnvio.hidden = true;
    form.classList.remove('was-submitted');
    form.querySelectorAll('[aria-invalid]').forEach(function (el) { el.removeAttribute('aria-invalid'); });
    ['err-carro', 'err-piezas', 'err-envio'].forEach(function (id) { error(id, ''); });
    done.hidden = true;
    agregar();
    actualizar();
    actualizarTip();
    marca.focus();
  });

  // ---------- Inicio ----------
  restaurar();
  actualizar();
  actualizarTip();
})();
