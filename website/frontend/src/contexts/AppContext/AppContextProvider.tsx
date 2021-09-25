import React, { FC, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { AppContext } from './AppContext';
import { SocketService } from '../../services/SocketService';
import { rpc } from '../../globals';

type Props = {
  children: React.ReactNode;
};

export const AppContextProvider: FC<Props> = ({ children }) => {
  const dispatch = useDispatch();
  const socketService = useRef(new SocketService(dispatch));
  const rpcBroker = useRef(rpc);
  socketService.current.getTotalIssuance();
  socketService.current.subscribeEvents();

  return (
    <AppContext.Provider
      value={{
        rpcBroker: rpcBroker.current,
        socketService: socketService.current,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
