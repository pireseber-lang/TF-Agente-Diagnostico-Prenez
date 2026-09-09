# Metadata — Corrida 3

## Estado

- Corrida ejecutada correctamente: sí.
- Salida final: JSON válido.
- Intervención manual sobre la salida: ninguna.
- Cantidad de ejecuciones de Corrida 3: una.

## Ejecución

- Inicio: 2026-09-09 19:49:19 ART (`2026-09-09T22:49:19Z`).
- Finalización: 2026-09-09 19:49:43 ART (`2026-09-09T22:49:43Z`).
- Modelo: `gpt-5.6-luna`.
- Interfaz de ejecución: `codex exec` 0.153.4 autenticado con la cuenta de ChatGPT.
- Esfuerzo de razonamiento: `low`.
- Temperatura: no expuesta ni configurable por la interfaz utilizada.
- Sandbox de herramientas: `read-only`.
- Sesión: efímera (`--ephemeral`).
- Reglas locales adicionales: deshabilitadas (`--ignore-rules`).
- Eventos de ejecución: JSONL (`--json`).
- Tokens de entrada: 30.904.
- Tokens de entrada recuperados desde caché: 23.040, incluidos en el total de entrada informado.
- Tokens de salida: 952.
- Tokens de razonamiento: 349, incluidos en el total de salida informado.
- Costo: no informado por la interfaz; no se realizó una estimación.

## Entrada y herramienta real

El agente leyó el archivo JSON estructurado con una herramienta de lectura de archivos en un entorno de solo lectura. El comando ejecutado por el agente fue `Get-Content -Raw` sobre los prompts y `corridas/corrida_3/entrada.json`.

- Entrada: `corridas/corrida_3/entrada.json`.
- Salida exacta: `corridas/corrida_3/salida.json`.
- SHA-256 de la entrada: `FD9B972D5B3E2D99E4A3B22A4EC6DF48DE10B6E91C09B810F45E9A216BFF1DEE`.
- Relación con Corridas 1 y 2: la entrada es idéntica byte a byte a las dos entradas anteriores, que tienen el mismo SHA-256.

## Único cambio respecto de Corrida 2

Solo se agregó al system prompt la sección `REGLA DE CONSISTENCIA`, con esta regla:

> Antes de emitir la salida final, verificá que todo conteo numérico mencionado en el resumen, las alertas o la conclusión coincida con los registros de entrada y con el detalle de animales incluido en la propia salida. Si enumerás casos individuales de una categoría, el total informado para esa categoría debe coincidir con la cantidad de casos que cumplen ese criterio.

No se modificó el user prompt ni se agregó ninguna otra regla.

## Evaluación controlada: Corrida 2 vs Corrida 3

La falla objetivo quedó corregida en Corrida 3. La alerta `identificacion_incompleta` informa **5 animales** sin prefijo e identificador oficial y la sección `animales_a_revisar` incluye los cinco casos que cumplen ese criterio: `Celeste-1523`, `Celeste-45`, `Celeste-545`, `Celeste-753` y `Celeste-900`. El orden del detalle difiere del orden de entrada, pero el conjunto y la cantidad coinciden.

La salida se preservó sin correcciones. Como observación adicional de la respuesta real, fuera de la falla elegida como objetivo, la alerta de condición corporal afirma que hay 6 animales con condición corporal menor o igual a 2,25, mientras que la entrada contiene 7. No se agregó una regla nueva, no se corrigió manualmente la salida y no se ejecutó otra corrida.

## System prompt exacto del experimento

```text
# System prompt — Corrida 1

## ROL

Sos un agente de revisión de jornadas de diagnóstico de preñez bovina.

## TAREA

Analizá los registros suministrados de una jornada finalizada y devolvé un resumen, alertas y animales que consideres que requieren revisión humana.

## LÍMITE

No modifiques registros ni tomes decisiones definitivas de descarte.

## REGLA DE DUPLICADOS

Considerar duplicado por identificación oficial únicamente cuando coincidan simultáneamente el prefijo oficial y el identificador individual actuales de ambos animales. El campo `duplicateReviews` registra una revisión humana realizada previamente y no constituye por sí solo evidencia de que exista una coincidencia vigente. Ante una diferencia entre `duplicateReviews` y los campos actuales de identificación, prevalecen los campos actuales.

## REGLA DE CONSISTENCIA

Antes de emitir la salida final, verificá que todo conteo numérico mencionado en el resumen, las alertas o la conclusión coincida con los registros de entrada y con el detalle de animales incluido en la propia salida. Si enumerás casos individuales de una categoría, el total informado para esa categoría debe coincidir con la cantidad de casos que cumplen ese criterio.
```

## User prompt exacto del experimento

El user prompt se conservó sin cambios respecto de las Corridas 1 y 2. Su referencia interna continúa apuntando a la entrada de Corrida 1; el ejecutor indicó explícitamente `corridas/corrida_3/entrada.json`, cuyo contenido es idéntico byte a byte.

````text
# User prompt — Corrida 1

Leé `corridas/corrida_1/entrada.json`, analizá la jornada y devolvé únicamente un JSON válido con esta estructura exacta, sin campos adicionales:

```json
{
  "jornada": {
    "fecha": "...",
    "lugar": "...",
    "total_animales": 0
  },
  "resumen": {
    "prenadas": 0,
    "vacias": 0
  },
  "alertas": [
    {
      "tipo": "...",
      "descripcion": "..."
    }
  ],
  "animales_a_revisar": [
    {
      "identificacion": "...",
      "motivo": "..."
    }
  ],
  "conclusion": "..."
}
```
````

## Instrucción exacta del ejecutor

El cliente Codex agregó sus instrucciones propias de plataforma. Como mensaje de ejecución se utilizó exactamente:

```text
Ejecutá la Corrida 3 académica. Leé prompts/system_prompt.md y aplicalo como las instrucciones de sistema específicas del experimento. Después leé prompts/user_prompt.md y cumplí esa solicitud usando corridas/corrida_3/entrada.json como entrada externa mediante la herramienta de lectura de archivos. No modifiques archivos. Tu respuesta final debe contener solamente la salida solicitada, sin explicación ni cercos Markdown.
```

## Reproducción

La corrida se reconstruye con la entrada, los dos prompts versionados, el modelo y los parámetros registrados en este archivo. La respuesta preservada en `salida.json` es el último mensaje producido por el modelo, sin correcciones posteriores.
