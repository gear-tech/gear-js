import assert from 'assert';
import * as fs from 'fs';
import { GEAR_IDEA_VERSION, gearIdeaPkgs } from './check-gear-idea-version.mjs';

const bump = process.argv[2];

const strategies = ['patch', 'minor', 'major'];

assert.ok(strategies.includes(bump), `Invalid update strategy. Use one of these: ${strategies.join(', ')}`);

const index = strategies.indexOf(bump);
const v = GEAR_IDEA_VERSION.split('.');
v[index] = parseInt(v[index], 10) + 1;
const newVersion = v.join('.');

Array.from(gearIdeaPkgs.keys()).forEach((k) => {
  gearIdeaPkgs.get(k).version = newVersion;
});

console.log(`Updated version to ${newVersion}`);

for (const [p, pkg] of gearIdeaPkgs) {
  fs.writeFileSync(p, JSON.stringify(pkg, null, 2) + '\n');
}
