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
- `prompts/`: borradores iniciales, todavía no calibrados, de los prompts del agente.
- `corridas/`: carpeta reservada para corridas reales futuras; actualmente solo contiene una nota de alcance y no registra ninguna corrida.

## Trazabilidad académica

El repositorio público es [pireseber-lang/TF-Agente-Diagnostico-Prenez](https://github.com/pireseber-lang/TF-Agente-Diagnostico-Prenez). Las decisiones, iteraciones del agente y evidencias reales se documentarán en GitHub como parte del trabajo académico. No se presentarán corridas ficticias como evidencia.

## Estado actual

**Los incrementos de carga, persistencia, consulta, navegación, control de posibles duplicados, caravana con número opcional, cierre, resumen estadístico y creación de una nueva jornada independiente están implementados y validados manualmente en pruebas controladas.**

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
- resumen reproductivo y de boqueo calculado localmente desde los animales, sin guardar estadísticas duplicadas;
- porcentajes con un decimal y denominadores diferenciados para el resultado general y la distribución interna de preñadas;
- pruebas unitarias y de integración de las reglas y los repositorios incorporados.

### Pendiente de implementación o validación

- reapertura de jornadas cerradas;
- historial general de jornadas cerradas, próxima funcionalidad prevista;
- exportación XLSX y respaldo JSON;
- chequeo de preparación offline;
- componente agéntico;
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

La próxima funcionalidad prevista es **Historial de jornadas**, cuyo objetivo será consultar desde la interfaz las jornadas anteriores, sus resúmenes y sus animales. No se implementó en esta etapa. Tampoco se incorporaron reapertura, XLSX, respaldo ni componente agéntico.

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
