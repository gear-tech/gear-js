import { load } from 'js-yaml';
import { readFileSync } from 'fs';

import { Meta, Program } from '../../../database/entities';

const metadata = new Meta();

function getProgramDBMock(): Program[] {
  const pathPrograms = '/programs.mock.yaml';
  let result: Program[] = [];

  (async function (){
    try {
      const collectionPrograms = load(readFileSync(__dirname + pathPrograms, 'utf8'));
      const keys = Object.keys(collectionPrograms);

      for (const key of keys) {
        const programs:Program[]  = collectionPrograms[key];
        result = programs.map((program) => ({ ...program, meta: metadata }));
      }
    } catch (err) {
      console.error(err);
    }
  })();

  return result;
}

const PROGRAM_DB_MOCK = getProgramDBMock();

export { PROGRAM_DB_MOCK };
