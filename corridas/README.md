# Corridas

Esta carpeta documenta las corridas reales del agente académico. Cada corrida debe conservar su entrada estructurada, la salida exacta del modelo y los metadatos necesarios para reconstruirla.

`corrida_1/` contiene la línea de base mínima ejecutada sobre 10 registros reales extraídos de IndexedDB. No se agregan ejemplos ficticios como evidencia ni se corrigen manualmente las respuestas preservadas.

`corrida_2/` repite exactamente la entrada y los parámetros de Corrida 1 después de agregar una sola regla al system prompt para contrastar duplicados contra los campos actuales de identificación oficial.

`corrida_3/` vuelve a usar la misma entrada y los mismos parámetros después de agregar una única regla de consistencia entre conteos, entrada y detalle. Corrigió el conteo objetivo de animales sin identificación oficial, pero dejó como limitación residual otro conteo incorrecto de condición corporal. No se ejecutará una Corrida 4 y ninguna salida se corrige manualmente.

Las tres entradas son idénticas byte a byte y comparten el SHA-256 `FD9B972D5B3E2D99E4A3B22A4EC6DF48DE10B6E91C09B810F45E9A216BFF1DEE`. `prompts/system_prompt.md` contiene la versión final usada en Corrida 3; las versiones exactas anteriores están incluidas en los respectivos archivos `metadata.md`, junto con fecha, modelo, parámetros, tokens y mensaje de ejecución.
