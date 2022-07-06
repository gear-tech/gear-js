import { generatePath } from 'react-router-dom';
import { Hex, UserMessageSent, Transfer, GearKeyring } from '@gear-js/api';
import { AlertContainerFactory } from '@gear-js/react-hooks';

import { routes } from 'routes';
import { RPC_METHODS } from 'consts';
import { isDevChain, getLocalProgramMeta } from 'helpers';
import { GetMetaResponse } from 'types/api';
import ServerRPCRequestService from 'services/ServerRPCRequestService';
import { CustomLink } from 'components/common/CustomLink';

export const messageSentEventsHandler = async (event: UserMessageSent, address: Hex, alert: AlertContainerFactory) => {
  const { message, method, section } = event.data;
  const { source, destination, reply, id } = message;

  if (destination.toHex() !== address) {
    return;
  }

  const alertOptions = { title: `${section}.${method}` };

  try {
    const messageId = id.toHex();
    const programId = source.toHex();

    const apiRequest = new ServerRPCRequestService();

    if (isDevChain()) {
      await getLocalProgramMeta(programId);
    } else {
      await apiRequest.callRPC<GetMetaResponse>(RPC_METHODS.GET_METADATA, { programId });
    }

    const isSuccess = (reply.isSome && reply.unwrap()[1].toNumber() === 0) || reply.isNone;

    const showAlert = isSuccess ? alert.success : alert.error;

    showAlert(
      <p>
        ID: <CustomLink to={generatePath(routes.message, { id: messageId })} text={messageId} />
      </p>,
      alertOptions
    );
  } catch (error) {
    alert.error((error as Error).message, alertOptions);
  }
};

export const transferEventsHandler = (event: Transfer, address: Hex, alert: AlertContainerFactory) => {
  const { from, to, amount, method, section } = event.data;

  if (to.toHex() !== address) {
    return;
  }

  const message = `TRANSFER BALANCE\n FROM:${GearKeyring.encodeAddress(from.toHex())}\n VALUE:${amount.toString()}`;

  alert.info(message, { title: `${section}.${method}` });
};
