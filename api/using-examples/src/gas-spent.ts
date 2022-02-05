import { GearApi, GearKeyring, getWasmMetadata } from '@gear-js/api';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const main = async () => {
  const api = await GearApi.create();

  const code = readFileSync(resolve('./demo_meta.opt.wasm'));
  const metaWasm = readFileSync(resolve('./demo_meta.meta.wasm'));
  const alice = await GearKeyring.fromSuri('//Alice');
  const meta = await getWasmMetadata(metaWasm);
  const initPayload = {
    amount: 255,
    currency: 'GRT',
  };

  const programId = api.program.submit({ code, initPayload, gasLimit: 200_000_000 }, meta);
  api.program.signAndSend(alice, async (event) => {
    if (event.status.isFinalized) {
      const gas = await api.program.getGasSpent(
        {
          accountId: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
          programId: '0xdcdb8a485bd29c13b151c90218d7361273327e1d93be3f13c172b490199d7ea7',
          kind: 'Handle',
          payload: {
            id: {
              decimal: 64,
              hex: '0xd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d',
            },
          },
        },
        meta,
      );
      console.log(`Calculated gas: ${gas.toHuman()}`);
    }
  });
};

main();
