# Guía de mantenimiento

Página de una sola hoja: quiénes somos, qué vendemos, cómo trabajamos, pagos, envíos, contacto y preguntas frecuentes.
HTML, CSS y JS sin dependencias ni build. Se publica con GitHub Pages.

```
index.html        página
styles.css        estilos (colores del logo)
script.js         animaciones, menú activo, cotizador de WhatsApp y conteo de clics
404.html          página de "no encontrado"
robots.txt        reglas para buscadores (cuenta solo con dominio propio)
sitemap.xml       mapa del sitio para Google Search Console
site.webmanifest  nombre e ícono si alguien la guarda en su celular
favicon.ico
.nojekyll         evita que GitHub Pages procese el sitio con Jekyll
assets/
  logo.png / logo-360.webp / logo-720.webp   logo
  apple-touch-icon.png                        ícono para iPhone
  og-image.jpg                                imagen 1200×630 al compartir el link
  lilita-one.woff2                            tipografía de títulos (licencia SIL OFL, alojada aquí)
```

## Cómo cambiar cosas comunes

| Qué | Dónde |
|---|---|
| Número de WhatsApp | Busca `523335044838` en `index.html`, `script.js` y `404.html` |
| Horario | Sección `id="contacto"` y `openingHoursSpecification` en el JSON-LD |
| Preguntas frecuentes | Sección `id="preguntas"` **y** el bloque `FAQPage` del JSON-LD (deben decir lo mismo) |
| Paqueterías | Sección `id="envios"` y la pregunta de envíos |

Todos los botones de WhatsApp mandan un mensaje que empieza con **"Hola, vengo de la página web"**. Así quien contesta sabe que el cliente llegó por aquí. Si alguien llega con ese mensaje, anótenlo: es la forma más simple de medir si la página trae clientes.

## Marcadores pendientes (busca `MARCADOR` en `index.html`)

- **Galería de fotos:** pon fotos reales del local y del surtido en `assets/fotos/` y descomenta el bloque.
- **Devoluciones:** descomenta la pregunta cuando definan la política (y agrégala al JSON-LD).
- **Facebook y Mercado Libre:** descomenta los botones en el pie cuando tengan los links.
- **Fundador:** opcional, nombre e historia en "Quiénes somos".
- **Search Console:** etiqueta de verificación en el `<head>`.
- **Analítica:** script en el `<head>`.

## Dar de alta en Google (Search Console)

1. Entra a <https://search.google.com/search-console> con refaccioneselcharro@gmail.com.
2. **Agregar propiedad** → **Prefijo de la URL** → `https://eito-tv.github.io/refacciones-el-charro/`.
3. Método **Etiqueta HTML**: copia el `content="..."`, pégalo en el marcador de `index.html`, sube el cambio y da **Verificar**.
4. En **Sitemaps** agrega `sitemap.xml`.

## Analítica (GoatCounter, gratis y sin cookies)

1. Crea cuenta en <https://www.goatcounter.com> con un código, p. ej. `refaccioneselcharro`.
2. Pega en el marcador de analítica del `<head>`:
   `<script data-goatcounter="https://refaccioneselcharro.goatcounter.com/count" async src="//gc.zgo.at/count.js"></script>`
3. Listo: cuenta visitas y, gracias a `script.js`, también cada clic a WhatsApp (`clic-wa-inicio`, `clic-wa-cotizador`, etc.).

## Publicar en GitHub Pages

Ya está configurado (Settings → Pages → rama `main`, carpeta `/ (root)`). Cada `git push` a `main` se publica en 1–2 minutos.
WhatsApp guarda la vista previa del link en caché; si cambias `og-image.jpg`, cámbiale el nombre.

## Conectar un dominio propio (más adelante)

1. Compra el dominio (ej. `refaccioneselcharro.com.mx`).
2. **Settings → Pages → Custom domain**: escribe el dominio y guarda (GitHub crea el archivo `CNAME`).
3. En el panel del dominio: **CNAME** `www` → `eito-tv.github.io`; y registros **A** a `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`.
4. Cuando propague, activa **Enforce HTTPS**.
5. Reemplaza `https://eito-tv.github.io/refacciones-el-charro/` por el dominio en `index.html`, `robots.txt` y `sitemap.xml`, y en `404.html` cambia `/refacciones-el-charro/` por `/`.
