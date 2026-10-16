# Evaluación y protocolos reproducibles

Estado: biblioteca inicial, 16/10/2026. **No se ha realizado todavía el test del deportista.** Este documento distingue protocolos publicados de adaptaciones prácticas. Antes de ejecutar una medición confirmar dolor, antecedentes, material y modelo real de sensor.

## Qué medir y para qué

| Pregunta | Medida | No concluye por sí sola |
| --- | --- | --- |
| ¿Cambió mi fuerza específica? | Tirón isométrico repetible, en misma regleta y postura | Grado de cuerda, calidad técnica o salud del tendón |
| ¿Puedo sostener/repetir esfuerzo? | Tarea de resistencia con ciclo y carga definidos | Fuerza máxima o fuerza crítica sin protocolo específico |
| ¿Mejoré en MoonBoard? | Cartera estable y problemas nuevos separados | Comparación directa de layouts o ángulos |
| ¿Mejoré para la vía objetivo? | Secciones, enlaces, reposos y pegues útiles en cuerda | Que cualquier cambio se deba al ejercicio más reciente |

## Antes del sensor

Confirmar marca/modelo/generación, capacidad y manual; estado de conectores/anclaje y dirección de carga; agarre y regleta (profundidad real, borde, material); postura y ángulos; unilateral/bilateral; apoyo de pies y correa; aplicación/firmware; unidades; frecuencia de registro si está disponible. El sensor no es equipo anticaídas ni se debe exceder su uso previsto. S28–S29.

Para comparar sesiones mantener condiciones semejantes: hora aproximada, descanso previo, escalada reciente, calentamiento, magnesio, piel y temperatura si influyen. Registrar cambios de montaje como **nueva versión de protocolo**; no mezclar series como si fueran equivalentes.

## P1. Referencia inicial de fuerza: propuesta práctica

**Tipo:** adaptación para seguimiento individual, no réplica validada de S13. Su error debe comprobarse en el propio montaje. S05 y S13 respaldan estandarizar pruebas estáticas, no esta dosis exacta.

1. Elegir una postura que se pueda repetir y una regleta tolerable próxima a 20 mm si está disponible. No estrenar una regleta diminuta ni forzar un agarre doloroso. Definir mano, postura y apoyo de pies antes de medir.
2. Familiarizar con el gesto y el feedback. Hacer calentamiento general y de dedos progresivo; algunas contracciones submáximas, descansando hasta estar preparado. Sin tirones explosivos para buscar un pico.
3. Si se tolera y procede un esfuerzo máximo: tres intentos de unos 5 s por mano, elevando progresivamente la fuerza hasta una contracción máxima controlada. Dejar al menos 2–3 min entre esfuerzos de la misma mano y más si no se recupera. **Duración, intentos y descanso son decisiones prácticas iniciales.**
4. Guardar cada curva. Métrica propuesta: mayor media móvil de 3 s de cada intento, con ventana completa dentro de la contracción, y media de los dos mejores intentos válidos como referencia de sesión. Si no se puede calcular esa media, elegir y registrar otra métrica desde el principio; no llamarla igual.
5. Rechazar intentos con deslizamiento, cambio de agarre/posición, holgura/tirón inicial o curva incompleta. Anotar motivo, no borrar silenciosamente el resultado. No multiplicar intentos fallidos buscando una cifra mejor.
6. Registrar molestias durante y después; detener si aparece dolor focal, empeora o cambia la técnica. No imponer un umbral de dolor como permiso automático para seguir.
7. Repetir otro día recuperado tras familiarizar para establecer variación y comparabilidad. Una única sesión da un punto de partida, no un porcentaje de mejora ni una fiabilidad individual.

La media de 3 s reduce dependencia del pico instantáneo, pero este procedimiento y un montaje con pies apoyados pueden diferir de los colgados de S13. No copiar su ICC o error como si se hubiera validado aquí. Si se necesita una réplica científica, seguir el apartado Methods completo del paper y sus instrumentos, no reconstruirlo de memoria.

## P2. Resistencia de dedos y fuerza crítica

Son pruebas diferentes. Para una prueba de resistencia definir fuerza/carga objetivo, tiempo de trabajo/pausa, agarre, postura, criterio de fallo y métrica (tiempo, repeticiones o integral). No mezclar una suspensión continua con contracciones intermitentes. S04, S08, S15.

El protocolo all-out de S15 requiere temporización, duración, finalización y cálculo originales. **No se deja aquí una receta parcial para ejecutarlo.** Antes de incorporarlo, recuperar método completo, verificar software/montaje y crear versión reproducible. Una media de los últimos segundos de un EMOM no es fuerza crítica. Una prueba fatigante no debe añadirse automáticamente al test máximo ni al entrenamiento del día.

**Actualización crítica:** S42 (2024) y S44 (2026) cuestionan que la CF derivada de un all-out represente la máxima intensidad sostenible. S44 encontró buena repetibilidad y un sesgo frente a fuerza constante. Por tanto, no fijar zonas de entrenamiento con ese número como frontera fisiológica exacta. Si se usa para seguimiento, nombrar método y cálculo y explicar que su validez para esa prescripción es limitada. La corrección vinculada a S42 trata nombres de autores y no cambia ese resultado.

## P3. RFD

No es objetivo inicial del primer test. Requiere definir frecuencia de muestreo y tiempos reales, filtrado, detección del inicio, pretensión, ventana y rechazo de artefactos. N/s y kgf/s deben quedar diferenciados. El buen acuerdo para fuerza estática no valida esas derivadas. S13 y S22.

Si no se puede verificar el procesamiento, guardar la curva y declarar RFD no evaluada. No interpretar el máximo de una derivada ruidosa como mejora de fuerza de contacto. S40 estudia entrenamiento y S41 la fiabilidad de distintas métricas de dedos; S45 mide tracción del tren superior. No son tests intercambiables. La RFD tampoco mide la velocidad con la que se cierran los dedos.

## P4. Cartera MoonBoard

Crear una selección pequeña disponible y registrar versión/layout, juegos de presas, ángulo, reglas, IDs/nombres y grado original. Mantener orden/calidad y descanso comparables cuando se use como evaluación. Separar calentamiento y trabajo principal.

Por problema: resultado, intentos de hoy, historial previo y contexto de familiaridad. No volver a etiquetar «flash» una repetición conocida; conservar el resultado literal de la app y, si hace falta, añadir interpretación separada. El estado de benchmark debe verificarse o quedar desconocido; no deducirlo por popularidad.

Informar n/N y qué representa N: entradas, problemas únicos, pruebas con tope de intentos o repeticiones. Conservar una muestra separada de nuevos problemas para observar aprendizaje. Si faltan presas, documentar el conjunto accesible y no castigar al deportista por no disponer del resto.

## P5. Continuidad y cuerda

Para EMOM/enlazados: anotar tiempo real por repetición, transición, descanso entre series, problemas, ángulo, completados y motivo de parada. Para cuerda: vía/sector, grado francés, longitud/movimientos aproximados, estilo, condiciones, intentos, sección alcanzada, reposos y limitante percibido. Los campos no conocidos quedan vacíos/null.

Comparar tareas parecidas y repetir antes de atribuir adaptación. Fatiga en la tercera ronda de una sesión no prueba pérdida crónica de fuerza. S19 y S34 aportan contexto sobre respuesta aguda, no validan un protocolo particular de enlaces.

## Unidades, cálculo y error

- `1 kgf = 9,80665 N`. Si una pantalla muestra «kg», verificar si representa kgf y conservar la etiqueta original.
- Fuerza relativa `%peso corporal = 100 × fuerza_N / (masa_kg × 9,80665)`. Registrar fecha de masa; no usar una inventada.
- En suspensión sin ayuda: fuerza total aproximada = (masa corporal + lastre) × g, suponiendo equilibrio estático y sin apoyos. Con ayuda se descuenta la fuerza de asistencia medida; no asumir reparto 50/50 entre manos.
- Cambio relativo = 100 × (nuevo − previo) / previo, solo con previo distinto de cero y protocolos comparables. Mostrar también unidades absolutas.
- `MDC95 = 1,96 × √2 × SEM` solo si el SEM y sus supuestos son aplicables al mismo procedimiento. Un ICC alto describe fiabilidad relativa entre personas, no el cambio mínimo del deportista.
- Sin error propio o transferible, describir el cambio con cautela y repetir. No fijar 5%/10% como umbral universal. La asimetría depende de fórmula y variabilidad: no diagnosticar lesión por una diferencia unilateral.

## Salida de una evaluación

Entregar protocolo y versión, fecha, resultados válidos y excluidos, calidad de medición, comparación posible, interpretación y próxima acción. Separar valor observado de hipótesis. No rellenar percentiles o equivalencias de grado sin una base apropiada y claramente identificada.
