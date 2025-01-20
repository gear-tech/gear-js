import assert from 'assert';
import { ROOT_DIR } from './common.mjs';
import * as fs from 'fs';
import * as path from 'path';

const pkgPaths = fs
  .readdirSync(path.join(ROOT_DIR, 'idea/gear'), { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((pkg) => path.join(ROOT_DIR, 'idea/gear', pkg.name, 'package.json'));

/**
 * @type Map<string, object>
 */
export const gearIdeaPkgs = new Map(pkgPaths.map((p) => [p, JSON.parse(fs.readFileSync(p, 'utf-8'))]));

for (const p of pkgPaths) {
  const pkg = JSON.parse(fs.readFileSync(p, 'utf-8'));
  gearIdeaPkgs.set(p, pkg);
}

export const GEAR_IDEA_VERSION = gearIdeaPkgs.values().next().value.version;

assert.ok(
  Array.from(gearIdeaPkgs.values()).every(({ version }) => GEAR_IDEA_VERSION === version),
  'All gear-idea packages must have the same version',
);
