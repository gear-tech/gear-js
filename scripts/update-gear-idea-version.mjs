import assert from 'assert';
import * as path from 'path';
import * as fs from 'fs';

const bump = process.argv[2];

const strategies = ['patch', 'minor', 'major'];

assert.ok(strategies.includes(bump), `Invalid update strategy. Use one of these: ${strategies.join(', ')}`);

const rootDir = path.resolve(import.meta.dirname, '../');

const pkgPaths = fs
  .readdirSync(path.join(rootDir, 'idea/gear'))
  .map((pkg) => path.join(rootDir, 'idea/gear', pkg, 'package.json'));

const pkgs = new Map();

for (const p of pkgPaths) {
  const pkg = JSON.parse(fs.readFileSync(p, 'utf-8'));
  pkgs.set(p, pkg);
}

const oldVersion = pkgs.values().next().value.version;

assert.ok(
  Array.from(pkgs.values()).every(({ version }) => oldVersion === version),
  'All packages must have the same version',
);

const index = strategies.indexOf(bump);
const v = oldVersion.split('.');
v[index] = parseInt(v[index], 10) + 1;
const newVersion = v.join('.');

Array.from(pkgs.keys()).forEach((k) => {
  pkgs.get(k).version = newVersion;
});

console.log(`Updated version to ${newVersion}`);

for (const [p, pkg] of pkgs) {
  fs.writeFileSync(p, JSON.stringify(pkg, null, 2));
}
