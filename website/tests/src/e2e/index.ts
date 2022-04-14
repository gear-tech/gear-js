import { Hex } from '@gear-js/api';
import { IPreparedMessages, IPreparedPrograms } from '../interfaces';
import { errorGetProgramData } from './errors';
import { getAllPrograms } from './programs';

export async function test(
  genesis: Hex,
  prepared: {
    programs: IPreparedPrograms;
    messages: IPreparedMessages;
  },
) {
  return Promise.all([getAllPrograms(genesis, Object.keys(prepared.programs) as Hex[]), errorGetProgramData(genesis)])
    .then(() => {
      console.log('PASSED');
      process.exit(0);
    })
    .catch((err) => {
      console.error(err);
      console.log('FAILED');
      process.exit(1);
    });
}
