import { Dispatch } from 'react';
import { GearApi, Metadata } from '@gear-js/api';
import { ISubmittableResult } from '@polkadot/types/types';
import { web3FromSource } from '@polkadot/extension-dapp';
import {
  sendMessageSuccessAction,
  sendMessageStartAction,
  sendMessageFailedAction,
  AddAlert,
} from 'store/actions/actions';
import { EventTypes } from 'types/alerts';
import { SendMessage } from './children/MessageForm/types';
import { UserAccount } from 'types/account';
import { PROGRAM_ERRORS } from 'consts';

const showStatus = (data: ISubmittableResult, dispatch: Dispatch<any>, callback: () => void) => {
  dispatch(sendMessageStartAction());

  if (data.status.isInBlock) {
    dispatch(
      AddAlert({
        type: EventTypes.SUCCESS,
        message: `Send message: In block`,
      })
    );
  }

  if (data.status.isFinalized) {
    data.events.forEach((event: any) => {
      const { method } = event.event;

      if (method === 'DispatchMessageEnqueued') {
        dispatch(
          AddAlert({
            type: EventTypes.SUCCESS,
            message: `Send message: Finalized`,
          })
        );
        dispatch(sendMessageSuccessAction());
        callback();
      }

      if (method === 'ExtrinsicFailed') {
        dispatch(
          AddAlert({
            type: EventTypes.ERROR,
            message: `Extrinsic Failed`,
          })
        );
      }
    });
  }

  if (data.status.isInvalid) {
    dispatch(sendMessageFailedAction(PROGRAM_ERRORS.INVALID_TRANSACTION));
    dispatch(
      AddAlert({
        type: EventTypes.ERROR,
        message: PROGRAM_ERRORS.INVALID_TRANSACTION,
      })
    );
  }
};

const showError = (error: any, dispatch: Dispatch<any>) => {
  dispatch(AddAlert({ type: EventTypes.ERROR, message: `Send message: ${error}` }));
  dispatch(sendMessageFailedAction(`${error}`));
};

export const sendMessageToProgram = async (
  api: GearApi,
  account: UserAccount,
  message: SendMessage,
  dispatch: Dispatch<any>,
  callback: () => void,
  meta?: Metadata
) => {
  const injector = await web3FromSource(account.meta.source);
  const sendData = {
    destination: message.addressId,
    gasLimit: message.gasLimit,
    value: message.value,
    payload: message.payload,
  };

  try {
    await api.message.submit(sendData, meta);
    await api.message.signAndSend(account.address, { signer: injector.signer }, (data) =>
      showStatus(data, dispatch, callback)
    );
  } catch (error) {
    showError(error, dispatch);
  }
};

export const replyMessageToProgram = async (
  api: GearApi,
  account: UserAccount,
  message: SendMessage,
  dispatch: Dispatch<any>,
  callback: () => void,
  meta?: Metadata
) => {
  const injector = await web3FromSource(account.meta.source);
  const replyData = {
    toId: message.addressId,
    gasLimit: message.gasLimit,
    value: message.value,
    payload: message.payload,
  };

  try {
    await api.reply.submitReply(replyData, meta);
    await api.reply.signAndSend(account.address, { signer: injector.signer }, (data) =>
      showStatus(data, dispatch, callback)
    );
  } catch (error) {
    showError(error, dispatch);
  }
};
