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
