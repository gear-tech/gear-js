import { viteConfigs } from '@gear-js/frontend-configs';
import { resolve } from 'path';
import { mergeConfig } from 'vite';

export default mergeConfig(viteConfigs.app, {
  resolve: {
    alias: { '@gear-js/sails-payload-form': resolve(__dirname, '../../../utils/sails-payload-form/src/index.ts') },
  },
});
