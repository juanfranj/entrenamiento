import { readFile, writeFile } from "node:fs/promises";

const root = new URL("./", import.meta.url);
const moonboard = JSON.parse(await readFile(new URL("data/sessions.json", root), "utf8"));
const rock = JSON.parse(await readFile(new URL("data/ascents.json", root), "utf8"));
const plan = JSON.parse(await readFile(new URL("data/plan.json", root), "utf8"));
await writeFile(new URL("assets/data.js", root), `window.MOON_DATA = ${JSON.stringify(moonboard)};\n`);
await writeFile(new URL("assets/rock-data.js", root), `window.ROCK_DATA = ${JSON.stringify(rock)};\n`);
await writeFile(new URL("assets/plan-data.js", root), `window.TRAINING_PLAN = ${JSON.stringify(plan)};\n`);

const columns = ["fecha", "orden", "nombre", "setter", "angulo", "grado_font", "grado_v", "resultado", "completado", "intentos", "repeticiones_globales"];
const csvCell = (value) => {
  const text = String(value ?? "");
  return /[",\n\r]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
};
const rows = moonboard.sessions.flatMap((session) => session.problems.map((problem) => [
  session.date, problem.order, problem.name, problem.setter, problem.angle, problem.font_grade,
  problem.v_grade, problem.result, problem.completed ? "sí" : "no", problem.tries, problem.repeats,
]));
await writeFile(new URL("data/boulders_moonboard.csv", root), [columns, ...rows].map((row) => row.map(csvCell).join(",")).join("\n") + "\n");
console.log(`${moonboard.sessions.length} sesiones MoonBoard y ${rock.ascents.length} ascensiones de cuerda empaquetadas.`);

const sessionText = (code, template) => [`### ${code} — ${template.title}`, "", `Objetivo: ${template.intent}`, "", `Dosis: **${template.dose}**. Descanso: ${template.rest}.`, "", ...template.steps.map((step, index) => `${index + 1}. ${step}`), "", template.record, ""].join("\n");
const planText = [
  "# Plan maestro — Proyecto 8a", "", "Generado desde `data/plan.json` con `node build-data.mjs`. Editar las prescripciones en JSON y regenerar los derivados.", "",
  `Revisión aplicada: ${plan.adjusted_on}. Bloque actual confirmado: **${plan.block}**. Objetivo: mejorar en escalada deportiva con cuerda.`, "",
  plan.scheduling_note, "", plan.transition_policy, "",
  "## Recorrido completo", "", "| Bloque | Inicio | Fin | Estado |", "| --- | --- | --- | --- |",
  ...plan.blocks.map((block) => `| ${block.number} · ${block.name} | ${block.start_date} | ${block.end_date} | ${block.number === plan.block ? "Actual" : block.kind === "history" ? "Histórico" : "Previsión ajustable"} |`), "",
  "El inicio de B2 es una reconstrucción; su cuarta semana se extiende hasta el 18/10. Los periodos completos se muestran solo en la web. Google Calendar e ICS contienen sesiones de día completo sin hora. Ninguna fecha confirma el paso de bloque.", "",
  "## Evidencia y próxima decisión", "", plan.review.assessment.scope, "", ...plan.review.assessment.evidence.map((item) => `- **${item.title}: ${item.value}.** ${item.detail}`), "", plan.review.assessment.interpretation, "", plan.review.assessment.next_review, "",
  "## Prescripciones por bloque", "",
  ...plan.blocks.map((block) => [`## Bloque ${block.number} — ${block.name}`, "", block.basis, "", `Criterio: ${block.gate}`, "", ...Object.entries(block.templates).map(([code, template]) => sessionText(code, template)), block.deload_templates ? ["### Dosis de descarga", "", ...Object.entries(block.deload_templates).map(([code, template]) => sessionText(code, template))].join("\n") : "", "### Progresión", "", ...block.weeks.map((week) => `- Semana ${week.number} (${week.start_date}–${week.end_date}) · ${week.title}: ${week.focus}`), ""].join("\n")),
  `## ${plan.conditioning.title}`, "", plan.conditioning.dose, "", ...plan.conditioning.steps.map((step) => `- ${step}`), "", plan.conditioning.note, "",
  "## Reglas de aplicación", "", "- Priorizar calidad y respuesta del deportista; las dosis no son cuotas obligatorias ni protocolos universales validados.", "- Reducir carga ante molestias y revisar recuperación; no añadir campus o suspensiones por sistema.", "- Primera medición de sensor: confirmar montaje, familiarizar y sustituir trabajo; sin batería máxima extra ni zonas automáticas basadas en CF all-out.", "- Conservar calentamiento; los techos de intentos se refieren al trabajo principal.", "- Separar resultados reales de programación. Preservar los IDs de sesiones para mantener los resultados enlazados.", "- Consultar [biblioteca del entrenador](../investigacion/index.html), [protocolos](../investigacion/PROTOCOLOS.md) y [revisión que fundamenta el cambio](../investigacion/revisiones/2026-10-16-plan.md).", ""
].join("\n");
await writeFile(new URL("PLAN_ENTRENAMIENTO.md", root), planText);
