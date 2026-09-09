# Diagnóstico de preñez en manga

Trabajo final individual de la materia **Programación de y con Agentes de IA** del MBA UCEMA.

## Problema real

Durante una jornada de diagnóstico de preñez bovina, los datos se registran en una planilla Excel. Ese mecanismo dificulta la carga directa y ágil desde la manga, especialmente cuando la conectividad es limitada o inexistente, y deja para más tarde tareas de control, consolidación y resumen.

## Objetivo

Construir una aplicación web móvil, con funcionamiento offline, que permita registrar cada animal durante la jornada, conservar los datos localmente, detectar casos que requieran revisión humana, resumir los resultados y exportar una planilla Excel al finalizar.

El sistema será agéntico en sus tareas de análisis y asistencia, pero no diagnosticará preñez ni reemplazará el criterio profesional del veterinario. La captura, persistencia y validación determinística funcionarán localmente y no dependerán de una llamada a un LLM.

## Usuario principal

La persona que carga los datos desde un celular mientras se realiza el diagnóstico de preñez en la manga, bajo la supervisión del veterinario responsable del diagnóstico.

## Flujo general

1. Iniciar una jornada indicando fecha y lugar.
2. Cargar, para cada animal, al menos una identificación completa, diagnóstico, boqueo y condición corporal; las observaciones son opcionales.
3. Guardar el registro y limpiar el formulario para continuar con el siguiente animal.
4. Consultar el contador, buscar registros y corregirlos o eliminarlos mientras la jornada esté abierta.
5. Revisar las alertas generadas por el agente sin que este modifique silenciosamente información veterinaria.
6. Confirmar el cierre de la jornada y consultar el resumen.
7. Exportar un archivo `.xlsx` con una fila por animal.
8. Consultar y volver a exportar jornadas cerradas desde el historial local.

## Alcance V1

La primera versión incluye:

- inicio, carga, revisión y cierre de jornadas;
- identificación oficial y/o por caravana de color;
- captura del diagnóstico informado por el veterinario;
- boqueo, condición corporal y observaciones;
- validaciones, alertas y revisión humana;
- resumen de resultados;
- exportación a Excel;
- historial local de jornadas;
- operación offline desde celular.

Las reglas determinísticas, la detección de duplicados, el cálculo de estadísticas, el cierre, el historial y la exportación también forman parte de la operación offline. La arquitectura tecnológica V1 está definida como una PWA mobile-first en React y TypeScript, con IndexedDB y exportación XLSX local; su implementación se realiza en incrementos verificables.

Quedan fuera de V1:

- lectura RFID;
- integración con bases externas;
- sincronización en la nube;
- diagnóstico automático de preñez;
- reemplazo del criterio veterinario.

## Documentación

- [Especificación funcional V1](docs/especificacion_funcional_v1.md)
- [Registro de decisiones](DECISIONES.md)
- `prompts/`: prompts mínimos versionados del agente académico.
- `corridas/`: entradas, salidas y metadatos de las corridas reales del agente.

## Trazabilidad académica

El repositorio público es [pireseber-lang/TF-Agente-Diagnostico-Prenez](https://github.com/pireseber-lang/TF-Agente-Diagnostico-Prenez). Las decisiones, iteraciones del agente y evidencias reales se documentarán en GitHub como parte del trabajo académico. No se presentarán corridas ficticias como evidencia.

### Agente académico — Corrida 1

La primera corrida estableció una línea de base deliberadamente mínima. El agente revisó una jornada finalizada, resumió resultados, generó alertas y señaló animales para revisión humana. Su herramienta real fue la lectura de un archivo JSON estructurado; no modificó IndexedDB ni ningún registro de la aplicación.

La corrida utilizó `gpt-5.6-luna` con esfuerzo de razonamiento `low` sobre 10 registros reales extraídos de IndexedDB. La entrada está en `corridas/corrida_1/entrada.json`, la respuesta exacta en `corridas/corrida_1/salida.json` y los parámetros, tokens, prompts y datos de reproducción en `corridas/corrida_1/metadata.md`.

El modelo produjo JSON válido y calculó correctamente 8 preñadas y 2 vacías. La evaluación detectó como falla principal que afirmó una coincidencia oficial entre `AI892-B258` y `AI892-B251`, aunque sus identificaciones individuales actuales son diferentes. Para Corrida 2 se aplicó una única modificación: indicar que un duplicado oficial requiere igualdad simultánea del prefijo y del identificador individual actuales, y que `duplicateReviews` no prueba por sí solo una coincidencia vigente.

El agente analiza y una persona revisa. Ninguna salida modifica registros ni constituye una decisión automática de descarte. La decisión final permanece bajo supervisión humana. Pendiente de asignar nivel L0–L4 según definición exacta del curso.

### Agente académico — Corrida 2

Corrida 2 utilizó la misma entrada de 10 animales, el mismo modelo `gpt-5.6-luna`, razonamiento `low` y los mismos parámetros disponibles. El único cambio fue agregar al system prompt que un duplicado oficial requiere coincidencia simultánea del prefijo y del identificador individual actuales, y que `duplicateReviews` no demuestra por sí solo una coincidencia vigente.

La salida dejó de afirmar que `AI892-B258` y `AI892-B251` fueran duplicados, por lo que la falla objetivo quedó corregida. Como única falla seleccionada para Corrida 3, el modelo afirmó que había **4 animales sin identificación oficial**, aunque los datos contienen cinco y la propia salida enumera esos cinco. La salida exacta y los datos de reproducción están en `corridas/corrida_2/`.

### Agente académico — Corrida 3

Corrida 3 utilizó nuevamente los mismos 10 registros, el mismo modelo `gpt-5.6-luna`, razonamiento `low`, el mismo user prompt y el mismo esquema. Las tres entradas son idénticas byte a byte y comparten el SHA-256 `FD9B972D5B3E2D99E4A3B22A4EC6DF48DE10B6E91C09B810F45E9A216BFF1DEE`. El único cambio respecto de Corrida 2 fue una regla que exige comprobar la consistencia de los conteos contra la entrada y el detalle generado.

La falla objetivo quedó corregida: la alerta informa **5 animales sin identificación oficial** y `animales_a_revisar` contiene exactamente `Celeste-1523`, `Celeste-45`, `Celeste-545`, `Celeste-753` y `Celeste-900` para ese criterio. La salida exacta, sin correcciones manuales, y los parámetros de reproducción están en `corridas/corrida_3/`.

La corrida dejó una limitación residual que se conserva como evidencia: afirmó que había **6 animales con condición corporal menor o igual a 2,25**, aunque la entrada contiene 7 (`AI892-B356`, `AI892-B132`, `AI892-B251`, `AI892-A123`, `Celeste-45`, `Celeste-545` y `Celeste-900`). No se corrigió la salida ni se ejecutará una Corrida 4. El caso demuestra por qué la revisión humana sigue siendo obligatoria.

Las tres corridas fueron ejecuciones reales, controladas y de una sola inferencia por iteración. Cada salida permanece bajo supervisión humana y no modifica IndexedDB ni decide descartes. La comparación completa y sus límites están documentados en `DECISIONES.md`.

## Componente agéntico y criterio de diseño

El diagnóstico proviene del veterinario que trabaja en la manga; el agente no lo infiere. Su función se limita a revisar una jornada finalizada: lee el JSON estructurado, resume resultados, genera alertas, identifica casos para revisión y redacta una conclusión de apoyo.

Se eligió la lectura de archivos JSON como herramienta real porque resuelve la tarea experimental con una interfaz pequeña y auditable. Mantiene al modelo separado de IndexedDB y del circuito offline, evita permisos de escritura innecesarios y permite preservar entrada, salida y hash sin incorporar servicios o automatizaciones que ampliarían el riesgo y el alcance.

`gpt-5.6-luna` se utilizó por ser compatible con el entorno Codex/ChatGPT empleado y suficiente para esta revisión estructurada y acotada. No se afirma que sea el modelo más barato, porque no se incorporó evidencia oficial de precios al experimento.

## Estructura relevante del repositorio

- `src/`: aplicación React/TypeScript, reglas determinísticas e infraestructura IndexedDB.
- `tests/`: pruebas unitarias y de integración de la aplicación.
- `prompts/system_prompt.md`: versión final del system prompt, correspondiente a Corrida 3.
- `prompts/user_prompt.md`: solicitud y esquema de salida, sin cambios entre corridas.
- `corridas/corrida_1/`, `corrida_2/` y `corrida_3/`: entrada, salida exacta y metadatos de cada ejecución.
- `DECISIONES.md`: decisiones de producto, arquitectura, iteración y cierre académico.
- `docs/especificacion_funcional_v1.md`: especificación funcional y límites de V1.

## Reproducibilidad de las corridas

Para reconstruir una corrida:

1. usar el archivo `entrada.json` de la corrida seleccionada;
2. recuperar de su `metadata.md` el system prompt exacto utilizado;
3. usar `prompts/user_prompt.md`, que se mantuvo sin cambios;
4. seleccionar `gpt-5.6-luna` con razonamiento `low`;
5. permitir que el agente lea el JSON mediante la herramienta de lectura de archivos, en modo de solo lectura;
6. conservar literalmente la respuesta obtenida, incluso si contiene errores;
7. validar si es JSON y compararla con `salida.json`;
8. contrastar entrada y parámetros con los hashes, fechas y tokens registrados en `metadata.md`.

Las tres entradas son idénticas byte a byte y tienen SHA-256 `FD9B972D5B3E2D99E4A3B22A4EC6DF48DE10B6E91C09B810F45E9A216BFF1DEE`. El repositorio no conserva tres archivos independientes del system prompt: `prompts/system_prompt.md` contiene la versión final de Corrida 3. Las versiones exactas utilizadas en Corridas 1 y 2 están reproducidas dentro de `corridas/corrida_1/metadata.md` y `corridas/corrida_2/metadata.md`. Cada metadata también conserva el mensaje exacto del ejecutor, porque el user prompt contiene una referencia histórica a `corrida_1/entrada.json` que el ejecutor reemplazó explícitamente por la entrada correspondiente en cada corrida.

Una nueva ejecución puede variar aunque conserve entrada, prompt, modelo y parámetros. La reproducción permite reconstruir las condiciones y comparar resultados; no promete una respuesta textual idéntica.

## Análisis económico

`codex exec` informó consumo de tokens, pero no informó costo monetario. Por eso no se asignan precios, no se estima una factura y no se presentan valores monetarios ficticios.

| Corrida | Entrada total | Entrada en caché | Entrada no cacheada | Salida | Razonamiento incluido en salida |
| --- | ---: | ---: | ---: | ---: | ---: |
| 1 | 30.694 | 23.040 | 7.654 | 817 | 205 |
| 2 | 30.793 | 23.040 | 7.753 | 911 | 243 |
| 3 | 30.904 | 23.040 | 7.864 | 952 | 349 |
| **Promedio aproximado** | **30.797** | **23.040** | **7.757** | **893** | **266** |

En conjunto, aproximadamente el 74,8 % de los tokens de entrada fueron recuperados desde caché. Esto debe distinguirse del consumo no cacheado al aplicar una tarifa, pero no permite calcular dinero sin los precios oficiales aplicables al modelo y al canal de ejecución.

Cuando esos precios estén disponibles, la fórmula general por corrida será:

```text
costo por corrida =
  (tokens de entrada no cacheados / 1.000.000 × precio input)
  + (tokens de entrada cacheados / 1.000.000 × precio cached input)
  + (tokens de salida / 1.000.000 × precio output)
```

Para una estimación operativa con una corrida por jornada:

```text
costo semanal = costo por corrida × cantidad de jornadas semanales
costo anual = costo semanal × 52
```

Si una jornada requiriera varias corridas, primero se sumaría su costo y luego se aplicaría la cantidad de jornadas. Los tokens de razonamiento ya están incluidos en la salida informada y no deben sumarse otra vez salvo que la tarifa oficial indique un tratamiento diferente.

## Gobernanza, riesgos y autoridad

### Lo que el agente puede hacer

- leer una jornada estructurada;
- resumir resultados;
- generar alertas;
- señalar animales para revisión;
- producir una conclusión de apoyo.

### Lo que el agente no puede hacer

- diagnosticar preñez;
- modificar registros o cambiar diagnósticos;
- eliminar animales;
- decidir descartes;
- enviar órdenes operativas;
- ejecutar acciones sobre el rodeo.

### Riesgos observados empíricamente

- interpretar datos históricos como `duplicateReviews` como si demostraran una coincidencia vigente;
- producir inconsistencias cuantitativas, observadas en los conteos 4 vs 5 y 6 vs 7;
- generar alertas a partir de criterios que el prompt no definió suficientemente;
- presentar una inferencia con redacción que puede parecer una afirmación comprobada.

### Controles

- entrada y salida estructuradas;
- herramienta de lectura con permisos de solo lectura;
- conservación literal de entradas y salidas;
- tres corridas reales reconstruibles, sin corrección manual;
- un solo cambio de prompt entre iteraciones;
- trazabilidad mediante fechas, modelo, parámetros, tokens y SHA-256;
- separación respecto de IndexedDB y ausencia de acciones automáticas;
- supervisión humana obligatoria.

La salida es una ayuda, no una firma profesional. La decisión productiva final corresponde al responsable humano del rodeo y, cuando corresponda, al profesional veterinario o agronómico responsable. El agente no recibe autoridad profesional.

## Nivel de supervisión L0–L4

El repositorio no contiene la definición formal de L0, L1, L2, L3 y L4 utilizada por la materia. La especificación solo conserva una referencia preliminar y advierte que debe contrastarse con la rúbrica oficial. Por lo tanto, no se asigna un nivel ni se convierte esa referencia en una conclusión.

**Pendiente de asignar nivel L0–L4 según definición exacta del curso.**

## Checklist académico

| Requisito | Estado y evidencia |
| --- | --- |
| Sistema completo | **Parcial respecto del alcance V1 declarado.** El núcleo de carga, persistencia, consulta, duplicados, cierre, resumen e historial está implementado; siguen pendientes XLSX, respaldo JSON, validación offline física e integración del agente en la aplicación. |
| System prompt | **Cumplido.** Versión final en `prompts/system_prompt.md`; versiones anteriores exactas en los metadatos. |
| User prompt | **Cumplido.** `prompts/user_prompt.md`, sin cambios entre corridas. |
| Herramienta real | **Cumplido.** Lectura del archivo JSON estructurado documentada en cada metadata. |
| Salida estructurada | **Cumplido.** Las tres respuestas preservadas son JSON válido con el esquema solicitado. |
| Supervisión | **Cumplido.** Revisión humana obligatoria y ausencia de autoridad automática. |
| Tres corridas reales | **Cumplido.** Entrada, salida y metadata en `corridas/corrida_1/` a `corrida_3/`. |
| Entrada, salida y fecha reconstruibles | **Cumplido.** Archivos, timestamps, prompts, parámetros y hashes registrados. |
| README, `prompts/`, `corridas/` y `DECISIONES.md` | **Cumplido.** Estructura presente y documentada. |
| Iteraciones y fallas textuales | **Cumplido.** Secuencia Corrida 1 → Cambio 1 → Corrida 2 → Cambio 2 → Corrida 3 y limitación residual. |
| Cambios de alcance | **Cumplido.** Alcance V1, exclusiones, incrementos y pendientes registrados. |
| Tokens y análisis económico | **Cumplido.** Consumo real, promedios, caché y fórmulas sin inventar precios. |
| Modelo elegido | **Cumplido.** `gpt-5.6-luna`, razonamiento `low`, con justificación acotada. |
| Gobernanza, riesgos y permisos | **Cumplido.** Capacidades, prohibiciones, riesgos, controles y solo lectura documentados. |
| Responsable humano final | **Cumplido.** Responsable del rodeo y profesional veterinario/agronómico cuando corresponda. |
| Nivel L0–L4 | **Pendiente.** Falta la definición formal de la materia; no se asigna un nivel. |

## Estado actual

**Los incrementos de carga, persistencia, consulta, navegación, control de posibles duplicados, caravana con número opcional, cierre, resumen estadístico, creación de una nueva jornada independiente e historial están implementados y validados manualmente en pruebas controladas.**

### Implementado

- base React, Vite y TypeScript estricto;
- manifiesto PWA y service worker generado con `vite-plugin-pwa`;
- creación de una jornada con fecha y uno de los tres lugares válidos;
- persistencia de la jornada y sus animales en IndexedDB mediante `idb`;
- formulario mobile-first con identificaciones, diagnóstico, boqueo, condición corporal y observaciones;
- identificación por caravana válida con color solo o con color y número opcional;
- validaciones determinísticas de obligatoriedad, completitud y formato;
- normalización de identificadores a mayúsculas y sin espacios;
- limpieza del formulario después de guardar;
- contador y lista inmediata de animales;
- recuperación de la jornada y la lista después de una recarga completa;
- búsqueda local por identificación oficial, caravana o sus combinaciones, sin distinguir mayúsculas, minúsculas ni espacios;
- edición con precarga de datos, las mismas validaciones del alta y conservación del ID interno;
- cancelación de edición sin modificar el registro;
- eliminación con confirmación humana que identifica el animal;
- actualización inmediata del contador y el listado después de editar o eliminar;
- persistencia en IndexedDB de las ediciones y eliminaciones;
- pantalla de carga enfocada en el contador, el acceso al listado y el formulario, sin renderizar todos los animales;
- pantalla separada **Animales cargados** con búsqueda, edición, eliminación y regreso a carga;
- navegación interna sin React Router ni dependencias adicionales;
- retorno al listado después de guardar o cancelar una edición;
- detección local de posibles duplicados dentro de la jornada por identificación oficial completa o por color y número de caravana;
- advertencia previa al guardado con datos del animal coincidente;
- decisión humana entre **Cancelar** y **Guardar de todos modos**, sin eliminar, fusionar ni modificar registros automáticamente;
- exclusión del propio animal durante la edición y control contra los demás registros;
- evidencia persistente cuando el usuario decide conservar un posible duplicado;
- cierre explícito de una jornada no vacía mediante una revisión previa y confirmación humana;
- persistencia del estado cerrado y de la fecha/hora de cierre en IndexedDB;
- bloqueo de nuevas altas y consulta de animales en modo de solo lectura después del cierre;
- creación de una jornada abierta e independiente después de cerrar la anterior, sin borrar ni modificar datos previos;
- recuperación prioritaria de la jornada abierta y aislamiento de animales mediante `journeyId`;
- historial local ordenado desde la jornada más reciente, con fecha, lugar, estado y cantidad de animales;
- consulta temporal de resúmenes y animales históricos sin reemplazar la jornada actual;
- búsqueda y listado en modo de solo lectura para las jornadas consultadas;
- resumen reproductivo y de boqueo calculado localmente desde los animales, sin guardar estadísticas duplicadas;
- porcentajes con un decimal y denominadores diferenciados para el resultado general y la distribución interna de preñadas;
- pruebas unitarias y de integración de las reglas y los repositorios incorporados.

### Pendiente de implementación o validación

- reapertura de jornadas cerradas;
- edición de jornadas cerradas;
- eliminación de jornadas;
- exportación XLSX y respaldo JSON;
- chequeo de preparación offline;
- integración del componente agéntico con la aplicación; la línea de base académica Corrida 1 ya está documentada;
- validación física en Android/Chrome y reapertura en modo avión.

### Validaciones manuales

El 07/09/2026, el usuario informó haber validado manualmente el siguiente recorrido:

- crear una jornada en Manga Casco;
- cargar y guardar un animal;
- comprobar su aparición inmediata en el listado con los datos ingresados;
- recargar la página y recuperar la jornada y el animal;
- cerrar la pestaña, volver a abrir la aplicación y recuperar nuevamente los datos;
- comprobar que, después de guardar, el formulario queda preparado para cargar el siguiente animal.

Esta validación confirmó el flujo mínimo y la persistencia local mediante IndexedDB en el entorno utilizado.

El 07/09/2026, el usuario informó haber validado manualmente la segunda funcionalidad en la aplicación real. Comprobó:

- persistencia de varios animales en la jornada;
- búsqueda de animales;
- edición de registros;
- eliminación de registros;
- actualización del listado después de las operaciones.

Estas validaciones no demuestran todavía funcionamiento sin conexión ni compatibilidad en un celular Android real.

### Mejora de usabilidad validada manualmente

Durante la prueba de uso se detectó que mostrar el listado completo antes del formulario obligaría a recorrer cientos de registros en jornadas de 300 a 600 animales. Para evitar ese problema, la carga y el listado se separaron en dos pantallas internas.

La pantalla de carga conserva jornada, fecha, lugar, contador, acceso al listado y formulario. La pantalla **Animales cargados** concentra búsqueda, listado, edición y eliminación. Al editar, el formulario se abre con los datos precargados; guardar o cancelar vuelve al listado.

El 07/09/2026, el usuario informó haber validado manualmente la separación de pantallas, el contador, la navegación de ida y vuelta, la búsqueda, la edición, la eliminación y la persistencia de los animales previamente cargados. También confirmó que el flujo resulta adecuado para jornadas con muchos animales porque evita recorrer un listado largo antes de cargar el siguiente.

Esta validación no equivale todavía a una prueba en campo, sin conexión o en un celular Android real.

### Control de posibles duplicados validado manualmente

Antes de crear o actualizar un animal, la aplicación compara localmente las identificaciones completas contra los animales de la jornada abierta. Se considera posible duplicado cuando coincide **Prefijo + Individual** o **Color + Número**; una coincidencia parcial no genera advertencia. La comparación ignora mayúsculas, minúsculas y espacios innecesarios.

Si hay coincidencias, el registro no se guarda automáticamente. La advertencia muestra la identificación, diagnóstico y condición corporal disponibles del animal existente. **Cancelar** conserva el formulario para revisión y no escribe datos. **Guardar de todos modos** permite conservar ambos registros y deja evidencia de la confirmación humana.

La aplicación solo detecta y advierte: no corrige diagnósticos ni elimina, combina o modifica animales por su cuenta. Esto busca reducir errores de carga sin bloquear casos legítimos.

El 07/09/2026, el usuario informó haber validado manualmente la detección por identificación oficial completa, la advertencia previa con información suficiente, la cancelación sin guardado, la conservación consciente de ambos registros y la actualización condicional del contador. También comprobó que igual prefijo con distinto ID individual e igual color con distinto número no generan advertencia, y confirmó que la decisión final permanece bajo supervisión humana.

### Corrección de identificación por caravana validada manualmente

La operación real incluye vacas con caravana de color sin numeración. Por ese motivo, la identificación por caravana ahora admite **color solo** o **color + número**. El color es obligatorio cuando se utiliza este esquema; el número es opcional y, si se informa, debe ser estrictamente numérico. Un número sin color continúa siendo inválido.

Compartir únicamente el color no genera una alerta fuerte de duplicado, porque varias vacas pueden usar el mismo color sin numeración. La coincidencia fuerte por caravana requiere que ambos registros tengan color y número y que ambos valores coincidan. El listado muestra solamente el color cuando no existe número, sin completar valores artificiales.

El 07/09/2026, el usuario informó haber validado manualmente la carga de color sin número y de color con número, su presentación correcta en el listado y el funcionamiento normal de la identificación oficial. También comprobó que compartir solamente el color sin una numeración completa coincidente no genera una advertencia fuerte y que la coincidencia completa de color y número sí mantiene el control de posible duplicado.

Esta evidencia valida la corrección en la aplicación utilizada por el usuario, pero no equivale todavía a una prueba en campo, sin conexión o en un celular Android real.

### Cierre de jornada y resumen estadístico validados manualmente

Una jornada abierta ahora ofrece la acción **Cerrar jornada**. El sistema impide cerrar si no hay animales y, cuando los hay, muestra una revisión previa con fecha, lugar, total y cantidad de registros conservados después de una revisión humana por duplicados. Si existen esos registros, el usuario debe revisarlos y marcar una confirmación específica antes del cierre definitivo. El sistema no corrige ni elimina datos automáticamente.

La confirmación guarda únicamente el estado cerrado y la fecha/hora de cierre. Los animales y sus evidencias de revisión permanecen en IndexedDB; el resumen se reconstruye de forma determinística a partir de esos registros. La jornada cerrada no admite nuevas altas y el listado queda disponible en modo de consulta.

El porcentaje general de preñez y el de vacías usan como denominador el total de vacas. En cambio, Cabeza, Cuerpo, Cola y Robo usan como denominador el total de preñadas. Si ese total es cero, las cuatro categorías muestran `0,0%`. **Sin Diente** y **Diente Cuarto** se calculan sobre el total de vacas: se informan respectivamente como candidatas a salida actual y como animales a seguir, candidatos a salida el año siguiente. La aplicación no decide descartes.

Se incorporaron pruebas unitarias e integración para el cierre, la persistencia, el bloqueo de nuevas altas, las fórmulas, los casos cero, las invariantes y la no mutación de los registros.

El 08/09/2026, el usuario validó manualmente esta funcionalidad en una prueba controlada con 10 vacas: 4 Preñada Cabeza, 2 Preñada Cuerpo, 1 Preñada Cola, 1 Preñada Robo y 2 Vacías; además, 2 animales Sin Diente y 3 Diente Cuarto. La aplicación mostró correctamente:

- total: 10;
- preñadas: 8 — 80,0%;
- vacías: 2 — 20,0%;
- Cabeza: 4 — 50,0% de las preñadas;
- Cuerpo: 2 — 25,0% de las preñadas;
- Cola: 1 — 12,5% de las preñadas;
- Robo: 1 — 12,5% de las preñadas;
- Sin Diente: 2 — 20,0% del total;
- Diente Cuarto: 3 — 30,0% del total.

También comprobó el cambio al estado cerrado, la presentación **Jornada finalizada**, la consulta de animales en modo de solo lectura sin acciones de edición o eliminación, el regreso al resumen y la conservación de los animales después del cierre.

Esta fue una prueba controlada y no una validación en condiciones reales de campo o durante un trabajo real de manga. El caso con cero vacas preñadas fue validado posteriormente al probar la creación y el cierre de una segunda jornada. Todavía no están implementados la reapertura, el historial general ni la exportación XLSX.

### Nueva jornada después del cierre validada manualmente

La pantalla de una jornada cerrada permite elegir entre **Ver animales cargados** y **Nueva jornada**. La primera acción conserva la consulta de la jornada finalizada en modo de solo lectura. La segunda abre el formulario de fecha y lugar y requiere confirmar **Iniciar jornada**.

La nueva jornada se crea con un ID propio, estado abierto, sin fecha de cierre, sin animales y sin estadísticas almacenadas. La jornada cerrada anterior no se borra, sobrescribe, reabre ni modifica. Sus animales y evidencias de revisión permanecen asociados al `journeyId` original.

Al iniciar o recuperar la aplicación se prioriza la jornada abierta; si no existe una, se muestra la jornada cerrada más reciente. La aplicación carga en memoria únicamente los animales del `journeyId` seleccionado. Por eso la búsqueda, el control de duplicados y las estadísticas operan sobre una sola jornada y una identificación de una jornada anterior no genera una advertencia en la nueva.

El 08/09/2026, el usuario validó manualmente esta funcionalidad mediante una prueba controlada. Partió de una jornada cerrada y creó otra con fecha 08/09/2026 en Manga Oro Monte, sin borrar IndexedDB ni limpiar el almacenamiento. La nueva jornada apareció abierta, con contador cero y el formulario normal de carga; la anterior no fue reutilizada ni modificada.

En la segunda jornada cargó tres animales, todos diagnosticados como Vacía. El contador y el listado mostraron únicamente esos tres registros. Al cerrar, el resumen presentó total 3, preñadas 0 —0,0%—, vacías 3 —100,0%— y Cabeza, Cuerpo, Cola y Robo en 0 —0,0%—. No aparecieron `NaN`, infinito ni errores de división por cero. Para boqueo mostró Sin Diente 0 —0,0%— y Diente Cuarto 1 —33,3%—.

También se verificó que la segunda jornada quedara cerrada, que sus tres animales pudieran consultarse en modo de solo lectura, que no hubiera acciones de edición o eliminación, que fuera posible regresar al resumen y que **Nueva jornada** continuara disponible.

La prueba no se realizó en condiciones reales de campo. La jornada anterior continúa almacenada en IndexedDB, con sus animales asociados al `journeyId` original; crear otra jornada no implica pérdida de información. La interfaz muestra la jornada abierta o, si no existe, la más reciente, pero todavía no permite navegar hacia jornadas históricas anteriores.

La siguiente etapa implementó **Historial de jornadas** para consultar desde la interfaz las jornadas anteriores, sus resúmenes y sus animales. En ese momento continuaban pendientes la reapertura, eliminación de jornadas, XLSX, respaldo y componente agéntico.

### Historial de jornadas validado manualmente

La acción **Historial de jornadas** abre una pantalla de consulta que lista todas las jornadas persistidas, ordenadas por `createdAt` desde la más reciente. Cada fila muestra fecha, lugar, estado y cantidad de animales, sin desplegar todavía sus registros.

La jornada actual y la jornada consultada se mantienen como estados separados. Entrar al historial, seleccionar una jornada o regresar no cierra, reemplaza ni modifica la jornada actual. Los animales consultados se leen exclusivamente mediante el `journeyId` histórico y los resúmenes se recalculan con las funciones estadísticas existentes; no se almacenan copias de estadísticas.

El detalle permite consultar el resumen y buscar dentro del listado de animales. Toda jornada abierta o cerrada consultada desde el historial se presenta en modo de solo lectura. No aparecen acciones de edición, eliminación o guardado. La navegación principal ofrece **Volver al historial** y **Volver a jornada actual** sin depender del botón Atrás del navegador.

Si IndexedDB no contiene jornadas, la pantalla muestra **No hay jornadas registradas.** La implementación utiliza el esquema actual y no exige borrar datos ni ejecutar una migración.

El 08/09/2026, el usuario validó manualmente el historial mediante una prueba controlada. La pantalla mostró primero Manga Oro Monte del 08/09/2026, cerrada y con 3 animales, y luego Manga Casco del 07/09/2026, cerrada y con 10 animales. Comprobó fecha, lugar, estado, cantidad, orden descendente, **Ver jornada** y **Volver a jornada actual**, así como la conservación de ambas jornadas.

Al consultar Manga Oro Monte, la aplicación mostró **Jornada consultada · Cerrada**, la fecha, lugar y total de 3 vacas. El resumen reconstruido presentó preñadas 0 —0,0%—, vacías 3 —100,0%—, las cuatro categorías de preñez en 0 —0,0%—, Sin Diente 0 —0,0%— y Diente Cuarto 1 —33,3%—, sin `NaN`, infinito ni errores matemáticos.

El listado mostró exclusivamente AI892 PU50 con Naranja 1234, AI892 PU51 con Naranja 1235 y AI892 PU52 con Naranja 1236, todos con diagnóstico Vacía. La búsqueda permaneció disponible y no aparecieron acciones de edición, eliminación o guardado. También funcionaron **Volver al resumen** y **Volver a jornada actual**.

Mediante el historial se comprobó además que Manga Casco conserva sus 10 animales, Manga Oro Monte conserva sus 3 animales y que no se mezclan ni modifican datos entre jornadas. Cada animal continúa asociado a su `journeyId`; los resúmenes se calculan desde esos registros y las estadísticas no se duplican en IndexedDB. Consultar una jornada no reemplaza la jornada actual.

Esta evidencia corresponde a una prueba controlada, no a condiciones reales de campo. Todavía no se implementaron reapertura, edición histórica, eliminación de jornadas, XLSX, respaldo ni integración del componente agéntico con la aplicación. La Corrida 1 académica posterior permanece desacoplada del flujo operativo.

## Ejecutar localmente

Requisitos: Node.js y npm.

```bash
npm install
npm run dev
```

Abrir:

```text
http://localhost:5173/TF-Agente-Diagnostico-Prenez/
```

Para comprobar la compilación PWA:

```bash
npm run build
npm run preview
```

El preview queda disponible normalmente en:

```text
http://localhost:4173/TF-Agente-Diagnostico-Prenez/
```

No se instalaron todavía SheetJS ni Playwright porque estos incrementos no los utilizan. `fake-indexeddb` se usa solo durante las pruebas para verificar los repositorios locales sin incorporarse al bundle de producción.
