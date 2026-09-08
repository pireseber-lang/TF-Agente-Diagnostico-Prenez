# Especificación funcional V1

- **Proyecto:** Diagnóstico de preñez en manga
- **Versión del documento:** 0.3
- **Fecha:** 2026-09-06
- **Estado:** Definiciones funcionales y arquitectura tecnológica V1 aprobadas; implementación pendiente

## 1. Propósito

Definir el comportamiento funcional de una aplicación web móvil para registrar, controlar, resumir y exportar los datos producidos durante una jornada de diagnóstico de preñez bovina. La aplicación reemplazará a la planilla Excel como interfaz de carga, aunque conservará Excel como formato de exportación.

La carga y las funciones esenciales deberán operar sin conexión a internet. El diagnóstico seguirá siendo una decisión del veterinario; el agente actuará como asistente de validación y no como decisor clínico.

## 2. Objetivos de V1

- Permitir la carga rápida desde un celular durante el trabajo en la manga.
- Evitar que una pérdida de conectividad interrumpa la jornada.
- Conservar localmente los registros y las jornadas cerradas.
- Detectar posibles duplicados, registros incompletos e inconsistencias.
- Mantener toda modificación o decisión relevante bajo control humano.
- Producir un resumen verificable y un archivo `.xlsx` reutilizable.

## 3. Actores y responsabilidades

### 3.1 Usuario de carga

- inicia la jornada;
- registra los datos de cada animal;
- busca, edita y elimina registros mientras la jornada está abierta;
- revisa las alertas;
- confirma el cierre y solicita exportaciones.
- asume la responsabilidad de aceptar o corregir los casos revisados.

### 3.2 Veterinario

- define el diagnóstico de preñez;
- conserva la autoridad sobre cualquier dato o decisión veterinaria.

### 3.3 Agente de validación

- puede analizar los registros y señalar problemas;
- utiliza las validaciones determinísticas locales como fuente de hechos, sin sustituirlas por inferencias;
- detecta y explica casos que requieren atención;
- marca casos para revisión humana;
- no inventa datos ni cambia silenciosamente el diagnóstico o cualquier otro valor cargado.

El resultado final permanece bajo responsabilidad humana.

## 4. Conceptos y estados

### 4.1 Jornada

Agrupa los registros capturados en una fecha y un lugar determinados.

- **Abierta:** admite altas, búsquedas, ediciones, eliminaciones y revisión de alertas.
- **Cerrada:** conserva sus datos y resumen en el historial local y admite consulta y nueva exportación. La edición posterior al cierre no forma parte de los requisitos confirmados de V1.

### 4.2 Registro de animal

Representa una vaca dentro de una jornada. Debe tener al menos un esquema de identificación completo: identificación oficial, caravana de color o ambos.

### 4.3 Caso para revisión

Es una alerta vinculada con uno o más registros. Debe conservar el dato original, el tipo de alerta y una explicación comprensible para que una persona decida cómo proceder.

## 5. Flujo funcional

### 5.1 Inicio de jornada

El usuario debe:

1. registrar la fecha;
2. elegir uno de estos lugares:
   - Manga Casco;
   - Manga Complejo;
   - Manga Oro Monte;
3. confirmar el inicio de la jornada.

La fecha y el lugar son obligatorios para iniciar.

### 5.2 Carga por animal

La pantalla de carga presentará los campos definidos en la sección 6 y un botón **Guardar y siguiente**.

Al guardar correctamente:

- el registro queda persistido localmente;
- el contador visible de animales cargados se actualiza;
- el formulario se limpia para la siguiente vaca;
- el usuario recibe una confirmación clara del guardado;
- las alertas detectadas quedan asociadas al registro sin reemplazar sus valores.

Si no existe ninguna identificación completa, el registro no se guarda y la interfaz indica qué dato falta.

En el flujo normal tampoco se guarda si falta diagnóstico, boqueo o condición corporal. No se admiten pares de identificación parciales.

Si excepcionalmente un dato obligatorio no puede determinarse, la futura implementación deberá representarlo mediante un estado temporal explícito de **requiere determinación/revisión**, separado de las categorías productivas normales. Nunca se conservará un vacío silencioso ni se agregará una categoría diagnóstica definitiva sin aprobación. El caso deberá ser resuelto por una persona antes del cierre de la jornada.

### 5.3 Consulta y mantenimiento durante la jornada

Mientras la jornada esté abierta, el usuario puede:

- buscar un animal ya cargado por cualquiera de sus identificaciones disponibles;
- abrir el registro encontrado;
- editarlo y volver a validarlo;
- eliminarlo antes del cierre;
- consultar los casos marcados para revisión.

Una edición debe conservar el control humano: el sistema muestra los datos existentes y solo guarda cambios confirmados por el usuario. La interfaz deberá pedir confirmación antes de eliminar para evitar pérdidas accidentales.

### 5.4 Revisión asistida

El sistema reúne las alertas pendientes, identifica los registros involucrados y explica el motivo. El usuario puede corregir los datos o confirmar explícitamente que fueron revisados. Revisar una alerta no autoriza al agente a modificar el diagnóstico ni implica que la alerta haya sido resuelta automáticamente.

### 5.5 Cierre

Antes del cierre, la aplicación debe:

1. recalcular las validaciones;
2. mostrar la cantidad y el detalle de los registros con alertas;
3. permitir corregirlos;
4. generar una vista previa del resumen;
5. solicitar confirmación explícita del usuario.

Una jornada puede cerrarse con alertas únicamente después de una revisión humana explícita. Si el usuario decide mantenerlas, debe confirmar conscientemente el cierre; el agente no las resuelve ni modifica los datos. Una vez confirmado, la jornada queda disponible en el historial local con sus animales y su resumen.

No se permite cerrar una jornada sin animales ni con datos obligatorios todavía en estado **requiere determinación/revisión**.

### 5.6 Historial

El usuario puede:

- listar las jornadas cerradas almacenadas localmente;
- abrir una jornada anterior;
- consultar su fecha, lugar y resumen;
- consultar sus animales;
- volver a exportar el archivo Excel;
- eliminarla manualmente, con confirmación.

## 6. Modelo funcional de datos

### 6.1 Datos de jornada

| Campo | Tipo funcional | Obligatorio | Valores o regla |
|---|---|---:|---|
| Fecha | Fecha | Sí | Formato visible `DD/MM/AAAA` |
| Lugar | Opción única | Sí | Manga Casco, Manga Complejo o Manga Oro Monte |
| Estado | Estado del sistema | Sí | Abierta o cerrada |

### 6.2 Datos de cada animal

| Campo | Tipo funcional | Obligatorio | Valores o regla |
|---|---|---:|---|
| Prefijo oficial | Alfanumérico | Condicional | Ejemplos de formato: `AI892`, `OV319` |
| ID oficial individual | Alfanumérico | Condicional | Ejemplos de formato: `PU50`, `B728` |
| Color de caravana | Opción única | Condicional | Verde, Rojo, Blanco, Violeta, Celeste, Naranja o Amarilla |
| Número de caravana de color | Numérico | Opcional | Solo dígitos cuando se informa; ejemplos: `1342`, `528` |
| Diagnóstico | Opción única | Sí | Preñada Cabeza, Preñada Cuerpo, Preñada Cola, Preñada Robo o Vacía |
| Boqueo | Opción única | Sí | Diente lleno, Diente medio, Diente cuarto o Sin Diente |
| Condición corporal | Número decimal | Sí | Se almacena como número; la interfaz muestra 2; 2,25; 2,5; 2,75; 3; 3,25; 3,5; 3,75; 4; 4,25; 4,5 |
| Observaciones | Texto libre | No | Contenido ingresado por el usuario |

Reglas de identificación aprobadas:

- La identificación oficial se considera completa cuando tiene prefijo e ID individual.
- La identificación por caravana de color es válida cuando tiene color; el número es opcional.
- No se admite un número de caravana sin color.
- Para guardar debe existir al menos uno de esos dos esquemas completos.
- Un animal puede tener solamente la identificación oficial completa, solamente una caravana con color —con número opcional— o ambas identificaciones.
- No se permite guardar una identificación parcial, aunque el otro esquema esté completo.
- El número de la caravana de color es estrictamente numérico.
- Los identificadores admiten únicamente valores alfanuméricos.
- Antes de validar, comparar y almacenar un identificador, se convierte a mayúsculas y se eliminan sus espacios.
- Las longitudes máximas se definirán como una decisión técnica menor durante la implementación.

## 7. Requisitos funcionales

| ID | Requisito |
|---|---|
| RF-01 | Crear una jornada con fecha y lugar. |
| RF-02 | Cargar un animal con identificación oficial, caravana de color o ambas. |
| RF-03 | Impedir el guardado cuando no exista al menos una identificación válida, cuando la identificación oficial esté parcial o cuando exista un número de caravana sin color. |
| RF-04 | Exigir diagnóstico, boqueo y condición corporal en el flujo normal; registrar observaciones de forma opcional. |
| RF-05 | Guardar localmente y preparar inmediatamente el formulario siguiente. |
| RF-06 | Mostrar un contador actualizado de animales cargados. |
| RF-07 | Buscar por cualquiera de las identificaciones disponibles. |
| RF-08 | Editar y eliminar registros antes del cierre. |
| RF-09 | Detectar duplicados dentro de la jornada, antecedentes en el historial, registros incompletos e inconsistencias. |
| RF-10 | Mostrar alertas explicadas y casos para revisión humana. |
| RF-11 | Evitar cualquier modificación silenciosa del diagnóstico informado. |
| RF-12 | Recalcular y mostrar el resumen de cierre. |
| RF-13 | Cerrar solo después de una confirmación humana explícita, con al menos un animal y sin datos obligatorios pendientes de determinación. |
| RF-14 | Exportar una fila por animal a un archivo `.xlsx`. |
| RF-15 | Conservar localmente las jornadas cerradas. |
| RF-16 | Consultar resumen y animales de una jornada anterior. |
| RF-17 | Volver a exportar una jornada cerrada. |
| RF-18 | Mantener disponibles las funciones esenciales sin conexión a internet. |
| RF-19 | Representar explícitamente los casos excepcionales de datos obligatorios no determinados, sin convertirlos silenciosamente en categorías productivas. |
| RF-20 | Conservar las jornadas cerradas en el historial local hasta que el usuario las elimine manualmente. |
| RF-21 | Exportar e importar un respaldo integral JSON versionado mediante confirmación humana. |
| RF-22 | Mostrar un chequeo de preparación offline antes de utilizar el dispositivo en una jornada. |

## 8. Validaciones y comportamiento del agente

### 8.1 Validaciones de bloqueo

- No iniciar una jornada sin fecha y lugar válidos.
- No guardar un animal sin al menos una identificación completa.
- No guardar identificaciones parciales.
- No guardar por el flujo normal si falta diagnóstico, boqueo o condición corporal.
- No aceptar caracteres no numéricos en el número de caravana de color.
- No aceptar valores que estén fuera de los catálogos cerrados cuando la interfaz use opciones predefinidas.

### 8.2 Alertas para revisión

- **Duplicado oficial en la jornada:** misma combinación de prefijo oficial e ID oficial individual en otro registro de la jornada actual.
- **Duplicado de caravana en la jornada:** misma combinación de color y número de caravana en otro registro de la jornada actual.
- Compartir solamente el color, cuando uno o ambos registros no tienen número, no constituye un duplicado fuerte.
- **Antecedente oficial histórico:** la misma identificación oficial aparece en una jornada anterior.
- **Antecedente de caravana histórico:** la misma caravana de color aparece en una jornada anterior.
- **Dato obligatorio no determinado:** caso excepcional marcado explícitamente para revisión, sin valor diagnóstico inventado.
- **Conflicto entre identificaciones:** una identificación aportada coincide con un registro y la otra con uno diferente.
- **Valor inconsistente:** un dato no satisface una regla explícita, versionada y vigente.

Un duplicado dentro de la misma jornada genera una alerta fuerte e interrumpe el guardado automático. Para continuar, una persona debe revisar el caso y corregirlo o confirmar de manera explícita que desea conservarlo. Una coincidencia con el historial se informa como antecedente, pero no bloquea, porque un mismo animal puede aparecer legítimamente en jornadas de distintos años.

Si la persona confirma conservar un duplicado dentro de la jornada, debe persistirse evidencia asociada a la alerta que registre, como mínimo, que hubo revisión humana y que la decisión explícita fue conservar el registro. El esquema técnico de esa evidencia se definirá durante la implementación.

No se incorporarán supuestas reglas veterinarias por inferencia. Cualquier inconsistencia de dominio deberá estar definida y aprobada antes de ser aplicada.

### 8.3 Salida esperada de una alerta

Cada alerta debe incluir, como mínimo:

- registro o registros afectados;
- tipo de alerta;
- campos involucrados;
- regla que se activó;
- explicación legible;
- estado de revisión.
- alcance de la coincidencia: jornada actual o historial.

### 8.4 Límites de autonomía

- El agente no diagnostica preñez.
- El agente no reemplaza el criterio veterinario.
- El agente no sobrescribe, completa ni normaliza silenciosamente datos.
- Una sugerencia debe estar separada del valor efectivamente registrado.
- La resolución de un caso marcado requiere una acción humana trazable en la aplicación.

### 8.5 Supervisión humana y referencia preliminar L0–L4

La separación de responsabilidades es obligatoria:

1. el veterinario determina el diagnóstico;
2. el usuario registra la información;
3. el sistema ejecuta localmente las reglas determinísticas y genera alertas;
4. el agente puede analizar los registros y señalar problemas, pero no cambiar diagnósticos;
5. el usuario revisa las alertas y confirma el cierre;
6. el resultado final queda bajo responsabilidad humana.

La relación con L0–L4 es preliminar porque todavía no se incorporó al repositorio la definición formal de esa escala usada por la materia:

- la planilla manual de origen funciona como referencia de **L0**;
- las validaciones determinísticas locales son automatización de apoyo y no se presentarán por sí solas como evidencia de agencia;
- el componente agéntico de V1 aspirará, como máximo, a asistencia acotada con revisión humana —provisionalmente compatible con **L1–L2**, sujeto a la rúbrica académica y a corridas reales—;
- no se atribuyen capacidades **L3–L4**: el sistema no determina diagnósticos, no resuelve alertas por sí mismo y no cierra jornadas sin confirmación.

Esta clasificación no afirma capacidades implementadas. Deberá revisarse contra la rúbrica formal antes de la evaluación.

## 9. Resumen de jornada

El cierre debe mostrar:

- total de vacas;
- cantidad de preñadas;
- porcentaje de preñadas;
- cantidad de vacías;
- porcentaje de vacías;
- Preñada Cabeza: cantidad y porcentaje;
- Preñada Cuerpo: cantidad y porcentaje;
- Preñada Cola: cantidad y porcentaje;
- Preñada Robo: cantidad y porcentaje.

Definiciones:

- **Cantidad de preñadas:** suma de Cabeza, Cuerpo, Cola y Robo.
- **Porcentaje por categoría de preñez:** `cantidad de la categoría / cantidad total de vacas preñadas × 100`.
- **Porcentaje de preñadas:** `cantidad de preñadas / total de vacas × 100`.
- **Porcentaje de vacías:** `cantidad de vacías / total de vacas × 100`.
- **Presentación:** todos los porcentajes se muestran con un decimal.

Si no hay vacas preñadas, los porcentajes de Preñada Cabeza, Preñada Cuerpo, Preñada Cola y Preñada Robo se muestran como `0,0%`.

## 10. Exportación Excel

La aplicación debe generar un archivo `.xlsx` con una fila por animal y, como mínimo, las siguientes columnas en este orden lógico:

1. Fecha
2. Lugar
3. Prefijo oficial
4. ID oficial individual
5. Color caravana
6. Número caravana color
7. Diagnóstico
8. Boqueo
9. Condición corporal
10. Observaciones

La exportación debe reproducir los valores confirmados y no sustituirlos por inferencias del agente.

Convenciones aprobadas:

- la fecha se muestra como `DD/MM/AAAA`;
- el archivo se denomina `diagnostico_prenez_YYYY-MM-DD_lugar.xlsx`;
- `lugar` representa el lugar de la jornada en una forma apta para nombres de archivo;
- la condición corporal se almacena y exporta como número decimal, aunque la interfaz pueda mostrar coma decimal.

La biblioteca de exportación y su código deben formar parte de los recursos empaquetados y precargados por la PWA. La generación del libro y la descarga no realizan llamadas de red, por lo que el `.xlsx` puede producirse completamente offline a partir de los registros locales.

## 11. Requisitos no funcionales

### 11.1 Operación offline

- La creación de jornada, carga de animales, persistencia, edición, eliminación, búsqueda, validaciones determinísticas, detección de duplicados, cálculo de estadísticas, cierre, historial y exportación no deben depender de internet.
- Los datos deben persistirse localmente en el dispositivo.
- Una pérdida de conexión durante la jornada no debe bloquear ni descartar una carga.
- La operación básica no puede depender de una llamada a un LLM.
- Toda regla que pueda expresarse de forma determinística debe ejecutarse localmente.

### 11.2 Uso móvil

- La interfaz debe adaptarse a una pantalla de celular.
- Las opciones frecuentes, especialmente condición corporal y **Guardar y siguiente**, deben poder accionarse con rapidez y con controles táctiles claros.
- El contador y el estado de guardado deben permanecer visibles o ser fáciles de consultar.

### 11.3 Integridad y control

- El sistema debe confirmar el guardado antes de limpiar el formulario.
- Los cálculos del resumen y la exportación deben derivar de los mismos registros persistidos.
- Las eliminaciones deben requerir confirmación.
- Ninguna alerta debe alterar los datos por sí sola.

### 11.4 Retención, privacidad y recuperación

V1 almacenará información localmente. Las jornadas se conservan mientras el usuario no las elimine manualmente. Como V1 no incluye sincronización en la nube, se aplicarán dos defensas simples:

1. solicitar almacenamiento persistente mediante `navigator.storage.persist()` y mostrar el resultado sin asumir que será concedido;
2. permitir exportar e importar un respaldo integral JSON, versionado, que incluya jornadas, animales, alertas, revisiones y metadatos necesarios.

Después de cada cierre, la aplicación ofrecerá descargar el respaldo en una ubicación externa al almacenamiento del navegador, como Descargas. La restauración validará estructura y versión, mostrará un resumen y requerirá confirmación explícita. V1 realizará restauración total y no una fusión compleja entre bases. El XLSX seguirá siendo el reporte interoperable, pero no será el único respaldo porque puede no representar todo el estado interno.

### 11.5 Trazabilidad académica en GitHub

El repositorio público del proyecto es [pireseber-lang/TF-Agente-Diagnostico-Prenez](https://github.com/pireseber-lang/TF-Agente-Diagnostico-Prenez). La documentación, las decisiones, los cambios futuros y las evidencias reales de iteración deberán conservar trazabilidad en GitHub. No se usarán corridas ficticias como evidencia.

### 11.6 Arquitectura tecnológica final de V1

La decisión arquitectónica está cerrada para comenzar la implementación, pero sus resultados todavía no fueron construidos ni probados.

#### 11.6.1 Componentes elegidos

| Área | Decisión V1 |
|---|---|
| Frontend | React sobre Vite |
| Lenguaje | TypeScript con comprobación estricta |
| PWA | `vite-plugin-pwa` con Workbox en estrategia `generateSW` |
| Actualizaciones | Aviso y confirmación; nunca recarga automática durante una jornada abierta |
| Persistencia | IndexedDB como fuente local durable |
| Acceso a datos | `idb` y una capa propia de repositorios y migraciones |
| Estado | Estado local de React, `useReducer` y Context; IndexedDB es la fuente persistente |
| Validaciones | Funciones puras TypeScript dentro del dominio |
| XLSX | SheetJS Community Edition (`xlsx`) empaquetado localmente |
| Pruebas | TypeScript, Vitest, Playwright y pruebas manuales en Android/Chrome real |
| Entrega | Sitio estático HTTPS; GitHub Pages es el destino inicial previsto |

#### 11.6.2 Dependencias y justificación

Dependencias de ejecución:

| Dependencia | Motivo |
|---|---|
| `react` | Construir formularios y pantallas móviles mediante componentes con un modelo de estado predecible. |
| `react-dom` | Renderizar React en el navegador. |
| `idb` | Usar IndexedDB con promesas, transacciones y tipos sin ocultar su modelo ni incorporar una base de datos adicional. |
| SheetJS CE (`xlsx`) | Crear un libro XLSX y descargarlo en el navegador sin servidor ni conexión. |

Dependencias de desarrollo:

| Dependencia | Motivo |
|---|---|
| `typescript` | Tipar entidades, repositorios, reglas y contratos entre capas; se usará modo estricto. |
| `vite` | Servidor de desarrollo y compilación estática optimizada. |
| `@vitejs/plugin-react` | Integración oficial de React con el pipeline de Vite. |
| `vite-plugin-pwa` | Generar manifiesto, service worker, precaché y actualización versionada evitando una implementación manual frágil. |
| `vitest` | Probar con el mismo pipeline TypeScript/Vite las reglas, normalización, estadísticas y nombres de exportación. |
| `@playwright/test` | Probar en Chromium flujos completos, IndexedDB, service worker, reinicio offline, respaldo y descargas. |

Workbox llegará como dependencia transitiva de `vite-plugin-pwa`; no se agregará como dependencia directa salvo que una necesidad demostrada obligue a cambiar de `generateSW` a un service worker personalizado.

No se agregarán Redux/Zustand, React Router, librerías de formularios, fechas, validación de esquemas ni frameworks CSS en V1. Los hooks de React, validadores propios, APIs estándar de fecha y CSS son suficientes para el alcance actual. Las dependencias se fijarán en el archivo de bloqueo del gestor de paquetes y no se cargarán desde CDN en tiempo de ejecución.

#### 11.6.3 Núcleo determinístico offline

El núcleo funciona íntegramente en el dispositivo y contiene:

- carga y normalización de datos;
- persistencia transaccional;
- búsqueda, edición y eliminación;
- detección de duplicados actuales y antecedentes históricos;
- validaciones estructurales y estados de revisión;
- evidencia de confirmaciones humanas;
- estadísticas y cierre;
- historial;
- exportación XLSX;
- respaldo y restauración JSON.

Las reglas se implementarán como funciones puras, sin importar React ni acceder directamente a IndexedDB. Los repositorios serán la única vía de persistencia. Las validaciones se ejecutarán antes de guardar, después de editar y antes de cerrar. Los índices de IndexedDB permitirán buscar las identificaciones normalizadas y detectar duplicados sin recorrer innecesariamente toda la base.

#### 11.6.4 Estado de interfaz

IndexedDB será la fuente de verdad durable. React mantendrá solo el estado de pantalla y una proyección de los datos necesarios para la vista activa. Se utilizarán `useState` para estado local y `useReducer` con Context cuando varias pantallas necesiten compartir la jornada activa o el estado de preparación offline. No se duplicará una base completa en un store global de memoria.

#### 11.6.5 Estrategia PWA y service worker

- manifiesto instalable con nombre, íconos, `start_url`, modo `standalone`, tema y alcance correctos;
- shell completo y bundles —incluido XLSX— precargados mediante `generateSW`;
- ausencia de llamadas obligatorias a APIs remotas;
- pantalla offline útil en lugar de un error de red;
- aviso **Lista para trabajar offline** únicamente cuando el service worker controle la página y termine el precaché;
- actualización tipo `prompt`: se informa una nueva versión y el usuario decide cuándo aplicarla;
- si hay una jornada abierta, no se permite una recarga automática causada por actualización;
- despliegue estático sobre HTTPS, configurando la base y el alcance para `/TF-Agente-Diagnostico-Prenez/` si se usa GitHub Pages.

#### 11.6.6 Instalación y comprobación antes de la jornada

Preparación inicial:

1. abrir la URL HTTPS en Chrome con conexión;
2. instalar la PWA desde Chrome y abrirla desde el ícono;
3. esperar el indicador **Lista para trabajar offline**;
4. solicitar persistencia de almacenamiento y mostrar si fue concedida;
5. ejecutar el autodiagnóstico técnico;
6. activar modo avión, cerrar completamente la PWA, reabrirla y repetir el chequeo crítico.

El autodiagnóstico verifica:

- service worker activo, controlador y versión de caché esperada;
- presencia de recursos críticos precargados;
- escritura, lectura y eliminación de un registro técnico temporal en IndexedDB;
- cuota estimada y estado de persistencia;
- posibilidad de generar un XLSX en memoria sin red;
- versión de aplicación y fecha/hora del último resultado exitoso.

El registro temporal del autodiagnóstico vive fuera de las jornadas productivas y se elimina al concluir; no constituye una corrida del agente ni evidencia productiva. El único chequeo decisivo del riesgo de caché es la reapertura real en modo avión desde el ícono instalado.

#### 11.6.7 Compatibilidad mínima

- Android 10 o posterior.
- Chrome 111 o posterior como piso técnico; para campo se recomienda la versión estable actualizada.
- Uso normal, no incógnito.
- Origen HTTPS y espacio de almacenamiento disponible.
- Otros navegadores y sistemas operativos quedan fuera de la compatibilidad garantizada de V1.

#### 11.6.8 Estrategia de respaldo

La persistencia web se solicitará como persistente, pero ese resultado no está garantizado. El respaldo recuperable de V1 será un archivo JSON con versión de esquema y todo el estado necesario. Se ofrecerá su descarga después de cada cierre y desde el historial.

La importación:

1. lee el archivo elegido por el usuario;
2. valida estructura y versión;
3. muestra jornadas y cantidades que se restaurarán;
4. requiere confirmación explícita;
5. restaura el snapshot completo en una transacción o revierte si falla.

No se intentará una fusión automática compleja en V1. XLSX es el reporte para uso externo y JSON es el respaldo para restaurar la aplicación.

#### 11.6.9 Componente agéntico futuro

El agente será un módulo separado que podrá:

- recibir una vista estructurada de una jornada mediante autorización explícita;
- consultar como herramientas las reglas y resultados determinísticos;
- explicar alertas en lenguaje natural;
- señalar patrones o casos que merezcan revisión y que no impliquen diagnosticar;
- preparar un resumen de revisión para una persona.

No tendrá acceso de escritura directo a IndexedDB, no modificará diagnósticos, no eliminará registros y no cerrará jornadas. Si el agente o la conexión no están disponibles, todas las capacidades enumeradas en el núcleo determinístico continúan funcionando. No se define todavía su prompt ni su contrato mínimo.

#### 11.6.10 Estrategia de pruebas

1. **Tipos y compilación:** comprobación estricta de TypeScript y build de producción.
2. **Unitarias con Vitest:** normalización, obligatoriedad, duplicados, estadísticas, redondeos, nombre de archivo y serialización de respaldo.
3. **Integración en Chromium con Playwright:** repositorios IndexedDB, migraciones, CRUD, cierre, historial, exportación, descarga y restauración.
4. **PWA de producción:** instalación, precaché, actualización confirmada, caché fría/caliente, pérdida de red, cierre y reapertura offline.
5. **Fallas:** cuota insuficiente, transacción abortada, respaldo inválido, descarga cancelada y actualización con jornada abierta.
6. **Dispositivo real:** Android/Chrome objetivo en modo avión durante un recorrido completo, incluyendo XLSX y respaldo JSON.
7. **Aceptación funcional:** ejecutar los criterios de la sección 12 y documentar resultados reales, sin confundir datos de prueba con corridas del agente.

#### 11.6.11 Riesgos aceptados y validaciones pendientes

Riesgos aceptados:

- la primera carga y el precaché requieren conectividad;
- el almacenamiento pertenece al origen y puede borrarse por acción del usuario, desinstalación o políticas del navegador;
- `navigator.storage.persist()` puede ser denegado;
- la descarga y localización de archivos varían según Chrome/Android;
- un error de service worker puede impedir el arranque offline;
- GitHub Pages usa un subdirectorio que exige rutas y alcance correctos.

Pendiente de demostrar mediante implementación:

- reapertura real en modo avión;
- persistencia, migraciones y recuperación transaccional;
- XLSX y respaldo/restauración JSON completamente offline;
- coordinación segura de actualizaciones con una jornada abierta;
- rendimiento con un volumen representativo;
- compatibilidad efectiva en al menos un celular Android objetivo.

Estas son validaciones pendientes, no capacidades ya probadas.

#### 11.6.12 Estructura de carpetas propuesta

Esta estructura se documenta, pero todavía no se crea:

```text
/
├── public/
│   └── icons/
├── src/
│   ├── app/
│   │   ├── App.tsx
│   │   └── AppContext.tsx
│   ├── components/
│   ├── features/
│   │   ├── jornadas/
│   │   ├── animales/
│   │   ├── revision/
│   │   ├── historial/
│   │   ├── exportacion/
│   │   └── preparacion-offline/
│   ├── domain/
│   │   ├── models/
│   │   ├── catalogs/
│   │   ├── normalization/
│   │   ├── validation/
│   │   └── statistics/
│   ├── infrastructure/
│   │   ├── db/
│   │   │   ├── schema.ts
│   │   │   ├── migrations.ts
│   │   │   └── repositories/
│   │   ├── export/
│   │   └── backup/
│   ├── agent/
│   │   └── ports.ts
│   ├── pwa/
│   ├── styles/
│   └── main.tsx
├── tests/
│   ├── unit/
│   └── e2e/
├── index.html
├── package.json
├── package-lock.json
├── tsconfig.json
└── vite.config.ts
```

`agent/ports.ts` reservará únicamente la frontera tipada del futuro agente; no contendrá un prompt definitivo ni será necesario para operar V1.

Referencias primarias consultadas:

- [Vite: guía y compatibilidad](https://vite.dev/guide/)
- [React: estado con reducer y context](https://react.dev/learn/scaling-up-with-reducer-and-context)
- [vite-plugin-pwa: registro y estado offline](https://github.com/vite-pwa/vite-plugin-pwa/blob/main/docs/frameworks/index.md)
- [MDN: operación offline en PWA](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Offline_and_background_operation)
- [MDN: IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
- [`idb`: repositorio oficial](https://github.com/jakearchibald/idb)
- [MDN: cuotas y persistencia de almacenamiento](https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria)
- [SheetJS CE: escritura de archivos](https://docs.sheetjs.com/docs/api/write-options/)
- [Chrome DevTools: depuración de PWA](https://developer.chrome.com/docs/devtools/progressive-web-apps)
- [Vitest: integración con Vite](https://vitest.dev/guide/why.html)
- [Playwright: service workers](https://playwright.dev/docs/service-workers)

## 12. Criterios de aceptación funcional

V1 será funcionalmente aceptable cuando se pueda demostrar, sin conexión:

1. el inicio de una jornada válida para cada lugar permitido;
2. la carga consecutiva de animales usando solo identificación oficial, solo caravana de color y ambas;
3. el rechazo de un registro sin ninguna identificación completa;
4. la aceptación de caravanas con color solo o con color y número, y el rechazo de números sin color o con caracteres no numéricos;
5. la obligatoriedad de diagnóstico, boqueo y condición corporal en el flujo normal;
6. la actualización del contador y la limpieza segura del formulario;
7. la búsqueda, edición y eliminación antes del cierre;
8. la alerta fuerte y revisión humana ante un duplicado de la jornada, sin bloquear un antecedente histórico;
9. la preservación del diagnóstico original frente a cualquier alerta;
10. la revisión humana explícita antes de cerrar con alertas;
11. el cálculo de porcentajes con los denominadores aprobados y un decimal;
12. la coincidencia entre registros, resumen y exportación `.xlsx`;
13. la presentación de `0,0%` para Cabeza, Cuerpo, Cola y Robo cuando no existan vacas preñadas;
14. el rechazo del cierre de una jornada sin animales;
15. la persistencia de evidencia cuando una persona decide conservar un duplicado revisado;
16. la consulta y nueva exportación de una jornada cerrada después de volver a abrir la aplicación;
17. la conservación de la jornada cerrada hasta su eliminación manual;
18. la generación de XLSX sin conexión desde los datos persistidos;
19. la exportación y restauración confirmada de un respaldo JSON válido, y el rechazo de uno inválido;
20. el chequeo exitoso y la reapertura de la PWA instalada en modo avión en un celular Android compatible.

Estos criterios describen pruebas futuras; no constituyen evidencia de que la aplicación ya exista o haya sido validada.

## 13. Fuera de alcance de V1

- lectura RFID;
- integración con bases externas;
- sincronización en la nube;
- diagnóstico automático de preñez;
- reemplazo del criterio veterinario.

## 14. Decisiones y preguntas pendientes

Antes de implementar se deben resolver o confirmar:

1. contrato mínimo, herramientas y límites del componente agéntico;
2. definición formal de la escala L0–L4 usada por la materia para reemplazar la relación preliminar;
3. longitudes máximas de los identificadores, como decisión técnica menor de implementación.

## 15. Metodología de iteración del agente

Los archivos `prompts/system_prompt.md` y `prompts/user_prompt.md` se conservan como una V0 mínima, inicial y no calibrada. No se ampliarán anticipando errores que todavía no hayan aparecido.

El ciclo de trabajo será:

1. ejecutar una primera corrida real autorizada;
2. observar un error textual o de comportamiento concreto;
3. modificar una sola sección o regla;
4. repetir la corrida en condiciones comparables;
5. documentar en `DECISIONES.md` el estado **antes**, el **cambio único** y el resultado **después**.

La ejecutabilidad y utilidad de la V0 se evaluarán mediante esa primera corrida. Hasta entonces no existe evidencia de desempeño y no se crearán corridas ficticias.
