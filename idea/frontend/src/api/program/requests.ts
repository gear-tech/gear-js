import { HexString } from '@polkadot/util/types';

import { RpcMethods } from '@/shared/config';
import { rpcService } from '@/shared/services/rpcService';

const addProgramName = (id: HexString, name: string) => rpcService.callRPC(RpcMethods.AddProgramName, { id, name });

export { addProgramName };
