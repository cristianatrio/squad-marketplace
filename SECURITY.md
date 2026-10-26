# Seguridad

## Reportar una vulnerabilidad

Usá el reporte privado de GitHub: pestaña **Security → Report a vulnerability** de este repositorio. No abras un issue público.

## Qué contiene el plugin

`squad` es solo texto: una skill y nueve agentes en Markdown, más manifiestos JSON. **No incluye hooks, servidores MCP, ejecutables ni dependencias**, así que instalarlo no ejecuta código.

Lo que sí hace es darle instrucciones a Claude Code para que delegue trabajo en subagentes. Los riesgos y los controles son estos:

| Riesgo | Control |
|---|---|
| Un agente usa herramientas de más (por ejemplo, tus MCP de correo, ads o cloud) | Cada agente tiene una lista explícita de herramientas (`tools:`). Ninguno hereda tus MCP, salvo `qa`, que solo recibe `mcp__playwright__*` |
| Delegación en cadena que dispara el gasto | Ningún agente tiene la herramienta `Agent`: no pueden lanzar subagentes |
| Prompt injection desde el repo, issues o páginas web | Los agentes tratan ese contenido como datos, no como instrucciones, y reportan los intentos |
| Acciones irreversibles (deploys, stores, bases remotas) | Prohibidas sin autorización explícita del usuario para esa acción concreta |
| Filtración de secretos | Los agentes nombran variables, nunca copian valores. `.squad/` se agrega al `.gitignore` del proyecto |

Los agentes respetan el modo de permisos y las reglas `permissions.deny` de tu sesión. Si querés más control, usá Claude Code en modo con confirmación y revisá el plan del orquestador antes de aprobarlo.

## Versiones soportadas

Solo la última versión publicada en `main`.
