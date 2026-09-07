# Especificación funcional V1

- **Proyecto:** Diagnóstico de preñez en manga
- **Versión del documento:** 0.2
- **Fecha:** 2026-09-06
- **Estado:** Definiciones funcionales V1 aprobadas; arquitectura tecnológica pendiente

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
| Número de caravana de color | Numérico | Condicional | Solo dígitos; ejemplos: `1342`, `528` |
| Diagnóstico | Opción única | Sí | Preñada Cabeza, Preñada Cuerpo, Preñada Cola, Preñada Robo o Vacía |
| Boqueo | Opción única | Sí | Diente lleno, Diente medio, Diente cuarto o Sin Diente |
| Condición corporal | Número decimal | Sí | Se almacena como número; la interfaz muestra 2; 2,25; 2,5; 2,75; 3; 3,25; 3,5; 3,75; 4; 4,25; 4,5 |
| Observaciones | Texto libre | No | Contenido ingresado por el usuario |

Reglas de identificación aprobadas:

- La identificación oficial se considera completa cuando tiene prefijo e ID individual.
- La identificación por caravana de color se considera completa cuando tiene color y número.
- Para guardar debe existir al menos uno de esos dos esquemas completos.
- Un animal puede tener solamente la identificación oficial completa, solamente la caravana de color completa o ambas completas.
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
| RF-03 | Impedir el guardado cuando no exista al menos una identificación completa o cuando exista un par de identificación parcial. |
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

V1 almacenará información localmente. Las jornadas se conservan mientras el usuario no las elimine manualmente. Como V1 no incluye sincronización en la nube, no garantiza recuperación después de borrar los datos del navegador, desinstalar la aplicación o perder el dispositivo; la exportación será el mecanismo disponible para obtener una copia externa.

### 11.5 Trazabilidad académica en GitHub

El repositorio público del proyecto es [pireseber-lang/TF-Agente-Diagnostico-Prenez](https://github.com/pireseber-lang/TF-Agente-Diagnostico-Prenez). La documentación, las decisiones, los cambios futuros y las evidencias reales de iteración deberán conservar trazabilidad en GitHub. No se usarán corridas ficticias como evidencia.

### 11.6 Evaluación arquitectónica preliminar

La arquitectura tecnológica definitiva permanece pendiente. La siguiente comparación es una propuesta para revisión y no autoriza implementación.

#### Arquitectura recomendada: PWA mobile-first

| Componente | Propuesta preliminar |
|---|---|
| Interfaz | Aplicación web mobile-first en TypeScript, con un framework de interfaz liviano a seleccionar |
| Instalación y offline | Progressive Web App con manifiesto y service worker para almacenar el shell de la aplicación |
| Persistencia | IndexedDB detrás de una capa propia de acceso a datos y migraciones |
| Reglas | Motor determinístico local, compuesto por funciones de dominio versionadas y comprobables |
| Exportación | Generación de `.xlsx` en el navegador mediante una biblioteca especializada; SheetJS CE es el candidato inicial a evaluar |
| Componente agéntico | Módulo separado del circuito crítico, con herramientas acotadas para leer registros y reglas, producir análisis y crear alertas; una futura integración con LLM sería opcional y no bloquearía la operación offline |

**Ventajas:** encaja directamente con el requisito de webapp, permite una sola base de código, instalación desde el navegador y funcionamiento offline. IndexedDB ofrece almacenamiento estructurado, indexado, asíncrono y transaccional, adecuado para búsquedas locales. La exportación puede ejecutarse en el navegador.

**Desventajas:** el almacenamiento web está sujeto a políticas de cuota y eventual eliminación del navegador; la aplicación debe cargarse, instalarse y completar su caché inicial con conectividad antes de depender de ella en el campo; la instalación y la descarga de archivos varían según navegador y sistema operativo; exige pruebas reales en los celulares objetivo y una estrategia explícita de respaldo.

**Complejidad estimada:** media y la menor de las alternativas consideradas para esta V1.

#### Alternativa 1: aplicación web empaquetada con Capacitor

Mantener una interfaz TypeScript/web, incorporando Capacitor para distribuirla como aplicación Android/iOS y acceder a capacidades nativas. La persistencia podría migrar a SQLite mediante un plugin validado y la exportación podría usar el sistema nativo de archivos o compartir.

**Ventajas:** mayor control del almacenamiento y de los archivos, acceso a APIs nativas y camino claro hacia tiendas de aplicaciones.

**Desventajas:** agrega proyectos nativos, plugins, compilación por plataforma, permisos, pruebas y posible mantenimiento de tiendas. Es una complejidad prematura si la PWA satisface las pruebas en campo.

**Complejidad estimada:** media-alta.

#### Alternativa 2: Flutter para móvil y web

Construir una aplicación en Dart/Flutter con una base de código para Android, iOS y navegador, una base local compatible con los objetivos elegidos y una biblioteca de exportación XLSX.

**Ventajas:** interfaz móvil consistente, buen camino hacia binarios nativos y una única tecnología para múltiples plataformas.

**Desventajas:** introduce Dart y un ecosistema distinto al web estándar; requiere validar con especial cuidado el modo offline web, la persistencia y la descarga XLSX; para una V1 centrada en formularios puede tener mayor costo inicial.

**Complejidad estimada:** alta.

#### Fundamento y validaciones necesarias

La documentación web de referencia indica que los service workers permiten cachear recursos para operación offline y que IndexedDB permite persistir y consultar datos estructurados sin conectividad. SheetJS documenta generación de archivos XLSX directamente en el navegador. Capacitor documenta el empaquetado de aplicaciones web para plataformas nativas, y Flutter documenta una base de código dirigida a móvil y web.

Antes de decidir se debe realizar una prueba técnica breve en los dispositivos objetivo que verifique instalación, reapertura offline, persistencia tras cerrar el navegador, cuota/evicción, búsquedas, exportación y recuperación de archivos.

Referencias primarias consultadas:

- [MDN: operación offline y en segundo plano en PWA](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Offline_and_background_operation)
- [MDN: IndexedDB API](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
- [SheetJS CE: tutorial de exportación](https://docs.sheetjs.com/docs/getting-started/examples/export/)
- [Capacitor: documentación oficial](https://capacitorjs.com/docs)
- [Flutter: soporte web](https://docs.flutter.dev/platform-integration/web)

## 12. Criterios de aceptación funcional

V1 será funcionalmente aceptable cuando se pueda demostrar, sin conexión:

1. el inicio de una jornada válida para cada lugar permitido;
2. la carga consecutiva de animales usando solo identificación oficial, solo caravana de color y ambas;
3. el rechazo de un registro sin ninguna identificación completa;
4. el rechazo de cualquier identificación parcial y de números de caravana con caracteres no numéricos;
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
17. la conservación de la jornada cerrada hasta su eliminación manual.

Estos criterios describen pruebas futuras; no constituyen evidencia de que la aplicación ya exista o haya sido validada.

## 13. Fuera de alcance de V1

- lectura RFID;
- integración con bases externas;
- sincronización en la nube;
- diagnóstico automático de preñez;
- reemplazo del criterio veterinario.

## 14. Decisiones y preguntas pendientes

Antes de implementar se deben resolver o confirmar:

1. definición tecnológica final detallada;
2. contrato mínimo, herramientas y límites del componente agéntico;
3. definición formal de la escala L0–L4 usada por la materia para reemplazar la relación preliminar;
4. bibliotecas concretas y políticas técnicas de persistencia local y exportación XLSX;
5. compatibilidad mínima de navegadores y celulares;
6. longitudes máximas de los identificadores, como decisión técnica menor de implementación.

## 15. Metodología de iteración del agente

Los archivos `prompts/system_prompt.md` y `prompts/user_prompt.md` se conservan como una V0 mínima, inicial y no calibrada. No se ampliarán anticipando errores que todavía no hayan aparecido.

El ciclo de trabajo será:

1. ejecutar una primera corrida real autorizada;
2. observar un error textual o de comportamiento concreto;
3. modificar una sola sección o regla;
4. repetir la corrida en condiciones comparables;
5. documentar en `DECISIONES.md` el estado **antes**, el **cambio único** y el resultado **después**.

La ejecutabilidad y utilidad de la V0 se evaluarán mediante esa primera corrida. Hasta entonces no existe evidencia de desempeño y no se crearán corridas ficticias.
