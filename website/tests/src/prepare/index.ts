import { GearApi } from '@gear-js/api';
import { load } from 'js-yaml';
import { readFileSync } from 'fs';
import { sendMessages } from './send-message';
import { uploadPrograms } from './upload-programs';
import { IMessageSpec, IProgramSpec, IPrepared } from '../interfaces';

export async function processPrepare(api: GearApi): Promise<IPrepared> {
  const programs = load(readFileSync('./spec/programs.yaml', 'utf8')) as { [program: string]: IProgramSpec };
  const [uploadedPrograms, userMessages] = await uploadPrograms(api, programs);
  const messages = load(readFileSync('./spec/messages.yaml', 'utf8')) as { [program: string]: IMessageSpec[] };
  const sentMessages = await sendMessages(api, messages, uploadedPrograms);
  userMessages.forEach((value, key) => sentMessages.log.set(key, value));
  return { programs: uploadedPrograms, messages: sentMessages };
}
