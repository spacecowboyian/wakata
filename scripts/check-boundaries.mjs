#!/usr/bin/env node
// Checks workspace package boundaries described in docs/architecture.md.
// No dependencies; run with `pnpm check:boundaries`.
import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));

// Dependency direction: a package may depend only on workspace packages in a strictly lower layer.
const layers = [
  { dir: 'packages/contracts', layer: 0 },
  { dir: 'packages/tokens', layer: 0 },
  { dir: 'packages/ds', layer: 1 },
  { dir: 'adapters', layer: 2 },
  { dir: 'examples', layer: 3 },
];
// Reserved locations that are not layered (see docs/architecture.md).
const unlayered = ['apps', 'packages/tooling'];
const workspaceGlobs = ['apps', 'packages', 'adapters', 'examples'];
const depFields = ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies'];
const skipDirs = new Set(['node_modules', 'dist', 'storybook-static', '.git', 'coverage']);

const errors = [];
const readJson = (file) => JSON.parse(readFileSync(file, 'utf8'));
const isDir = (p) => existsSync(p) && statSync(p).isDirectory();

const packages = [];
for (const top of workspaceGlobs) {
  const base = join(root, top);
  if (!isDir(base)) continue;
  for (const name of readdirSync(base)) {
    const dir = join(base, name);
    const file = join(dir, 'package.json');
    if (isDir(dir) && existsSync(file)) {
      packages.push({ rel: `${top}/${name}`, dir, json: readJson(file) });
    }
  }
}

const layerOf = (rel) => {
  const hit = layers.find((l) => rel === l.dir || rel.startsWith(`${l.dir}/`));
  return hit ? hit.layer : null;
};
const byName = new Map(packages.map((p) => [p.json.name, p]));

for (const pkg of packages) {
  if (pkg.json.private !== true) errors.push(`${pkg.rel}: package must be "private": true`);
  if (!pkg.json.name?.startsWith('@wakata/'))
    errors.push(`${pkg.rel}: name must use the @wakata/ scope`);

  const layer = layerOf(pkg.rel);
  const isUnlayered = unlayered.some((u) => pkg.rel === u || pkg.rel.startsWith(`${u}/`));
  if (layer === null && !isUnlayered) {
    errors.push(
      `${pkg.rel}: not in the layer map; add it to scripts/check-boundaries.mjs and docs/architecture.md`,
    );
    continue;
  }

  for (const field of depFields) {
    for (const dep of Object.keys(pkg.json[field] ?? {})) {
      const target = byName.get(dep);
      if (!target) {
        if (dep.startsWith('@wakata/'))
          errors.push(`${pkg.rel}: ${field} references unknown workspace package ${dep}`);
        continue;
      }
      const targetLayer = layerOf(target.rel);
      if (layer === null || targetLayer === null) continue;
      if (targetLayer >= layer) {
        errors.push(
          `${pkg.rel} (layer ${layer}) must not depend on ${dep} (layer ${targetLayer}): dependencies point to lower layers only`,
        );
      }
    }
  }
}

// Generated output must be visibly separate: any `generated/` directory needs a README naming its source.
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    if (skipDirs.has(name)) continue;
    const full = join(dir, name);
    if (!isDir(full)) continue;
    if (name === 'generated') {
      const readme = join(full, 'README.md');
      if (!existsSync(readme) || !/source/i.test(readFileSync(readme, 'utf8'))) {
        errors.push(
          `${relative(root, full)}: generated directory needs README.md stating its source and how to regenerate`,
        );
      }
    }
    walk(full);
  }
};
for (const top of workspaceGlobs) if (isDir(join(root, top))) walk(join(root, top));

if (errors.length) {
  console.error(`Boundary check failed (${errors.length}):`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}
console.log(`Boundary check passed (${packages.length} workspace package(s)).`);
