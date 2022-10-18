import { readFileSync } from 'fs';
import { load } from 'js-yaml';

import { Block } from '../../../src/database/entities';

function getBlocksDBMock(): Block[] {
  const pathBlocks = '/block.mock.yaml';
  try {
    const blocks = load(readFileSync(__dirname + pathBlocks, 'utf8')) as Block[];
    return  blocks.map((block) => ({ ...block, timestamp: new Date() }));
  } catch (err) {
    console.error(err);
  }
}

const BLOCK_DB_MOCK = getBlocksDBMock();

export { BLOCK_DB_MOCK };
