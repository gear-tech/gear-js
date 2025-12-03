import { EthereumClient } from '@vara-eth/api';
import { createContext } from 'react';
import { type WebSocketTransport } from 'viem';

type EthereumClientContextValue = {
  ethereumClient: EthereumClient<WebSocketTransport> | null;
  isReady: boolean;
};

const initialValue: EthereumClientContextValue = {
  ethereumClient: null,
  isReady: false,
};

export const EthereumClientContext = createContext<EthereumClientContextValue>(initialValue);
