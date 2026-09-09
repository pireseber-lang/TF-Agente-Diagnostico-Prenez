# Metadata — Corrida 2

## Estado

- Corrida ejecutada correctamente: sí.
- Salida final: JSON válido.
- Intervención manual sobre la salida: ninguna.
- Cantidad de ejecuciones de Corrida 2: una.

## Ejecución

- Inicio: 2026-09-09 01:02:47 ART (`2026-09-09T04:02:47Z`).
- Finalización: 2026-09-09 01:03:10 ART (`2026-09-09T04:03:10Z`).
- Modelo: `gpt-5.6-luna`.
- Interfaz de ejecución: `codex exec` autenticado con la cuenta de ChatGPT.
- Esfuerzo de razonamiento: `low`.
- Temperatura: no expuesta ni configurable por la interfaz utilizada.
- Sandbox de herramientas: `read-only`.
- Sesión: efímera (`--ephemeral`).
- Reglas locales adicionales: deshabilitadas (`--ignore-rules`).
- Tokens de entrada: 30.793.
- Tokens de entrada recuperados desde caché: 23.040, incluidos en el total de entrada informado.
- Tokens de salida: 911.
- Tokens de razonamiento: 243, incluidos en el total de salida informado.
- Costo: no informado por la interfaz; no se realizó una estimación.

## Entrada y herramienta real

El agente leyó el archivo JSON estructurado con una herramienta de lectura de archivos en un entorno de solo lectura. El comando ejecutado por el agente fue `Get-Content -Raw` sobre los prompts y `corridas/corrida_2/entrada.json`.

- Entrada: `corridas/corrida_2/entrada.json`.
- Salida exacta: `corridas/corrida_2/salida.json`.
- SHA-256 de la entrada: `FD9B972D5B3E2D99E4A3B22A4EC6DF48DE10B6E91C09B810F45E9A216BFF1DEE`.
- Relación con Corrida 1: la entrada es idéntica byte a byte a `corridas/corrida_1/entrada.json`, que tiene el mismo SHA-256.

## Único cambio respecto de Corrida 1

Solo se agregó al system prompt la sección `REGLA DE DUPLICADOS`, con esta regla:

> Considerar duplicado por identificación oficial únicamente cuando coincidan simultáneamente el prefijo oficial y el identificador individual actuales de ambos animales. El campo `duplicateReviews` registra una revisión humana realizada previamente y no constituye por sí solo evidencia de que exista una coincidencia vigente. Ante una diferencia entre `duplicateReviews` y los campos actuales de identificación, prevalecen los campos actuales.

No se modificó el user prompt ni se agregó ninguna otra regla.

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
```

## User prompt exacto del experimento

El user prompt se conservó sin cambios respecto de Corrida 1. Su referencia interna continúa apuntando a la entrada de Corrida 1; el ejecutor indicó explícitamente `corridas/corrida_2/entrada.json`, cuyo contenido es idéntico byte a byte.

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
Ejecutá la Corrida 2 académica. Leé prompts/system_prompt.md y aplicalo como las instrucciones de sistema específicas del experimento. Después leé prompts/user_prompt.md y cumplí esa solicitud usando corridas/corrida_2/entrada.json como entrada externa mediante la herramienta de lectura de archivos. No modifiques archivos. Tu respuesta final debe contener solamente la salida solicitada, sin explicación ni cercos Markdown.
```

## Reproducción

La corrida se reconstruye con la entrada, los dos prompts versionados, el modelo y los parámetros registrados en este archivo. La respuesta preservada en `salida.json` es el último mensaje producido por el modelo, sin correcciones posteriores.
