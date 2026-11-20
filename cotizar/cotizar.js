// Refacciones El Charro · cotizador
// Arma el mensaje con carro, piezas (preguntando solo lo que aplica a cada una, con su detalle)
// y entrega (local o paquetería con todos los datos), y abre WhatsApp en el número principal.
// El avance se guarda solo en el navegador del cliente.
(function () {
  var WA = '523335044838'; // número principal (sin +, con 52)
  var MAX_PIEZAS = 6;
  var LS = 'charro-cotizacion-v2';
  var TOUCH = window.matchMedia('(pointer: coarse)').matches;

  // ---------- Piezas ----------
  // lado: izquierdo/derecho · pos: delantera/trasera · dos: no ofrece "las dos" en posición
  // opc: esas preguntas aceptan "No aplica" · top: visible sin "Ver más piezas"
  // det: pregunta de detalle con opciones · nota: ejemplo para "¿Algún otro detalle?"
  var PIEZAS = [
    { n: 'Faro', lado: true, top: true,
      det: { q: '¿Qué tipo de faro?', o: ['Halógeno (foco normal)', 'LED', 'Xenón / HID', 'Con lupa (proyector)', 'De vidrio', 'De mica (plástico)'] },
      nota: 'Ej. fondo negro, versión Advance, número de parte…' },
    { n: 'Fascia', pos: true, top: true,
      det: { q: '¿Cómo es tu fascia?', o: ['Con hoyos para sensores', 'Sin sensores', 'Con hoyos para faros de niebla', 'Con hoyo para lavafaros'] },
      nota: 'Ej. versión deportiva, número de parte…' },
    { n: 'Calavera', lado: true, top: true,
      det: { q: '¿Qué tipo de calavera?', o: ['De foco (normal)', 'LED', 'Exterior (en la carrocería)', 'Interior (en la cajuela)'] },
      nota: 'Ej. fondo rojo o ahumado, número de parte…' },
    { n: 'Marco de radiador', top: true, nota: 'Ej. motor 1.6, con o sin A/C, número de parte…' },
    { n: 'Defensa', pos: true, top: true,
      det: { q: '¿Qué detalle tiene tu defensa?', o: ['Cromada', 'Negra', 'Para pintar', 'Con hoyos para sensores', 'Con estribo (escalón)'] },
      nota: 'Ej. con o sin gancho, número de parte…' },
    { n: 'Cofre', top: true,
      det: { q: '¿Cómo es tu cofre?', o: ['Con toma de aire', 'Sin toma de aire'] },
      nota: 'Ej. versión, número de parte…' },
    { n: 'Espejo', lado: true, top: true,
      det: { q: '¿Cómo es tu espejo?', o: ['Eléctrico', 'Manual', 'Con direccional', 'Abatible', 'Con calefacción', 'Solo la luna (el vidrio)'] },
      nota: 'Ej. color de la tapa, número de parte…' },
    { n: 'Parrilla', top: true,
      det: { q: '¿Cómo es tu parrilla?', o: ['Cromada', 'Negra', 'Con emblema', 'Sin emblema'] },
      nota: 'Ej. versión, número de parte…' },
    { n: 'Faro de niebla', lado: true,
      det: { q: '¿Cómo es tu faro de niebla?', o: ['Con bisel (marco)', 'Sin bisel', 'LED', 'Halógeno'] },
      nota: 'Ej. número de parte…' },
    { n: 'Salpicadera', lado: true,
      det: { q: '¿Cómo es tu salpicadera?', o: ['Con hoyo para cuarto (direccional)', 'Sin hoyo', 'Con hoyo para moldura'] },
      nota: 'Ej. versión, número de parte…' },
    { n: 'Puerta', pos: true, lado: true, dos: true,
      det: { q: '¿Cómo es tu puerta?', o: ['Vidrio eléctrico', 'Vidrio manual', 'Con hoyo para moldura'] },
      nota: 'Ej. 2 o 4 puertas, número de parte…' },
    { n: 'Manija', pos: true, lado: true, dos: true,
      det: { q: '¿Qué manija es?', o: ['Exterior', 'Interior', 'Cromada', 'Negra', 'Para pintar', 'Con hoyo para llave'] },
      nota: 'Ej. número de parte…' },
    { n: 'Moldura', pos: true, lado: true, opc: true, nota: 'Ej. de la puerta, del cofre, cromada…' },
    { n: 'Tolva', pos: true, lado: true, opc: true, nota: 'Ej. de salpicadera, de motor…' },
    { n: 'Radiador',
      det: { q: '¿Cómo es tu carro?', o: ['Automático', 'Estándar', 'Con aire acondicionado', 'Sin aire acondicionado'] },
      nota: 'Ej. motor 1.6, número de parte…' },
    { n: 'Condensador', nota: 'Ej. motor 1.6 o 2.0, número de parte…' },
    { n: 'Motoventilador',
      det: { q: '¿Cómo es?', o: ['Sencillo', 'Doble'] },
      nota: 'Ej. con o sin A/C, número de parte…' },
    { n: 'Otra / no sé el nombre', otra: true, top: true }
  ];
  var NO_SE = 'No sé';

  // ---------- Marcas y modelos ----------
  var COMUNES = ['Nissan', 'Chevrolet', 'Volkswagen', 'Toyota', 'Honda', 'Ford', 'Kia', 'Hyundai', 'Mazda', 'Dodge', 'RAM'];
  var MARCAS = ['Acura', 'Audi', 'BAIC', 'BMW', 'Buick', 'BYD', 'Cadillac', 'Changan', 'Chevrolet', 'Chirey', 'Chrysler', 'Cupra',
    'Dodge', 'Fiat', 'Ford', 'Foton', 'GMC', 'Great Wall', 'Honda', 'Hyundai', 'Infiniti', 'International', 'Isuzu', 'JAC',
    'Jeep', 'Jetour', 'Kia', 'Lincoln', 'Mazda', 'Mercedes-Benz', 'MG', 'Mini', 'Mitsubishi', 'Nissan', 'Omoda', 'Peugeot',
    'RAM', 'Renault', 'Seat', 'Subaru', 'Suzuki', 'Toyota', 'Volkswagen', 'Volvo'];
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

  // ---------- Envío ----------
  var ESTADOS = ['Aguascalientes', 'Baja California', 'Baja California Sur', 'Campeche', 'Chiapas', 'Chihuahua', 'Ciudad de México',
    'Coahuila', 'Colima', 'Durango', 'Estado de México', 'Guanajuato', 'Guerrero', 'Hidalgo', 'Jalisco', 'Michoacán', 'Morelos',
    'Nayarit', 'Nuevo León', 'Oaxaca', 'Puebla', 'Querétaro', 'Quintana Roo', 'San Luis Potosí', 'Sinaloa', 'Sonora', 'Tabasco',
    'Tamaulipas', 'Tlaxcala', 'Veracruz', 'Yucatán', 'Zacatecas'];
  // Primeros dos dígitos del código postal → estado (rangos de SEPOMEX). Solo sugiere; la persona puede cambiarlo.
  var CP_ESTADO = [[1, 16, 'Ciudad de México'], [20, 20, 'Aguascalientes'], [21, 22, 'Baja California'], [23, 23, 'Baja California Sur'],
    [24, 24, 'Campeche'], [25, 27, 'Coahuila'], [28, 28, 'Colima'], [29, 30, 'Chiapas'], [31, 33, 'Chihuahua'], [34, 35, 'Durango'],
    [36, 38, 'Guanajuato'], [39, 41, 'Guerrero'], [42, 43, 'Hidalgo'], [44, 49, 'Jalisco'], [50, 57, 'Estado de México'],
    [58, 61, 'Michoacán'], [62, 62, 'Morelos'], [63, 63, 'Nayarit'], [64, 67, 'Nuevo León'], [68, 71, 'Oaxaca'], [72, 75, 'Puebla'],
    [76, 76, 'Querétaro'], [77, 77, 'Quintana Roo'], [78, 79, 'San Luis Potosí'], [80, 82, 'Sinaloa'], [83, 85, 'Sonora'],
    [86, 86, 'Tabasco'], [87, 89, 'Tamaulipas'], [90, 90, 'Tlaxcala'], [91, 96, 'Veracruz'], [97, 97, 'Yucatán'], [98, 99, 'Zacatecas']];
  var PAQUETERIAS = ['PMM', 'Paquete Express', 'Gran Cañón', 'Tiny Pack', 'HGR'];
  var OTRA_PAQ = '__otra__';

  // ---------- Elementos ----------
  var form = document.getElementById('qform');
  if (!form) return;
  var $ = function (id) { return document.getElementById(id); };
  var marca = $('marca'), marcaTxt = $('marca-txt'), wrapMarcaTxt = $('wrap-marca-txt');
  var modeloSel = $('modelo-sel'), wrapModeloSel = $('wrap-modelo-sel');
  var modeloTxt = $('modelo-txt'), wrapModeloTxt = $('wrap-modelo-txt');
  var anio = $('anio');
  var list = $('qitems'), tpl = $('tpl-item'), addBtn = $('qadd');
  var wrapLocal = $('wrap-local'), wrapEnvio = $('wrap-envio');
  var E = {
    nombre: $('e-nombre'), tel: $('e-tel'), cp: $('e-cp'), estado: $('e-estado'), ciudad: $('e-ciudad'),
    calle: $('e-calle'), colonia: $('e-colonia'), ref: $('e-ref'), paq: $('e-paq'), paqOtra: $('e-paq-otra'), convenio: $('e-convenio')
  };
  var nombre = $('nombre'), preview = $('preview');
  var done = $('qdone'), doneLink = $('qdone-link');
  var steps = form.querySelectorAll('.qstep');
  var params = new URLSearchParams(location.search);
  var restaurando = false;

  function opt(value, text) { var o = document.createElement('option'); o.value = value; o.textContent = text; return o; }
  function valor(name) { var r = form.querySelector('input[name="' + name + '"]:checked'); return r ? r.value : ''; }
  function marcarRadio(name, v) { var r = form.querySelector('input[name="' + name + '"][value="' + v + '"]'); if (r) r.checked = true; }
  // En celular no se enfocan campos de texto solos: abriría el teclado sin que la persona lo pida.
  function enfocar(el) {
    if (!el) return;
    if (TOUCH && el.tagName === 'INPUT' && /^(text|tel|email|search|number)$/.test(el.type)) return;
    el.focus({ preventScroll: true });
  }
  function primeraMayus(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }
  function suave(s) { return s && s.length > 1 && s.charAt(1) === s.charAt(1).toLowerCase() ? s.charAt(0).toLowerCase() + s.slice(1) : s; }

  // ---------- Listas ----------
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

  E.estado.appendChild(opt('', 'Elige el estado'));
  ESTADOS.forEach(function (s) { E.estado.appendChild(opt(s, s)); });
  E.paq.appendChild(opt('', 'Sin preferencia (la que convenga)'));
  PAQUETERIAS.forEach(function (p) { E.paq.appendChild(opt(p, p)); });
  E.paq.appendChild(opt(OTRA_PAQ, 'Otra'));

  // ---------- Carro ----------
  function onMarca(foco) {
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
    if (foco && v === OTRA_MARCA) enfocar(marcaTxt);
  }
  function onModelo(foco) {
    wrapModeloTxt.hidden = !wrapModeloSel.hidden && modeloSel.value !== OTRO_MODELO;
    if (foco && modeloSel.value === OTRO_MODELO) enfocar(modeloTxt);
  }
  marca.addEventListener('change', function () { onMarca(true); });
  modeloSel.addEventListener('change', function () { onModelo(true); });

  // ---------- Piezas ----------
  var uid = 0;
  function opciones(cont, tipo, name, lista) {
    cont.innerHTML = '';
    lista.forEach(function (o) {
      var l = document.createElement('label');
      var i = document.createElement('input'); i.type = tipo; i.name = name; i.value = o[0];
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
    li.querySelector('.q-wrap-det').hidden = !p || !!p.otra;
    if (cambio && p) {
      if (p.pos) {
        var o = [['delantera', 'Delantera'], ['trasera', 'Trasera']];
        if (!p.dos) o.push(['ambas', 'Las dos']);
        if (p.opc) o.push(['na', 'No aplica']);
        opciones(li.querySelector('.q-pos'), 'radio', 'pos-' + id, o);
      }
      if (p.lado) {
        var l = [['izq', 'Izquierdo (piloto)'], ['der', 'Derecho (copiloto)'], ['ambos', 'Los dos']];
        if (p.opc) l.push(['na', 'No aplica']);
        opciones(li.querySelector('.q-lado'), 'radio', 'lado-' + id, l);
      }
      var box = li.querySelector('.q-det-box');
      box.hidden = !p.det;
      if (p.det) {
        li.querySelector('.q-det-t').textContent = p.det.q + ' ';
        var sm = document.createElement('small'); sm.textContent = '(opcional)';
        li.querySelector('.q-det-t').appendChild(sm);
        opciones(li.querySelector('.q-det'), 'checkbox', 'det-' + id, p.det.o.concat([NO_SE]).map(function (x) { return [x, x]; }));
      }
      li.querySelector('.q-nota-t').firstChild.textContent = p.det ? '¿Algún otro detalle? ' : '¿Algún detalle? ';
      var nota = li.querySelector('.q-nota');
      nota.placeholder = p.nota || 'Ej. versión, número de parte…';
      nota.value = '';
    }
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
        var sig = li.querySelector('.q-wrap-otra:not([hidden]) input, .q-wrap-pos:not([hidden]) input, .q-wrap-lado:not([hidden]) input, .q-det input');
        enfocar(sig);
        li.querySelector('.q-chosen').scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    });
    // "No sé" excluye a las demás opciones del detalle
    li.querySelector('.q-det').addEventListener('change', function (e) {
      var t = e.target; if (!t || t.type !== 'checkbox' || !t.checked) return;
      li.querySelectorAll('.q-det input').forEach(function (c) {
        if (c !== t && (t.value === NO_SE || c.value === NO_SE)) c.checked = false;
      });
    });
    li.querySelector('.q-change').addEventListener('click', function () {
      li.querySelector('.q-pick').hidden = false;
      li.querySelector('.q-chosen').hidden = true;
      enfocar(tiles.querySelector('input:checked') || tiles.querySelector('input'));
    });
    li.querySelector('.qitem__del').addEventListener('click', function () {
      li.remove(); numerar(); actualizar();
      enfocar(list.querySelector('.qitem:last-child .q-change, .qitem:last-child .q-tiles input'));
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
    enfocar(li.querySelector('.q-tiles input'));
    li.scrollIntoView({ block: 'start', behavior: 'smooth' });
    actualizar();
  });

  // ---------- Entrega ----------
  function mostrarEntrega() {
    var envio = valor('entrega') === 'envio';
    wrapEnvio.hidden = !envio;
    wrapLocal.hidden = envio;
    var ocurre = valor('recibe') === 'ocurre';
    form.querySelectorAll('.q-dom').forEach(function (el) { el.hidden = ocurre; });
    $('help-ocurre').hidden = !ocurre;
    $('wrap-paq-otra').hidden = E.paq.value !== OTRA_PAQ;
    $('wrap-convenio').hidden = valor('convenio') !== 'si';
    $('help-factura').hidden = valor('factura') !== 'si';
  }
  form.addEventListener('change', function (e) {
    if (e.target && /^(entrega|recibe|convenio|factura)$/.test(e.target.name) || e.target === E.paq) mostrarEntrega();
  });
  function soloDigitos(el, max) { el.addEventListener('input', function () { el.value = el.value.replace(/\D/g, '').slice(0, max); }); }
  soloDigitos(E.cp, 5);
  soloDigitos(E.tel, 10);
  function estadoDeCP(cp) {
    if (!/^\d{5}$/.test(cp)) return '';
    var n = parseInt(cp.slice(0, 2), 10);
    for (var i = 0; i < CP_ESTADO.length; i++) if (n >= CP_ESTADO[i][0] && n <= CP_ESTADO[i][1]) return CP_ESTADO[i][2];
    return '';
  }
  E.cp.addEventListener('input', function () {
    var s = estadoDeCP(E.cp.value);
    if (s && (!E.estado.value || E.estado.dataset.auto === '1')) { E.estado.value = s; E.estado.dataset.auto = '1'; }
  });
  E.estado.addEventListener('change', function () { E.estado.dataset.auto = '0'; });

  // ---------- Leer datos ----------
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
        lado: p && p.lado ? valor('lado-' + id) : '',
        det: p && p.det ? Array.prototype.map.call(li.querySelectorAll('.q-det input:checked'), function (c) { return c.value; }) : [],
        nota: p && !p.otra ? li.querySelector('.q-nota').value.trim() : ''
      });
    });
    var e = {};
    Object.keys(E).forEach(function (k) { e[k] = E[k].value.trim(); });
    e.recibe = valor('recibe') || 'domicilio';
    e.convenioSi = valor('convenio') === 'si';
    return { marca: m, modelo: mod, anio: anio.value, piezas: piezas,
      entrega: valor('entrega') || 'local', local: valor('local'), envio: e,
      nombre: nombre.value.trim(), factura: valor('factura') === 'si' };
  }
  function piezaCompleta(x) { return !!x.p && (!x.p.otra || !!x.otra) && (!x.p.pos || !!x.pos) && (!x.p.lado || !!x.lado); }
  // Lista de lo que falta para el envío: [etiqueta, campo]
  function faltaEnvio(e) {
    var f = [];
    if (e.nombre.length < 3) f.push(['nombre de quien recibe', E.nombre]);
    if (e.tel.length !== 10) f.push(['teléfono de 10 dígitos', E.tel]);
    if (e.cp.length !== 5) f.push(['código postal de 5 dígitos', E.cp]);
    if (!e.estado) f.push(['estado', E.estado]);
    if (!e.ciudad) f.push(['ciudad o municipio', E.ciudad]);
    if (e.recibe === 'domicilio') {
      if (!e.calle) f.push(['calle y número', E.calle]);
      if (!e.colonia) f.push(['colonia', E.colonia]);
    }
    if (e.paq === OTRA_PAQ && !e.paqOtra) f.push(['cuál paquetería', E.paqOtra]);
    if (e.convenioSi && !e.convenio) f.push(['número de convenio', E.convenio]);
    return f;
  }

  // ---------- Mensaje ----------
  var POS = { delantera: 'delantera', trasera: 'trasera', ambas: 'delantera y trasera' };
  var LADO = { izq: 'lado izquierdo (piloto)', der: 'lado derecho (copiloto)', ambos: 'ambos lados' };
  function textoPieza(x) {
    if (!x.p) return '';
    var t = x.p.otra ? (x.otra ? primeraMayus(x.otra) : 'Otra pieza') : x.p.n;
    if (x.pos && POS[x.pos]) t += ' ' + POS[x.pos];
    if (x.lado && LADO[x.lado]) t += ', ' + LADO[x.lado];
    if (x.det.length) t += '. Tipo: ' + x.det.map(suave).join(', ');
    if (x.nota) t += '. Detalle: ' + x.nota;
    return t;
  }
  function tel(t) { return t.length === 10 ? t.slice(0, 2) + ' ' + t.slice(2, 6) + ' ' + t.slice(6) : t; }
  function mensaje(d) {
    var carro = [d.marca, d.modelo, d.anio && d.anio !== 'no sé' ? d.anio : ''].filter(Boolean).join(' ');
    var L = ['Hola, vengo de la página web. Quiero cotizar:', ''];
    L.push('Carro: ' + (carro || '—') + (d.anio === 'no sé' ? ' (no sé el año)' : ''));
    var ps = d.piezas.map(textoPieza).filter(Boolean);
    if (ps.length === 1) L.push('Pieza: ' + ps[0]);
    else if (ps.length > 1) { L.push('Piezas:'); ps.forEach(function (t, i) { L.push((i + 1) + '. ' + t); }); }
    else L.push('Pieza: —');
    L.push('');
    if (d.entrega === 'envio') {
      var e = d.envio, lugar = [e.cp ? 'CP ' + e.cp : '', e.ciudad, e.estado].filter(Boolean).join(', ');
      if (e.recibe === 'ocurre') {
        L.push('Entrega: envío por paquetería, ocurre (recojo en sucursal)');
        L.push('Destino: ' + (lugar || '—'));
      } else {
        L.push('Entrega: envío por paquetería a domicilio');
        L.push('Dirección: ' + ([e.calle, e.colonia ? 'col. ' + e.colonia : '', lugar].filter(Boolean).join(', ') || '—'));
        if (e.ref) L.push('Referencias: ' + e.ref);
      }
      L.push('Recibe: ' + (e.nombre || '—') + (e.tel ? ' · Tel. ' + tel(e.tel) : ''));
      var paq = e.paq === OTRA_PAQ ? (e.paqOtra || 'otra') : (e.paq || 'sin preferencia');
      L.push('Paquetería: ' + paq + (e.convenioSi ? ' (convenio: ' + (e.convenio || '—') + ')' : ''));
    } else {
      L.push('Entrega: paso al local' + (d.local ? ' de ' + d.local : ''));
    }
    if (d.factura) L.push('Factura: sí (mando mi constancia de situación fiscal por aquí)');
    if (d.nombre) L.push('Nombre: ' + d.nombre);
    return L.join('\n');
  }

  // ---------- Pasos completos ----------
  function marcarPasos(d) {
    var ok = [
      !!(d.marca && d.modelo && d.anio),
      d.piezas.length > 0 && d.piezas.every(piezaCompleta),
      d.entrega === 'local' || faltaEnvio(d.envio).length === 0
    ];
    ok.forEach(function (v, i) { if (steps[i]) steps[i].classList.toggle('is-done', v); });
  }

  // ---------- Guardar avance (solo en este navegador) ----------
  function guardar(d) {
    if (restaurando) return;
    var env = {};
    Object.keys(E).forEach(function (k) { env[k] = E[k].value; });
    try {
      localStorage.setItem(LS, JSON.stringify({
        marca: marca.value, marcaTxt: marcaTxt.value, modeloSel: modeloSel.value, modeloTxt: modeloTxt.value, anio: anio.value,
        piezas: d.piezas.map(function (x) { return { i: x.i, otra: x.otra, pos: x.pos, lado: x.lado, det: x.det, nota: x.nota }; }),
        entrega: d.entrega, local: d.local, recibe: d.envio.recibe, convenio: d.envio.convenioSi ? 'si' : 'no',
        env: env, estadoAuto: E.estado.dataset.auto || '', nombre: d.nombre, factura: d.factura ? 'si' : 'no'
      }));
    } catch (e) { /* modo privado o sin espacio: no pasa nada */ }
  }
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
      if (s.local) marcarRadio('local', s.local);
      if (s.recibe) marcarRadio('recibe', s.recibe);
      if (s.convenio) marcarRadio('convenio', s.convenio);
      if (s.factura) marcarRadio('factura', s.factura);
      if (s.env) Object.keys(E).forEach(function (k) { if (s.env[k] != null) E[k].value = s.env[k]; });
      E.estado.dataset.auto = s.estadoAuto || '';
      nombre.value = s.nombre || '';
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
        (x.det || []).forEach(function (v) {
          li.querySelectorAll('.q-det input').forEach(function (c) { if (c.value === v) c.checked = true; });
        });
        li.querySelector('.q-nota').value = x.nota || '';
      });
    } else {
      agregar();
    }
    if (params.get('envio') === '1') marcarRadio('entrega', 'envio');
    mostrarEntrega();
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
  function unir(arr) { return arr.length > 1 ? arr.slice(0, -1).join(', ') + ' y ' + arr[arr.length - 1] : (arr[0] || ''); }
  function validar() {
    var d = datos(), primero = null;
    function falla(el) { if (!primero) primero = el; }

    var faltan = [];
    marcar(marca, !marca.value); if (!marca.value) { faltan.push('la marca'); falla(marca); }
    if (marca.value === OTRA_MARCA) { marcar(marcaTxt, !d.marca); if (!d.marca) { faltan.push('la marca'); falla(marcaTxt); } }
    var modeloCampo = !wrapModeloSel.hidden && modeloSel.value !== OTRO_MODELO ? modeloSel : modeloTxt;
    marcar(modeloCampo, !d.modelo); if (!d.modelo) { faltan.push('el modelo'); falla(modeloCampo); }
    marcar(anio, !d.anio); if (!d.anio) { faltan.push('el año'); falla(anio); }
    error('err-carro', faltan.length ? 'Falta ' + unir(faltan) + '.' : '');

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

    Object.keys(E).forEach(function (k) { E[k].removeAttribute('aria-invalid'); });
    var fe = d.entrega === 'envio' ? faltaEnvio(d.envio) : [];
    fe.forEach(function (f) { marcar(f[1], true); falla(f[1]); });
    error('err-envio', fe.length ? 'Para el envío falta: ' + unir(fe.map(function (f) { return f[0]; })) + '.' : '');

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
      var caja = v.primero.closest('.field, .qitem, .qstep') || v.primero;
      caja.scrollIntoView({ block: 'center', behavior: 'smooth' });
      enfocar(v.primero);
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
    if (TOUCH) {
      window.location.href = url;
    } else {
      var w = window.open(url, '_blank');
      if (w) { w.opener = null; } else { window.location.href = url; }
    }
  });

  function limpiarErrores() {
    form.classList.remove('was-submitted');
    form.querySelectorAll('[aria-invalid]').forEach(function (el) { el.removeAttribute('aria-invalid'); });
    ['err-carro', 'err-piezas', 'err-envio'].forEach(function (id) { error(id, ''); });
    done.hidden = true;
  }
  // Nueva cotización: conserva carro y datos de envío, limpia las piezas
  $('qnew').addEventListener('click', function () {
    list.innerHTML = '';
    agregar();
    limpiarErrores();
    actualizar();
    list.closest('.qstep').scrollIntoView({ block: 'start', behavior: 'smooth' });
  });
  $('qclear').addEventListener('click', function () {
    try { localStorage.removeItem(LS); localStorage.removeItem('charro-cotizacion-v1'); } catch (e) { /* nada */ }
    form.reset();
    E.estado.dataset.auto = '';
    list.innerHTML = '';
    onMarca(false); onModelo(false);
    limpiarErrores();
    agregar();
    mostrarEntrega();
    actualizar();
    marca.focus({ preventScroll: true });
    form.scrollIntoView({ block: 'start', behavior: 'smooth' });
  });

  // ---------- Inicio ----------
  try { localStorage.removeItem('charro-cotizacion-v1'); } catch (e) { /* versión anterior */ }
  restaurar();
  actualizar();
})();
