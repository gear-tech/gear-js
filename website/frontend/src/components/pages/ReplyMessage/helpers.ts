import { GearApi, Metadata } from '@gear-js/api';
import { web3FromSource } from '@polkadot/extension-dapp';
import {
  sendMessageSuccessAction,
  sendMessageStartAction,
  sendMessageFailedAction,
  AddAlert,
} from 'store/actions/actions';
import { EventTypes } from 'types/alerts';
import { UserAccount } from 'types/account';
import { ReplyType } from 'components/pages/ReplyMessage/children/MessageForm/types';
import { PROGRAM_ERRORS } from 'consts';

export const ReplyMessage = async (
  api: GearApi,
  account: UserAccount,
  message: ReplyType,
  dispatch: any,
  callback: () => void,
  meta?: Metadata
) => {
  const injector = await web3FromSource(account.meta.source);

  try {
    const reply = {
      toId: message.messageId,
      payload: message.payload,
      gasLimit: message.gasLimit,
      value: message.value,
    };

    await api.reply.submitReply(reply, meta);
    await api.reply.signAndSend(account.address, { signer: injector.signer }, (data: any) => {
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
    });
  } catch (error) {}
};
