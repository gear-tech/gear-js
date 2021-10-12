import React, { FC, useRef } from 'react';
import { AppContext } from './AppContext';
import { SocketService } from '../../services/SocketService';

type Props = {
  children: React.ReactNode;
};

export const AppContextProvider: FC<Props> = ({ children }) => {
  const socketService = useRef(new SocketService());

  return (
    <AppContext.Provider
      value={{
        socketService: socketService.current,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
