#!/usr/bin/env node
// Genera kimi-desktop/squad-orquestador/: el orquestador como una sola skill autocontenida,
// para apps que solo dejan subir una carpeta con SKILL.md (Kimi Desktop). Los roles y
// anti-generic van en references/. El CI falla si el resultado difiere de lo commiteado.
// Uso: node scripts/build-kimi-desktop-skill.mjs
import { mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PLUGIN_DIR = join(ROOT, 'plugins', 'squad');
const OUTPUT_DIR = join(ROOT, 'kimi-desktop', 'squad-orquestador');
const SKILL_NAME = 'squad-orquestador';

const readText = (path) => readFileSync(path, 'utf8').replace(/\r\n/g, '\n');
const copyText = (from, to) => writeFileSync(to, readText(from));

const orchestrator = readText(join(PLUGIN_DIR, 'skills', 'orquestador', 'SKILL.md'));
if (!/^name: orquestador$/m.test(orchestrator)) throw new Error('orquestador/SKILL.md: no encontré "name: orquestador"');

rmSync(OUTPUT_DIR, { recursive: true, force: true });
mkdirSync(join(OUTPUT_DIR, 'references', 'agents'), { recursive: true });

writeFileSync(join(OUTPUT_DIR, 'SKILL.md'), orchestrator.replace(/^name: orquestador$/m, `name: ${SKILL_NAME}`));
copyText(join(PLUGIN_DIR, 'skills', 'anti-generic', 'SKILL.md'), join(OUTPUT_DIR, 'references', 'anti-generic.md'));

const roles = readdirSync(join(PLUGIN_DIR, 'agents')).filter((file) => file.endsWith('.md')).sort();
for (const file of roles) {
  copyText(join(PLUGIN_DIR, 'agents', file), join(OUTPUT_DIR, 'references', 'agents', file));
}
console.log(`skill ${SKILL_NAME} generada en ${OUTPUT_DIR} con ${roles.length} roles`);
