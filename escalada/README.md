# Proyecto 8a

Panel local de seguimiento del entrenamiento de escalada de Juanfran. Integra el histórico de MoonBoard, el plan de cinco bloques orientado a escalada deportiva con cuerda y un registro manual para roca, Tindeq u otras sesiones.

## Estado del proyecto

- Versión: 2.4.0.
- Bloque terminado: 1 — Base.
- Bloque actual: 2 — Fuerza.
- Datos importados: 17 sesiones, 278 entradas de problemas y 381 intentos registrados.
- MoonBoard consultado por USB el 16/10/2026. Última sesión: 17 problemas, 11 completados y 26 intentos; incluye seis entradas a 25° y once a 40°.
- Cuerda verificada en 8a.nu el 15/10/2026: Námaste (7c, Archidona, 14/10) y Moya Boom (7b+, Mijas, segundo intento, 23/09).
- Test de fuerza con sensor pendiente, sin mediciones.
- Funcionamiento: aplicación web estática y local; no necesita instalación ni conexión a internet.

## Uso

1. Abrir `index.html` en un navegador moderno.
2. Usar la barra superior para cambiar entre Vista general, Calendario, Plan de entrenamiento, Sesiones, Resultados, Biblioteca MoonBoard y Registrar.
3. En Plan actual, seleccionar cualquiera de los cinco bloques para consultar su detalle. La selección sirve para explorar; el bloque 2 permanece identificado como el bloque activo del programa.
4. En Registrar, añadir sesiones que no procedan de MoonBoard.
5. Usar Exportar copia con regularidad para guardar en JSON los registros manuales del navegador.

## Funciones principales

- Calendario mensual del plan con sesiones reales y programadas.
- Detalle de cada dosis, continuidad en semanas 2 y 4 y descarga en la quinta.
- Registro de resultados enlazado a cada sesión del calendario.
- Historial unificado con filtros por disciplina y fecha.
- Resultados por ángulo y criterios de progresión basados en datos.


- Resumen de volumen, tasa de encadenamiento y distribución por ángulo.
- Diagnóstico de la última sesión importada.
- Hoja de ruta interactiva de cinco bloques, con criterios de entrada y salida.
- Historial detallado de sesiones.
- Buscador y filtros sobre las 278 entradas de problemas registradas.
- Registro manual de roca, Tindeq y otras sesiones.
- Exportación e importación de copias de seguridad.
- Diseño adaptable a ordenador y móvil, navegación por teclado y estados accesibles.

## Estructura de archivos

| Archivo o carpeta | Función | Edición |
| --- | --- | --- |
| `index.html` | Estructura, contenido y accesibilidad del panel. | Manual |
| `styles.css` | Sistema visual y comportamiento adaptable. | Manual |
| `app.js` | Navegación, selector de bloques, gráficos, filtros, formularios y copias. | Manual |
| `assets/data.js` | Datos empaquetados para que el panel funcione al abrirse como archivo local. | Generado |
| `assets/rock-data.js` | Ascensiones de cuerda y estado del test, empaquetados para el panel. | Generado |
| `data/ascents.json` | Ascensiones de cuerda verificadas y estado del test de fuerza. | Fuente principal |
| `data/plan.json` | Programación del bloque existente, dosis y fechas. | Fuente principal |
| `build-calendar.mjs` | Genera el calendario ICS desde la programación. | Manual |
| `assets/plan-data.js` | Plan empaquetado para el navegador. | Generado |
| `build-data.mjs` | Regenera los datos empaquetados y el CSV desde las fuentes JSON. | Manual |
| `data/sessions.json` | Fuente estructurada del histórico importado. | Fuente principal |
| `data/boulders_moonboard.csv` | Exportación tabular de todos los problemas. | Generado |
| `moonboard_entrenamientos.xlsx` | Informe y análisis complementario en Excel. | Entregable |
| `PLAN_ENTRENAMIENTO.md` | Plan maestro y criterios de progresión. | Generado desde el JSON |
| `DICCIONARIO_DATOS.md` | Definición de campos, unidades y reglas de interpretación. | Manual |
| `CHANGELOG.md` | Historial de versiones y cambios relevantes. | Manual |

## Persistencia y copias

Los datos importados de MoonBoard forman parte de los archivos del proyecto. Las sesiones añadidas desde Registrar se guardan en `localStorage`, dentro del navegador y del equipo desde el que se utiliza el panel. Borrar los datos del navegador puede eliminarlas.

El botón Exportar copia genera un archivo JSON con:

- fecha de exportación;
- histórico importado de MoonBoard;
- sesiones manuales guardadas en ese navegador.

El botón Importar copia restaura únicamente las sesiones manuales. No modifica los archivos fuente de MoonBoard.

## Actualización de MoonBoard

1. Incorporar las nuevas sesiones a la fuente `data/sessions.json`, conservando las anteriores.
2. Ejecutar `node build-data.mjs` desde la carpeta de desarrollo.
3. Comprobar que `assets/data.js`, `data/sessions.json` y `data/boulders_moonboard.csv` se han regenerado.
4. Validar que el número de sesiones, problemas e intentos coincide con la fuente.
5. Si cambian fechas o dosis, ejecutar `node build-calendar.mjs` para regenerar el ICS.
6. Copiar la versión validada a la carpeta personal de entrega.

`assets/data.js` y el CSV no deben editarse a mano: se regeneran desde el JSON para evitar divergencias.

Las ascensiones de cuerda se actualizan en `data/ascents.json`. El mismo comando regenera `assets/rock-data.js`. Se conserva la fecha del registro de 8a.nu cuando difiere de un recuerdo aproximado. Los intentos desconocidos quedan como `null`.

## Publicación

La aplicación está en [GitHub Pages](https://juanfranj.github.io/entrenamiento/escalada/) y su código en el [repositorio entrenamiento](https://github.com/juanfranj/entrenamiento). Los cambios subidos a `main` se publican automáticamente.

Los registros manuales del navegador siguen siendo locales: para trasladarlos del panel abierto como archivo a la web, exporta una copia en el panel anterior e impórtala en el nuevo.

## Criterios de calidad

Antes de cada entrega se comprueba:

- sintaxis de JavaScript;
- existencia de todos los recursos locales;
- correspondencia entre los cinco selectores y sus cinco paneles;
- coherencia de cifras entre JSON, CSV y panel;
- funcionamiento sin red al abrir `index.html`;
- adaptación de la interfaz a escritorio y móvil.

## Alcance y seguridad

El plan organiza la carga y facilita el seguimiento, pero no sustituye la valoración de un entrenador o profesional sanitario. Ante dolor focal, pérdida persistente de fuerza, inflamación o sospecha de lesión, reduce la carga y solicita una evaluación cualificada.

## Criterios de lectura

El porcentaje de encadenamiento incluye entradas del Logbook y puede incluir repeticiones. No equivale a problemas únicos ni a una medida de fuerza. Los resultados en cuerda y MoonBoard usan escalas diferentes y se muestran por separado. RPE, dolor, duración y calidad de continuidad quedan sin dato cuando no se han registrado.

Los resultados enlazados al calendario se guardan en la misma clave local del diario. Importar una copia combina registros por identificador y no borra los ya existentes. El calendario no se marca realizado automáticamente al pasar la fecha.

## Uso diario y Google Calendar

El calendario de Google «entrenemiento» contiene solo las sesiones; no contiene eventos que abarquen los periodos de los bloques. La cronología completa de los cinco bloques aparece únicamente en la web. Las sesiones son de día completo, con dosis, descansos y enlaces al día correspondiente del cuaderno. El calendario personal no debe figurar como invitado.

Antes de entrenar, abre la fecha en Calendario y consulta la sesión. Al terminar, pulsa Registrar resultado y guarda lo que has hecho, con las sensaciones que conozcas. Consulta Sesiones para el historial y Resultados para revisar la evolución por ángulo.

Google Calendar contiene una copia de la programación. No hay sincronización automática en ninguna dirección: mover un evento allí no modifica el plan de la web, y registrar un resultado en la web no modifica el evento de Google. Para cambiar el plan en ambos sitios, pide la actualización conjunta. MoonBoard y 8a.nu tampoco se importan automáticamente.

El diario personal se guarda en cada navegador. Usa Exportar copia como respaldo e Importar copia para llevarlo a otro dispositivo; no hay sincronización del diario entre móvil y ordenador.

El calendario muestra por separado el bloque actual del plan y el bloque al que pertenece el día seleccionado. El fondo completo de cada casilla identifica el bloque, incluidos los días de recuperación; la descarga lleva rayado y la semana seleccionada queda destacada. «Ver bloque» abre la fase correspondiente del plan. En móvil, tocar una fecha muestra su detalle debajo del calendario.

Los periodos están definidos en `data/plan.json`, campo `blocks`. El recorrido empieza con la primera sesión MoonBoard del 17/08/2026. El bloque 1 llega al 17/09; el bloque 2 se reconstruye desde el 18/09 y ahora incluye la descarga del 19 al 25/10. La cuarta semana se extiende hasta el 18/10. Los bloques 3–5 se calendarizan como previsión ajustable de cuatro semanas cada uno. `block` mantiene el bloque actual de forma explícita: no cambia automáticamente al pasar las fechas.

Cada bloque contiene sus propias dosis A/B/C y semanas. El histórico hasta la revisión se conserva como actividad real; las sesiones prescritas se programan desde la revisión, sin inventar entrenamientos pasados. `review.assessment` guarda la revisión fechada del bloque 2. Al revisar nuevos resultados, se actualizan el bloque actual, las fechas, las sesiones y su copia en Google Calendar, conservando los registros reales.

El archivo ICS contiene solo sesiones. Los identificadores de eventos de Google se conservan fuera de la carpeta publicada para actualizar los existentes sin crear duplicados. Al crear sesiones con el conector en el calendario secundario, usar `self_attendance: "omit"`, sin invitados, y verificar que no aparezcan en el principal. `attendees: []` por sí solo puede añadir la cuenta personal como asistente.

## Revisión aplicada el 16/10/2026

Prescripciones canónicas en `data/plan.json`: fichas de la web, calendario y plan Markdown comparten las mismas dosis. Descarga del 19 al 25/10; la semana 4 reconstruida se extiende hasta el 18/10. B3 previsto del 26/10 al 22/11, B4 del 23/11 al 20/12 y B5 del 21/12 al 17/01. El bloque actual sigue siendo el 2. Las semanas tienen límites explícitos para que alargar una fase no desplace incorrectamente la descarga.

B2: A con techo de 12–16 intentos y B como EMOM 2×6. B3: A con techo de 8–12 y B inicial 3×2 enlazados. B4 sin requisito de grado de tabla; continuidad ajustada a la vía. B3 y B4 reservan su cuarta semana para menor carga y revisión. Acondicionamiento breve opcional, tras descarga y solo con ejercicios ya conocidos y tolerados.

`build-data.mjs` genera también `PLAN_ENTRENAMIENTO.md`. `build-calendar.mjs` genera ICS y puede exportar los payloads para actualizar los eventos existentes, conservando sus IDs aunque cambie el bloque asignado. El resultado manual continúa enlazado por ID.

Google Calendar verificado el 16/10: 41 sesiones de un día en «entrenemiento», 39 actualizadas conservando sus IDs, una añadida al final de la previsión y la sesión anterior del 15/10 conservada. Cero copias de entrenamiento localizadas en el calendario personal.
