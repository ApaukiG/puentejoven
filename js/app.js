/* =========================================================
   PUENTE JOVEN — Lógica de la aplicación (JavaScript puro)
   ========================================================= */
(() => {
  "use strict";

  /* ---------------- Utilidades ---------------- */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
  const esc = (s) =>
    String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const ic = (name, cls = "") => `<svg class="i ${cls}" aria-hidden="true"><use href="#i-${name}"/></svg>`;
  const initials = (n) => n.split(" ").filter(Boolean).slice(0, 2).map((p) => p[0]).join("").toUpperCase();
  const money = (n) => `$${Number(n).toLocaleString("es-EC")}`;
  const fecha = (iso) => new Date(iso).toLocaleDateString("es-EC", { day: "numeric", month: "short" });
  const hace = (d) => (d === 0 ? "Hoy" : d === 1 ? "Hace 1 día" : `Hace ${d} días`);
  const DAY = 86400000;

  const fillSelect = (el, values, keepFirst = true) => {
    if (!el) return;
    const first = keepFirst ? el.querySelector("option") : null;
    el.innerHTML = "";
    if (first) el.appendChild(first);
    values.forEach((v) => el.insertAdjacentHTML("beforeend", `<option value="${esc(v)}">${esc(v)}</option>`));
  };

  /* ---------------- Estado (localStorage) ---------------- */
  const KEY = "puentejoven_v1";
  const defaultState = () => {
    const now = Date.now();
    return {
      perfil: JSON.parse(JSON.stringify(PERFIL_INICIAL)),
      cursos: { inscritos: ["c3"], completados: ["c1", "c4", "c12"] },
      postulaciones: [
        { ofertaId: "o1", estado: 3, fechas: [now - 9 * DAY, now - 7 * DAY, now - 5 * DAY, now - 1 * DAY], resultado: null },
        { ofertaId: "o9", estado: 1, fechas: [now - 3 * DAY, now - 2 * DAY], resultado: null },
        { ofertaId: "o11", estado: 0, fechas: [now - 0.5 * DAY], resultado: null },
      ],
      mentorias: [],
      recos: JSON.parse(JSON.stringify(RECOMENDACIONES)),
      alertas: [],
      ofertasEmpresa: [],
      simPracticas: 0,
      // Rol activo: "joven" (busca empleo) o "empresa" (publica ofertas)
      rol: "joven",
      empresa: JSON.parse(JSON.stringify(EMPRESA_INICIAL)),
      candidatos: CANDIDATOS.map((c) => {
        const { dias, ...rest } = c;
        return { ...rest, fechas: dias.map((d) => now - d * DAY), resultado: null, feedback: "" };
      }),
    };
  };
  let state;
  try {
    // Se combina con el estado por defecto para que datos guardados antes
    // de existir los dos perfiles sigan funcionando.
    const saved = JSON.parse(localStorage.getItem(KEY));
    state = saved ? { ...defaultState(), ...saved } : defaultState();
  } catch (e) {
    state = defaultState();
  }
  const save = () => {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* modo privado: sigue en memoria */ }
  };

  // Una oferta es "propia" si la publicó la empresa del panel (desde este navegador)
  // o si es una de las ofertas de ejemplo que le pertenecen.
  const esPropia = (id) =>
    state.empresa.ofertasBase.includes(id) || state.ofertasEmpresa.some((o) => o.id === id);
  const allOfertas = () =>
    [...state.ofertasEmpresa, ...OFERTAS].map((o) => (esPropia(o.id) ? { ...o, empresa: state.empresa.nombre } : o));
  const getOferta = (id) => allOfertas().find((o) => o.id === id);
  const misOfertas = () => allOfertas().filter((o) => esPropia(o.id));

  /* ---------------- Toasts y modal ---------------- */
  function toast(msg, type = "ok") {
    const t = document.createElement("div");
    t.className = `toast toast--${type}`;
    t.innerHTML = `${ic(type === "ok" ? "check" : "bell")}<span>${msg}</span>`;
    $("#toasts").appendChild(t);
    setTimeout(() => t.classList.add("is-out"), 3400);
    setTimeout(() => t.remove(), 3800);
  }

  const modal = $("#modal");
  function openModal(html) {
    $("#modalBody").innerHTML = html;
    if (typeof modal.showModal === "function") modal.showModal();
    else modal.setAttribute("open", "");
    const f = modal.querySelector("input, select, textarea, button:not([data-close])");
    if (f) f.focus();
  }
  function closeModal() {
    if (typeof modal.close === "function") modal.close();
    else modal.removeAttribute("open");
  }
  modal.addEventListener("click", (e) => {
    if (e.target === modal || e.target.closest("[data-close]")) closeModal();
  });

  /* ---------------- Rol: joven o empresa ---------------- */
  const currentPage = () => {
    const h = location.hash.replace("#", "") || "inicio";
    return PAGES.includes(h) ? h : "inicio";
  };

  // Ajusta el menú y los selectores según el rol activo
  function updateRoleUI() {
    const emp = state.rol === "empresa";
    const cta = $("#navPanel");
    cta.innerHTML = `${ic(emp ? "building" : "user")} ${emp ? "Mi empresa" : "Mi panel"}`;
    document.body.dataset.rol = state.rol;
    $$("[data-role-set]").forEach((b) => {
      if (!b.classList.contains("seg__btn")) return;
      const on = b.dataset.roleSet === state.rol;
      b.classList.toggle("is-active", on);
      b.setAttribute("aria-pressed", String(on));
    });
  }

  function setRol(rol, silent = false) {
    if (rol !== "joven" && rol !== "empresa") return;
    const changed = state.rol !== rol;
    state.rol = rol;
    save();
    updateRoleUI();
    if (changed && !silent) toast(rol === "empresa" ? `Ahora usas el perfil de empresa: ${state.empresa.nombre}` : `Ahora usas el perfil de joven: ${state.perfil.nombre}`, "info");
    const page = currentPage();
    if (changed && renderers[page]) renderers[page]();
  }

  // Cualquier botón o enlace con data-role-set cambia el rol
  // (Soy joven / Soy empresa, el selector del panel, etc.)
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-role-set]");
    if (b) setRol(b.dataset.roleSet, b.hasAttribute("data-role-silent"));
  });

  /* ---------------- Navegación (router por hash) ---------------- */
  const PAGES = $$(".page").map((p) => p.dataset.page);
  const renderers = {};

  function route() {
    const page = currentPage();
    updateRoleUI();
    $$(".page").forEach((p) => (p.hidden = p.dataset.page !== page));
    $$(".nav a").forEach((a) => a.classList.toggle("is-active", a.dataset.link === page));
    closeMenu();
    window.scrollTo({ top: 0, behavior: "instant" });
    // transición suave entre páginas
    const cur = $(`.page[data-page="${page}"]`);
    cur.classList.remove("page-enter");
    void cur.offsetWidth;
    cur.classList.add("page-enter");
    moveIndicator();
    if (renderers[page]) renderers[page]();
    observeReveals();
    document.title = `${page === "inicio" ? "Inicio" : $(`.nav a[data-link="${page}"]`)?.textContent.trim() || "Puente Joven"} · Puente Joven`;
  }
  window.addEventListener("hashchange", route);

  // Menú móvil
  const burger = $("#burger");
  const nav = $("#nav");
  function closeMenu() {
    nav.classList.remove("is-open");
    burger.setAttribute("aria-expanded", "false");
  }
  burger.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    burger.setAttribute("aria-expanded", String(open));
  });

  // Sombra del header al hacer scroll
  // + barra de progreso de lectura
  const progress = $("#progress");
  const onScroll = () => {
    $("#header").classList.toggle("is-scrolled", scrollY > 10);
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
  };
  window.addEventListener("scroll", onScroll, { passive: true });

  // Píldora que se desliza bajo el enlace activo del menú (solo escritorio)
  const indicator = $(".nav__indicator");
  function moveIndicator() {
    const a = $(".nav a.is-active:not(.btn)");
    if (!a || innerWidth <= 960) { indicator.style.opacity = 0; return; }
    indicator.style.left = a.offsetLeft + "px";
    indicator.style.width = a.offsetWidth + "px";
    indicator.style.opacity = 1;
  }
  window.addEventListener("resize", moveIndicator);
  document.fonts?.ready.then(moveIndicator);

  /* ---------------- Animaciones al hacer scroll ---------------- */
  const revealObs = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("is-visible"); revealObs.unobserve(e.target); }
    }),
    { threshold: 0.12 }
  );
  function observeReveals() {
    $$(".page:not([hidden]) .reveal:not(.is-visible)").forEach((el) => {
      // escalonado: cada hermano aparece un poco después del anterior
      const sibs = [...el.parentElement.children].filter((c) => c.classList.contains("reveal"));
      el.style.setProperty("--i", Math.min(sibs.indexOf(el), 5));
      revealObs.observe(el);
    });
  }

  // Contadores animados (cifras INEC)
  const counterObs = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (!e.isIntersecting) return;
      animateCounter(e.target);
      counterObs.unobserve(e.target);
    }),
    { threshold: 0.2 }
  );
  function animateCounter(el) {
    const target = parseFloat(el.dataset.count);
    const dec = parseInt(el.dataset.decimals || "0", 10);
    const suffix = el.dataset.suffix || "";
    const fmt = (v) => v.toLocaleString("es-EC", { minimumFractionDigits: dec, maximumFractionDigits: dec }) + suffix;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { el.textContent = fmt(target); return; }
    const dur = 1600;
    const start = performance.now();
    const step = (t) => {
      const p = Math.min((t - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(target * eased);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
  $$("[data-count]").forEach((el) => counterObs.observe(el));

  /* =========================================================
     TESTIMONIOS
     ========================================================= */
  function testiCard(t, extra = false) {
    const label = t.tipo === "joven"
      ? `<span class="label label--young">Joven</span>`
      : `<span class="label label--expert">Experto/a</span>`;
    return `
      <article class="testi testi--${t.tipo}">
        <div class="testi__top">
          <div class="testi__photo">
            <span>${initials(t.nombre)}</span>
            <img src="${t.foto}" alt="Foto de ${esc(t.nombre)}" loading="lazy" onerror="this.remove()" />
          </div>
          ${label}
        </div>
        <p class="testi__quote">“${esc(t.frase)}”</p>
        ${extra && t.fraseExtra ? `<p class="testi__quote testi__quote--sm">“${esc(t.fraseExtra)}”</p>` : ""}
        <div class="testi__who"><b>${esc(t.nombre)}</b><span>${esc(t.rol)}</span></div>
      </article>`;
  }

  function renderCarousel() {
    const c = $("#carousel");
    if (c.dataset.ready) return;
    c.innerHTML = TESTIMONIOS.map((t) => testiCard(t)).join("");
    c.dataset.ready = "1";
    $$("[data-carousel]").forEach((b) =>
      b.addEventListener("click", () => {
        const card = c.querySelector(".testi");
        const w = card ? card.offsetWidth + 20 : 300;
        c.scrollBy({ left: b.dataset.carousel === "next" ? w : -w, behavior: "smooth" });
      })
    );
    c.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") c.scrollBy({ left: 300, behavior: "smooth" });
      if (e.key === "ArrowLeft") c.scrollBy({ left: -300, behavior: "smooth" });
    });
  }

  let tFilter = "todos";
  function renderTestiGrid() {
    $("#testiGrid").innerHTML = TESTIMONIOS
      .filter((t) => tFilter === "todos" || t.tipo === tFilter)
      .map((t) => testiCard(t, true)).join("");
  }
  $$("[data-tfilter]").forEach((b) =>
    b.addEventListener("click", () => {
      tFilter = b.dataset.tfilter;
      $$("[data-tfilter]").forEach((x) => {
        x.classList.toggle("is-active", x === b);
        x.setAttribute("aria-selected", String(x === b));
      });
      renderTestiGrid();
    })
  );

  renderers.inicio = renderCarousel;
  renderers.problema = renderTestiGrid;

  /* =========================================================
     PILAR 1 — CURSOS
     ========================================================= */
  fillSelect($("#cCarrera"), CARRERAS);
  fillSelect($("#cCategoria"), [...new Set(CURSOS.map((c) => c.categoria))]);

  function cursoEstado(id) {
    if (state.cursos.completados.includes(id)) return "completado";
    if (state.cursos.inscritos.includes(id)) return "inscrito";
    return "nuevo";
  }

  function renderCursos() {
    const q = $("#cSearch").value.trim().toLowerCase();
    const car = $("#cCarrera").value;
    const cat = $("#cCategoria").value;
    const gratis = $("#cGratis").checked;
    const list = CURSOS.filter((c) =>
      (!q || c.titulo.toLowerCase().includes(q) || c.categoria.toLowerCase().includes(q)) &&
      (!car || c.carreras.includes(car) || c.carreras.includes("Todas")) &&
      (!cat || c.categoria === cat) &&
      (!gratis || c.costo === 0)
    );
    $("#cCount").textContent = `${list.length} curso${list.length === 1 ? "" : "s"} encontrado${list.length === 1 ? "" : "s"}`;
    $("#courseGrid").innerHTML = list.length ? list.map((c) => {
      const st = cursoEstado(c.id);
      const btn = st === "completado"
        ? `<button class="btn btn--green btn--sm" data-cert="${c.id}">${ic("award")} Ver certificado</button>`
        : st === "inscrito"
          ? `<button class="btn btn--primary btn--sm" data-complete="${c.id}">${ic("check")} Marcar como completado</button>`
          : `<button class="btn btn--outline btn--sm" data-enroll="${c.id}">${ic("plus")} Inscribirme</button>`;
      return `
        <article class="course">
          <div class="course__icon">${ic(c.icono)}</div>
          <span class="course__cat">${esc(c.categoria)}</span>
          <h3>${esc(c.titulo)}</h3>
          <ul class="course__meta">
            <li>${ic("clock")} ${c.horas} h</li>
            <li>${ic("trend")} ${esc(c.nivel)}</li>
            <li>${ic("award")} Certificado</li>
          </ul>
          <p class="course__prov">${esc(c.proveedor)}</p>
          <div class="course__foot">
            <span class="price ${c.costo === 0 ? "price--free" : ""}">${c.costo === 0 ? "Gratis" : money(c.costo)}</span>
            ${btn}
          </div>
          ${st === "inscrito" ? `<span class="ribbon">Inscrito</span>` : ""}
          ${st === "completado" ? `<span class="ribbon ribbon--green">Completado</span>` : ""}
        </article>`;
    }).join("") : `<div class="empty">${ic("search")}<p>No hay cursos con esos filtros. Prueba con otra carrera o tema.</p></div>`;
  }
  ["#cSearch", "#cCarrera", "#cCategoria", "#cGratis"].forEach((s) => $(s).addEventListener("input", renderCursos));

  $("#courseGrid").addEventListener("click", (e) => {
    const en = e.target.closest("[data-enroll]");
    const co = e.target.closest("[data-complete]");
    const ce = e.target.closest("[data-cert]");
    if (en) {
      state.cursos.inscritos.push(en.dataset.enroll);
      save(); renderCursos();
      toast("¡Inscripción lista! El curso aparece en tu panel.");
    }
    if (co) {
      const id = co.dataset.complete;
      state.cursos.inscritos = state.cursos.inscritos.filter((x) => x !== id);
      state.cursos.completados.push(id);
      save(); renderCursos();
      toast("¡Felicitaciones! Tu certificado ya está en tu perfil.");
      showCert(id);
    }
    if (ce) showCert(ce.dataset.cert);
  });

  function showCert(id) {
    const c = CURSOS.find((x) => x.id === id);
    const code = `PJ-${id.toUpperCase()}-${(state.perfil.nombre.length * 731).toString(36).toUpperCase()}`;
    openModal(`
      <div class="cert">
        <div class="cert__seal">${ic("award")}</div>
        <small>Certificado de aprobación</small>
        <h2>${esc(state.perfil.nombre)}</h2>
        <p>completó satisfactoriamente el curso</p>
        <h3>${esc(c.titulo)}</h3>
        <p class="muted">${c.horas} horas · ${esc(c.proveedor)}</p>
        <p class="cert__code">Código de verificación: <b>${code}</b></p>
      </div>`);
  }

  // Pestañas internas de Capacitaciones (saltos)
  $$("[data-jump]").forEach((a) =>
    a.addEventListener("click", (e) => {
      e.preventDefault();
      const target = document.getElementById(a.dataset.jump);
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    })
  );

  /* ---------------- Simulador de entrevistas ---------------- */
  const sim = { area: "General", idx: 0 };
  fillSelect($("#simArea"), Object.keys(PREGUNTAS), false);

  function renderSim() {
    const qs = PREGUNTAS[sim.area];
    const item = qs[sim.idx % qs.length];
    $("#simQuestion").textContent = item.q;
    $("#simTip").textContent = item.tip;
    $("#simProgress").textContent = `Pregunta ${(sim.idx % qs.length) + 1} de ${qs.length}`;
    $("#simAnswer").value = "";
    $("#simWords").textContent = "0 palabras";
    $("#simFeedback").hidden = true;
    $(".sim__tip").open = false;
  }
  $("#simArea").addEventListener("change", (e) => { sim.area = e.target.value; sim.idx = 0; renderSim(); });
  $("#simNext").addEventListener("click", () => { sim.idx++; renderSim(); });
  $("#simAnswer").addEventListener("input", (e) => {
    const n = e.target.value.trim().split(/\s+/).filter(Boolean).length;
    $("#simWords").textContent = `${n} palabra${n === 1 ? "" : "s"}`;
  });

  function evaluar(texto, item) {
    const t = texto.toLowerCase();
    const words = texto.trim().split(/\s+/).filter(Boolean).length;
    const bien = [], mejorar = [];
    let score = 0;

    if (words >= 60 && words <= 150) { score += 35; bien.push("Buena extensión: ni muy corta ni muy larga."); }
    else if (words > 150) { score += 22; mejorar.push("Tu respuesta es larga. Resume en 1–2 minutos (máx. 150 palabras)."); }
    else if (words >= 30) { score += 20; mejorar.push("Desarrolla un poco más: apunta a 60–150 palabras."); }
    else { score += 5; mejorar.push("Respuesta muy corta. El reclutador necesita conocerte mejor."); }

    const hits = item.claves.filter((k) => t.includes(k));
    score += Math.min(hits.length * 10, 30);
    if (hits.length >= 2) bien.push("Tocaste ideas clave que el reclutador espera escuchar.");
    else mejorar.push(`Conecta con lo que se pregunta. ${item.tip}`);

    if (/\d/.test(t)) { score += 15; bien.push("Usaste datos concretos: eso da credibilidad."); }
    else mejorar.push("Agrega un número o resultado medible (ej.: “reduje a la mitad el tiempo…”).");

    if (/(por ejemplo|cuando|en mi pasant|en un proyecto|en la universidad|una vez)/.test(t)) { score += 20; bien.push("Incluiste un ejemplo real: así demuestras, no solo dices."); }
    else mejorar.push("Cuenta un ejemplo real (pasantía, proyecto, negocio familiar o voluntariado).");

    if (/(no tengo experiencia|no sé|nunca he|no se nada)/.test(t)) {
      score -= 10;
      mejorar.push("Evita frases como “no tengo experiencia”. Di lo que SÍ has hecho: pasantías, proyectos y cursos cuentan.");
    }
    return { score: Math.max(0, Math.min(100, score)), bien, mejorar };
  }

  $("#simEval").addEventListener("click", () => {
    const texto = $("#simAnswer").value;
    const fb = $("#simFeedback");
    if (texto.trim().length < 3) {
      fb.hidden = false;
      fb.innerHTML = `<p class="muted">Escribe tu respuesta primero 🙂</p>`;
      return;
    }
    const qs = PREGUNTAS[sim.area];
    const r = evaluar(texto, qs[sim.idx % qs.length]);
    state.simPracticas++;
    save();
    const nivel = r.score >= 75 ? ["¡Muy buena respuesta!", "good"] : r.score >= 50 ? ["Vas bien, pule algunos detalles", "mid"] : ["Sigue practicando, tú puedes", "low"];
    fb.hidden = false;
    fb.innerHTML = `
      <div class="score score--${nivel[1]}" style="--p:${r.score}">
        <span>${r.score}</span><small>/100</small>
      </div>
      <div>
        <h4>${nivel[0]}</h4>
        ${r.bien.length ? `<p class="fb-title fb-title--good">${ic("check")} Lo que hiciste bien</p><ul>${r.bien.map((b) => `<li>${b}</li>`).join("")}</ul>` : ""}
        ${r.mejorar.length ? `<p class="fb-title fb-title--mid">${ic("sparkle")} Para mejorar</p><ul>${r.mejorar.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>` : ""}
      </div>`;
  });

  /* ---------------- Traductor de experiencia ---------------- */
  let ultimaTraduccion = null;
  $("#translator").addEventListener("submit", (e) => {
    e.preventDefault();
    const acc = $("#tAccion").value.trim();
    const her = $("#tHerramienta").value.trim();
    const res = $("#tResultado").value.trim();
    if (!acc) return;
    const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
    const linea = `${cap(acc)}${her ? ` usando ${her}` : ""}${res ? `. Resultado: ${res}` : ""}.`;
    const tips = [];
    if (/^\w+(ar|er|ir)\b/i.test(acc)) tips.push("Empieza con un verbo en pasado y en primera persona: organicé, diseñé, coordiné, analicé.");
    if (!/\d/.test(res)) tips.push("Agrega un número al resultado: cantidades, porcentajes o tiempo ahorrado.");
    if (!her) tips.push("Nombra la herramienta: los reclutadores buscan palabras como Excel, Canva o Power BI.");
    ultimaTraduccion = { titulo: cap(acc), logro: linea };
    const out = $("#tOut");
    out.hidden = false;
    out.innerHTML = `
      <p class="fb-title fb-title--good">${ic("check")} Así se ve en tu hoja de vida</p>
      <p class="translator__line">• ${esc(linea)}</p>
      ${tips.length ? `<ul class="small">${tips.map((t) => `<li>${t}</li>`).join("")}</ul>` : `<p class="small">¡Excelente! Tiene acción, herramienta y resultado.</p>`}
      <div class="row-gap">
        <button class="btn btn--outline btn--sm" id="tCopy">Copiar</button>
        <button class="btn btn--primary btn--sm" id="tAdd">${ic("plus")} Agregar a mi perfil</button>
      </div>`;
    $("#tCopy").addEventListener("click", () => {
      navigator.clipboard?.writeText(linea).then(() => toast("Copiado al portapapeles"), () => toast("No se pudo copiar", "info"));
    });
    $("#tAdd").addEventListener("click", () => {
      state.perfil.experiencias.unshift({ tipo: "Pasantía", titulo: ultimaTraduccion.titulo, lugar: "Agregado desde el traductor", logro: ultimaTraduccion.logro });
      save();
      toast("Agregado a “Pasantías y proyectos” en tu panel");
    });
  });

  renderers.capacitaciones = () => { renderCursos(); renderSim(); };

  /* =========================================================
     PILAR 2 — MENTORES
     ========================================================= */
  fillSelect($("#mArea"), CARRERAS);
  fillSelect($("#mCiudad"), [...new Set(MENTORES.map((m) => m.ciudad))]);

  function renderMentores() {
    const area = $("#mArea").value;
    const ciudad = $("#mCiudad").value;
    const list = MENTORES.filter((m) => (!area || m.area === area) && (!ciudad || m.ciudad === ciudad));
    $("#mentorGrid").innerHTML = list.length ? list.map((m) => {
      const pedida = state.mentorias.some((x) => x.mentorId === m.id);
      return `
        <article class="mentor">
          <div class="mentor__top">
            <div class="avatar" style="--bg:${m.color}">${initials(m.nombre)}</div>
            <div>
              <h3>${esc(m.nombre)}</h3>
              <p>${esc(m.cargo)}</p>
              <small>${esc(m.empresa)}</small>
            </div>
          </div>
          <p class="mentor__quote">“${esc(m.frase)}”</p>
          <div class="tags">${m.temas.map((t) => `<span class="tag">${esc(t)}</span>`).join("")}</div>
          <ul class="mentor__meta">
            <li>${ic("pin")} ${esc(m.ciudad)}</li>
            <li>${ic("briefcase")} ${m.anios} años</li>
            <li>${ic("grad")} ${esc(m.area)}</li>
          </ul>
          ${pedida
            ? `<button class="btn btn--green btn--block" disabled>${ic("check")} Mentoría solicitada</button>`
            : `<button class="btn btn--primary btn--block" data-mentor="${m.id}">${ic("chat")} Pedir mentoría</button>`}
        </article>`;
    }).join("") : `<div class="empty">${ic("users")}<p>No hay mentores con esos filtros todavía.</p></div>`;
  }
  ["#mArea", "#mCiudad"].forEach((s) => $(s).addEventListener("input", renderMentores));

  $("#mentorGrid").addEventListener("click", (e) => {
    const b = e.target.closest("[data-mentor]");
    if (!b) return;
    const m = MENTORES.find((x) => x.id === b.dataset.mentor);
    openModal(`
      <h2>Pedir mentoría a ${esc(m.nombre)}</h2>
      <p class="muted">Sesión gratuita de 30 minutos por videollamada.</p>
      <form class="form" id="mentorForm">
        <label class="field field--block"><span>¿Sobre qué quieres hablar?</span>
          <select name="tema">${m.temas.map((t) => `<option>${esc(t)}</option>`).join("")}<option>Otro</option></select></label>
        <label class="field field--block"><span>Cuéntale tu situación (opcional)</span>
          <textarea name="msg" rows="3" placeholder="Ej.: Me gradué hace 5 meses y quiero mejorar mi hoja de vida."></textarea></label>
        <label class="field field--block"><span>Horario preferido</span>
          <select name="horario"><option>Mañana</option><option>Tarde</option><option>Noche</option></select></label>
        <button class="btn btn--primary btn--block" type="submit">${ic("send")} Enviar solicitud</button>
      </form>`);
    $("#mentorForm").addEventListener("submit", (ev) => {
      ev.preventDefault();
      const fd = new FormData(ev.target);
      state.mentorias.push({ mentorId: m.id, tema: fd.get("tema"), horario: fd.get("horario"), fecha: Date.now(), realizada: false });
      save();
      closeModal();
      renderMentores();
      toast(`Solicitud enviada a ${m.nombre}. Te responderá en tu panel.`);
    });
  });

  renderers.mentores = renderMentores;

  /* =========================================================
     PILAR 3 — EMPLEOS
     ========================================================= */
  fillSelect($("#jCarrera"), CARRERAS);
  fillSelect($("#jCiudad"), CIUDADES);

  function getFilters() {
    return {
      q: $("#jSearch").value.trim(),
      carrera: $("#jCarrera").value,
      ciudad: $("#jCiudad").value,
      modalidad: $$("#jModalidad input:checked").map((i) => i.value),
      tipo: $$("#jTipo input:checked").map((i) => i.value),
      salario: Number($("#jSalario").value),
      sello: $("#jSello").checked,
    };
  }
  function setFilters(f) {
    $("#jSearch").value = f.q || "";
    $("#jCarrera").value = f.carrera || "";
    $("#jCiudad").value = f.ciudad || "";
    $$("#jModalidad input").forEach((i) => (i.checked = (f.modalidad || []).includes(i.value)));
    $$("#jTipo input").forEach((i) => (i.checked = (f.tipo || []).includes(i.value)));
    $("#jSalario").value = f.salario || 0;
    $("#jSello").checked = !!f.sello;
  }
  function matches(o, f) {
    const q = (f.q || "").toLowerCase();
    return (!q || o.titulo.toLowerCase().includes(q) || o.empresa.toLowerCase().includes(q)) &&
      (!f.carrera || o.carrera === f.carrera) &&
      (!f.ciudad || o.ciudad === f.ciudad) &&
      (!f.modalidad?.length || f.modalidad.includes(o.modalidad)) &&
      (!f.tipo?.length || f.tipo.includes(o.tipo)) &&
      (o.salario >= (f.salario || 0)) &&
      (!f.sello || o.primeraOportunidad);
  }
  const describeFilters = (f) => {
    const p = [];
    if (f.q) p.push(`“${f.q}”`);
    if (f.carrera) p.push(f.carrera);
    if (f.ciudad) p.push(f.ciudad);
    if (f.modalidad?.length) p.push(f.modalidad.join("/"));
    if (f.tipo?.length) p.push(f.tipo.join("/"));
    if (f.salario) p.push(`desde ${money(f.salario)}`);
    if (f.sello) p.push("Primera Oportunidad");
    return p.length ? p.join(" · ") : "Todas las ofertas";
  };

  // Botón principal de una oferta según el rol activo
  function jobAction(o, post, block = false) {
    const w = block ? "btn--block" : "btn--sm";
    if (state.rol === "empresa") {
      return esPropia(o.id)
        ? `<a class="btn btn--accent ${w}" href="#panel" data-ver-oferta="${o.id}" data-close>${ic("users")} Ver postulantes (${postulantesDe(o.id).length})</a>`
        : `<span class="badge badge--line">Solo los jóvenes pueden postular</span>`;
    }
    return post
      ? `<a class="btn btn--green ${w}" href="#panel" data-close>${ic("check")} ${block ? "Ya postulaste · " : ""}${post.resultado ? (post.resultado === "si" ? "Seleccionada" : "Finalizada") : ESTADOS[post.estado]}</a>`
      : `<button class="btn btn--primary ${w}" ${block ? `id="modalApply"` : `data-apply="${o.id}"`}>Postularme ${ic("arrow")}</button>`;
  }

  function jobCard(o) {
    const post = state.postulaciones.find((p) => p.ofertaId === o.id);
    return `
      <article class="job ${o.nueva ? "job--new" : ""} ${state.rol === "empresa" && esPropia(o.id) ? "job--mine" : ""}">
        <div class="job__logo" aria-hidden="true">${initials(o.empresa.replace(/\(.*\)/, ""))}</div>
        <div class="job__body">
          <div class="job__badges">
            <span class="badge ${o.tipo === "Pasantía" ? "badge--sand" : "badge--navy"}">${o.tipo}</span>
            <span class="badge badge--line">${o.modalidad}</span>
            ${o.primeraOportunidad ? `<span class="badge badge--seal">${ic("shield")} Primera Oportunidad</span>` : ""}
            ${o.nueva ? `<span class="badge badge--green">Nueva</span>` : ""}
            ${state.rol === "empresa" && esPropia(o.id) ? `<span class="badge badge--sand">${ic("building")} Tu oferta</span>` : ""}
          </div>
          <h3>${esc(o.titulo)}</h3>
          <p class="job__company">${esc(o.empresa)}</p>
          <ul class="job__meta">
            <li>${ic("pin")} ${esc(o.ciudad)}</li>
            <li>${ic("dollar")} ${money(o.salario)}/mes</li>
            <li>${ic("clock")} ${hace(o.dias)}</li>
          </ul>
          <p class="job__desc">${esc(o.descripcion)}</p>
        </div>
        <div class="job__actions">
          <button class="btn btn--ghost btn--sm" data-detail="${o.id}">Ver detalle</button>
          ${jobAction(o, post)}
        </div>
      </article>`;
  }

  function renderJobs() {
    const f = getFilters();
    $("#jSalarioVal").textContent = money(f.salario);
    const list = allOfertas().filter((o) => matches(o, f)).sort((a, b) => a.dias - b.dias);
    $("#jCount").textContent = `${list.length} oferta${list.length === 1 ? "" : "s"} para perfiles junior`;
    $("#jobList").innerHTML = list.length
      ? list.map(jobCard).join("")
      : `<div class="empty">${ic("search")}<p>No encontramos ofertas con estos filtros. Crea una alerta y te avisaremos cuando aparezca una.</p></div>`;
  }
  ["#jSearch", "#jCarrera", "#jCiudad", "#jSalario", "#jSello"].forEach((s) => $(s).addEventListener("input", renderJobs));
  $$("#jModalidad input, #jTipo input").forEach((i) => i.addEventListener("change", renderJobs));
  $("#jClear").addEventListener("click", () => { setFilters({}); renderJobs(); });
  $("#jToggle").addEventListener("click", () => $(".jobs__filters").classList.toggle("is-open"));

  $("#jAlert").addEventListener("click", () => {
    const f = getFilters();
    state.alertas.push({ id: "a" + Date.now(), filtros: f, creada: Date.now() });
    save();
    toast(`Alerta creada: ${describeFilters(f)}`);
  });

  function apply(id) {
    if (state.postulaciones.some((p) => p.ofertaId === id)) return;
    state.postulaciones.unshift({ ofertaId: id, estado: 0, fechas: [Date.now()], resultado: null });
    save();
    toast("Postulación enviada. Verás cada cambio de estado en tu panel.");
  }

  $("#jobList").addEventListener("click", (e) => {
    const a = e.target.closest("[data-apply]");
    const d = e.target.closest("[data-detail]");
    if (a) { apply(a.dataset.apply); renderJobs(); }
    if (d) {
      const o = getOferta(d.dataset.detail);
      const post = state.postulaciones.find((p) => p.ofertaId === o.id);
      openModal(`
        <div class="job__badges">
          <span class="badge ${o.tipo === "Pasantía" ? "badge--sand" : "badge--navy"}">${o.tipo}</span>
          <span class="badge badge--line">${o.modalidad}</span>
          ${o.primeraOportunidad ? `<span class="badge badge--seal">${ic("shield")} Primera Oportunidad</span>` : ""}
        </div>
        <h2>${esc(o.titulo)}</h2>
        <p class="muted">${esc(o.empresa)} · ${esc(o.ciudad)} · ${money(o.salario)}/mes</p>
        <p>${esc(o.descripcion)}</p>
        <h4>Lo que buscamos</h4>
        <ul class="ticks">${o.requisitos.map((r) => `<li>${ic("check")} ${esc(r)}</li>`).join("")}</ul>
        ${o.primeraOportunidad ? `<p class="note">${ic("shield")} Esta empresa no exige experiencia previa y se compromete a responder a todas las postulaciones.</p>` : ""}
        ${jobAction(o, post, true)}
      `);
      $("#modalApply")?.addEventListener("click", () => { apply(o.id); closeModal(); renderJobs(); });
    }
  });

  renderers.empleos = renderJobs;

  /* =========================================================
     MI PANEL (joven)
     ========================================================= */
  const FEEDBACK_DEFECTO = "Tu perfil es prometedor. Te sugerimos reforzar inglés y practicar ejemplos concretos en la entrevista.";
  function profileStrength() {
    const p = state.perfil;
    let s = 0;
    const faltan = [];
    if (p.bio) s += 10; else faltan.push("escribe tu bio");
    if (p.habilidades.length >= 3) s += 15; else faltan.push("agrega 3 habilidades");
    if (p.experiencias.length) s += 20; else faltan.push("agrega una pasantía o proyecto");
    const nc = state.cursos.completados.length;
    if (nc) s += Math.min(20 + (nc - 1) * 5, 30); else faltan.push("completa un curso");
    if (state.recos.length) s += 15; else faltan.push("consigue una recomendación");
    if (state.simPracticas) s += 10; else faltan.push("practica en el simulador");
    return { s: Math.min(s, 100), faltan };
  }

  function stepper(post) {
    return `<ol class="stepper" aria-label="Estado de la postulación">
      ${ESTADOS.map((e, i) => {
        const cls = i < post.estado ? "is-done" : i === post.estado ? "is-current" : "";
        const label = i === 4 && post.resultado ? (post.resultado === "si" ? "¡Seleccionada!" : "Finalizada") : e;
        return `<li class="${cls}"><span class="stepper__dot">${i < post.estado || (i === 4 && post.resultado) ? ic("check") : i + 1}</span><span class="stepper__label">${label}</span>${post.fechas[i] ? `<small>${fecha(post.fechas[i])}</small>` : ""}</li>`;
      }).join("")}
    </ol>`;
  }

  function renderPanel() {
    const emp = state.rol === "empresa";
    $("#panelJoven").hidden = emp;
    $("#panelEmpresa").hidden = !emp;
    $("#pKicker").textContent = emp ? "Panel de empresa" : "Mi panel";
    $("#pEdit").innerHTML = `${ic(emp ? "building" : "user")} ${emp ? "Editar empresa" : "Editar perfil"}`;
    $("#pAvatar").classList.toggle("avatar--company", emp);
    if (emp) renderPanelEmpresa(); else renderPanelJoven();
  }

  function renderPanelJoven() {
    const p = state.perfil;
    $("#pAvatar").textContent = initials(p.nombre);
    $("#pName").textContent = p.nombre;
    $("#pMeta").textContent = `${p.carrera} · ${p.ciudad} · ${p.graduacion}`;
    $("#pBio").textContent = p.bio;
    $("#pSkills").innerHTML = p.habilidades.map((h) => `<span class="tag">${esc(h)}</span>`).join("");

    const st = profileStrength();
    $("#pMeter").style.width = st.s + "%";
    $("#pMeterText").innerHTML = st.faltan.length
      ? `<b>${st.s}%</b> · Para fortalecerlo: ${st.faltan.join(", ")}.`
      : `<b>${st.s}%</b> · ¡Perfil completo! Las empresas ven tu potencial.`;

    $("#pExp").innerHTML = p.experiencias.map((x) => `
      <li><span class="badge badge--sand">${esc(x.tipo)}</span><b>${esc(x.titulo)}</b><small>${esc(x.lugar)}</small><p>${esc(x.logro)}</p></li>`).join("")
      + `<li class="timeline__add"><button class="btn btn--ghost btn--sm" id="pAddExp">${ic("plus")} Agregar pasantía o proyecto</button></li>`;

    const comp = state.cursos.completados.map((id) => CURSOS.find((c) => c.id === id)).filter(Boolean);
    const insc = state.cursos.inscritos.map((id) => CURSOS.find((c) => c.id === id)).filter(Boolean);
    $("#pCursos").innerHTML =
      comp.map((c) => `<li><span class="cert-ic cert-ic--ok">${ic("award")}</span><div><b>${esc(c.titulo)}</b><small>Certificado · ${c.horas} h</small></div><button class="link-btn" data-cert="${c.id}">Ver</button></li>`).join("") +
      insc.map((c) => `<li><span class="cert-ic">${ic("book")}</span><div><b>${esc(c.titulo)}</b><small>En curso</small></div></li>`).join("") +
      `<li class="cert-list__more"><a href="#capacitaciones" class="link">Ver catálogo ${ic("arrow")}</a></li>`;

    // Postulaciones
    $("#pApps").innerHTML = state.postulaciones.length ? state.postulaciones.map((post, i) => {
      const o = getOferta(post.ofertaId);
      if (!o) return "";
      let result = "";
      if (post.resultado === "si") result = `<div class="result result--ok">${ic("check")} <div><b>¡Felicitaciones! Fuiste seleccionado/a.</b><p>La empresa te contactará para coordinar tu ingreso.</p></div></div>`;
      if (post.resultado === "no") result = `<div class="result result--mid">${ic("chat")} <div><b>Esta vez no fuiste seleccionado/a, pero recibiste retroalimentación:</b><p>“${esc(post.feedback || FEEDBACK_DEFECTO)}”</p><a href="#capacitaciones" class="link">Ir a capacitaciones ${ic("arrow")}</a></div></div>`;
      // Las ofertas de la empresa del panel se responden desde "Mi empresa";
      // las demás (empresas de ejemplo) se pueden simular.
      const propia = esPropia(o.id);
      return `
        <div class="app">
          <div class="app__head">
            <div><b>${esc(o.titulo)}</b><small>${esc(o.empresa)} · ${esc(o.ciudad)}</small></div>
            <span class="badge ${post.resultado === "si" ? "badge--green" : "badge--navy"}">${post.resultado ? (post.resultado === "si" ? "Seleccionada" : "Finalizada") : ESTADOS[post.estado]}</span>
          </div>
          ${stepper(post)}
          ${result}
          <div class="app__actions">
            ${post.estado < 4 && !propia ? `<button class="btn btn--outline btn--sm" data-advance="${i}">${ic("loop")} Simular respuesta de la empresa</button>` : ""}
            ${post.estado < 4 && propia ? `<span class="muted small">${ic("building")} ${esc(o.empresa)} responde desde su panel.</span> <a href="#panel" class="link-btn" data-role-set="empresa">Ver como empresa</a>` : ""}
            <button class="link-btn" data-withdraw="${i}">Retirar</button>
          </div>
        </div>`;
    }).join("") : `<div class="empty">${ic("briefcase")}<p>Aún no tienes postulaciones. <a href="#empleos">Busca ofertas junior</a>.</p></div>`;

    // Recomendaciones
    $("#pRecos").innerHTML = state.recos.length ? state.recos.map((r) => `
      <blockquote class="reco">
        <div class="reco__head"><div class="avatar avatar--sm">${initials(r.mentor)}</div><div><b>${esc(r.mentor)}</b><small>${esc(r.cargo)}</small></div><span class="badge badge--green">${ic("star")} ${esc(r.habilidad)}</span></div>
        <p>“${esc(r.texto)}”</p>
      </blockquote>`).join("") : `<p class="muted">Aún no tienes recomendaciones. <a href="#mentores">Pide una mentoría</a>.</p>`;

    // Alertas: una automática según perfil + las creadas
    const auto = { filtros: { carrera: p.carrera }, auto: true };
    $("#pAlerts").innerHTML = [auto, ...state.alertas].map((a, i) => {
      const n = allOfertas().filter((o) => matches(o, a.filtros)).length;
      return `<li>
        <div><b>${a.auto ? "Según tu perfil: " : ""}${esc(describeFilters(a.filtros))}</b><small>${n} oferta${n === 1 ? "" : "s"} disponibles</small></div>
        <div class="mini-list__actions">
          <button class="link-btn" data-see-alert="${i}">Ver</button>
          ${a.auto ? "" : `<button class="link-btn link-btn--muted" data-del-alert="${i - 1}" aria-label="Eliminar alerta">${ic("x")}</button>`}
        </div></li>`;
    }).join("");

    // Mentorías
    $("#pMentorias").innerHTML = state.mentorias.length ? state.mentorias.map((m, i) => {
      const mt = MENTORES.find((x) => x.id === m.mentorId);
      return `<li>
        <div><b>${esc(mt.nombre)}</b><small>${esc(m.tema)} · ${m.realizada ? "Realizada" : "Pendiente de confirmar"}</small></div>
        ${m.realizada ? `<span class="badge badge--green">${ic("check")}</span>` : `<button class="link-btn" data-done-mentoria="${i}">Marcar realizada</button>`}
      </li>`;
    }).join("") : `<li class="muted">Aún no pides mentorías. <a href="#mentores">Ver mentores</a></li>`;
  }

  // Eventos del panel (delegación)
  $('[data-page="panel"]').addEventListener("click", (e) => {
    const t = e.target.closest("button, a");
    if (!t) return;

    if (t.dataset.advance !== undefined) {
      const post = state.postulaciones[+t.dataset.advance];
      post.estado = Math.min(post.estado + 1, 4);
      post.fechas[post.estado] = Date.now();
      if (post.estado === 4) {
        const o = getOferta(post.ofertaId);
        post.resultado = o.primeraOportunidad ? "si" : "no";
      }
      save(); renderPanel();
      toast(`Tu postulación pasó a: ${ESTADOS[post.estado]}`, "info");
    }
    if (t.dataset.withdraw !== undefined) {
      state.postulaciones.splice(+t.dataset.withdraw, 1);
      save(); renderPanel();
      toast("Postulación retirada", "info");
    }
    if (t.dataset.cert) showCert(t.dataset.cert);
    if (t.dataset.delAlert !== undefined) {
      state.alertas.splice(+t.dataset.delAlert, 1);
      save(); renderPanel();
    }
    if (t.dataset.seeAlert !== undefined) {
      const i = +t.dataset.seeAlert;
      const f = i === 0 ? { carrera: state.perfil.carrera } : state.alertas[i - 1].filtros;
      setFilters(f);
      location.hash = "empleos";
    }
    if (t.dataset.doneMentoria !== undefined) {
      const m = state.mentorias[+t.dataset.doneMentoria];
      const mt = MENTORES.find((x) => x.id === m.mentorId);
      m.realizada = true;
      state.recos.unshift({
        mentor: mt.nombre, cargo: mt.cargo, habilidad: "Ganas de aprender",
        texto: `Tuvimos una mentoría sobre ${m.tema.toLowerCase()}. Muestra compromiso, escucha la retroalimentación y la aplica. La recomiendo para un primer empleo.`,
      });
      save(); renderPanel();
      toast(`${mt.nombre} dejó una recomendación en tu perfil`);
    }
    if (t.id === "pAddExp") openExpForm();
    if (t.id === "pEdit") (state.rol === "empresa" ? openCompanyForm : openProfileForm)();
    if (t.id === "pReset" || t.id === "pResetE") {
      const rol = state.rol;
      state = defaultState(); state.rol = rol; save(); renderPanel();
      toast("Datos de ejemplo restablecidos", "info");
    }
    // Panel de empresa
    if (t.dataset.selOferta) { empSel = t.dataset.selOferta; renderPanelEmpresa(); $("#eCands").scrollIntoView({ behavior: "smooth", block: "start" }); }
    if (t.dataset.verCand) openCandidato(t.dataset.verCand);
    if (t.dataset.avanzar) avanzarCand(t.dataset.avanzar);
    if (t.dataset.seleccionar) decidirCand(t.dataset.seleccionar, "si");
    if (t.dataset.descartar) openDescartar(t.dataset.descartar);
  });

  function openProfileForm() {
    const p = state.perfil;
    openModal(`
      <h2>Editar perfil</h2>
      <form class="form" id="profileForm">
        <label class="field field--block"><span>Nombre</span><input name="nombre" required value="${esc(p.nombre)}" /></label>
        <div class="form__row">
          <label class="field field--block"><span>Carrera</span><select name="carrera">${CARRERAS.map((c) => `<option ${c === p.carrera ? "selected" : ""}>${c}</option>`).join("")}</select></label>
          <label class="field field--block"><span>Ciudad</span><select name="ciudad">${CIUDADES.map((c) => `<option ${c === p.ciudad ? "selected" : ""}>${c}</option>`).join("")}</select></label>
        </div>
        <label class="field field--block"><span>¿Cuándo te graduaste?</span><input name="graduacion" value="${esc(p.graduacion)}" /></label>
        <label class="field field--block"><span>Sobre mí</span><textarea name="bio" rows="3">${esc(p.bio)}</textarea></label>
        <label class="field field--block"><span>Habilidades (separadas por coma)</span><input name="habilidades" value="${esc(p.habilidades.join(", "))}" /></label>
        <button class="btn btn--primary btn--block" type="submit">Guardar cambios</button>
      </form>`);
    $("#profileForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      Object.assign(state.perfil, {
        nombre: fd.get("nombre").trim() || p.nombre,
        carrera: fd.get("carrera"),
        ciudad: fd.get("ciudad"),
        graduacion: fd.get("graduacion").trim(),
        bio: fd.get("bio").trim(),
        habilidades: fd.get("habilidades").split(",").map((s) => s.trim()).filter(Boolean),
      });
      save(); closeModal(); renderPanel();
      toast("Perfil actualizado");
    });
  }

  function openExpForm() {
    openModal(`
      <h2>Agregar experiencia</h2>
      <p class="muted">Pasantías, proyectos, voluntariados o el negocio familiar también cuentan.</p>
      <form class="form" id="expForm">
        <label class="field field--block"><span>Tipo</span><select name="tipo"><option>Pasantía</option><option>Proyecto</option><option>Voluntariado</option><option>Negocio familiar</option></select></label>
        <label class="field field--block"><span>Título</span><input name="titulo" required placeholder="Ej.: Pasante de contabilidad" /></label>
        <label class="field field--block"><span>Lugar</span><input name="lugar" placeholder="Ej.: Empresa o universidad" /></label>
        <label class="field field--block"><span>Logro principal (con números si puedes)</span><textarea name="logro" rows="2" required></textarea></label>
        <button class="btn btn--primary btn--block" type="submit">Agregar</button>
      </form>`);
    $("#expForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      state.perfil.experiencias.unshift({ tipo: fd.get("tipo"), titulo: fd.get("titulo").trim(), lugar: fd.get("lugar").trim(), logro: fd.get("logro").trim() });
      save(); closeModal(); renderPanel();
      toast("Experiencia agregada a tu perfil");
    });
  }

  /* =========================================================
     MI EMPRESA (panel del rol "empresa")
     ========================================================= */
  let empSel = null; // oferta seleccionada para ver sus postulantes

  // Un postulante puede ser el joven del panel (sus postulaciones reales)
  // o uno de los candidatos de ejemplo. Ambos se muestran con la misma forma.
  const candJoven = (post) => {
    const p = state.perfil;
    return {
      key: "yo:" + post.ofertaId, nombre: p.nombre, carrera: p.carrera, ciudad: p.ciudad,
      graduacion: p.graduacion, bio: p.bio, habilidades: p.habilidades, experiencias: p.experiencias,
      cursos: state.cursos.completados.map((id) => CURSOS.find((c) => c.id === id)).filter(Boolean).map((c) => c.titulo),
      nRecos: state.recos.length, recosList: state.recos, post, esJoven: true,
    };
  };
  const candEjemplo = (c) => ({ ...c, key: c.id, nRecos: c.recos, recosList: [], post: c, esJoven: false });

  function postulantesDe(ofertaId) {
    const list = [];
    const mine = state.postulaciones.find((p) => p.ofertaId === ofertaId);
    if (mine) list.push(candJoven(mine));
    state.candidatos.filter((c) => c.ofertaId === ofertaId).forEach((c) => list.push(candEjemplo(c)));
    return list;
  }
  function findCand(key) {
    if (key.startsWith("yo:")) {
      const post = state.postulaciones.find((p) => p.ofertaId === key.slice(3));
      return post ? candJoven(post) : null;
    }
    const c = state.candidatos.find((x) => x.id === key);
    return c ? candEjemplo(c) : null;
  }

  const estadoLabel = (post) =>
    post.resultado ? (post.resultado === "si" ? "Seleccionado/a" : "No seleccionado/a") : ESTADOS[post.estado];
  const SIGUIENTE = { 0: "Marcar como vista", 1: "Pasar a revisión", 2: "Invitar a entrevista" };

  function candActions(c) {
    const post = c.post;
    if (post.resultado) {
      return `<span class="badge ${post.resultado === "si" ? "badge--green" : "badge--sand"}">${ic(post.resultado === "si" ? "check" : "chat")} ${estadoLabel(post)}</span>`;
    }
    return `
      ${post.estado < 3 ? `<button class="btn btn--outline btn--sm" data-avanzar="${c.key}">${ic("arrow")} ${SIGUIENTE[post.estado]}</button>` : ""}
      <button class="btn btn--green btn--sm" data-seleccionar="${c.key}">${ic("check")} Seleccionar</button>
      <button class="btn btn--ghost btn--sm" data-descartar="${c.key}">No seleccionar</button>`;
  }

  function cambiarEstado(c, estado) {
    c.post.estado = estado;
    c.post.fechas[estado] = Date.now();
  }
  function avisoJoven(c) {
    if (c.esJoven) setTimeout(() => toast(`${c.nombre} verá este cambio en su panel de joven`, "info"), 500);
  }
  function refrescarEmpresa() {
    save();
    if (currentPage() === "panel") renderPanel();
  }

  function avanzarCand(key) {
    const c = findCand(key);
    if (!c || c.post.resultado || c.post.estado >= 3) return;
    cambiarEstado(c, c.post.estado + 1);
    refrescarEmpresa();
    toast(`${c.nombre}: ${ESTADOS[c.post.estado]}`);
    avisoJoven(c);
  }

  function decidirCand(key, resultado, feedback = "") {
    const c = findCand(key);
    if (!c || c.post.resultado) return;
    cambiarEstado(c, 4);
    c.post.resultado = resultado;
    c.post.feedback = feedback;
    refrescarEmpresa();
    closeModal();
    toast(resultado === "si" ? `¡${c.nombre} fue seleccionado/a!` : `Se envió tu retroalimentación a ${c.nombre}`);
    avisoJoven(c);
  }

  function openDescartar(key) {
    const c = findCand(key);
    if (!c) return;
    openModal(`
      <h2>No seleccionar a ${esc(c.nombre)}</h2>
      <p class="muted">El compromiso Primera Oportunidad es responder a todas las postulaciones. Deja una retroalimentación breve y útil: le ayuda a mejorar para la próxima.</p>
      <form class="form" id="descForm">
        <label class="field field--block"><span>Retroalimentación para ${esc(c.nombre.split(" ")[0])}</span>
          <textarea name="fb" rows="4" required>${esc(FEEDBACK_DEFECTO)}</textarea></label>
        <button class="btn btn--primary btn--block" type="submit">${ic("send")} Enviar respuesta</button>
      </form>`);
    $("#descForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const fb = new FormData(e.target).get("fb").trim();
      decidirCand(key, "no", fb || FEEDBACK_DEFECTO);
    });
  }

  function openCandidato(key) {
    let c = findCand(key);
    if (!c) return;
    // Al abrir el perfil, la postulación pasa de "Enviada" a "Vista"
    if (c.post.estado === 0 && !c.post.resultado) {
      cambiarEstado(c, 1);
      refrescarEmpresa();
      avisoJoven(c);
      c = findCand(key);
    }
    const o = getOferta(c.post.ofertaId);
    openModal(`
      <div class="cand">
        <div class="cand__head">
          <div class="avatar">${initials(c.nombre)}</div>
          <div>
            <h2>${esc(c.nombre)}</h2>
            <p class="muted">${esc(c.carrera)} · ${esc(c.ciudad)} · ${esc(c.graduacion)}</p>
          </div>
        </div>
        <p class="small muted">Postuló a <b>${esc(o?.titulo || "")}</b></p>
        ${c.bio ? `<p>${esc(c.bio)}</p>` : ""}
        ${c.habilidades.length ? `<h4>Habilidades</h4><div class="tags">${c.habilidades.map((h) => `<span class="tag">${esc(h)}</span>`).join("")}</div>` : ""}
        <h4>${ic("award")} Cursos certificados (${c.cursos.length})</h4>
        ${c.cursos.length ? `<ul class="ticks">${c.cursos.map((t) => `<li>${ic("check")} ${esc(t)}</li>`).join("")}</ul>` : `<p class="muted small">Aún no completa cursos en Puente Joven.</p>`}
        <h4>Pasantías y proyectos</h4>
        ${c.experiencias.length ? `<ul class="timeline">${c.experiencias.map((x) => `<li><span class="badge badge--sand">${esc(x.tipo)}</span><b>${esc(x.titulo)}</b><p>${esc(x.logro)}</p></li>`).join("")}</ul>` : `<p class="muted small">Sin experiencias registradas todavía.</p>`}
        <h4>${ic("star")} Recomendaciones de mentores (${c.nRecos})</h4>
        ${c.recosList.length ? c.recosList.map((r) => `<p class="small">“${esc(r.texto)}” <b>— ${esc(r.mentor)}</b></p>`).join("") : c.nRecos ? `<p class="muted small">Tiene ${c.nRecos} recomendación verificada.</p>` : `<p class="muted small">Sin recomendaciones todavía.</p>`}
        ${stepper(c.post)}
        <div class="app__actions" id="candActions">${candActions(c)}</div>
      </div>`);
    // Los botones del modal están fuera del panel: se escuchan aquí
    $("#candActions").addEventListener("click", (e) => {
      const b = e.target.closest("button");
      if (!b) return;
      if (b.dataset.avanzar) { avanzarCand(key); openCandidato(key); }
      if (b.dataset.seleccionar) decidirCand(key, "si");
      if (b.dataset.descartar) openDescartar(key);
    });
  }

  function renderPanelEmpresa() {
    const e = state.empresa;
    $("#pAvatar").textContent = initials(e.nombre.replace(/\(.*\)/, ""));
    $("#pName").textContent = e.nombre;
    $("#pMeta").textContent = [e.sector, e.ciudad, e.tamano].filter(Boolean).join(" · ");
    $("#eBio").textContent = e.descripcion || "Agrega una descripción de tu empresa.";
    $("#eContacto").innerHTML = e.contacto ? `${ic("send")} ${esc(e.contacto)}` : "";

    const ofertas = misOfertas();
    const todos = ofertas.flatMap((o) => postulantesDe(o.id));
    const nuevas = todos.filter((c) => c.post.estado === 0 && !c.post.resultado).length;
    const respondidas = todos.filter((c) => c.post.resultado).length;
    const conSello = ofertas.some((o) => o.primeraOportunidad);

    $("#eSello").innerHTML = conSello
      ? `<p class="note note--green">${ic("shield")} <span><b>Sello Primera Oportunidad activo.</b> Tus ofertas lo muestran en la bolsa de empleos.</span></p>`
      : `<p class="note">${ic("shield")} <span>Publica una oferta que cumpla los 3 compromisos para obtener el sello.</span></p>`;

    $("#eKpis").innerHTML = [
      [ofertas.length, "Ofertas publicadas"],
      [todos.length, "Postulantes"],
      [nuevas, "Sin revisar"],
      [respondidas, "Con respuesta final"],
    ].map(([n, l], i) => `<div class="kpi ${i === 2 && n ? "kpi--alert" : ""}"><b>${n}</b><span>${l}</span></div>`).join("");

    $("#eCompromiso").innerHTML = nuevas
      ? `<p class="note">${ic("bell")} <span>Tienes <b>${nuevas} ${nuevas === 1 ? "postulación" : "postulaciones"} sin revisar</b>. Responder a todos es parte del compromiso Primera Oportunidad.</span></p>`
      : `<p class="note note--green">${ic("check")} <span>Estás al día: revisaste todas las postulaciones.</span></p>`;

    // Mis ofertas
    if (!ofertas.some((o) => o.id === empSel)) {
      empSel = (ofertas.find((o) => postulantesDe(o.id).length) || ofertas[0])?.id || null;
    }
    $("#eOfertas").innerHTML = ofertas.length ? ofertas.map((o) => {
      const ps = postulantesDe(o.id);
      const nv = ps.filter((c) => c.post.estado === 0 && !c.post.resultado).length;
      return `
        <button class="eoffer ${o.id === empSel ? "is-selected" : ""}" data-sel-oferta="${o.id}" aria-pressed="${o.id === empSel}">
          <div class="eoffer__main">
            <div class="job__badges">
              <span class="badge ${o.tipo === "Pasantía" ? "badge--sand" : "badge--navy"}">${o.tipo}</span>
              <span class="badge badge--line">${o.modalidad}</span>
              ${o.primeraOportunidad ? `<span class="badge badge--seal">${ic("shield")} Primera Oportunidad</span>` : ""}
            </div>
            <b>${esc(o.titulo)}</b>
            <small>${esc(o.ciudad)} · ${money(o.salario)}/mes · ${hace(o.dias)}</small>
          </div>
          <div class="eoffer__count">
            <b>${ps.length}</b><span>postulante${ps.length === 1 ? "" : "s"}</span>
            ${nv ? `<span class="badge badge--sand">${nv} nueva${nv === 1 ? "" : "s"}</span>` : ""}
          </div>
        </button>`;
    }).join("") : `<div class="empty">${ic("briefcase")}<p>Aún no publicas ofertas. <a href="#empresas">Publica la primera</a>.</p></div>`;

    // Postulantes de la oferta seleccionada
    const sel = empSel && getOferta(empSel);
    $("#eCandsTitle").textContent = sel ? `Postulantes · ${sel.titulo}` : "Postulantes";
    const cands = sel ? postulantesDe(sel.id) : [];
    $("#eCandList").innerHTML = !sel
      ? `<p class="muted">Selecciona una oferta para ver a sus postulantes.</p>`
      : cands.length ? cands.map((c) => `
        <div class="app cand-row">
          <div class="app__head">
            <div class="cand-row__who">
              <div class="avatar avatar--sm">${initials(c.nombre)}</div>
              <div>
                <b>${esc(c.nombre)} ${c.esJoven ? `<span class="badge badge--seal">Perfil del modo joven</span>` : ""}</b>
                <small>${esc(c.carrera)} · ${esc(c.ciudad)} · ${esc(c.graduacion)}</small>
              </div>
            </div>
            <span class="badge ${c.post.resultado === "si" ? "badge--green" : c.post.estado === 0 ? "badge--sand" : "badge--navy"}">${c.post.estado === 0 && !c.post.resultado ? "Nueva" : estadoLabel(c.post)}</span>
          </div>
          <ul class="job__meta cand-row__meta">
            <li>${ic("award")} ${c.cursos.length} curso${c.cursos.length === 1 ? "" : "s"} certificado${c.cursos.length === 1 ? "" : "s"}</li>
            <li>${ic("briefcase")} ${c.experiencias.length} experiencia${c.experiencias.length === 1 ? "" : "s"}</li>
            <li>${ic("star")} ${c.nRecos} recomendaci${c.nRecos === 1 ? "ón" : "ones"}</li>
            <li>${ic("clock")} Postuló el ${fecha(c.post.fechas[0])}</li>
          </ul>
          <div class="app__actions">
            <button class="btn btn--primary btn--sm" data-ver-cand="${c.key}">${ic("user")} Ver perfil</button>
            ${candActions(c)}
          </div>
        </div>`).join("")
      : `<div class="empty">${ic("users")}<p>Esta oferta aún no recibe postulaciones.</p></div>`;
  }

  function openCompanyForm() {
    const e = state.empresa;
    openModal(`
      <h2>Editar empresa</h2>
      <form class="form" id="empForm">
        <label class="field field--block"><span>Nombre de la empresa</span><input name="nombre" required value="${esc(e.nombre)}" /></label>
        <div class="form__row">
          <label class="field field--block"><span>Sector</span><input name="sector" value="${esc(e.sector)}" placeholder="Ej.: Comercio, Tecnología" /></label>
          <label class="field field--block"><span>Ciudad</span><select name="ciudad">${CIUDADES.map((c) => `<option ${c === e.ciudad ? "selected" : ""}>${c}</option>`).join("")}</select></label>
        </div>
        <label class="field field--block"><span>Tamaño</span>
          <select name="tamano">${["1 a 10 empleados", "11 a 50 empleados", "50 a 200 empleados", "Más de 200 empleados"].map((t) => `<option ${t === e.tamano ? "selected" : ""}>${t}</option>`).join("")}</select></label>
        <label class="field field--block"><span>Sobre la empresa</span><textarea name="descripcion" rows="3">${esc(e.descripcion)}</textarea></label>
        <label class="field field--block"><span>Correo de contacto</span><input name="contacto" type="email" value="${esc(e.contacto)}" /></label>
        <button class="btn btn--primary btn--block" type="submit">Guardar cambios</button>
      </form>`);
    $("#empForm").addEventListener("submit", (ev) => {
      ev.preventDefault();
      const fd = new FormData(ev.target);
      Object.assign(state.empresa, {
        nombre: fd.get("nombre").trim() || e.nombre,
        sector: fd.get("sector").trim(),
        ciudad: fd.get("ciudad"),
        tamano: fd.get("tamano"),
        descripcion: fd.get("descripcion").trim(),
        contacto: fd.get("contacto").trim(),
      });
      save(); closeModal(); renderPanel();
      toast("Datos de la empresa actualizados");
    });
  }

  // "Ver postulantes" desde Empleos o desde el aviso de oferta publicada
  document.addEventListener("click", (e) => {
    const v = e.target.closest("[data-ver-oferta]");
    if (v) empSel = v.dataset.verOferta;
  });

  renderers.panel = renderPanel;

  /* =========================================================
     PARA EMPRESAS — publicar oferta
     ========================================================= */
  fillSelect($("#fCarrera"), CARRERAS, false);
  fillSelect($("#fCiudad"), CIUDADES, false);

  // El formulario usa los datos del perfil de empresa
  function prefillCompanyForm() {
    const f = $("#companyForm");
    if (!f.empresa.value.trim()) f.empresa.value = state.empresa.nombre;
    if (!f.dataset.touched) f.ciudad.value = state.empresa.ciudad;
  }
  $("#companyForm").addEventListener("input", (e) => { if (e.target.name === "ciudad") e.currentTarget.dataset.touched = "1"; });
  renderers.empresas = prefillCompanyForm;

  $("#companyForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const form = e.target;
    const fd = new FormData(form);
    const err = $("#fError");
    const faltan = ["empresa", "titulo", "salario", "descripcion"].filter((k) => !String(fd.get(k) || "").trim());
    $$(".field input, .field textarea", form).forEach((el) => el.classList.toggle("is-invalid", faltan.includes(el.name)));
    if (faltan.length) {
      err.hidden = false;
      err.textContent = "Completa los campos obligatorios marcados en rojo.";
      return;
    }
    err.hidden = true;
    const sello = !!(fd.get("sinExp") && fd.get("tutor") && fd.get("responder"));
    const oferta = {
      id: "e" + Date.now(),
      titulo: fd.get("titulo").trim(),
      empresa: fd.get("empresa").trim(),
      carrera: fd.get("carrera"),
      ciudad: fd.get("ciudad"),
      modalidad: fd.get("modalidad"),
      salario: Math.max(0, Number(fd.get("salario"))),
      tipo: fd.get("tipo"),
      primeraOportunidad: sello,
      dias: 0,
      nueva: true,
      descripcion: fd.get("descripcion").trim(),
      requisitos: [fd.get("sinExp") ? "Sin experiencia previa requerida" : "Perfil junior", fd.get("tutor") ? "Tendrás tutor y plan de aprendizaje" : "Ganas de aprender"],
    };
    state.ofertasEmpresa.unshift(oferta);
    // Quien publica es una empresa: se actualiza su nombre y pasa al rol empresa
    state.empresa.nombre = oferta.empresa;
    empSel = oferta.id;
    save();
    setRol("empresa", true);
    form.reset();
    delete form.dataset.touched;
    prefillCompanyForm();
    setFilters({}); // para que la nueva oferta se vea al ir a Empleos

    // Avisar si coincide con alguna alerta del joven
    const coincide = [{ filtros: { carrera: state.perfil.carrera } }, ...state.alertas].some((a) => matches(oferta, a.filtros));

    openModal(`
      <div class="success">
        <div class="success__icon">${ic("check")}</div>
        <h2>¡Oferta publicada!</h2>
        <p>“${esc(oferta.titulo)}” ya aparece en la bolsa de empleos.</p>
        ${sello
          ? `<p class="note note--green">${ic("shield")} Cumples los 3 compromisos: tu oferta muestra el sello <b>Empresa Primera Oportunidad</b>.</p>`
          : `<p class="note">${ic("sparkle")} Marca los 3 compromisos en tu próxima oferta para obtener el sello Primera Oportunidad.</p>`}
        <div class="row-gap row-gap--center">
          <a href="#panel" class="btn btn--primary" data-close data-ver-oferta="${oferta.id}">${ic("building")} Ir a Mi empresa</a>
          <a href="#empleos" class="btn btn--outline" data-close>Ver en Empleos ${ic("arrow")}</a>
        </div>
      </div>`);
    if (coincide) setTimeout(() => toast("🔔 Nueva oferta coincide con una alerta de jóvenes", "info"), 600);
  });

  /* =========================================================
     MICROINTERACCIONES
     ========================================================= */
  const fineMotion = matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)").matches;

  // Las listas que se vuelven a dibujar (filtros) entran escalonadas
  const staggerObs = new MutationObserver((muts) =>
    muts.forEach((m) => [...m.target.children].forEach((c, i) => c.style.setProperty("--i", Math.min(i, 10))))
  );
  ["#courseGrid", "#jobList", "#mentorGrid", "#testiGrid", "#pApps", "#eOfertas", "#eCandList"].forEach((s) => staggerObs.observe($(s), { childList: true }));

  if (fineMotion) {
    // Luz suave que sigue al mouse dentro de las tarjetas
    const SPOT = ".pillar, .course, .mentor, .job, .benefit, .stat, .method li, .cause";
    document.addEventListener("pointermove", (e) => {
      const el = e.target.closest(SPOT);
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${e.clientX - r.left}px`);
      el.style.setProperty("--my", `${e.clientY - r.top}px`);
    }, { passive: true });

    // Botones grandes "magnéticos"
    $$(".btn--lg").forEach((b) => {
      b.addEventListener("pointermove", (e) => {
        const r = b.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * 0.18;
        const y = (e.clientY - r.top - r.height / 2) * 0.3;
        b.style.transform = `translate(${x}px, ${y}px)`;
      });
      b.addEventListener("pointerleave", () => (b.style.transform = ""));
    });

    // Ligero efecto de profundidad en el visual del héroe
    const visual = $(".hero__visual");
    $(".hero").addEventListener("pointermove", (e) => {
      const x = (e.clientX / innerWidth - 0.5) * 2;
      const y = (e.clientY / innerHeight - 0.5) * 2;
      $$(".float-card", visual).forEach((c, i) => (c.style.translate = `${x * (8 + i * 6)}px ${y * (6 + i * 4)}px`));
      $(".hero__circle", visual).style.translate = `${x * -6}px ${y * -6}px`;
    });
  }

  /* ---------------- Inicio ---------------- */
  route();
  onScroll();
})();
