import { HexString } from '@polkadot/util/types';

import { IState } from '@/pages/state/model';
import { RpcMethods } from '@/shared/config';
import { rpcService } from '@/shared/services/rpcService';

const addState = (params: { programId: HexString; wasmBuffBase64: string; name: string }) =>
  rpcService.callRPC<{ state: IState }>(RpcMethods.AddState, params);

const fetchStates = (programId: string, query?: string) =>
  rpcService.callRPC<{ states: IState[]; count: number }>(RpcMethods.GetStates, { programId, query });

const fetchState = (id: string) => rpcService.callRPC<IState & { wasmBuffBase64: string }>(RpcMethods.GetState, { id });

export { addState, fetchStates, fetchState };
