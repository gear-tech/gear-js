import { Hex } from '@gear-js/api';
import { IPreparedMessages, IPreparedPrograms } from '../interfaces';
import { getAllPrograms } from './programs';

export async function test(
  genesis: Hex,
  prepared: {
    programs: IPreparedPrograms;
    messages: IPreparedMessages;
  },
) {
  await getAllPrograms(genesis, Object.keys(prepared.programs) as Hex[]);
}
