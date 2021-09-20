import * as fs from 'fs';
import { getWasmMetadata, CreateType, GearApi } from '../src';
import { GenericPortableRegistry, typeSplit } from '@polkadot/types';
import { hexToU8a } from '@polkadot/util';
import { TypeRegistry, encodeTypeDef } from '@polkadot/types';

async function testMeta(test: any) {
  let meta;
  let types;
  if (test.meta_file) {
    meta = await getWasmMetadata(fs.readFileSync(test.meta_file));
    types = meta.types;
  } else {
    meta = test.types;
  }

  test.payloads.forEach((payload) => {
    const encoded = CreateType.encode(meta[payload.name], payload.value, meta);
    const decoded: object = CreateType.decode(meta[payload.name], encoded, meta).toJSON();
    console.log(`${JSON.stringify(decoded)}: ${assert(payload.value, decoded)}`);
  });
}

function assert(payload: object, decoded: object) {
  Object.getOwnPropertyNames(payload).forEach((key) => {
    if (typeof payload[key] === 'object') {
      if (decoded[key.toLowerCase()]) {
        assert(payload[key], decoded[key.toLowerCase()]);
      } else {
        throw new Error('Assertion failed');
      }
    } else {
      if (!(payload[key] === decoded[key.toLowerCase()])) {
        throw new Error('Assertion failed');
      }
    }
  });
  return 'ok';
}

async function main(path: string) {
  const hex =
    '0x3000080461344d657373616765496e6974496e0000080118616d6f756e74040108753800012063757272656e637908011c5665633c75383e00000400000503000800000204000c080461384d657373616765496e69744f7574000008013465786368616e67655f72617465100138526573756c743c75382c2075383e00010c73756d04010875380000100418526573756c740804540104044501040108084f6b040004000000000c457272040004000001000014080461244d657373616765496e000004010869641801084964000018080461084964000008011c646563696d616c1c010c75363400010c68657808011c5665633c75383e00001c000005060020080461284d6573736167654f7574000004010c7265732401384f7074696f6e3c57616c6c65743e00002404184f7074696f6e04045401280108104e6f6e6500000010536f6d650400280000010000280804611857616c6c6574000008010869641801084964000118706572736f6e2c0118506572736f6e00002c08046118506572736f6e000008011c7375726e616d6508011c5665633c75383e0001106e616d6508011c5665633c75383e0000';
  const u8a = hexToU8a(hex);
  const createType = new CreateType();
  const meta = { types: u8a };
  const encoded = createType.encode(
    'AMessageOut',
    {
      res: {
        id: { decimal: 1, hex: [1] },
        person: {
          surname: [83, 111, 109, 101, 83, 117, 114, 110, 97, 109, 101],
          name: [83, 111, 109, 101, 78, 97, 109, 101]
        }
      }
    },
    meta
  );
  console.log(encoded);
  const decoded = createType.decode('AMessageOut', encoded, meta);
  console.log(decoded.toHuman());
  // (({ id, type: { path, params, def, docs } }) => {
  //   if (!path.length) {
  //     return;
  //   }
  //   console.log(JSON.stringify(def.toJSON()));
  //   console.log(genReg.getTypeDef(id));
  //   console.log(path.toHuman());
  //   const t = path.toHuman()[1].toString();
  //   console.log(t);
  //   types[t] = JSON.parse(genReg.getTypeDef(id).type);
  // // });
  // reg.setKnownTypes({ types: { ...types } });
  // reg.register({ ...types });
  // console.log(reg.knownTypes);
  // const encoded = reg.createType('Hello', { world: 15 });
  // console.log(encoded.toHuman());
}

main('./examples/test-meta.json')
  .catch((error) => {
    console.error(error);
  })
  .finally(() => {
    process.exit();
  });
