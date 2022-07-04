import { readFileSync } from 'fs';
import { GearApi, getWasmMetadata, Hex, MessageEnqueuedData } from '@gear-js/api';
import accounts from '../config/accounts';
import { IProgramSpec, IUploadedPrograms } from '../interfaces';
import { sleep } from '../utils';
import { listenToMessagesDispatched, listenToProgramChanged } from './subscriptions';
import { checkPrograms } from './check';

async function uploadProgram(api: GearApi, spec: IProgramSpec): Promise<{ id: Hex; source: Hex; destination: Hex }> {
  const code = readFileSync(spec.pathToOpt);
  const meta = spec.pathToMeta ? await getWasmMetadata(readFileSync(spec.pathToMeta)) : undefined;
  const account = (await accounts())[spec.account];
  api.program.submit(
    { code, initPayload: spec.initPayload, gasLimit: spec.gasLimit, value: spec.value },
    meta,
    spec.metaType,
  );

  return new Promise((resolve) => {
    api.program.signAndSend(account, ({ events = [] }) => {
      events.forEach(({ event: { method, data } }) => {
        if (method === 'ExtrinsicFailed') {
          throw new Error(`Unable to upload program. ExtrinsicFailed. ${data.toString()}`);
        } else if (method === 'MessageEnqueued') {
          const { id, source, destination } = data as MessageEnqueuedData;
          resolve({ id: id.toHex(), source: source.toHex(), destination: destination.toHex() });
        }
      });
    });
  });
}

export async function uploadPrograms(api: GearApi, programs: { [program: string]: IProgramSpec }) {
  const initSuccess = new Map<string, boolean>();

  const unsubInit = await listenToMessagesDispatched(api, (messageId, success) => {
    initSuccess.set(messageId, success);
  });

  const uploadedPrograms: { [key: Hex]: IUploadedPrograms } = {};

  for (let program of Object.keys(programs)) {
    const uploadedProgram = await uploadProgram(api, programs[program]);
    uploadedPrograms[uploadedProgram.destination] = {
      ...programs[program],
      name: program,
      messageId: uploadedProgram.id,
    };
  }
  await sleep();
  unsubInit();

  return checkPrograms(uploadedPrograms, initSuccess);
}
