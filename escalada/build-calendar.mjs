import { readFile, writeFile } from "node:fs/promises";
const root = new URL("./", import.meta.url);
const plan = JSON.parse(await readFile(new URL("data/plan.json", root), "utf8"));
const nextDay = (date) => { const value = new Date(`${date}T12:00:00Z`); value.setUTCDate(value.getUTCDate() + 1); return value.toISOString().slice(0, 10); };
const escape = (text) => String(text).replaceAll("\\", "\\\\").replaceAll("\n", "\\n").replaceAll(";", "\\;").replaceAll(",", "\\,");
const fold = (line) => {
  const lines = []; let part = "";
  for (const char of line) {
    if (Buffer.byteLength(part + char) > 73) { lines.push(part); part = " " + char; }
    else part += char;
  }
  lines.push(part); return lines.join("\r\n");
};
const payloads = plan.events.map((event) => {
  const template = plan.templates[event.code];
  const title = `Bloque ${event.block ?? plan.block} · S${event.week} · ${event.code} · ${template.type}${event.deload ? " · Descarga" : event.bridge ? " · Dosis puente" : ""}`;
  const steps = event.deload ? ["Reducir el volumen al 50–60% del habitual y conservar algo de intensidad.", "Mantener calentamiento y descansos completos.", "No añadir dosis puente. Revisar criterios antes de cambiar de bloque."] : event.bridge ? ["Calentamiento progresivo.", "3 rondas de 2 problemas diferentes a 25°, 6A–6A+.", "15–30 s de transición y 4–5 min entre rondas.", "Reducir el volumen normal restante a 8–12 problemas."] : template.steps;
  const description = [`Proyecto 8a — Bloque ${event.block ?? plan.block}: ${plan.title}.`, `Semana ${event.week}: ${event.focus}`, template.intent, ...steps.map((step, index) => `${index + 1}. ${step}`), event.deload ? "Dosis: 50–60% del volumen habitual." : event.bridge ? "Dosis: 3 rondas de 2 problemas; descanso 4–5 min." : `Dosis: ${template.dose}. Pausa: ${template.rest}.`, template.record, event.week === 1 && event.code === "A" ? "Revisar el nivel actual antes de mantener la dosis. No se presupone completado el ciclo anterior." : "", "Día completo: sin hora fijada. Respetar 48 h entre sesiones de MoonBoard.", "Plan maestro: https://juanfranj.github.io/entrenamiento/escalada/PLAN_ENTRENAMIENTO.md", `Referencia: ${event.id}`].filter(Boolean).join("\n\n");
  return { id: event.id, title, description, start_date: event.date, end_date: nextDay(event.date), timezone_str: plan.timezone, color_id: plan.blocks.find((block) => block.number === (event.block ?? plan.block)).color_id };
});
const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Proyecto 8a//Entrenamiento//ES", "CALSCALE:GREGORIAN", "METHOD:PUBLISH", `X-WR-CALNAME:${plan.calendar_name}`, "X-WR-TIMEZONE:Europe/Madrid"];
for (const event of payloads) lines.push("BEGIN:VEVENT", `UID:${event.id}@proyecto8a`, "DTSTAMP:20261015T100000Z", `DTSTART;VALUE=DATE:${event.start_date.replaceAll("-", "")}`, `DTEND;VALUE=DATE:${event.end_date.replaceAll("-", "")}`, `SUMMARY:${escape(event.title)}`, `DESCRIPTION:${escape(event.description)}`, "TRANSP:TRANSPARENT", "END:VEVENT");
lines.push("END:VCALENDAR");
await writeFile(new URL("data/entrenemiento.ics", root), lines.map(fold).join("\r\n") + "\r\n");
// Payloads are generated outside the published folder to keep account metadata private.
if (process.argv[2]) await writeFile(process.argv[2], JSON.stringify(payloads, null, 2) + "\n");
console.log(`Calendario generado: ${payloads.length} sesiones, ${payloads[0].start_date} a ${payloads.at(-1).start_date}.`);
