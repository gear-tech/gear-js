import { Meta } from '../../../database/entities';

const metadata_1 = new Meta();
metadata_1.id = '0x7350';
metadata_1.owner = 'metadata_1';
metadata_1.metaFile = 'metadata_1';
metadata_1.meta = 'metadata_1';
metadata_1.program = 'metadata_1';

const metadata_2 = new Meta();
metadata_2.id = '0x7351';
metadata_2.owner = 'metadata_2';
metadata_2.metaFile = 'metadata_2';
metadata_2.meta = 'metadata_2';
metadata_2.program = 'metadata_2';

const METADATA_DB_MOCK = [metadata_1, metadata_2];

export { METADATA_DB_MOCK };
