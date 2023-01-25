import fs from 'fs';
import { join } from 'path';
import yaml from 'js-yaml';

import { CreateType, Hex, decodeHexTypes, getWasmMetadata } from '../src';
import { GEAR_EXAMPLES_WASM_DIR } from './config';

const testFiles = fs.readdirSync('test/spec/meta');

describe('Create type test', () => {
  for (const filePath of testFiles) {
    const testFile: any = yaml.load(fs.readFileSync(join('./test/spec/meta', filePath), 'utf8'));
    test(testFile.title, async () => {
      const metaFile = fs.readFileSync(join(GEAR_EXAMPLES_WASM_DIR, testFile.file));
      const meta = await getWasmMetadata(metaFile);
      for (const type in testFile.types) {
        expect(meta[type]).toBe(testFile.types[type]);
      }
      expect(decodeHexTypes(meta.types as Hex)).toEqual(testFile.displayed_types);
      const encode = testFile.payloads.encode;
      for (const payloadType in encode) {
        for (const index in encode[payloadType]) {
          const payload = encode[payloadType][index];
          const encoded = CreateType.create(meta[payloadType], payload.payload, meta.types);
          expect(encoded.toHex()).toEqual(payload.expected);
        }
      }
      const decode = testFile.payloads.decode;
      for (const payloadType in decode) {
        for (const index in decode[payloadType]) {
          const payload = decode[payloadType][index];
          const encoded = CreateType.create(meta[payloadType], payload.payload, meta.types);
          expect(encoded.toHuman()).toEqual(payload.expected);
        }
      }
    });
  }
});

describe('Create a type that differs from existing one in the registry', () => {
  const types =
    '0x2800081466745f696f28496e6974436f6e66696700000801106e616d65040118537472696e6700011873796d626f6c040118537472696e67000004000005020008081466745f696f204654416374696f6e000118104d696e7404000c011075313238000000104275726e04000c011075313238000100205472616e736665720c011066726f6d10011c4163746f724964000108746f10011c4163746f724964000118616d6f756e740c0110753132380002001c417070726f7665080108746f10011c4163746f724964000118616d6f756e740c0110753132380003002c546f74616c537570706c790004002442616c616e63654f66040010011c4163746f724964000500000c00000507001010106773746418636f6d6d6f6e287072696d6974697665731c4163746f724964000004001401205b75383b2033325d0000140000032000000018001800000503001c081466745f696f1c46544576656e74000110205472616e736665720c011066726f6d10011c4163746f724964000108746f10011c4163746f724964000118616d6f756e740c0110753132380000001c417070726f76650c011066726f6d10011c4163746f724964000108746f10011c4163746f724964000118616d6f756e740c0110753132380001002c546f74616c537570706c7904000c0110753132380002001c42616c616e636504000c0110753132380003000020081466745f696f145374617465000114104e616d650000001853796d626f6c00010020446563696d616c730002002c546f74616c537570706c790003002442616c616e63654f66040010011c4163746f7249640004000024081466745f696f2853746174655265706c79000114104e616d650400040118537472696e670000001853796d626f6c0400040118537472696e6700010020446563696d616c73040018010875380002002c546f74616c537570706c7904000c0110753132380003001c42616c616e636504000c01107531323800040000';

  test('FTAction', () => {
    expect(CreateType.create('FTAction', { Mint: 128 }, types).toHex()).toBe('0x0080000000000000000000000000000000');
  });

  test('Wrong FTAction', () => {
    expect(() => CreateType.create('FtAction', { Mint: 128 }, types)).toThrow();
  });
});

describe('demo_gui', () => {
  const metaFile = fs.readFileSync(join(GEAR_EXAMPLES_WASM_DIR, 'demo_gui_test.meta.wasm'));
  test('handle', async () => {
    const meta = await getWasmMetadata(metaFile);
    const payload = [{ one: '1', two: '2' }, [null, 128, [1, 2, 3]]];
    expect(CreateType.create(meta.handle_input!, payload, meta.types));
  });
});
