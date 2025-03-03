import { AppKitNetwork } from '@reown/appkit/networks';
import * as allNetworks from '@reown/appkit/networks';
import { createAppKit } from '@reown/appkit/react';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { PropsWithChildren } from 'react';
import { WagmiProvider, http } from 'wagmi';

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
  transports: { [ETH_CHAIN_ID]: http(ETH_NODE_ADDRESS) },
});

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
  },
  enableWalletConnect: false,
  enableWalletGuide: false,

  allWallets: 'HIDE',
  themeMode: 'dark',
  themeVariables: {
    '--w3m-font-family': '"Roboto Mono", monospace',
    '--w3m-border-radius-master': '0px',
    '--w3m-font-size-master': '12px',
    '--w3m-accent': '#ffffff',
    '--w3m-color-mix': '#a8f593',
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
