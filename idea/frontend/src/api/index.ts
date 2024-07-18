import { NodeSection } from '@/entities/node';
import { NODES_API_URL } from '@/shared/config';

import { addCodeName } from './code';
import { addProgramName } from './program';
import { fetchTestBalance } from './balance';
import { fetchMessage, fetchMessages } from './message';
import { fetchMetadata, addMetadata } from './metadata';
import { addState, fetchStates, fetchState } from './state';
import { PaginationParameters, PaginationResponse } from './types';
import { INFINITE_QUERY } from './consts';

const getNodes = () => fetch(NODES_API_URL).then((result) => result.json() as unknown as NodeSection[]);

export {
  INFINITE_QUERY,
  getNodes,
  addProgramName,
  addMetadata,
  addCodeName,
  fetchMetadata,
  addState,
  fetchStates,
  fetchState,
  fetchMessage as getMessage,
  fetchMessages as getMessages,
  fetchTestBalance as getTestBalance,
};

export type { PaginationParameters, PaginationResponse };
