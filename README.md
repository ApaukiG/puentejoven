# Puente Joven

Prototipo web para reducir el desempleo y subempleo de jóvenes recién graduados en Ecuador.

## Cómo abrirlo
Doble clic en `index.html`. No necesita instalar nada (HTML, CSS y JavaScript puro).
Opcional: en VS Code, clic derecho → "Open with Live Server".

## Estructura
```
index.html          → las 8 secciones del sitio (una sola página con navegación por #)
css/styles.css      → diseño, paleta y responsive
js/data.js          → datos: testimonios, cursos, mentores, ofertas, preguntas del simulador
js/app.js           → interactividad: filtros, postulaciones, simulador, formularios
img/testimonios/    → aquí van las fotos reales
```

## Poner las fotos de los testimonios
Guarda las fotos (cuadradas, ideal 400×400) con estos nombres exactos:
`odalis.jpg`, `mateo.jpg`, `anabel.jpg`, `patricia.jpg`, `andres.jpg`.
Mientras no existan, se muestran las iniciales.

## Editar contenido
- Ofertas, cursos y mentores: `js/data.js`.
- Equipo (sección Nosotros): busca "Integrante 1" en `index.html`.

## Datos guardados
Postulaciones, cursos, alertas y ofertas publicadas se guardan en el navegador (localStorage).
En "Mi panel" → "Restablecer datos de ejemplo" vuelve al estado inicial.
