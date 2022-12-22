import { readFileSync } from 'fs';
import { GearApi, getProgramMetadata, Hex, MessageEnqueuedData } from '@gear-js/api';
import { HexString } from '@polkadot/util/types';

import accounts from '../config/accounts';
import { IPreparedPrograms, IProgramSpec, IUploadedPrograms } from '../interfaces';
import { sleep } from '../utils';
import { listenToCodeChanged, listenToMessagesDispatched, listenToUserMessageSent } from './subscriptions';
import { checkPrograms } from './check';

async function uploadProgram(api: GearApi, spec: IProgramSpec): Promise<{ id: Hex; source: Hex; destination: Hex }> {
  const code = readFileSync(spec.pathToOpt);
  const metaHex: HexString = `0x${readFileSync(spec.pathToMetaTxt, 'utf-8')}`;
  const metaData = spec.pathToMetaTxt ? getProgramMetadata(metaHex) : undefined;
  const account = (await accounts())[spec.account];

  api.program.upload(
    { code, initPayload: spec.initPayload, gasLimit: spec.gasLimit },
    metaData,
    spec.metaType,
  );

  return new Promise((resolve) => {
    api.program.signAndSend(account, ({ events = [], status }) => {
      events.forEach(({ event: { method, data } }) => {
        if (method === 'ExtrinsicFailed') {
          throw new Error(`Unable to upload program. ExtrinsicFailed. ${data.toString()}`);
        } else if (method === 'MessageEnqueued' && status.isFinalized) {
          const { id, source, destination } = data as MessageEnqueuedData;
          return resolve({ id: id.toHex(), source: source.toHex(), destination: destination.toHex() });
        }
      });
    });
  });
}

export async function uploadPrograms(
  api: GearApi,
  programs: { [program: string]: IProgramSpec },
): Promise<[IPreparedPrograms, Map<Hex, any>, Map<Hex, any>]> {
  const initSuccess = new Map<string, boolean>();
  const userMessages = new Map<Hex, any>();
  const collectionCodeChanged = new Map<Hex, any>();

  const unsubMessagesDispatched = await listenToMessagesDispatched(api, (messageId, success) => {
    initSuccess.set(messageId, success);
  });

  const unsubUserMessageSent = await listenToUserMessageSent(api, (data) => {
    userMessages.set(data.message.id.toHex(), data.toHuman());
  });

  const unsubCodeChanged = await listenToCodeChanged(api, (data) => {
    collectionCodeChanged.set(data.id.toHex(), data.toHuman());
  });

  const uploadedPrograms: { [key: Hex]: IUploadedPrograms } = {};

  for (const program of Object.keys(programs)) {
    const uploadedProgram = await uploadProgram(api, programs[program]);
    uploadedPrograms[uploadedProgram.destination] = {
      ...programs[program],
      name: program,
      messageId: uploadedProgram.id,
      owner: uploadedProgram.source,
    };
  }
  await sleep();
  unsubMessagesDispatched();
  unsubUserMessageSent();
  unsubCodeChanged();

  return [checkPrograms(uploadedPrograms, initSuccess), userMessages, collectionCodeChanged];
}
