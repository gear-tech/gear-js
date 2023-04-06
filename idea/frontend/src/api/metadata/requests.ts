import { HexString } from '@polkadot/util/types';

import { rpcService } from 'shared/services/rpcService';
import { RpcMethods } from 'shared/config';
import { IMeta } from 'entities/metadata';

const addMetadata = (params: { id: HexString; metaHex: HexString }) =>
  rpcService.callRPC(RpcMethods.AddMetadata, params);

const addCodeMetadata = (params: { id: HexString; metaHex: HexString }) =>
  rpcService.callRPC(RpcMethods.AddCodeMetadata, params);

const fetchMetadata = (id: string) => rpcService.callRPC<IMeta>(RpcMethods.GetMetadata, { id });

const fetchCodeMetadata = (id: string) => rpcService.callRPC<IMeta>(RpcMethods.GetCodeMetadata, { id });

export { addMetadata, addCodeMetadata, fetchMetadata, fetchCodeMetadata };
