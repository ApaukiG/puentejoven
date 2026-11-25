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

## Después de tu primer empleo (2da validación)
En "Mi panel" del joven:
- **Acompañamiento de 90 días**: cuando una empresa selecciona al joven, se le asigna un mentor de su área y tiene 3 seguimientos (primera semana, primer mes, tercer mes). Si responde "Necesito apoyo", se crea una mentoría.
- **Certificado de pasantía**: al cerrar el acompañamiento de una pasantía, la empresa emite un certificado que aparece en "Pasantías y proyectos".
- Para probarlo: en "Mis postulaciones" usa "Simular respuesta de la empresa" en la pasantía de Grupo Pacífico hasta que salga seleccionada.

## Feedback de la presentación (nov. 2026)
- **Lo que más pide el mercado** (Capacitaciones): ranking de habilidades según cuántas ofertas publicadas las piden, por carrera. Los cursos se ordenan por demanda y los 3 más pedidos llevan el sello "Muy pedido".
- **Asesor IA de empleabilidad** (Mi panel): el joven pregunta qué mejorar, qué curso tomar, cómo mejorar su hoja de vida, a qué ofertas postular o cómo prepararse para una entrevista. Es un **prototipo**: las respuestas salen de reglas que cruzan el perfil con las ofertas (`HABILIDADES_MERCADO` en `js/data.js`). En producción se conectaría un modelo de IA desde un servidor, nunca con la clave en el navegador.
- **Análisis de la hoja de vida** (dentro del Asesor): el joven sube su CV en PDF, Word (.docx) o .txt. Se lee en el navegador con pdf.js y mammoth (desde jsDelivr), sin subirlo a ningún servidor, y se revisa con reglas: secciones, contacto, largo, logros con números, verbos de acción, frases genéricas, datos personales innecesarios y habilidades que piden las ofertas de su carrera.

## Datos guardados
Postulaciones, cursos, alertas y ofertas publicadas se guardan en el navegador (localStorage).
En "Mi panel" → "Restablecer datos de ejemplo" vuelve al estado inicial.
