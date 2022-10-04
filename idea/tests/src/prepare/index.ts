import { GearApi } from '@gear-js/api';
import { load } from 'js-yaml';
import { readFileSync } from 'fs';

import { sendMessages } from './send-message';
import { uploadPrograms } from './upload-programs';
import { IMessageSpec, IProgramSpec, IPrepared, ICodeSpec } from '../interfaces';
import { uploadCollectionCode } from './upload-collection-code';

export async function processPrepare(api: GearApi): Promise<IPrepared> {
  const programs = load(readFileSync('./spec/programs.yaml', 'utf8')) as { [program: string]: IProgramSpec };
  const [uploadedPrograms, userMessages, collectionCodeChanged] = await uploadPrograms(api, programs);

  const messages = load(readFileSync('./spec/messages.yaml', 'utf8')) as { [program: string]: IMessageSpec[] };
  const sentMessages = await sendMessages(api, messages, uploadedPrograms);
  userMessages.forEach((value, key) => sentMessages.log.set(key, value));

  const collectionCode = load(readFileSync('./spec/collection-code.yaml', 'utf8')) as { [key: string]: ICodeSpec[] };
  const uploadedCollectionCode = await uploadCollectionCode(api ,collectionCode);
  collectionCodeChanged.forEach((value, key) => uploadedCollectionCode.set(key, value));

  return { programs: uploadedPrograms, messages: sentMessages, collectionCode: uploadedCollectionCode };
}
