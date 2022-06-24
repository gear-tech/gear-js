import { GearApi, GearKeyring, getWasmMetadata, Hex, MessageEnqueued } from '@gear-js/api';
import { readFileSync } from 'fs';
import { PATH_TO_META } from '../config';
import { waitForReply } from './waitForReply';

const [programId] = process.argv.slice(2);

const main = async () => {
  const api = await GearApi.create();

  const alice = await GearKeyring.fromSuri('//Alice');

  const metaFile = readFileSync(PATH_TO_META);

  const meta = await getWasmMetadata(metaFile);

  const payload = {
    AddParticipant: {
      name: 'alice',
      age: 50,
    },
  };

  const gas = await api.program.calculateGas.handle(
    GearKeyring.decodeAddress(alice.address),
    programId as Hex,
    payload,
    20000,
    true,
    meta,
  );

  api.message.submit({ destination: programId, payload, gasLimit: gas.min_limit, value: 20000 }, meta);

  const reply = waitForReply(api, programId);
  let messageId: Hex;
  try {
    await new Promise((resolve, reject) => {
      api.message.signAndSend(alice, ({ events, status }) => {
        console.log(`STATUS: ${status.toString()}`);
        if (status.isFinalized) resolve(status.asFinalized);
        events.forEach(({ event }) => {
          if (event.method === 'MessageEnqueued') {
            messageId = (event as MessageEnqueued).data.id.toHex();
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
