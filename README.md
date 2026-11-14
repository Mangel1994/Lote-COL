# Lote Col

Web estática sobre café colombiano de origen, en español e inglés. No necesita instalación ni compilación.

## Archivos

- `index.html`: contenido. Cada texto tiene dos versiones, `lang="es"` y `lang="en"`. Al editar un texto, cambia las dos.
- `styles.css`: diseño. Los colores y las tipografías están en las variables del principio (`:root`).
- `montana.webp`, `cloud-c1.webp`, `cloud-c2.webp`, `cloud-c3.webp`, `plant.webp`: ilustración de la portada y sus tres nubes, que se animan por separado. Los textos que la acompañan (altitudes y "Zona cafetera") son texto real del `index.html`, en español e inglés.
- `aviso-legal.html`, `privacidad.html`, `cookies.html`, `accesibilidad.html`: páginas legales en español e inglés (generadas con el mismo diseño). Enlazadas desde el pie. `legal.js` solo gestiona el idioma en ellas. Revisa los datos del titular y la fecha de actualización antes de publicar.
- `*.woff` y `OFL-*.txt`: tipografías alojadas en el propio sitio (licencia SIL OFL 1.1, con sus textos de licencia). Así no se hace ninguna petición a Google y no hace falta aviso de cookies.
- `og-image.jpg`: vista previa al compartir el enlace (WhatsApp, Telegram, redes). `favicon-32.png`, `apple-touch-icon.png`: iconos de la pestaña y del móvil. `robots.txt` y `sitemap.xml`: para buscadores.
- `main.js`: filtro de regiones, selector de idioma y calculadora de preparación (objeto `METHODS`).
- Mapa de regiones y rueda de sabores: su estilo está en el bloque final de `styles.css` ("Mapa y rueda"). Usa solo los neutros de la marca y el azul `--accent`; no añadas colores nuevos ahí.
- `montana.webp`: ilustración de la portada (debe estar junto a `index.html`) (imagen con fondo transparente). El eje de altitud y la etiqueta "Zona cafetera" son texto del propio `index.html`, no parte de la imagen, y cambian con el idioma.

## Calculadora (Preparar)

- Ancho máximo de 900 px. Todos los botones y controles táctiles miden al menos 48 × 48 px.
- Escritorio: la tarjeta de la receta se queda fija al lado mientras bajas por los controles y el paso a paso.
- Móvil: cuando los controles están a la vista y la receta no, aparece abajo una barra con café, agua y ratio, y un botón «Ver receta».
- Teclado: Tab recorre método → café → agua → ratio → restablecer → copiar → cronómetro. Flechas en los grupos de método y ratio. En los campos: ↑/↓ un paso, Mayús+↑/↓ o RePág/AvPág de 10 en 10, Intro confirma y Esc deshace.
- «Restablecer valores» vuelve a la cantidad y el ratio por defecto del método elegido.

## Probarla en tu ordenador

1. Abre la carpeta en un editor de código, por ejemplo Visual Studio Code.
2. Abre `index.html` en el navegador, o ejecuta `python3 -m http.server 8000` dentro de la carpeta y visita http://localhost:8000.

## Añadir una región

1. Copia un bloque `<li class="region">` completo y pégalo en la lista.
2. Cambia el nombre, la descripción y las notas, en español y en inglés.
3. Calcula la barra de altitud con la altura mínima y máxima en metros:
   `--a = (mínima - 800) / 16` y `--b = (máxima - 800) / 16`.
4. Pon en `data-notes` las etiquetas del filtro: `dulce`, `frutal`, `citrico`, `floral`, `chocolate`.
5. Actualiza el titular "Ocho regiones" si cambia el número.

## Publicarla

Sube la carpeta completa a un servicio de alojamiento estático (GitHub Pages, Netlify o Cloudflare Pages). El archivo de entrada es `index.html`.
