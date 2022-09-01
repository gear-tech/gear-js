import { isDevChain } from 'shared/helpers';

import { fetchCode, fetchCodes } from './code';
import { fetchProgram, fetchPrograms, FetchProgramsParams } from './program';
import { fetchTestBalance } from './balance';
import { fetchMessage, fetchMessages } from './message';
import { fetchMetadata, addMetadata } from './metadata';
import { getLocalProgram, getLocalPrograms, getLocalProgramMeta } from './LocalDB';

const getProgram = (id: string) => (isDevChain() ? getLocalProgram(id) : fetchProgram(id));

const getPrograms = (params: FetchProgramsParams) => (isDevChain() ? getLocalPrograms(params) : fetchPrograms(params));

const getMetadata = (programId: string) => (isDevChain() ? getLocalProgramMeta(programId) : fetchMetadata(programId));

export {
  getProgram,
  getPrograms,
  getMetadata,
  fetchCode as getCode,
  fetchCodes as getCodes,
  fetchMessage as getMessage,
  fetchMessages as getMessages,
  addMetadata as uploadMetadata,
  fetchTestBalance as getTestBalance,
};
