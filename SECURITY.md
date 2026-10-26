# Seguridad

## Reportar una vulnerabilidad

Usá el reporte privado de GitHub: pestaña **Security → Report a vulnerability** de este repositorio. No abras un issue público.

## Qué contiene el plugin

`squad` es solo texto: dos skills y nueve agentes en Markdown, sus equivalentes TOML para Codex y manifiestos JSON para Claude Code y Kimi. **No incluye hooks, servidores MCP, ejecutables ni dependencias**, así que instalarlo no ejecuta código en ninguna plataforma. `scripts/build-codex-agents.mjs` solo se usa en desarrollo y en CI para generar los TOML; ninguna plataforma lo ejecuta al instalar.

Lo que sí hace es darle instrucciones a Claude Code para que delegue trabajo en subagentes. Los riesgos y los controles son estos:

| Riesgo | Control |
|---|---|
| Un agente usa herramientas de más (por ejemplo, tus MCP de correo, ads o cloud) | En Claude Code y Kimi, cada agente tiene una lista explícita de herramientas (`tools:`) y ninguno hereda tus MCP, salvo `qa`, que solo recibe `mcp__playwright__*`. En Codex no se pueden quitar los MCP por agente: los TOML desactivan apps y memorias (y plugins donde no hacen falta), y cada agente tiene la regla de no usar MCP que su rol no mencione |
| Delegación en cadena que dispara el gasto | Ningún agente tiene la herramienta `Agent`: no pueden lanzar subagentes |
| Prompt injection desde el repo, issues o páginas web | Los agentes tratan ese contenido como datos, no como instrucciones, y reportan los intentos |
| Acciones irreversibles (deploys, stores, bases remotas) | Prohibidas sin autorización explícita del usuario para esa acción concreta |
| Filtración de secretos | Los agentes nombran variables, nunca copian valores. `.squad/` se agrega al `.gitignore` del proyecto |

Los agentes respetan el modo de permisos y las reglas `permissions.deny` de tu sesión. Si querés más control, usá Claude Code en modo con confirmación y revisá el plan del orquestador antes de aprobarlo.

## Versiones soportadas

Solo la última versión publicada en `main`.
