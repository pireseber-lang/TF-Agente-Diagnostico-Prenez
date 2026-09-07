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
- **Estado:** Reemplazada por DEC-013

### Propuesta recomendada

Una PWA mobile-first en TypeScript, con service worker para el shell offline, IndexedDB detrás de una capa de persistencia, reglas determinísticas locales, generación XLSX en el navegador y un componente agéntico desacoplado del circuito crítico.

### Alternativas consideradas

1. Aplicación web empaquetada con Capacitor y acceso a persistencia/archivos nativos.
2. Aplicación Flutter dirigida a móvil y web.

### Resultado

La evaluación concluyó con la decisión arquitectónica final registrada en DEC-013. Las pruebas en dispositivos continúan siendo condiciones de validación de la implementación, no decisiones arquitectónicas abiertas.

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

## DEC-013 — Arquitectura tecnológica final de V1

- **Fecha:** 2026-09-06
- **Estado:** Aceptada para V1; implementación todavía no iniciada

### Contexto

La aplicación debe operar durante una jornada completa sin internet, persistir datos estructurados, validar y buscar localmente, exportar XLSX y ejecutarse principalmente en un celular Android. La operación de campo no puede depender de un LLM. Se priorizan simplicidad, confiabilidad offline, facilidad de desarrollo asistido con Codex y demostración en un dispositivo real.

### Alternativas consideradas

1. **PWA web estándar:** una única aplicación web instalable, con almacenamiento y procesamiento en el navegador.
2. **Webapp empaquetada con Capacitor:** acceso a capacidades nativas y posible SQLite, a costa de proyectos y compilaciones móviles adicionales.
3. **Flutter para móvil y web:** base de código multiplataforma, con mayor costo inicial y un ecosistema distinto al web estándar.

### Opción elegida

Construir V1 como una **PWA mobile-first en React y TypeScript**, compilada con **Vite** y publicada como archivos estáticos sobre HTTPS. La estrategia concreta es:

- `react` y `react-dom` para la interfaz;
- TypeScript en modo estricto;
- `vite-plugin-pwa`, apoyado en Workbox mediante `generateSW`, para generar manifiesto y service worker;
- actualización del service worker mediante aviso y confirmación, nunca con recarga automática durante una jornada abierta;
- precaché del shell completo de la aplicación y de todas las dependencias necesarias en campo;
- IndexedDB como fuente persistente local, accedida mediante la biblioteca mínima `idb` y una capa propia de repositorios y migraciones;
- hooks, `useReducer` y Context de React para estado efímero de interfaz, sin Redux ni otra biblioteca global;
- reglas determinísticas en funciones puras TypeScript, separadas de React y ejecutadas antes de persistir, después de editar y antes de cerrar;
- SheetJS Community Edition (`xlsx`) empaquetado en el bundle para generar el archivo completamente offline, sin CDN en tiempo de ejecución;
- Vitest para pruebas unitarias y Playwright para recorridos de integración, PWA e IndexedDB en Chromium;
- publicación inicial prevista en GitHub Pages, con `base`, alcance del service worker y rutas configurados para el subdirectorio del repositorio.

No se incorporarán en V1 Redux/Zustand, React Router, librerías de formularios, fechas, validación de esquemas ni frameworks CSS. Se usarán capacidades de React, TypeScript, CSS y APIs web mientras resulten suficientes.

### Separación de responsabilidades

**Núcleo determinístico offline:** interfaz de carga, normalización, persistencia, búsqueda, edición, eliminación, duplicados, validaciones estructurales, alertas por reglas, estadísticas, historial, evidencia de revisión, exportación XLSX y respaldo/restauración JSON. Todo se ejecuta en el dispositivo.

**Componente agéntico futuro:** módulo desacoplado que podrá recibir una vista estructurada y explícitamente autorizada de la jornada, consultar reglas como herramientas, explicar patrones o inconsistencias no triviales y preparar una lista de revisión. No escribirá directamente en IndexedDB, no modificará diagnósticos, no cerrará jornadas y su indisponibilidad no degradará el núcleo offline. Su contrato mínimo sigue pendiente.

### Preparación offline antes de la jornada

La aplicación no se considerará preparada solo por haber sido visitada. Incluirá un chequeo de preparación que verificará:

1. service worker activo y controlando la versión actual;
2. shell y recursos críticos precargados;
3. escritura, lectura y eliminación de un registro técnico temporal en IndexedDB;
4. disponibilidad de la generación XLSX en memoria;
5. estimación de cuota y resultado de la solicitud de almacenamiento persistente;
6. versión de aplicación verificada y momento del último chequeo exitoso.

Además, antes de la primera jornada en un dispositivo se realizará una prueba humana obligatoria: instalar desde Chrome, abrir una vez con conexión, obtener el indicador **Lista para trabajar offline**, activar modo avión, cerrar por completo la PWA, reabrirla desde el ícono y completar un ciclo técnico de escritura/lectura sin crear una jornada productiva.

### Respaldo y recuperación

- Solicitar almacenamiento persistente con `navigator.storage.persist()` y mostrar si fue concedido; no asumir que lo fue.
- Ofrecer un respaldo integral JSON versionado e importable con jornadas, animales, alertas, revisiones y metadatos necesarios.
- Recomendar y ofrecer la descarga del respaldo después de cerrar cada jornada; el archivo queda fuera del almacenamiento del navegador, por ejemplo en Descargas.
- Restaurar únicamente después de validar estructura y versión, mostrar un resumen y obtener confirmación explícita. V1 priorizará restauración total; no implementará una fusión compleja de bases.
- Mantener XLSX como reporte interoperable, pero no usarlo como único respaldo porque no contiene necesariamente todo el estado interno.

### Compatibilidad mínima elegida

- Android 10 o posterior.
- Google Chrome 111 o posterior como piso técnico del bundle; para uso de campo se recomendará Chrome actualizado y fuera de modo incógnito.
- Instalación desde un origen HTTPS y espacio local suficiente.
- Otros navegadores y sistemas operativos no quedan garantizados en V1.

### Motivos

- Es la alternativa que satisface directamente el requisito de webapp y evita una capa nativa prematura.
- React y TypeScript facilitan una interfaz de formularios mantenible y contratos claros entre dominio, persistencia y UI.
- `idb` conserva el modelo y las transacciones de IndexedDB con una capa pequeña basada en promesas.
- Un service worker generado reduce errores de precaché y versionado frente a una implementación manual.
- SheetJS puede producir XLSX desde datos en memoria y descargarlo en el navegador sin servidor.
- La separación del dominio permite probar las reglas sin navegador ni LLM.

### Riesgos aceptados

- La PWA necesita una carga e instalación inicial correctas antes de perder conectividad.
- IndexedDB y Cache Storage pertenecen al origen y pueden perderse si el usuario borra datos, desinstala o el navegador aplica evicción; la persistencia solicitada reduce, pero no elimina, el riesgo.
- La descarga de archivos y la instalación deben probarse en Chrome/Android reales.
- Una actualización defectuosa del service worker puede afectar el arranque offline; por eso se aplicará actualización confirmada, versionado y pruebas de reapertura.
- GitHub Pages sirve desde un subdirectorio y requiere configurar correctamente rutas, `base` y alcance del service worker.
- SheetJS debe quedar empaquetado y fijado en el lockfile; usarlo desde CDN en ejecución rompería la garantía offline.

### Pendiente de validar mediante implementación

- instalación y reapertura real en modo avión;
- concesión o denegación de almacenamiento persistente y manejo de cuota;
- migraciones y consistencia transaccional de IndexedDB;
- descarga de XLSX y JSON sin conexión;
- restauración desde un respaldo válido y rechazo de uno inválido;
- comportamiento de actualización del service worker con una jornada abierta;
- rendimiento de búsqueda y exportación con un volumen representativo;
- ejecución de las pruebas automatizadas y aceptación en al menos un celular objetivo.

Ninguno de estos puntos se presenta todavía como probado.

## Decisiones que continúan pendientes

- contrato mínimo, herramientas y límites del agente;
- definición formal de L0–L4 según la materia;
- longitudes máximas de los identificadores como decisión técnica menor de implementación.
