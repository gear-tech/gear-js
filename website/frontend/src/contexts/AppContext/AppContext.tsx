import React from 'react';
import { RPCHandler } from '../../utils/RPCHandler';
import { SocketService } from '../../services/SocketService';

interface IAppContext {
  rpcBroker: RPCHandler | null;
  socketService: SocketService | null;
}

export const appContextDefaults = {
  rpcBroker: null,
  socketService: null,
};

export const AppContext = React.createContext<IAppContext>(appContextDefaults);
