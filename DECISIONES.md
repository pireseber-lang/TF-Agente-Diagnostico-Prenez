# Registro de decisiones

Este archivo documenta las decisiones relevantes del proyecto y sus motivos. Las decisiones podrán ampliarse o reemplazarse explícitamente a medida que avance el trabajo.

## DEC-001 — Enfoque inicial y límites de V1

- **Fecha:** 2026-09-06
- **Estado:** Aceptada para la especificación V1

### Contexto

La carga actual mediante una planilla Excel no está optimizada para el trabajo directo desde un celular durante una jornada en la manga. Además, la conectividad no puede darse por disponible y el diagnóstico pertenece al ámbito profesional del veterinario.

### Decisión

- Reemplazar la planilla Excel como interfaz de carga por una experiencia móvil directa.
- Priorizar el funcionamiento offline y el almacenamiento local durante la jornada.
- Mantener el diagnóstico veterinario bajo control humano: el agente podrá advertir, pero nunca modificar silenciosamente el diagnóstico informado.
- Limitar el alcance de V1 para que el producto sea construible y evaluable, excluyendo RFID, integraciones externas, sincronización en la nube y diagnóstico automático.

### Consecuencias

- La exportación a Excel se conserva como salida del proceso, no como mecanismo principal de carga.
- Las funciones esenciales de carga, validación, consulta, cierre e historial no podrán depender de internet.
- Toda alerta del agente deberá ser explicable y quedar sujeta a revisión humana.
- Las capacidades excluidas requerirán decisiones posteriores y no condicionarán la entrega inicial.

## DEC-002 — Obligatoriedad de los datos del animal

- **Fecha:** 2026-09-06
- **Estado:** Aceptada para V1

### Decisión

Para guardar por el flujo normal se exige al menos una identificación completa, diagnóstico, boqueo y condición corporal. Observaciones es opcional.

Si excepcionalmente un dato obligatorio no puede determinarse, la aplicación deberá representarlo mediante un estado explícito de revisión, separado de las categorías productivas. No se admitirán vacíos silenciosos ni se crearán nuevas categorías diagnósticas definitivas sin aprobación.

### Consecuencias

- La interfaz bloqueará el guardado normal si falta un dato obligatorio.
- El estado excepcional será temporal y deberá ser resuelto por una persona antes del cierre, por lo que no altera las categorías ni sus estadísticas.

## DEC-003 — Completitud y formato de identificaciones

- **Fecha:** 2026-09-06
- **Estado:** Aceptada para V1

### Decisión

- La identificación oficial requiere prefijo e ID individual, ambos alfanuméricos.
- La caravana de color requiere color y número.
- Se admite cualquiera de los dos esquemas completos o ambos completos.
- No se permiten identificaciones parciales.
- El número de caravana de color es estrictamente numérico.
- Los colores válidos son Verde, Rojo, Blanco, Violeta, Celeste, Naranja y Amarilla.
- Todos los identificadores admiten valores alfanuméricos, se convierten a mayúsculas y se almacenan sin espacios.
- Las longitudes máximas se definirán como una decisión técnica menor durante la implementación.

### Consecuencias

La validación de pares completos y del formato numérico será local y de bloqueo.

## DEC-004 — Tratamiento de duplicados actuales e históricos

- **Fecha:** 2026-09-06
- **Estado:** Aceptada para V1

### Decisión

Una identificación repetida dentro de la jornada genera una alerta fuerte e interrumpe el guardado automático hasta que una persona revise y corrija o confirme el caso. Una coincidencia con una jornada anterior se informa como antecedente y no bloquea, porque puede corresponder legítimamente al mismo animal en distintos años.

### Consecuencias

- La detección se ejecutará localmente tanto contra la jornada abierta como contra el historial disponible.
- La interfaz deberá distinguir claramente **duplicado en la jornada** de **antecedente histórico**.
- Si el usuario decide conservar un duplicado, se persistirá evidencia asociada a la alerta de que hubo revisión humana y de que la decisión explícita fue conservarlo. El esquema técnico se definirá durante la implementación.

## DEC-005 — Cierre de jornadas con alertas

- **Fecha:** 2026-09-06
- **Estado:** Aceptada para V1

### Decisión

Una jornada puede cerrarse con alertas solo después de una revisión humana explícita. Antes del cierre se mostrará la cantidad y el detalle de los registros afectados, se permitirá corregirlos y se exigirá una confirmación consciente si el usuario decide mantenerlos.

No se permite cerrar una jornada sin animales ni con datos obligatorios todavía pendientes de determinación.

### Consecuencias

El agente no resuelve alertas ni modifica valores por su cuenta. El cierre siempre permanece bajo control humano.

## DEC-006 — Fórmulas y presentación de porcentajes

- **Fecha:** 2026-09-06
- **Estado:** Aceptada para V1

### Decisión

- Porcentaje de preñez: preñadas totales dividido total de vacas, por 100.
- Porcentaje de vacías: vacías dividido total de vacas, por 100.
- Porcentaje de Cabeza, Cuerpo, Cola y Robo: cantidad de la categoría dividida total de vacas preñadas, por 100.
- Todos los porcentajes se muestran con un decimal.
- Si no hay vacas preñadas, los porcentajes Cabeza, Cuerpo, Cola y Robo se muestran como `0,0%`.

### Consecuencias

El denominador cero para las categorías de preñez queda resuelto mediante la presentación explícita de `0,0%`.

## DEC-007 — Núcleo offline y separación del componente agéntico

- **Fecha:** 2026-09-06
- **Estado:** Aceptada para V1

### Decisión

La creación de jornadas, carga, almacenamiento, edición, eliminación, búsqueda, validaciones determinísticas, detección de duplicados, estadísticas, cierre, historial y exportación funcionarán en el celular sin internet. Las reglas determinísticas se ejecutarán localmente y registrar un animal no dependerá de una llamada a un LLM.

El componente agéntico deberá tener un rol real y demostrable de análisis y señalamiento de problemas, pero estará separado del circuito crítico offline.

### Consecuencias

- La falta de conectividad no impedirá la operación básica.
- La arquitectura deberá definir una frontera explícita entre reglas locales, agente y cualquier servicio opcional futuro.
- La existencia y calidad del comportamiento agéntico deberán demostrarse con corridas reales, no presumirse desde la especificación.

## DEC-008 — Supervisión humana y posicionamiento preliminar L0–L4

- **Fecha:** 2026-09-06
- **Estado:** Aceptada para V1; clasificación L0–L4 provisional

### Decisión

El veterinario determina el diagnóstico; el usuario registra la información, revisa alertas y confirma el cierre; el sistema ejecuta validaciones; el agente puede analizar y señalar problemas; ningún diagnóstico puede cambiarse automáticamente; el resultado final queda bajo responsabilidad humana.

Hasta incorporar la rúbrica formal de la materia, el sistema solo se relaciona preliminarmente con L0–L4: la planilla manual es la referencia L0, las reglas determinísticas no prueban agencia por sí solas y el futuro componente agéntico aspira a una asistencia acotada L1–L2. No se atribuyen capacidades L3–L4.

### Consecuencias

La clasificación deberá revisarse contra la definición académica oficial y evidencia de corridas antes de presentarse como resultado.

## DEC-009 — Trazabilidad académica en GitHub

- **Fecha:** 2026-09-06
- **Estado:** Aceptada

### Decisión

El repositorio público [pireseber-lang/TF-Agente-Diagnostico-Prenez](https://github.com/pireseber-lang/TF-Agente-Diagnostico-Prenez) será la fuente de trazabilidad del trabajo académico.

### Consecuencias

Las decisiones, iteraciones y evidencias reales se documentarán de forma versionada. No se usarán corridas ficticias como evidencia.

## DEC-010 — Iteración empírica y un cambio por vez en los prompts

- **Fecha:** 2026-09-06
- **Estado:** Aceptada

### Decisión

Se conserva una V0 mínima de `system_prompt.md` y `user_prompt.md`. La calibración comenzará con una corrida real autorizada. Ante un error textual o conductual concreto se modificará una sola sección o regla, se repetirá la prueba y se documentará **antes → cambio → después**.

### Consecuencias

- No se anticiparán correcciones sin evidencia.
- Cada iteración deberá poder atribuirse a un cambio específico.
- En esta etapa los prompts no se amplían y no se generan corridas.

## DEC-011 — Evaluación arquitectónica preliminar

- **Fecha:** 2026-09-06
- **Estado:** Pendiente de aprobación; no implementar

### Propuesta recomendada

Una PWA mobile-first en TypeScript, con service worker para el shell offline, IndexedDB detrás de una capa de persistencia, reglas determinísticas locales, generación XLSX en el navegador y un componente agéntico desacoplado del circuito crítico.

### Alternativas consideradas

1. Aplicación web empaquetada con Capacitor y acceso a persistencia/archivos nativos.
2. Aplicación Flutter dirigida a móvil y web.

### Motivo para mantenerla pendiente

La PWA parece ofrecer el mejor equilibrio entre alcance, operación web, offline y complejidad, pero antes de aprobarla se requiere una prueba técnica en los celulares objetivo. Deben validarse persistencia, cuotas y evicción, reapertura sin red, exportación XLSX, compatibilidad y recuperación de datos. La comparación completa figura en la especificación funcional.

Continúan pendientes la definición tecnológica final detallada, las bibliotecas concretas de persistencia y XLSX y la compatibilidad mínima de navegadores y celulares.

## DEC-012 — Convenciones de fecha, exportación y retención local

- **Fecha:** 2026-09-06
- **Estado:** Aceptada para V1

### Decisión

- La fecha se presenta con formato `DD/MM/AAAA`.
- El archivo exportado se denomina `diagnostico_prenez_YYYY-MM-DD_lugar.xlsx`.
- La condición corporal se almacena y exporta como número decimal; la interfaz puede mostrar coma decimal.
- Las jornadas permanecen en el historial local hasta que el usuario las elimina manualmente.

### Consecuencias

La implementación deberá separar el formato visible de fecha del usado en el nombre de archivo, producir un valor numérico en Excel y ofrecer eliminación manual del historial con las salvaguardas definidas para eliminaciones.

## Decisiones que continúan pendientes

- definición tecnológica final detallada;
- contrato mínimo, herramientas y límites del agente;
- definición formal de L0–L4 según la materia;
- bibliotecas concretas de persistencia local y XLSX;
- compatibilidad mínima de navegadores y celulares;
- longitudes máximas de los identificadores como decisión técnica menor de implementación.
