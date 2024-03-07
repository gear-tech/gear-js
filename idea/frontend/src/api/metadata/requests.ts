import { HexString } from '@polkadot/util/types';

import { rpcService } from '@/shared/services/rpcService';
import { RpcMethods } from '@/shared/config';
import { IMeta } from '@/entities/metadata';

const addMetadata = (hash: HexString) => rpcService.callRPC(RpcMethods.AddMetadata, { hash });
const fetchMetadata = (hash: HexString) => rpcService.callRPC<IMeta>(RpcMethods.GetMetadata, { hash });

export { addMetadata, fetchMetadata };
