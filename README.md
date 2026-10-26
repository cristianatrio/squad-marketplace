# Squad: un equipo de desarrollo web y mobile dentro de Claude Code

[![validate](https://github.com/cristianatrio/squad-marketplace/actions/workflows/validate.yml/badge.svg)](https://github.com/cristianatrio/squad-marketplace/actions/workflows/validate.yml)

Un plugin para **Claude Code, Codex (y la app de escritorio de ChatGPT) y Kimi Code** que convierte la sesión en un equipo de ingeniería. La sesión principal hace de **CTO**: entiende el pedido, decide cuánto equipo hace falta, elige para cada tarea el modelo más barato que alcance, delega en especialistas, verifica y entrega un resumen ejecutivo.

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

## Plataformas

| | Claude Code | Codex / ChatGPT desktop | Kimi Code |
|---|---|---|---|
| Skills `orquestador` y `anti-generic` | ✅ | ✅ | ✅ |
| 9 agentes especialistas | ✅ | ✅ instalando los TOML | ✅ |
| Modelo según la tarea | ✅ haiku / sonnet / opus | fijo por agente (en el TOML) | ❌ usa el modelo de la sesión |
| Esfuerzo por rol | ✅ | ✅ | ❌ |
| Herramientas restringidas por agente | ✅ | ⚠️ heredan los MCP de la sesión; tienen la regla de no usarlos | ✅ |

Donde no hay subagentes (ChatGPT web, o Codex sin los TOML), el orquestador trabaja en **modo solo**: hace cada rol en secuencia, con la misma disciplina de brief, contratos y reportes.

## Instalación

### Claude Code

```
/plugin marketplace add cristianatrio/squad-marketplace
/plugin install squad@squad-marketplace
```

Uso: `/squad:orquestador <pedido>`

### Codex y app de escritorio de ChatGPT

Codex lee el formato de plugins de Claude, así que se instala desde el mismo repo:

```
codex plugin marketplace add cristianatrio/squad-marketplace
codex plugin add squad@squad-marketplace
```

También podés agregar el marketplace y después instalar `squad` desde el directorio de plugins de la app de ChatGPT.

Para que el orquestador pueda delegar en subagentes, instalá los agentes (archivos TOML generados desde los mismos agentes del plugin).

PowerShell:

```powershell
git clone https://github.com/cristianatrio/squad-marketplace "$env:TEMP\squad"
New-Item -ItemType Directory -Force "$HOME\.codex\agents" | Out-Null
Copy-Item "$env:TEMP\squad\plugins\squad\codex\agents\*.toml" "$HOME\.codex\agents\"
```

bash:

```bash
git clone https://github.com/cristianatrio/squad-marketplace /tmp/squad
mkdir -p ~/.codex/agents && cp /tmp/squad/plugins/squad/codex/agents/*.toml ~/.codex/agents/
```

Uso: pedile "usá el orquestador de squad: <pedido>", o elegilo en el selector de skills.

Notas:
- **Modelo**: los agentes usan el de la sesión. Para ahorrar, agregá `model = "<un modelo mini>"` en `squad-release.toml` y `squad-qa.toml`.
- **MCP**: Codex no deja quitarle los MCP de la sesión a un agente. Los agentes tienen apps y memorias desactivadas, y la regla de no usar ningún MCP que su rol no mencione.
- **Muchas skills instaladas**: si tenés cientos, Codex corta la lista que le muestra al modelo y las del plugin pueden quedar afuera. Desactivá las que no uses.

### Kimi Code (CLI, web y Desktop)

```
/plugins install https://github.com/cristianatrio/squad-marketplace
/reload
```

Uso: `/skill:squad:orquestador <pedido>`

Kimi reutiliza las mismas skills y agentes. Ignora los campos propios de Claude (`model`, `effort`, `omitClaudeMd`), así que todos los agentes corren con el modelo de la sesión. Si tu versión de Kimi Desktop no tiene panel de plugins, instalalo desde Kimi Code CLI o web.

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

- **Modelo, esfuerzo, herramientas y skills**: en el frontmatter de `plugins/squad/agents/*.md`. Esos archivos son la única fuente de verdad: después de editarlos, corré `node scripts/build-codex-agents.mjs` para regenerar los agentes de Codex. El CI falla si quedan desfasados.
- **Reglas del CTO**: en `plugins/squad/skills/orquestador/SKILL.md`.
- **Reglas anti-genérico**: en `plugins/squad/skills/anti-generic/SKILL.md`.
- **Que los agentes lean tus CLAUDE.md**: sacá `omitClaudeMd: true` del agente. Va a costar más tokens.

## Licencia

MIT
