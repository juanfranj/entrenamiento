# Aplicación de la revisión del entrenador

Fecha: 16/10/2026. Autorización del usuario: «cambia entonces la planificacion con tu propuesta si es necesario, y actualizalo en la web y todo».

## Decisiones aplicadas

- Bloque operativo: 2; ninguna transición se confirma automáticamente.
- Descarga 19–25/10. La semana 4 reconstruida se extiende hasta el 18/10. B3 26/10–22/11, B4 23/11–20/12 y B5 21/12–17/01 como previsiones revisables.
- B2 A: 3–5 problemas adecuados y máximo total de 12–16 intentos de trabajo, con descansos amplios; selección adaptada a presas y calidad.
- B2 B: EMOM inicial de 2×6 conocidos a 25°, 5 min entre series; sin tercera ronda ni enlaces añadidos. Ajustar si cae técnica.
- B3 A: máximo total de 8–12 intentos; B inicial de 3 series de 2 problemas seguidos, 5–6 min entre series. Sustituye EMOM; progresión de una variable.
- B4: sin requisito 6C+/7A. A de 6–10 intentos; B inicial 2 series de 3 problemas, ajustadas a la vía. B3/B4 reservan semana 4 para menor carga y revisión.
- Cuerda: pegues útiles según longitud y recuperación, no cuotas obligatorias. Acondicionamiento breve opcional después de descarga, con ejercicios ya conocidos/tolerados y sin otro día máximo.
- Descargas con dosis propias. El primer test de sensor, si se concreta, sustituye A; no añade batería máxima ni constituye requisito de paso.

Las cifras son decisiones prácticas de partida, no protocolos validados para este deportista. Fuentes que informan la interpretación: S05, S43 y S44; fundamento y límites en la evaluación inicial.

## Coherencia y conservación

`escalada/data/plan.json` es la fuente de dosis. Las fichas y el calendario web leen esas prescripciones; el generador produce plan Markdown, datos empaquetados, ICS y payloads de calendario. Las semanas tienen fechas explícitas para poder extender una sin desplazar el resto incorrectamente.

Se conservan histórico MoonBoard, ascensiones y todos los IDs existentes. Un ID anterior puede conservar prefijo de otro bloque tras una reasignación: se mantiene como clave estable para no romper resultados guardados. Las etiquetas visibles proceden del bloque actual del evento.

## Google Calendar verificado

41 sesiones de un día en «entrenemiento»: 39 actualizadas con los mismos IDs, una nueva el 17/01 y la sesión pasada del 15/10 conservada. Comparación de títulos y descripciones futuras con los payloads sin diferencias. Cero eventos de entrenamiento localizados en el personal en el periodo revisado; evento nuevo sin invitados. No hay periodos de bloques en Google Calendar. El cambio horario del 25/10 no convierte esa sesión de un día en evento de varios días.

## Próxima revisión

Revisar recuperación, continuidad registrada, cartera disponible y protocolo del sensor durante la descarga. Confirmar o desplazar B3 previsto desde el 26/10; concretar vía objetivo antes de especializar la carga. No borrar resultados si se amplía B2.
