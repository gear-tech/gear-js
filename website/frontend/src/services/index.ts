import { PaginationModel, UserPrograms } from 'types/common';
import { getLocalProgram, getLocalPrograms, getLocalProgramMeta, isDevChain } from 'helpers';
import { programService } from './ProgramsRequestService';
import { messagesService } from './MessagesRequestServices';

const { fetchAllPrograms, fetchUserPrograms, fetchProgram, fetchMeta } = programService;
const { fetchMessages, fetchMessage } = messagesService;

export const getPrograms = (params: PaginationModel) =>
  isDevChain() ? getLocalPrograms(params) : fetchAllPrograms(params);

export const getUserPrograms = (params: UserPrograms) =>
  isDevChain() ? getLocalPrograms(params) : fetchUserPrograms(params);

export const getProgram = (id: string) => (isDevChain() ? getLocalProgram(id) : fetchProgram(id));

export const getMetadata = (programId: string) => (isDevChain() ? getLocalProgramMeta(programId) : fetchMeta(programId));

export const getMessages = (params: PaginationModel) => fetchMessages(params);
export const getMessage = (id: string) => fetchMessage(id);
