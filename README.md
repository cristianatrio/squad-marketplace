# Squad: un equipo de desarrollo web y mobile dentro de Claude Code

[![validate](https://github.com/cristianatrio/squad-marketplace/actions/workflows/validate.yml/badge.svg)](https://github.com/cristianatrio/squad-marketplace/actions/workflows/validate.yml)

Un plugin de Claude Code que convierte la sesión en un equipo de ingeniería. La sesión principal hace de **CTO**: entiende el pedido, decide cuánto equipo hace falta, elige para cada tarea el modelo más barato que alcance, delega en especialistas, verifica y entrega un resumen ejecutivo.

```
/squad:orquestador app para que los feriantes registren ventas y fiado, con login y sincronización
```

Tiene dos reglas que no negocia:

1. **Gastar la menor cantidad de tokens que resuelva bien la tarea.**
2. **Que el resultado no parezca hecho con IA.**

## Equipo

| Agente | Rol | Modelo · esfuerzo |
|---|---|---|
| `squad:product` | PM: brief, historias, criterios de aceptación | sonnet · medium |
| `squad:designer` | UX/UI: concepto propio, tokens, pantallas | sonnet · high (opus en productos nuevos) |
| `squad:frontend` | Web: React, Next.js, Astro, Svelte | sonnet · medium |
| `squad:mobile` | Expo / React Native, Flutter, Swift, Kotlin | sonnet · medium |
| `squad:backend` | Backend / BFF: APIs, datos, auth | sonnet · medium |
| `squad:qa` | Unit, integración y e2e con Playwright | sonnet · medium |
| `squad:security` | OWASP Top 10 y MASVS | sonnet · high |
| `squad:release` | CI/CD, deploy, App Store y Google Play | haiku · low |
| `squad:architect` | Stack, contratos, ownership | opus · high |

## Cómo ahorra tokens

- **Decide si delegar.** Las tareas chicas (≤ 2 archivos o ≤ 5 tool calls) las resuelve el orquestador solo. Una feature acotada va a un solo agente en secuencia. Solo hay agentes en paralelo cuando los workstreams son independientes y sustanciales.
- **Elige el modelo según la tarea.**
  - **haiku**: lo mecánico (CI, configs, boilerplate, tests desde criterios explícitos).
  - **sonnet**: la implementación.
  - **opus**: el juicio difícil (arquitectura nueva, dirección creativa, auth y pagos).
- **Esfuerzo fijo por rol**, para no pagar razonamiento extra donde no suma.
- **Agentes livianos.**
  - Arrancan sin CLAUDE.md (`omitClaudeMd`); las convenciones que aplican van en el brief.
  - Precargan solo 2 skills chicas.
  - Las demás las cargan on demand, como mucho 1–2.
- **Comunicación por archivos.** Los prompts apuntan a `.squad/brief.md` y `.squad/contracts.md` en vez de pegar su contenido. Los reportes tienen como mucho 150 palabras.
- **Correcciones con SendMessage**, que reusa el contexto ya pagado. Máximo una ronda por agente.
- **Aprobación.** Antes de lanzar más de un agente, te muestra el plan con modelos y por qué no alcanza con menos agentes.

## Nada genérico

Toda UI nueva pasa por una dirección creativa definida en la skill [`squad:anti-generic`](plugins/squad/skills/anti-generic/SKILL.md), que también podés usar sola con `/squad:anti-generic`:

- **Concepto antes que pantallas**: un mundo visual sacado del rubro y del usuario reales, un elemento firma, una tipografía con carácter y una paleta con nombres de origen. "Moderno y limpio" no cuenta como concepto.
- **En productos nuevos**: el designer propone 2 direcciones opuestas y vos elegís.
- **Lista de prohibidos**: los degradés violeta, el hero centrado con "Empezar / Saber más", las 3 cards con íconos, shadcn sin intervenir, el copy de "Revolucioná tu…", y más.
- **Implementación**: frontend y mobile implementan fiel al concepto, sin volver a los defaults del framework.
- **Chequeo final**: una captura de la pantalla principal contra la lista de prohibidos.

## Seguridad

- **Herramientas mínimas**: cada agente tiene una lista explícita de herramientas. Ninguno hereda tus MCP (correo, ads, cloud…), salvo QA, que solo recibe Playwright.
- **Sin delegación en cadena**: los agentes no pueden lanzar otros agentes.
- **Contra prompt injection**: lo que viene del repo, de issues o de la web es dato, no instrucción.
- **Acciones irreversibles**: sin deploys, publicación en stores ni cambios en bases remotas, salvo que lo autorices explícitamente.
- **Secretos**: se nombran, nunca se copian. `.squad/` se agrega al `.gitignore` del proyecto.
- **El plugin no ejecuta código**: no tiene hooks, MCP, binarios ni dependencias.

Detalle en [SECURITY.md](SECURITY.md).

## Instalación

```
/plugin marketplace add cristianatrio/squad-marketplace
/plugin install squad@squad-marketplace
```

## Skills recomendadas

Cada agente precarga dos skills. Si te falta alguna, el agente igual funciona, pero sin esa especialización (Claude Code la saltea).

```
npx skills add davila7/claude-code-templates -g -s product-manager-toolkit concise-planning frontend-design senior-frontend react-best-practices mobile-design react-native-architecture senior-backend backend-patterns senior-qa webapp-testing senior-security security-review deployment-procedures senior-devops senior-architect
npx skills add nextlevelbuilder/ui-ux-pro-max-skill -g -s design-system
npx skills add mattpocock/skills -g -s codebase-design
```

| Agente | Skills precargadas |
|---|---|
| product | product-manager-toolkit, concise-planning |
| designer | frontend-design, design-system |
| frontend | senior-frontend, react-best-practices |
| mobile | mobile-design, react-native-architecture |
| backend | senior-backend, backend-patterns |
| qa | senior-qa, webapp-testing |
| security | senior-security, security-review |
| release | deployment-procedures, senior-devops |
| architect | senior-architect, codebase-design |

QA usa además el MCP de Playwright, si lo tenés configurado como `playwright`.

## Personalizar

- **Modelo, esfuerzo, herramientas y skills**: en el frontmatter de `plugins/squad/agents/*.md`.
- **Reglas del CTO**: en `plugins/squad/skills/orquestador/SKILL.md`.
- **Reglas anti-genérico**: en `plugins/squad/skills/anti-generic/SKILL.md`.
- **Que los agentes lean tus CLAUDE.md**: sacá `omitClaudeMd: true` del agente. Va a costar más tokens.

## Licencia

MIT
