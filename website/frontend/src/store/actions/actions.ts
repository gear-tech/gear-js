import UserRequestService from 'services/UserRequestService';

import { UserActionTypes, UserKeypairModel, UserKeypairRPCModel, UserModel, UserProfileRPCModel } from 'types/user';
import {
  NotificationActionTypes,
  NotificationPaginationModel,
  NotificationRPCModel,
  NotificationUnreadRPCModel,
  RecentNotificationModel,
} from 'types/notification';
import {
  ProgramActionTypes,
  ProgramModel,
  ProgramPaginationModel,
  ProgramRPCModel,
  ProgramsPagintaionModel,
} from 'types/program';
import GitRequestService from 'services/GitRequestService';
import TelegramRequestService from 'services/TelegramRequestService';
import ProgramRequestService from 'services/ProgramsRequestService';
import NotificationsRequestService from 'services/NotificationsRequestService';

import { GEAR_MNEMONIC_KEY, GEAR_STORAGE_KEY } from 'consts';
import { BlockActionTypes, BlockModel } from 'types/block';
import { PaginationModel, UserPrograms } from 'types/common';
import { nodeApi } from '../../api/initApi';
import { AlertModel, EventTypes } from '../../types/events';
import { AlertActionTypes } from '../reducers/AlertReducer';

const fetchTokenAction = () => ({ type: UserActionTypes.FETCH_TOKEN });
const fetchTokenSuccessAction = (payload: {}) => ({ type: UserActionTypes.FETCH_TOKEN_SUCCESS, payload });
const fetchTokenErrorAction = () => ({ type: UserActionTypes.FETCH_TOKEN_ERROR });

const fetchUserAction = () => ({ type: UserActionTypes.FETCH_USER });
const fetchUserSuccessAction = (payload: UserModel) => ({ type: UserActionTypes.FETCH_USER_SUCCESS, payload });
const fetchUserErrorAction = () => ({ type: UserActionTypes.FETCH_USER_ERROR });

const fetchUserKeypairAction = () => ({ type: UserActionTypes.FETCH_USER_KEYPAIR });
const fetchUserKeypairSuccessAction = (payload: UserKeypairModel) => ({
  type: UserActionTypes.FETCH_USER_KEYPAIR_SUCCESS,
  payload,
});
const fetchUserKeypairErrorAction = () => ({ type: UserActionTypes.FETCH_USER_KEYPAIR_ERROR });

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
const fetchProgramErrorAction = () => ({ type: ProgramActionTypes.FETCH_PROGRAM_ERROR });

export const transferBalanceSuccessAction = () => ({ type: UserActionTypes.TRANSFER_BALANCE });
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

const fetchNotificationsCountAction = () => ({ type: NotificationActionTypes.FETCH_NOTIFICATIONS_COUNT });
const fetchNotificationsCountSuccessAction = (payload: number) => ({
  type: NotificationActionTypes.FETCH_NOTIFICATIONS_COUNT_SUCCESS,
  payload,
});
const fetchNotificationsCountErrorAction = () => ({ type: NotificationActionTypes.FETCH_NOTIFICATIONS_COUNT_ERROR });

const fetchNotificationsAction = () => ({ type: NotificationActionTypes.FETCH_NOTIFICATIONS });
const fetchNotificationsSuccessAction = (payload: NotificationPaginationModel) => ({
  type: NotificationActionTypes.FETCH_NOTIFICATIONS_SUCCESS,
  payload,
});
const fetchNotificationsErrorAction = () => ({ type: NotificationActionTypes.FETCH_NOTIFICATIONS_ERROR });

export const fetchRecentNotificationSuccessAction = (payload: RecentNotificationModel) => ({
  type: NotificationActionTypes.FETCH_RECENT_NOTIFICATION,
  payload,
});

export const markRecentNotificationsAsReadAction = (payload: string) => ({
  type: NotificationActionTypes.MARK_AS_READ_RECENT,
  payload,
});
export const markAllRecentNotificationsAsReadAction = () => ({ type: NotificationActionTypes.MARK_AS_READ_ALL_RECENT });
export const markCertainRecentNotificationsAsReadAction = (payload: string[]) => ({
  type: NotificationActionTypes.MARK_AS_READ_CERTAIN_RECENT,
  payload,
});

export const fetchGasAction = (payload: number) => ({ type: ProgramActionTypes.FETCH_GAS, payload });
export const resetGasAction = () => ({ type: ProgramActionTypes.RESET_GAS });

const resetUserAction = () => ({ type: UserActionTypes.RESET_USER });
const resetProgramsAction = () => ({ type: ProgramActionTypes.RESET_PROGRAMS });
const resetNotificationsAction = () => ({ type: NotificationActionTypes.RESET_NOTIFICATIONS });

export const resetBlocksAction = () => ({ type: BlockActionTypes.RESET_BLOCKS });

const gitService = new GitRequestService();
const telegramService = new TelegramRequestService();
const userService = new UserRequestService();
const programService = new ProgramRequestService();
const notificationService = new NotificationsRequestService();

export const generateKeypairAction = () => (dispatch: any) => {
  dispatch(fetchUserKeypairAction());
  userService
    .generateKeypair()
    .then((result: UserKeypairRPCModel) => {
      window.localStorage.setItem(GEAR_MNEMONIC_KEY, JSON.stringify(result.result));
      dispatch(fetchUserKeypairSuccessAction(result.result));
    })
    .catch(() => dispatch(fetchUserKeypairErrorAction()));
};

export const getGitUserJwtAction = (code: string) => (dispatch: any) => {
  dispatch(fetchTokenAction());
  gitService
    .authWithGit(code)
    .then((result: any) => {
      window.localStorage.setItem(GEAR_STORAGE_KEY, result.result.access_token);
      dispatch(fetchTokenSuccessAction(result));
    })
    .catch(() => dispatch(fetchTokenErrorAction()));
};

export const getTelegramUserJwtAction = (user: any) => (dispatch: any) => {
  dispatch(fetchTokenAction());
  telegramService
    .authWithTelegram(user)
    .then((result: any) => {
      window.localStorage.setItem(GEAR_STORAGE_KEY, result.result.access_token);
      dispatch(fetchTokenSuccessAction(result));
      if (result.result.access_token) {
        window.location.reload();
      }
    })
    .catch(() => dispatch(fetchTokenErrorAction()));
};

export const getTestUserJwtAction = (userId: string) => (dispatch: any) => {
  dispatch(fetchTokenAction());
  userService
    .authWithTest(userId)
    .then((result: any) => {
      window.localStorage.setItem(GEAR_STORAGE_KEY, result.result.access_token);
      dispatch(fetchTokenSuccessAction(result));
      if (result.result.access_token) {
        window.location.reload();
      }
    })
    .catch(() => dispatch(fetchTokenErrorAction()));
};

export const getUserDataAction = () => (dispatch: any) => {
  dispatch(fetchUserAction());
  userService
    .fetchUserData()
    .then((result: UserProfileRPCModel) => {
      dispatch(fetchUserSuccessAction(result.result));
    })
    .catch(() => dispatch(fetchUserErrorAction()));
};

export const getUserProgramsAction = (params: UserPrograms) => (dispatch: any) => {
  dispatch(fetchUserProgramsAction());
  programService
    .fetchUserPrograms(params)
    .then((result: ProgramsPagintaionModel) => {
      dispatch(fetchUserProgramsSuccessAction(result.result));
    })
    .catch(() => dispatch(fetchUserProgramsErrorAction()));
};

export const getAllProgramsAction = (params: PaginationModel) => (dispatch: any) => {
  dispatch(fetchUserProgramsAction());
  programService
    .fetchAllPrograms(params)
    .then((result: ProgramsPagintaionModel) => {
      dispatch(fetchAllProgramsSuccessAction(result.result));
    })
    .catch(() => dispatch(fetchUserProgramsErrorAction()));
};

export const getProgramAction = (hash: string) => (dispatch: any) => {
  dispatch(fetchProgramAction());
  programService
    .fetchProgram(hash)
    .then((result: ProgramRPCModel) => {
      dispatch(fetchProgramSuccessAction(result.result));
    })
    .catch(() => dispatch(fetchProgramErrorAction()));
};

export const handleProgramError = (error: string) => (dispatch: any, getState: any) => {
  const { programs } = getState();
  if (programs.isProgramUploading) {
    dispatch(programUploadFailedAction(error));
  } else if (programs.isMessageSending) {
    console.log('hehsash');
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

export const getNotificationsAction = (params: PaginationModel) => (dispatch: any) => {
  dispatch(fetchNotificationsAction());
  notificationService
    .fetchAllNotifications(params)
    .then((result: NotificationRPCModel) => {
      dispatch(fetchNotificationsSuccessAction(result.result));
    })
    .catch(() => dispatch(fetchNotificationsErrorAction()));
};

export const getUnreadNotificationsCount = () => (dispatch: any) => {
  dispatch(fetchNotificationsCountAction());
  notificationService
    .fetchUnreadNotificationsCount()
    .then((result: NotificationUnreadRPCModel) => {
      dispatch(fetchNotificationsCountSuccessAction(result.result));
    })
    .catch(() => dispatch(fetchNotificationsCountErrorAction()));
};

export const AddAlert = (payload: AlertModel) => ({
  type: AlertActionTypes.ADD_ALERT,
  payload,
});

export const subscribeToEvents = () => (dispatch: any) => {
  const filterKey = localStorage.getItem('public_key_raw');
  nodeApi.subscribeProgramEvents(({ data, method }) => {
    // @ts-ignore
    data.forEach((item: MessageInfo) => {
      if (item.origin.toHex() === filterKey) {
        dispatch(
          AddAlert({
            type: method === 'initFailure' ? EventTypes.ERROR : EventTypes.SUCCESS,
            message: item.programId.toHex(),
          })
        );
      }
    });
  });

  nodeApi.subscribeLogEvents(({ data }) => {
    // @ts-ignore
    data.forEach((eventData: LogData) => {
      if (eventData.dest.toHex() === filterKey) {
        dispatch(
          AddAlert({
            type: eventData.reply.unwrap()[1].toNumber() === 0 ? EventTypes.SUCCESS : EventTypes.ERROR,
            message: `Log from program: ${eventData.source.toHex()}`, // TODO: add payload parsing
          })
        );
      }
    });
  });

  nodeApi.subscribeTransferEvents(({ data }) => {
    if (data[1].toHex() === filterKey) {
      dispatch(
        AddAlert({
          type: EventTypes.INFO,
          message: `Transfer:\n
          from: ${data[0].toHex()}\n
          value: ${+data[2].toString()}`,
        })
      );
    }
  });
};

export const logoutFromAccountAction = () => (dispatch: any) => {
  localStorage.clear();
  dispatch(resetUserAction());
  dispatch(resetProgramsAction());
  dispatch(resetNotificationsAction());
  dispatch(resetProgramPayloadTypeAction());
  dispatch(resetGasAction());
};
