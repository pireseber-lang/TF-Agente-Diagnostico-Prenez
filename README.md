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

**Los incrementos de carga, persistencia, consulta, navegación y control de posibles duplicados están implementados y validados manualmente.** La aplicación mantiene la decisión final bajo supervisión humana.

### Implementado

- base React, Vite y TypeScript estricto;
- manifiesto PWA y service worker generado con `vite-plugin-pwa`;
- creación de una jornada con fecha y uno de los tres lugares válidos;
- persistencia de la jornada y sus animales en IndexedDB mediante `idb`;
- formulario mobile-first con identificaciones, diagnóstico, boqueo, condición corporal y observaciones;
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
- pruebas unitarias y de integración de las reglas y los repositorios incorporados.

### Pendiente de implementación o validación

- cierre, estadísticas e historial de jornadas cerradas;
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
