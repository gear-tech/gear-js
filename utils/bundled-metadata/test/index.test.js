import { BUNDLED_METADATA } from '../src/index';

const KEY_RE = /^0x[0-9a-f]+-\d+$/;
const HEX_RE = /^0x[0-9a-f]+$/;

describe('@gear-js/bundled-metadata', () => {
  it('exports BUNDLED_METADATA as a non-empty object', () => {
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
});
