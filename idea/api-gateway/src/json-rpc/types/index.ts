import { IRpcResponse } from '@gear-js/common';

type RpcResponse = Pick<IRpcResponse, 'result' | 'error'>;

export { RpcResponse };
