import { NodeSection } from '@/entities/node';
import { NODES_API_URL } from '@/shared/config';
import { fetchCode, fetchCodes, addCodeName } from './code';
import { fetchProgram, fetchPrograms, addProgramName } from './program';
import { fetchTestBalance } from './balance';
import { fetchMessage, fetchMessages } from './message';
import { fetchMetadata, addMetadata } from './metadata';
import {
  getLocalProgram,
  getLocalMetadata,
  uploadLocalProgram,
  addLocalProgramName,
  uploadLocalMetadata,
  PROGRAMS_LOCAL_FORAGE,
} from './LocalDB';
import { addState, fetchStates, fetchState } from './state';

const getNodes = () => fetch(NODES_API_URL).then((result) => result.json() as unknown as NodeSection[]);

export {
  getNodes,
  fetchProgram,
  addProgramName,
  fetchPrograms,
  addMetadata,
  addCodeName,
  fetchMetadata,
  getLocalProgram,
  getLocalMetadata,
  uploadLocalProgram,
  addLocalProgramName,
  uploadLocalMetadata,
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
