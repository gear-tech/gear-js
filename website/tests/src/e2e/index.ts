import { Hex } from '@gear-js/api';
import { IPreparedMessages, IPreparedPrograms } from '../interfaces';
import { getAllPrograms, getProgramData } from './programs';

export async function test(
  genesis: Hex,
  prepared: {
    programs: IPreparedPrograms;
    messages: IPreparedMessages;
  },
) {
  await getAllPrograms(genesis, Object.keys(prepared.programs) as Hex[]);
  for (let program of Object.keys(prepared.programs)) {
    await getProgramData(genesis, program);
  }
}
