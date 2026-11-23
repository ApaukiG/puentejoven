/* =========================================================
   PUENTE JOVEN — Datos de ejemplo
   Todo lo que está aquí es simulado (ofertas, cursos,
   mentores, empresas). Los testimonios y cifras del INEC
   provienen del proceso de validación del proyecto.
   ========================================================= */

const CARRERAS = [
  "Administración",
  "Contabilidad y Auditoría",
  "Marketing",
  "Sistemas y TI",
  "Comunicación y Diseño",
  "Turismo y Gastronomía",
];

const CIUDADES = ["Quito", "Guayaquil", "Cuenca", "Ibarra", "Ambato", "Manta", "Loja"];

/* ---------- Testimonios reales (validación) ---------- */
const TESTIMONIOS = [
  {
    id: "odalis",
    tipo: "joven",
    nombre: "Odalis Córdova",
    rol: "23 años · Egresada de Administración de Empresas (UTN)",
    foto: "img/testimonios/odalis.jpg",
    frase:
      "Me gradué hace seis meses y sigo trabajando en la frutería de mi mamá. Envío hojas de vida, pero me piden experiencia previa y no valoran mis pasantías.",
    fraseExtra:
      "Aprendo sola con tutoriales y cursos gratuitos, pero como no tengo certificados, no me lo reconocen.",
  },
  {
    id: "mateo",
    tipo: "joven",
    nombre: "Mateo Guayasamín",
    rol: "19 años · Estudiante de Auditoría (UDLA)",
    foto: "img/testimonios/mateo.jpg",
    frase:
      "Vi de cerca cómo mi hermanastro pasó seis meses desempleado después de graduarse. Debería haber más oportunidades para que los jóvenes sin experiencia demostremos lo que sabemos y aprendamos dentro del trabajo.",
  },
  {
    id: "anabel",
    tipo: "experto",
    nombre: "Anabel Galarza",
    rol: "25 años en Recursos Humanos · Executive Search, Korn Ferry Ecuador",
    foto: "img/testimonios/anabel.jpg",
    frase:
      "La experiencia no debería ser el único requisito: importan las ganas de aprender, la adaptabilidad y el potencial. Recomiendo pasantías, programas de desarrollo y de high potentials.",
  },
  {
    id: "patricia",
    tipo: "experto",
    nombre: "Patricia Minango",
    rol: "25 años en Recursos Humanos · Jefa de personal, sector gastronómico",
    foto: "img/testimonios/patricia.jpg",
    frase:
      "Yo misma fui pasante dos años sin pago. Si la experiencia fuera requisito indispensable, los jóvenes nunca encontrarían trabajo. Hacen falta puestos junior y pasantías reales.",
  },
  {
    id: "andres",
    tipo: "experto",
    nombre: "Andrés Isch",
    rol: "Exministro del Trabajo de Ecuador (2020–2021)",
    foto: "img/testimonios/andres.jpg",
    frase:
      "Las empresas se equivocan al tratar las pasantías como simples trámites. Propongo educación dual, pasantías de mayor calidad y más colaboración entre universidades y empresas.",
  },
];

/* ---------- Cursos (ejemplo) ---------- */
const CURSOS = [
  { id: "c1", titulo: "Excel avanzado: tablas dinámicas y BUSCARX", categoria: "Herramientas digitales", carreras: ["Administración", "Contabilidad y Auditoría", "Marketing"], horas: 20, nivel: "Intermedio", costo: 0, proveedor: "Academia Puente Joven", icono: "laptop" },
  { id: "c2", titulo: "Facturación electrónica paso a paso", categoria: "Contabilidad práctica", carreras: ["Contabilidad y Auditoría", "Administración"], horas: 12, nivel: "Básico", costo: 0, proveedor: "Aliado tributario (ejemplo)", icono: "dollar" },
  { id: "c3", titulo: "Inglés para entrevistas de trabajo", categoria: "Idiomas", carreras: ["Todas"], horas: 30, nivel: "A2 – B1", costo: 9, proveedor: "Academia Puente Joven", icono: "chat" },
  { id: "c4", titulo: "Comunicación efectiva y presentaciones", categoria: "Habilidades blandas", carreras: ["Todas"], horas: 8, nivel: "Básico", costo: 0, proveedor: "Red de mentores", icono: "users" },
  { id: "c5", titulo: "Trabajo en equipo y metodologías ágiles", categoria: "Habilidades blandas", carreras: ["Todas"], horas: 10, nivel: "Básico", costo: 0, proveedor: "Academia Puente Joven", icono: "users" },
  { id: "c6", titulo: "Power BI desde cero", categoria: "Herramientas digitales", carreras: ["Administración", "Contabilidad y Auditoría", "Sistemas y TI", "Marketing"], horas: 16, nivel: "Básico", costo: 5, proveedor: "Aliado tecnológico (ejemplo)", icono: "trend" },
  { id: "c7", titulo: "Marketing digital y métricas en redes", categoria: "Marketing", carreras: ["Marketing", "Comunicación y Diseño"], horas: 14, nivel: "Básico", costo: 0, proveedor: "Academia Puente Joven", icono: "target" },
  { id: "c8", titulo: "Git, GitHub y portafolio para devs junior", categoria: "Herramientas digitales", carreras: ["Sistemas y TI", "Comunicación y Diseño"], horas: 10, nivel: "Básico", costo: 0, proveedor: "Comunidad tech (ejemplo)", icono: "laptop" },
  { id: "c9", titulo: "Auditoría con herramientas digitales", categoria: "Contabilidad práctica", carreras: ["Contabilidad y Auditoría"], horas: 18, nivel: "Intermedio", costo: 7, proveedor: "Aliado tributario (ejemplo)", icono: "shield" },
  { id: "c10", titulo: "Atención al cliente y servicio en turismo", categoria: "Habilidades blandas", carreras: ["Turismo y Gastronomía", "Administración"], horas: 8, nivel: "Básico", costo: 0, proveedor: "Red de mentores", icono: "heart" },
  { id: "c11", titulo: "Canva y Figma para presentar proyectos", categoria: "Herramientas digitales", carreras: ["Comunicación y Diseño", "Marketing"], horas: 9, nivel: "Básico", costo: 0, proveedor: "Academia Puente Joven", icono: "sparkle" },
  { id: "c12", titulo: "Cómo armar tu hoja de vida sin experiencia", categoria: "Empleabilidad", carreras: ["Todas"], horas: 4, nivel: "Básico", costo: 0, proveedor: "Academia Puente Joven", icono: "award" },
];

/* ---------- Mentores (ejemplo) ---------- */
const MENTORES = [
  { id: "m1", nombre: "Carolina Andrade", cargo: "Gerente de Talento Humano", empresa: "Grupo comercial (ejemplo)", area: "Administración", ciudad: "Quito", anios: 12, frase: "Mi primer trabajo fue de asistente. Te ayudo a contar tu historia con seguridad.", temas: ["Hoja de vida", "Entrevistas", "Plan de carrera"], color: "#14172B" },
  { id: "m2", nombre: "Diego Paredes", cargo: "Auditor senior", empresa: "Firma de auditoría (ejemplo)", area: "Contabilidad y Auditoría", ciudad: "Guayaquil", anios: 9, frase: "Empecé como pasante. Te enseño lo que de verdad piden en auditoría.", temas: ["NIIF en la práctica", "Excel", "Primer empleo"], color: "#12805C" },
  { id: "m3", nombre: "Valeria Chiriboga", cargo: "Líder de desarrollo web", empresa: "Startup tecnológica (ejemplo)", area: "Sistemas y TI", ciudad: "Remoto", anios: 7, frase: "Tu portafolio vale más que los años. Revisemos tus proyectos juntos.", temas: ["Portafolio", "Git", "Entrevista técnica"], color: "#5A47D6" },
  { id: "m4", nombre: "Santiago Morales", cargo: "Director creativo", empresa: "Agencia de comunicación (ejemplo)", area: "Comunicación y Diseño", ciudad: "Quito", anios: 10, frase: "Aprendí con tutoriales igual que tú. Te ayudo a mostrar lo que sabes.", temas: ["Portafolio", "Marca personal"], color: "#14172B" },
  { id: "m5", nombre: "Gabriela Torres", cargo: "Jefa de marketing", empresa: "Empresa de consumo masivo (ejemplo)", area: "Marketing", ciudad: "Cuenca", anios: 8, frase: "Los datos cuentan historias. Te muestro cómo usarlos en tu primer trabajo.", temas: ["Métricas", "Redes sociales", "Entrevistas"], color: "#12805C" },
  { id: "m6", nombre: "Luis Quishpe", cargo: "Administrador de hotel", empresa: "Hotel boutique (ejemplo)", area: "Turismo y Gastronomía", ciudad: "Ibarra", anios: 11, frase: "En turismo la actitud abre puertas. Prepárate conmigo para destacar.", temas: ["Servicio al cliente", "Inglés", "Liderazgo"], color: "#5A47D6" },
  { id: "m7", nombre: "Fernanda Ruiz", cargo: "Contadora general", empresa: "Pyme exportadora (ejemplo)", area: "Contabilidad y Auditoría", ciudad: "Ambato", anios: 6, frase: "Facturación, impuestos y Excel: lo práctico que no te enseñaron.", temas: ["Facturación electrónica", "Excel"], color: "#14172B" },
  { id: "m8", nombre: "Javier Salazar", cargo: "Coordinador de operaciones", empresa: "Empresa logística (ejemplo)", area: "Administración", ciudad: "Manta", anios: 9, frase: "Te ayudo a convertir tus pasantías en logros concretos.", temas: ["Logros medibles", "Trabajo en equipo"], color: "#12805C" },
];

/* ---------- Ofertas (ejemplo) — todas para perfiles junior ----------
   Campos agregados tras la 2da validación (nov. 2026):
   zona       → barrio o sector dentro de la ciudad (pedido de José Ignacio y Aida)
   horario    → días y horas de trabajo (pedido de Julián)
   industria  → sector de la empresa (pedido de Julián)
   experiencia→ meses de experiencia que pide la oferta; 0 = ninguna (pedido de Aida)
   verificada → Puente Joven revisó RUC, dirección y referencias de la empresa (Julián y Patricia)
*/
const OFERTAS = [
  { id: "o1", titulo: "Asistente administrativo junior", empresa: "Comercial Andina (ejemplo)", carrera: "Administración", ciudad: "Quito", modalidad: "Presencial", salario: 520, tipo: "Empleo", primeraOportunidad: true, dias: 1, descripcion: "Apoyo en procesos administrativos, control de inventario y reportes semanales.", zona: "Iñaquito, norte de Quito", horario: "L–V · 8:00–17:00", industria: "Comercio y distribución", experiencia: 0, verificada: true, requisitos: ["Título en Administración o afines", "Excel intermedio", "Ganas de aprender"] },
  { id: "o2", titulo: "Pasante de auditoría", empresa: "Auditores Asociados (ejemplo)", carrera: "Contabilidad y Auditoría", ciudad: "Guayaquil", modalidad: "Híbrido", salario: 300, tipo: "Pasantía", primeraOportunidad: true, dias: 2, descripcion: "Pasantía de 6 meses con mentor asignado y plan de aprendizaje.", zona: "Kennedy Norte", horario: "L–V · 9:00–14:00 (medio tiempo)", industria: "Servicios profesionales", experiencia: 0, verificada: true, requisitos: ["Últimos semestres o recién graduado", "Excel básico"] },
  { id: "o3", titulo: "Desarrollador/a web junior", empresa: "Kuntur Tech (ejemplo)", carrera: "Sistemas y TI", ciudad: "Quito", modalidad: "Remoto", salario: 750, tipo: "Empleo", primeraOportunidad: true, dias: 0, descripcion: "Desarrollo de interfaces con HTML, CSS y JavaScript en un equipo ágil.", zona: "Trabajo remoto (oficina en La Carolina)", horario: "L–V · 9:00–18:00, horario flexible", industria: "Tecnología", experiencia: 0, verificada: true, requisitos: ["Portafolio con proyectos", "Git básico"] },
  { id: "o4", titulo: "Analista de marketing digital junior", empresa: "Sabores del Valle (ejemplo)", carrera: "Marketing", ciudad: "Cuenca", modalidad: "Híbrido", salario: 600, tipo: "Empleo", primeraOportunidad: false, dias: 4, descripcion: "Gestión de redes sociales, reportes de métricas y campañas pequeñas.", zona: "El Vergel", horario: "L–V · 8:30–17:30", industria: "Alimentos y bebidas", experiencia: 6, verificada: false, requisitos: ["Conocimientos de Meta Ads", "Redacción clara"] },
  { id: "o5", titulo: "Asistente contable", empresa: "Exporta Ecuador (ejemplo)", carrera: "Contabilidad y Auditoría", ciudad: "Ambato", modalidad: "Presencial", salario: 540, tipo: "Empleo", primeraOportunidad: true, dias: 3, descripcion: "Registro contable, facturación electrónica y conciliaciones bancarias.", zona: "Ficoa", horario: "L–V · 8:00–16:30", industria: "Exportación", experiencia: 0, verificada: true, requisitos: ["Título en Contabilidad", "Facturación electrónica (certificado válido)"] },
  { id: "o6", titulo: "Pasante de diseño gráfico", empresa: "Estudio Wayra (ejemplo)", carrera: "Comunicación y Diseño", ciudad: "Quito", modalidad: "Híbrido", salario: 280, tipo: "Pasantía", primeraOportunidad: true, dias: 1, descripcion: "Piezas para redes, presentaciones y apoyo en sesiones de fotos.", zona: "La Floresta", horario: "L–V · 9:00–15:00 (medio tiempo)", industria: "Diseño y publicidad", experiencia: 0, verificada: true, requisitos: ["Portafolio", "Canva o Figma"] },
  { id: "o7", titulo: "Recepcionista bilingüe junior", empresa: "Hotel Imbabura (ejemplo)", carrera: "Turismo y Gastronomía", ciudad: "Ibarra", modalidad: "Presencial", salario: 500, tipo: "Empleo", primeraOportunidad: true, dias: 5, descripcion: "Atención a huéspedes, reservas y coordinación con el equipo.", zona: "Centro histórico de Ibarra", horario: "Turnos rotativos · 40 h semanales", industria: "Turismo y hotelería", experiencia: 0, verificada: true, requisitos: ["Inglés A2 o superior", "Actitud de servicio"] },
  { id: "o8", titulo: "Soporte técnico nivel 1", empresa: "Conecta Redes (ejemplo)", carrera: "Sistemas y TI", ciudad: "Guayaquil", modalidad: "Presencial", salario: 560, tipo: "Empleo", primeraOportunidad: false, dias: 6, descripcion: "Atención de tickets, configuración de equipos y documentación.", zona: "Urdesa", horario: "L–S · turnos de 8 h", industria: "Telecomunicaciones", experiencia: 6, verificada: false, requisitos: ["Conocimientos de redes", "Comunicación clara"] },
  { id: "o9", titulo: "Pasante de talento humano", empresa: "Grupo Pacífico (ejemplo)", carrera: "Administración", ciudad: "Manta", modalidad: "Presencial", salario: 320, tipo: "Pasantía", primeraOportunidad: true, dias: 2, descripcion: "Apoyo en reclutamiento, inducción y clima laboral con un tutor dedicado.", zona: "Barrio Umiña", horario: "L–V · 8:00–13:00 (medio tiempo)", industria: "Pesca y alimentos", experiencia: 0, verificada: true, requisitos: ["Estudiante o recién graduado", "Excel básico"] },
  { id: "o10", titulo: "Community manager junior", empresa: "Café Cotacachi (ejemplo)", carrera: "Marketing", ciudad: "Ibarra", modalidad: "Remoto", salario: 480, tipo: "Empleo", primeraOportunidad: true, dias: 0, descripcion: "Planificación de contenido, respuesta a clientes y reportes mensuales.", zona: "Trabajo remoto", horario: "L–V · 4 h diarias, horario flexible", industria: "Alimentos y bebidas", experiencia: 0, verificada: true, requisitos: ["Portafolio o cuentas gestionadas", "Creatividad"] },
  { id: "o11", titulo: "Analista de datos trainee", empresa: "Finanzas Claras (ejemplo)", carrera: "Sistemas y TI", ciudad: "Quito", modalidad: "Híbrido", salario: 700, tipo: "Empleo", primeraOportunidad: true, dias: 3, descripcion: "Programa trainee de 12 meses: SQL, Power BI y rotación por áreas.", zona: "González Suárez", horario: "L–V · 8:30–17:30", industria: "Finanzas", experiencia: 0, verificada: true, requisitos: ["Lógica y curiosidad", "Excel"] },
  { id: "o12", titulo: "Asistente de comunicación", empresa: "Fundación Raíces (ejemplo)", carrera: "Comunicación y Diseño", ciudad: "Cuenca", modalidad: "Presencial", salario: 490, tipo: "Empleo", primeraOportunidad: false, dias: 7, descripcion: "Redacción de notas, apoyo en eventos y manejo de redes.", zona: "Centro de Cuenca", horario: "L–V · 9:00–17:00 + eventos fines de semana", industria: "ONG y cooperación", experiencia: 6, verificada: false, requisitos: ["Buena redacción", "Fotografía básica"] },
  { id: "o13", titulo: "Pasante de cocina y operaciones", empresa: "Restaurante Allpa (ejemplo)", carrera: "Turismo y Gastronomía", ciudad: "Quito", modalidad: "Presencial", salario: 300, tipo: "Pasantía", primeraOportunidad: true, dias: 4, descripcion: "Rotación por cocina, compras y costos con jefe de cocina como tutor.", zona: "La Mariscal", horario: "Ma–Do · turnos de 6 h", industria: "Restaurantes", experiencia: 0, verificada: true, requisitos: ["Estudiante o egresado de Gastronomía"] },
  { id: "o14", titulo: "Asistente financiero junior", empresa: "Cooperativa del Sur (ejemplo)", carrera: "Contabilidad y Auditoría", ciudad: "Loja", modalidad: "Presencial", salario: 530, tipo: "Empleo", primeraOportunidad: true, dias: 2, descripcion: "Análisis de cartera, reportes y atención a socios.", zona: "Centro de Loja", horario: "L–V · 8:00–16:30", industria: "Finanzas y cooperativas", experiencia: 0, verificada: true, requisitos: ["Título en Contabilidad o Finanzas", "Excel intermedio"] },
  { id: "o15", titulo: "Pasante de compras y logística", empresa: "Comercial Andina (ejemplo)", carrera: "Administración", ciudad: "Quito", modalidad: "Híbrido", salario: 350, tipo: "Pasantía", primeraOportunidad: true, dias: 3, descripcion: "Pasantía de 6 meses: cotizaciones a proveedores, control de pedidos y reportes, con tutor asignado.", zona: "Carcelén Industrial", horario: "L–V · 8:00–14:00 (medio tiempo)", industria: "Comercio y distribución", experiencia: 0, verificada: true, requisitos: ["Estudiante o recién graduado", "Excel básico", "Organización"] },
];

/* ---------- Perfil de empresa de ejemplo (rol "empresa") ---------- */
const EMPRESA_INICIAL = {
  nombre: "Comercial Andina (ejemplo)",
  sector: "Comercio y distribución",
  ciudad: "Quito",
  tamano: "50 a 200 empleados",
  verificada: true, // Puente Joven ya revisó RUC, dirección y referencias
  descripcion: "Distribuidora de productos de consumo masivo. Creemos en formar talento joven desde su primer empleo.",
  contacto: "talento@comercialandina.ec",
  ofertasBase: ["o1", "o15"], // ofertas de OFERTAS que pertenecen a esta empresa
};

/* ---------- Otros postulantes de ejemplo (los ve la empresa) ----------
   "dias" = hace cuántos días ocurrió cada estado alcanzado. */
const CANDIDATOS = [
  { id: "k1", ofertaId: "o1", nombre: "Bryan Tituaña", carrera: "Administración", ciudad: "Quito", graduacion: "Graduado hace 3 meses", bio: "Administrador con interés en procesos y atención al cliente.", habilidades: ["Excel básico", "Atención al cliente", "Puntualidad"], cursos: ["Excel avanzado: tablas dinámicas y BUSCARX"], experiencias: [{ tipo: "Negocio familiar", titulo: "Ayudante en ferretería familiar", logro: "Llevé el registro de ventas diarias durante 2 años." }], recos: 0, estado: 2, dias: [6, 5, 2] },
  { id: "k2", ofertaId: "o1", nombre: "Daniela Chicaiza", carrera: "Administración", ciudad: "Quito", graduacion: "Graduada hace 8 meses", bio: "Me apasiona organizar y mejorar procesos. Busco mi primer empleo formal.", habilidades: ["Excel intermedio", "Power BI básico", "Trabajo en equipo", "Inglés B1"], cursos: ["Excel avanzado: tablas dinámicas y BUSCARX", "Power BI desde cero"], experiencias: [{ tipo: "Pasantía", titulo: "Pasante administrativa", logro: "Digitalicé 300 facturas y armé un tablero de gastos mensual." }], recos: 1, estado: 1, dias: [4, 3] },
  { id: "k3", ofertaId: "o1", nombre: "Kevin Morales", carrera: "Marketing", ciudad: "Latacunga", graduacion: "Graduado hace 1 año", bio: "Busco cambiar de área y aprender sobre administración.", habilidades: ["Redes sociales", "Canva"], cursos: [], experiencias: [], recos: 0, estado: 0, dias: [1] },
  { id: "k4", ofertaId: "o15", nombre: "Mishell Andrango", carrera: "Administración", ciudad: "Quito", graduacion: "Último semestre", bio: "Estudiante de último semestre, organizada y con muchas ganas de aprender logística.", habilidades: ["Excel intermedio", "Organización", "Comunicación"], cursos: ["Excel avanzado: tablas dinámicas y BUSCARX"], experiencias: [{ tipo: "Proyecto", titulo: "Proyecto de cadena de suministro", logro: "Propuse una ruta de reparto que reducía 15% el tiempo de entrega." }], recos: 1, estado: 0, dias: [0.5] },
  { id: "k5", ofertaId: "o15", nombre: "Jonathan Pilco", carrera: "Contabilidad y Auditoría", ciudad: "Sangolquí", graduacion: "Graduado hace 2 meses", bio: "Contador recién graduado, interesado en compras y control de inventarios.", habilidades: ["Excel intermedio", "Facturación electrónica"], cursos: ["Facturación electrónica paso a paso"], experiencias: [{ tipo: "Pasantía", titulo: "Pasante contable", logro: "Concilié 4 cuentas bancarias mensuales sin errores." }], recos: 0, estado: 1, dias: [2, 1] },
];

/* ---------- Simulador de entrevistas ---------- */
const PREGUNTAS = {
  "General": [
    { q: "Háblame de ti.", tip: "Usa 3 partes: quién eres (carrera), qué has hecho (pasantías, proyectos, cursos) y qué buscas en este puesto.", claves: ["carrera", "proyecto", "pasantía", "curso", "aprend", "busco", "equipo"] },
    { q: "No tienes experiencia laboral. ¿Por qué deberíamos contratarte?", tip: "Convierte pasantías, proyectos y cursos en evidencia. Habla de tu capacidad de aprender rápido con un ejemplo.", claves: ["pasantía", "proyecto", "aprend", "curso", "logr", "resultado", "rápido"] },
    { q: "Cuéntame de un problema que resolviste.", tip: "Método STAR: Situación, Tarea, Acción y Resultado. Termina con un dato o resultado concreto.", claves: ["situación", "problema", "hice", "acción", "resultado", "logr", "%"] },
    { q: "¿Dónde te ves en tres años?", tip: "Muestra que tienes un plan de carrera conectado con la empresa: crecer, aprender y aportar.", claves: ["aprend", "crecer", "empresa", "plan", "aport", "especializ"] },
  ],
  "Administración": [
    { q: "¿Cómo organizarías tus tareas si tienes varias urgencias al mismo tiempo?", tip: "Menciona cómo priorizas (urgente/importante), herramientas que usas y cómo comunicas avances.", claves: ["prioriz", "urgente", "importante", "excel", "calendario", "comunic", "lista"] },
    { q: "¿Qué herramientas manejas para reportes?", tip: "Nombra herramientas concretas (Excel, tablas dinámicas, Power BI) y un ejemplo de reporte que hiciste.", claves: ["excel", "tablas", "power bi", "reporte", "gráfico", "dato"] },
  ],
  "Contabilidad y Auditoría": [
    { q: "¿Cómo detectarías un error en una conciliación bancaria?", tip: "Explica el paso a paso: comparar registros, revisar fechas y montos, documentar diferencias.", claves: ["comparar", "registro", "banco", "diferencia", "documento", "revis", "fecha"] },
    { q: "¿Qué sabes de facturación electrónica?", tip: "Explica el proceso básico y cuenta dónde lo aprendiste (curso, pasantía o negocio familiar).", claves: ["factura", "sri", "comprobante", "electrónic", "curso", "pasantía"] },
  ],
  "Sistemas y TI": [
    { q: "Muéstrame un proyecto del que estés orgulloso/a.", tip: "Describe el problema, la tecnología que usaste, tu rol y qué aprendiste. Ten el enlace listo.", claves: ["proyecto", "github", "javascript", "api", "equipo", "aprend", "problema"] },
    { q: "¿Qué haces cuando no sabes resolver algo?", tip: "Muestra método: investigar documentación, probar, pedir ayuda a tiempo y documentar la solución.", claves: ["document", "investig", "prob", "pregunt", "ayuda", "busc"] },
  ],
  "Marketing": [
    { q: "¿Cómo medirías el éxito de una campaña en redes?", tip: "Habla de objetivos y métricas: alcance, interacción, clics, conversiones. Da un ejemplo con números.", claves: ["métrica", "alcance", "interacción", "conversi", "objetivo", "clic", "%"] },
  ],
  "Comunicación y Diseño": [
    { q: "¿Cómo recibes una crítica sobre tu trabajo?", tip: "Muestra apertura: escuchas, preguntas para entender y ajustas. Da un ejemplo real.", claves: ["escuch", "pregunt", "mejor", "ajust", "aprend", "cliente"] },
  ],
  "Turismo y Gastronomía": [
    { q: "Un cliente está molesto. ¿Qué haces?", tip: "Escucha activa, empatía, solución concreta y seguimiento. Mantén la calma.", claves: ["escuch", "calma", "solución", "disculp", "empat", "seguimiento"] },
  ],
};

/* ---------- Recomendaciones y perfil de ejemplo ---------- */
const PERFIL_INICIAL = {
  nombre: "Camila Yépez",
  carrera: "Administración",
  ciudad: "Ibarra",
  graduacion: "Graduada hace 5 meses",
  bio: "Recién graduada en Administración. Me gusta organizar procesos y aprender herramientas digitales.",
  habilidades: ["Excel intermedio", "Atención al cliente", "Trabajo en equipo", "Inglés A2", "Canva"],
  experiencias: [
    { tipo: "Pasantía", titulo: "Pasante de talento humano", lugar: "Cooperativa local (ejemplo)", logro: "Organicé 120 expedientes de personal y reduje el tiempo de búsqueda de documentos.",
      // Certificado emitido por la empresa al terminar la pasantía (pedido de Salomé)
      certificado: { empresa: "Cooperativa local (ejemplo)", horas: 480, codigo: "PJ-PAS-COOP-24A7" } },
    { tipo: "Proyecto", titulo: "Plan de negocio para tienda familiar", lugar: "Proyecto de titulación", logro: "Diseñé un control de inventario en Excel que hoy usa el negocio." },
    { tipo: "Voluntariado", titulo: "Logística de feria universitaria", lugar: "Universidad", logro: "Coordiné a 8 voluntarios para un evento de 300 asistentes." },
  ],
};

const RECOMENDACIONES = [
  { mentor: "Carolina Andrade", cargo: "Gerente de Talento Humano", texto: "Camila es organizada y aprende rápido. En nuestra mentoría preparó su hoja de vida y mejoró notablemente su forma de presentar logros.", habilidad: "Organización" },
  { mentor: "Javier Salazar", cargo: "Coordinador de operaciones", texto: "Revisé su proyecto de inventario: es claro, útil y está bien documentado. Lo recomiendo para cargos administrativos junior.", habilidad: "Excel" },
];

const ESTADOS = ["Enviada", "Vista", "En revisión", "Entrevista", "Resultado"];
