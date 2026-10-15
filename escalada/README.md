# Proyecto 8a

Panel local de seguimiento del entrenamiento de escalada de Juanfran. Integra el histórico de MoonBoard, el plan de cinco bloques orientado a escalada deportiva con cuerda y un registro manual para roca, Tindeq u otras sesiones.

## Estado del proyecto

- Versión: 1.1.0.
- Bloque terminado: 1 — Base.
- Bloque actual: 2 — Fuerza.
- Datos importados: 9 sesiones, 141 problemas y 191 intentos registrados.
- Funcionamiento: aplicación web estática y local; no necesita instalación ni conexión a internet.

## Uso

1. Abrir `index.html` en un navegador moderno.
2. Usar la barra superior para cambiar entre Resumen, Plan actual, Sesiones, Boulders y Registrar.
3. En Plan actual, seleccionar cualquiera de los cinco bloques para consultar su detalle. La selección sirve para explorar; el bloque 2 permanece identificado como el bloque activo del programa.
4. En Registrar, añadir sesiones que no procedan de MoonBoard.
5. Usar Exportar copia con regularidad para guardar en JSON los registros manuales del navegador.

## Funciones principales

- Resumen de volumen, tasa de encadenamiento y distribución por ángulo.
- Diagnóstico de la última sesión importada.
- Hoja de ruta interactiva de cinco bloques, con criterios de entrada y salida.
- Historial detallado de sesiones.
- Buscador y filtros sobre los 141 problemas registrados.
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
| `data/sessions.json` | Fuente estructurada del histórico importado. | Fuente principal |
| `data/boulders_moonboard.csv` | Exportación tabular de todos los problemas. | Generado |
| `moonboard_entrenamientos.xlsx` | Informe y análisis complementario en Excel. | Entregable |
| `PLAN_ENTRENAMIENTO.md` | Plan maestro y criterios de progresión. | Manual |
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
5. Copiar la versión validada a la carpeta personal de entrega.

`assets/data.js` y el CSV no deben editarse a mano: se regeneran desde el JSON para evitar divergencias.

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

