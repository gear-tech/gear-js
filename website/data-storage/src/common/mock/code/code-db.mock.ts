import { Code } from '../../../database/entities';
import { CODE_STATUS } from '@gear-js/common';

const code_1 = new Code();
code_1.id = '0x7350';
code_1.genesis = '0x7350';
code_1.status = CODE_STATUS.ACTIVE;
code_1.name = 'code_1';
code_1.blockHash = 'code_1';
code_1.timestamp = new Date();

const code_2 = new Code();
code_2.id = '0x7351';
code_2.genesis = '0x7351';
code_2.status = CODE_STATUS.INACTIVE;
code_2.name = 'code_2';
code_2.blockHash = 'code_2';
code_2.timestamp = new Date();

const code_3 = new Code();
code_3.id = '0x7353';
code_3.genesis = '0x7353';
code_3.status = CODE_STATUS.INACTIVE;
code_3.name = 'code_3';
code_3.blockHash = 'code_3';
code_3.timestamp = new Date();

const CODE_DB_MOCK = [code_1, code_2, code_3];

export { CODE_DB_MOCK };
