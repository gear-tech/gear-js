import { GearApi, GearKeyring, MessageQueued, decodeAddress, getProgramMetadata } from '@gear-js/api';
import { HexString } from '@polkadot/util/types';
import { readFileSync } from 'fs';

import { PATH_TO_META } from '../config';
import { waitForReply } from './waitForReply';

const [programId] = process.argv.slice(2) as [HexString];

const main = async () => {
  const api = await GearApi.create();

  const alice = await GearKeyring.fromSuri('//Alice');

  const metaFile = readFileSync(PATH_TO_META);

  const meta = getProgramMetadata(`0x${metaFile}`);

  const payload = {
    One: 'String',
  };

  const gas = await api.program.calculateGas.handle(
    decodeAddress(alice.address),
    programId,
    payload,
    20000,
    true,
    meta,
  );

  const tx = api.message.send({ destination: programId, payload, gasLimit: gas.min_limit, value: 20000 }, meta);

  const reply = waitForReply(api, programId);
  let messageId: HexString;
  try {
    await new Promise((resolve, reject) => {
      tx.signAndSend(alice, ({ events, status }) => {
        console.log(`STATUS: ${status.toString()}`);
        if (status.isFinalized) resolve(status.asFinalized);
        events.forEach(({ event }) => {
          if (event.method === 'MessageEnqueued') {
            messageId = (event as MessageQueued).data.id.toHex();
          } else if (event.method === 'ExtrinsicFailed') {
            reject(api.getExtrinsicFailedError(event).docs.join('/n'));
          }
        });
      });
    });
    const replyEvent = await reply(messageId);
    console.log(replyEvent.data.toHuman());
  } catch (error) {
    console.log(error);
  }
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
