import { NodeSection } from 'entities/node';
import { DEFAULT_NODES_URL } from 'shared/config';
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

const getNodes = (): Promise<NodeSection[]> => fetch(DEFAULT_NODES_URL).then((result) => result.json());

export {
  getNodes,
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
