import { readFileSync } from 'fs';
import { load } from 'js-yaml';

import { Code, Meta } from '../../../src/database/entities';

const meta = new Meta();
meta.hash = '0x00';

function getCodeDBMock(): Code[] {
  const pathCollectionCode = '/collection-code.mock.yaml';
  try {
    const listCode = load(readFileSync(__dirname + pathCollectionCode, 'utf8')) as Code[];
    return  listCode.map((code, index) => (index === 0 ?
        { ...code, timestamp: new Date(), meta } : { ...code, timestamp: new Date() }));
  } catch (err) {
    console.error(err);
  }
}

const CODE_DB_MOCK = getCodeDBMock();

export { CODE_DB_MOCK };
