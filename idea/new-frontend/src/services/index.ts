import { isDevChain } from 'shared/helpers';

import { PaginationModel } from './types';
import { CodesRequestService } from './CodesRequestService/CodesRequestService';
import { ProgramRequestService, FetchUserProgramsParams } from './ProgramRequestService';
import { MessagesRequestService } from './MessagesRequestService/MessagesRequestServices';
import { MetadataRequestService, AddMedatataParams } from './MetadataRequestService';
import { getLocalProgram, getLocalPrograms, getLocalProgramMeta } from './LocalDBService';

const codesService = new CodesRequestService();
const programService = new ProgramRequestService();
const messagesService = new MessagesRequestService();
const metadataService = new MetadataRequestService();

const getCode = (codeId: string) => codesService.fetchCode(codeId);

const getCodes = (params: PaginationModel) => codesService.fetchCodes(params);

const getProgram = (id: string) => (isDevChain() ? getLocalProgram(id) : programService.fetchProgram(id));

const getPrograms = (params: PaginationModel) =>
  isDevChain() ? getLocalPrograms(params) : programService.fetchAllPrograms(params);

const getUserPrograms = (params: FetchUserProgramsParams) =>
  isDevChain() ? getLocalPrograms(params) : programService.fetchUserPrograms(params);

const getMessage = (messageId: string) => messagesService.fetchMessage(messageId);

const getMessages = (params: PaginationModel) => messagesService.fetchMessages(params);

const uploadMetadata = (params: AddMedatataParams) => metadataService.addMetadata(params);

const getMetadata = (programId: string) =>
  isDevChain() ? getLocalProgramMeta(programId) : metadataService.fetchMetadata(programId);

export { codesService, programService, messagesService, metadataService };
export {
  getProgram,
  getPrograms,
  getMetadata,
  getUserPrograms,
  getCode,
  getCodes,
  getMessage,
  getMessages,
  uploadMetadata,
};
