# Contexto de Juanfran

Fotografía a **16/10/2026**, para personalización, no estado permanente. Leer datos más recientes y la conversación antes de prescribir. Se evita duplicar aquí información sanitaria identificable; cualquier historia clínica futura debe almacenarse en privado.

## Objetivo y medios

- Proyecto de entrenamiento orientado a progresar en escalada deportiva con cuerda; el panel se llama Proyecto 8a. Confirmar objetivo concreto y horizonte antes de un rediseño.
- MoonBoard disponible a 25° y 40°. El usuario comunica que faltan juegos de presas y que espera recibirlos en unos dos meses. Inventario/layout exacto por confirmar; no darlo por completo.
- Usuario dispone de sensor de fuerza para primer test; se habla de Tindeq, pero modelo y montaje aún por confirmar. **Sin mediciones registradas.**
- Edad, masa corporal, historial de lesiones y tolerancia a campus/suspensiones no constan como confirmados en esta revisión.

## Datos verificados y fuente

- Primera sesión MoonBoard: 17/08/2026.
- Histórico importado al 16/10: 17 sesiones, 278 entradas, 207 completadas, 381 intentos registrados. Fuente: `../escalada/data/sessions.json`. Son entradas, no problemas únicos.
- Sesión A confirmada por el usuario del 16/10: 17 entradas, 11 completadas, 26 intentos; seis entradas a 25° y once a 40°.
- A 40° ese día: 5/8 en 6C y BLUEFF 6C+ al primer intento. CODEX y QWB 1 se encadenan tras proyectos anteriores; otros son repeticiones. Un único 6C+ figura hoy en la app, aunque el usuario recordaba dos: no alterar el grado de los demás.
- Los cinco 6C con registro previo se completan; los tres sin registro previo quedan como proyectos. Registrado previamente no significa encadenado previamente. No es muestra equilibrada para una conclusión general de fuerza.
- Cuerda verificada anteriormente: Námaste 7c, Archidona, 14/10/2026; Moya Boom 7b+, Mijas, segundo intento, 23/09/2026. Fuente: `../escalada/data/ascents.json`.

## Relato y acuerdos de trabajo

- El usuario repite varios benchmarks conocidos de 6C/6C+ con facilidad y encuentra otros muy difíciles incluso al inicio. Popularidad y familiaridad no deben confundirse con una clasificación objetiva de dureza.
- B de resistencia: describe EMOM de 10 problemas a 25°, 10 a 40° y unos 5 en la tercera ronda a 25°, con 5 min entre rondas. Trabajo aproximado 30–40 s y pausa 20–30 s por minuto; lo comunicado no es un registro instrumental.
- Ajuste ya incorporado al plan: dos series de seis conocidos a 25°, 5 min entre series y evaluar calidad. EMOM solo en B de carga, no al terminar A; retirarlo durante descarga.
- B3 previsto: dos enlazados × tres series con 5–6 min entre series; progresar después a tres si hay técnica y tolerancia. A con máximo de 8–12 intentos. La entrada sigue pendiente de revisión, no se activa por este archivo.
- Acuerdo aplicado tras autorización: seguir en bloque 2, descargar del 19 al 25/10 y hacer primera evaluación con sensor solo una vez concretado el protocolo, en sustitución del trabajo A. No añadir campus ni suspensiones por sistema mientras se establece la referencia.

## Cronología y discrepancias conocidas

El usuario autorizó aplicar la propuesta después de leer la evaluación. La versión 3 de `../escalada/data/plan.json` mantiene B2 del 18/09 al 25/10, con semana 4 reconstruida extendida hasta el 18/10 y descarga del 19 al 25/10. B3 previsto del 26/10 al 22/11; B4 del 23/11 al 20/12; B5 del 21/12 al 17/01. El bloque actual se mantiene explícitamente en 2. Se han retirado los requisitos obligatorios de porcentaje/grado de las prescripciones futuras y unificado fichas, calendario y plan Markdown desde el JSON. B3/B4 incluyen una cuarta semana de menor carga y revisión; se puede ajustar tras observar respuesta.

## Persistencia y calendarios

Google Calendar «entrenemiento» contiene 41 sesiones de un día, verificado tras la actualización autorizada del 16/10: 39 actualizadas conservando sus IDs, una añadida al final y una pasada conservada. Cero copias localizadas en el personal. Periodos de bloques únicamente en la web. Las sesiones manuales de la aplicación son locales al navegador. No existe sincronización automática con MoonBoard, Google Calendar o 8a.nu.

## Primera decisión pendiente

Comprobar continuidad con dosis registrada y calidad; familiarizar y medir fuerza de forma repetible; revisar recuperación y objetivos antes de mantener/extender B2 o pasar a B3. El resultado del primer test no demuestra mejora porque no hay medición anterior.

## Evaluación posterior a la biblioteca

El usuario pidió una opinión del entrenador sobre el plan existente. La [revisión inicial del 16/10/2026](revisiones/2026-10-16-plan.md) propuso conservar la estructura y ajustar dosis/criterios. Después autorizó expresamente aplicarlo a planificación, web y calendario. Ver [registro de aplicación](revisiones/2026-10-16-aplicacion.md). La evaluación inicial se conserva como documento histórico; el estado vigente está en el JSON.
