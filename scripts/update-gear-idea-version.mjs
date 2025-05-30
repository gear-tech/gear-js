import assert from 'assert';
import * as fs from 'fs';
import { GEAR_IDEA_VERSION, gearIdeaPkgs } from './check-gear-idea-version.mjs';

const bump = process.argv[2];

const strategies = ['major', 'minor', 'patch'];

assert.ok(strategies.includes(bump), `Invalid update strategy ${bump}. Use one of these: ${strategies.join(', ')}`);

const index = strategies.indexOf(bump);
const v = GEAR_IDEA_VERSION.split('.');
v[index] = parseInt(v[index], 10) + 1;
const newVersion = v.join('.');

Array.from(gearIdeaPkgs.keys()).forEach((k) => {
  const pkg = gearIdeaPkgs.get(k);
  pkg.version = newVersion;

  if (pkg.dependencies) {
    for (const [dep] of Object.entries(pkg.dependencies)) {
      if (dep.startsWith('gear-idea-')) {
        pkg.dependencies[dep] = newVersion;
      }
    }
  }
});

console.log(`Updated version to ${newVersion}`);

for (const [p, pkg] of gearIdeaPkgs) {
  fs.writeFileSync(p, JSON.stringify(pkg, null, 2) + '\n');
}
