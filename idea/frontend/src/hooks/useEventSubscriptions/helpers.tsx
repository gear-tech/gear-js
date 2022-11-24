import { generatePath } from 'react-router-dom';
import { Hex, UserMessageSent, Transfer, encodeAddress } from '@gear-js/api';
import { AlertContainerFactory } from '@gear-js/react-hooks';

import { absoluteRoutes } from 'shared/config';
import { CustomLink } from 'shared/ui/customLink';

const messageSentEventsHandler = (event: UserMessageSent, address: Hex, alert: AlertContainerFactory) => {
  const { message, method, section } = event.data;
  const { payload, destination, details, id } = message;

  if (destination.toHex() !== address) {
    return;
  }

  const messageId = id.toHex();
  const alertOptions = { title: `${section}.${method}` };

  const isError = details.isSome && details.unwrap().isReply && !details.unwrap().asReply.statusCode.eq(0);

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

const transferEventsHandler = (event: Transfer, address: Hex, alert: AlertContainerFactory) => {
  const { from, to, amount, method, section } = event.data;

  if (to.toHex() !== address) {
    return;
  }

  const message = `TRANSFER BALANCE\n FROM:${encodeAddress(from.toHex())}\n VALUE:${amount.toString()}`;

  alert.info(message, { title: `${section}.${method}` });
};

export { messageSentEventsHandler, transferEventsHandler };
