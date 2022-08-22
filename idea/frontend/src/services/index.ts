import { codesService } from './CodesRequestService';
import { programService } from './ProgramsRequestService';
import { messagesService } from './MessagesRequestServices';
import { getLocalProgram, getLocalPrograms, getLocalProgramMeta } from './LocalDBService';

import { isDevChain } from 'helpers';
import { PaginationModel, UserPrograms } from 'types/common';

const { fetchCode, fetchCodes } = codesService;
const { fetchMessage, fetchMessages } = messagesService;
const { fetchAllPrograms, fetchUserPrograms, fetchProgram, fetchMeta } = programService;

export const getPrograms = (params: PaginationModel) =>
  isDevChain() ? getLocalPrograms(params) : fetchAllPrograms(params);

export const getUserPrograms = (params: UserPrograms) =>
  isDevChain() ? getLocalPrograms(params) : fetchUserPrograms(params);

export const getProgram = (id: string) => (isDevChain() ? getLocalProgram(id) : fetchProgram(id));

export const getMetadata = (programId: string) =>
  isDevChain() ? getLocalProgramMeta(programId) : fetchMeta(programId);

export { fetchMessage as getMessage, fetchMessages as getMessages, fetchCode as getCode, fetchCodes as getCodes };
