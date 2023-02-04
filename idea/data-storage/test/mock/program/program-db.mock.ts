import { load } from 'js-yaml';
import { readFileSync } from 'fs';

import { Program } from '../../../src/database/entities';
import { METADATA_DB_MOCK } from '../metadata/metadata-db.mock';
import { CODE_DB_MOCK } from '../code/code-db.mock';

const metadata = METADATA_DB_MOCK[0];
const code = CODE_DB_MOCK[0];

function getProgramDBMock(): Program[] {
  const pathPrograms = '/programs.mock.yaml';
  try {
    const programs = load(readFileSync(__dirname + pathPrograms, 'utf8')) as Program[];
    return programs.map((program) => ({ ...program, meta: metadata, code }));
  } catch (err) {
    console.error(err);
  }
}

const PROGRAM_DB_MOCK = getProgramDBMock();

export { PROGRAM_DB_MOCK };
