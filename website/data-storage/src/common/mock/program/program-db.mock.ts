import { Meta, Program } from '../../../database/entities';

const metadata = new Meta();

const program_1 = new Program();
program_1.id = '0x7350';
program_1.genesis = '0x7350';
program_1.name = 'program_1';
program_1.title = 'program_1';
program_1.meta = metadata;
program_1.owner = 'program_1';

const program_2 = new Program();
program_2.id = '0x7351';
program_2.genesis = '0x7351';
program_2.name = 'program_2';
program_2.title = 'program_2';
program_2.meta = metadata;
program_2.owner = 'program_2';

const program_3 = new Program();
program_3.id = '0x7352';
program_3.genesis = '0x7352';
program_3.name = 'program_3';
program_3.title = 'program_3';
program_3.meta = metadata;
program_3.owner = 'program_3';

const PROGRAM_DB_MOCK = [program_1, program_2, program_3];

export { PROGRAM_DB_MOCK };
