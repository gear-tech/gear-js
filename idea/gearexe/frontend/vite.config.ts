import { viteConfigs } from '@gear-js/frontend-configs';

export default {
  ...viteConfigs.app,
  optimizeDeps: {
    exclude: ['kzg-wasm'],
  },
};
