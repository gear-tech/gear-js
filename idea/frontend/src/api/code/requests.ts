import { HexString } from '@polkadot/util/types';

import { RpcMethods } from '@/shared/config';
import { rpcService } from '@/shared/services/rpcService';

const addCodeName = (id: HexString, name: string) => rpcService.callRPC(RpcMethods.AddCodeName, { id, name });

export { addCodeName };
