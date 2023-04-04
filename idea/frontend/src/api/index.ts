import { NodeSection } from 'entities/node';
import { DEFAULT_NODES_URL } from 'shared/config';

import { fetchCode, fetchCodes, addCodeName } from './code';
import { fetchProgram, fetchPrograms, addProgramName } from './program';
import { fetchTestBalance } from './balance';
import { fetchMessage, fetchMessages } from './message';
import { fetchMetadata, fetchCodeMetadata, addMetadata, addCodeMetadata } from './metadata';
import { getLocalProgram, getLocalPrograms, getLocalProgramMeta, PROGRAMS_LOCAL_FORAGE } from './LocalDB';
import { addState, fetchStates, fetchState } from './state';

const getNodes = (): Promise<NodeSection[]> => fetch(DEFAULT_NODES_URL).then((result) => result.json());

export {
  getNodes,
  fetchProgram,
  addProgramName,
  getLocalProgram,
  fetchPrograms,
  getLocalPrograms,
  addMetadata,
  addCodeMetadata,
  addCodeName,
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
  fetchTestBalance as getTestBalance,
  PROGRAMS_LOCAL_FORAGE,
};
