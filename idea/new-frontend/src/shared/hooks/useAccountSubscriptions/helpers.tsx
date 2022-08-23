import { generatePath } from 'react-router-dom';
import { Hex, UserMessageSent, Transfer, GearKeyring } from '@gear-js/api';
import { AlertContainerFactory } from '@gear-js/react-hooks';

import { routes } from 'shared/config';
import { CustomLink } from 'components/common/CustomLink';

const messageSentEventsHandler = (event: UserMessageSent, address: Hex, alert: AlertContainerFactory) => {
  const { message, method, section } = event.data;
  const { payload, destination, reply, id } = message;

  if (destination.toHex() !== address) {
    return;
  }

  const messageId = id.toHex();
  const alertOptions = { title: `${section}.${method}` };

  const isError = reply.isSome && !reply.unwrap().exitCode.eq(0);

  const showAlert = isError ? alert.error : alert.success;

  showAlert(
    <>
      <p>
        ID: <CustomLink to={generatePath(routes.message, { messageId })} text={messageId} />
      </p>
      {isError && <p>{payload.toHuman()}</p>}
    </>,
    alertOptions,
  );
};

const transferEventsHandler = (event: Transfer, address: Hex, alert: AlertContainerFactory) => {
  const { from, to, amount, method, section } = event.data;

  if (to.toHex() !== address) {
    return;
  }

  const message = `TRANSFER BALANCE\n FROM:${GearKeyring.encodeAddress(from.toHex())}\n VALUE:${amount.toString()}`;

  alert.info(message, { title: `${section}.${method}` });
};

export { messageSentEventsHandler, transferEventsHandler };
