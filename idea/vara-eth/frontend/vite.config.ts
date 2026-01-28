import { viteConfigs } from '@gear-js/frontend-configs';
import { mergeConfig } from 'vite';

export default mergeConfig(viteConfigs.app, {
  css: { preprocessorOptions: { scss: { additionalData: '@use "@/shared/utils/styles/_breakpoints" as *;' } } },
});
