import { HexString } from '@polkadot/util/types';

import { rpcService } from 'shared/services/rpcService';
import { RpcMethods } from 'shared/config';
import { IMeta } from 'entities/metadata';

const addMetadata = (params: { programId: HexString; name: string; metaHex: HexString }) =>
  rpcService.callRPC(RpcMethods.AddMetadata, params);

const fetchMetadata = (programId: string) => rpcService.callRPC<IMeta>(RpcMethods.GetMetadata, { id: programId });

export { addMetadata, fetchMetadata };
