import { generatePath } from 'react-router-dom';
import { UserMessageSent, Transfer, encodeAddress } from '@gear-js/api';
import { AlertContainerFactory } from '@gear-js/react-hooks';
import { HexString } from '@polkadot/util/types';

import { absoluteRoutes } from '@/shared/config';
import { CustomLink } from '@/shared/ui/customLink';

const messageSentEventsHandler = (event: UserMessageSent, address: HexString, alert: AlertContainerFactory) => {
  const { message, method, section } = event.data;
  const { payload, destination, details, id } = message;

  if (destination.toHex() !== address) {
    return;
  }

  const messageId = id.toHex();
  const alertOptions = { title: `${section}.${method}` };

  const isError = details.isSome && !details.unwrap().code.isSuccess;

  const showAlert = isError ? alert.error : alert.success;

  showAlert(
    <>
      <p>
        ID: <CustomLink to={generatePath(absoluteRoutes.message, { messageId })} text={messageId} />
      </p>
      {isError && <p>{payload.toHuman() as string}</p>}
    </>,
    alertOptions,
  );
};

const transferEventsHandler = (event: Transfer, address: HexString, alert: AlertContainerFactory) => {
  const { from, to, amount, method, section } = event.data;

  if (to.toHex() !== address) {
    return;
  }

  const message = `TRANSFER BALANCE\n FROM:${encodeAddress(from.toHex())}\n VALUE:${amount.toString()}`;

  alert.info(message, { title: `${section}.${method}` });
};

export { messageSentEventsHandler, transferEventsHandler };
