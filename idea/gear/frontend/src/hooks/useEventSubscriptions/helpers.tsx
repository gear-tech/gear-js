import { UserMessageSent, Transfer, encodeAddress } from '@gear-js/api';
import { AlertContainerFactory } from '@gear-js/react-hooks';
import { HexString } from '@polkadot/util/types';
import { generatePath } from 'react-router-dom';

import { routes } from '@/shared/config';
import { getReplyErrorReason } from '@/shared/helpers';
import { CustomLink } from '@/shared/ui/customLink';

const messageSentEventsHandler = (
  event: UserMessageSent,
  address: HexString,
  alert: AlertContainerFactory,
  specVersion: number,
) => {
  const { message, method, section } = event.data;
  const { payload, destination, details, id } = message;

  if (destination.toHex() !== address) {
    return;
  }

  const messageId = id.toHex();
  const alertOptions = { title: `${section}.${method}` };

  const code = details.unwrap().code;
  const isError = details.isSome && !code.isSuccess;

  // eslint-disable-next-line @typescript-eslint/unbound-method -- TODO(#1800): resolve eslint comments
  const showAlert = isError ? alert.error : alert.success;

  showAlert(
    <>
      <p>
        ID: <CustomLink to={generatePath(routes.message, { messageId })} text={messageId} />
      </p>
      {isError && <p>{getReplyErrorReason(code.toU8a(), specVersion, payload.toHuman() as string)}</p>}
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
