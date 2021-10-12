import React from 'react';
import { SocketService } from '../../services/SocketService';

interface IAppContext {
  socketService: SocketService | null;
}

export const appContextDefaults = {
  socketService: null,
};

export const AppContext = React.createContext<IAppContext>(appContextDefaults);
