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
    $$(".page-section").forEach((section) => section.classList.toggle("active", section.id === id));
    $$(".nav-button").forEach((button) => {
      const active = button.dataset.nav === id;
      button.classList.toggle("active", active);
      button.setAttribute("aria-selected", String(active));
    });
    if (updateHash) history.replaceState(null, "", `#${id}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  $$('[data-nav]').forEach((control) => control.addEventListener("click", (event) => {
    event.preventDefault();
    activateSection(control.dataset.nav);
  }));

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
    $("#plan-phase-kicker").textContent = meta.kicker;
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
    const completed = boulders.filter((problem) => problem.completed).length;
    $("#metric-sessions").textContent = sessionsAsc.length;
    $("#metric-problems").textContent = boulders.length;
    $("#metric-completion").textContent = `${(completed / boulders.length * 100).toFixed(1).replace(".", ",")}%`;
    $("#metric-40").textContent = boulders.filter((problem) => problem.angle === 40).length;
  }

  function renderVolumeChart() {
    const chart = $("#volume-chart");
    const max = Math.max(...sessionsAsc.map((session) => session.problems.length));
    chart.innerHTML = sessionsAsc.map((session) => {
      const count25 = session.problems.filter((problem) => problem.angle === 25).length;
      const count40 = session.problems.filter((problem) => problem.angle === 40).length;
      return `<div class="bar-slot"><div class="bar-stack" title="${fmtDate(session.date)}: ${count25} a 25° y ${count40} a 40°"><div class="bar a40" style="height:${count40 / max * 100}%"></div><div class="bar a25" style="height:${count25 / max * 100}%"></div></div><time datetime="${session.date}">${session.date.slice(5).split("-").reverse().join("/")}</time></div>`;
    }).join("");
  }

  function renderLatestBreakdown() {
    const latest = sessionsDesc[0];
    const hard = latest.problems.filter((problem) => problem.angle === 40);
    const grades = ["6B+", "6C", "6C+"];
    $("#latest-breakdown").innerHTML = grades.map((grade) => {
      const attempts = hard.filter((problem) => problem.font_grade === grade);
      const done = attempts.filter((problem) => problem.completed).length;
      return `<div class="breakdown-row"><strong>${grade}</strong><div class="breakdown-meter"><i style="width:${pct(done, attempts.length)}%"></i></div><span>${done}/${attempts.length} completados</span></div>`;
    }).join("");
  }

  function renderTrend() {
    const width = 1000;
    const height = 165;
    const padX = 45;
    const padY = 18;
    const rates = sessionsAsc.map((session) => session.completed_reported / session.problems_reported);
    const points = rates.map((rate, index) => {
      const x = padX + index * ((width - padX * 2) / (rates.length - 1));
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
    $("#session-list").innerHTML = sessionsDesc.map((session) => {
      const count25 = session.problems.filter((problem) => problem.angle === 25).length;
      const count40 = session.problems.filter((problem) => problem.angle === 40).length;
      const topDone = session.problems.filter((problem) => problem.completed).sort((a, b) => gradeOrder.indexOf(b.font_grade) - gradeOrder.indexOf(a.font_grade))[0]?.font_grade || "—";
      const maxTried = session.problems.sort((a, b) => gradeOrder.indexOf(b.font_grade) - gradeOrder.indexOf(a.font_grade))[0]?.font_grade || "—";
      return `<details class="session-entry"><summary><span class="session-date">${fmtDate(session.date)}</span><div class="session-score"><strong>${session.completed_reported}/${session.problems_reported}</strong><span>completados · ${session.tries_reported} intentos</span></div><div class="angle-split" title="${count25} a 25° / ${count40} a 40°"><i style="width:${pct(count25, session.problems.length)}%"></i><i style="width:${pct(count40, session.problems.length)}%"></i></div></summary><div class="session-detail"><dl><dt>25° / 40°</dt><dd>${count25} / ${count40}</dd><dt>Máximo encadenado</dt><dd>${topDone}</dd><dt>Máximo probado</dt><dd>${maxTried}</dd><dt>Eficiencia</dt><dd>${pct(session.completed_reported, session.problems_reported)}%</dd></dl></div></details>`;
    }).join("");
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
    try { return JSON.parse(localStorage.getItem(storageKey) || "[]"); }
    catch { return []; }
  }

  function saveManualSessions(items) {
    localStorage.setItem(storageKey, JSON.stringify(items));
    renderManualSessions();
  }

  function renderManualSessions() {
    const items = getManualSessions().sort((a, b) => b.date.localeCompare(a.date));
    const target = $("#manual-list");
    if (!items.length) {
      target.innerHTML = '<div class="empty-state"><p>Aún no hay sesiones manuales.<br>Añade roca, Tindeq o sesiones que no estén en MoonBoard.</p></div>';
      return;
    }
    target.innerHTML = items.map((item) => `<article class="manual-entry"><time datetime="${item.date}">${fmtDate(item.date)}</time><div><strong>${escapeHtml(item.type)}</strong><p>${item.maxGrade ? `Máximo ${escapeHtml(item.maxGrade)} · ` : ""}${item.rpe ? `RPE ${item.rpe} · ` : ""}${item.pain !== "" ? `dolor ${item.pain}/10` : ""}${item.notes ? `<br>${escapeHtml(item.notes)}` : ""}</p></div><button class="remove-entry" data-remove="${item.id}" type="button" aria-label="Eliminar sesión">Eliminar</button></article>`).join("");
    $$('[data-remove]').forEach((button) => button.addEventListener("click", () => saveManualSessions(getManualSessions().filter((item) => item.id !== button.dataset.remove))));
  }

  $("#session-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget).entries());
    data.id = `${Date.now()}`;
    saveManualSessions([...getManualSessions(), data]);
    event.currentTarget.reset();
    event.currentTarget.elements.date.valueAsDate = new Date();
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
    downloadJson({ exported_at: new Date().toISOString(), moonboard: window.MOON_DATA, manual_sessions: getManualSessions() }, `proyecto-8a-${new Date().toISOString().slice(0,10)}.json`);
    showToast("Copia exportada");
  });

  $("#import-file").addEventListener("change", async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const payload = JSON.parse(await file.text());
      if (!Array.isArray(payload.manual_sessions)) throw new Error("Formato no reconocido");
      saveManualSessions(payload.manual_sessions);
      showToast("Copia importada");
    } catch {
      showToast("No se pudo importar esa copia");
    }
    event.target.value = "";
  });

  renderMetrics();
  renderVolumeChart();
  renderLatestBreakdown();
  renderTrend();
  renderSessions();
  setupBoulderFilters();
  renderManualSessions();
  $("#session-form").elements.date.valueAsDate = new Date();
})();
