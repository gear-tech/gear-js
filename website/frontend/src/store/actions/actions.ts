import { CreateType, GearKeyring } from '@gear-js/api';
import { MessageActionTypes, MessagePaginationModel, MessageModel } from 'types/message';
import { ProgramActionTypes, ProgramModel, ProgramPaginationModel } from 'types/program';
import { UserAccount, AccountActionTypes } from 'types/account';
import { ApiActionTypes } from 'types/api';
import MessageRequestService from 'services/MessagesRequestServices';
import { programService } from 'services/ProgramsRequestService';
import ServerRPCRequestService from 'services/ServerRPCRequestService';
import { RPC_METHODS, LOCAL_STORAGE } from 'consts';
import { CompilerActionTypes } from 'types/compiler';
import { BlockActionTypes, BlockModel } from 'types/block';
import { PaginationModel, UserPrograms } from 'types/common';
import { getLocalPrograms, getLocalProgram, getLocalProgramMeta, isDevChain } from 'helpers';
import { nodeApi } from '../../api/initApi';
import { AlertModel, EventTypes, AlertActionTypes } from 'types/alerts';

const fetchMessagesAction = () => ({ type: MessageActionTypes.FETCH_MESSAGES });

const fetchMessagesSuccessAction = (payload: MessagePaginationModel) => ({
  type: MessageActionTypes.FETCH_MESSAGES_SUCCESS,
  payload,
});

const fetchMessagesErrorAction = () => ({
  type: MessageActionTypes.FETCH_MESSAGES_ERROR,
});

const fetchMessageAction = () => ({ type: MessageActionTypes.FETCH_MESSAGE });

const fetchMessageSuccessAction = (payload: MessageModel) => ({
  type: MessageActionTypes.FETCH_MESSAGE_SUCCESS,
  payload,
});

const fetchMessageErrorAction = () => ({ type: MessageActionTypes.FETCH_MESSAGE_ERROR });

export const resetMessageAction = () => ({ type: MessageActionTypes.RESET_MESSAGE });

const fetchUserProgramsAction = () => ({ type: ProgramActionTypes.FETCH_USER_PROGRAMS });
const fetchUserProgramsSuccessAction = (payload: ProgramPaginationModel) => ({
  type: ProgramActionTypes.FETCH_USER_PROGRAMS_SUCCESS,
  payload,
});
const fetchAllProgramsSuccessAction = (payload: ProgramPaginationModel) => ({
  type: ProgramActionTypes.FETCH_ALL_PROGRAMS_SUCCESS,
  payload,
});
const fetchUserProgramsErrorAction = () => ({ type: ProgramActionTypes.FETCH_USER_PROGRAMS_ERROR });

const fetchProgramAction = () => ({ type: ProgramActionTypes.FETCH_PROGRAM });
const fetchProgramSuccessAction = (payload: ProgramModel) => ({
  type: ProgramActionTypes.FETCH_PROGRAM_SUCCESS,
  payload,
});
export const resetProgramAction = () => ({ type: ProgramActionTypes.RESET_PROGRAM });

const fetchProgramErrorAction = () => ({ type: ProgramActionTypes.FETCH_PROGRAM_ERROR });

export const fetchTotalIssuanceAction = (payload: {}) => ({ type: BlockActionTypes.FETCH_TOTALISSUANCE, payload });
export const fetchBlockAction = (payload: BlockModel) => ({ type: BlockActionTypes.FETCH_BLOCK, payload });

export const programUploadStartAction = () => ({ type: ProgramActionTypes.PROGRAM_UPLOAD_START });
export const programUploadResetAction = () => ({ type: ProgramActionTypes.PROGRAM_UPLOAD_RESET });
export const programUploadSuccessAction = () => ({ type: ProgramActionTypes.PROGRAM_UPLOAD_SUCCESS });
export const programUploadFailedAction = (payload: string) => ({
  type: ProgramActionTypes.PROGRAM_UPLOAD_FAILED,
  payload,
});

export const fetchProgramPayloadTypeAction = (payload: string) => ({
  type: ProgramActionTypes.FETCH_PROGRAM_PAYLOAD_TYPE,
  payload,
});
export const resetProgramPayloadTypeAction = () => ({ type: ProgramActionTypes.RESET_PROGRAM_PAYLOAD_TYPE });

export const sendMessageStartAction = () => ({ type: ProgramActionTypes.SEND_MESSAGE_START });
export const sendMessageResetAction = () => ({ type: ProgramActionTypes.SEND_MESSAGE_RESET });
export const sendMessageSuccessAction = () => ({ type: ProgramActionTypes.SEND_MESSAGE_SUCCESS });
export const sendMessageFailedAction = (payload: string) => ({ type: ProgramActionTypes.SEND_MESSAGE_FAILED, payload });

export const uploadMetaStartAction = () => ({ type: ProgramActionTypes.META_UPLOAD_START });
export const uploadMetaResetAction = () => ({ type: ProgramActionTypes.META_UPLOAD_RESET });
const uploadMetaSuccessAction = () => ({ type: ProgramActionTypes.META_UPLOAD_SUCCESS });
const uploadMetaFailedAction = (payload: string) => ({ type: ProgramActionTypes.META_UPLOAD_FAILED, payload });

export const programStatusAction = (payload: string) => ({ type: ProgramActionTypes.PROGRAM_STATUS, payload });

export const fetchGasAction = (payload: number) => ({ type: ProgramActionTypes.FETCH_GAS, payload });
export const resetGasAction = () => ({ type: ProgramActionTypes.RESET_GAS });

export const resetBlocksAction = () => ({ type: BlockActionTypes.RESET_BLOCKS });

export const setApiReady = () => ({ type: ApiActionTypes.SET_API });
export const resetApiReady = () => ({ type: ApiActionTypes.RESET_API });

export const setCurrentAccount = (payload: UserAccount) => ({ type: AccountActionTypes.SET_ACCOUNT, payload });
export const resetCurrentAccount = () => ({ type: AccountActionTypes.RESET_ACCOUNT });

const messageService = new MessageRequestService();

export const getMessagesAction = (params: PaginationModel) => (dispatch: any) => {
  dispatch(fetchMessagesAction());
  messageService
    .fetchMessages(params)
    .then((data) => {
      dispatch(fetchMessagesSuccessAction(data.result));
    })
    .catch(() => dispatch(fetchMessagesErrorAction()));
};

export const getMessageAction = (id: string) => (dispatch: any) => {
  dispatch(fetchMessageAction());
  messageService
    .fetchMessage(id)
    .then((data) => {
      dispatch(fetchMessageSuccessAction(data.result));
    })
    .catch(() => dispatch(fetchMessageErrorAction()));
};

export const getUserProgramsAction = (params: UserPrograms) => (dispatch: any) => {
  const getPrograms = isDevChain() ? getLocalPrograms : programService.fetchUserPrograms;

  dispatch(fetchUserProgramsAction());
  getPrograms(params)
    .then((data) => {
      dispatch(fetchUserProgramsSuccessAction(data.result));
    })
    .catch(() => dispatch(fetchUserProgramsErrorAction()));
};

export const getAllProgramsAction = (params: PaginationModel) => (dispatch: any) => {
  const getPrograms = isDevChain() ? getLocalPrograms : programService.fetchAllPrograms;

  dispatch(fetchUserProgramsAction());
  getPrograms(params)
    .then((data) => {
      dispatch(fetchAllProgramsSuccessAction(data.result));
    })
    .catch(() => dispatch(fetchUserProgramsErrorAction()));
};

export const getProgramAction = (id: string) => (dispatch: any) => {
  const getProgram = isDevChain() ? getLocalProgram : programService.fetchProgram;

  dispatch(fetchProgramAction());
  getProgram(id)
    .then((data) => {
      dispatch(fetchProgramSuccessAction(data.result));
    })
    .catch(() => dispatch(fetchProgramErrorAction()));
};

export const handleProgramError = (error: string) => (dispatch: any, getState: any) => {
  const { programs } = getState();
  if (programs.isProgramUploading) {
    dispatch(programUploadFailedAction(error));
  } else if (programs.isMessageSending) {
    dispatch(sendMessageFailedAction(error));
  } else if (programs.isMetaUploading) {
    dispatch(uploadMetaFailedAction(error));
  }
};

export const handleProgramSuccess = () => (dispatch: any, getState: any) => {
  const { programs } = getState();
  if (programs.isProgramUploading) {
    dispatch(programUploadSuccessAction());
  } else if (programs.isMessageSending) {
    dispatch(sendMessageSuccessAction());
  } else if (programs.isMetaUploading) {
    dispatch(uploadMetaSuccessAction());
  }
};

export const AddAlert = (payload: AlertModel) => ({
  type: AlertActionTypes.ADD_ALERT,
  payload,
});

export const subscribeToEvents = () => (dispatch: any) => {
  const filterKey = localStorage.getItem(LOCAL_STORAGE.PUBLIC_KEY_RAW);
  nodeApi.subscribeToProgramEvents(({ method, data: { info, reason } }) => {
    // @ts-ignore
    if (info.origin.toHex() === filterKey) {
      dispatch(
        AddAlert({
          type: reason ? EventTypes.ERROR : EventTypes.SUCCESS,
          message: `${method}\n
          ${info.programId.toHex()}`,
        })
      );
    }
  });

  nodeApi.subscribeToLogEvents(async ({ data: { source, dest, reply, payload } }) => {
    let meta = null;
    let decodedPayload: any;
    const programId = source.toHex();
    const apiRequest = new ServerRPCRequestService();

    const { result } = isDevChain()
      ? await getLocalProgramMeta(programId)
      : await apiRequest.getResource(RPC_METHODS.GET_METADATA, { programId });

    if (result && result.meta) {
      meta = JSON.parse(result.meta);
    } else {
      dispatch(AddAlert({ type: EventTypes.ERROR, message: 'Metadata is not added' }));
    }

    try {
      decodedPayload =
        meta.output && !(reply.isSome && reply.unwrap()[1].toNumber() !== 0)
          ? CreateType.decode(meta.output, payload, meta).toHuman()
          : payload.toHuman();
    } catch (error) {
      console.error('Decode payload failed');
    }
    // @ts-ignore
    if (dest.toHex() === filterKey) {
      dispatch(
        AddAlert({
          type:
            (reply.isSome && reply.unwrap()[1].toNumber() === 0) || reply.isNone
              ? EventTypes.SUCCESS
              : EventTypes.ERROR,
          message: `LOG from program\n
          ${source.toHex()}\n
          ${decodedPayload ? `Response: ${decodedPayload}` : ''}
          `, // TODO: add payload parsing
        })
      );
    }
  });

  nodeApi.subscribeToTransferEvents(({ data: { from, to, value } }) => {
    if (to.toHex() === filterKey) {
      dispatch(
        AddAlert({
          type: EventTypes.INFO,
          message: `TRANSFER BALANCE\n
            FROM:${GearKeyring.encodeAddress(from.toHex())}\n
            VALUE:${value.toString()}`,
        })
      );
    }
  });
};

export const setIsBuildDone = (payload: boolean) => ({
  type: CompilerActionTypes.SET_IS_BUILD_DONE,
  payload,
});
