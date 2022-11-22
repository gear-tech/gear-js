const { readFileSync, writeFileSync, readdirSync, lstat, lstatSync, existsSync } = require('fs');
const { join } = require('path');

async function getVersion(pkg) {
  const link = `https://unpkg.com/${pkg}@latest/package.json`;
  const res = await fetch(link, { method: 'GET' });
  const text = await res.text();
  return JSON.parse(text).version;
}

async function goThroughDeps(dependencies, versions) {
  for (const key of Object.keys(dependencies)) {
    if (key.startsWith('@polkadot')) {
      if (!(key in versions)) {
        versions[key] = await getVersion(key);
      }

      dependencies[key] = versions[key];
    }
  }
}

async function bumpInPkg(path, versions) {
  const pkg = JSON.parse(readFileSync(path, 'utf-8'));

  await goThroughDeps(pkg.dependencies, versions);
  await goThroughDeps(pkg.devDependencies, versions);

  writeFileSync(path, JSON.stringify(pkg, undefined, 2) + '\n');
}

const packages = { apps: '*', idea: ['data-storage', 'frontend', 'test-balance', 'tests'] };

const main = async () => {
  const versions = {};

  for (let [root, pkgs] of Object.entries(packages)) {
    if (pkgs === '*') {
      pkgs = readdirSync(root).filter(
        (file) => lstatSync(join(root, file)).isDirectory() && existsSync(join(root, file, 'package.json')),
      );
    }

    for (let pkg of pkgs) {
      await bumpInPkg(join(root, pkg, 'package.json'), versions);
    }
  }
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
