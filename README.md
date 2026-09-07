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

Las reglas determinísticas, la detección de duplicados, el cálculo de estadísticas, el cierre, el historial y la exportación también forman parte de la operación offline. La arquitectura tecnológica V1 está definida como una PWA mobile-first en React y TypeScript, con IndexedDB y exportación XLSX local; su implementación y validación todavía no comenzaron.

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

**Primer incremento funcional implementado y validado manualmente.** Ya se puede crear una jornada, cargar un animal, guardarlo en IndexedDB, verlo en la lista y recuperar ambos después de recargar completamente la página o cerrar y volver a abrir la aplicación.

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
- pruebas unitarias de las reglas incorporadas.

### Pendiente de implementación o validación

- búsqueda, edición y eliminación de animales;
- detección y revisión de duplicados;
- cierre, estadísticas e historial de jornadas cerradas;
- exportación XLSX y respaldo JSON;
- chequeo de preparación offline;
- componente agéntico;
- validación física en Android/Chrome y reapertura en modo avión.

### Validación manual del incremento

El 07/09/2026, el usuario informó haber validado manualmente el siguiente recorrido:

- crear una jornada en Manga Casco;
- cargar y guardar un animal;
- comprobar su aparición inmediata en el listado con los datos ingresados;
- recargar la página y recuperar la jornada y el animal;
- cerrar la pestaña, volver a abrir la aplicación y recuperar nuevamente los datos;
- comprobar que, después de guardar, el formulario queda preparado para cargar el siguiente animal.

Esta validación confirma el flujo mínimo y la persistencia local mediante IndexedDB en el entorno utilizado. No demuestra todavía funcionamiento sin conexión ni compatibilidad en un celular Android real.

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

No se instalaron todavía SheetJS ni Playwright porque este incremento no los utiliza.
