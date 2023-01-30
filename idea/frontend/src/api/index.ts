import { NodeSection } from 'entities/node';
import { DEFAULT_NODES_URL } from 'shared/config';

import { fetchCode, fetchCodes } from './code';
import { fetchProgram, fetchPrograms } from './program';
import { fetchTestBalance } from './balance';
import { fetchMessage, fetchMessages } from './message';
import { fetchMetadata, fetchCodeMetadata, addMetadata } from './metadata';
import { getLocalProgram, getLocalPrograms, getLocalProgramMeta, PROGRAMS_LOCAL_FORAGE } from './LocalDB';
import { addState, fetchStates, fetchState } from './state';

const getNodes = (): Promise<NodeSection[]> => fetch(DEFAULT_NODES_URL).then((result) => result.json());

export {
  getNodes,
  fetchProgram,
  getLocalProgram,
  fetchPrograms,
  getLocalPrograms,
  addMetadata,
  fetchMetadata,
  fetchCodeMetadata,
  getLocalProgramMeta,
  addState,
  fetchStates,
  fetchState,
  fetchCode as getCode,
  fetchCodes as getCodes,
  fetchMessage as getMessage,
  fetchMessages as getMessages,
  addMetadata as uploadMetadata,
  fetchTestBalance as getTestBalance,
  PROGRAMS_LOCAL_FORAGE,
};
