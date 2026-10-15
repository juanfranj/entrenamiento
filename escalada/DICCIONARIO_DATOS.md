# Diccionario de datos

## `ascents.json`

Fuente de las ascensiones recientes de cuerda, verificada en el perfil de 8a.nu. `date` es la fecha de ascensión registrada, `name` la vía, `grade` el grado de deportiva, `crag` la zona y `style` el estilo. `tries` es un número o `null` cuando no está disponible. `notes` recoge contexto sin inferir intentos ni mediciones.

`strength_test.status` indica `pending` mientras no se haya realizado el test con sensor. `updated_on` registra la fecha de confirmación del estado, no la fecha de un test realizado.

## `sessions.json`

La raíz contiene `sessions`, una lista de sesiones importadas del Logbook de MoonBoard.

### Campos de sesión

| Campo | Tipo | Significado |
| --- | --- | --- |
| `date` | fecha ISO | Día de la sesión en formato `AAAA-MM-DD`. |
| `problems_reported` | entero | Número de problemas que la aplicación declaró para esa sesión. |
| `completed_reported` | entero | Problemas completados declarados por la aplicación. |
| `tries_reported` | entero | Intentos totales declarados por la aplicación. |
| `problems` | lista | Detalle de los problemas realizados o intentados. |

### Campos de problema

| Campo | Tipo | Significado |
| --- | --- | --- |
| `order` | entero | Posición del problema dentro de la sesión. |
| `name` | texto | Nombre del problema en MoonBoard. |
| `setter` | texto | Autor del problema. |
| `angle` | entero | Inclinación utilizada, en grados. |
| `font_grade` | texto | Grado Fontainebleau mostrado por MoonBoard. |
| `v_grade` | texto | Equivalencia aproximada en escala V. |
| `result` | texto | Resultado registrado por la aplicación. |
| `completed` | booleano | `true` cuando el problema figura como completado. |
| `tries` | entero o nulo | Intentos asociados al registro cuando están disponibles. |
| `repeats` | entero o nulo | Repeticiones globales mostradas por MoonBoard, no repeticiones personales. |

## `boulders_moonboard.csv`

Contiene una fila por problema y replica los campos anteriores con nombres en español. `completado` utiliza `sí` o `no`. La primera fila es la cabecera y el archivo usa comas como separador.

## Sesiones manuales del navegador

Se guardan en la clave `proyecto8a-manual-sessions-v1` de `localStorage`.

| Campo | Significado |
| --- | --- |
| `id` | Identificador local creado con la fecha y hora del registro. |
| `date` | Fecha de la sesión. |
| `type` | Tipo de entrenamiento: roca, Tindeq u otra categoría seleccionada. |
| `duration` | Duración introducida por el usuario. |
| `maxGrade` | Grado máximo informado. |
| `rpe` | Esfuerzo percibido. |
| `pain` | Dolor percibido en escala 0–10. |
| `completed` | Número de problemas o vías completados. |
| `attempts` | Número total de intentos o pegues. |
| `notes` | Observaciones libres. |

## Reglas de interpretación

- Un problema completado cuenta una sola vez en las métricas aunque tenga varios intentos.
- El porcentaje completado describe una sesión, pero no corrige la dificultad ni el estilo de los problemas.
- Los ángulos de 25° y 40° se analizan por separado cuando se evalúa fuerza o volumen.
- Las equivalencias entre grados son orientativas; para progresar se usan tendencias de varias sesiones, no un único resultado.
