import { isU8a, u8aToString } from '@polkadot/util';

export class GetBlockError extends Error {
  name = 'GetBlockError';

  constructor(message: string, hash?: string | Uint8Array) {
    super();
    const splittedMessage = message.split(':');
    if (isU8a(hash)) {
      hash = u8aToString(hash);
    }
    const errorCode = splittedMessage.length > 0 ? parseInt(splittedMessage[0]) : NaN;
    switch (errorCode) {
      case -32603:
        this.message = `State already discarded for block ${hash}`;
        break;
      default:
        this.message = 'Unknow error occurred';
        break;
    }
  }
}
