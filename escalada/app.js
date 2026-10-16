(() => {
  "use strict";

  // Controlador principal del panel local Proyecto 8a.
  // Responsabilidades: navegación, fases del plan, métricas, filtros,
  // registro local y exportación/importación de copias de seguridad.

  const rawSessions = window.MOON_DATA?.sessions || [];
  const sessionsAsc = [...rawSessions].sort((a, b) => a.date.localeCompare(b.date));
  const sessionsDesc = [...sessionsAsc].reverse();
  const boulders = sessionsDesc.flatMap((session) => session.problems.map((problem) => ({ ...problem, date: session.date })));
  const gradeOrder = ["5+", "6A", "6A+", "6B", "6B+", "6C", "6C+", "7A", "7A+", "7B"];
  const plan = window.TRAINING_PLAN;
  const storageKey = "proyecto8a-manual-sessions-v1";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const fmtDate = (date) => new Intl.DateTimeFormat("es-ES", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(`${date}T12:00:00`));
  const pct = (value, total) => total ? Math.round(value / total * 100) : 0;
  const escapeHtml = (value) => String(value ?? "").replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[char]);

  function showToast(message) {
    const toast = $("#toast");
    toast.textContent = message;
    toast.classList.add("visible");
    window.setTimeout(() => toast.classList.remove("visible"), 2300);
  }

  function activateSection(id, updateHash = true) {
    if (!document.getElementById(id)?.classList.contains("page-section")) return;
    $$(".page-section").forEach((section) => section.classList.toggle("active", section.id === id));
    $$(".nav-button").forEach((button) => {
      const active = button.dataset.nav === id;
      button.classList.toggle("active", active);
      button.setAttribute("aria-current", active ? "page" : "false");
    });
    if (updateHash) history.pushState(null, "", `#${id}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  $$('[data-nav]').forEach((control) => control.addEventListener("click", (event) => {
    event.preventDefault();
    activateSection(control.dataset.nav);
  }));

  window.addEventListener("popstate", () => activateSection(location.hash.slice(1) || "resumen", false));

  const requested = location.hash.slice(1);
  if (requested && document.getElementById(requested)) activateSection(requested, false);

  const blockMeta = {
    1: { kicker: "Bloque 1 · completado", title: "Base y adaptación al MoonBoard.", chip: "Completado con tus primeras 9 sesiones" },
    2: { kicker: "Bloque 2 · cinco semanas", title: "Consolidar 6C, abrir 6C+.", chip: "4 semanas de carga + 1 descarga" },
    3: { kicker: "Bloque 3 · puente hacia cuerda", title: "Enlazar fuerza y continuidad.", chip: "3–4 semanas según respuesta" },
    4: { kicker: "Bloque 4 · resistencia de potencia", title: "Fuerza cuando ya hay fatiga.", chip: "4 semanas específicas" },
    5: { kicker: "Bloque 5 · rendimiento en vía", title: "Convertir el entrenamiento en encadenamientos.", chip: "3–6 semanas según proyecto" },
  };

  function activateBlock(number, moveFocus = false) {
    const selected = String(number);
    const meta = blockMeta[selected];
    if (!meta) return;
    $$("[data-block]").forEach((button) => {
      const active = button.dataset.block === selected;
      button.classList.toggle("selected", active);
      button.setAttribute("aria-selected", String(active));
      const action = $("em", button);
      if (action) action.textContent = active ? "Viendo" : "Ver bloque";
      if (active && moveFocus) button.focus();
    });
    $$("[data-block-panel]").forEach((panel) => {
      const active = panel.dataset.blockPanel === selected;
      panel.classList.toggle("active", active);
      panel.hidden = !active;
    });
    const period = plan.blocks.find((block) => block.number === Number(selected));
    $("#plan-phase-kicker").textContent = `${meta.kicker} · ${fmtDate(period.start_date)} — ${fmtDate(period.end_date)}${period.kind === "projected" ? " · Previsión ajustable" : ""}`;
    $("#plan-title").textContent = meta.title;
    $("#plan-phase-chip").lastChild.textContent = meta.chip;
  }

  $$("[data-block]").forEach((button, index, controls) => {
    button.addEventListener("click", () => activateBlock(button.dataset.block));
    button.addEventListener("keydown", (event) => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      let next = index;
      if (event.key === "ArrowLeft") next = (index - 1 + controls.length) % controls.length;
      if (event.key === "ArrowRight") next = (index + 1) % controls.length;
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = controls.length - 1;
      activateBlock(controls[next].dataset.block, true);
    });
  });

  activateBlock(2);

  function renderMetrics() {
    $("#metric-period").textContent = `Hasta ${fmtDate(sessionsDesc[0]?.date || "2026-09-17")}`;
    const completed = boulders.filter((problem) => problem.completed).length;
    $("#metric-sessions").textContent = sessionsAsc.length;
    $("#metric-problems").textContent = boulders.length;
    $("#metric-completion").textContent = `${(completed / boulders.length * 100).toFixed(1).replace(".", ",")}%`;
    $("#metric-40").textContent = boulders.filter((problem) => problem.angle === 40).length;
  }

  function renderVolumeChart() {
    const chart = $("#volume-chart");
    chart.style.gridTemplateColumns = `repeat(${Math.max(sessionsAsc.length, 1)}, minmax(0, 1fr))`;
    const max = Math.max(1, ...sessionsAsc.map((session) => session.problems.length));
    chart.innerHTML = sessionsAsc.map((session) => {
      const count25 = session.problems.filter((problem) => problem.angle === 25).length;
      const count40 = session.problems.filter((problem) => problem.angle === 40).length;
      return `<div class="bar-slot"><div class="bar-stack" title="${fmtDate(session.date)}: ${count25} a 25° y ${count40} a 40°"><div class="bar a40" style="height:${count40 / max * 100}%"></div><div class="bar a25" style="height:${count25 / max * 100}%"></div></div><time datetime="${session.date}">${session.date.slice(5).split("-").reverse().join("/")}</time></div>`;
    }).join("");
  }

  function renderLatestBreakdown() {
    const latest = sessionsDesc[0];
    if (!latest) return;
    $("#latest-date").textContent = fmtDate(latest.date);
    const hard = latest.problems.filter((problem) => problem.angle === 40);
    const grades = ["6B+", "6C", "6C+"];
    $("#latest-breakdown").innerHTML = grades.map((grade) => {
      const attempts = hard.filter((problem) => problem.font_grade === grade);
      const done = attempts.filter((problem) => problem.completed).length;
      return `<div class="breakdown-row"><strong>${grade}</strong><div class="breakdown-meter"><i style="width:${pct(done, attempts.length)}%"></i></div><span>${attempts.length ? `${done}/${attempts.length} completados` : "Sin registros"}</span></div>`;
    }).join("");
  }

  function renderTrend() {
    const width = 1000;
    const height = 165;
    const padX = 45;
    const padY = 18;
    const rates = sessionsAsc.map((session) => session.completed_reported / session.problems_reported);
    const points = rates.map((rate, index) => {
      const x = padX + index * ((width - padX * 2) / Math.max(1, rates.length - 1));
      const y = padY + (1 - rate) * (height - padY * 2);
      return { x, y, rate, date: sessionsAsc[index].date };
    });
    const grid = [0.5, 0.75, 1].map((rate) => {
      const y = padY + (1 - rate) * (height - padY * 2);
      return `<line class="trend-grid" x1="${padX}" y1="${y}" x2="${width - padX}" y2="${y}"/><text class="trend-label" x="0" y="${y + 4}">${Math.round(rate * 100)}%</text>`;
    }).join("");
    const labels = points.map((point) => `<text class="trend-label" text-anchor="middle" x="${point.x}" y="${height}">${point.date.slice(5).split("-").reverse().join("/")}</text>`).join("");
    const dots = points.map((point) => `<circle class="trend-dot" cx="${point.x}" cy="${point.y}" r="5"><title>${fmtDate(point.date)}: ${Math.round(point.rate * 100)}%</title></circle>`).join("");
    $("#session-trend").innerHTML = `<div class="panel-heading"><div><p class="section-kicker">Regularidad</p><h2>Porcentaje completado por sesión</h2></div><span class="legend">No compara dificultad entre días</span></div><svg class="trend-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="Evolución del porcentaje completado">${grid}<polyline class="trend-line" points="${points.map((point) => `${point.x},${point.y}`).join(" ")}"/>${dots}${labels}</svg>`;
  }

  function renderSessions() {
    const kind = $("#history-type").value;
    const from = $("#history-from").value;
    const to = $("#history-to").value;
    const records = [
      ...sessionsDesc.map((session) => ({ kind: "moon", date: session.date, session })),
      ...(window.ROCK_DATA?.ascents || []).map((ascent) => ({ kind: "rock", date: ascent.date, ascent })),
      ...getManualSessions().map((item) => ({ kind: "manual", date: item.date, item })),
    ].filter((record) => (kind === "all" || record.kind === kind) && (!from || record.date >= from) && (!to || record.date <= to)).sort((a, b) => b.date.localeCompare(a.date));
    $("#history-count").textContent = `${records.length} registros`;
    $("#session-list").innerHTML = records.map((record) => {
      let title, summary, detail;
      if (record.kind === "moon") {
        const session = record.session;
        const hard = session.problems.filter((problem) => problem.angle === 40).length;
        title = session.training_type ? `MoonBoard · ${session.training_type}` : "MoonBoard · Logbook";
        summary = `${session.completed_reported}/${session.problems_reported} completados · ${session.tries_reported} intentos · ${hard} registros a 40°`;
        const problemRows = session.problems.map((problem) => `<tr><td>${escapeHtml(problem.name)}</td><td>${problem.angle}°</td><td>${escapeHtml(problem.font_grade)}</td><td>${escapeHtml(problem.result)}</td><td>${problem.tries ?? "—"}</td><td>${problem.repeats == null ? "—" : new Intl.NumberFormat("es-ES").format(problem.repeats)}</td></tr>`).join("");
        detail = `<p>Fuente: Logbook de MoonBoard. La sesión puede incluir calentamiento a 25° y trabajo a 40°. ${session.training_type ? "La sesión A ha sido confirmada por el usuario." : "Su función dentro del plan no se deduce automáticamente."} Repeticiones globales: valor mostrado por la app al consultar, no un indicador directo de dificultad.</p><div class="table-wrap"><table><thead><tr><th>Problema</th><th>Ángulo</th><th>Grado</th><th>Resultado</th><th>Intentos</th><th>Repeticiones globales</th></tr></thead><tbody>${problemRows}</tbody></table></div>`;
      } else if (record.kind === "rock") {
        const ascent = record.ascent;
        title = `${ascent.name} · ${ascent.grade}`;
        summary = `${ascent.crag} · Cuerda · ${ascent.style}${ascent.tries == null ? "" : ` · ${ascent.tries} intentos`}`;
        detail = `<p>${escapeHtml(ascent.notes)}</p><p>Fuente: ${escapeHtml(ascent.source)}. Duración y RPE no registrados.</p>`;
      } else {
        const item = record.item;
        title = item.type;
        summary = [item.maxGrade ? `Máximo ${item.maxGrade}` : "", item.duration ? `${item.duration} min` : "", item.rpe ? `RPE ${item.rpe}` : "", item.planId ? "Vinculada al plan" : "Diario personal"].filter(Boolean).join(" · ");
        detail = `<p>${escapeHtml(item.notes || "Sin notas")}</p><p>Completados: ${escapeHtml(item.completed || "—")} · Intentos: ${escapeHtml(item.attempts || "—")} · Dolor: ${item.pain === "" || item.pain == null ? "sin registrar" : `${escapeHtml(item.pain)}/10`}</p>`;
      }
      return `<details class="session-entry"><summary><time class="session-date" datetime="${record.date}">${fmtDate(record.date)}</time><div class="session-score"><strong>${escapeHtml(title)}</strong><span>${escapeHtml(summary)}</span></div></summary><div class="session-detail">${detail}</div></details>`;
    }).join("") || '<div class="empty-state">No hay sesiones en este periodo.</div>';
  }

  function setupBoulderFilters() {
    const gradeSelect = $("#filter-grade");
    const presentGrades = gradeOrder.filter((grade) => boulders.some((problem) => problem.font_grade === grade));
    gradeSelect.insertAdjacentHTML("beforeend", presentGrades.map((grade) => `<option value="${grade}">${grade}</option>`).join(""));
    ["#filter-search", "#filter-angle", "#filter-grade", "#filter-result"].forEach((selector) => $(selector).addEventListener("input", renderBoulders));
    renderBoulders();
  }

  function renderBoulders() {
    const search = $("#filter-search").value.trim().toLocaleLowerCase("es");
    const angle = $("#filter-angle").value;
    const grade = $("#filter-grade").value;
    const result = $("#filter-result").value;
    const filtered = boulders.filter((problem) => {
      const matchesSearch = !search || `${problem.name} ${problem.setter}`.toLocaleLowerCase("es").includes(search);
      return matchesSearch && (!angle || String(problem.angle) === angle) && (!grade || problem.font_grade === grade) && (!result || (result === "completed" ? problem.completed : !problem.completed));
    });
    $("#filter-count").textContent = `${filtered.length} ${filtered.length === 1 ? "resultado" : "resultados"}`;
    $("#boulder-rows").innerHTML = filtered.map((problem) => `<tr><td>${fmtDate(problem.date)}</td><td><strong>${escapeHtml(problem.name)}</strong><br><small>${escapeHtml(problem.setter)}</small></td><td>${problem.angle}°</td><td>${problem.font_grade} / ${problem.v_grade}</td><td><span class="status-pill ${problem.completed ? "done" : "open"}">${escapeHtml(problem.result.replace(/ @\d+°$/, ""))}</span></td><td>${problem.tries ?? "—"}</td></tr>`).join("");
  }

  function getManualSessions() {
    try { const data = JSON.parse(localStorage.getItem(storageKey) || "[]"); return Array.isArray(data) ? data.map((item) => ({ ...item, planId: plan.legacy_event_ids?.[item.planId] || item.planId })) : []; }
    catch { return []; }
  }

  function renderRockAscents() {
    const ascents = [...(window.ROCK_DATA?.ascents || [])].sort((a, b) => b.date.localeCompare(a.date));
    $("#rock-ascents").innerHTML = ascents.map((ascent) => `<tr><td>${fmtDate(ascent.date)}</td><td><strong>${escapeHtml(ascent.name)}</strong></td><td>${escapeHtml(ascent.crag)}</td><td>${escapeHtml(ascent.grade)}</td><td>${escapeHtml(ascent.style)}</td><td>${ascent.tries ?? "—"}</td></tr>`).join("");
    $("#strength-test-status").textContent = window.ROCK_DATA?.strength_test?.notes || "Sin datos del test de fuerza con sensor.";
  }

  function saveManualSessions(items) {
    localStorage.setItem(storageKey, JSON.stringify(items));
    renderManualSessions();
    renderSessions();
    renderCalendar();
    renderResults();
    renderUpcoming();
  }

  function renderManualSessions() {
    const items = getManualSessions().sort((a, b) => b.date.localeCompare(a.date));
    const target = $("#manual-list");
    if (!items.length) {
      target.innerHTML = '<div class="empty-state"><p>Aún no hay sesiones manuales.<br>Añade roca, Tindeq o sesiones que no estén en MoonBoard.</p></div>';
      return;
    }
    target.innerHTML = items.map((item) => `<article class="manual-entry"><time datetime="${item.date}">${fmtDate(item.date)}</time><div><strong>${escapeHtml(item.type)}</strong><p>${item.maxGrade ? `Máximo ${escapeHtml(item.maxGrade)} · ` : ""}${item.rpe ? `RPE ${escapeHtml(item.rpe)} · ` : ""}${item.pain !== "" && item.pain != null ? `dolor ${escapeHtml(item.pain)}/10` : ""}${item.notes ? `<br>${escapeHtml(item.notes)}` : ""}</p></div><button class="remove-entry" data-remove="${escapeHtml(item.id)}" type="button" aria-label="Eliminar sesión">Eliminar</button></article>`).join("");
    $$('[data-remove]').forEach((button) => button.addEventListener("click", () => saveManualSessions(getManualSessions().filter((item) => item.id !== button.dataset.remove))));
  }

  $("#session-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget).entries());
    data.planId = data.plannedSession || "";
    delete data.plannedSession;
    const completed = data.completed === "" ? null : Number(data.completed);
    const attempts = data.attempts === "" ? null : Number(data.attempts);
    if (completed != null && attempts != null && completed > attempts) {
      showToast("Los completados no pueden superar los intentos.");
      return;
    }
    const previous = data.planId ? getManualSessions().find((item) => item.planId === data.planId) : null;
    data.id = previous?.id || `${Date.now()}`;
    saveManualSessions([...getManualSessions().filter((item) => item.id !== data.id), data]);
    event.currentTarget.reset();
    event.currentTarget.elements.date.value = today;
    showToast("Sesión guardada en este navegador");
  });

  function downloadJson(payload, filename) {
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  $("#export-all").addEventListener("click", () => {
    downloadJson({ exported_at: new Date().toISOString(), moonboard: window.MOON_DATA, rock: window.ROCK_DATA, plan: window.TRAINING_PLAN, manual_sessions: getManualSessions() }, `proyecto-8a-${new Date().toISOString().slice(0,10)}.json`);
    showToast("Copia exportada");
  });

  $("#import-file").addEventListener("change", async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const payload = JSON.parse(await file.text());
      if (!Array.isArray(payload.manual_sessions)) throw new Error("Formato no reconocido");
      const safe = payload.manual_sessions.every((item) => item && typeof item.id === "string" && /^\d{4}-\d{2}-\d{2}$/.test(item.date) && typeof item.type === "string" && (!item.notes || typeof item.notes === "string"));
      if (!safe) throw new Error("Registros no válidos");
      const merged = new Map(getManualSessions().map((item) => [item.id, item]));
      payload.manual_sessions.forEach((item) => merged.set(item.id, item));
      saveManualSessions([...merged.values()]);
      showToast("Copia importada");
    } catch {
      showToast("No se pudo importar esa copia");
    }
    event.target.value = "";
  });

  // Calendario: usa las dosis del plan maestro y conserva resultados reales aparte.
  const today = new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Madrid" }).format(new Date());
  const requestedDate = new URLSearchParams(location.search).get("fecha");
  let selectedDate = /^\d{4}-\d{2}-\d{2}$/.test(requestedDate || "") && Number.isFinite(Date.parse(`${requestedDate}T12:00:00Z`)) ? requestedDate : today;
  let calendarMonth = `${selectedDate.slice(0, 7)}-01`;
  const dateObject = (key) => new Date(`${key}T12:00:00Z`);
  const addDays = (key, days) => { const date = dateObject(key); date.setUTCDate(date.getUTCDate() + days); return date.toISOString().slice(0, 10); };
  const longDate = (key) => new Intl.DateTimeFormat("es-ES", { weekday: "long", day: "numeric", month: "long", timeZone: "Europe/Madrid" }).format(dateObject(key));
  const eventResult = (event) => getManualSessions().find((item) => item.planId === event.id);
  const eventState = (event) => eventResult(event) ? "Registrada" : event.date < today ? "Sin registrar" : event.provisional ? "Prevista · revisar entrada" : event.optional ? "Opcional" : "Planificada";
  const blockForDate = (date) => plan.blocks.find((block) => date >= block.start_date && date <= block.end_date);
  const weekForDate = (date, block) => Math.floor((dateObject(date) - dateObject(block.start_date)) / 604800000) + 1;

  const blockByNumber = (number) => plan.blocks.find((block) => block.number === Number(number));
  const blockStatus = (block) => block.kind === "history" ? "Histórico" : block.kind === "reconstructed" ? "Cronología reconstruida" : "Previsión ajustable";

  function renderSelectedBlock() {
    const block = blockForDate(selectedDate);
    const week = block?.weeks.find((item) => item.number === weekForDate(selectedDate, block));
    $("#selected-block-context").className = `selected-block-context ${block ? `block-${block.number}` : ""}`;
    $("#selected-block-context").innerHTML = `<div><span class="eyebrow">DÍA SELECCIONADO · ${escapeHtml(longDate(selectedDate))}</span><h2>${block ? `Bloque ${block.number} · ${escapeHtml(block.name)}` : "Fuera del recorrido previsto"}</h2><p>${block ? `${fmtDate(block.start_date)} — ${fmtDate(block.end_date)} · Semana ${week.number} de ${block.weeks.length}${week.deload ? " · Descarga" : ""} · ${blockStatus(block)}` : "Podemos ampliar o desplazar el plan tras revisar los resultados."}</p>${block ? `<p class="block-basis">${escapeHtml(block.basis)}</p>` : ""}</div>${block ? `<button class="quiet-button" data-view-block="${block.number}">Ver bloque ${block.number} →</button>` : ""}`;
    if (block) activateBlock(block.number);
    $("#calendar-weeks").hidden = !block;
    $("#calendar-weeks").innerHTML = (block?.weeks || []).map((item) => `<article class="${item.deload ? "deload" : ""} ${week?.number === item.number ? "selected-week" : ""}"${week?.number === item.number ? ' aria-current="step"' : ""}><span>SEMANA ${item.number}</span><strong>${escapeHtml(item.title)}</strong><p>${escapeHtml(item.focus)}</p></article>`).join("");
    $("#block-timeline").innerHTML = plan.blocks.map((item) => `<button class="block-period block-${item.number} ${block?.number === item.number ? "selected" : ""}" data-calendar-block="${item.number}" aria-pressed="${block?.number === item.number}"><span>Bloque ${item.number}${item.number === plan.block ? " · ACTUAL" : ""}</span><strong>${escapeHtml(item.name)}</strong><small>${fmtDate(item.start_date)} — ${fmtDate(item.end_date)}</small><em>${blockStatus(item)}</em></button>`).join("");
  }

  function prescription(event) {
    const base = blockByNumber(event.block).templates[event.code];
    const result = { ...base, steps: [...base.steps] };
    if (event.bridge) {
      result.title = "Técnica + dosis puente";
      result.dose = "3 rondas de 2 problemas a 25° · 6A–6A+";
      result.rest = "15–30 s de transición; 4–5 min entre rondas";
      result.steps = ["Calentamiento progresivo.", "Completar 3 rondas de 2 problemas diferentes seguidos, entre 6A y 6A+ a 25°.", "Limitar el volumen normal restante a 8–12 problemas.", "Mantener técnica y margen. No convertir la continuidad en intentos máximos."];
    }
    if (event.deload) {
      result.title = `${base.title} · descarga`;
      result.dose = "50–60% del volumen habitual, conservando algo de intensidad";
      result.steps = ["Mantener el calentamiento progresivo.", "Reducir el volumen total al 50–60% del habitual; no añadir la dosis puente.", "Conservar algo de intensidad con descansos completos.", "Registrar respuesta y revisar los criterios antes de pasar al bloque 3."];
    }
    return result;
  }

  function renderUpcoming() {
    const upcoming = plan.events.filter((event) => event.block === plan.block && event.date >= today && !eventResult(event)).slice(0, 3);
    const next = upcoming[0];
    if (next) {
      const dose = prescription(next);
      $("#next-session").innerHTML = `<span class="eyebrow">PRÓXIMA SESIÓN DEL BLOQUE ACTUAL</span><div class="session-date-label">${longDate(next.date)} · Bloque ${next.block} · Semana ${next.week}</div><h2>${escapeHtml(dose.title)}.</h2><p>${escapeHtml(dose.intent)}</p><div class="next-meta"><span>${escapeHtml(dose.type)}</span><span>${next.deload ? "Descarga" : next.bridge ? "Continuidad" : `Bloque ${next.block}`}</span></div><button class="primary-button" data-open-event="${next.id}">Consultar la sesión →</button>`;
    } else {
      $("#next-session").innerHTML = '<span class="eyebrow">REVISIÓN DEL BLOQUE ACTUAL</span><h2>Decidir la siguiente etapa.</h2><p>Consulta los resultados del ciclo y los criterios del plan antes de programar el siguiente bloque.</p><button class="primary-button" data-nav="resultados">Ver resultados →</button>';
    }
    $("#upcoming-list").innerHTML = upcoming.map((event) => {
      const dose = prescription(event);
      return `<button class="upcoming-card ${event.code}" data-open-event="${event.id}"><div><span class="type-code">${event.code} · ${dose.angle ? `${dose.angle}°` : "CUERDA"}</span><time datetime="${event.date}">${fmtDate(event.date)}</time></div><strong>${escapeHtml(dose.title)}</strong><p>${escapeHtml(dose.dose)}</p><small>Bloque ${event.block} · Semana ${event.week} →</small></button>`;
    }).join("") || '<div class="empty-state">Revisar resultados para ampliar el bloque actual o confirmar el siguiente.</div>';
  }

  function historyForDate(key) {
    return [
      ...sessionsDesc.filter((session) => session.date === key).map((session) => ({ title: "MoonBoard", text: `${session.completed_reported}/${session.problems_reported} completados · ${session.tries_reported} intentos. Fuente: Logbook.${session.training_type ? ` ${session.training_type}.` : ""}` })),
      ...(window.ROCK_DATA?.ascents || []).filter((ascent) => ascent.date === key).map((ascent) => ({ title: `${ascent.name} · ${ascent.grade}`, text: `${ascent.crag} · ${ascent.style}. Fuente: 8a.nu.` })),
      ...getManualSessions().filter((item) => item.date === key).map((item) => ({ title: item.type, text: item.notes || "Diario personal." })),
    ];
  }

  function renderCalendar() {
    renderSelectedBlock();
    $("#calendar-month").textContent = new Intl.DateTimeFormat("es-ES", { month: "long", year: "numeric", timeZone: "Europe/Madrid" }).format(dateObject(calendarMonth));
    const first = dateObject(calendarMonth);
    const mondayOffset = (first.getUTCDay() + 6) % 7;
    const start = addDays(calendarMonth, -mondayOffset);
    $("#calendar-grid").innerHTML = Array.from({ length: 42 }, (_, index) => {
      const key = addDays(start, index);
      const block = blockForDate(key);
      const week = block?.weeks.find((item) => item.number === weekForDate(key, block));
      const event = plan.events.find((item) => item.date === key);
      const dose = event ? prescription(event) : null;
      const recorded = historyForDate(key);
      const status = event ? eventState(event) : recorded.length ? "Actividad registrada" : "Sin sesión programada";
      const classNames = ["calendar-day", block ? `block-${block.number}` : "", week?.deload ? "block-deload" : "", key.slice(0, 7) !== calendarMonth.slice(0, 7) ? "outside" : "", key === today ? "today" : "", key === selectedDate ? "selected" : ""].filter(Boolean).join(" ");
      return `<button class="${classNames}" data-calendar-date="${key}" aria-label="${escapeHtml(`${longDate(key)}: ${block ? `Bloque ${block.number}, ${week ? `semana ${week.number}${week.deload ? ", descarga" : ""}, ` : ""}` : "Sin bloque asignado, "}${event ? `${event.code} · ${dose.title}, ${status}` : recorded.length ? recorded.map((item) => item.title).join(", ") + ", registrada" : status}`)}" aria-pressed="${key === selectedDate}"${key === today ? ' aria-current="date"' : ""}><span>${Number(key.slice(8))}</span>${block ? `<small class="cell-block">B${block.number}${week?.deload ? " · ↓" : ""}</small>` : ""}${event ? `<strong class="event-dot ${event.code} ${event.deload ? "deload" : ""} ${eventResult(event) ? "done" : ""}">${event.code} · ${event.deload ? "Descarga" : dose.angle ? `${dose.angle}°` : "Roca"}</strong>` : ""}${recorded.length ? `<strong class="event-dot history">✓ ${recorded[0].title === "MoonBoard" ? "Moon" : "Registro"}</strong>` : ""}</button>`;
    }).join("");
    renderDayDetail();
  }

  function renderDayDetail() {
    const block = blockForDate(selectedDate);
    const week = block ? weekForDate(selectedDate, block) : null;
    const blockLabel = `<p class="day-block-label ${block ? `block-${block.number}` : ""}">${block ? `Bloque ${block.number} · ${escapeHtml(block.name)}${week ? ` · Semana ${week}` : " · Histórico"}` : "Sin bloque asignado"}</p>`;
    const event = plan.events.find((item) => item.date === selectedDate);
    if (!event && historyForDate(selectedDate).length) {
      const recorded = historyForDate(selectedDate);
      $("#day-detail").innerHTML = `${blockLabel}<span class="eyebrow">${escapeHtml(longDate(selectedDate))}</span><h2>Actividad registrada.</h2><span class="status-pill done">${recorded.length} registro(s)</span>${recorded.map((item) => `<h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.text)}</p>`).join("")}<button class="primary-button" data-show-history="${selectedDate}">Ver detalle de la sesión</button>`;
      return;
    }
    if (!event) {
      $("#day-detail").innerHTML = `${blockLabel}<span class="eyebrow">${escapeHtml(longDate(selectedDate))}</span><h2>${block && selectedDate >= plan.reconstruction_date ? "Descanso / recuperación." : "Sin sesión programada."}</h2><p>${block && selectedDate >= plan.reconstruction_date ? "Día de recuperación dentro de este bloque. No hay sesión prescrita." : "El histórico no contiene una sesión en esta fecha; no se reconstruye una sesión realizada sin datos."} Puedes registrar una actividad si has entrenado.</p><button class="primary-button" data-log-date="${selectedDate}">Registrar actividad</button>`;
      return;
    }
    const dose = prescription(event);
    const existing = eventResult(event);
    $("#day-detail").innerHTML = `${blockLabel}<span class="eyebrow">${escapeHtml(longDate(event.date))} · S${event.week}</span><h2>${escapeHtml(dose.title)}</h2><span class="status-pill ${existing ? "done" : ""}">${eventState(event)}</span>${event.provisional ? `<p class="data-notice subtle">Previsión del bloque ${event.block}: confirmar la entrada en la revisión. ${escapeHtml(block.gate)}</p>` : ""}${event.provisional ? "" : `<p>${escapeHtml(event.focus)}</p>`}<div class="dose-box"><span>${escapeHtml(dose.type)}</span><strong>${escapeHtml(dose.dose)}</strong><small>${escapeHtml(dose.rest)}</small></div><ol>${dose.steps.map((step) => `<li>${escapeHtml(step)}</li>`).join("")}</ol><p>${escapeHtml(dose.record)}</p>${event.block === 2 && event.week === 1 && event.code === "A" ? '<p><strong>Primera sesión:</strong> revisar el nivel actual antes de mantener la dosis. La fecha no implica haber completado el bloque anterior.</p>' : ""}<button class="primary-button" data-log-event="${event.id}">${existing ? "Editar resultado" : "Registrar resultado"}</button>`;
  }

  function renderResults() {
    const assessment = plan.review.assessment;
    $("#block-assessment").innerHTML = `<span class="eyebrow">REVISIÓN DEL BLOQUE 2 · ${fmtDate(assessment.date)}</span><h2>${escapeHtml(assessment.decision)}</h2><p>${escapeHtml(assessment.scope)}</p><div class="assessment-evidence">${assessment.evidence.map((item) => `<div><span>${escapeHtml(item.title)}</span><strong>${escapeHtml(item.value)}</strong><p>${escapeHtml(item.detail)}</p></div>`).join("")}</div><p>${escapeHtml(assessment.interpretation)}</p><p><strong>Próxima revisión:</strong> ${escapeHtml(assessment.next_review)}</p>`;
    $("#total-tries").textContent = sessionsAsc.reduce((sum, session) => sum + session.tries_reported, 0);
    const elapsed = plan.events.filter((event) => event.block === plan.block && event.date >= plan.reconstruction_date && event.date < today);
    const completed = elapsed.filter(eventResult).length;
    $("#plan-adherence").textContent = elapsed.length ? `${completed}/${elapsed.length}` : "—";
    $("#adherence-note").textContent = elapsed.length ? "Sesiones programadas vencidas con resultado enlazado" : "Seguimiento desde la revisión del 15/10; el histórico previo se muestra en Sesiones";
    $("#angle-results").innerHTML = [25, 40].map((angle) => {
      const entries = boulders.filter((problem) => problem.angle === angle);
      const done = entries.filter((problem) => problem.completed).length;
      return `<div class="angle-result"><div><strong>${angle}°</strong><br><small>${entries.length} registros</small></div><div><strong>${pct(done, entries.length)}%</strong><br><small>${done} completados / ${entries.length}</small></div></div>`;
    }).join("");
    const exposures = sessionsDesc.map((session) => ({ date: session.date, entries: session.problems.filter((problem) => problem.angle === 40 && problem.font_grade === "6C") })).filter((session) => session.entries.length).slice(0, 2);
    const evidence = exposures.map((session) => `${fmtDate(session.date)}: ${session.entries.filter((problem) => problem.completed).length}/${session.entries.length}`).join("; ");
    $("#gate-status").textContent = `Últimas exposiciones a 6C a 40°: ${evidence || "sin datos"}. Son muestras distintas; el porcentaje no decide el cambio de bloque por sí solo. Comparar problemas del mismo montaje y ángulo, separando repeticiones y primeros encadenes. La continuidad sigue pendiente de una revisión registrada.`;
  }

  function selectPlannedSession(id) {
    const event = plan.events.find((item) => item.id === id);
    const form = $("#session-form");
    if (!event) { form.elements.planId.value = ""; return; }
    const existing = eventResult(event);
    form.reset();
    form.elements.plannedSession.value = id;
    form.elements.planId.value = id;
    form.elements.date.value = event.date;
    form.elements.type.value = blockByNumber(event.block).templates[event.code].type;
    if (existing) ["date", "type", "duration", "rpe", "maxGrade", "pain", "completed", "attempts", "notes"].forEach((key) => { form.elements[key].value = existing[key] ?? ""; });
  }

  document.addEventListener("click", (event) => {
    const open = event.target.closest("[data-open-event]");
    const day = event.target.closest("[data-calendar-date]");
    const log = event.target.closest("[data-log-event]");
    const free = event.target.closest("[data-log-date]");
    const nav = event.target.closest("[data-nav]");
    const calendarBlock = event.target.closest("[data-calendar-block]");
    const viewBlock = event.target.closest("[data-view-block]");
    const historyDate = event.target.closest("[data-show-history]");
    if (open) {
      const target = plan.events.find((item) => item.id === open.dataset.openEvent);
      selectedDate = target.date;
      calendarMonth = `${target.date.slice(0, 7)}-01`;
      renderCalendar(); activateSection("calendario");
    } else if (day) {
      selectedDate = day.dataset.calendarDate;
      renderCalendar();
      $(`[data-calendar-date="${selectedDate}"]`).focus({ preventScroll: true });
      if (window.matchMedia("(max-width: 1200px)").matches) $("#day-detail").scrollIntoView({ behavior: "smooth", block: "start" });
    }
    else if (calendarBlock) {
      const block = blockByNumber(calendarBlock.dataset.calendarBlock);
      selectedDate = today >= block.start_date && today <= block.end_date ? today : block.start_date;
      calendarMonth = `${selectedDate.slice(0, 7)}-01`;
      renderCalendar();
    }
    else if (viewBlock) { activateBlock(viewBlock.dataset.viewBlock); activateSection("plan"); }
    else if (log) { selectPlannedSession(log.dataset.logEvent); activateSection("registro"); }
    else if (free) { $("#session-form").reset(); $("#session-form").elements.date.value = free.dataset.logDate; activateSection("registro"); }
    else if (historyDate) { $("#history-from").value = historyDate.dataset.showHistory; $("#history-to").value = historyDate.dataset.showHistory; $("#history-type").value = "all"; renderSessions(); activateSection("sesiones"); }
    else if (nav && nav.closest("#next-session")) activateSection(nav.dataset.nav);
  });
  $("#planned-session").innerHTML += plan.events.map((event) => `<option value="${event.id}">${fmtDate(event.date)} · B${event.block} · S${event.week} · ${blockByNumber(event.block).templates[event.code].type}</option>`).join("");
  $("#planned-session").addEventListener("change", (event) => selectPlannedSession(event.target.value));
  ["#history-type", "#history-from", "#history-to"].forEach((selector) => $(selector).addEventListener("input", renderSessions));
  $("#calendar-prev").addEventListener("click", () => moveMonth(-1));
  $("#calendar-next").addEventListener("click", () => moveMonth(1));
  function moveMonth(step) { const date = dateObject(calendarMonth); date.setUTCMonth(date.getUTCMonth() + step); calendarMonth = date.toISOString().slice(0, 10); selectedDate = calendarMonth; renderCalendar(); }
  $("#calendar-today").addEventListener("click", () => { selectedDate = today; calendarMonth = `${today.slice(0, 7)}-01`; renderCalendar(); });
  $("#today-label").textContent = longDate(today);
  $("#cycle-dates").textContent = `${fmtDate(plan.start_date)} — ${fmtDate(plan.end_date)} · Bloques 1–5 · Plan vivo`;
  const currentBlock = blockByNumber(plan.block);
  const currentWeek = weekForDate(today, currentBlock);
  const position = currentWeek >= 1 && currentWeek <= currentBlock.weeks.length ? `Semana ${currentWeek} de ${currentBlock.weeks.length}` : "Pendiente de revisar fechas";
  $("#current-block-label").textContent = `Bloque actual: ${plan.block} · ${position}`;
  $("#overview-phase").textContent = `Bloque ${plan.block} · ${position}`;
  $("#current-position").textContent = `${position} · ${fmtDate(currentBlock.start_date)} — ${fmtDate(currentBlock.end_date)}. Fechas reconstruidas; el bloque actual cambia tras revisar resultados.`;
  $("#schedule-note").textContent = plan.scheduling_note;
  if (plan.google_calendar.status === "created" && plan.google_calendar.url) { $("#google-calendar-link").hidden = false; $("#google-calendar-link").href = plan.google_calendar.url; }
  $("#calendar-sync-state").textContent = plan.google_calendar.status === "created" ? "Programado en Google Calendar" : "Google Calendar: pendiente de completar";
  const lastDate = sessionsDesc[0]?.date;
  $("#data-notice").innerHTML = `<strong>MoonBoard: datos hasta ${lastDate ? fmtDate(lastDate) : "sin fecha"}.</strong> ${window.MOON_DATA.import_status === "complete" ? "Histórico actualizado desde el Logbook por USB." : "Pendiente incorporar las sesiones posteriores del móvil. Las métricas reflejan únicamente el histórico importado."}`;

  renderMetrics();
  renderVolumeChart();
  renderLatestBreakdown();
  renderTrend();
  renderSessions();
  setupBoulderFilters();
  renderManualSessions();
  renderRockAscents();
  renderUpcoming();
  renderCalendar();
  renderResults();
  $("#session-form").elements.date.value = today;
})();
