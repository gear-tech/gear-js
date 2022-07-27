import { readFileSync } from 'fs';
import { load } from 'js-yaml';

import { Code } from '../../../src/database/entities';

function getCodeDBMock(): Code[] {
  const pathCollectionCode = '/collection-code.mock.yaml';
  try {
    const listCode = load(readFileSync(__dirname + pathCollectionCode, 'utf8')) as Code[];
    return  listCode.map((code) => ({ ...code, timestamp: new Date() }));
  } catch (err) {
    console.error(err);
  }
}

const CODE_DB_MOCK = getCodeDBMock();

export { CODE_DB_MOCK };
