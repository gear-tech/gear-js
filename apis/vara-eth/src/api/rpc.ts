export const VARA_ETH_RPC_METHODS = {
  injected: {
    sendTransaction: 'injected_sendTransaction',
    sendTransactionAndWatch: {
      subscribe: 'injected_sendTransactionAndWatch',
      unsubscribe: 'injected_sendTransactionAndWatchUnsubscribe',
    },
  },
} as const;
