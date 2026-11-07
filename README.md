# Lote Col

Web estática sobre café colombiano de origen, en español e inglés. No necesita instalación ni compilación.

## Archivos

- `index.html`: contenido. Cada texto tiene dos versiones, `lang="es"` y `lang="en"`. Al editar un texto, cambia las dos.
- `styles.css`: diseño. Los colores y las tipografías están en las variables del principio (`:root`).
- `montana.webp`: ilustración de la portada. Los textos que la acompañan (altitudes y "Zona cafetera") son texto real del `index.html`, en español e inglés.
- `aviso-legal.html`, `privacidad.html`, `cookies.html`, `accesibilidad.html`: páginas legales en español e inglés (generadas con el mismo diseño). Enlazadas desde el pie. `legal.js` solo gestiona el idioma en ellas. Revisa los datos del titular y la fecha de actualización antes de publicar.
- `fonts/`: tipografías alojadas en el propio sitio (licencia SIL OFL 1.1, con sus textos de licencia). Así no se hace ninguna petición a Google y no hace falta aviso de cookies.
- `main.js`: filtro de regiones, selector de idioma y calculadora de preparación (objeto `METHODS`).
- `montana.webp`: ilustración de la portada (debe estar junto a `index.html`) (imagen con fondo transparente). El eje de altitud y la etiqueta "Zona cafetera" son texto del propio `index.html`, no parte de la imagen, y cambian con el idioma.

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
