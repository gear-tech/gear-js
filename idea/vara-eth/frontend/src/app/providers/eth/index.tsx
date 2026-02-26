import { AppKitNetwork } from '@reown/appkit/networks';
import * as allNetworks from '@reown/appkit/networks';
import { createAppKit } from '@reown/appkit/react';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { PropsWithChildren } from 'react';
import { WagmiProvider, webSocket } from 'wagmi';

import { ETH_CHAIN_ID, ETH_NODE_ADDRESS, PROJECT_ID } from '@/shared/config';

const metadata = {
  name: 'Web3Modal',
  description: 'Web3Modal',
  url: 'https://vara.network/', // origin must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/37784886'],
};

const getNetwork = (id: number) => {
  const result = Object.values(allNetworks).find((network) => 'id' in network && network.id === Number(id));

  if (!result) throw new Error(`Chain with id ${id} not found`);

  return result as allNetworks.AppKitNetwork;
};

const networks = [getNetwork(ETH_CHAIN_ID)] as [AppKitNetwork, ...AppKitNetwork[]];

const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId: PROJECT_ID,
  transports: { [ETH_CHAIN_ID]: webSocket(ETH_NODE_ADDRESS) },
});

const METAMASK_WALLET_ID = 'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96';
const COINBASE_WALLET_ID = 'fd20dc426fb37566d803205b19bbc1d4096b248ac04548e3cfb6b3a38bd033aa';
const TRUST_WALLET_ID = '4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0';

createAppKit({
  adapters: [wagmiAdapter],
  networks,
  metadata: metadata,
  projectId: PROJECT_ID,
  features: {
    socials: false,
    onramp: false,
    email: false,
    swaps: false,
    send: false,
    analytics: false,
    history: false,
    receive: false,
  },
  enableWalletGuide: false,
  allWallets: 'HIDE',
  excludeWalletIds: [TRUST_WALLET_ID],
  includeWalletIds: [METAMASK_WALLET_ID, COINBASE_WALLET_ID],
  themeMode: 'dark',
  themeVariables: {
    '--apkt-font-family': '"Roboto Mono", monospace',
    '--apkt-font-size-master': '9px',
    '--apkt-border-radius-master': '0',
  },
});

declare module 'wagmi' {
  interface Register {
    config: typeof wagmiAdapter.wagmiConfig;
  }
}

function EthProvider({ children }: PropsWithChildren) {
  return <WagmiProvider config={wagmiAdapter.wagmiConfig}>{children}</WagmiProvider>;
}

export { EthProvider };
