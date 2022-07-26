import { load } from 'js-yaml';
import { readFileSync } from 'fs';

import { Meta } from '../../../database/entities';

function getMetadataDBMock(): Meta[] {
  const pathCollectionMetadata = '/collection-metadata.mock.yaml';
  let result: Meta[] = [];

  (async function (){
    try {
      const collectionMessages = load(readFileSync(__dirname + pathCollectionMetadata, 'utf8'));
      const keys = Object.keys(collectionMessages);

      for (const key of keys) {
        result = collectionMessages[key];
      }
    } catch (err) {
      console.error(err);
    }
  })();

  return result;
}

const METADATA_DB_MOCK = getMetadataDBMock();

export { METADATA_DB_MOCK };
