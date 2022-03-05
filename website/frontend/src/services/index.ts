import { getLocalProgram, isDevChain } from 'helpers';
import { programService } from './ProgramsRequestService';
import { messagesService } from './MessagesRequestServices';
import { PaginationModel } from 'types/common';

export const getProgram = (id: string) => (isDevChain() ? getLocalProgram(id) : programService.fetchProgram(id));
export const getMessages = (params: PaginationModel) => messagesService.fetchMessages(params);
