import { HexString } from '@polkadot/util/types';

import { rpcService } from 'shared/services/rpcService';
import { RpcMethods } from 'shared/config';
import { IMeta } from 'entities/metadata';

const addMetadata = (params: { hex: HexString; codeHash: HexString }) =>
  rpcService.callRPC(RpcMethods.AddMetadata, params);

const fetchMetadata = (params: { codeHash: HexString } | { hash: HexString }) =>
  rpcService.callRPC<IMeta>(RpcMethods.GetMetadata, params);

export { addMetadata, fetchMetadata };
