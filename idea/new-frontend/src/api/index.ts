import { isDevChain } from 'shared/helpers';

import { PaginationModel } from './types';
import { fetchCode, fetchCodes } from './code';
import { fetchProgram, fetchAllPrograms, fetchUserPrograms, FetchUserProgramsParams } from './program';
import { fetchTestBalance } from './balance';
import { fetchMessage, fetchMessages } from './message';
import { fetchMetadata, addMetadata } from './metadata';
import { getLocalProgram, getLocalPrograms, getLocalProgramMeta } from './LocalDB';

const getProgram = (id: string) => (isDevChain() ? getLocalProgram(id) : fetchProgram(id));

const getPrograms = (params: PaginationModel) => (isDevChain() ? getLocalPrograms(params) : fetchAllPrograms(params));

const getUserPrograms = (params: FetchUserProgramsParams) =>
  isDevChain() ? getLocalPrograms(params) : fetchUserPrograms(params);

const getMetadata = (programId: string) => (isDevChain() ? getLocalProgramMeta(programId) : fetchMetadata(programId));

export {
  getProgram,
  getPrograms,
  getMetadata,
  getUserPrograms,
  fetchCode as getCode,
  fetchCodes as getCodes,
  fetchMessage as getMessage,
  fetchMessages as getMessages,
  addMetadata as uploadMetadata,
  fetchTestBalance as getTestBalance,
};
