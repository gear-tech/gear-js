import { viteConfigs } from '@gear-js/frontend-configs';
import { mergeConfig } from 'vite';

const faucetProxyTarget = process.env.VITE_FAUCET_PROXY_TARGET;

export default faucetProxyTarget
  ? mergeConfig(viteConfigs.app, {
      server: {
        proxy: {
          '/api/v1': {
            target: faucetProxyTarget,
            changeOrigin: true,
          },
        },
      },
    })
  : viteConfigs.app;
