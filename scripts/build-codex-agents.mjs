#!/usr/bin/env node
// Genera los agentes de Codex (TOML) a partir de plugins/squad/agents/*.md,
// que son la única fuente de verdad. El CI falla si el resultado difiere de lo commiteado.
// Uso: node scripts/build-codex-agents.mjs
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SOURCE_DIR = join(ROOT, 'plugins', 'squad', 'agents');
const OUTPUT_DIR = join(ROOT, 'plugins', 'squad', 'codex', 'agents');

// Estos roles cargan squad:anti-generic, que es una skill de plugin.
const ROLES_NEEDING_PLUGINS = new Set(['designer', 'frontend', 'mobile']);
const ROLES_WITHOUT_SHELL = new Set(['product']);
const VALID_EFFORTS = new Set(['low', 'medium', 'high']);

const CODEX_PREAMBLE = `Plataforma: Codex. Estas instrucciones vienen del plugin squad (escrito para Claude Code) y se adaptan así:
- Donde dice "cargá la skill X" o "la tool Skill", usá la skill X (del plugin squad o instalada con ese nombre). Si no existe, seguí sin ella.
- Los nombres de herramientas que aparecen (Read, Edit, Bash, etc.) son de Claude Code: usá tus equivalentes para leer, buscar, editar y ejecutar.
- Codex no permite quitarte los MCP ni las apps de la sesión: no uses ninguno salvo los que tu rol menciona explícitamente (por ejemplo, Playwright en QA) o los que el prompt pida.`;

function parseAgent(text, file) {
  const normalized = text.replace(/\r\n/g, '\n');
  const match = normalized.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) throw new Error(`${file}: frontmatter inválido`);

  const fields = Object.fromEntries(
    match[1]
      .split('\n')
      .filter((line) => /^[A-Za-z]+:/.test(line))
      .map((line) => {
        const separator = line.indexOf(':');
        return [line.slice(0, separator), line.slice(separator + 1).trim()];
      }),
  );
  return { fields, body: match[2].trim() };
}

function toToml(role, { fields, body }, file) {
  if (!fields.name || !fields.description) throw new Error(`${file}: falta name o description`);
  if (!VALID_EFFORTS.has(fields.effort)) throw new Error(`${file}: effort inválido "${fields.effort}"`);

  const instructions = `${CODEX_PREAMBLE}\n\n${body}`;
  // Un string literal multilínea de TOML no puede contener la secuencia de cierre.
  if (instructions.includes("'''")) throw new Error(`${file}: el cuerpo contiene ''' y rompería el TOML`);

  const features = ['apps = false', 'memories = false'];
  if (!ROLES_NEEDING_PLUGINS.has(role)) features.push('plugins = false');
  if (ROLES_WITHOUT_SHELL.has(role)) features.push('shell_tool = false');

  return [
    `# Generado por scripts/build-codex-agents.mjs desde plugins/squad/agents/${role}.md. No editar a mano.`,
    `name = ${JSON.stringify(`squad-${role}`)}`,
    `description = ${JSON.stringify(fields.description)}`,
    `model_reasoning_effort = ${JSON.stringify(fields.effort)}`,
    `developer_instructions = '''`,
    instructions,
    `'''`,
    '',
    '[features]',
    ...features,
    '',
  ].join('\n');
}

mkdirSync(OUTPUT_DIR, { recursive: true });
const sources = readdirSync(SOURCE_DIR).filter((file) => file.endsWith('.md')).sort();
for (const file of sources) {
  const role = file.replace(/\.md$/, '');
  const agent = parseAgent(readFileSync(join(SOURCE_DIR, file), 'utf8'), file);
  writeFileSync(join(OUTPUT_DIR, `squad-${role}.toml`), toToml(role, agent, file));
}
console.log(`${sources.length} agentes generados en ${OUTPUT_DIR}`);
