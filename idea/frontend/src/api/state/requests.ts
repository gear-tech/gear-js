import { Hex } from '@gear-js/api';

import { IMeta } from 'entities/metadata';
import { IState } from 'pages/state/model';
import { RpcMethods } from 'shared/config';
import { rpcService } from 'shared/services/rpcService';

const addState = (params: { programId: Hex; wasmBuffBase64: string; name: string }) =>
  rpcService.callRPC<IMeta>(RpcMethods.AddState, params);

const fetchStates = (programId: string) =>
  rpcService.callRPC<{ states: IState[]; count: number }>(RpcMethods.GetStates, { programId });

export { addState, fetchStates };
