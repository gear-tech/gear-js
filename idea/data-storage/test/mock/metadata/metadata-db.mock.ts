import { load } from 'js-yaml';
import { readFileSync } from 'fs';

import { Meta, Code } from '../../../src/database/entities';

const code = new Code();
code.id = '0x001';

function getMetadataDBMock(): Meta[] {
  const pathCollectionMetadata = '/collection-metadata.mock.yaml';
  try {
    const listMeta = load(readFileSync(__dirname + pathCollectionMetadata, 'utf8')) as Meta[];

    return listMeta.map(meta => ({ ...meta, codes: [code] }));
  } catch (err) {
    console.error(err);
  }
}

const METADATA_DB_MOCK = getMetadataDBMock();

export { METADATA_DB_MOCK };
