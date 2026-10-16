# Biblioteca del entrenador

Revisión inicial: **16 de octubre de 2026**. Investigación aplicada de escalada y acondicionamiento, con 45 fichas consultables. Es una revisión rápida con búsqueda dirigida, no una revisión sistemática ni una garantía de haber localizado todo lo publicado.

## Uso

- Abre [index.html](index.html): biblioteca sin dependencias externas, con búsqueda y filtros. Funciona como archivo local.
- El agente recibe las instrucciones de [AGENTS.md](../AGENTS.md) en la raíz; el HTML es una ayuda de consulta y no aumenta por sí mismo la calidad del razonamiento.
- Para decisiones usa [EVIDENCIA.md](EVIDENCIA.md), [MANUAL_ENTRENADOR.md](MANUAL_ENTRENADOR.md) y [PROTOCOLOS.md](PROTOCOLOS.md).
- [FUERZA_Y_METRICAS.md](FUERZA_Y_METRICAS.md) distingue fuerza máxima, RFD, fuerza crítica y sus límites de interpretación.
- [CONTEXTO_DEPORTISTA.md](CONTEXTO_DEPORTISTA.md) recoge la situación fechada y sus incertidumbres. No sustituye los datos del plan.
- [fuentes.json](fuentes.json) contiene fichas con diseño, acceso real, resultado, límites y aplicación. [FUENTES.md](FUENTES.md) permite leerlas sin navegador.
- [METODOLOGIA.md](METODOLOGIA.md) documenta búsquedas, selección y mantenimiento. [metadatos_doi.json](metadatos_doi.json) conserva metadatos bibliográficos recuperados de Crossref, no texto completo de artículos.
- [plantillas](plantillas/) contiene formularios vacíos para sesiones, sensor y revisión. No se han añadido mediciones ficticias.

## Límites de esta entrega

Se guardan síntesis originales y enlaces a los papers; no una colección de copias integrales de artículos. Hay fichas basadas en texto completo y otras únicamente en resumen o documentación oficial: cada una lo declara. La confianza es una valoración cualitativa aplicada, **no GRADE formal**.

La literatura directa sobre protocolos MoonBoard es más escasa que la de tests y suspensiones en esta búsqueda. No se ha encontrado una demostración de que una tabla, un porcentaje de encadenamiento o una rutina concreta garantice llegar a un grado de cuerda. Tampoco se establece una conversión universal de dureza por repeticiones globales.

Crear esta biblioteca no cambia el bloque actual ni reprograma la semana. Los ajustes se harán a partir de los resultados y de la revisión acordada con el deportista.

## Regenerar el visor

Desde la raíz: `python3 investigacion/construir_indice.py`. Genera `index.html` y `FUENTES.md` desde `fuentes.json`. No modifica el plan ni utiliza la red.
