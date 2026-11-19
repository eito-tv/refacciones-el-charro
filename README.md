# Refacciones El Charro · landing provisional

Página de una sola sección para presentar el negocio y mandar a la gente a WhatsApp y redes.
HTML, CSS y JS sin dependencias ni build.

```
index.html      página
styles.css      estilos
script.js       animación al hacer scroll + año del footer
favicon.ico
.nojekyll       evita que GitHub Pages procese el sitio con Jekyll
assets/
  logo.png              logo (respaldo PNG, 720 px)
  logo-360.webp         logo WebP (celular)
  logo-720.webp         logo WebP (pantallas retina / escritorio)
  apple-touch-icon.png  ícono para iPhone
  og-image.jpg          imagen 1200×630 que aparece al compartir el link
```

## 1. Llena los marcadores antes de publicar

Busca y reemplaza en `index.html` (Ctrl+H en VS Code):

| Marcador | Qué poner | Dónde aparece |
|---|---|---|
| ~~`[NUMERO_10_DIGITOS]`~~ | Ya está lleno: principal 33 3504 4838, alterno 33 3141 5065 | botones de WhatsApp, botón flotante, footer y JSON-LD |
| `[HORARIO]` | En la sección **Visítanos**: texto normal (ej. `Lunes a viernes 9:00 a 18:00 · Sábado 9:00 a 14:00`). En el **JSON-LD** (3 veces): formato schema, ej. `Mo-Fr 09:00-18:00` y si hay sábado cambia la línea por `["Mo-Fr 09:00-18:00", "Sa 09:00-14:00"]` | sección Visítanos y JSON-LD |
| ~~`[URL_SITIO]`~~ | Ya está lleno con `https://eito-tv.github.io/refacciones-el-charro/` | canonical, Open Graph, Twitter y JSON-LD |
| `[LINK_FACEBOOK]` | link de la página de Facebook | botones comentados en hero y footer: quita `<!--` y `-->` |
| `[LINK_MERCADO_LIBRE]` | link de la tienda de Mercado Libre | igual que Facebook |

Mientras un link de red siga con marcador, deja su botón comentado.
Si tienen el código postal del local de 5 de Febrero, agrégalo al JSON-LD (`postalCode`).

## 2. Publicar en GitHub Pages

1. Crea un repositorio en GitHub (público, en planes gratis) y sube **el contenido de esta carpeta** a la raíz del repo (que `index.html` quede en la raíz).
2. En el repo: **Settings → Pages**.
3. En *Build and deployment* → *Source*: **Deploy from a branch**. Branch: `main`, carpeta `/ (root)`. **Save**.
4. En 1–2 minutos la página queda en `https://TU-USUARIO.github.io/NOMBRE-DEL-REPO/`. Esa es la URL que va en `[URL_SITIO]`.
5. Prueba cómo se ve el link al compartirlo: pégalo en un chat de WhatsApp contigo mismo. WhatsApp guarda la vista previa en caché; si cambias la imagen, cambia el nombre del archivo (ej. `og-image-2.jpg`).

## 3. Conectar un dominio propio (más adelante)

1. Compra el dominio (ej. `refaccioneselcharro.com.mx`).
2. En **Settings → Pages → Custom domain** escribe el dominio y guarda. GitHub crea un archivo `CNAME` en el repo.
3. En el panel de tu proveedor de dominio:
   - Para `www`: registro **CNAME** `www` → `TU-USUARIO.github.io`
   - Para el dominio sin www: registros **A** a `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
4. Cuando el DNS propague (minutos a 24 h), activa **Enforce HTTPS** en Settings → Pages.
5. Cambia `[URL_SITIO]` (o la URL vieja de github.io) por el dominio nuevo en `index.html`.

## Notas

- Sin cookies, sin analítica y sin formularios.
- La tipografía de títulos (Lilita One) se carga desde Google Fonts. Si se quiere cero peticiones a terceros, se puede descargar el `.woff2` a `assets/` y cambiar el `<link>` por un `@font-face` local.
- No se publica ninguna ubicación aparte de los dos locales.
