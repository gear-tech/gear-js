import { readFileSync } from 'fs';
import { load } from 'js-yaml';

import { Code } from '../../../database/entities';

function getCodeDBMock(): Code[] {
  const pathCollectionCode = '/collection-code.mock.yaml';
  let result: Code[] = [];

  (async function (){
    try {
      const collectionCode = load(readFileSync(__dirname + pathCollectionCode, 'utf8'));
      const keys = Object.keys(collectionCode);

      for (const key of keys) {
        const listCode: Code[] = collectionCode[key];
        result = listCode.map((code) => ({ ...code, timestamp: new Date() }));
      }
    } catch (err) {
      console.error(err);
    }
  })();

  return result;
}

const CODE_DB_MOCK = getCodeDBMock();

export { CODE_DB_MOCK };
