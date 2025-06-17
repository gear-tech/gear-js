import { hexToUint8Array } from '../src';

describe('hex', () => {
  test('should correctly convert hex to Uint8Array', () => {
    let hex = '0001ff';
    expect(Array.from(hexToUint8Array(hex))).toEqual([0, 1, 255]);

    hex = '0x0001ff';
    expect(Array.from(hexToUint8Array(hex))).toEqual([0, 1, 255]);
  });
});
