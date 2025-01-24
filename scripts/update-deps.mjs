import { ROOT_DIR } from './common.mjs';
import rootPkg from '../package.json' with { type: 'json' };
import gearJsApi from '../apis/gear/package.json' with { type: 'json' };
import * as path from 'path';
import * as fs from 'fs';
import assert from 'assert';

const dependency = process.args[2];

const dependenciesToUpdate = ['gear-api', 'polkadot'];

assert.ok(
  dependenciesToUpdate.includes(dependency),
  `Unknown dependency: ${dependency}. Supported dependencies: ${dependenciesToUpdate.join(', ')}`,
);

const { workspaces } = rootPkg;

for (const pkg of workspaces) {
  console.log(`Updating dependencies for ${pkg}...`);
  const pkgPath = path.join(ROOT_DIR, pkg, 'package.json');
  const pkgJson = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));

  const versions = new Map();

  const dependencies = pkgJson.dependencies || null;
  const devDependencies = pkgJson.devDependencies || null;
  const peerDependencies = pkgJson.peerDependencies || null;

  if (dependencies) {
    await updateDependencies(dependencies, versions);
    pkgJson.dependencies = dependencies;
  }

  if (devDependencies) {
    await updateDependencies(devDependencies, versions);
    pkgJson.devDependencies = devDependencies;
  }

  if (peerDependencies) {
    await updateDependencies(peerDependencies, versions);
    pkgJson.peerDependencies = peerDependencies;
  }

  fs.writeFileSync(pkgPath, JSON.stringify(pkgJson, null, 2));
}

async function updateDependencies(deps, versions) {
  for (const dep of Object.keys(deps)) {
    if (dependency == 'polkadot') {
      if (dep.startsWith('@polkadot/')) {
        if (!versions.has(dep)) {
          versions.set(dep, await fetchPkgVersionFromUnpkg(dep));
        }
        const version = versions.get(dep);
        if (version !== deps[dep]) {
          console.log(`  ${dep}: ${deps[dep]} -> ${version}`);
          deps[dep] = version;
        }
      }
    } else {
      if (dep === '@gear-js/api') {
        const version = gearJsApi.version;
        if (version !== deps[dep]) {
          console.log(`  ${dep}: ${deps[dep]} -> ${version}`);
          deps[dep] = version;
        }
      }
    }
  }
}

async function fetchPkgVersionFromUnpkg(pkg) {
  const url = `https://unpkg.com/${pkg}@latest/package.json`;
  const response = await fetch(url);
  const pkgJson = await response.json();
  return pkgJson.version;
}
