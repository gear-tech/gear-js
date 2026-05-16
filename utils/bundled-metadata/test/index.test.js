// Imports from the BUILT package (lib/) so this test exercises the rollup output:
// the `exports` map, the dual ESM/CJS layout, and the `lib/cjs/package.json`
// "type": "commonjs" marker. A test that imported `../src/index` would silently
// pass even if the build pipeline was broken. The test script chains
// `yarn build && yarn jest` so lib/ is always fresh before this runs.
import { createRequire } from 'node:module';

import { BUNDLED_METADATA } from '@gear-js/bundled-metadata';

const KEY_RE = /^0x[0-9a-f]+-\d+$/;
const HEX_RE = /^0x[0-9a-f]+$/;

describe('@gear-js/bundled-metadata (built package)', () => {
  it('exports BUNDLED_METADATA as a non-empty object via ESM', () => {
    expect(typeof BUNDLED_METADATA).toBe('object');
    expect(BUNDLED_METADATA).not.toBeNull();
    expect(Object.keys(BUNDLED_METADATA).length).toBeGreaterThan(0);
  });

  it('every entry has a (genesisHash, specVersion) key and a hex value', () => {
    for (const [key, value] of Object.entries(BUNDLED_METADATA)) {
      expect(key).toMatch(KEY_RE);
      expect(value).toMatch(HEX_RE);
    }
  });

  it('CJS consumer can require the package without ERR_REQUIRE_ESM', () => {
    // Use require() to exercise the `require` condition of the exports map and
    // the lib/cjs/package.json {"type":"commonjs"} marker. Without the marker,
    // a Node CJS consumer hits ERR_REQUIRE_ESM at import time.
    const require = createRequire(import.meta.url);
    const cjs = require('@gear-js/bundled-metadata');
    expect(typeof cjs.BUNDLED_METADATA).toBe('object');
    expect(Object.keys(cjs.BUNDLED_METADATA).length).toBeGreaterThan(0);
  });
});
