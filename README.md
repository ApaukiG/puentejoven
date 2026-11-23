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

## Dos perfiles: joven y empresa
- **Joven**: busca empleo, toma cursos, pide mentorías y sigue el estado de sus postulaciones en "Mi panel".
- **Empresa**: tiene su propio perfil en "Mi empresa", ve sus ofertas publicadas, revisa a los postulantes
  y cambia su estado (vista → en revisión → entrevista → seleccionado / no seleccionado con retroalimentación).
- Se elige el rol con "Soy joven" / "Soy empresa" en la portada o con el selector Joven | Empresa del panel.
- El ciclo está conectado: lo que la empresa responde a Camila (la joven de ejemplo) aparece en el panel de joven.
- Datos de ejemplo de la empresa y de otros postulantes: `EMPRESA_INICIAL` y `CANDIDATOS` en `js/data.js`.

## Ofertas más completas (2da validación, nov. 2026)
Después de entrevistar a Salomé, José Ignacio, Julián, Aida y Patricia, cada oferta ahora muestra:
- **Barrio o sector** además de la ciudad. El botón "Ver ubicación" muestra el mapa dentro de la página y "Cómo llegar" abre la ruta en Google Maps.
- **Horario** de trabajo e **industria** de la empresa.
- **Experiencia requerida** (en verde cuando no pide ninguna).
- Sello **Empresa verificada** (RUC, dirección y referencias revisadas) o "En verificación".
- Filtros nuevos: "Solo sin experiencia requerida" y "Solo empresas verificadas". El buscador también encuentra barrios.
- El formulario "Publicar oferta" pide barrio, horario y experiencia.

## Datos guardados
Postulaciones, cursos, alertas y ofertas publicadas se guardan en el navegador (localStorage).
En "Mi panel" → "Restablecer datos de ejemplo" vuelve al estado inicial.
