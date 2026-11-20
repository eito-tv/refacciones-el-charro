// Refacciones El Charro · cotizador
// Arma el mensaje con carro, piezas (con lado o posición según la pieza) y entrega,
// y abre WhatsApp en el número principal.
(function () {
  var WA = '523335044838'; // número principal (sin +, con 52)
  var MAX_PIEZAS = 6;

  // ---------- Datos ----------
  // lado: izquierdo/derecho · pos: delantera/trasera · opc: esas preguntas aceptan "No aplica"
  var PIEZAS = [
    { n: 'Faro', lado: true },
    { n: 'Faro de niebla', lado: true },
    { n: 'Calavera', lado: true },
    { n: 'Fascia', pos: true },
    { n: 'Defensa', pos: true },
    { n: 'Marco de radiador' },
    { n: 'Cofre' },
    { n: 'Parrilla' },
    { n: 'Espejo', lado: true },
    { n: 'Salpicadera', lado: true },
    { n: 'Puerta', pos: true, lado: true, dos: true },
    { n: 'Manija', pos: true, lado: true, dos: true },
    { n: 'Moldura', pos: true, lado: true, opc: true },
    { n: 'Tolva', pos: true, lado: true, opc: true },
    { n: 'Radiador' },
    { n: 'Condensador' },
    { n: 'Motoventilador' },
    { n: 'Otra pieza', otra: true }
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
  var params = new URLSearchParams(location.search);

  function opt(value, text) { var o = document.createElement('option'); o.value = value; o.textContent = text; return o; }

  // ---------- Marca ----------
  marca.appendChild(opt('', 'Elige la marca'));
  var g1 = document.createElement('optgroup'); g1.label = 'Las más comunes';
  COMUNES.forEach(function (m) { g1.appendChild(opt(m, m)); });
  var g2 = document.createElement('optgroup'); g2.label = 'Todas (A–Z)';
  MARCAS.forEach(function (m) { g2.appendChild(opt(m, m)); });
  var g3 = document.createElement('optgroup'); g3.label = '¿No está?';
  g3.appendChild(opt(OTRA_MARCA, 'No encuentro mi marca, la escribo'));
  marca.appendChild(g1); marca.appendChild(g2); marca.appendChild(g3);

  // ---------- Año ----------
  var y = new Date().getFullYear() + 1;
  anio.appendChild(opt('', 'Elige el año'));
  for (var a = y; a >= 1985; a--) anio.appendChild(opt(String(a), String(a)));
  anio.appendChild(opt('antes de 1985', 'Antes de 1985'));
  anio.appendChild(opt('no sé', 'No sé el año'));

  function onMarca() {
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
    if (v === OTRA_MARCA) marcaTxt.focus();
  }
  function onModelo() {
    wrapModeloTxt.hidden = modeloSel.value !== OTRO_MODELO;
    if (modeloSel.value === OTRO_MODELO) modeloTxt.focus();
  }
  marca.addEventListener('change', function () { onMarca(); actualizar(); });
  modeloSel.addEventListener('change', function () { onModelo(); actualizar(); });

  // ---------- Piezas ----------
  var uid = 0;
  function segmento(cont, name, opciones) {
    cont.innerHTML = '';
    opciones.forEach(function (o) {
      var l = document.createElement('label');
      var i = document.createElement('input'); i.type = 'radio'; i.name = name; i.value = o[0];
      var s = document.createElement('span'); s.textContent = o[1];
      l.appendChild(i); l.appendChild(s); cont.appendChild(l);
    });
  }
  function configurar(li) {
    var p = PIEZAS[li.querySelector('.q-pieza').value];
    var wPos = li.querySelector('.q-wrap-pos'), wLado = li.querySelector('.q-wrap-lado'), wOtra = li.querySelector('.q-wrap-otra');
    var id = li.dataset.id;
    wOtra.hidden = !(p && p.otra);
    wPos.hidden = !(p && p.pos);
    wLado.hidden = !(p && p.lado);
    if (p && p.pos) {
      var o = [['delantera', 'Delantera'], ['trasera', 'Trasera']];
      if (!p.dos) o.push(['ambas', 'Las dos']);
      if (p.opc) o.push(['na', 'No aplica']);
      segmento(li.querySelector('.q-pos'), 'pos-' + id, o);
    }
    if (p && p.lado) {
      var l = [['izq', 'Izquierdo (piloto)'], ['der', 'Derecho (copiloto)'], ['ambos', 'Los dos']];
      if (p.opc) l.push(['na', 'No aplica']);
      segmento(li.querySelector('.q-lado'), 'lado-' + id, l);
    }
  }
  function numerar() {
    var items = list.querySelectorAll('.qitem');
    items.forEach(function (li, i) {
      li.querySelector('.qitem__n').textContent = 'Pieza ' + (i + 1);
      li.querySelector('.qitem__head').hidden = items.length === 1;
      li.querySelector('.qitem__del').hidden = items.length === 1;
    });
    addBtn.hidden = items.length >= MAX_PIEZAS;
  }
  function agregar(preset) {
    var li = tpl.content.firstElementChild.cloneNode(true);
    li.dataset.id = String(++uid);
    var sel = li.querySelector('.q-pieza');
    sel.appendChild(opt('', 'Elige la pieza'));
    PIEZAS.forEach(function (p, i) { sel.appendChild(opt(String(i), p.n)); });
    if (preset) {
      var idx = PIEZAS.findIndex(function (p) { return p.n.toLowerCase() === preset.toLowerCase(); });
      if (idx >= 0) sel.value = String(idx);
    }
    sel.addEventListener('change', function () { configurar(li); actualizar(); });
    li.querySelector('.qitem__del').addEventListener('click', function () {
      li.remove(); numerar(); actualizar();
      var last = list.querySelector('.qitem:last-child .q-pieza'); if (last) last.focus();
    });
    list.appendChild(li);
    configurar(li);
    numerar();
    return li;
  }
  addBtn.addEventListener('click', function () {
    var li = agregar();
    li.querySelector('.q-pieza').focus();
    actualizar();
  });

  // ---------- Entrega ----------
  function entrega() { var r = form.querySelector('input[name="entrega"]:checked'); return r ? r.value : 'local'; }
  form.querySelectorAll('input[name="entrega"]').forEach(function (r) {
    r.addEventListener('change', function () { wrapEnvio.hidden = entrega() !== 'envio'; if (!wrapEnvio.hidden) ciudad.focus(); actualizar(); });
  });
  cp.addEventListener('input', function () { cp.value = cp.value.replace(/\D/g, '').slice(0, 5); });

  // ---------- Leer datos ----------
  function valor(name) { var r = form.querySelector('input[name="' + name + '"]:checked'); return r ? r.value : ''; }
  function datos() {
    var m = marca.value === OTRA_MARCA ? marcaTxt.value.trim() : marca.value;
    var mod = (!wrapModeloSel.hidden && modeloSel.value && modeloSel.value !== OTRO_MODELO) ? modeloSel.value : modeloTxt.value.trim();
    var piezas = [];
    list.querySelectorAll('.qitem').forEach(function (li) {
      var p = PIEZAS[li.querySelector('.q-pieza').value];
      var id = li.dataset.id;
      piezas.push({
        li: li, p: p,
        otra: li.querySelector('.q-otra').value.trim(),
        pos: p && p.pos ? valor('pos-' + id) : '',
        lado: p && p.lado ? valor('lado-' + id) : ''
      });
    });
    return { marca: m, modelo: mod, anio: anio.value, piezas: piezas, entrega: entrega(),
      ciudad: ciudad.value.trim(), cp: cp.value.trim(), nombre: nombre.value.trim(), detalle: detalle.value.trim() };
  }

  var POS = { delantera: 'delantera', trasera: 'trasera', ambas: 'delantera y trasera' };
  var LADO = { izq: 'lado izquierdo (piloto)', der: 'lado derecho (copiloto)', ambos: 'ambos lados' };
  function textoPieza(x) {
    if (!x.p) return '';
    var nombreP = x.p.otra ? (x.otra || 'otra pieza') : x.p.n;
    var t = nombreP;
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
  function actualizar() { preview.textContent = mensaje(datos()); }
  function alCambiar() { actualizar(); if (form.classList.contains('was-submitted')) validar(); }
  form.addEventListener('input', alCambiar);
  form.addEventListener('change', alCambiar);

  // ---------- Validar y mandar ----------
  function marcar(el, malo) { if (el) el.setAttribute('aria-invalid', malo ? 'true' : 'false'); }
  function error(id, texto) { var e = $(id); e.textContent = texto || ''; e.hidden = !texto; }
  function validar() {
    var d = datos(), primero = null;
    function falla(el) { if (!primero) primero = el; }

    // Carro
    var errCarro = [];
    marcar(marca, !marca.value); if (!marca.value) { errCarro.push('la marca'); falla(marca); }
    if (marca.value === OTRA_MARCA) { marcar(marcaTxt, !d.marca); if (!d.marca) { errCarro.push('la marca'); falla(marcaTxt); } }
    var modeloCampo = !wrapModeloSel.hidden && modeloSel.value !== OTRO_MODELO ? modeloSel : modeloTxt;
    marcar(modeloCampo, !d.modelo); if (!d.modelo) { errCarro.push('el modelo'); falla(modeloCampo); }
    marcar(anio, !d.anio); if (!d.anio) { errCarro.push('el año'); falla(anio); }
    var unidos = errCarro.length > 1 ? errCarro.slice(0, -1).join(', ') + ' y ' + errCarro[errCarro.length - 1] : errCarro[0];
    error('err-carro', errCarro.length ? 'Falta ' + unidos + '.' : '');

    // Piezas
    var errP = '';
    d.piezas.forEach(function (x, i) {
      var sel = x.li.querySelector('.q-pieza');
      var n = d.piezas.length > 1 ? ' en la pieza ' + (i + 1) : '';
      marcar(sel, !x.p);
      if (!x.p) { errP = errP || 'Elige la pieza' + n + '.'; falla(sel); return; }
      if (x.p.otra && !x.otra) { errP = errP || 'Escribe qué pieza necesitas' + n + '.'; falla(x.li.querySelector('.q-otra')); }
      if (x.p.pos && !x.pos) { errP = errP || 'Elige si es delantera o trasera' + n + '.'; falla(x.li.querySelector('.q-pos input')); }
      if (x.p.lado && !x.lado) { errP = errP || 'Elige el lado' + n + '.'; falla(x.li.querySelector('.q-lado input')); }
      x.li.classList.toggle('is-bad', !!(x.p.otra && !x.otra) || !!(x.p.pos && !x.pos) || !!(x.p.lado && !x.lado));
    });
    error('err-piezas', errP);

    // Entrega
    var errE = d.entrega === 'envio' && !d.ciudad ? 'Escribe la ciudad a donde te la enviamos.' : '';
    marcar(ciudad, !!errE); if (errE) falla(ciudad);
    error('err-envio', errE);

    return { d: d, primero: primero };
  }
  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    form.classList.add('was-submitted');
    var v = validar(), d = v.d;
    if (v.primero) {
      v.primero.focus({ preventScroll: true });
      v.primero.scrollIntoView({ block: 'center', behavior: 'smooth' });
      return;
    }
    var url = 'https://wa.me/' + WA + '?text=' + encodeURIComponent(mensaje(d));
    if (window.goatcounter && window.goatcounter.count) window.goatcounter.count({ path: 'clic-wa-cotizador', title: 'wa-cotizador', event: true });
    var w = window.open(url, '_blank');
    if (w) { w.opener = null; } else { window.location.href = url; }
  });

  // ---------- Inicio ----------
  onMarca();
  agregar(params.get('pieza'));
  if (params.get('envio') === '1') {
    var r = form.querySelector('input[name="entrega"][value="envio"]');
    if (r) { r.checked = true; wrapEnvio.hidden = false; }
  }
  actualizar();
})();
