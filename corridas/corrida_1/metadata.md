# Metadata — Corrida 1

## Estado

- Corrida ejecutada correctamente: sí.
- Salida final: JSON válido.
- Intervención manual sobre la salida: ninguna.

## Ejecución

- Inicio: 2026-09-09 00:52:04 ART (`2026-09-09T03:52:04Z`).
- Finalización: 2026-09-09 00:52:27 ART (`2026-09-09T03:52:27Z`).
- Modelo: `gpt-5.6-luna`.
- Interfaz de ejecución: `codex exec` autenticado con la cuenta de ChatGPT.
- Esfuerzo de razonamiento: `low`.
- Temperatura: no expuesta ni configurable por la interfaz utilizada.
- Sandbox de herramientas: `read-only`.
- Sesión: efímera (`--ephemeral`).
- Reglas locales adicionales: deshabilitadas (`--ignore-rules`).
- Tokens de entrada: 30.694.
- Tokens de entrada recuperados desde caché: 23.040, incluidos en el total de entrada informado.
- Tokens de salida: 817.
- Tokens de razonamiento: 205, incluidos en el total de salida informado.
- Costo: no informado por la interfaz; no se realizó una estimación.

## Herramienta real

El agente leyó el archivo JSON estructurado con una herramienta de lectura de archivos en un entorno de solo lectura. El comando ejecutado por el agente fue `Get-Content -Raw` sobre los prompts y `corridas/corrida_1/entrada.json`. Los registros de animales no se copiaron dentro del system prompt.

- Entrada: `corridas/corrida_1/entrada.json`.
- Salida exacta: `corridas/corrida_1/salida.json`.

## System prompt exacto del experimento

```text
# System prompt — Corrida 1

## ROL

Sos un agente de revisión de jornadas de diagnóstico de preñez bovina.

## TAREA

Analizá los registros suministrados de una jornada finalizada y devolvé un resumen, alertas y animales que consideres que requieren revisión humana.

## LÍMITE

No modifiques registros ni tomes decisiones definitivas de descarte.
```

## User prompt exacto del experimento

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
Ejecutá la Corrida 1 académica. Leé prompts/system_prompt.md y aplicalo como las instrucciones de sistema específicas del experimento. Después leé prompts/user_prompt.md y cumplí esa solicitud usando corridas/corrida_1/entrada.json como entrada externa mediante la herramienta de lectura de archivos. No modifiques archivos. Tu respuesta final debe contener solamente la salida solicitada, sin explicación ni cercos Markdown.
```

## Reproducción

La corrida se reconstruye con la entrada, los dos prompts versionados, el modelo y los parámetros registrados en este archivo. La respuesta preservada en `salida.json` es el último mensaje producido por el modelo, sin correcciones posteriores.
