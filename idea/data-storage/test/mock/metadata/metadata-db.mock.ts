import { load } from 'js-yaml';
import { readFileSync } from 'fs';

import { Meta } from '../../../src/database/entities';

function getMetadataDBMock(): Meta[] {
  const pathCollectionMetadata = '/collection-metadata.mock.yaml';
  let result: Meta[] = [];

  try {
    result = load(readFileSync(__dirname + pathCollectionMetadata, 'utf8')) as Meta[];
  } catch (err) {
    console.error(err);
  }

  return result;
}

const METADATA_DB_MOCK = getMetadataDBMock();

export { METADATA_DB_MOCK };
