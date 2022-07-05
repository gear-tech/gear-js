import { MessageModel } from 'types/message';

export const MESSAGE_ID = '0x50cd74016d3843185caf3a7c25e065557bafc69e3d64868a9f2204342bdbf550';

export const MESSAGE: MessageModel = {
  id: MESSAGE_ID,
  timestamp: '2022-06-22T13:49:53.005Z',
  destination: '0xd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d',
  source: '0xb64bff9471d276407b54185dfd76280f34b834f02f4bf5f2b4e1f3f6c14331f2',
  payload:
    '0x81010000000000000000000000000000000000000000000000000000000000000000d43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d0000000000000000000000000000000000000000000000000000000000000000',
  replyError: '0',
};
