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
